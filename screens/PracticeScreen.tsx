import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Orb } from '../components/Orb';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { TECHNIQUES } from '../constants/Techniques';
import { THEME } from '../constants/Theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

export default function PracticeScreen({ route, navigation }: Props) {
  const { technique, duration, musicEnabled, volume } = route.params;
  const techConfig = technique === 'BOX' ? TECHNIQUES.BOX : TECHNIQUES.RELAX;
  const { phase } = useBreathingEngine(techConfig);
  
  // Timer State
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Audio Setup & Cleanup
  useEffect(() => {
    async function setupAudio() {
      if (musicEnabled) {
        try {
          await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
          const { sound: newSound } = await Audio.Sound.createAsync(
            require('../assets/meditation.mp3'),
            { shouldPlay: true, isLooping: true, volume: volume }
          );
          soundRef.current = newSound;
        } catch (error) {
          console.log("Audio load error:", error);
        }
      }
    }
    setupAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    if (secondsLeft <= 0) {
      // Session Complete Logic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Session Complete", "You've finished your practice.", [
        { text: "Done", onPress: () => navigation.navigate('Home') }
      ]);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.techTitle}>{techConfig.name}</Text>
      </View>
      
      <View style={styles.orbWrapper}>
        <Orb phase={phase} />
        <Text style={styles.phaseText}>{phase.toUpperCase()}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timerText}>{formatTime(secondsLeft)} Remaining</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', left: 20, padding: 10 },
  closeText: { color: '#94A3B8', fontSize: 16 },
  techTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '300', letterSpacing: 2 },
  orbWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  phaseText: { color: THEME.accent, fontSize: 32, marginTop: 80, fontWeight: '200', letterSpacing: 6 },
  footer: { paddingBottom: 60, alignItems: 'center' },
  timerText: { color: '#94A3B8', fontSize: 18, letterSpacing: 2, fontWeight: '400' },
});