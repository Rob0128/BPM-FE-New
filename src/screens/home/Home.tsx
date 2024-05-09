import {Platform, RefreshControl, SafeAreaView, StatusBar} from 'react-native';
import React from 'react';
import useCurrentPlaylist from '../../hooks/use-currentPlaylist';
import useRecommendPlaylists from '../../hooks/use-playlist';
import useCurrentTracks from '../../hooks/use-savedTracks';
import useSongsInOrderBpm from '../../hooks/use-getSongsInOrderBpm';
import {Body} from '../../components/screens/home/styled/styles';
import YourPlaylists from '../../components/screens/home/YourPlaylists';
import NewRelease from '../../components/screens/home/NewRelease';
import RunningPlaylist from '../../components/screens/home/RunningPlaylist';
import SourceButton from '../../components/screens/buttons/ChooseSource';
import BrowseCategories from '../../components/screens/home/BrowseCategories';
import useRefresh from '../../hooks/use-refresh';
import styled from '@emotion/native';
import SavedSongs from '../../components/screens/home/SavedSongs';

const ViewPadding = styled.View`
  padding: 6px 20px;
`;

const Home = () => {
  const currentPlaylist = useCurrentPlaylist();
  const {songsInOrderOfBpm} = useSongsInOrderBpm();
  const savedTracks = useCurrentTracks();
  const {newRelease, browseCategories} = useRecommendPlaylists();
  const {refreshing, onRefresh} = useRefresh();
  const buttonText = "this button";

  return (
    <SafeAreaView>
      {Platform.OS === 'ios' && (
        <StatusBar barStyle="light-content" translucent />
      )}
      <Body
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
        {currentPlaylist?.length ? (
          <YourPlaylists data={currentPlaylist} refresh={refreshing} />
        ) : (
          <ViewPadding />
        )}
        
        {/* <RunningPlaylist data={songsInOrderOfBpm} /> */}
        <SourceButton label={buttonText} />
        <SavedSongs data={savedTracks} refresh={false} />
        <NewRelease data={newRelease} addCondition={currentPlaylist?.length} />
        <BrowseCategories data={browseCategories} />
      </Body>
    </SafeAreaView>
  );
};

export default Home;
