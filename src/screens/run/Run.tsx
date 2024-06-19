import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  PanResponder,
  PanResponderInstance,
  Alert,
  View,
  StyleSheet,
  Linking,
  AppState,
  AppStateStatus
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
  const { state } = useContext(MyContext);
  const { audioFeatures, loading } = useGetAudioFeatures();
  const { startPlayback } = useStartPlayback();
  const { devices, fetchDevices, loading: loadingDevices, error } = useFetchDevices();
  const { currentSong, fetchCurrentSong } = useGetCurrentSong();
  const [thumbPosition, setThumbPosition] = useState(0);
  const [songName, setSongName] = useState('');
  const [noDeviceWarning, setNoDeviceWarning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showGoButton, setShowGoButton] = useState(true);
  const [hasUpdatedOnForeground, setHasUpdatedOnForeground] = useState(false);
  const panResponder = useRef<PanResponderInstance | null>(null);
  const sortedFeatures = useRef<AudioFeature[]>([]);
  const po = useRef<PlayOptions>({
    context_uri: '',
    position_ms: 0,
    offset: { position: 0 },  // Initial dummy value
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
      po.current.offset = { position: index };
      po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
      po.current.position_ms = 0;
      startPlayback(po.current);
      setSongName(songId); // Update song name immediately when song changes
    }
  }, 300);

  const updatePlaybackOffset = () => {
    if (currentSong && state.teststringUpdate.test_string) {
      const currentSongId = currentSong.item.id;
      const playlistTracks = state.teststringUpdate.test_string;
      const index = playlistTracks.findIndex(trackId => trackId === currentSongId);
      console.log('Index of current song:', index);
      if (index !== -1) {
        po.current.offset = { position: index };
      } else {
        po.current.offset = { position: 0 };  // Default to first song if not found
      }
    }
  };

  const handleDeviceSelection = (device: Device) => {
    setSelectedDevice(device);
    setShowGoButton(false);
    console.log('Selected device:', device);
  };

  const handlePause = () => {
    const deviceId = selectedDevice?.id;
    pausePlayback(deviceId);
  };

  const handleRefreshPress = () => {
    fetchDevices();
    po.current.context_uri = state.currentPlaylistIdUpdate.current_playlist_id;
    po.current.position_ms = 0;
    updatePlaybackOffset();
    startPlayback(po.current);
  };

  const handleChoosePress = () => {
    const spotifyLink = "spotify:track:" + state.teststringUpdate.test_string[0];
    console.log('Spotify link:', spotifyLink);

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
          handleSongChange(closestFeature.id); // Play song as slider moves
        }
      },
    });
  }, [screenWidth]);

  useEffect(() => {
    if (currentSong && currentSong.item) {
      const currentSongId = currentSong.item.id;
      const index = sortedFeatures.current.findIndex((feature) => feature.id === currentSongId);
      if (index !== -1) {
        const thumbPos = (index / (sortedFeatures.current.length - 1)) * (screenWidth - 50);
        setThumbPosition(thumbPos);
      }
      setSongName(currentSong.item.name);
    }
  }, [currentSong, sortedFeatures.current, screenWidth]);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" />
      <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Select BPM</Text>
      <BpmSlider {...panResponder.current?.panHandlers}>
        <BpmThumb style={{ left: thumbPosition }} />
      </BpmSlider>
      <SongName>{songName}</SongName>
      {noDeviceWarning && <Text style={{ color: '#F00' }}>No devices available. Please check your Spotify devices.</Text>}
      {showGoButton && (
        <SpotifyGreenButton onPress={handleChoosePress}>
          <ButtonText>Go!</ButtonText>
        </SpotifyGreenButton>
      )}
      {!showGoButton && (
        <TouchableOpacity onPress={handlePause} style={styles.pauseButton}>
          <Text style={{ color: '#FFF' }}>Pause Playback</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    color: 'white',
  },
  deviceNameBold: {
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Home;