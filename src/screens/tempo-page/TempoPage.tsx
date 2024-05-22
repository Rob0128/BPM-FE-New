import { useContext, useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MyContext } from '../../context/context';
import { NativeStackScreenProps } from '@react-navigation/native';

type RootStackParamList = {
  TempoPage: undefined;
  NextPage: { imageId: string };
};

type TempoPageProps = NativeStackScreenProps<RootStackParamList, 'TempoPage'>;

const TempoPage: React.FC<TempoPageProps> = ({ navigation }) => {
  const { state } = useContext(MyContext);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImagePress = (id: string) => {
    setSelectedImageId(id);
  };

  const handleNavigate = () => {
    if (selectedImageId) {
      navigation.navigate('NextPage', { imageId: selectedImageId });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card
          imageSource={require('../../assets/images/trendupdown.png')}
          text={state.teststringUpdate.test_string[0]}
          id="trendupdown"
          onPress={handleImagePress}
          isSelected={selectedImageId === 'trendupdown'}
        />
        <Card
          imageSource={require('../../assets/images/trendstraight.png')}
          text={state.teststringUpdate.test_string[0]}
          id="trendstraight"
          onPress={handleImagePress}
          isSelected={selectedImageId === 'trendstraight'}
        />
        <Card
          imageSource={require('../../assets/images/trendup.png')}
          text={state.teststringUpdate.test_string[0]}
          id="trendup"
          onPress={handleImagePress}
          isSelected={selectedImageId === 'trendup'}
        />
        <Card
          imageSource={require('../../assets/images/trenddown.png')}
          text={state.teststringUpdate.test_string[0]}
          id="trenddown"
          onPress={handleImagePress}
          isSelected={selectedImageId === 'trenddown'}
        />
      </ScrollView>
      <TouchableOpacity
        style={[styles.navigateButton, selectedImageId && styles.navigateButtonSelected]}
        onPress={handleNavigate}
        disabled={!selectedImageId}
      >
        <Text style={styles.navigateButtonText}>Navigate</Text>
      </TouchableOpacity>
    </View>
  );
};

type CardProps = {
  imageSource: ReturnType<typeof require>;
  text: string;
  id: string;
  onPress: (id: string) => void;
  isSelected: boolean;
};

const Card = ({ imageSource, text, id, onPress, isSelected }: CardProps) => {
  return (
    <TouchableOpacity style={[styles.cardContainer, isSelected && styles.selectedCard]} onPress={() => onPress(id)}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default TempoPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 10,
  },
  selectedCard: {
    backgroundColor: '#666',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  navigateButton: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
    opacity: 0.5,
  },
  navigateButtonSelected: {
    opacity: 1,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});