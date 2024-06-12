import React, {createContext, FC, useMemo, useReducer} from 'react';
import {
  AuthActions,
  authReducer,
  DetailPlaylistsActions,
  detailPlaylistsReducer,
  InputCreatePlaylistActions,
  inputCreatePlaylistReducer,
  SnapshotUpdateActions,
  snapshotUpdateReducer,
  UpdatePlaylistsActions,
  updatePlaylistsReducer,
  UpdateUserActions,
  updateUserReducer,
  TestStringUpdateActions,
  testStringUpdateReducer,
  TestStringSavedUpdateActions,
  CurrentPlaylistIdUpdateActions,
  currentPlaylistIdUpdateReducer,
  testStringSavedUpdateReducer,
  TestStringRecommendedUpdateActions,
  testStringRecommendedUpdateReducer,
} from '../reducers/reducers';
import {InitialState} from '../types/context-type';
import { CurrentPlaylist } from '../types/playlist';

const contextInitialState: InitialState = {
  auth: {
    token: '',
  },
  updateUser: {
    id: '',
    images: [
      {
        url: '',
      },
    ],
    display_name: '',
    followers: {
      total: 0,
    },
  },
  inputCreatePlaylist: {
    value: '',
  },
  updatePlaylists: [],
  detailPlaylists: {
    id: '',
    description: '',
    images: [
      {
        url: '',
      },
    ],
    name: '',
    owner: {
      display_name: '',
    },
  },
  snapshotUpdate: {
    snapshot_id: '',
  },
  teststringUpdate: {
    test_string: [],
  },
  currentPlaylistIdUpdate: {
    current_playlist_id: '',
  },
  testStringSavedUpdate: {
    test_string_saved: [],
  },
  testStringRecommendedUpdate: {
    test_string_recommended: [],
  },
};

const MyContext = createContext<{
  state: InitialState;
  dispatch: React.Dispatch<
    | AuthActions
    | UpdateUserActions
    | InputCreatePlaylistActions
    | UpdatePlaylistsActions
    | DetailPlaylistsActions
    | SnapshotUpdateActions
    | TestStringUpdateActions
    | CurrentPlaylistIdUpdateActions
    | TestStringSavedUpdateActions
    | TestStringRecommendedUpdateActions
  >;
}>({
  state: contextInitialState,
  dispatch: () => {},
});

const mainReducer = (
  {
    auth,
    updateUser,
    inputCreatePlaylist,
    updatePlaylists,
    detailPlaylists,
    snapshotUpdate,
    teststringUpdate,
    testStringSavedUpdate,
    currentPlaylistIdUpdate,
    testStringRecommendedUpdate,
  }: InitialState,
  action: any,
) => ({
  auth: authReducer(auth, action),
  updateUser: updateUserReducer(updateUser, action),
  inputCreatePlaylist: inputCreatePlaylistReducer(inputCreatePlaylist, action),
  updatePlaylists: updatePlaylistsReducer(updatePlaylists, action),
  detailPlaylists: detailPlaylistsReducer(detailPlaylists, action),
  snapshotUpdate: snapshotUpdateReducer(snapshotUpdate, action),
  teststringUpdate: testStringUpdateReducer(teststringUpdate, action),
  currentPlaylistIdUpdate: currentPlaylistIdUpdateReducer(currentPlaylistIdUpdate, action),
  testStringSavedUpdate: testStringSavedUpdateReducer(testStringSavedUpdate, action),
  testStringRecommendedUpdate: testStringRecommendedUpdateReducer(testStringRecommendedUpdate, action),
});

const ContextProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(mainReducer, contextInitialState);

  const value = useMemo(() => ({state, dispatch}), [state, dispatch]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export {MyContext, ContextProvider};
