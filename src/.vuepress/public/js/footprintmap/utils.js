(function(){
  function lsGet(key, def){
    try{
      const v = localStorage.getItem(key);
      return v === null ? def : v;
    }catch(e){
      return def;
    }
  }
  function lsSet(key, val){
    try{ localStorage.setItem(key, val); }catch(e){}
  }
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  // 兼容旧代码：全局 Utils 对象 + 全局函数
  window.Utils = { lsGet, lsSet, escapeHtml };
  window.lsGet = lsGet;
  window.lsSet = lsSet;
})();
