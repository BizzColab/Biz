import { configureStore } from '@reduxjs/toolkit';

import lang from '@/locale/translation/en_us';

import rootReducer from './rootReducer';
import storePersist from './storePersist';

// localStorageHealthCheck();

const AUTH_INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const SETTINGS_INITIAL_STATE = {
  result: {
    crm_settings: {},
    finance_settings: {},
    company_settings: {},
    app_settings: {},
    money_format_settings: {},
  },
  isLoading: false,
  isSuccess: false,
};

const auth_state = storePersist.get('auth') ? storePersist.get('auth') : AUTH_INITIAL_STATE;
const settings_state = storePersist.get('settings') 
  ? { result: storePersist.get('settings'), isLoading: false, isSuccess: true } 
  : SETTINGS_INITIAL_STATE;

const initialState = { 
  auth: auth_state,
  settings: settings_state
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development mode
});

console.log(
  '🚀 Welcome to BIZCOLLAB!. We also offer commercial customization services? Contact us bizcollab@gmail.com for more information.'
);

export default store;
