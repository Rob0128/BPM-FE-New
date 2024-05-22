import React, {useContext, useEffect} from 'react';
import {MyContext} from '../context/context';
// import {AuthContext} from '../context/auth-context';
import {NewReleaseType} from '../types/playlist';
import { Types } from '../types/reducer-type';

const useRecommendPlaylists = () => {
  const {state, dispatch} = useContext(MyContext);
  const [newRelease, setNewRelease] = React.useState<NewReleaseType[]>();
  const [browseCategories, setBrowseCategories] = React.useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      fetch('https://api.spotify.com/v1/browse/new-releases', {
        signal,
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(result => {
        setNewRelease(result.albums.items);
        const albumPromises = result.albums.items.map((album: { id: any; }) => (
          fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
            headers: {
              Authorization: `Bearer ${state.auth.token}`,
              'Content-Type': 'application/json',
            },
          }).then(res => res.json())
        ));

        Promise.all(albumPromises)
          .then(trackResults => {
            const trackIds = trackResults.reduce((ids: string[], tracks: any) => {
              ids.push(...tracks.items.map((track: any) => track.id));
              return ids;
            }, []);

            dispatch({ type: Types.TestStringRecommended, payload: { test_string_recommended: trackIds } });
          })
          .catch(error => {
            console.error(error);
          });
      });

      fetch('https://api.spotify.com/v1/browse/categories?country=ID&limit=20', {
        signal,
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(result => setBrowseCategories(result.categories.items));
    } catch (error) {
      console.error(error);
    }
    return () => controller.abort();
  }, [state.auth.token]);

  return {newRelease, browseCategories};
};
export default useRecommendPlaylists;
