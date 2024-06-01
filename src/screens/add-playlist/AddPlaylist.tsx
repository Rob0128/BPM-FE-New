import { StyleSheet, Dimensions, ScrollView, View, Text } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import styled from '@emotion/native';
import LinearGradient from 'react-native-linear-gradient';
import useCreatePlaylist from '../../hooks/use-createPlaylist';
import { MyContext } from '../../context/context';
import { Types } from '../../types/reducer-type';
import CloseIcon from '../../assets/icons/close-icon';
import { NavigationContext, useRoute, RouteProp } from '@react-navigation/native';
import useGetAudioFeatures from '../../hooks/use-getAudioFeatures';

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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type AudioFeature = {
  id: string;
  danceability: number;
  energy: number;
  tempo: number;
};

type RouteParams = {
  id: string;
};

const BottomSheet = () => {
  const navigation = useContext(NavigationContext);
  const { state, dispatch } = useContext(MyContext);
  const { createPlaylist } = useCreatePlaylist();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const id = route?.params?.id;
  const [playlistTitleString, setPlaylistTitleString] = useState('');
  const [filteredAudioFeatures, setFilteredAudioFeatures] = useState<AudioFeature[]>([]);

  const audioFeatures = useGetAudioFeatures();

  const sortAndFilterAudioFeatures = (criteria: { sortOrder: string; tempoRange: { min: number; max: number; }; }) => {
    let sortedFilteredFeatures = [...audioFeatures];
    console.log(criteria.sortOrder);

    if (criteria.sortOrder === 'trendup') {
      sortedFilteredFeatures.sort((a, b) => a.tempo - b.tempo);
    } else if (criteria.sortOrder === 'trenddown') {
      sortedFilteredFeatures.sort((a, b) => b.tempo - a.tempo);
    } else if (criteria.sortOrder === 'trendstraight') {
      sortedFilteredFeatures = sortedFilteredFeatures.filter(item => item.tempo >= 120 && item.tempo <= 140);
      sortedFilteredFeatures.sort((a, b) => a.tempo - b.tempo);
    } else if (criteria.sortOrder === 'trendupdown') {
      sortedFilteredFeatures.sort((a, b) => a.tempo - b.tempo);
      sortedFilteredFeatures = [
        ...sortedFilteredFeatures,
        ...sortedFilteredFeatures.slice().reverse(),
      ];
    }
    if (criteria.tempoRange) {
      sortedFilteredFeatures = sortedFilteredFeatures.filter(
        feature =>
          feature.tempo >= criteria.tempoRange.min &&
          feature.tempo <= criteria.tempoRange.max
      );
    }
    console.log(state.teststringUpdate.test_string);
    console.log("audioFeatures");
    const trackIds = sortedFilteredFeatures.map((track: AudioFeature) => track.id);
    console.log(trackIds);
    console.log('Heerrrrreess the BEFORE');
    console.log(state.teststringUpdate.test_string);

    if (trackIds.length > 0){
      dispatch({type: Types.TestString,  payload: {test_string: trackIds}});
    }
    console.log('Heerrrrreess the AFTER');
    console.log(state.teststringUpdate.test_string);
    console.log(sortedFilteredFeatures);
    return sortedFilteredFeatures;
  };

  useEffect(() => {
    const criteria = {
      sortOrder: id, // Assuming id represents the sortOrder for now
      tempoRange: {
        min: 0,
        max: 200 // Adjust this as needed or dynamically
      }
    };
    const sortedAndFiltered = sortAndFilterAudioFeatures(criteria);
    setFilteredAudioFeatures(sortedAndFiltered);
  }, [id, audioFeatures]);

  return (
    <LinearGradient
      colors={['#535353', '#333', '#131313']}
      style={styles.bottomSheet}
    >
      <CloseButton onPress={() => navigation?.goBack()}>
        <CloseIcon />
      </CloseButton>
      <Container>
        <CommandTitle>Add to playlist</CommandTitle>
        <PlaylistInput
          autoFocus={true}
          defaultValue={`Playlist #${id}`}
          onChangeText={text =>
            setPlaylistTitleString(text)
            // dispatch({
            //   type: Types.InputCreatePlaylist,
            //   payload: {
            //     value: text,
            //   },
            // })
          }
        />
      </Container>
      <AddButton onPress={() => createPlaylist(playlistTitleString)}>
        <TextButton>Create</TextButton>
      </AddButton>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredAudioFeatures.map((feature: { id: string; danceability: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; energy: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; tempo: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
          <View key={feature.id} style={styles.card}>
            <Text style={styles.text}>ID: {feature.id}</Text>
            <Text style={styles.text}>Danceability: {feature.danceability}</Text>
            <Text style={styles.text}>Energy: {feature.energy}</Text>
            <Text style={styles.text}>Tempo: {feature.tempo}</Text>
            {/* Add more fields as necessary */}
          </View>
        ))}
      </ScrollView>
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
  scrollContainer: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '90%',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
