// scripts/storage/bookmarks.js
const Store = require('electron-store').default;
const store = new Store();

const BOOKMARKS_KEY = 'bookmarks';

function getBookmarks() {
  return store.get(BOOKMARKS_KEY, []);
}

function addBookmark(title, url) {
  const bookmarks = getBookmarks();
  // Avoid duplicates
  if (!bookmarks.some(b => b.url === url)) {
    bookmarks.push({ title, url });
    store.set(BOOKMARKS_KEY, bookmarks);
  }
}

function removeBookmark(url) {
  const bookmarks = getBookmarks().filter(b => b.url !== url);
  store.set(BOOKMARKS_KEY, bookmarks);
}

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark
};
