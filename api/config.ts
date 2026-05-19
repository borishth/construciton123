import Constants from 'expo-constants';
import { Platform } from 'react-native';

const FALLBACK_LAN_API_HOST = '10.150.11.90';

function getExpoHost() {
  return Constants.expoConfig?.hostUri?.split(':')[0];
}

const API_HOST =
  Platform.OS === 'web'
    ? 'localhost'
    : process.env.EXPO_PUBLIC_API_HOST ?? FALLBACK_LAN_API_HOST ?? getExpoHost();

export const API_ORIGIN = `http://${API_HOST}:8000`;
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
