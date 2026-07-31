<?php

namespace Cathi\FlarumLinkage\Api;

use Cathi\FlarumLinkage\Model\LinkageStat;
use Flarum\Api\Schema;
use Flarum\User\User;

/**
 * 向 Flarum 2.0 User 资源注入联动系统字段：
 *   catcoins  (猫猫币 = linkage_stats.points)
 *   level     (等级)
 *   exp       (经验)
 *   expToNext (升到下一级所需经验，粗略估算)
 *
 * 参考 fof/gamification 的 UserResourceFields 写法（Flarum 2.0 Resource API）。
 */
class UserResourceFields
{
    /** 每个请求内按 user_id 缓存一次查询，避免 N+1 */
    protected static $cache = [];

    public function __invoke(): array
    {
        return [
            Schema\Number::make('catcoins')
                ->get(function (User $user) {
                    return (int) ($this->stat($user)?->points ?? 0);
                }),

            Schema\Number::make('level')
                ->get(function (User $user) {
                    return (int) ($this->stat($user)?->level ?? 1);
                }),

            Schema\Number::make('exp')
                ->get(function (User $user) {
                    return (int) ($this->stat($user)?->exp ?? 0);
                }),

            Schema\Number::make('expToNext')
                ->get(function (User $user) {
                    $lvl = (int) ($this->stat($user)?->level ?? 1);

                    return max(1, $lvl * 100);
                }),

            Schema\Arr::make('ownedDecorations')
                ->get(function (User $user) {
                    return $this->db()
                        ->table('cathi_linkage_user_decorations')
                        ->where('user_id', $user->id)
                        ->pluck('decoration_id')
                        ->map(fn ($v) => (int) $v)
                        ->values()
                        ->all();
                }),

            Schema\Arr::make('equippedDecorations')
                ->get(function (User $user) {
                    return $this->db()
                        ->table('cathi_linkage_user_equipped')
                        ->where('user_id', $user->id)
                        ->pluck('decoration_id', 'slot')
                        ->mapWithKeys(fn ($v, $k) => [$k => (int) $v])
                        ->all();
                }),
        ];
    }

    protected function stat(User $user): ?LinkageStat
    {
        $id = $user->id;

        if (!array_key_exists($id, self::$cache)) {
            self::$cache[$id] = LinkageStat::where('user_id', $id)->first();
        }

        return self::$cache[$id];
    }

    /**
     * Flarum does not set the static facade root in the resource-field context,
     * so the DB facade is unavailable. Borrow the connection from the
     * LinkageStat Eloquent model (resolved via the container) instead.
     */
    protected function db()
    {
        return LinkageStat::resolveConnection();
    }
}
