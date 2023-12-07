import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { environment } from './environments/environment';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import DetallesViajeScreen from './DetallesViajeScreen';

// Ordenar los viajes por fecha
const formatFecha = (fecha) => format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: esLocale });

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);
const Stack = createStackNavigator();

// Componente de Tarjeta de Viaje
const TarjetaViaje = ({ navigation, nombre, descripcion, fecha, dia, item }) => {
  const fechaFormateada = formatFecha(fecha);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('DetallesViaje', { item })}>
      <View style={styles.tarjeta}>
        <Text style={styles.tituloTarjeta}>{nombre}</Text>
        <Text style={styles.subTituloTarjeta}>{dia}, {fechaFormateada}</Text>
        <Text>{descripcion}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Componente de la pantalla principal
const HomeScreen = ({ navigation }) => {
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
            navigation={navigation}
            nombre={item.nombre}
            descripcion={item.descripcion}
            fecha={item.fecha}
            dia={item.dia}
            item={item}
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
      <Stack.Screen 
        name="DetallesViaje" 
        component={DetallesViajeScreen} 
        options={{
          title: 'Detalle del día',
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
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  subTituloTarjeta: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
});
