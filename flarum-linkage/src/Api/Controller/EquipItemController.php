<?php

declare(strict_types=1);

namespace Cathi\FlarumLinkage\Api\Controller;

use Flarum\Http\RequestUtil;
use Illuminate\Database\ConnectionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * POST /api/linkage/shop/equip
 * Body: { item_id: int, type: string }
 *
 * 装备/卸下装饰：
 * 1. 验证登录 + 拥有该装饰
 * 2. 查当前槽位装备状态
 * 3. 同一装饰 → 卸下（删除 equipped 记录）
 * 4. 不同装饰 → 替换（upsert equipped）
 */
class EquipItemController implements RequestHandlerInterface
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
        $slot   = trim($body['type'] ?? '');

        if ($itemId <= 0) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => 'item_id 必须为正整数']],
            ], 422);
        }

        if ($slot === '') {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => 'type 不能为空（avatar_frame / head_accessory / name_card）']],
            ], 422);
        }

        // 验证商品存在
        $item = $this->db->table('cathi_linkage_decorations')
            ->where('id', $itemId)
            ->first();

        if (!$item) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => '商品不存在']],
            ], 404);
        }

        $userId = (int) $actor->id;

        // 验证拥有
        $owned = $this->db->table('cathi_linkage_user_decorations')
            ->where('user_id', $userId)
            ->where('decoration_id', $itemId)
            ->first();

        if (!$owned) {
            return new \Laminas\Diactoros\Response\JsonResponse([
                'errors' => [['detail' => '你还没有这个装饰，请先购买']],
            ], 403);
        }

        // 查当前槽位装备
        $current = $this->db->table('cathi_linkage_user_equipped')
            ->where('user_id', $userId)
            ->where('slot', $slot)
            ->first();

        // 如果已经装备了同一个装饰 → 卸下
        ($current && (int) $current->decoration_id === $itemId)
            ? $this->unequip($userId, $slot)
            : $this->equip($userId, $slot, $itemId);

        // 返回最新装备状态
        $equipped = $this->db->table('cathi_linkage_user_equipped')
            ->where('user_id', $userId)
            ->pluck('decoration_id', 'slot')
            ->mapWithKeys(fn ($v, $k) => [$k => (int) $v])
            ->toArray();

        return new \Laminas\Diactoros\Response\JsonResponse([
            'data' => [
                'equipped' => $equipped,
                'coins'    => $this->getCoins($userId),
            ],
        ], 200);
    }

    protected function equip(int $userId, string $slot, int $itemId): void
    {
        $exists = $this->db->table('cathi_linkage_user_equipped')
            ->where('user_id', $userId)
            ->where('slot', $slot)
            ->exists();

        if ($exists) {
            $this->db->table('cathi_linkage_user_equipped')
                ->where('user_id', $userId)
                ->where('slot', $slot)
                ->update(['decoration_id' => $itemId]);
        } else {
            $this->db->table('cathi_linkage_user_equipped')->insert([
                'user_id'       => $userId,
                'slot'          => $slot,
                'decoration_id' => $itemId,
            ]);
        }
    }

    protected function unequip(int $userId, string $slot): void
    {
        $this->db->table('cathi_linkage_user_equipped')
            ->where('user_id', $userId)
            ->where('slot', $slot)
            ->delete();
    }

    protected function getCoins(int $userId): int
    {
        $row = $this->db->table('cathi_linkage_stats')
            ->where('user_id', $userId)
            ->first();
        return $row ? (int) $row->points : 0;
    }
}
