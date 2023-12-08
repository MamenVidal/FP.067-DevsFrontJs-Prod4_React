import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { format } from 'date-fns';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

// Ordenar los viajes por fecha
const formatFecha = (fecha) => format(new Date(fecha), "dd'/'MM'/'yyyy");

// Componente de la pantalla de detalles de viaje
const DetallesViajeScreen = ({ route, navigation }) => { 
  const { item } = route.params;
  const fechaFormateada = formatFecha(item.fecha);
  const [modalVisible, setModalVisible] = useState(false);
  const [scale, setScale] = useState(1);

 // 
  const onPinchEvent = (event) => {
    if (event.nativeEvent.scale > 1) {
      setScale(event.nativeEvent.scale);
    }
  };
  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setScale(1);
    }
  };

  // Define la función para manejar la navegación
  const irAMultimedia = () => {
    navigation.navigate('MultimediaScreen', { item }); 
  };

  return (
    <View style={styles.detallesViajePantalla}>
        {item.imagen ? (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            style={styles.imagen}
            source={{ uri: item.imagen }}
            resizeMode="cover"
          />
        </TouchableOpacity>
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

      {/* Botón para navegar a MultimediaScreen */}
      <TouchableOpacity style={styles.botonPersonalizado} onPress={irAMultimedia}>
        <Text style={styles.textoBoton}>Ver vídeo del día</Text>
      </TouchableOpacity>
    

      {/* Modal para el zoom de la imagen */}
          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <PinchGestureHandler
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchStateChange}
            >
              <Image
                style={[styles.zoomedImage, { transform: [{ scale }] }]}
                source={{ uri: item.imagen }}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
  );
};

// Estilos
const styles = StyleSheet.create({
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
    botonPersonalizado: {
      backgroundColor: '#007bff', // color de fondo
      padding: 10,
      borderRadius: 5,
      marginTop: 15,
      width: 200, // Ancho 
      alignSelf: 'center', // Centra el botón en su contenedor
      alignItems: 'center', // Centra el texto en el botón
    },
    textoBoton: {
      color: 'white', // color del texto
      fontWeight: 'bold',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    zoomedImage: {
      width: '100%',
      height: '80%',
    },
    closeButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 20,
    },
  });

export default DetallesViajeScreen;
