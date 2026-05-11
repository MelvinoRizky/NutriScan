import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import ScannedScreen from './screens/ScannedScreen';
import ScanDetailScreen from './screens/ScanDetailScreen';
import HistoryScreen from './screens/HistoryScreen';
import FoodDetailScreen from './screens/FoodDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import TargetScreen from './screens/TargetScreen';
import WeeklyScreen from './screens/WeeklyScreen';
import AdviceScreen from './screens/AdviceScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditTargetScreen from './screens/EditTargetScreen';
import HelpScreen from './screens/HelpScreen';

import { Colors, FontSize, Radius } from './components/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const TABS = [
    { icon: 'home', label: 'Dashboard' },
    { icon: 'scan-circle', label: 'Scan' },
    { icon: 'time', label: 'Riwayat' },
    { icon: 'person', label: 'Profil' },
  ];

  return (
    <View style={tabStyles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = TABS[index];
        const isScan = index === 1;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isScan) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={tabStyles.scanWrap} activeOpacity={0.85}>
              <View style={tabStyles.scanBtn}>
                <Ionicons name="scan-circle" size={34} color={Colors.white} />
              </View>
              <Text style={tabStyles.scanLabel}>Scan</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={tabStyles.tab} activeOpacity={0.8}>
            <Ionicons
              name={isFocused ? tab.icon : `${tab.icon}-outline`}
              size={22}
              color={isFocused ? Colors.primary : Colors.textMuted}
            />
            <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
              {tab.label}
            </Text>
            {isFocused && <View style={tabStyles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3, position: 'relative', paddingTop: 4 },
  label: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  labelActive: { color: Colors.primary },
  indicator: { position: 'absolute', bottom: -8, width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  scanWrap: { flex: 1, alignItems: 'center', gap: 3, marginTop: -22 },
  scanBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
    borderWidth: 3, borderColor: Colors.white,
  },
  scanLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
});

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Scanned" component={ScannedScreen} />
          <Stack.Screen name="ScanDetail" component={ScanDetailScreen} />
          <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
          <Stack.Screen name="Target" component={TargetScreen} />
          <Stack.Screen name="Weekly" component={WeeklyScreen} />
          <Stack.Screen name="Advice" component={AdviceScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EditTarget" component={EditTargetScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}