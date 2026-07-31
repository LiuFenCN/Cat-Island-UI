import app from 'flarum/forum/app';
import userExtend from './extend';
import sidebarExtend from './sidebar';

// ⚠️ Flarum 2.0 模块加载机制：
//   JsCompiler 对每个扩展模块执行 require()，模块体代码立即运行。
//   export 的值传给 bootExtensions 处理（extend 数组）或丢弃（default export）。
//   因此 initializers.add 必须在模块顶层直接调用，不能包在函数里延迟执行。
app.initializers.add('cathi-linkage', () => {
  try {
    userExtend();
  } catch (e) {
    console.warn('[linkage] userExtend failed:', e && (e.message || e));
  }
  try {
    sidebarExtend();
  } catch (e) {
    console.warn('[linkage] sidebarExtend failed:', e && (e.message || e));
  }
});

// bootExtensions 要求 export.extend 存在且为数组。
// 空数组 = 无 Extender 实例，bootExtensions 跳过对各项调 .extend(app)。
// 我们的原型扩展已通过上面的 initializers.add 注册，不需要 extend 数组。
export const extend = [];
