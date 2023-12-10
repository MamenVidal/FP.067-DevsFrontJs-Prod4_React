import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InicioScreen from './InicioScreen'; 
import DetallesViajeScreen from './DetallesViajeScreen'; 
import MultimediaScreenComponent from './MultimediaScreen'; 

const Stack = createStackNavigator();

export default function App() {
  
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
    
  );
  
}
