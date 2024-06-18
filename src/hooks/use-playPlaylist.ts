import { useCallback, useContext } from 'react';
import {MyContext} from '../context/context';

interface PlayOptions {
  context_uri?: string;
  uris?: string[];
  offset?: {
    position?: number;
    uri?: string;
  };
  position_ms?: number;
}

const useStartPlayback = () => {
  const {state} = useContext(MyContext);

  console.log('eeieiiiii');
  const startPlayback = useCallback(async (options: PlayOptions | undefined) => {
    try {
      if (options === undefined){
        return
      }
      console.log(options.context_uri);
      const response = await fetch('https://api.spotify.com/v1/me/player/play/', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      console.log('Playback started successfully');
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  }, [state.auth.token]);

  return { startPlayback };
};

export default useStartPlayback;
