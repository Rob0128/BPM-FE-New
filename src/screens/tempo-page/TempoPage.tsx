import { useContext, useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MyContext } from '../../context/context';
import {NavigationContext} from '@react-navigation/native';
import { TitleLarge } from '../../components/screens/home/styled/styles';


const TempoPage = () => {
  const { state } = useContext(MyContext);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const navigation = useContext(NavigationContext);

  const handleImagePress = (id: string) => {
    setSelectedImageId(id);
  };

  const handleNavigation = () => {
    if (selectedImageId) {
      navigation?.navigate('Add Playlist', { id: selectedImageId });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TitleLarge>Choose your tempo</TitleLarge>
        <Card 
          imageSource={require('../../assets/images/trendup.png')} 
          text="Trending up" 
          id="trendup" 
          onPress={handleImagePress} 
          isSelected={selectedImageId === 'trendup'} 
        />
        <Card 
          imageSource={require('../../assets/images/trendupdown.png')} 
          text="Trending up and back down"  
          id="trendupdown" 
          onPress={handleImagePress} 
          isSelected={selectedImageId === 'trendupdown'} 
        />
        <Card 
          imageSource={require('../../assets/images/trendstraight.png')} 
          text="Steady pace" 
          id="trendstraight" 
          onPress={handleImagePress} 
          isSelected={selectedImageId === 'trendstraight'} 
        />
        <Card 
          imageSource={require('../../assets/images/trenddown.png')} 
          text="Trending down"  
          id="trenddown" 
          onPress={handleImagePress} 
          isSelected={selectedImageId === 'trenddown'} 
        />
      </ScrollView>
      {selectedImageId && (
         <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.button} onPress={handleNavigation}>
           <Text style={styles.buttonText}>Next</Text>
         </TouchableOpacity>
       </View>
      )}
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
    <TouchableOpacity 
      style={[styles.cardContainer, isSelected && styles.selectedCard]} 
      onPress={() => onPress(id)}
    >
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
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#22B14C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
