import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import LinkageExpBar from './LinkageExpBar';

/**
 * LinkageStats — 注入到 UserHero 统计区域的联动数据组件
 * 显示：经验条 + 猫猫币（等级徽章已改由 extend.js 经 identificationItems 注入到用户名右侧）
 */
export default class LinkageStats extends Component {
  view() {
    const user = this.attrs.user;
    if (!user) return <div />;

    const exp = user.attribute('exp') || 0;
    const expToNext = user.attribute('expToNext') || 100;
    const coins = user.attribute('catcoins') || 0;

    return (
      <div className="Linkage-Stats">
        {/* 经验进度条 */}
        <LinkageExpBar current={exp} max={expToNext} />

        {/* 猫猫币 */}
        <div className="Linkage-CoinRow">
          <span className="Linkage-CoinIcon">🐱</span>
          <span className="Linkage-CoinValue">{coins}</span>
          <span className="Linkage-CoinUnit">猫猫币</span>
        </div>
      </div>
    );
  }
}
