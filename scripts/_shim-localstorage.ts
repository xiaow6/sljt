// Pre-import shim: provide a no-op localStorage so modules that touch it at
// load-time work under Node.
(globalThis as { localStorage?: Storage }).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
} as Storage;
