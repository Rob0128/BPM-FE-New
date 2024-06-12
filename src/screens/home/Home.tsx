import { Platform, SafeAreaView, StatusBar, View, TouchableOpacity, Text } from 'react-native';
import React, { useContext } from 'react';
import styled from '@emotion/native';
import { NavigationContext } from '@react-navigation/native';


const SafeAreaViewStyled = styled(SafeAreaView)`
  flex: 1;
  background-color: black;
  justify-content: center;
  align-items: center;
`;

const SpotifyGreenButton = styled(TouchableOpacity)`
  background-color: #1DB954;
  padding: 15px 30px;
  border-radius: 25px;
  margin-bottom: 20px;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Home = () => {
  const navigation = useContext(NavigationContext);

  const handleCreatePlaylistPress = () => {
    navigation?.navigate('Main');
  };

  const handleGoForRun = () => {
    navigation?.navigate('Choose Playlist Run');
  };

  return (
    <SafeAreaViewStyled>
      {Platform.OS === 'ios' && (
        <StatusBar barStyle="light-content" translucent />
      )}
      <SpotifyGreenButton onPress={handleCreatePlaylistPress}>
        <ButtonText>Create a Playlist</ButtonText>
      </SpotifyGreenButton>
      <SpotifyGreenButton onPress={handleGoForRun}>
        <ButtonText>Go for a run</ButtonText>
      </SpotifyGreenButton>
    </SafeAreaViewStyled>
  );
};

export default Home;
