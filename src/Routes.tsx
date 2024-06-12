import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {horizontalAnimation, verticalAnimation} from './utils/transition';
import {MyTheme} from './utils/theme';
import Login from './screens/login/Login';
import useLogin from './hooks/use-login';
import BottomNav from './components/bottom-navigation/BottomNav';
import AddPlaylist from './screens/add-playlist/AddPlaylist';
import AddSongs from './screens/add-songs/AddSongs';
import ChoosePlaylist from './screens/choose-playlist/ChoosePlaylist';
import ChoosePlaylistRun from './screens/choose-playlist-run/ChoosePlaylistRun';
import TempoPage from './screens/tempo-page/TempoPage';
import Main from './screens/main/Main';
import Run from './screens/run/Run';


const Stack = createStackNavigator();

const Routes = () => {
  const {state} = useLogin();

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={horizontalAnimation}>
        {state.auth.token === '' ? (
          <>
            <Stack.Screen name="Login" component={Login} />
          </>
        ) : (
          <>
            <Stack.Group>
              <Stack.Screen name="Bottom Navigation" component={BottomNav} />
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="Run" component={Run} />
            </Stack.Group>
            <Stack.Group
              screenOptions={{
                presentation: 'transparentModal',
              }}>
              <Stack.Screen
                name="Add Playlist"
                component={AddPlaylist}
                options={verticalAnimation}
              />
              <Stack.Screen
                name="Add Songs"
                component={AddSongs}
                options={verticalAnimation}
              />
              <Stack.Screen
                name="Choose Playlist"
                component={ChoosePlaylist}
                options={verticalAnimation}
              />
              <Stack.Screen
                name="Tempo Page"
                component={TempoPage}
                options={verticalAnimation}
                initialParams={String ? { propObject: String } : undefined} 
                />
              <Stack.Screen
                name="Choose Playlist Run"
                component={ChoosePlaylistRun}
                options={verticalAnimation}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
