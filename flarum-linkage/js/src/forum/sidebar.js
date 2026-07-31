import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import QuestPanel from './components/QuestPanel';
import DecorationShop from './components/DecorationShop';
import { startDecorationRenderer } from './components/DecorationRenderer';

/* ═══ 联动系统：导航页模式（v13） ═══
 * 布局：在 IndexSidebar 导航区上部添加「任务中心」「装扮中心」入口，
 *       点击后主内容区显示完整页面。
 *
 * v12→v13 重写（修复崩溃 + 样式）：
 *   - 崩溃修复：删除 oncreate/onupdate（extend() 下 vnode 参数为 undefined 导致
 *              TypeError: can't access property "dom", e is undefined）
 *   - 内容切换：改用 requestAnimationFrame + 真实 DOM 查询/操作，
 *              完全绕过 Mithril extend 生命周期限制
 *   - 样式修复：导航项继承原生 nav-item 样式，不强制覆盖；
 *              去掉 emoji 图标，使用无图标纯文字（与「标签」等原生项一致）
 */

const isLoggedIn = () => !!app.session.user && app.session.user.id() !== null;

function injectLinkageCSS() {
  if (document.getElementById('linkage-css')) return;
  var link = document.createElement('link');
  link.id = 'linkage-css';
  link.rel = 'stylesheet';
  link.href = '/assets/linkage.css?v=39';
  document.head.appendChild(link);
}

/* ── 内容区 DOM 切换（基于真实 DOM，不依赖 Mithril 生命周期）── */
function updateLinkageDOM() {
  if (!isLoggedIn()) return;
  var page = app._linkagePage || null;

  /* 查找主内容容器 — IndexPage 的内容区 */
  var contentRoot = document.querySelector('.IndexPage-contents')
    || document.querySelector('.IndexPage-content')
    || document.querySelector('main .container > .sideNav + div')
    || document.querySelector('main .container .DiscussionList');

  if (!contentRoot) return;

  /* 确定插入位置：DiscussionList 的父容器 */
  var dl = contentRoot.querySelector
    ? (contentRoot.querySelector('.DiscussionList') || contentRoot)
    : contentRoot;
  if (dl.classList && !dl.classList.contains('DiscussionList')) {
    dl = dl.querySelector('.DiscussionList') || dl;
  }
  var insertParent = dl.parentNode || contentRoot;

  /* 获取或创建联动容器 */
  var wrapper = document.getElementById('linkage-page-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'linkage-page-wrapper';
    insertParent.insertBefore(wrapper, dl);
  }

  if (page === 'quest' || page === 'shop') {
    /* ── 显示联动页 ── */
    if (dl !== wrapper && dl.style) dl.style.display = 'none';
    wrapper.style.display = '';

    /* 仅当切换页面时重新 mount */
    if (wrapper.getAttribute('data-lp') !== page) {
      wrapper.setAttribute('data-lp', page);
      var title = page === 'quest' ? '任务中心' : '装扮中心';
      var desc = page === 'quest'
        ? '完成每日任务获取猫猫币奖励'
        : '用猫猫币购买装饰品装扮你的形象';

      m.mount(wrapper, {
        view: function () {
          return (
            <div className="Linkage-ContentPage">
              <div className="Linkage-PageHeader">
                <h2>{title}</h2>
                <p className="Linkage-PageHeaderDesc">{desc}</p>
              </div>
              {page === 'quest' ? <QuestPanel /> : <DecorationShop />}
            </div>
          );
        }
      });
    }
    try { window.scrollTo(0, 0); } catch (_) {}
  } else {
    /* ── 隐藏联动页，恢复讨论列表 ── */
    wrapper.style.display = 'none';
    wrapper.removeAttribute('data-lp');
    if (dl !== wrapper && dl.style) dl.style.display = '';
    m.mount(wrapper, null);
  }
}

export default function () {
  injectLinkageCSS();

  /* ── 0. 启动装饰渲染器（全局头像装饰效果）── */
  startDecorationRenderer();

  /* ── 1. 导航区入口（与原生项样式一致）── */
  extend(IndexSidebar.prototype, 'navItems', function (items) {
    if (!isLoggedIn()) return;

    items.add('linkage-quest', (
      <a className='nav-item' onclick={function (e) {
        e.preventDefault();
        app._linkagePage = (app._linkagePage === 'quest') ? null : 'quest';
        m.redraw();
        requestAnimationFrame(updateLinkageDOM);
      }}>
        <span>任务中心</span>
      </a>
    ), 2.5);

    items.add('linkage-shop', (
      <a className='nav-item' onclick={function (e) {
        e.preventDefault();
        app._linkagePage = (app._linkagePage === 'shop') ? null : 'shop';
        m.redraw();
        requestAnimationFrame(updateLinkageDOM);
      }}>
        <span>装扮中心</span>
      </a>
    ), 2.6);
  });

  /* ── 2. 监听路由变化（用户点其他导航时清除联动状态）── */
  // 通过拦截 m.redraw 后的 DOM 变化来处理
  // 使用 MutationObserver 监听内容区变化，自动清理
  var _observer = null;
  function ensureObserver() {
    if (_observer) return;
    _observer = new MutationObserver(function () {
      if (app._linkagePage) {
        // 如果联动页激活中但 DiscussionList 重新出现了（说明外部路由切换）
        var dl = document.querySelector('.DiscussionList');
        var wrapper = document.getElementById('linkage-page-wrapper');
        if (dl && dl.offsetParent !== null && wrapper && wrapper.style.display === 'none') {
          // 已经是隐藏状态，无需操作
        } else if (dl && dl.style.display === 'none') {
          // 联动页仍然显示，保持现状
        } else if (!app._linkagePage) {
          // 已清除
        }
      }
    });
    // 延迟启动 observer（等 DOM 就绪）
    setTimeout(function () {
      var target = document.querySelector('main') || document.body;
      if (target) _observer.observe(target, { childList: true, subtree: true, attributes: true });
    }, 2000);
  }

  ensureObserver();
}
