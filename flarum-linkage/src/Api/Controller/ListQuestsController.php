<?php

namespace Cathi\FlarumLinkage\Api\Controller;

use Flarum\Http\RequestUtil;
use Illuminate\Database\ConnectionInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * GET /api/linkage/quests
 * 返回当前登录用户的每日任务进度 + 今日已领取状态。
 *
 * 响应契约（前端 QuestPanel.js 期望）：
 *   { data: { checkin, post, reply, like, checkin_claimed, post_claimed, reply_claimed, like_claimed } }
 *   - checkin/post/reply/like 为进度（bool 或 number，>=1 视为完成）
 *   - *_claimed 为今日是否已领取
 */
class ListQuestsController implements RequestHandlerInterface
{
    protected $db;

    public function __construct(ConnectionInterface $db)
    {
        $this->db = $db;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $userId = $actor->id;
        $today = date('Y-m-d');

        // 注意：Illuminate\Database\ConnectionInterface::table() 会自动加表前缀，
        // 因此普通查询用裸表名即可（框架会拼成 catcg_bbsxxx）。
        // 但原生 CREATE TABLE SQL 不会自动加前缀，ensureClaimTable 内手动拼 $pre。

        // 幂等确保每日领取日志表存在（GET 先于 POST 被调用，必须自建表）
        $this->ensureClaimTable($this->db->getTablePrefix());

        // 任务进度
        $user = $this->db->table('users')->where('id', $userId)->first();
        $discussionCount = $user ? (int) $user->discussion_count : 0;
        $commentCount = $user ? (int) $user->comment_count : 0;
        $likeCount = (int) $this->db->table('post_likes')->where('user_id', $userId)->count();

        // 签到：已登录即视为今日已签到（每日通过 claimed 日志限制一次）
        $checkin = true;

        // 今日已领取的任务
        $claimed = [];
        $rows = $this->db->table('cathi_linkage_daily_claims')
            ->where('user_id', $userId)
            ->where('claim_date', $today)
            ->get();
        foreach ($rows as $r) {
            $claimed[$r->quest_key] = true;
        }

        $data = [
            'checkin'        => (bool) $checkin,
            'post'           => $discussionCount,
            'reply'          => $commentCount,
            'like'           => $likeCount,
            'checkin_claimed' => !empty($claimed['checkin']),
            'post_claimed'    => !empty($claimed['post']),
            'reply_claimed'   => !empty($claimed['reply']),
            'like_claimed'    => !empty($claimed['like']),
        ];

        return new JsonResponse(['data' => $data], 200);
    }

    /**
     * 确保每日领取日志表存在（手动部署扩展无 migration 机制，此处幂等建表）。
     * 原生 SQL 不自动加前缀，故表名需手动拼前缀。
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
}
