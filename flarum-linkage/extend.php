<?php

namespace Cathi\FlarumLinkage;

use Flarum\Api\Resource\UserResource;
use Flarum\Extend;

// 手动部署的扩展无 composer PSR-4 autoload，这里显式 require 类文件，
// 使 Flarum 路由分发器（容器 make）能实例化这些控制器。
require_once __DIR__ . '/src/Model/LinkageStat.php';
require_once __DIR__ . '/src/Api/Controller/ListQuestsController.php';
require_once __DIR__ . '/src/Api/Controller/ClaimQuestController.php';
require_once __DIR__ . '/src/Api/UserResourceFields.php';
require_once __DIR__ . '/src/Api/Controller/BuyItemController.php';
require_once __DIR__ . '/src/Api/Controller/EquipItemController.php';

return [
  // ─── 前端资源注册 ───
  (new Extend\Frontend('forum'))
    ->css(__DIR__ . '/less/forum.less')
    ->js(__DIR__ . '/js/dist/forum.js'),

  (new Extend\Frontend('admin'))
    ->js(__DIR__ . '/js/dist/admin.js'),

  // ─── Admin 设置项（联动系统） ───
  // 注意：Flarum 2.0 的 serializeToForum 只接受 (settingKey, valueKey) 两个参数
  // 默认值通过 ->default() 单独设置
  (new Extend\Settings)
    ->serializeToForum('cathi_linkage_enabled', 'cathi-linkage.enabled')
    ->default('cathi-linkage.enabled', '1')
    ->serializeToForum('cathi_linkage_exp_per_post', 'cathi-linkage.exp_per_post')
    ->default('cathi-linkage.exp_per_post', '10')
    ->serializeToForum('cathi_linkage_coins_per_post', 'cathi-linkage.coins_per_post')
    ->default('cathi-linkage.coins_per_post', '5')
    ->serializeToForum('cathi_linkage_quests_enabled', 'cathi-linkage.quests_enabled')
    ->default('cathi-linkage.quests_enabled', '1')
    ->serializeToForum('cathi_linkage_shop_enabled', 'cathi-linkage.shop_enabled')
    ->default('cathi-linkage.shop_enabled', '1'),

  // ─── 后端 API 路由（Flarum 2.0 PSR-15 控制器）───
  // Extend\Routes('api') 会自动加 /api 前缀：
  //   GET  /api/linkage/quests
  //   POST /api/linkage/claim
  (new Extend\Routes('api'))
    ->get('/linkage/quests', 'cathi-linkage.quests', Api\Controller\ListQuestsController::class)
    ->post('/linkage/claim', 'cathi-linkage.claim', Api\Controller\ClaimQuestController::class)
    ->post('/linkage/shop/buy', 'cathi-linkage.shop.buy', Api\Controller\BuyItemController::class)
    ->post('/linkage/shop/equip', 'cathi-linkage.shop.equip', Api\Controller\EquipItemController::class),

  // ─── 向 User 资源注入联动字段（猫猫币 / 等级 / 经验）───
  (new Extend\ApiResource(UserResource::class))
    ->fields(Api\UserResourceFields::class),
];
