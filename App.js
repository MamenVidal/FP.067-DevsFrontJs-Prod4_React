import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { environment } from './environments/environment';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore,
  collection,
  getDocs,
} from 'firebase/firestore'; 
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);



const Stack = createStackNavigator();

// Componente de Tarjeta de Viaje
const TarjetaViaje = ({ dia, descripcion }) => (
  <View style={styles.tarjeta}>
    <Text style={styles.tituloTarjeta}>{dia}</Text>
    <Text>{descripcion}</Text>
  </View>
);

function HomeScreen() {
  
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'MiViaje'));
        const viajesArray = [];
        querySnapshot.forEach((doc) => {
          viajesArray.push(doc.data());
        });
        setViajes(viajesArray);
      } catch (error) {
        console.error("Error al obtener los documentos: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={viajes}
        renderItem={({ item }) => <TarjetaViaje dia={item.dia} descripcion={item.descripcion} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tarjeta: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tituloTarjeta: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
