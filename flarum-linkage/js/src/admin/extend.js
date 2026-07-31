import Extenders from 'flarum/common/extenders';

// IMPORTANT: `setting` 必须是 settings 表中的真实键名（extend.php 中
// serializeToForum 的第一个参数），否则 admin 保存会写到错误的键。
export default [
  new Extenders.Admin()
    // --- 主开关 ---
    .setting(() => ({
      setting: 'cathi_linkage_enabled',
      type: 'boolean',
      label: '启用联动系统',
      help: '开启后，用户发帖可获得经验和积分，并可使用任务、商城等功能。',
    }))
    // --- 经验模块 ---
    .setting(() => ({
      setting: 'cathi_linkage_exp_per_post',
      type: 'number',
      label: '每帖获得经验',
      min: 0,
      placeholder: '10',
      help: '用户每发布一帖获得的经验值。设为 0 则不获得经验。',
    }))
    // --- 积分模块 ---
    .setting(() => ({
      setting: 'cathi_linkage_coins_per_post',
      type: 'number',
      label: '每帖获得积分',
      min: 0,
      placeholder: '5',
      help: '用户每发布一帖获得的积分。设为 0 则不获得积分。',
    }))
    // --- 任务系统开关 ---
    .setting(() => ({
      setting: 'cathi_linkage_quests_enabled',
      type: 'boolean',
      label: '启用每日任务',
      help: '开启后用户可完成每日任务获取额外奖励。',
    }))
    // --- 商城/装饰系统开关 ---
    .setting(() => ({
      setting: 'cathi_linkage_shop_enabled',
      type: 'boolean',
      label: '启用装饰商城',
      help: '开启后用户可用积分购买装饰品并装备。',
    })),
];
