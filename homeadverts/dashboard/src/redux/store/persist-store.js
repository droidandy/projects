import { persistStore } from 'redux-persist';

export default store => persistStore(store, null, () => {});
