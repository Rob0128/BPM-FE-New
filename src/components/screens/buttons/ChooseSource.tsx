import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';
import { NavigationContext } from '@react-navigation/native';
import {SongId} from '../../../types/playlist';
import {MyContext} from '../../../context/context';
import { Types } from '../../../types/reducer-type';

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
  background-color: #22B14C;
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
  const {state, dispatch} = useContext(MyContext);
  // dispatch({ type: Types.TestString, payload: { test_string: selectedSongIds } });

  // if(songIds === undefined){
  //   songIds = [];
  // }
  // if(songIds.length > 0){
  //   useEffect(() => {
  //     dispatch({type: Types.TestString,  payload: {test_string: songIds[0]}});
  
  //   });
  // }
  const handlePress = () => {
    if (label === 'Your playlists') {
      navigation?.navigate('Choose Playlist');
    } else if (label === 'Your saved songs') {
      dispatch({type: Types.TestString,  payload: {test_string: state.testStringSavedUpdate.test_string_saved}});
      navigation?.navigate(pageRedirect(label));
    }
    else{
      dispatch({type: Types.TestString,  payload: {test_string: state.testStringRecommendedUpdate.test_string_recommended}});
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
    },
  });