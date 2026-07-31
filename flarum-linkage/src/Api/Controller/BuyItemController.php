<?php

declare(strict_types=1);

namespace Cathi\FlarumLinkage\Api\Controller;

use Flarum\Http\RequestUtil;
use Illuminate\Database\ConnectionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * POST /api/linkage/shop/buy
 * Body: { item_id: int }
 *
 * 购买装饰商品：
 * 1. 验证登录
 * 2. 查商品存在性 + 价格
 * 3. 检查余额充足
 * 4. 检查未重复购买（幂等）
 * 5. 扣猫猫币 → 写入 user_decorations
 */
class BuyItemController implements RequestHandlerInterface
{
    protected ConnectionInterface $db;

    public function __construct(ConnectionInterface $db)
    {
        $this->db = $db;
    }

    public function handle(Request $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $body = $request->getParsedBody();
        $itemId = (int) ($body['item_id'] ?? 0);

        if ($itemId <= 0) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => 'item_id 必须为正整数']],
            ], 422);
        }

        // 查商品（裸表名，Eloquent 自动加前缀）
        $item = $this->db->table('cathi_linkage_decorations')
            ->where('id', $itemId)
            ->first();

        if (!$item) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => '商品不存在']],
            ], 404);
        }

        $userId = (int) $actor->id;

        // 检查是否已拥有（幂等：已拥有直接返回成功）
        $owned = $this->db->table('cathi_linkage_user_decorations')
            ->where('user_id', $userId)
            ->where('decoration_id', $itemId)
            ->first();

        if ($owned) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'data' => ['already_owned' => true, 'coins' => $this->getCoins($userId)],
            ], 200);
        }

        // 查余额
        $coins = $this->getCoins($userId);
        $cost = (int) $item->cost;

        if ($coins < $cost) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => "猫猫币不足，需要 {$cost}，当前 {$coins}"]],
            ], 422);
        }

        // 扣款 + 记录（事务）
        $this->db->transaction(function () use ($userId, $cost, $itemId) {
            // 扣猫猫币
            $this->db->table('cathi_linkage_stats')
                ->where('user_id', $userId)
                ->decrement('points', $cost);

            // 写入拥有记录
            $this->db->table('cathi_linkage_user_decorations')->insert([
                'user_id'       => $userId,
                'decoration_id' => $itemId,
                'acquired_at'   => date('Y-m-d H:i:s'),
            ]);
        });

        return new \Laminas\Diactoros\Response\JsonResponse([
            'data' => [
                'bought'   => true,
                'item_id'  => $itemId,
                'item_name'=> $item->name,
                'cost'     => $cost,
                'coins'    => $this->getCoins($userId),
            ],
        ], 200);
    }

    protected function getCoins(int $userId): int
    {
        $row = $this->db->table('cathi_linkage_stats')
            ->where('user_id', $userId)
            ->first();
        return $row ? (int) $row->points : 0;
    }
}
