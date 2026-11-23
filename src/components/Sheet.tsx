import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, TOUCH } from '../theme';
import { tap } from '../utils/haptics';

/**
 * Доороос гулсаж гарч ирдэг дэлгэц (bottom sheet).
 * Android-ийн «буцах» товчоор хаагдана.
 */
export default function Sheet({
  title,
  onClose,
  children,
  accent = colors.cyan,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  accent?: string;
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.spring(y, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 140 }).start();
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, []);

  const close = () => {
    tap();
    Animated.timing(y, { toValue: height, duration: 260, useNativeDriver: true }).start(onClose);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: y.interpolate({ inputRange: [0, height], outputRange: [1, 0] }) },
        ]}
      />
      <Animated.View
        style={[styles.sheet, { marginTop: insets.top + 24, paddingBottom: insets.bottom, transform: [{ translateY: y }] }]}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={[styles.title, { color: accent }]}>{title}</Text>
          <Pressable onPress={close} style={styles.close} hitSlop={10} accessibilityLabel="close">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(3,5,15,0.7)' },
  sheet: {
    flex: 1,
    backgroundColor: '#0B1130',
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.cardBorder, marginTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.l, paddingVertical: space.s },
  title: { flex: 1, fontSize: 22, fontWeight: '800' },
  close: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.muted, fontSize: 22 },
});
