import {useContext} from 'react';
import {authorize} from 'react-native-app-auth';
import {MyContext} from '../context/context';
import {Types} from '../types/reducer-type';

const authConfig = {
  clientId: '85a699fc623146a582314470ee52f0b3',
  // optional clien secret
  // clientSecret: 'client secret',
  redirectUrl: 'com.yourmusic://oauth/',
  scopes: ['playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'user-library-read', 'user-read-playback-state', 'user-modify-playback-state'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

export default function useLogin() {
  // const {token, setToken} = useContext(AuthContext);
  const {state, dispatch} = useContext(MyContext);

  const authLogin = async () => {
    try {
      const result = await authorize(authConfig);

      // setToken(result.accessToken);
      dispatch({
        type: Types.Auth,
        payload: {
          token: result.accessToken,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    state,
    authLogin,
  };
}
