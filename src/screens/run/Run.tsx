import React, { useContext, useEffect, useState, useRef } from 'react';
import { Platform, SafeAreaView, StatusBar, TouchableOpacity, Text, Dimensions, PanResponder, PanResponderInstance, Alert } from 'react-native';
import { MyContext } from '../../context/context';
import styled from '@emotion/native';
import { NavigationContext } from '@react-navigation/native';
import useUpdateRun from '../../hooks/use-updateRun';
import useGetAudioFeatures from '../../hooks/use-getAudioFeatures';
import { ButtonText } from '../../components/screens/detail-playlists/styled/styled';
import useGetCurrentSong from '../../hooks/use-getCurrentSong';
import useStartPlayback from '../../hooks/use-playPlaylist';
import { PlayOptions } from '../../types/playlist';


const BpmSlider = styled.View`
  width: 100%;
  height: 50px;
  background-color: #333;
  position: relative;
`;

const BpmThumb = styled.View`
  width: 50px;
  height: 50px;
  background-color: #1db954;
  border-radius: 25px;
  position: absolute;
`;

const SongName = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const SpotifyGreenButton = styled(TouchableOpacity)`
  background-color: #1DB954;
  padding: 15px 30px;
  border-radius: 25px;
  margin-bottom: 20px;
  align-items: center;
`;

interface AudioFeature {
  id: string;
  tempo: number;
}

const Home: React.FC = () => {
  const navigation = useContext(NavigationContext);
  const { updateRun } = useUpdateRun();
  const { state } = useContext(MyContext);
  const { audioFeatures, loading } = useGetAudioFeatures();
  const { startPlayback } = useStartPlayback();
  const { currentSong, fetchCurrentSong } = useGetCurrentSong();
  const [thumbPosition, setThumbPosition] = useState(0);
  const [songName, setSongName] = useState('');
  const panResponder = useRef<PanResponderInstance | null>(null);
  const sortedFeatures = useRef<AudioFeature[]>([]);
  const po = useRef<PlayOptions>({
    context_uri: '',
    position_ms: 0
  });

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    console.log(state.currentPlaylistIdUpdate.current_playlist_id);

      po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
      po.current.position_ms = 0;
    
    console.log('FUUUCK', state.currentPlaylistIdUpdate.current_playlist_id);
    console.log(po.current);
    startPlayback(po.current);
    if (audioFeatures && audioFeatures.length > 0) {
      sortedFeatures.current = audioFeatures.sort((a, b) => a.tempo - b.tempo);
      const minBpm = sortedFeatures.current[0].tempo;
      const maxBpm = sortedFeatures.current[sortedFeatures.current.length - 1].tempo;
      const bpmRange = maxBpm - minBpm;
      const thumbPositions = sortedFeatures.current.map((feature) => {
        const bpmNormalized = (feature.tempo - minBpm) / bpmRange;
        return bpmNormalized * (screenWidth - 50);
      });
      setThumbPosition(thumbPositions[0]);
      setSongName(sortedFeatures.current[0].id);
    }
  }, [audioFeatures, screenWidth]);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const thumbPos = Math.max(0, Math.min(gestureState.moveX, screenWidth - 50));
        setThumbPosition(thumbPos);

        if (sortedFeatures.current.length > 0) {
          const minBpm = sortedFeatures.current[0].tempo;
          const maxBpm = sortedFeatures.current[sortedFeatures.current.length - 1].tempo;
          const bpmRange = maxBpm - minBpm;
          const bpmNormalized = thumbPos / (screenWidth - 50);
          const bpm = minBpm + bpmNormalized * bpmRange;
          const closestFeature = sortedFeatures.current.reduce((prev, curr) =>
            Math.abs(curr.tempo - bpm) < Math.abs(prev.tempo - bpm) ? curr : prev
          );
          setSongName(closestFeature.id);
        }
      }
    });
  }, [screenWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentSong();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchCurrentSong]);

  useEffect(() => {
    if (currentSong && currentSong.item) {
      const currentSongId = currentSong.item.id;
      const index = sortedFeatures.current.findIndex(feature => feature.id === currentSongId);
      if (index !== -1) {
        const thumbPos = index / (sortedFeatures.current.length - 1) * (screenWidth - 50);
        setThumbPosition(thumbPos);
      } else {
        // Show a popup if the song is not found in the list
        Alert.alert('Playlist Stopped', 'The currently playing song is not in the playlist.', [{ text: 'OK' }]);
      }
      //setSongName(currentSong)
      setSongName(currentSong.item.name);
    }
  }, [currentSong, sortedFeatures.current, screenWidth]);

  const handleChoosePress = () => {
    updateRun('rrf', 5);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" translucent />}
      {state.teststringUpdate.test_string.length < 1 ? (
        <SpotifyGreenButton onPress={() => navigation?.navigate('Choose Playlist Run')}>
          <ButtonText>Choose Playlist</ButtonText>
        </SpotifyGreenButton>
      ) : (
        <>
          <SpotifyGreenButton onPress={handleChoosePress}>
            <ButtonText>Go</ButtonText>
          </SpotifyGreenButton>
          <BpmSlider>
            <BpmThumb
              style={{ left: thumbPosition }}
              {...(panResponder.current ? panResponder.current.panHandlers : {})}
            />
          </BpmSlider>
          <SongName>{songName}</SongName>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
