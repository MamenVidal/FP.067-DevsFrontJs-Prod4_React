import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { environment } from './environments/environment';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';

const formatFecha = (fecha) => format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: esLocale });

const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);
const Stack = createStackNavigator();

// Componente de Tarjeta de Viaje
const TarjetaViaje = ({ nombre, descripcion, fecha, dia }) => {
  const fechaFormateada = formatFecha(fecha);

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.tituloTarjeta}>{nombre}</Text>
      <Text style={styles.subTituloTarjeta}>{dia}, {fechaFormateada}</Text>
      <Text>{descripcion}</Text>
    </View>
  );
};

// Componente de la pantalla principal
const HomeScreen = () => {
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(firestore, 'MiViaje'), orderBy('fecha'));
        const querySnapshot = await getDocs(q);
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
        renderItem={({ item }) => (
          <TarjetaViaje
            nombre={item.nombre}
            descripcion={item.descripcion}
            fecha={item.fecha}
            dia={item.dia}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Componente principal de la aplicación
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
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  subTituloTarjeta: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
});
