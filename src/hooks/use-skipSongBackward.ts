import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/context';

const useSkipToPreviousTrack = () => {
  const { state } = useContext(MyContext);
  const [loadingSP, setLoading] = useState(false); // Add loading state
  const [errorSP, setError] = useState<Error | null>(null); // Add error state

  const skipToPreviousTrack = useCallback(async (deviceId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceId ? { device_id: deviceId } : {}),
      });

      if (!response.ok) {
        throw new Error(`Failed to skip to the previous track: ${response.statusText}`);
      }

    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false); // Ensure loading is set to false after the request
    }
  }, [state.auth.token]); // Include dependency on the auth token

  return { skipToPreviousTrack, loadingSP, errorSP };
};

export default useSkipToPreviousTrack;
