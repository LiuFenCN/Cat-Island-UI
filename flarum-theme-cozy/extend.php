<?php

namespace Cathi\FlarumThemeCozy;

use Flarum\Extend;

return [
    // 前台样式（猫猫岛 cozy 主题）
    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/less/forum.less'),

    // 后台也套用字体与基础风格，保持一致
    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/less/admin.less'),
];
