import Component from 'flarum/common/Component';

/**
 * 等级徽章 — 显示 Lv.X + 等级名称
 * 根据等级显示不同颜色
 */
export default class LinkageLevelBadge extends Component {
  view() {
    const level = this.attrs.level || 1;
    const tier = this.getTier(level);
    const colorClass = `Linkage-Level--tier${tier}`;

    return (
      <div className={`Linkage-Level ${colorClass}`}>
        <span className="Linkage-LevelIcon">{this.getLevelIcon(level)}</span>
        <span className="Linkage-LevelText">Lv.{level}</span>
        <span className="Linkage-LevelName">{this.getLevelName(level)}</span>
      </div>
    );
  }

  getTier(level) {
    if (level >= 50) return 5;
    if (level >= 30) return 4;
    if (level >= 20) return 3;
    if (level >= 10) return 2;
    if (level >= 5) return 1;
    return 0;
  }

  getLevelIcon(level) {
    const tier = this.getTier(level);
    const icons = ['🌱', '🌿', '🌳', '⭐', '👑', '💎'];
    return icons[tier] || icons[0];
  }

  getLevelName(level) {
    if (level >= 50) return '传奇';
    if (level >= 30) return '宗师';
    if (level >= 20) return '精英';
    if (level >= 10) return '资深';
    if (level >= 5) return '活跃';
    return '新人';
  }
}
