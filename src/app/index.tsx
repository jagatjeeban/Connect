import { Redirect } from 'expo-router';

/**
 * Redirects the application root route to the contacts tab.
 */
export default function Index() {
  return <Redirect href={'/contacts'} />;
}
