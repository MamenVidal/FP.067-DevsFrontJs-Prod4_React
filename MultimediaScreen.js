import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Video } from 'expo-av';
import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { environment } from './environments/environment';

// Inicializar Firebase
const app = initializeApp(environment.firebase);
const storage = getStorage(app);

const MultimediaScreen = ({ route }) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState({});

  const { item } = route.params;

  useEffect(() => {
    if (item && item.video) {
      const fetchVideoUrl = async () => {
        try {
          const url = await getDownloadURL(storageRef(storage, item.video));
          setVideoUrl(url);
        } catch (error) {
          console.error('Error al cargar el video: ', error);
        }
      };

      fetchVideoUrl();
    }
  }, [item]);

  if (!videoUrl) {
    return <View style={styles.container}><Text>Cargando video...</Text></View>;
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
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pausa' : 'Reproducir'}
          onPress={() =>
            status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MultimediaScreen;
