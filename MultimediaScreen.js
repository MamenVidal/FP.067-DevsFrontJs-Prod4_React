import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { environment } from './environments/environment';

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const storage = getStorage(app);

// Pantalla de reproducción de video
const MultimediaScreen = ({ route }) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true); 

  const { item } = route.params;

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
    return <View style={styles.container}><Text>No hay vídeo disponible para hoy</Text></View>;
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
      <TouchableOpacity
        style={styles.botonPersonalizado}
        onPress={() => (status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync())}>
        <Text style={styles.textoBoton}>{status.isPlaying ? 'Pausa' : 'Reproducir'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
    borderRadius: 5,
    width: 200,
    backgroundColor: '#007bff',
  },
  textoBoton: {
    color: 'white', // color del texto
    fontWeight: 'bold',
  },
});

export default MultimediaScreen;
