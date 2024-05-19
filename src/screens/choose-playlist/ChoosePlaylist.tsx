import {StyleSheet, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from 'react';
import styled from '@emotion/native';
import LinearGradient from 'react-native-linear-gradient';
import useCreatePlaylist from '../../hooks/use-createPlaylist';
import {MyContext} from '../../context/context';
import {Types} from '../../types/reducer-type';
import CloseIcon from '../../assets/icons/close-icon';
import {NavigationContext} from '@react-navigation/native';
import useCurrentPlaylist from '../../hooks/use-currentPlaylist';
import {
  AppBar,
  PlaylistsImageTrack,
  PlaylistsTitle,
  Title,
} from '../../components/screens/home/styled/styles';

const PlaylistInput = styled.TextInput`
  color: #fff;
  font-size: 28px;
  text-align: center;
  font-family: 'PlusJakartaSans-ExtraBold';
`;

const CommandTitle = styled.Text`
  font-size: 18px;
  font-family: 'PlusJakartaSans-Bold';
  color: #fff;
  align-self: center;
  margin-bottom: 10px;
`;

const Container = styled.View`
  padding-top: 20%;
  border-bottom-width: 2px;
  border-bottom-color: #fff;
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 100px;
  padding: 10px;
  height: 50px;
  width: 35%;
  margin-top: 50px;
`;

const TextButton = styled.Text`
  font-size: 16px;
  font-family: 'PlusJakartaSans-Bold';
  align-self: center;
  color: #000;
`;

const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-right: 3%;
  margin-top: 3%;
`;

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const BottomSheet = () => {
  const navigation = useContext(NavigationContext);
  const {dispatch} = useContext(MyContext);
  const {createPlaylist} = useCreatePlaylist();
  const currentPlaylist = useCurrentPlaylist();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(''); 


  return (
    <LinearGradient
      colors={['#535353', '#333', '#131313']}
      style={styles.bottomSheet}>
      <CloseButton onPress={() => navigation?.goBack()}>
        <CloseIcon />
      </CloseButton>
      <Container>
        <CommandTitle>Choose playlist</CommandTitle>
        <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        overScrollMode="never"
        data={currentPlaylist}
        horizontal={true}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
          style={[styles.cardList, item.id === selectedPlaylistId && styles.selectedCard]} 
          onPress={() => {
            setSelectedPlaylistId(item.id);
            navigation?.navigate('Detail Playlists', { data: item });
              //basically just route to the next screen (the tempo screen) here with the 'item' which should be the selected playlist
          }}>
            <PlaylistsImageTrack
              source={{
                uri:
                  item?.images[0]?.url === undefined
                    ? 'https://user-images.githubusercontent.com/57744555/171692133-4545c152-1f12-4181-b1fc-93976bdbc326.png'
                    : item?.images[0]?.url,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
        {/* <PlaylistInput
          autoFocus={true}
          defaultValue="My Playlist #1"
          onChangeText={text =>
            dispatch({
              type: Types.InputCreatePlaylist,
              payload: {
                value: text,
              },
            })
          }
        /> */}
      </Container>
      {/* actually want to make the api call to get playlist and then all song ids and set state for them first */}
      <AddButton onPress={() => navigation?.navigate('Tempo Page')}>
        <TextButton>Select</TextButton>
      </AddButton>
    </LinearGradient>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    height: SCREEN_HEIGHT,
    width: '100%',
    alignItems: 'center',
    top: SCREEN_HEIGHT / 6,
    borderRadius: 16,
  },
  container: {
    marginVertical: 10,
    marginBottom: 40,
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  cardList: {
    marginTop: 10,
    marginEnd: 18,
  },
  selectedCard: {
    borderColor: '#fff', // Border style when the playlist is selected
  },
});
