import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createNativeStackNavigator();

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBa05qxISyNhAsYSfLY-dYe9i-IINelqcw",
  authDomain: "chat-app-49d88.firebaseapp.com",
  projectId: "chat-app-49d88",
  storageBucket: "chat-app-49d88.firebasestorage.app",
  messagingSenderId: "1078760086166",
  appId: "1:1078760086166:web:a508425bfb4e9ca56780b7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Start">
      <Stack.Screen name="Start">
        {props => <Start app={app} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Chat">
        {props => <Chat db={db} {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
