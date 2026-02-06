import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { Orb } from '../components/Orb';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { TECHNIQUES } from '../constants/Techniques';
import { THEME } from '../constants/Theme';

export default function PracticeScreen({ route, navigation }: any) {
  const { technique, duration, musicEnabled, volume } = route.params;
  const techConfig = technique === 'BOX' ? TECHNIQUES.BOX : TECHNIQUES.RELAX;
  const { phase } = useBreathingEngine(techConfig);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    async function setupAudio() {
      if (musicEnabled) {
        // LOAD LOCAL FILE: Replace 'meditation.mp3' with your actual filename
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/music.mp3'),
          { shouldPlay: true, isLooping: true, volume: volume }
        );
        setSound(newSound);
      }
    }
    setupAudio();

    // Cleanup: Unload sound when user leaves the screen
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.techTitle}>{techConfig.name}</Text>
      </View>
      
      <View style={styles.orbWrapper}>
        <Orb phase={phase} />
        <Text style={styles.phaseText}>{phase.toUpperCase()}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timerText}>{duration}:00 Remaining</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', left: 20 },
  closeText: { color: '#94A3B8', fontSize: 16 },
  techTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '300', letterSpacing: 2 },
  orbWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  phaseText: { color: THEME.accent, fontSize: 32, marginTop: 80, fontWeight: '200', letterSpacing: 6 },
  footer: { paddingBottom: 40, alignItems: 'center' },
  timerText: { color: '#94A3B8', fontSize: 14, letterSpacing: 1 },
});