import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ThemedSafeAreaView
    style={{backgroundImage:require('@/assets/images/icon.png')}}
    >
      <ThemedText>user</ThemedText>
      
    </ThemedSafeAreaView>
  );
}
