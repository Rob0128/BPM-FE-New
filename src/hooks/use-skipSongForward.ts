import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/context';

const useSkipToNextTrack = () => {
  const { state } = useContext(MyContext);
  const [loadingSN, setLoading] = useState(false); // Add loading state
  const [errorSN, setError] = useState<Error | null>(null); // Add error state

  const skipToNextTrack = useCallback(async (deviceId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceId ? { device_id: deviceId } : {}),
      });

      if (!response.ok) {
        throw new Error(`Failed to skip to the next track: ${response.statusText}`);
      }

    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false); // Ensure loading is set to false after the request
    }
  }, [state.auth.token]); // Include dependency on the auth token

  return { skipToNextTrack, loadingSN, errorSN };
};

export default useSkipToNextTrack;
