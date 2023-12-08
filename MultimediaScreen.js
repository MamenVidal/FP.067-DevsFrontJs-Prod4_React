import * as React from 'react';
import { View, StyleSheet, Button, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

function MulimediaScreen() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  
  const CustomButton = ({ onPress, title, color, backgroundColor }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      activeOpacity={0.8}
    >
    <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <CustomButton
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
        {/* Stop Button */}
        <CustomButton
            title="Stop"
            onPress={() => video.current.stopAsync()} 
            color="#FFF"
            backgroundColor="#FF0000"
        />
        {/* Mute Button */}
        <CustomButton
            title={status.isMuted ? 'Unmute' : 'Mute'}
            onPress={() =>
            video.current.setIsMutedAsync(!status.isMuted)
            }
        />
        {/* Increase Volume Button */}
        <CustomButton
            title="Subir Volumen"
            onPress={() => {
            let newVolume = Math.min(status.volume + 0.1, 1); 
            video.current.setVolumeAsync(newVolume);
            }}
        />

         {/* Decrease Volume Button */}
        <CustomButton
            title="Bajar Volumen"
            onPress={() => {
            let newVolume = Math.max(status.volume - 0.1, 0); 
            video.current.setVolumeAsync(newVolume);
            }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: 300,
        height: 200,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    
});

export default MulimediaScreen;

