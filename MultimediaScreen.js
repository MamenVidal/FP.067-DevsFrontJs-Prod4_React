import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { Video } from 'expo-av';
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { environment } from './environments/environment';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const storage = getStorage(app);

// Pantalla de reproducción de video
const MultimediaScreen = ({ route }) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true); 
  const [volume, setVolume] = useState(1.0); // Volumen del video
  const { item } = route.params;

  // Función para cambiar el volumen
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    videoRef.current.setStatusAsync({
      volume: newVolume
    });
  };
  
  {/* // Función para descargar el vídeo
  const handleScreenChange = async () => {
    if (videoUrl) {
      try {
        const supported = await Linking.canOpenURL(videoUrl);
        if (supported) {
          await Linking.openURL(videoUrl);
        } else {
          console.error("No se puede abrir el enlace de descarga.");
        }
      } catch (error) {
        console.error("Error al abrir el enlace de descarga: ", error);
      }
    }
  };*/}

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
        style={styles.video}
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        onReadyForDisplay={videoData => {
          videoData.srcElement.style.position = "initial"
        }}
      />

      {/* Albert: Modifico el elemento Button por un TouchableOpacity para poder darle estilo */}
      {/* <View style={styles.botonPersonalizado}>
        <Button 
          color="#007bff"
          title={status.isPlaying ? 'Pausa' : 'Reproducir'}
          onPress={() =>
            status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()
          }
        />
      </View> */}

      <View style={styles.buttonContainer}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  volumeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
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
    marginTop: 10,
    width: '100%',
    aspectRatio: 16 / 9,
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
    marginTop: 5,
    borderRadius: 5,
    width: 200,
    height: 39,
    backgroundColor: '#007bff',
  },
  botonPersonalizadoMin: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
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
