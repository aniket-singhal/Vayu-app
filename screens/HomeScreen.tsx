import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/Theme';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTech, setSelectedTech] = useState('BOX');
  const [duration, setDuration] = useState(5);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);

  const handleBegin = () => {
    navigation.navigate('Practice', { 
      technique: selectedTech, 
      duration: duration,
      musicEnabled: musicEnabled,
      volume: volume
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Vayu</Text>
          <Text style={styles.subtitle}>Journey into stillness through breath</Text>
          <View style={styles.statsBadge}>
            <View style={styles.dot} />
            <Text style={styles.statsText}>Today: 0 minutes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>CHOOSE YOUR PRACTICE</Text>
        
        <TouchableOpacity 
          style={[styles.card, selectedTech === 'RELAX' && styles.activeCard]}
          onPress={() => setSelectedTech('RELAX')}
        >
          <Text style={styles.cardTitle}>4-7-8 Technique</Text>
          <Text style={styles.cardSub}>4s inhale • 7s hold • 8s exhale</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, selectedTech === 'BOX' && styles.activeCard]}
          onPress={() => setSelectedTech('BOX')}
        >
          <Text style={styles.cardTitle}>Box Breathing</Text>
          <Text style={styles.cardSub}>4s inhale • 4s hold • 4s exhale • 4s holdAfterExhale</Text>
        </TouchableOpacity>

        <View style={styles.controlGroup}>
          <Text style={styles.sectionTitle}>DURATION: {duration} MINUTES</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={20}
            step={1}
            value={duration}
            onValueChange={setDuration}
            minimumTrackTintColor={THEME.accent}
            maximumTrackTintColor="#1E293B"
            thumbTintColor={THEME.accent}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.limitText}>1 MIN</Text>
            <Text style={styles.limitText}>20 MIN</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitleSmall}>BACKGROUND MUSIC</Text>
            <Switch 
              value={musicEnabled} 
              onValueChange={setMusicEnabled}
              trackColor={{ false: '#334155', true: THEME.accent }}
            />
          </View>
          <Text style={styles.cardSub}>Volume: {Math.round(volume * 100)}%</Text>
          <Slider
            style={styles.sliderSmall}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={THEME.accent}
            maximumTrackTintColor="#1E293B"
            thumbTintColor={THEME.accent}
          />
        </View>

        <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
          <LinearGradient
            colors={['#2DD4BF', '#0D9488']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Begin Practice</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  scrollContent: { padding: 24, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 64, color: '#A5F3FC', fontWeight: '100', letterSpacing: 4 },
  subtitle: { color: '#94A3B8', fontSize: 16, marginTop: 8 },
  statsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.8)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 24, borderWidth: 1, borderColor: '#1E293B' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.accent, marginRight: 8 },
  statsText: { color: '#F8FAFC', fontWeight: '500' },
  sectionTitle: { color: '#94A3B8', fontSize: 12, letterSpacing: 2, marginBottom: 16, marginTop: 32 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 24, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1E293B' },
  activeCard: { borderColor: THEME.accent, borderWidth: 2 },
  cardTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardTitleSmall: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  cardSub: { color: '#94A3B8', fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlGroup: { marginTop: 10 },
  slider: { width: '100%', height: 40 },
  sliderSmall: { width: '100%', height: 30, marginTop: 10 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 },
  limitText: { color: '#94A3B8', fontSize: 10 },
  beginButton: { marginTop: 40, height: 60, borderRadius: 16, overflow: 'hidden' },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: THEME.bg, fontSize: 18, fontWeight: 'bold' },
});