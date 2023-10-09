import React, {
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

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
  FoodItem,
  FoodItemText,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdditionalItem,
  AdditionalItemText,
  AdditionalQuantity,
  TotalPrice,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  formattedValue: string;
  quantity: number;
}

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
  category: number;
}

type RootStackParamList = {
  MainBottom: { screen: string } | undefined;
};

const OrderDetails: React.FC = () => {
  const [food, setFood] = useState({} as FoodProps);
  const [extras, setExtras] = useState<Extra[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadOrder(): Promise<void> {
      const response = await api.get(`/orders/${routeParams.id}`);

      const responseFormatted: FoodProps = {
        ...response.data,
        formattedPrice: formatValue(response.data.price),
        extras: response.data.extras
          .filter((extra: Extra) => extra.quantity!==0)
          .map((extra: Extra) => ({
            ...extra,
            formattedValue: formatValue(extra.value),
          })
        ),
      };

      setFood(responseFormatted);
      setExtras(responseFormatted.extras);
    }

    loadOrder();
  }, [routeParams]);

  const cartTotal = useMemo(() => {
    const foodTotal = food.price;
    const extraTotal = extras.reduce((accumulator, extra) => {
      return accumulator + (extra.value * extra.quantity);
    }, 0);

    const total = (Number(foodTotal) + Number(extraTotal)) * food.quantity;

    return {
      value: total,
      formatValue: formatValue(total),
    };
  }, [extras, food]);


  useLayoutEffect(() => {
    function loadCategory(): void {
      navigation.setOptions({
        headerTitle: `Pedido ${food.id} - ${food.name}`,
      });
    }

    loadCategory();
  }, [food]);

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
              <FoodItem>
                <FoodItemText>{food.quantity}</FoodItemText>
                <FoodItemText>{food.formattedPrice}</FoodItemText>
              </FoodItem>
            </FoodContent>
          </Food>
        </FoodsContainer>
        {extras.length !== 0 && (
          <AdditionalsContainer>
            <Title>Adicionais</Title>
            {extras.map(extra => (
              <AdditionalItem key={extra.id}>
                <AdditionalItemText>{extra.name}</AdditionalItemText>
                <AdditionalQuantity>
                  <AdditionalItemText>{extra.quantity}</AdditionalItemText>
                  <AdditionalItemText>{extra.formattedValue}</AdditionalItemText>
                </AdditionalQuantity>
              </AdditionalItem>
            ))}
          </AdditionalsContainer>
        )}
        <TotalContainer>
          <Title>Total do pedido</Title>
          <TotalPrice>{cartTotal.formatValue}</TotalPrice>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default OrderDetails;
