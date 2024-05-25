export type AuthType = {
  token: string;
};

export type UpdateUserType = {
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

export type InputCreatePlaylistType = {
  value: string;
};

export type UpdatePlaylistsType = {
  id: string;
  name: string;
  description?: string;
  images: [
    {
      url?: string;
    },
  ];
};

export type DetailPlaylistsData = {
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

export type SnapshotUpdateType = {
  snapshot_id: string;
};

export type TestStringUpdateType = {
  test_string: string[];
};

export type TestStringSavedUpdateType = {
  test_string_saved: string[];
};

export type TestStringRecommendedUpdateType = {
  test_string_recommended: string[];
};

export type InitialState = {
  auth: AuthType;
  updateUser: UpdateUserType;
  inputCreatePlaylist: InputCreatePlaylistType;
  updatePlaylists: UpdatePlaylistsType[];
  detailPlaylists: DetailPlaylistsData;
  snapshotUpdate: SnapshotUpdateType;
  teststringUpdate: TestStringUpdateType;
  testStringSavedUpdate: TestStringSavedUpdateType;
  testStringRecommendedUpdate: TestStringRecommendedUpdateType;

};

export type AudioFeatures = {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
};