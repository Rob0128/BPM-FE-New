import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  PanResponder,
  PanResponderInstance,
  View,
  StyleSheet,
  Linking,
} from 'react-native';
import { MyContext } from '../../context/context';
import styled from '@emotion/native';
import { NavigationContext } from '@react-navigation/native';
import useUpdateRun from '../../hooks/use-updateRun';
import useGetAudioFeatures from '../../hooks/use-getAudioFeatures';
import { ButtonText } from '../../components/screens/detail-playlists/styled/styled';
import useGetCurrentSong from '../../hooks/use-getCurrentSong';
import useStartPlayback from '../../hooks/use-playPlaylist';
import useFetchDevices from '../../hooks/use-fetchDevices';
import { PlayOptions } from '../../types/playlist';
import { Device } from '../../types/device';
import usePausePlayback from '../../hooks/use-pausePlaylist';
import useSkipToNextTrack  from '../../hooks/use-skipSongForward';

const BpmSlider = styled.View`
  width: 90%;
  height: 50px;
  background-color: #333;
  position: relative;
  border-radius: 5px;
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

const TickMark = styled.View`
  width: 2px;
  height: 100%;
  background-color: #FFF;
  position: absolute;
  bottom: 0;
`;

interface AudioFeature {
  id: string;
  tempo: number;
}

const Home: React.FC = () => {
  const navigation = useContext(NavigationContext);
  const { state } = useContext(MyContext);
  const { audioFeatures, loading } = useGetAudioFeatures();
  const { startPlayback } = useStartPlayback();
  const { devices, fetchDevices, loading: loadingDevices, error } = useFetchDevices();
  const { currentSong, fetchCurrentSong, loadingCS, isPlayingCS } = useGetCurrentSong();
  const [thumbPosition, setThumbPosition] = useState(0);
  const songNameRef = useRef<string>('');
  const [songName, setSongName] = useState<string>('');
  const [noDeviceWarning, setNoDeviceWarning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showGoButton, setShowGoButton] = useState(true);
  const [hasUpdatedOnForeground, setHasUpdatedOnForeground] = useState(false);
  const panResponder = useRef<PanResponderInstance | null>(null);
  const sortedFeatures = useRef<AudioFeature[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { skipToNextTrack, loadingSN, errorSN } = useSkipToNextTrack();
  const po = useRef<PlayOptions>({
    context_uri: '',
    position_ms: 0,
    offset: { position: 0 },
  });
  const { pausePlayback } = usePausePlayback();
  const screenWidth = Dimensions.get('window').width;

  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSongChange = debounce((songId: string) => {
    const index = sortedFeatures.current.findIndex((feature) => feature.id === songId);
    if (index !== -1) {
      songNameRef.current = songId;
      setSongName(songId);
      po.current.offset = { position: index };
      po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
      po.current.position_ms = 0;
      startPlayback(po.current);
       // Update song name immediately when song changes
    }
  }, 100);

  const handleSkipToNext = async () => {
    await skipToNextTrack(); // Optionally pass device_id here
  };

  const updatePlaybackOffset = () => {
    if (currentSong && state.teststringUpdate.test_string) {
      const currentSongId = currentSong.item.id;
      const playlistTracks = state.teststringUpdate.test_string;
      const index = playlistTracks.findIndex(trackId => trackId === currentSongId);
      if (index !== -1) {
        po.current.offset = { position: index };
      } else {
        po.current.offset = { position: 0 };
      }
    }
  };

  const handleDeviceSelection = (device: Device) => {
    setSelectedDevice(device);
    setShowGoButton(false);
  };

  const handlePause = async () => {
    try {
      setIsPlaying(false);
      const deviceId = selectedDevice?.id;
      await pausePlayback(deviceId);
      isPlayingRef.current = false;
      await fetchCurrentSong();
    } catch (error) {
      console.error('Failed to pause playback:', error);
    }
  };

  const handleRefreshPress = () => {
    fetchDevices();
    po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
    po.current.position_ms = 0;
    updatePlaybackOffset();
    startPlayback(po.current);
  };

  const handlePlay = async () => {
    try {
      setIsPlaying(true);
      po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
      po.current.position_ms = 0;
      updatePlaybackOffset();
      await startPlayback(po.current);
      isPlayingRef.current = true;
      await fetchCurrentSong();

    } catch (error) {
      console.error('Failed to start playback:', error);
    }
  };

  const handleChoosePress = () => {
    const spotifyLink = "spotify:track:" + state.teststringUpdate.test_string[0];
    Linking.openURL(spotifyLink).catch((err) => {
      console.error("Failed to open Spotify link:", err);
    });

    try {
      po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
      po.current.position_ms = 0;
      updatePlaybackOffset();
      startPlayback(po.current);
      setShowGoButton(false);  // Hide the Go button after pressing
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDevices();
    po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
    po.current.position_ms = 0;
    updatePlaybackOffset();
    startPlayback(po.current);

    if (audioFeatures && audioFeatures.length > 0) {
      //TODO - maybe dont sort this here (or have a button for the user to decide)
      sortedFeatures.current = audioFeatures.sort((a, b) => a.tempo - b.tempo);
      updateThumbPositionAndSong(sortedFeatures.current[0].id);
    }
  }, [audioFeatures, screenWidth]);

  const updateThumbPositionAndSong = (songId: string) => {
    const index = sortedFeatures.current.findIndex((feature) => feature.id === songId);
    if (index !== -1) {
      const thumbPos = (index / (sortedFeatures.current.length - 1)) * (screenWidth - 50);
      setThumbPosition(thumbPos);
      songNameRef.current = songId;
      setSongName(songId);
    }
  };

  useEffect(() => {
    if (currentSong && currentSong.item) {
      updateThumbPositionAndSong(currentSong.item.id);
    }
  }, [currentSong, screenWidth]);

  // useEffect(() => {
  //   fetchCurrentSong();
  // }, [currentSong, ]);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const thumbPos = Math.max(0, Math.min(gestureState.moveX, screenWidth - 50));
        setThumbPosition(thumbPos);

        if (sortedFeatures.current.length > 0) {
          const index = Math.round((thumbPos / (screenWidth - 50)) * (sortedFeatures.current.length - 1));
          const selectedFeature = sortedFeatures.current[index];
          handleSongChange(selectedFeature.id);
        }
      },
    });
  }, [screenWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentSong();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchCurrentSong]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: 18 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderTickMarks = () => {
    return sortedFeatures.current.map((feature, index) => {
      if (index === 0) {
        return null;
      }
      const left = (index / (sortedFeatures.current.length - 1)) * (screenWidth - 50);
      return <TickMark key={feature.id} style={{ left }} />;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" />
      {showGoButton ? (
        <SpotifyGreenButton onPress={handleChoosePress}>
          <ButtonText>Go</ButtonText>
        </SpotifyGreenButton>
      ) : (
        <>
          {noDeviceWarning && <Text style={{ color: 'red', marginBottom: 10 }}>No active Spotify device found. Please start playing music on a device.</Text>}
          <BpmSlider {...(panResponder.current && panResponder.current.panHandlers)}>
            {renderTickMarks()}
            <BpmThumb style={{ left: thumbPosition }} />
          </BpmSlider>
          <SongName>{currentSong?.item.name}</SongName>
          {isPlayingCS ? (
            <SpotifyGreenButton onPress={handlePause}>
              <ButtonText>Pause</ButtonText>
            </SpotifyGreenButton>
          ) : (
            <SpotifyGreenButton onPress={handlePlay}>
              <ButtonText>Play</ButtonText>
            </SpotifyGreenButton>
          )}
          <SpotifyGreenButton onPress={handleSkipToNext} disabled={loading}>
          <ButtonText>Skip to Next Track</ButtonText>
          </SpotifyGreenButton>
          {devices.length > 1 ? (
            <SpotifyGreenButton onPress={() => navigation?.navigate('ChooseDevice', { onDeviceSelected: handleDeviceSelection })}>
              <ButtonText>Choose Device</ButtonText>
            </SpotifyGreenButton>
          ) : (
            <Text></Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  thumb: {
    width: 50,
    height: 50,
    backgroundColor: '#1DB954',
    borderRadius: 25,
    position: 'absolute',
  },
});

export default Home;
