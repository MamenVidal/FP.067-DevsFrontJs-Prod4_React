import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';


const MultimediaScreen = ({ route }) => {
    const { fecha } = route.params;
    const [videoUrl, setVideoUrl] = useState('');

    // TODO: Obtener la URL del video de Firebase


    return (
        <View style={styles.container}>
            <Video
                source={{ uri: videoUrl }}
                style={styles.video}
                controls={true}
            />
        </View>
    );
};

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
});

export default MultimediaScreen;

