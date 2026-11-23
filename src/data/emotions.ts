import type { L } from '../i18n';
import { colors } from '../theme';

/**
 * Сэтгэл хөдлөлүүд — дүр дээр товших бүрт солигдоно.
 * Өнгөний сэтгэл зүй: шар = баяр, ногоон-цэнхэр = сониуч, ягаан-нил = тайван бодол, ягаан = хайр
 */
export type Mouth = 'smile' | 'o' | 'flat' | 'grin';

export type Emotion = {
  id: string;
  emoji: string;
  name: L;
  quote: L;
  color: string;
  mouth: Mouth;
  browLift: number; // хөмсөг дээшлэх
  browTilt: number; // хөмсөгний налуу
  blush: boolean;
};

export const emotions: Emotion[] = [
  {
    id: 'joy',
    emoji: '😊',
    name: { mn: 'Баяр', en: 'Joy' },
    quote: { mn: 'Шинэ зүйл сурахаас илүү баяр байдаггүй.', en: 'Nothing beats learning something new.' },
    color: colors.joy,
    mouth: 'smile',
    browLift: 0.02,
    browTilt: 0,
    blush: true,
  },
  {
    id: 'curious',
    emoji: '🤔',
    name: { mn: 'Сониуч', en: 'Curious' },
    quote: { mn: '«Яагаад?» гэдэг асуулт бүх шинжилгээний эхлэл.', en: '“Why?” is where every analysis begins.' },
    color: colors.curious,
    mouth: 'o',
    browLift: 0.06,
    browTilt: 0.25,
    blush: false,
  },
  {
    id: 'calm',
    emoji: '😌',
    name: { mn: 'Тайван бодол', en: 'Calm focus' },
    quote: { mn: 'Тайван оюун ухаан өгөгдлийн цаадах хэв маягийг хардаг.', en: 'A calm mind sees the pattern behind the data.' },
    color: colors.calm,
    mouth: 'flat',
    browLift: -0.01,
    browTilt: 0,
    blush: false,
  },
  {
    id: 'love',
    emoji: '🥰',
    name: { mn: 'Хайр', en: 'Love' },
    quote: { mn: 'Тоо бүрийн цаана нэг хүн бий.', en: 'Behind every number is a person.' },
    color: colors.love,
    mouth: 'grin',
    browLift: 0.03,
    browTilt: 0.1,
    blush: true,
  },
];
