import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'; // ⬅️ added

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
const storage = getStorage(app);

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start">
            {props => <Start app={app} {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Chat">
            {props => (
              <Chat
                db={db}
                storage={storage}
                isConnected={connectionStatus.isConnected}
                {...props}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
