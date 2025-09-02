import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db }) => {
  const { name, color, userID } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(q, (docs) => {
      const newMessages = [];
      docs.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          _id: doc.id, // GiftedChat id
          text: data.text,
          createdAt: new Date(data.createdAt.toMillis()),
          user: data.user,
          system: data.system || false,
        });
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [db, name, navigation]);

  // Save the first message to Firestore
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

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(msgs) => onSend(msgs)}
        user={{
          _id: userID,
          name,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Chat;
