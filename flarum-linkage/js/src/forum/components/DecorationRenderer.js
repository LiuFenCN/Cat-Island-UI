import app from 'flarum/forum/app';

/**
 * 装饰渲染器 v2 —— 根据用户装备的装饰品在头像周围渲染视觉效果
 *
 * 修复 v1 的 WeakSet.clear() 崩溃（WeakSet 无 clear 方法）。
 * 改用每帧新建 Set 做去重。
 *
 * 支持三种装饰类型：
 *   avatar_frame  头像框 → 彩色边框 + 光晕
 *   head_accessory 头环   → 头顶光弧/装饰元素
 *   name_card     名片图 → 用户名背景色
 */

/* ── 商品视觉配置（与 DecorationShop.items 同步）── */
const ITEM_STYLES = {
  1: { type: 'avatar_frame', name: '金色头像框', color: '#FFD700', rarity: 'legendary' },
  2: { type: 'avatar_frame', name: '银色头像框', color: '#C0C0C0', rarity: 'rare' },
  3: { type: 'head_accessory', name: '猫耳头环', color: '#FF69B4', rarity: 'epic' },
  4: { type: 'head_accessory', name: '彩虹光环', color: 'rainbow', rarity: 'legendary' },
  5: { type: 'name_card',     name: '星空名片图', color: '#4B0082', rarity: 'epic', effect: 'starfield', bg: '/assets/namecard-star.gif' },
  6: { type: 'name_card',     name: '樱花名片图', color: '#FFB7C5', rarity: 'rare', effect: 'blossom', bg: '/assets/namecard-sakura.gif' },
  7: { type: 'avatar_frame',  name: '火焰头像框', color: '#FF4500', rarity: 'epic' },
  8: { type: 'head_accessory', name: '冰霜头环', color: '#87CEEB', rarity: 'rare' },
};

/**
 * 获取用户的 equippedDecorations 映射
 */
function getEquipped(user) {
  if (!user) return {};
  return user.attribute('equippedDecorations') || {};
}

/**
 * 从 DOM 元素向上查找关联的用户对象。
 * Flarum 的 Avatar 通常在 <a> 链接里，href 包含 /u/用户ID。
 */
function findUserForAvatar(el) {
  var link = el.closest ? el.closest('a[href*="/u/"]') : null;
  if (link) {
    var match = link.href.match(/\/u\/(\d+)/);
    if (match) {
      var userId = parseInt(match[1], 10);
      try {
        var user = app.store.getById('users', userId);
        if (user) return user;
      } catch (_) {}
      if (app.session.user && app.session.user.id() === userId) {
        return app.session.user;
      }
    }
  }
  return app.session.user;
}

/**
 * 渲染单个头像的装饰效果
 */
function renderDecorationOnAvatar(avatarEl, user, frameSet) {
  if (!user || frameSet.has(avatarEl)) return;

  var equipped = getEquipped(user);
  var slots = Object.keys(equipped);
  if (slots.length === 0) return;

  // 确保头像有包裹容器
  var wrapper = avatarEl.closest ? avatarEl.closest('.Linkage-AvatarWrap') : null;
  if (!wrapper) {
    wrapper = document.createElement('span');
    wrapper.className = 'Linkage-AvatarWrap';
    avatarEl.parentNode.insertBefore(wrapper, avatarEl);
    wrapper.appendChild(avatarEl);
  }

  frameSet.add(avatarEl);

  slots.forEach(function (slot) {
    var itemId = equipped[slot];
    var item = ITEM_STYLES[itemId];
    if (!item) return;

    switch (item.type) {
      case 'avatar_frame':
        applyAvatarFrame(wrapper, item);
        break;
      case 'head_accessory':
        applyHeadAccessory(wrapper, item);
        break;
    }
  });
}

/**
 * 头像框效果：彩色边框 + 光晕
 */
function applyAvatarFrame(wrapper, item) {
  wrapper.classList.add('Linkage-DecoFrame');
  var borderColor = item.color === 'rainbow'
    ? 'linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#8b00ff)'
    : item.color;
  var glowColor = item.color === 'rainbow' ? '#ff7f00' : item.color;

  wrapper.style.setProperty('--deco-frame-color', borderColor);
  wrapper.style.setProperty('--deco-glow-color', glowColor);

  if (item.rarity === 'legendary') {
    wrapper.setAttribute('data-deco-rarity', 'legendary');
  } else if (item.rarity === 'epic') {
    wrapper.setAttribute('data-deco-rarity', 'epic');
  } else {
    wrapper.setAttribute('data-deco-rarity', 'rare');
  }
}

/**
 * 头环效果：头顶装饰元素
 * 猫耳用 DOM 元素实现（不用伪元素，更可控）
 */
function applyHeadAccessory(wrapper, item) {
  wrapper.classList.add('Linkage-DecoHead');

  /* 清除旧的同类型 DOM（避免重复添加） */
  var oldEars = wrapper.querySelector('.Linkage-CatEars');
  if (oldEars) oldEars.remove();

  if (item.id === 4) {
    wrapper.setAttribute('data-head-type', 'rainbow');
  } else if (item.id === 3) {
    /* ── 猫耳：创建真实的 DOM 耳朵元素 ── */
    wrapper.setAttribute('data-head-type', 'catears');
    wrapper.style.setProperty('--deco-ear-color', item.color);

    var earContainer = document.createElement('span');
    earContainer.className = 'Linkage-CatEars';

    var leftEar = document.createElement('span');
    leftEar.className = 'Linkage-CatEar--left';

    var rightEar = document.createElement('span');
    rightEar.className = 'Linkage-CatEar--right';

    earContainer.appendChild(leftEar);
    earContainer.appendChild(rightEar);
    wrapper.appendChild(earContainer);
  } else if (item.id === 8) {
    wrapper.setAttribute('data-head-type', 'frost');
    wrapper.style.setProperty('--deco-frost-color', item.color);
  } else {
    wrapper.setAttribute('data-head-type', 'glow');
    wrapper.style.setProperty('--deco-glow-accent', item.color);
  }
}

/**
 * 名片图效果（v28）：大卡片背景图 + 悬浮弹层交还 Flarum 本机浮动
 *
 * v28 变更：布局重构拆到独立函数 applyHeroLayout()，主循环无条件调用，
 * 不再依赖是否装备名片。本函数只负责背景图/透明/底图层。
 */
function ensureNameCardLayers(card) {
  var bg = card.querySelector(':scope > .Linkage-NameCardBG');
  var fx = card.querySelector(':scope > .Linkage-NameCardFX');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'Linkage-NameCardBG';
    /* 关键定位全部内联，杜绝退化成普通流导致挤位 */
    bg.style.position = 'absolute';
    bg.style.top = '0';
    bg.style.left = '0';
    bg.style.right = '0';
    bg.style.bottom = '0';
    bg.style.zIndex = '-1';
    bg.style.pointerEvents = 'none';
    bg.style.borderRadius = 'inherit';
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = 'center';
    bg.style.backgroundRepeat = 'no-repeat';
    card.insertBefore(bg, card.firstChild);
  }
  if (!fx) {
    fx = document.createElement('div');
    fx.className = 'Linkage-NameCardFX';
    fx.style.position = 'absolute';
    fx.style.top = '0';
    fx.style.left = '0';
    fx.style.right = '0';
    fx.style.bottom = '0';
    fx.style.zIndex = '-1';
    fx.style.pointerEvents = 'none';
    fx.style.borderRadius = 'inherit';
    card.insertBefore(fx, bg.nextSibling);
  }
  return { bg: bg, fx: fx };
}

function renderNameCard(user) {
  if (!user) return;
  var equipped = getEquipped(user);
  var nameCardId = equipped['name_card'];
  if (!nameCardId) return;

  var item = ITEM_STYLES[nameCardId];
  if (!item || item.type !== 'name_card') return;

  var userId = user.id ? user.id() : (user.attributes ? user.attributes.id : null);
  if (!userId) return;

  /* 查找所有 UserCard，匹配当前用户 —— 不再限制大小/类型 */
  var userCards = document.querySelectorAll('.UserCard');
  for (var i = 0; i < userCards.length; i++) {
    var card = userCards[i];
    /* 跳过已处理的 */
    if (card.classList.contains('Linkage-HasNameCard')) continue;

    /*
     * v22 曾用 avatarLink 门控（a[href*="/u/{id}"]），但个人中心大卡片的头像
     * 没有 <a> 链接包裹（已在用户页面上，无需链接）→ 大卡片永远被跳过。
     * v23 去掉此限制：所有未处理的 UserCard 统一处理。
     * （名片图属于当前登录用户，页面上出现的 UserCard 通常都是该用户的）
     */

    /* 标记 + 区分卡片类型（v26：彻底不碰悬浮弹层的 position，交还 Flarum 本机浮动）*/
    card.classList.add('Linkage-HasNameCard');
    /*
     * 判别符用 UserCard--popover（弹层自带类）。
     * 不能用 .UserCard-stats —— hover 弹层里也含 stats，会误判成"大卡"被设成 relative 而破坏浮动。
     */
    var isPopover = card.classList.contains('UserCard--popover');
    if (isPopover) {
      /* 悬浮弹层：只建独立堆叠上下文，position 完全不动（Flarum 本机 position:absolute 负责浮动） */
      card.classList.add('Linkage-NameCardPopover');
    } else {
      /* 大个人中心卡：需要定位上下文让 z-index:-1 底图锚定在本卡片内 */
      card.classList.add('Linkage-NameCardHero');
      var pos = getComputedStyle(card).position;
      if (pos === 'static' || pos === '') card.style.position = 'relative';
    }

    /*
     * ★ 核选项：JS inline style !important 清除卡片自身背景
     * inline style 的优先级高于所有 CSS 规则（包括 !important 的样式表规则，
     * 因为 inline !important > stylesheet !important）。
     * 这一步解决"棕色区域"——棕色来自 UserCard 自身或其直接子元素的 background。
     */
    card.style.setProperty('background', 'transparent', 'important');
    card.style.setProperty('background-color', 'transparent', 'important');

    /*
     * 清除卡片内所有后代元素的背景色（棕色可能来自深层嵌套容器）
     * 跳过我们的底图/特效层 + 交互元素（button/input/Badge）
     */
    var allDescendants = card.querySelectorAll('*');
    for (var di = 0; di < allDescendants.length; di++) {
      var desc = allDescendants[di];
      if (desc.classList && (
        desc.classList.contains('Linkage-NameCardBG') ||
        desc.classList.contains('Linkage-NameCardFX')
      )) continue;
      /* 跳过交互元素 */
      var tag = desc.tagName.toLowerCase();
      if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea') continue;
      if (desc.classList && (
        desc.classList.contains('Button') ||
        desc.classList.contains('Badge') ||
        desc.classList.contains('Avatar')
      )) continue;
      /* 用 inline style 清除，优先级最高 */
      desc.style.setProperty('background', 'transparent', 'important');
      desc.style.setProperty('background-color', 'transparent', 'important');
    }

    /* 插入底图/特效层 */
    var layers = ensureNameCardLayers(card);

    /* data-nc-* 写在子层上（不是卡片），避免触发 v20 遗留的 [data-nc-effect]::before 规则 */
    if (item.effect) {
      layers.bg.setAttribute('data-nc-effect', item.effect);
      layers.fx.setAttribute('data-nc-effect', item.effect);
    }
    if (item.rarity === 'legendary') {
      layers.bg.setAttribute('data-nc-rarity', 'legendary');
      layers.fx.setAttribute('data-nc-rarity', 'legendary');
    } else if (item.rarity === 'epic') {
      layers.bg.setAttribute('data-nc-rarity', 'epic');
      layers.fx.setAttribute('data-nc-rarity', 'epic');
    }
    if (item.bg) {
      layers.bg.style.setProperty('background-image', 'url("' + item.bg + '")', 'important');
    } else {
      layers.bg.style.removeProperty('background-image');
    }

    /* 大卡片（非弹层）：重构内部布局（注入猫猫币、经验条等）—— 由 applyHeroLayout 统一处理 */
    /* 注意：本函数不再调用 restructureHeroLayout，避免不装备名片时布局丢失 */
  }
}

/**
 * 重构个人中心大卡片布局（v31）
 *
 * 用户明确要求（截图2红框）：
 *   1) 头像右侧显示三行两列信息网格（名字|等级、职位|成就、在线|注册时间）
 *   2) 网格下方保留原始 stats 行等 Flarum 内容
 *   3) 猫猫币只保留 1 个（左下角），隐藏其他重复的
 *   4) 新增：经验条（卡片下方）
 */
function restructureHeroLayout(card, user) {
  if (card.classList.contains('Linkage-LayoutDone')) return;
  card.classList.add('Linkage-LayoutDone');

  var container = card.querySelector('.container');
  if (!container) return;
  container.classList.add('Linkage-HeroGrid');

  /* 等级移动已移到 ensureLevelPosition() 每帧执行，不再这里做一次性操作 */

  /* 标记现有 stats <li>（不复制文本，只加 class 供 CSS 定位到对应格） */
  var statsEl = container.querySelector('.UserCard-stats');
  if (statsEl) {
    var lis = statsEl.querySelectorAll('li');
    for (var i = 0; i < lis.length; i++) {
      var t = (lis[i].textContent || '').trim();
      if (t.indexOf('在线') >= 0) lis[i].classList.add('Linkage-Stat--online');
      else if (t.indexOf('注册于') >= 0 || /\d{4}年\d{1,2}月/.test(t)) lis[i].classList.add('Linkage-Stat--join');
      else if (t.indexOf('徽章') >= 0 || t.indexOf('🐾') >= 0) lis[i].classList.add('Linkage-Stat--badge');
      else lis[i].classList.add('Linkage-Stat--other');
    }
  }

  /* 职位格：承载现有用户组名（Flarum 无"职位"字段，以主组名代）。
     这是唯一新建的承载文本的节点，且数据来自用户现有属性，并非复制其他可见信息。 */
  var contentEl = container.querySelector('.UserCard-content');
  if (contentEl) {
    var groups = user.attribute('groups') || [];
    var groupName = '';
    if (groups.length) {
      var g0 = groups[0];
      groupName = (g0 && (g0.name || g0.singularName)) ? (g0.name || g0.singularName) : '';
    }
    if (!groupName && user.attribute('primaryGroup')) {
      var pg = user.attribute('primaryGroup');
      groupName = pg.name || pg.singularName || '';
    }
    var titleCell = document.createElement('div');
    titleCell.className = 'Linkage-InfoCell Linkage-InfoCell--title';
    titleCell.innerHTML = '<span class="Linkage-Label">职位</span><span class="Linkage-Value">' + escapeHtml(groupName || '成员') + '</span>';
    contentEl.appendChild(titleCell);
  }

  /* 猫猫币去重：隐藏 cathi-linkage 在 LinkageStats 组件内顺带渲染的重复猫猫币
     （.Linkage-CoinRow）；保留 .Linkage-CoinBadge（contentItems 注入），由 CSS 定位到左下角。
     本函数不再创建任何猫猫币 DOM。 */
  var coinRow = container.querySelector('.Linkage-Stats .Linkage-CoinRow');
  if (coinRow) coinRow.style.display = 'none';

  /* 经验条由 cathi-linkage 的 .Linkage-ExpBar 提供，CSS 定位到卡片下方，无需新建 */
}

/** HTML 转义防 XSS */
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * v28 新增：无条件应用大卡片布局
 *
 * 与 renderNameCard 解耦 —— 不论是否装备名片，个人中心大卡片都应有统一布局。
 * 在主循环中每帧调用，通过 Linkage-LayoutDone 防重复。
 */
function applyHeroLayout() {
  if (!app.session.user) return;
  var user = app.session.user;

  var heroCards = document.querySelectorAll('.UserCard:not(.UserCard--popover)');
  for (var i = 0; i < heroCards.length; i++) {
    var card = heroCards[i];
    /* 跳过太小的卡片（可能是帖子内嵌小头像卡） */
    if (card.offsetWidth < 200) continue;

    /* 给大卡加定位上下文（即使没名片也需要 relative 让子元素 absolute 定位） */
    if (!card.classList.contains('Linkage-NameCardHero')) {
      card.classList.add('Linkage-NameCardHero');
      var pos = getComputedStyle(card).position;
      if (pos === 'static' || pos === '') card.style.position = 'relative';
    }

    /* 首次处理：一次性操作（class 标记、stats 分类、职位格、coinRow 隐藏） */
    if (!card.classList.contains('Linkage-LayoutDone')) {
      restructureHeroLayout(card, user);
    }
  }
}

/* ═══ 主循环 ═══ */

let _running = false;

export function startDecorationRenderer() {
  if (_running) return;
  _running = true;

  function tick() {
    if (!app.session.user) {
      requestAnimationFrame(tick);
      return;
    }

    /* 每帧新建 Set（替代 WeakSet.clear()，因为 WeakSet 没有 clear 方法）*/
    var frameSet = new Set();

    /*
     * Flarum 2.0 Avatar DOM 结构：
     *   有头像: <img class="Avatar" src="..." alt="用户名">
     *   无头像: <span class="Avatar" style="--avatar-bg:#xxx">首字母</span>
     * 选择器覆盖两种情况。
     */
    var avatars = document.querySelectorAll('img.Avatar, span.Avatar');
    for (var i = 0; i < avatars.length; i++) {
      var img = avatars[i];
      if (img.offsetWidth < 10 || img.offsetHeight < 10) continue;
      var user = findUserForAvatar(img);
      renderDecorationOnAvatar(img, user, frameSet);
    }

    /* 用户名片图（个人中心背景装饰）—— 仅处理背景/透明，不负责布局 */
    var equipped = getEquipped(app.session.user);
    if (equipped['name_card']) {
      renderNameCard(app.session.user);
    }

    /* v28：无条件应用大卡片布局（不依赖装备名片） */
    applyHeroLayout();

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

export default { startDecorationRenderer };
