import { Platform, RefreshControl, SafeAreaView, StatusBar, Text, View } from 'react-native';
import React, { useContext, useMemo } from 'react';
import useCurrentPlaylist from '../../hooks/use-currentPlaylist';
import useRecommendPlaylists from '../../hooks/use-playlist';
import useCurrentTracks from '../../hooks/use-savedTracks';
import useSongsInOrderBpm from '../../hooks/use-getSongsInOrderBpm';
import { Body } from '../../components/screens/home/styled/styles';
import YourPlaylists from '../../components/screens/home/YourPlaylists';
import NewRelease from '../../components/screens/home/NewRelease';
import RunningPlaylist from '../../components/screens/home/RunningPlaylist';
import SourceButton from '../../components/screens/buttons/ChooseSource';
import BrowseCategories from '../../components/screens/home/BrowseCategories';
import useRefresh from '../../hooks/use-refresh';
import styled from '@emotion/native';
import SavedSongs from '../../components/screens/home/SavedSongs';
import { TitleLarge } from '../../components/screens/home/styled/styles';
import { MyContext } from '../../context/context';

const ViewPadding = styled.View`
  padding: 6px 0px;
`;

const MarginBottomView = styled.View`
  margin-bottom: 100px;
`;

const Card = styled.View`
  background-color: #1e1e1e;
  padding: 20px 16px 0px 16px;
  margin: 10px 0;
  border-radius: 8px;
`;

const SafeAreaViewStyled = styled(SafeAreaView)`
  flex: 1;
`;

const BodyStyled = styled(Body)`
  background-color: black;
`;

const Home = () => {
  const currentPlaylist = useCurrentPlaylist();
  const { songsInOrderOfBpm } = useSongsInOrderBpm();
  const { savedTracks } = useCurrentTracks();
  const { newRelease, browseCategories } = useRecommendPlaylists();
  const { refreshing, onRefresh } = useRefresh();
  const { state } = useContext(MyContext);
  const emptyIds: string[] = [];
  const handleYourSavedSongsPress = () => {
    console.log('Your saved songs button pressed');
  };

  return (
    <SafeAreaViewStyled>
      {Platform.OS === 'ios' && (
        <StatusBar barStyle="light-content" translucent />
      )}
      <BodyStyled
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            title="Loading..."
            tintColor="#fff"
            titleColor="#fff"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <TitleLarge>Select the music you want to use</TitleLarge>
        {currentPlaylist?.length ? (
          <Card>
            <YourPlaylists data={currentPlaylist} refresh={refreshing} />
            <SourceButton label="Your playlists" backGroundColour='#1e1e1e' />
          </Card>
        ) : (
          <ViewPadding />
        )}
        {/* <RunningPlaylist data={songsInOrderOfBpm} /> */}
        <Card>
          <SavedSongs data={savedTracks} refresh={false} />
          <SourceButton label="Your saved songs" backGroundColour='#1e1e1e'/>
        </Card>
        <Card>
          <NewRelease data={newRelease} addCondition={currentPlaylist?.length} />
          <SourceButton label="Our recommendation" backGroundColour='#1e1e1e' />
        </Card>
        {/* <BrowseCategories data={browseCategories} /> */}
        <MarginBottomView>
        </MarginBottomView>
      </BodyStyled>
    </SafeAreaViewStyled>
  );
};

export default Home;
