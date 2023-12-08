import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InicioScreen from './InicioScreen'; 
import DetallesViajeScreen from './DetallesViajeScreen'; 
import MultimediaScreenComponent from './MultimediaScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={InicioScreen}
          options={{
            title: 'misViajes',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="DetallesViaje" 
          component={DetallesViajeScreen} 
          options={{ title: 'Detalle del día' }}
        />
        <Stack.Screen 
          name="MultimediaScreen" 
          component={MultimediaScreenComponent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
