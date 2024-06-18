import { useCallback, useContext } from 'react';
import { MyContext } from '../context/context';

const usePausePlayback = () => {
  const { state } = useContext(MyContext);

  const pausePlayback = useCallback(async (deviceId) => {
    try {
      const url = deviceId 
        ? `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`
        : 'https://api.spotify.com/v1/me/player/pause';

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      console.log('Playback paused successfully');
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  }, [state.auth.token]);

  return { pausePlayback };
};

export default usePausePlayback;
