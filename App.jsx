/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */

import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}
