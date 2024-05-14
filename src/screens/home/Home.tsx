import { Platform, RefreshControl, SafeAreaView, StatusBar, Text, View } from 'react-native';
import React from 'react';
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
import {TitleLarge} from '../../components/screens/home/styled/styles';
const ViewPadding = styled.View`
  padding: 6px 20px;
`;

const MarginBottomView = styled.View`
  margin-bottom: 100px;
`;

const Home = () => {
  const currentPlaylist = useCurrentPlaylist();
  const { songsInOrderOfBpm } = useSongsInOrderBpm();
  const savedTracks = useCurrentTracks();
  const { newRelease, browseCategories } = useRecommendPlaylists();
  const { refreshing, onRefresh } = useRefresh();

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
        <TitleLarge>Select the music you want to use</TitleLarge>
        {currentPlaylist?.length ? (
          <YourPlaylists data={currentPlaylist} refresh={refreshing} />
        ) : (
          <ViewPadding />
        )}

        {/* <RunningPlaylist data={songsInOrderOfBpm} /> */}
        <SourceButton label="Your playlsits" backGroundColour='black'/>
        <SavedSongs data={savedTracks} refresh={false} />
        <SourceButton label="Your saved songs" backGroundColour='#1e1e1e'/>
        <NewRelease data={newRelease} addCondition={currentPlaylist?.length} />
        <SourceButton label="Our recomendation" backGroundColour='black'/>
        {/* <BrowseCategories data={browseCategories} /> */}
        <MarginBottomView>
        </MarginBottomView>
      </Body>
    </SafeAreaView>
  );
};

export default Home;
