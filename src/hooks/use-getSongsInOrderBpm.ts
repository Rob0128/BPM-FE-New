import React, {useContext, useEffect} from 'react';
import {MyContext} from '../context/context';
// import {AuthContext} from '../context/auth-context';
import {NewReleaseType} from '../types/playlist';

const useSongsInOrderBpm = () => {
  // const {token} = useContext(AuthContext);
  const {state} = useContext(MyContext);
  const [songsInOrderOfBpm, setSongsInOrderOfBpm] = React.useState<any[]>();
  const [browseCategories, setBrowseCategories] = React.useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      Promise.all([
        fetch('https://api.spotify.com/v1/me/tracks', {
          signal,
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(result => setSongsInOrderOfBpm(result.items)),
        // fetch(
        //   'https://api.spotify.com/v1/browse/categories?country=ID&limit=20',
        //   {
        //     signal,
        //     headers: {
        //       Authorization: `Bearer ${state.auth.token}`,
        //       'Content-Type': 'application/json',
        //     },
        //   },
        // )
        //   .then(res => res.json())
        //   .then(result => setBrowseCategories(result.items)),
      ]);
    } catch (error) {
      console.error(error);
    }
    return () => controller.abort();
  }, [state.auth.token]);

  return {songsInOrderOfBpm};
};
export default useSongsInOrderBpm;
