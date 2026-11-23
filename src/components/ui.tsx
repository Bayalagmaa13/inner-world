import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, space, TOUCH } from '../theme';
import { useLang } from '../i18n';
import { tap } from '../utils/haptics';

// Чичиргээтэй, дарахад багасдаг товч
export function Btn({
  label,
  onPress,
  variant = 'primary',
  style,
  color = colors.cyan,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
  color?: string;
}) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' ? { backgroundColor: color } : { borderColor: color, borderWidth: 1.5 },
        { transform: [{ scale: pressed ? 0.96 : 1 }], opacity: pressed ? 0.85 : 1 },
        style,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.btnText, { color: variant === 'primary' ? colors.bg : color }]}>{label}</Text>
    </Pressable>
  );
}

// MN | EN солих
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <View style={styles.toggle}>
      {(['mn', 'en'] as const).map((l) => (
        <Pressable
          key={l}
          onPress={() => {
            tap();
            setLang(l);
          }}
          style={[styles.toggleItem, lang === l && styles.toggleActive]}
          hitSlop={8}
        >
          <Text style={[styles.toggleText, lang === l && { color: colors.bg }]}>{l.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, color = colors.cyan }: { label: string; color?: string }) {
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: TOUCH,
    paddingHorizontal: space.xl,
    borderRadius: radius.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  toggle: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 3,
  },
  toggleItem: { paddingHorizontal: 12, height: 32, borderRadius: 16, justifyContent: 'center' },
  toggleActive: { backgroundColor: colors.cyan },
  toggleText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.m,
    padding: space.l,
  },
  chip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
  chipText: { fontSize: 12, fontWeight: '600' },
});
