import React, {useCallback, useContext, useEffect} from 'react';
import {MyContext} from '../context/context';
// import {AuthContext} from '../context/auth-context';
import {CurrentPlaylist2} from '../types/playlist';

const useCurrentTracks = () => {
  const {state} = useContext(MyContext);
  const [savedTracks, setSavedTracks] =
    React.useState<CurrentPlaylist2[]>();

  const getCurrentPlaylists = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks', {
        signal,
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSavedTracks([...data.items]);
    } catch (error) {
      console.log(error);
    }
    return () => controller.abort();
  }, [state.auth.token]);

  useEffect(() => {
    getCurrentPlaylists();
  }, [getCurrentPlaylists, state.updatePlaylists]);

  return savedTracks;
};
export default useCurrentTracks;
