import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_CACHE_KEY = 'chat_messages';

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, color, userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  const cacheMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(msgs));
    } catch (e) {
      console.log('AsyncStorage set error:', e?.message);
    }
  };

  const loadCachedMessages = async () => {
    try {
      const cachedStr = (await AsyncStorage.getItem(CHAT_CACHE_KEY)) || '[]';
      const parsed = JSON.parse(cachedStr);
      const revived = parsed.map(m => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
      setMessages(revived);
    } catch {
      setMessages([]);
    }
  };

  const clearCachedMessages = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_CACHE_KEY);
    } catch (e) {
      console.log('AsyncStorage remove error:', e?.message);
    }
  };

  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, async (docs) => {
        const newMessages = [];
        docs.forEach((doc) => {
          const data = doc.data();
          newMessages.push({
            _id: doc.id, // GiftedChat id
            text: data.text,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
            user: data.user,
            system: data.system || false,
          });
        });

        await cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else if (isConnected === false) {
      loadCachedMessages();
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected, db]);

  const onSend = useCallback(
    (newMessages = []) => {
      addDoc(collection(db, 'messages'), newMessages[0]);
    },
    [db]
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#000' },
        left: { backgroundColor: '#FFF' },
      }}
    />
  );

  // Hide input toolbar when offline
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(msgs) => onSend(msgs)}
        user={{ _id: userID, name }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Chat;
