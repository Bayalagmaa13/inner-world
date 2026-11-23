import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Web дээр чичиргээ байхгүй тул алдаа гаргахгүйгээр алгасна
const safe = (fn: () => Promise<void>) => {
  if (Platform.OS !== 'web') fn().catch(() => {});
};

export const tap = () => safe(() => Haptics.selectionAsync());
export const thud = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
export const success = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const warn = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
