//import types
import type { AppStateData } from './types';

const APP_STORAGE_NAME = 'connect-app-state';
const APP_STATE_VERSION = 2;
const initialState: AppStateData = {
  favoriteContactIds: [],
  theme: 'system',
  onboardingStatus: false,
};

export { APP_STATE_VERSION, APP_STORAGE_NAME, initialState };
