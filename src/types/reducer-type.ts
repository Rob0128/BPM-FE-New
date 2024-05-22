export type ActionMap<M extends {[index: string]: any}> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  Auth = 'AUTH',
  UpdateUser = 'UPDATE_USER',
  InputCreatePlaylist = 'INPUT_CREATE_PLAYLIST',
  UpdatePlaylists = 'UPDATE_PLAYLISTS',
  DetailPlaylists = 'DETAIL_PLAYLISTS',
  SnapshotUpdate = 'SNAPSHOT_UPDATE',
  TestString = 'TEST_STRING',
  TestStringSaved = 'TEST_STRING_SAVED',
  TestStringRecommended = 'TEST_STRING_RECOMMENDED',
}

export type AuthPayload = {
  [Types.Auth]: {
    token: string;
  };
};

export type UpdateUserPayload = {
  [Types.UpdateUser]: {
    images: [
      {
        url: string;
      },
    ];
    display_name: string;
    id: string;
    followers: {
      total: number;
    };
  };
};

export type InputCreatePlaylistPayload = {
  [Types.InputCreatePlaylist]: {
    value: string;
  };
};

export type UpdatePlaylistsPayload = {
  [Types.UpdatePlaylists]: {
    id: string;
    name: string;
    description?: string;
    images: [
      {
        url?: string;
      },
    ];
  };
};

export type DetailPlaylistsPayload = {
  [Types.DetailPlaylists]: {
    id: string;
    description: string;
    images: [
      {
        url: string;
      },
    ];
    name: string;
    owner: {
      display_name: string;
    };
  };
};

export type SnapshotUpdatePayload = {
  [Types.SnapshotUpdate]: {
    snapshot_id: string;
  };
};

export type TestStringPayload = {
  [Types.TestString]: {
    test_string: string[];
  };
};

export type TestStringSavedPayload = {
  [Types.TestStringSaved]: {
    test_string_saved: string[];
  };
};

export type TestStringRecommendedPayload = {
  [Types.TestStringRecommended]: {
    test_string_recommended: string[];
  };
};