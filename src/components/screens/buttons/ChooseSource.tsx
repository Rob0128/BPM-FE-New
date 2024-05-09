import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { NavigationContext } from '@react-navigation/native';

const ButtonContainer = styled.View`
  margin-vertical: 10px;
`;

const ButtonTouchable = styled.TouchableOpacity`
  width: 200px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: #007bff;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: #fff;
`;

type Props = {
  label: string;
};

const MyButton = ({ label }: Props) => {
  const navigation = useContext(NavigationContext);

  return (
    <ButtonContainer>
      <ButtonTouchable onPress={() => navigation?.navigate('Add Playlist')}>
        <ButtonText>{label}</ButtonText>
      </ButtonTouchable>
    </ButtonContainer>
  );
};

export default MyButton;
