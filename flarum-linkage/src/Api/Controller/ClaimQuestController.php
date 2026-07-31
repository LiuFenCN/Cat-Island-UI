<?php

namespace Cathi\FlarumLinkage\Api\Controller;

use Flarum\Http\RequestUtil;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * POST /api/linkage/claim
 * 领取每日任务奖励（猫猫币），写入 linkage_stats 并记每日领取日志防止重复领取。
 *
 * 请求体：{ quest_key: 'checkin' | 'post' | 'reply' | 'like' }
 * 奖励（猫猫币，与前端 QuestPanel 一致）：
 *   checkin +10 / post +20 / reply +5 / like +3
 */
class ClaimQuestController implements RequestHandlerInterface
{
    protected $db;

    protected const REWARDS = [
        'checkin' => 10,
        'post'    => 20,
        'reply'   => 5,
        'like'    => 3,
    ];

    public function __construct(ConnectionInterface $db)
    {
        $this->db = $db;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $userId = $actor->id;
        $questKey = (string) Arr::get($request->getParsedBody(), 'quest_key', '');

        if (!isset(self::REWARDS[$questKey])) {
            return new JsonResponse(['errors' => [['detail' => '无效的任务类型']]], 422);
        }

        $pre = $this->db->getTablePrefix();
        $today = date('Y-m-d');
        $now = date('Y-m-d H:i:s');

        // ensureClaimTable 使用原生 CREATE TABLE SQL（不自动加前缀），需传 $pre。
        $this->ensureClaimTable($pre);

        // 校验任务是否完成（防直接 POST 刷币）
        // 注意：普通 ->table() 调用会自动加前缀，故 isComplete 内用裸表名。
        if (!$this->isComplete($questKey, $userId)) {
            return new JsonResponse(['errors' => [['detail' => '任务尚未完成']]], 422);
        }

        // 幂等：今日已领取则直接返回成功
        $already = $this->db->table('cathi_linkage_daily_claims')
            ->where('user_id', $userId)
            ->where('quest_key', $questKey)
            ->where('claim_date', $today)
            ->exists();

        if ($already) {
            return new JsonResponse(
                ['data' => ['claimed' => true, 'quest_key' => $questKey, 'already' => true]],
                200
            );
        }

        $reward = self::REWARDS[$questKey];

        // 发放猫猫币（points）到 linkage_stats
        $exists = $this->db->table('cathi_linkage_stats')->where('user_id', $userId)->exists();
        if ($exists) {
            $this->db->table('cathi_linkage_stats')
                ->where('user_id', $userId)
                ->increment('points', $reward, ['updated_at' => $now]);
        } else {
            $this->db->table('cathi_linkage_stats')->insert([
                'user_id'    => $userId,
                'exp'        => 0,
                'level'      => 1,
                'points'     => $reward,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // 记录每日领取日志（user_id + quest_key + date 唯一）
        $this->db->table('cathi_linkage_daily_claims')->insert([
            'user_id'    => $userId,
            'quest_key'  => $questKey,
            'claim_date' => $today,
            'claimed_at' => $now,
        ]);

        return new JsonResponse(
            ['data' => ['claimed' => true, 'quest_key' => $questKey, 'reward' => $reward]],
            200
        );
    }

    /**
     * 确保每日领取日志表存在（手动部署扩展无 migration 机制，此处幂等建表）。
     */
    protected function ensureClaimTable(string $pre): void
    {
        $table = $pre . 'cathi_linkage_daily_claims';
        $this->db->statement("
            CREATE TABLE IF NOT EXISTS `{$table}` (
                `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                `user_id` INT UNSIGNED NOT NULL,
                `quest_key` VARCHAR(32) NOT NULL,
                `claim_date` DATE NOT NULL,
                `claimed_at` TIMESTAMP NULL DEFAULT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uq_user_quest_date` (`user_id`, `quest_key`, `claim_date`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");
    }

    /**
     * 校验任务完成条件（与前端 isComplete 一致，number >= 1 视为完成）。
     */
    protected function isComplete(string $questKey, int $userId): bool
    {
        if ($questKey === 'checkin') {
            return true;
        }

        $user = $this->db->table('users')->where('id', $userId)->first();

        if ($questKey === 'post') {
            return $user && (int) $user->discussion_count >= 1;
        }
        if ($questKey === 'reply') {
            return $user && (int) $user->comment_count >= 1;
        }
        if ($questKey === 'like') {
            return (int) $this->db->table('post_likes')->where('user_id', $userId)->count() >= 1;
        }

        return false;
    }
}
