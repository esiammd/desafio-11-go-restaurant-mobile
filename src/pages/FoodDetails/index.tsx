import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdditionalItem,
  AdditionalItemText,
  AdditionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  thumbnail_url: string;
  formattedPrice: string;
  extras: Extra[];
  category: number;
}

type RootStackParamList = {
  MainBottom: { screen: string } | undefined;
};

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as FoodProps);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadFood(): Promise<void> {
      const response = await api.get(`/foods/${routeParams.id}`);

      const responseFormatted: FoodProps = {
        ...response.data,
        formattedPrice: formatValue(response.data.price),
        extras: response.data.extras.map((extra: Extra) => (
          {...extra, quantity: 0})
        ),
      };

      setFood(responseFormatted);
      setExtras(responseFormatted.extras);
    }

    loadFood();
  }, [routeParams]);

  useEffect(() => {
    async function loadFavorite(): Promise<void> {
      const response = await api.get('/favorites');

      const findFavorite = response.data.find(
        (favorite: Omit<FoodProps, 'formattedPrice' | 'extras'>) =>
        favorite.id === routeParams.id
      );

      if (findFavorite) {
        setIsFavorite(true);
      }
    }

    loadFavorite();
  }, [routeParams]);

  function handleIncrementExtra(id: number): void {
    setExtras(extras.map(extra =>
      extra.id === id ? {...extra, quantity: extra.quantity + 1} : extra
    ));
  }

  function handleDecrementExtra(id: number): void {
    setExtras(extras.map(extra =>
      extra.id === id ?
        extra.quantity === 0 ? extra : {...extra, quantity: extra.quantity - 1}
      : extra
    ));
  }

  function handleIncrementFood(): void {
    setFoodQuantity(foodQuantity + 1);
  }

  function handleDecrementFood(): void {
    if (foodQuantity === 1) {
      return;
    }

    setFoodQuantity(foodQuantity - 1);
  }

  const handleOkPressed = useCallback(() => {
    navigation.reset({
      routes: [
        { name: 'MainBottom' },
      ],
      index: 0,
    });
  }, [navigation.reset]);

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      api.delete(`/favorites/${food.id}`);
    } else {
      api.post('/favorites', food);
    }

    setIsFavorite(!isFavorite);
  }, [isFavorite, food]);

  const cartTotal = useMemo(() => {
    const foodTotal = food.price;
    const extraTotal = extras.reduce((accumulator, extra) => {
      return accumulator + (extra.value * extra.quantity);
    }, 0);

    const total = (Number(foodTotal) + Number(extraTotal)) * foodQuantity;

    return {
      value: total,
      formatValue: formatValue(total),
    };
  }, [extras, food, foodQuantity]);

  async function handleFinishOrder(): Promise<void> {
    const order = {
      product_id: food.id,
      name: food.name,
      description: food.description,
      price: food.price,
      quantity: foodQuantity,
      category: food.category,
      image_url: food.image_url,
      thumbnail_url: food.thumbnail_url,
      extras,
      total: cartTotal.value,
    };

    await api.post('/orders', order);

    Alert.alert('Pedido confirmado!', '', [
      {text: 'OK', onPress: () => handleOkPressed()}
    ]);
  }

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  useLayoutEffect(() => {
    async function loadCategory(): Promise<void> {
      const response = await api.get(`/categories/${food.category}`);

      navigation.setOptions({
        headerTitle: `Prato - ${response.data.title}`,
      });
    }

    loadCategory();
  }, [food.category]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdditionalItem key={extra.id}>
              <AdditionalItemText>{extra.name}</AdditionalItemText>
              <AdditionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdditionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdditionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdditionalQuantity>
            </AdditionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal.formatValue}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdditionalItemText testID="food-quantity">
                {foodQuantity}
              </AdditionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
