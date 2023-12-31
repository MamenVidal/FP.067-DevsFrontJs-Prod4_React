import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { Video } from 'expo-av';
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { environment } from './environments/environment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { connectFunctionsEmulator } from 'firebase/functions';


// Inicializar Firebase
const app = initializeApp(environment.firebase);
const storage = getStorage(app);
if (environment.useEmulators) {
  connectStorageEmulator(storage, environment.emulatorConfig.storage.host, environment.emulatorConfig.storage.port);
}

// Pantalla de reproducción de video
const MultimediaScreen = ({ route }) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true); 
  const [volume, setVolume] = useState(1.0); // Volumen del video
  const { item } = route.params;

  const [videoStyle, setVideoStyle] = useState(styles.video);

  // Función para cambiar el volumen
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    videoRef.current.setStatusAsync({
      volume: newVolume
    });
  };

  // Función para maximizar la pantalla
  const handleFullScreenChange = () => {
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer(); // método para activar pantalla completa
    }
  };
  

  // Función para subir el volumen
  const handleVolumeUp = () => {
    const newVolume = Math.min(1, volume + 0.1);
    setVolume(newVolume);
    videoRef.current.setStatusAsync({
      volume: newVolume
    });
  };

  // Función para bajar el volumen
  const handleVolumeDown = () => {
    const newVolume = Math.max(0, volume - 0.1);
    setVolume(newVolume);
    videoRef.current.setStatusAsync({
      volume: newVolume
    });
  };

  useEffect(() => {
    if (item && item.video) {
      const fetchVideoUrl = async () => {
        try {
          const url = await getDownloadURL(storageRef(storage, item.video));
          setVideoUrl(url);
          setLoading(false); 
        } catch (error) {
          console.error('Error al cargar el vídeo: ', error);
          setLoading(false);
        }
      };
      fetchVideoUrl();
    } else {
      setLoading(false); 
    }
  }, [item]);

  if (loading) {
    return <View style={styles.container}><Text>Cargando vídeo...</Text></View>;
  }

  if (!videoUrl) {
    return <View style={styles.container}><Text style={styles.noVideo}>No hay vídeo disponible para hoy</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={videoStyle}
        videoStyle={styles.videoTag}
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode="cover"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        onReadyForDisplay={() => {
          setVideoStyle({ ...styles.video, position: "initial" });
        }}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.botonPersonalizado}
          onPress={() => (status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync())}>
          <Text style={styles.textoBoton}>{status.isPlaying ? 'Pausa' : 'Reproducir'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.botonPersonalizado}
            onPress={handleFullScreenChange}>
          <Text style={styles.textoBoton}>Pantalla completa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonPersonalizado}
          onPress={() => handleVolumeChange(volume > 0 ? 0 : 1)}>
          <Text style={styles.textoBoton}>{volume > 0 ? 'Silenciar' : 'Activar sonido'}</Text>
        </TouchableOpacity>
        <View style={styles.volumeButtonsContainer}>
          <TouchableOpacity
            style={styles.botonPersonalizadoMin}
            onPress={() => handleVolumeDown()}>
            <Text><Icon name="volume-down" size={20} color="white"/></Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonPersonalizadoMin}
            onPress={() => handleVolumeUp()}>
            <Text><Icon name="volume-up" size={20} color="white"/></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'column', // Cambiado de 'row' a 'column'
    alignItems: 'center', // Centra los botones horizontalmente
    justifyContent: 'center', // Centra los botones verticalmente
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5, // Agregado espacio arriba para separar del video
  },
  volumeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  container: {
    flex: 1, // Asegura que el contenedor llene la pantalla
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 5,
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
  video: {
    maxWidth: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    position: 'absolute'
  },
  videoTag: {
    maxWidth: '100%',
    height: 480,
    aspectRatio: 16 / 9,
    position: 'relative'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonPersonalizado: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10, 
    borderRadius: 5,
    width: 200,
    height: 39,
    backgroundColor: '#007bff',
  },
  botonPersonalizadoMin: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    marginRight: 5, 
    marginLeft: 5,  
    borderRadius: 5,
    width: 98,
    height: 39,
    backgroundColor: '#007bff',
  },
  textoBoton: {
    color: 'white', 
    fontWeight: 'bold',
  },
  noVideo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default MultimediaScreen;
