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

export interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
  total: number;
}

type RootStackParamList = {
  OrderDetails: {id: number} | undefined;
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handleNavigate(orderId: number): Promise<void> {
    navigation.navigate('OrderDetails', {
      id: orderId
    });
  }

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const response = await api.get('/orders');

      const responseFormatted: Order[] = response.data.map(
        (order: Order) => ({
          ...order,
          formattedPrice: formatValue(order.total),
        })
      );

      setOrders(responseFormatted);
    }

    loadOrders();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={(order)=> String(order.id)}
          renderItem={({ item: order }) => (
            <Food
              key={order.id}
              activeOpacity={0.6}
              onPress={() => handleNavigate(order.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: order.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{order.name}</FoodTitle>
                <FoodDescription>{order.description}</FoodDescription>
                <FoodPricing>{order.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
