import {NavigationContext} from '@react-navigation/native';
import {useContext} from 'react';
import {MyContext} from '../context/context';
import {Types} from '../types/reducer-type';
import useUser from './use-user';

const useCreatePlaylist = () => {
  const navigation = useContext(NavigationContext);
  const {state, dispatch} = useContext(MyContext);
  const isUser = useUser();

  const createPlaylist = async (name:string) => {
    try {
      console.log('SEEEEEENNDDDDDIIINNGGGGG!!!!!!!!!!!!!!');
      console.log(name);
      Promise.all([
        fetch(`https://api.spotify.com/v1/users/${isUser?.id}/playlists`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            description: 'New playlist description',
            public: true,
          }),
        })
          .then(res => res.json())
          .then(result => console.log(result)),
        
      ]);
      navigation?.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return {createPlaylist};
};

export default useCreatePlaylist;
