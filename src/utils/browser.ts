/**
 * 强制刷新页面
 * 注意：此方法会导致页面重新加载，所有未保存的数据将丢失
 */
export function forceReload() {
  window.location.replace(window.location.pathname + '?_=' + Date.now());
}
