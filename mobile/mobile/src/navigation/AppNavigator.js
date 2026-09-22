import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MonitorScreen from '../screens/MonitorScreen';
import LogbookScreen from '../screens/LogbookScreen';
import TripScreen from '../screens/TripScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GatewayScreen from '../screens/GatewayScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcons = {
  Home: 'home',
  Monitor: 'activity',
  Logbook: 'file-text',
  Gateway: 'wifi',
  Trips: 'map',
  Profile: 'user',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.card,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        height: 56,
      },
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 17,
        letterSpacing: -0.2,
      },
      headerTitleAlign: 'left',
      tabBarIcon: ({ color, focused }) => (
        <Icon
          name={tabIcons[route.name]}
          size={22}
          color={color}
        />
      ),
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: {
        backgroundColor: colors.card,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 1,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={DashboardScreen}
      options={{ title: 'FarmTrace', headerTitle: 'FarmTrace' }}
    />
    <Tab.Screen name="Monitor" component={MonitorScreen} options={{ title: 'Monitor' }} />
    <Tab.Screen name="Gateway" component={GatewayScreen} options={{ title: 'Gateway' }} />
    <Tab.Screen name="Logbook" component={LogbookScreen} options={{ title: 'Logbook' }} />
    <Tab.Screen name="Trips" component={TripScreen} options={{ title: 'Trips' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
