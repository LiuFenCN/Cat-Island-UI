<?php

namespace Cathi\FlarumThemeLiquidGlass;

use Flarum\Extend;
use Flarum\Frontend\Document;

return [
    // 液态玻璃主题：独立 CSS 文件 + 暗色模式桥接脚本
    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            $document->head[] = '<script>(function(){var h=document.documentElement;if(h.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches)h.setAttribute("data-theme","dark");})();</script>';
            $document->head[] = '<link rel="stylesheet" href="/assets/liquidglass.css?v=1">';
        }),

    // 后台基础风格
    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/less/admin.less'),
];
