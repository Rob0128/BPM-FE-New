import { NavigationContext } from '@react-navigation/native';
import { useContext } from 'react';
import { MyContext } from '../context/context';
import useUser from './use-user';

const useUpdateRun = () => {
  const navigation = useContext(NavigationContext);
  const { state } = useContext(MyContext);
  const isUser = useUser();

  // Helper function to handle fetch with retry logic
  const fetchWithRetry = async (url: string, options: RequestInit, retries: number, delay: number): Promise<Response> => {
    try {
      const response = await fetch(url, options);

      if (!response.ok && retries > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
      }

      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
      }
      throw error;
    }
  };

  const updateRun = async (playlistId: string, position: number) => {
    try {
      console.log('Starting Playlist...');
      console.log(`Playlist ID: ${playlistId}, Position: ${position}`);

      const options: RequestInit = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${playlistId}`,
          offset: {
            position: position,
          },
          position_ms: 0,
        }),
      };

      const playResponse = await fetchWithRetry('https://api.spotify.com/v1/me/player/play', options, 3, 1000);

      if (playResponse.status === 204) {
        console.log('Playback started successfully');
      } else {
        const responseData = await playResponse.json();
        console.log(responseData);
      }

      navigation?.goBack();
    } catch (error) {
      console.log('Error starting playback:', error);
    }
  };

  return { updateRun };
};

export default useUpdateRun;
