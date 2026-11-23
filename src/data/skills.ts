import type { L } from '../i18n';
import { colors } from '../theme';

/**
 * Ур чадварууд = «бодлын бөмбөлгүүд».
 * Оюун ухааны 4 хэсэгт хуваасан: Бодол, Илэрхийлэл, Үйлдэл, Мэдрэмж.
 * level: 1..5 — TODO: өөрийн бодит түвшингээр тохируулаарай
 */
export type Group = 'think' | 'express' | 'build' | 'feel';

export const groups: Record<Group, { name: L; emoji: string; color: string; desc: L }> = {
  think: {
    name: { mn: 'Бодол', en: 'Thinking' },
    emoji: '🧠',
    color: colors.curious,
    desc: { mn: 'Өгөгдлийг задлан шинжлэх', en: 'Breaking data down' },
  },
  express: {
    name: { mn: 'Илэрхийлэл', en: 'Expression' },
    emoji: '📊',
    color: colors.joy,
    desc: { mn: 'Олдворыг ойлгомжтой хүргэх', en: 'Making findings clear' },
  },
  build: {
    name: { mn: 'Үйлдэл', en: 'Action' },
    emoji: '🛠',
    color: colors.calm,
    desc: { mn: 'Санааг бодит болгох', en: 'Turning ideas into products' },
  },
  feel: {
    name: { mn: 'Мэдрэмж', en: 'Empathy' },
    emoji: '💗',
    color: colors.love,
    desc: { mn: 'Хүнийг ойлгох', en: 'Understanding people' },
  },
};

export type Skill = { id: string; name: string; group: Group; level: number };

export const skills: Skill[] = [
  { id: 'sql', name: 'SQL', group: 'think', level: 4 },
  { id: 'rm', name: 'RapidMiner', group: 'think', level: 4 },
  { id: 'fe', name: 'Feature Engineering', group: 'think', level: 3 },
  { id: 'dw', name: 'Data Warehouse', group: 'think', level: 3 },
  { id: 'ml', name: 'ML basics', group: 'think', level: 3 },

  { id: 'jasper', name: 'Jaspersoft', group: 'express', level: 4 },
  { id: 'viz', name: 'Dashboards', group: 'express', level: 3 },
  { id: 'ba', name: 'Business Analysis', group: 'express', level: 3 },
  { id: 'story', name: 'Data Storytelling', group: 'express', level: 3 },

  { id: 'rn', name: 'React Native', group: 'build', level: 4 },
  { id: 'ts', name: 'TypeScript', group: 'build', level: 3 },
  { id: 'supa', name: 'Supabase', group: 'build', level: 3 },
  { id: 'three', name: 'Three.js (3D)', group: 'build', level: 2 },

  { id: 'figma', name: 'Figma / UI-UX', group: 'feel', level: 4 },
  { id: 'comm', name: 'Communication', group: 'feel', level: 4 },
  { id: 'team', name: 'Teamwork', group: 'feel', level: 4 },
  { id: 'eng', name: 'English B1', group: 'feel', level: 3 },
];
