import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { format } from 'date-fns';
const formatFecha = (fecha) => format(new Date(fecha), "dd'/'MM'/'yyyy");

const DetallesViajeScreen = ({ route }) => {
  const { item } = route.params;
  const fechaFormateada = formatFecha(item.fecha);

  return (
    <View style={styles.detallesViajePantalla}>
      {item.imagen ? (
        <Image
          style={styles.imagen}
          source={{ uri: item.imagen }}
          resizeMode="cover"
        />
      ) : null}
      <Text style={styles.tituloTarjeta}>{item.nombre}</Text>
      <Text style={styles.lineaDetalle}>
        <Text style={styles.bold}>Fecha: </Text>
        <Text>{fechaFormateada}</Text>
      </Text>
      <Text style={styles.lineaDetalle}>
        <Text style={styles.bold}>Ciudad: </Text>
        <Text>{item.ciudad}</Text>
      </Text>
      <Text style={styles.lineaDetalle}>
        <Text style={styles.bold}>Alojamiento: </Text>
        <Text>{item.alojamiento}</Text>
      </Text>
      <Text style={styles.lineaDetalle}>
        <Text style={styles.bold}>Resumen: </Text>
        <Text>{item.descripcion}</Text>
      </Text>
      {item.actividades && item.actividades.length > 0 && (
        <View>
          <Text style={[styles.bold, styles.lineaDetalle]}>Actividades:</Text>
          {item.actividades.map((actividad, index) => (
            <Text key={index} style={[styles.lineaDetalle, styles.marginL]}>
            - {actividad}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
    },
    detallesViajePantalla: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
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
    bold: {
      fontWeight: 'bold',
    },
    marginL: {
      marginLeft: 15,
    },
    lineaDetalle: {
      marginBottom: 5,
      textAlign: 'justify',
    },
    imagen: {
      width: '100%',
      height: 200,
      marginBottom: 10,
    },
  });

export default DetallesViajeScreen;
