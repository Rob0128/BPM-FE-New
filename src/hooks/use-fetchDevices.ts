import { useCallback, useContext, useState } from 'react';
import { MyContext } from '../context/context';
import { Device } from '../types/device';

const useFetchDevices = () => {
  const { state } = useContext(MyContext);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.json);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('errrrraaaa', errorText);

        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhere', data);

      setDevices(data.devices);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [state.auth.token]);

  return { devices, fetchDevices, loading, error };
};

export default useFetchDevices;
