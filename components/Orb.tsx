import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat, withSequence } from 'react-native-reanimated';
import { COLORS } from '../constants/Techniques';

export const Orb = ({ phase }: { phase: string }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (phase === 'Inhale') {
      scale.value = withTiming(1.6, { duration: 4000, easing: Easing.out(Easing.poly(2)) });
    } else if (phase === 'Exhale') {
      scale.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
    } else if (phase.includes('Hold')) {
      scale.value = withRepeat(withSequence(withTiming(scale.value + 0.05, { duration: 1000 }), withTiming(scale.value, { duration: 1000 })), -1, true);
    }
  }, [phase]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value - 0.3,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.orb, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 300, justifyContent: 'center', alignItems: 'center' },
  orb: { width: 150, height: 150, borderRadius: 75, backgroundColor: COLORS.orb, shadowColor: COLORS.orb, shadowRadius: 30, shadowOpacity: 0.6, elevation: 20 },
});