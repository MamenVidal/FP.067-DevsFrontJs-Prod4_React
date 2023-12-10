import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatFecha } from './utils'; 

class TarjetaViaje extends Component {
  render() {
    const { navigation, nombre, descripcion, fecha, dia, item } = this.props;
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
  }
}

const styles = StyleSheet.create({
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

export default TarjetaViaje;
