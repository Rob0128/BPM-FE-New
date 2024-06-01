import { NavigationContext } from '@react-navigation/native';
import { useContext } from 'react';
import { MyContext } from '../context/context';
import useUser from './use-user';

const useCreatePlaylist = () => {
  const navigation = useContext(NavigationContext);
  const { state, dispatch } = useContext(MyContext);
  const isUser = useUser();

  const createPlaylist = async (name: any) => {
    try {
      console.log('Creating Playlist...');
      console.log(name);
      console.log(state.teststringUpdate.test_string);

      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${isUser?.id}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: 'Running playlist',
          public: true,
        }),
      });

      const playlistData = await createPlaylistResponse.json();
      console.log(playlistData);

      if (playlistData.id && state.teststringUpdate.test_string.length > 0) {
        console.log('Adding Tracks to Playlist...');

        // Format track IDs to Spotify URIs
        // const trackUris = state.teststringUpdate.test_string.map(id => `spotify:track:${id}`);
        const trackUris = state.teststringUpdate.test_string.map(id => `spotify:track:${id}`);

        console.log(trackUris);
        console.log(playlistData.id);

        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: trackUris,
          }),
        });

        const addTracksData = await addTracksResponse.json();
        console.log(addTracksData);
      }

      navigation?.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return { createPlaylist };
};

export default useCreatePlaylist;
