<?php

namespace Cathi\FlarumLinkage\Model;

use Flarum\Database\AbstractModel;

/**
 * 联动系统用户统计表（猫猫币 / 经验 / 等级）。
 * 对应表：<prefix>cathi_linkage_stats
 */
class LinkageStat extends AbstractModel
{
    protected $table = 'cathi_linkage_stats';

    protected $primaryKey = 'user_id';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = ['user_id', 'exp', 'level', 'points', 'created_at', 'updated_at'];
}
