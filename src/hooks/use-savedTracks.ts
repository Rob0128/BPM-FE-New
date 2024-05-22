import React, { useCallback, useContext, useEffect } from 'react';
import { MyContext } from '../context/context';
import { CurrentPlaylist2 } from '../types/playlist';
import { Types } from '../types/reducer-type';

const useCurrentTracks = () => {
  const { state, dispatch } = useContext(MyContext);
  const [savedTracks, setSavedTracks] = React.useState<CurrentPlaylist2[]>();
  const [songIds, setSongIds] = React.useState<string[]>();


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
      const items = data.items;
      const ids = items.map((item: { track: { id: any } }) => item.track.id);
      
      setSavedTracks(items);
      dispatch({ type: Types.TestStringSaved, payload: { test_string_saved: ids } });
    } catch (error) {
      console.log(error);
    }
    return () => controller.abort();
  }, [state.auth.token]);

  useEffect(() => {
    getCurrentPlaylists().then(() => {
      if (songIds !== undefined) {
        // dispatch({ type: Types.TestString, payload: { test_string: songIds } });
      } else {
        // dispatch({ type: Types.TestString, payload: { test_string: "songIds[0]" } });
      }
    });
  }, [getCurrentPlaylists, songIds, dispatch]);


  return { savedTracks };
};

export default useCurrentTracks;