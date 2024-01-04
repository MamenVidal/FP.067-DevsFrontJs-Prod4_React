import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Alert, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InicioScreen from './InicioScreen'; 
import DetallesViajeScreen from './DetallesViajeScreen'; 
import MultimediaScreenComponent from './MultimediaScreen'; 
import messaging from '@react-native-firebase/messaging';

// Configurar el manejador de mensajes en segundo plano
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Mensaje recibido en segundo plano:', remoteMessage);

    // Supongamos que quieres mostrar una alerta o realizar una acción específica
    if (remoteMessage.notification) {
      // Acceder a la información de la notificación
      const { title, body } = remoteMessage.notification;
  
  //Consola de depuración, así vemos si se recibe el mensaje
      console.log('Título de la notificación:', title);
      console.log('Cuerpo de la notificación:', body);
  
    }
  });

const Stack = createStackNavigator();


export default function App() {

 
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  

  useEffect(() => {
    const initFCM = async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      } else {
        console.log('User permission denied');
      }
    };

    

    initFCM();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('¡Nuevo mensaje FCM recibido!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
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

    <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="home" size={30} color="white" />
                  </View>
                </TouchableOpacity>
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
        </View>
  );}