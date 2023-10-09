import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Feather';

import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Favorites from '../pages/Favorites';

const Tab = createBottomTabNavigator();

const TabRoutes: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C72828',
        tabBarInactiveTintColor: '#B7B7CC',
        tabBarLabelPosition: 'beside-icon',
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => {
          const icons: {
            [value: string]: string;
          } = {
            DashboardStack: 'list',
            Orders: 'shopping-bag',
            Favorites: 'heart',
          };

          return (
            <Icon
              name={icons[route.name]}
              color={color}
              size={25}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="DashboardStack"
        component={Dashboard}
        options={{title: 'Listagem'}}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{title: 'Pedidos'}}
      />

      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{title: 'Favoritos'}}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
