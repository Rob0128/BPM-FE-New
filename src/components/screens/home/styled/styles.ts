import styled from '@emotion/native';
import {StyleSheet} from 'react-native';

export const Body = styled.ScrollView`
  height: 100%;
  padding: 0px 10px;
`;

export const AppBar = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0px 0px 0px;
  background-color: #1e1e1e;
`;

export const TitleLarge = styled.Text`
  font-size: 24px;
  font-family: 'PlusJakartaSans-Bold';
  letter-spacing: 1px;
  color: #fff;
  text-align:center;
  padding: 35px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-family: 'PlusJakartaSans-Bold';
  letter-spacing: 1px;
  color: #fff;
  padding-bottom: 5px;
`;

export const TitleAlt = styled.Text`
  font-size: 18px;
  font-family: 'PlusJakartaSans-Bold';
  letter-spacing: 1px;
  color: #fff;
  background-color: #1e1e1e;
  padding-top:10px;
  flexGrow: 1;
`;

export const PlaylistsImageTrack = styled.Image`
  width: 100px;
  height: 100px;
`;

export const PlaylistsTitle = styled.Text`
  font-size: 16px;
  color: #fff;
  font-family: 'PlusJakartaSans-Bold';
  width: 100px;
`;

export const ImageTrack = styled.Image`
  width: 100px;
  height: 100px;
`;

export const TitleTrack = styled.Text`
  font-size: 16px;
  color: #fff;
  font-family: 'PlusJakartaSans-Bold';s
  width: 160px; 
`;

export const BoxTitle = styled.View`
  width: 160px;
`;

export const stylesHome = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
});
