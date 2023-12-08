import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InicioScreen from './InicioScreen'; // Asegúrate de que el camino sea correcto según la estructura de tu proyecto
import DetallesViajeScreen from './DetallesViajeScreen'; // Asumiendo que esto sigue siendo un componente funcional o de clase
import MultimediaScreenComponent from './MultimediaScreen'; // Asumiendo que esto sigue siendo un componente funcional o de clase

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
