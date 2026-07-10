// アーティファクト専用のwindow.storageを、ブラウザ標準のlocalStorageに置き換える
window.storage = {
  get: async (key) => {
    const v = localStorage.getItem(key);
    if (v === null) throw new Error("key not found");
    return { key, value: v };
  },
  set: async (key, value) => { localStorage.setItem(key, value); return { key, value }; },
  delete: async (key) => { localStorage.removeItem(key); return { key, deleted: true }; },
};
