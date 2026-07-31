import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

/**
 * 装饰商城 — 显示在主页侧边栏
 * 商品：头像框、头环、名片图
 */
export default class DecorationShop extends Component {
  oninit(vnode) {
    super.oninit(vnode); // ⚠️ 必须透传 vnode，否则 Component.oninit 读 vnode.attrs 崩溃
    this.loading = false;
    this.items = [
      { id: 1, name: '金色头像框', type: 'avatar_frame', icon: '🖼️', price: 100, rarity: 'legendary', color: '#FFD700' },
      { id: 2, name: '银色头像框', type: 'avatar_frame', icon: '⬜', price: 50, rarity: 'rare', color: '#C0C0C0' },
      { id: 3, name: '猫耳头环', type: 'head_accessory', icon: '😺', price: 200, rarity: 'epic', color: '#FF69B4' },
      { id: 4, name: '彩虹光环', type: 'head_accessory', icon: '🌈', price: 300, rarity: 'legendary', color: 'linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#8b00ff)' },
      { id: 5, name: '星空名片图', type: 'name_card', icon: '🌌', price: 150, rarity: 'epic', color: '#4B0082' },
      { id: 6, name: '樱花名片图', type: 'name_card', icon: '🌸', price: 80, rarity: 'rare', color: '#FFB7C5' },
      { id: 7, name: '火焰头像框', type: 'avatar_frame', icon: '🔥', price: 250, rarity: 'epic', color: '#FF4500' },
      { id: 8, name: '冰霜头环', type: 'head_accessory', icon: '❄️', price: 180, rarity: 'rare', color: '#87CEEB' },
    ];
    this.owned = [];
    this.equipped = {};
    this.coins = 0;
    this.loadUserItems();
  }

  loadUserItems() {
    // 从当前用户属性加载已拥有和装备状态
    const user = app.session.user;
    if (user) {
      this.coins = user.attribute('catcoins') || 0;
      this.owned = user.attribute('ownedDecorations') || [];
      this.equipped = user.attribute('equippedDecorations') || {};
    }
  }

  view() {
    return (
      <div className="Linkage-Shop">
        <h3 className="Linkage-ShopTitle">
          <span className="Linkage-ShopIcon">🏪</span>
          装饰商城
          <span className="Linkage-ShopBalance">
            <span className="Linkage-CoinIcon">🐱</span> {this.coins}
          </span>
        </h3>

        {this.loading && <LoadingIndicator size="small" />}

        <div className="Linkage-ShopGrid">
          {this.items.map((item) => this.renderItem(item))}
        </div>

        <div className="Linkage-ShopMyItems">
          <h4>我的装饰</h4>
          {this.owned.length === 0 && <p className="Linkage-ShopEmpty">还没有装饰，去购买吧~</p>}
          <div className="Linkage-EquippedList">
            {this.owned.map((id) => {
              const item = this.items.find((i) => i.id === id);
              if (!item) return null;
              const isEquipped = this.equipped[item.type] === item.id;
              return (
                <div className={`Linkage-OwnedItem ${isEquipped ? 'equipped' : ''}`}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  <Button
                    className={isEquipped ? 'Button--danger' : 'Button--primary'}
                    onclick={() => this.toggleEquip(item)}
                  >
                    {isEquipped ? '卸下' : '装备'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  renderItem(item) {
    const owned = this.owned.includes(item.id);
    const canAfford = this.coins >= item.price;

    return (
      <div className={`Linkage-ShopItem Linkage-Rarity--${item.rarity}`} style={{ '--item-color': item.color }}>
        <div className="Linkage-ShopItemPreview">
          <span className="Linkage-ShopItemIcon">{item.icon}</span>
        </div>
        <div className="Linkage-ShopItemInfo">
          <span className="Linkage-ShopItemName">{item.name}</span>
          <span className="Linkage-ShopItemType">{this.getTypeLabel(item.type)}</span>
        </div>
        <div className="Linkage-ShopItemPrice">
          <span className="Linkage-CoinIcon">🐱</span> {item.price}
        </div>
        {owned ? (
          <span className="Linkage-ShopOwned">已拥有 ✓</span>
        ) : (
          <Button
            className="Button Button--primary"
            disabled={!canAfford}
            onclick={() => this.buy(item)}
          >
            {canAfford ? '购买' : '余额不足'}
          </Button>
        )}
      </div>
    );
  }

  getTypeLabel(type) {
    const labels = { avatar_frame: '头像框', head_accessory: '头环', name_card: '名片图' };
    return labels[type] || type;
  }

  buy(item) {
    app.request({
      url: app.forum.attribute('apiUrl') + '/linkage/shop/buy',
      method: 'POST',
      body: { item_id: item.id },
    }).then((res) => {
      this.coins -= item.price;
      this.owned.push(item.id);
      m.redraw();
    }).catch((err) => {
      alert(err.response?.errors?.[0]?.detail || '购买失败');
    });
  }

  toggleEquip(item) {
    app.request({
      url: app.forum.attribute('apiUrl') + '/linkage/shop/equip',
      method: 'POST',
      body: { item_id: item.id, type: item.type },
    }).then((res) => {
      if (this.equipped[item.type] === item.id) {
        delete this.equipped[item.type];
      } else {
        this.equipped[item.type] = item.id;
      }
      m.redraw();
    }).catch(console.error);
  }
}
