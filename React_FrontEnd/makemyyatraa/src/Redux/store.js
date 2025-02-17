import { legacy_createStore as createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const initiateState = {
    loginToken: 900,
    isOwner: false,
    user: null
};
const rootReducer = (state = initiateState, action) => {
    switch (action.type) {
        case 'UPDATE_LOGIN_TOKEN':
            return { ...state, loginToken: action.payload };
        case 'UPDATE_IS_OWNER':
            return {...state, isOwner: action.payload };
        case 'UPDATE_USER':
            return {...state, user: action.payload }
        default:
            return state;
    }
};
const persistConfig = {
    key: 'root',
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
