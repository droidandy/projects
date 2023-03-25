export const persist = {
  instance: null,
  store: null,
};

export function keepPersist(instance) {
  persist.instance = instance;
}

export function keepStore(instance) {
  persist.store = instance;
}
