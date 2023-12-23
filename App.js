import React, {useEffect, useState, useRef} from 'react';
import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InicioScreen from './InicioScreen'; 
import DetallesViajeScreen from './DetallesViajeScreen'; 
import MultimediaScreenComponent from './MultimediaScreen'; 
import { environment } from './environments/environment';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const messaging = getMessaging(app);

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    iconContainer: {
      backgroundColor: '#007bff',
      padding: 5,
      borderRadius: 5,
      marginRight: 10,
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={registerForPushNotificationsAsync}>
                <View style={styles.iconContainer}>
                  {/* Icono para notificaciones, cambia 'home' por el ícono que desees */}
                  <MaterialIcons name="notifications" size={30} color="white" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="home" size={30} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Stack.Screen
          name="Home"
          component={InicioScreen}
          options={({ navigation }) => ({
            title: 'misViajes',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }, 
          })}
        />
        <Stack.Screen 
          name="DetallesViaje" 
          component={DetallesViajeScreen} 
          options={{ title: 'Detalle del día' }}
        />
        <Stack.Screen 
          name="MultimediaScreen" 
          component={MultimediaScreenComponent}
          options={{ title: 'Vídeo del día' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
  
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}
onMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = getToken(messaging, {vapidKey: "AIzaSyAVUxS20D4ilBqqK94VPNBjKjxC0UUms1I"});
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
