import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF', // White text for focused tabs
        tabBarInactiveTintColor: '#8B7D6B', // Light brown for inactive tabs
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarPosition: 'bottom', // iOS: bottom, Android/Web: top
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#F8F4F0', // Light cream background
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8
          },
          android: {
            backgroundColor: '#F8F4F0', // Light cream background
            borderBottomWidth: 1,
            borderBottomColor: '#D4C4B0',
            elevation: 8,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8
          },
          web: {
            backgroundColor: '#F8F4F0', // Light cream background
            borderBottomWidth: 1,
            borderBottomColor: '#D4C4B0',
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600', // Slightly bolder for better visibility
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 20, // Rounded corners for tab items
          marginHorizontal: 4, // Add some spacing between tabs
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8B7D6B' : 'transparent',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconSymbol 
                size={24} 
                name="book.closed" 
                color={focused ? '#FFFFFF' : '#8B7D6B'} 
              />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8B7D6B' : 'transparent',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconSymbol 
                size={24} 
                name="book.fill" 
                color={focused ? '#FFFFFF' : '#8B7D6B'} 
              />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#8B7D6B' : 'transparent',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconSymbol 
                size={24} 
                name="magnifyingglass" 
                color={focused ? '#FFFFFF' : '#8B7D6B'} 
              />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
