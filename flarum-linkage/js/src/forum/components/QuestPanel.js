import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

/**
 * 每日任务面板 — 显示在主页右侧侧边栏
 * 任务类型：签到（自动完成）、发帖、回复、点赞
 * 签到奖励在页面加载时自动发放；其他任务根据后端进度显示。
 */

export default class QuestPanel extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.autoClaimed = false;
    this.quests = [
      { key: 'checkin', name: '每日签到', icon: '📅', reward: 10, desc: '每天登录即可领取', auto: true },
      { key: 'post', name: '发布讨论', icon: '✍️', reward: 20, desc: '发布一个新讨论', auto: false },
      { key: 'reply', name: '参与回复', icon: '💬', reward: 5, desc: '回复任意讨论', auto: false },
      { key: 'like', name: '点赞互动', icon: '❤️', reward: 3, desc: '给帖子点赞', auto: false },
    ];
    // 默认进度：签到=已完成（用户已登录=已签到）
    this.progress = {
      checkin: true,
      post: 0,
      reply: 0,
      like: 0,
      checkin_claimed: false,
      post_claimed: false,
      reply_claimed: false,
      like_claimed: false,
    };
    this.loadProgress();
  }

  loadProgress() {
    app.request({
      url: app.forum.attribute('apiUrl') + '/linkage/quests',
      method: 'GET',
    })
      .then((res) => {
        if (res && res.data) {
          this.progress = { ...this.progress, ...res.data };
        }
      })
      .catch(() => {
        // 后端 API 不可用时使用默认值（签到仍自动标记为完成）
      })
      .finally(() => {
        this.loading = false;
        // 签到任务自动领取
        this.tryAutoClaimCheckin();
        m.redraw();
      });
  }

  tryAutoClaimCheckin() {
    if (this.autoClaimed) return;
    if (!this.progress.checkin_claimed && this.isComplete(this.quests[0])) {
      this.claim(this.quests[0]);
      this.autoClaimed = true;
    }
  }

  view() {
    return (
      <div className="Linkage-QuestPanel">
        <h3 className="Linkage-QuestTitle">
          <span className="Linkage-QuestIcon">📋</span>
          每日任务
        </h3>

        {this.loading && <LoadingIndicator size="small" />}

        <ul className="Linkage-QuestList">
          {this.quests.map((q) => this.renderQuest(q))}
        </ul>
      </div>
    );
  }

  renderQuest(quest) {
    const done = this.isComplete(quest);
    const claimed = this.progress[quest.key + '_claimed'] || false;

    return (
      <li className={`Linkage-QuestItem ${done ? 'done' : ''} ${claimed ? 'claimed' : ''}`}>
        <span className="Linkage-QuestItemIcon">{quest.icon}</span>
        <div className="Linkage-QuestItemInfo">
          <span className="Linkage-QuestItemName">{quest.name}</span>
          <span className="Linkage-QuestItemDesc">{quest.desc}</span>
        </div>
        <div className="Linkage-QuestItemReward">
          <span className="Linkage-CoinIcon">🐱</span> +{quest.reward}
        </div>
        {claimed ? (
          <span className="Linkage-QuestClaimed">✓ 已领</span>
        ) : done ? (
          <Button
            className="Button Button--primary Linkage-QuestClaimBtn"
            onclick={() => this.claim(quest)}
          >
            领取
          </Button>
        ) : (
          <span className="Linkage-QuestPending">待完成</span>
        )}
      </li>
    );
  }

  isComplete(quest) {
    const p = this.progress[quest.key];
    if (typeof p === 'boolean') return p;
    if (typeof p === 'number') return p >= 1;
    return false;
  }

  claim(quest) {
    if (this.progress[quest.key + '_claimed']) return;
    app.request({
      url: app.forum.attribute('apiUrl') + '/linkage/claim',
      method: 'POST',
      body: { quest_key: quest.key },
    }).then(() => {
      this.progress[quest.key + '_claimed'] = true;
      m.redraw();
    }).catch(() => {
      // 后端不可用时前端也标记为已领（用户体验）
      this.progress[quest.key + '_claimed'] = true;
      m.redraw();
    });
  }
}
