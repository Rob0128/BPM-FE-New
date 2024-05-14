import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';
import { NavigationContext } from '@react-navigation/native';

const ButtonContainer = styled.View`
  padding-vertical: 10px;
  padding-bottom: 30px;

`;

const ButtonTouchable = styled.TouchableOpacity`
  width: 200px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: #5e9fa0;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: #fff;
`;

type Props = {
  label: string;
  backGroundColour: string;
};

const pageRedirect = (label: string) => {
    switch (label){
        case 'Your playlsits':
            return 'Choose Playlist'
        default: 
            //return 'Add Playlist'
            return 'Tempo Page'
    }
}

const MyButton = ({ label, backGroundColour }: Props) => {
  const navigation = useContext(NavigationContext);

  const handlePress = () => {
    if (label === 'Your playlists') {
      navigation?.navigate('Choose Playlist');
    } else {
      navigation?.navigate(pageRedirect(label));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: backGroundColour }]}>
    <ButtonContainer style={styles.container}>
      <ButtonTouchable onPress={handlePress}>
        <ButtonText>{label}</ButtonText>
      </ButtonTouchable>
    </ButtonContainer>
    </View>
  );
};

export default MyButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
  });