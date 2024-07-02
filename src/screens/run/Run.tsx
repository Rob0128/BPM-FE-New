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
  Alert,
  AppState,
  AppStateStatus,
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
import useSkipToNextTrack from '../../hooks/use-skipSongForward';
import useSkipToPreviousTrack from '../../hooks/use-skipSongBackward';

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

const SpotifyBigGreenButton = styled(TouchableOpacity)`
  background-color: #1DB954;
  padding: 20px 40px;
  border-radius: 25px;
  margin-bottom: 20px;
  align-items: center;
`;

const SmallButton = styled(TouchableOpacity)`
  background-color: #1DB954;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 0 10px;
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
  const { getAudioFeatures, audioFeatures, loading } = useGetAudioFeatures();
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
  const { skipToPreviousTrack, loadingSP, errorSP } = useSkipToPreviousTrack();

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

  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active' && !hasUpdatedOnForeground) {
        console.log('App has come to the foreground!');
        fetchDevices();
        po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
        po.current.position_ms = 0;
        fetchCurrentSong().then(() => {
          updatePlaybackOffset();
          startPlayback(po.current);
        });
        setHasUpdatedOnForeground(true);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, hasUpdatedOnForeground]);
  
  useEffect(() => {
    console.log('devicccceesss', devices);
    console.log('Devices:', devices);
    if (devices.length === 0) {
      setNoDeviceWarning(true);
    } else if (devices.length > 1) {
      setNoDeviceWarning(false);
      const deviceOptions = devices.map((device) => ({
        text: device.name,
        onPress: () => handleDeviceSelection(device),
      }));

      Alert.alert(
        'Select Device',
        'Please select a device to play on:',
        deviceOptions,
        { cancelable: true }
      );
    } else {
      setNoDeviceWarning(false);
      handleDeviceSelection(devices[0]);
      console.log('Only one device found:', devices[0]);
    }
  }, [devices]);

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
    await skipToNextTrack();
    await fetchCurrentSong();
  };

  const handleSkipToPrevious = async () => {
    await skipToPreviousTrack();
    await fetchCurrentSong();
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
      const deviceId = selectedDevice?.id;
      await pausePlayback(deviceId);
      setIsPlaying(false);
      isPlayingRef.current = false;
      console.log('Paused playback');
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
      isPlayingRef.current = true;
      
      po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
      po.current.position_ms = 0;
      await updatePlaybackOffset();
      await startPlayback(po.current);
      
      console.log('Started playback');
      await fetchCurrentSong();
    } catch (error) {
      setIsPlaying(false);
      isPlayingRef.current = false;
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
      setShowGoButton(false); // Hide the Go button after pressing
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
      // TODO - maybe don't sort this here (or have a button for the user to decide)
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
      setIsPlaying(isPlayingCS);
      isPlayingRef.current = isPlayingCS
    }
  }, [currentSong, isPlayingCS, screenWidth]);

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
        <Text style={styles.BPMText}>BPM: {audioFeatures?.find((x) => currentSong?.item.id === x.id)?.tempo}</Text>
          {noDeviceWarning && <Text style={{ color: 'red', marginBottom: 10 }}>No active Spotify device found. Please start playing music on a device.</Text>}
          <BpmSlider {...(panResponder.current && panResponder.current.panHandlers)}>
            {renderTickMarks()}
            <BpmThumb style={{ left: thumbPosition }} />
          </BpmSlider>
          <SongName>{currentSong?.item.name}</SongName>
          <View style={styles.controlsContainer}>
          <SmallButton onPress={handleSkipToPrevious}>
            <ButtonText>{'<<'}</ButtonText>
          </SmallButton>
          
          <View style={styles.playPauseContainer}>
            <SpotifyBigGreenButton onPress={handlePlay}>
              <ButtonText>Play</ButtonText>
            </SpotifyBigGreenButton>
            <SpotifyGreenButton onPress={handlePause}>
              <ButtonText>Pause</ButtonText>
            </SpotifyGreenButton>
          </View>
          
          <SmallButton onPress={handleSkipToNext}>
            <ButtonText>{'>>'}</ButtonText>
          </SmallButton>
        </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playPauseContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 80,
  },
  BPMText: {
    alignItems: 'center',
    fontSize: 26,
    paddingBottom: 80,
    color: '#fff',
  },
});

export default Home;
