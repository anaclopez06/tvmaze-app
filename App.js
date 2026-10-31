import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaSeries from './src/screens/ListaSeries';
import DetalheSerie from './src/screens/DetalheSerie';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaSeries">
        <Stack.Screen
          name="ListaSeries"
          component={ListaSeries}
          options={{ title: 'Séries' }}
        />
        <Stack.Screen
          name="DetalheSerie"
          component={DetalheSerie}
          options={{ title: 'Episódios' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}