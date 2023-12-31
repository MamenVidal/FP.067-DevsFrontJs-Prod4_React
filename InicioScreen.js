import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TarjetaViaje from './TarjetaViaje';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { environment } from './environments/environment';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { connectFunctionsEmulator } from 'firebase/functions';


// Inicializar Firebase
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);
if (environment.useEmulators) {
  connectFirestoreEmulator(firestore, environment.emulatorConfig.firestore.host, environment.emulatorConfig.firestore.port);
}

class InicioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viajes: [],
    };
  }

  // Obtener los datos de Firestore
  componentDidMount() {
    this.fetchData();
    console.log('Component InicioScreen mount!');
  }

  fetchData = async () => {
    try {
      const q = query(collection(firestore, 'MiViaje'), orderBy('fecha'));
      const querySnapshot = await getDocs(q);
      const viajesArray = [];
      querySnapshot.forEach((doc) => {
        viajesArray.push(doc.data());
      });
      this.setState({ viajes: viajesArray });
    } catch (error) {
      console.error("Error al obtener los documentos: ", error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.viajes}
          renderItem={({ item }) => (
            <TarjetaViaje
              navigation={this.props.navigation}
              nombre={item.nombre}
              descripcion={item.descripcion}
              fecha={item.fecha}
              dia={item.dia}
              item={item}
            />
          )}
          keyExtractor={item => item.nombre + item.fecha}

        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },

      iconContainer: {
        backgroundColor: 'white',
        padding: 5, // padding según necesidades
        borderRadius: 5, // para redondear las esquinas
      },
    });

export default InicioScreen;
