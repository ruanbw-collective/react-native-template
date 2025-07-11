import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView'
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter()
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <ThemedText>home</ThemedText>
      <View className="bg-red-500">
        <Text className="text-white">Tailwind CSS is working!</Text>
      </View>
      <Button title='towebview' onPress={() => {
        router.push({
          pathname: '/webview',
          params: {
            uri: 'http://baidu.com'
          }
        })
      }}></Button>
    </ThemedSafeAreaView>
  );
}
