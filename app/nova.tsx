import { Image, StyleSheet, Platform } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NovaScreen() {
  return (
    <SafeAreaView>
      <ThemedView style={styles.titleContainer}>
       <ThemedText>Teste</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor:'#444',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
