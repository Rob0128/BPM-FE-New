import {useContext} from 'react';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MyContext } from '../../context/context';

const TempoPage = () => {
  const {state} = useContext(MyContext);

  return (
    <Text>Herrrrrooo {state.testStringSavedUpdate.test_string_saved[0]}</Text>

  );
};

export default TempoPage;

const styles = StyleSheet.create({
  // No styles needed for this component
});