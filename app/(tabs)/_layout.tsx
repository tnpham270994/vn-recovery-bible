import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarPosition: Platform.OS === 'ios' ? 'bottom' : 'top', // iOS: bottom, Android/Web: top
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 88 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
          },
          android: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme ?? 'light'].headerFooter,
            elevation: 8,
            height: 64 + insets.top,
            paddingTop: insets.top,
            paddingBottom: 8,
          },
          web: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme ?? 'light'].headerFooter,
            height: 64,
            paddingTop: 8,
            paddingBottom: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 
              size={24} 
              name="book-bible" 
              color={focused ? color : Colors[colorScheme ?? 'light'].tabIconDefault} 
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name="book.fill" 
              color={focused ? color : Colors[colorScheme ?? 'light'].tabIconDefault} 
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name="magnifyingglass" 
              color={focused ? color : Colors[colorScheme ?? 'light'].tabIconDefault} 
            />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
