chat-app

A real time chat app built with React Native, Expo and Google Firebase.
The app allows users to communicate with each other by sending text messages, images and locations.
Communications are stored in Firebase database and storage. (Firebase Storage, Cloud Firestore).
AsyncStorage allows offline caching.

Features

Anonymous sign in
Navigation
User Name input field
Background color customization (selection)
Customisable chat screen (user name, background color)
Real time messaging
Upload images from library or camera
Share current location
Action Sheet + button next to the input field
Offline caching of the messages

Tech Stack

React Native / Expo, Firebase: Auth (Anonymous), Firestore, Storage, react-native-gifted-chat, expo-image-picker, expo-location, react-native-maps, @react-native-async-storage/async-storage, @react-native-community/netinfo, @expo/react-native-action-sheet

Prerequisites

Node.js, Git, Expo Go app on Android/iOS device, Android Studio optional if using a physical device

Getting Started

1. Clone & Install
   git clone <your-repo-url>
   cd chat-app
   npm install

2. Firebase Setup
   Create a Firebase project at https://console.firebase.google.com and configure the following:
   Enable Authentication - Sign-in method - Anonymous

Enable Firestore

Enable Storage

use rules:

service firebase.storage {
match /b/{bucket}/o {
match /{allPaths=\*\*} {
allow read, write: if true;
}
}
}

Copy your Firebase web config and paste it into App.js:

const firebaseConfig = {
apiKey: "...",
authDomain: "...",
projectId: "...",
storageBucket: "...",
messagingSenderId: "...",
appId: "..."
};

This app uses anonymous auth, Firestore for messages, and Storage for media.

3. Required Libraries

This project already lists the needed dependencies in package.json.

Expo-safe commands are:

expo install expo-image-picker
expo install expo-location
expo install react-native-maps
expo install @react-native-async-storage/async-storage
expo install @react-native-community/netinfo
npm install firebase react-native-gifted-chat

4. Run the App

npm start
a to open Android emulator, or
i to open iOS simulator, or
scan the QR code with the Expo Go app on your device
Grant the permissions for Photos, Camera, and Location.

Troubleshooting

Action Sheet doesn’t open / errors

Ensure @expo/react-native-action-sheet is installed

Permissions

If you accidentally deny permissions, enable them in the device settings
