import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

type RootStackParamList = {
  FoodDetails: {id: number} | undefined;
};

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handleNavigate(foodId: number): Promise<void> {
    navigation.navigate('FoodDetails', {
      id: foodId
    });
  }

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const response = await api.get('/favorites');

      const responseFormatted: Food[] = response.data.map(
        (favorite: Food) => ({
          ...favorite,
          formattedPrice: formatValue(favorite.price),
        })
      );

      setFavorites(responseFormatted);
    }

    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={favorite => String(favorite.id)}
          renderItem={({ item: favorite }) => (
            <Food
              key={favorite.id}
              activeOpacity={0.6}
              onPress={() => handleNavigate(favorite.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: favorite.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{favorite.name}</FoodTitle>
                <FoodDescription>{favorite.description}</FoodDescription>
                <FoodPricing>{favorite.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
