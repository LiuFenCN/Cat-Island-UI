import app from 'flarum/forum/app';

/**
 * 联动系统用户卡片组件 —— 显示等级、经验条、积分
 * 用于嵌入 UserPage 英雄区域或帖子用户信息旁
 */
export default function LinkageUserCard(attrs) {
  const user = attrs.user || (app.session.user && app.session.user);
  if (!user) return null;

  const linkage = user.attribute('linkage') || {};
  const level = linkage.level || 1;
  const exp = linkage.exp || 0;
  const points = linkage.points || 0;

  // 计算当前等级所需总经验和下一级所需
  function expForLevel(lv) {
    if (lv <= 1) return 0;
    const k = lv - 1;
    return Math.floor(100 * k * (k + 1) / 2);
  }
  const currentLevelExp = expForLevel(level);
  const nextLevelExp = expForLevel(level + 1);
  const progress = nextLevelExp > currentLevelExp
    ? Math.min(100, Math.round(((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100))
    : 100;

  return m('.LinkageUserCard', [
    m('.LinkageUserCard-row', [
      // 等级徽章
      m('.LinkageUserCard-level', { title: 'Lv.' + level }, [
        m('span.LinkageUserCard-levelIcon', '⭐'),
        m('span.LinkageUserCard-levelText', 'Lv.' + level),
      ]),
      // 经验条
      m('.LinkageUserCard-expBar', [
        m('.LinkageUserCard-expFill', { style: { width: progress + '%' } }),
        m('.LinkageUserCard-expText', exp + ' XP (' + progress + '%)'),
      ]),
      // 积分
      m('.LinkageUserCard-points', { title: '可用积分' }, [
        m('span.LinkageUserCard-pointsIcon', '💰'),
        m('span.LinkageUserCard-pointsText', points.toLocaleString()),
      ]),
    ]),
  ]);
}
