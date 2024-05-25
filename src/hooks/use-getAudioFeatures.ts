import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/context';
import { AudioFeatures } from '../types/context-type';

const useGetAudioFeatures = () => {
  const { state } = useContext(MyContext);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>([]);

  const getAudioFeatures = useCallback(async (signal: AbortSignal) => {
    const ids = state.teststringUpdate.test_string;

    try {
      const promises = ids.map(async (id) => {
        const response = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
          signal,
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed to fetch audio features for id: ${id}`);
        }
      });

      const results = await Promise.all(promises);
      setAudioFeatures(results.filter(Boolean)); // Filter out null or undefined results
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error(error);
      }
    }
  }, [state.auth.token]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    getAudioFeatures(signal).then(() => {
      if (isMounted) {
        setAudioFeatures(audioFeatures);
      }
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [getAudioFeatures]);

  return audioFeatures;
};

export default useGetAudioFeatures;