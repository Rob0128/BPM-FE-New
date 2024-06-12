import { useState, useCallback, useContext, useEffect } from 'react';
import { MyContext } from '../context/context';

interface CurrentSong {
  item: {
    name: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const useGetCurrentSong = () => {
  const { state } = useContext(MyContext);
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentSong = useCallback(async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('yyaaaaaaaaaaaaaaaaayyy', data);
        setCurrentSong(data);
      } else {
        throw new Error('Failed to fetch current song');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [state.auth.token]);

  useEffect(() => {
    fetchCurrentSong();
  }, [fetchCurrentSong]);

  return { currentSong, fetchCurrentSong, loading };
};

export default useGetCurrentSong;
