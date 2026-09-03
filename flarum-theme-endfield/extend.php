<?php

namespace Cathi\FlarumThemeEndfield;

use Flarum\Extend;
use Flarum\Frontend\Document;

return [
    // 终末地主题：独立 CSS 文件 + 动态注入 link 标签
    // （cathi-linkage 同样方案：JS 动态注入避免被 forum.css 合并覆盖）
    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            // 暗色模式桥接：Flarum 2.0 用 .dark 类 / 系统 prefers-color-scheme，
            // 主题原生响应 data-theme="dark"，这里提前同步，避免闪烁。
            $document->head[] = '<script>(function(){var h=document.documentElement;if(h.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches)h.setAttribute("data-theme","dark");})();</script>';
            $document->head[] = '<link rel="stylesheet" href="/assets/endfield.css?v=22">';
            // Flarum 原生变量桥：在 endfield.css 之后注入，覆盖 --primary-color 等漂移（源 src/tokens.css / tokens-bridge.css）
            $document->head[] = '<link rel="stylesheet" href="/assets/endfield-tokens.css?v=2">';
            // 终末地组件桥：在 endfield.css 之后注入，继承 themes/endfield.css 的 contour 科技感背景（源 themes/endfield.css / components-bridge.css）
            $document->head[] = '<link rel="stylesheet" href="/assets/endfield-components.css?v=2">';

            // 动物森友会风格随机默认头像：
            // 当 .Avatar 是 span 且没有 src（即未上传头像的默认占位）时，
            // 按用户名/元素位置哈希随机分配一张动物头像作为背景图。
            $animalAvatars = [
                '/assets/avatars/animal/avatar_01_cat.webp',
                '/assets/avatars/animal/avatar_02_dog.webp',
                '/assets/avatars/animal/avatar_03_rabbit.webp',
                '/assets/avatars/animal/avatar_04_bear.webp',
                '/assets/avatars/animal/avatar_05_fox.webp',
                '/assets/avatars/animal/avatar_06_panda.webp',
                '/assets/avatars/animal/avatar_07_owl.webp',
                '/assets/avatars/animal/avatar_08_hamster.webp',
                '/assets/avatars/animal/avatar_09_deer.webp',
                '/assets/avatars/animal/avatar_10_wolf.webp',
            ];
            $avatarsJson = json_encode($animalAvatars, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            $document->foot[] = <<<JS
<script>
(function(){
  const avatars = {$avatarsJson};
  function hash(s){
    let h=0;
    for(let i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; }
    return Math.abs(h);
  }
  function pick(seed){ return avatars[hash(String(seed)) % avatars.length]; }
  function setAvatar(el){
    if (el.tagName !== 'SPAN' || el.hasAttribute('src') || el.dataset.cathiAnimalAvatar) return;
    el.dataset.cathiAnimalAvatar = '1';
    let seed = el.getAttribute('aria-label') || el.getAttribute('title') || '';
    if (!seed) {
      const userEl = el.closest('[data-user-id], .PostUser, .DiscussionListItem, .UserCard, .item-lastUser-content')?.querySelector('.username, .UserCard-name, .PostUser-name, .item-username');
      seed = userEl ? userEl.textContent.trim() : '';
    }
    if (!seed) seed = 'guest-' + Array.from(document.querySelectorAll('.Avatar')).indexOf(el);
    el.style.backgroundImage = 'url(' + pick(seed) + ')';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundColor = 'transparent';
    el.style.color = 'transparent';
  }
  function process(){
    document.querySelectorAll('.Avatar').forEach(setAvatar);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', process);
  } else {
    process();
  }
  new MutationObserver(process).observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
</script>
JS;
        }),

];
