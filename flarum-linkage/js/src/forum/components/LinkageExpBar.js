import Component from 'flarum/common/Component';

/**
 * 经验进度条 — 渐变色填充
 */
export default class LinkageExpBar extends Component {
  view() {
    const current = this.attrs.current || 0;
    const max = this.attrs.max || 100;
    const pct = Math.min(100, Math.round((current / max) * 100));

    return (
      <div className="Linkage-ExpBar">
        <div className="Linkage-ExpBar-track">
          <div
            className="Linkage-ExpBar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="Linkage-ExpLabel">
          {current} / {max} EXP
        </span>
      </div>
    );
  }
}
