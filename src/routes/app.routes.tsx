import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/Feather';
import TabRoutes from './tab.routes';

import Home from '../pages/Home';
import FoodDetails from '../pages/FoodDetails';
import OrderDetails from '../pages/OrderDetails';

const App = createNativeStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <App.Navigator initialRouteName="Home">
      <App.Screen
        name='Home'
        component={Home}
        options={{
          contentStyle: {backgroundColor: '#C72828'},
          headerShown: false,
        }}
      />
      <App.Screen
        name="MainBottom"
        component={TabRoutes}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <App.Screen
        name="FoodDetails"
        component={FoodDetails}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Icon
              name="arrow-left"
              size={24}
              color="#FFB84D"
              onPress={() => navigation.goBack()}
            />
          ),
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRight: () => <Icon name="heart" size={24} color="#FFB84D" />,
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerTitle: 'Prato -',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#C72828',
          },
          headerShadowVisible: false,
        })}
      />
      <App.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Icon
              name="arrow-left"
              size={24}
              color="#FFB84D"
              onPress={() => navigation.goBack()}
            />
          ),
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerTitle: '',
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#C72828',
          },
          headerShadowVisible: false,
        })}
      />
    </App.Navigator>
  );
};

export default AppRoutes;
