import React from 'react';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  BackgroundImage,
  Title,
  NavigationButton,
  ButtonText,
  IconContainer,
} from './styles';

import Background from '../../assets/home-background.png';
import Logo from '../../assets/logo.png';

type RootStackParamList = {
  MainBottom: { screen: string } | undefined;
};

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handleNavigate(): Promise<void> {
    navigation.navigate('MainBottom', {
      screen: 'Dashboard',
    });
  }

  return (
    <BackgroundImage
      source={Background}
      imageStyle={{
        width: 313,
        height: 427,
      }}
    >
      <Container>
        <Image source={Logo} />
        <Title>Uma verdadeira experiência Italiana.</Title>
      </Container>
      <NavigationButton onPress={() => handleNavigate()}>
        <ButtonText>Entrar no Restaurant</ButtonText>
        <IconContainer>
          <Icon name="log-in" size={24} color="#7A1818" />
        </IconContainer>
      </NavigationButton>
    </BackgroundImage>
  );
};

export default Home;
