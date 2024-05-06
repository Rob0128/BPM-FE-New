import {FlatList, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import React, {FC} from 'react';
import styled from '@emotion/native';
import { Title } from './styled/styles';

const TitleRelease = styled.Text`
  font-size: 14px;
  color: #ddd;
  font-family: 'PlusJakartaSans-Bold';
  width: 160px;
`;

export const AppBar = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #060606;
`;

type Props = {
  data: any[] | undefined; // Change NewReleaseType[] to any[]
};

const RunningPlaylist: FC<Props> = ({data}) => {
  return (
    <>
      <AppBar>
        <Title>Running</Title>
      </AppBar>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        style={styles.container}
        data={data}
        keyExtractor={(item, index) => index.toString()} // Use index as the key since each item doesn't have an "id"
        renderItem={({item}) => (
          <TouchableOpacity style={styles.cardList}>
            {/* Display the JSON data */}
            <Text>{JSON.stringify(item)}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default RunningPlaylist;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap',
    marginVertical: 15,
    marginBottom: 30,
  },
  cardList: {
    marginHorizontal: 10,
  },
});
