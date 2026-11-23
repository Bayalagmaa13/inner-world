import { Platform } from 'react-native';

// Сэтгэл зүйн дулаан, зөөлөн өнгөний палитр
export const colors = {
  bg: '#140C2A',
  card: 'rgba(28, 20, 58, 0.78)',
  cardBorder: 'rgba(200, 180, 255, 0.18)',
  text: '#F4F0FF',
  muted: '#A79DC9',
  joy: '#FFC857',
  curious: '#5EEAD4',
  calm: '#A78BFA',
  love: '#F9A8D4',
  // хуучин нэрс (бусад компонентод ашиглагдана)
  cyan: '#5EEAD4',
  gold: '#FFC857',
  violet: '#A78BFA',
  pink: '#F9A8D4',
  red: '#F87171',
  bg2: '#1E1440',
  star: '#FFFFFF',
};

export const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 };

export const radius = { s: 10, m: 16, l: 24 };

// Хуруугаар дарахад тохиромжтой хамгийн бага хэмжээ
export const TOUCH = 48;
