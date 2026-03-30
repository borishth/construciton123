import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect immediately to the authentication layer when the app opens
  return <Redirect href="/(auth)/login" />;
}
