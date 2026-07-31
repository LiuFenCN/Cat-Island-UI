import { extend } from 'flarum/common/extend';
import UserCard from 'flarum/forum/components/UserCard';
import LinkageStats from './components/LinkageStats';
import LinkageLevelBadge from './components/LinkageLevelBadge';

/* ═══ 联动系统：个人中心数据注入 ═══
 * ⚠️ Flarum 2.0 实测（bbs.cathi.cn，2026-07-29）：
 *   用户资料页头部实际渲染的是 UserCard（DOM 只有 .UserCard-info）。
 *   UserPage.prototype.statsItems/controlItems 虽然存在但【不会被渲染调用】。
 *   正确注入点：UserCard.prototype.infoItems / contentItems。
 *   UserCard 内 user 模型取自 this.attrs.user。
 */

export default function () {
  // 等级徽章（⭐Lv.X 名称）→ 注入到 contentItems，优先级 95
  // （在 identity=100 之后、badges=90 之前），渲染在 .UserCard-content 内、
  // 紧跟 <h1.UserCard-identity>（用户名）之后。
  // 这是 Flarum 2.0 原生渲染位置（UserCard.contentItems 渲染 .UserCard-content），
  // 属正常 Mithril 渲染周期，重渲染不会被还原。
  // ⚠️ Flarum 2.0 没有 identificationItems（用户名在 .UserCard-identity），
  //    必须注入 contentItems 才能出现在名字旁边。
  extend(UserCard.prototype, 'contentItems', function (items) {
    const user = this.attrs.user;
    if (!user) return;
    const level = user.attribute('level') || 1;
    items.add('linkage-level', <LinkageLevelBadge level={level} />, 95);
  });

  // 经验条 + 猫猫币行（不再含等级徽章，避免与 identificationItems 重复）
  extend(UserCard.prototype, 'infoItems', function (items) {
    const user = this.attrs.user;
    if (!user) return;

    items.add('linkage-stats', <LinkageStats user={user} />, -98);
  });

  // 用户卡片内容区插入猫猫币余额徽章
  extend(UserCard.prototype, 'contentItems', function (items) {
    const user = this.attrs.user;
    if (!user) return;

    const coins = user.attribute('catcoins') || 0;
    items.add(
      'catcoins',
      <div className="Linkage-CoinBadge" title="猫猫币余额">
        <span className="Linkage-CoinIcon">🐱</span>
        <span className="Linkage-CoinAmount">{coins}</span>
        <span className="Linkage-CoinLabel">猫猫币</span>
      </div>,
      -99
    );
  });
}
