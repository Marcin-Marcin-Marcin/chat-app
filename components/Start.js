import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ImageBackground, Platform, KeyboardAvoidingView, Alert,
} from 'react-native';

// React Native Auth AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInAnonymously,
} from 'firebase/auth';

const getOrInitAuth = (app) => {
  try {
    return getAuth(app);
  } catch (e) {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
};

const Start = ({ navigation, app }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3E3C3C');

  const signInUser = () => {
    const auth = getOrInitAuth(app);

    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name?.trim() || 'Anonymous',
          color,
        });
        Alert.alert('Signed in Successfully!');
      })
      .catch(() => {
        Alert.alert('Unable to sign in, try later again.');
      });
  };

  const content = (
    <ImageBackground source={require('../assets/background.png')} style={styles.bg}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>Chat App</Text>
      </View>

      <View style={styles.box}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />

        <View style={styles.colorBlock}>
          <Text style={styles.colorLabel}>Choose Background Color:</Text>
          <View style={styles.colorRow}>
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: '#3E3C3C' }]}
              onPress={() => setColor('#3E3C3C')}
              accessible
              accessibilityLabel="Select dark gray background"
              accessibilityRole="button"
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: '#5C5470' }]}
              onPress={() => setColor('#5C5470')}
              accessible
              accessibilityLabel="Select purple gray background"
              accessibilityRole="button"
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: '#8D99AE' }]}
              onPress={() => setColor('#8D99AE')}
              accessible
              accessibilityLabel="Select slate gray background"
              accessibilityRole="button"
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: '#B8C1C8' }]}
              onPress={() => setColor('#B8C1C8')}
              accessible
              accessibilityLabel="Select light gray background"
              accessibilityRole="button"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={signInUser}
          accessible
          accessibilityLabel="Start Chatting"
          accessibilityHint="Signs in anonymously and navigates to the chat screen"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  return Platform.OS === 'ios'
    ? <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">{content}</KeyboardAvoidingView>
    : content;
};

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'space-between' },
  titleWrap: { alignItems: 'center', marginTop: 60 },
  title: { fontSize: 45, fontWeight: '600', color: '#fff' },
  box: { backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10, marginBottom: 40 },
  input: { height: 50, borderColor: '#757083', borderWidth: 1, paddingHorizontal: 12, marginBottom: 20, color: '#000' },
  colorBlock: { marginBottom: 20 },
  colorLabel: { color: '#757083', marginBottom: 10 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  button: { height: 50, backgroundColor: '#757083', justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Start;
