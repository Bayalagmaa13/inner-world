import type { ImageSourcePropType } from 'react-native';
import type { L } from '../i18n';

/**
 * Бүтээл бүрийг дата аналистын «case study» хэлбэрээр:
 * Асуудал → Өгөгдөл → Арга → Үр дүн
 *
 * ⚠️ TODO: тоон үр дүн (accuracy гэх мэт) болон холбоосуудыг
 * өөрийн бодит ажлын үр дүнгээр заавал солиорой. Одоогийнх нь ЖИШЭЭ.
 */
export type Viz = 'bars' | 'line' | 'compare' | 'zodiac' | 'study' | 'cup';

export type Project = {
  id: string;
  emoji: string;
  type: 'data' | 'app' | 'design';
  title: L;
  course: string;
  tools: string[];
  problem: L;
  data: L;
  method: L;
  result: L;
  link: string;
  viz: Viz;
  vizData: { label: string; value: number }[];
  /**
   * Screenshot-ууд (заавал биш). Жишээ:
   *   images: [require('../../assets/projects/churn-1.png'), require('../../assets/projects/churn-2.png')],
   */
  images?: ImageSourcePropType[];
};

export const projects: Project[] = [
  {
    id: 'churn',
    emoji: '📉',
    type: 'data',
    title: { mn: 'Онлайн дэлгүүрийн хэрэглэгч алдагдлын таамаглал', en: 'Online-shop Customer Churn Prediction' },
    course: 'Data Mining · DBM433',
    tools: ['RapidMiner', 'Feature Eng.', 'Decision Tree'],
    problem: {
      mn: 'Аль хэрэглэгч дэлгүүрээс худалдан авалт хийхээ болих вэ? Эрт мэдвэл урамшуулал санал болгож буцааж татаж болно.',
      en: 'Which customers will stop buying? Knowing early lets the shop win them back with offers.',
    },
    data: {
      mn: 'Хэрэглэгчийн худалдан авалтын түүх: давтамж, сүүлийн худалдан авалт, нийт зарцуулалт, гомдол.',
      en: 'Customer purchase history: frequency, recency, total spend, complaints.',
    },
    method: {
      mn: 'Шинэ атрибут бүтээж (feature construction), хамааралгүйг нь сонгон хасаж, хэмжээсийг бууруулаад хэд хэдэн загварыг харьцуулсан.',
      en: 'Built new attributes, selected and reduced features, then compared several models.',
    },
    result: {
      mn: 'Feature engineering хийсний дараа загварын нарийвчлал мэдэгдэхүйц өссөн (жишээ тоо). Хамгийн чухал хүчин зүйл — сүүлийн худалдан авалтаас хойших хугацаа.',
      en: 'Accuracy improved noticeably after feature engineering (sample numbers). Key driver: time since last purchase.',
    },
    link: 'https://github.com/your-username/churn-seminar', // TODO
    viz: 'bars',
    vizData: [
      { label: 'Raw', value: 0.71 }, // TODO: бодит тоо
      { label: '+FE', value: 0.82 },
      { label: '+Sel', value: 0.86 },
    ],
  },
  {
    id: 'dwm',
    emoji: '🗄️',
    type: 'data',
    title: { mn: 'Өгөгдлийн агуулах ба Jasper тайлангууд', en: 'Data Warehouse & Jasper Reports' },
    course: 'DWM431',
    tools: ['SQL', 'Data Warehouse', 'Jaspersoft'],
    problem: {
      mn: 'Удирдлага борлуулалтын байдлыг хурдан харах тайлангүй байсан.',
      en: 'Management had no quick way to see sales performance.',
    },
    data: {
      mn: 'Өөрийн байгуулсан DWM өгөгдлийн сан: баримт (fact) болон хэмжээс (dimension) хүснэгтүүд.',
      en: 'My own DWM database: fact and dimension tables.',
    },
    method: {
      mn: 'SQL query-ээр нэгтгэл хийж, Jaspersoft дээр параметртэй, графиктай тайлангууд бүтээсэн.',
      en: 'Aggregated with SQL queries and built parameterised, chart-rich reports in Jaspersoft.',
    },
    result: {
      mn: 'Хугацаа, бүтээгдэхүүнээр шүүж болох тайлангууд — шийдвэр гаргагч нэг дэлгэцээс чиг хандлагыг харна.',
      en: 'Reports filterable by period and product — decision makers see trends on one screen.',
    },
    link: 'https://github.com/your-username/dwm-reports', // TODO
    viz: 'line',
    vizData: [
      { label: 'Q1', value: 0.35 },
      { label: 'Q2', value: 0.52 },
      { label: 'Q3', value: 0.46 },
      { label: 'Q4', value: 0.78 },
    ],
  },
  {
    id: 'bank',
    emoji: '🏦',
    type: 'data',
    title: { mn: 'Голомт Smart Bank vs DBS digibank', en: 'Golomt Smart Bank vs DBS digibank' },
    course: 'Business Analysis · ISA332',
    tools: ['Business Analysis', 'Benchmarking', 'Storytelling'],
    problem: {
      mn: 'Монголын банкны дижитал үйлчилгээ дэлхийн тэргүүний банкнаас юугаараа ялгаатай вэ?',
      en: 'How does a Mongolian bank’s digital service compare to a world leader?',
    },
    data: {
      mn: 'Апп-уудын боломж, хэрэглэгчийн туршлага, нээлттэй тайлан мэдээлэл.',
      en: 'App features, user experience and public reports.',
    },
    method: {
      mn: 'Банкны салбарын бизнес шинжээчийн байр сууринаас үзүүлэлт бүрээр харьцуулж, зөрүүг (gap) тодорхойлсон.',
      en: 'Compared feature by feature from a banking BA’s perspective and identified the gaps.',
    },
    result: {
      mn: 'Сайжруулах боломжуудыг эрэмбэлж, 15 слайдтай багийн илтгэл болгон танилцуулсан.',
      en: 'Prioritised improvement opportunities, presented as a 15-slide team deck.',
    },
    link: 'https://github.com/your-username', // TODO
    viz: 'compare',
    vizData: [
      { label: 'UX', value: 0.7 },
      { label: 'Pay', value: 0.85 },
      { label: 'AI', value: 0.4 },
      { label: 'Open', value: 0.55 },
    ],
  },
  {
    id: 'mystic',
    emoji: '🌙',
    type: 'app',
    title: { mn: 'Mystic — зурхайн апп', en: 'Mystic — Zodiac App' },
    course: 'Mobile Programming · SWM231',
    tools: ['React Native', 'Expo', 'Supabase'],
    problem: {
      mn: 'Зурхай сонирхогчид мэдээллээ нэг дор, хувийн байдлаар авах апп хэрэгтэй.',
      en: 'Astrology fans want personal readings in one place.',
    },
    data: {
      mn: 'Хэрэглэгчийн төрсөн огноо, орд, сонгосон сэдэв — Supabase-д хадгална.',
      en: 'Birth date, sign and chosen topics — stored in Supabase.',
    },
    method: {
      mn: 'Figma-д загварчилж, React Native + Expo-оор хөгжүүлж, таро уншигчийн төлбөртэй нэмэлт үйлчилгээ нэмсэн.',
      en: 'Designed in Figma, built with React Native + Expo, added a paid tarot-reader service.',
    },
    result: {
      mn: 'Бүтэн ажиллагаатай мобайл апп — өгөгдлийг хэрэглэгчид хүргэх «сүүлийн миль»-ийг өөрөө хийж чадна.',
      en: 'A working mobile app — I can build the “last mile” that delivers data to users.',
    },
    link: 'https://github.com/your-username/mystic', // TODO
    viz: 'zodiac',
    vizData: [],
  },
  {
    id: 'studymate',
    emoji: '📚',
    type: 'app',
    title: { mn: 'StudyMate AI — суралцах туслах', en: 'StudyMate AI — Study Assistant' },
    course: 'Mobile Programming · Challenge',
    tools: ['React Native', 'TypeScript', 'Supabase'],
    problem: {
      mn: 'Оюутнууд хичээлээ төлөвлөх, давтах хэрэгсэл хэрэгтэй.',
      en: 'Students need a tool to plan and review their studies.',
    },
    data: {
      mn: 'Хичээл, даалгавар, суралцсан хугацаа — Supabase.',
      en: 'Courses, tasks and study time — Supabase.',
    },
    method: {
      mn: '14 хоногийн challenge: TypeScript, Supabase, mock AI туслахтай апп.',
      en: '14-day challenge: TypeScript, Supabase and a mock AI assistant.',
    },
    result: {
      mn: 'Суралцсан хугацааг хэмжиж харуулдаг — өгөгдөлд суурилсан зуршил.',
      en: 'Tracks study time and visualises it — data-driven habits.',
    },
    link: 'https://github.com/your-username/studymate-ai', // TODO
    viz: 'study',
    vizData: [
      { label: 'Mo', value: 0.4 },
      { label: 'Tu', value: 0.7 },
      { label: 'We', value: 0.5 },
      { label: 'Th', value: 0.9 },
      { label: 'Fr', value: 0.6 },
    ],
  },
  {
    id: 'coffee',
    emoji: '☕',
    type: 'design',
    title: { mn: 'Coffee House — Figma прототип', en: 'Coffee House — Figma Prototype' },
    course: 'HCI · CGR321',
    tools: ['Figma', 'UI/UX', 'Prototyping'],
    problem: {
      mn: 'Кофе шопын захиалга хийх урсгал төвөгтэй байсан.',
      en: 'The coffee-shop ordering flow was confusing.',
    },
    data: {
      mn: 'Хэрэглэгчийн ажиглалт, HCI-ийн зарчмууд.',
      en: 'User observation and HCI principles.',
    },
    method: {
      mn: 'Хэрэглэгчийн урсгал зурж, Figma дээр интерактив прототип бүтээсэн.',
      en: 'Mapped user flows and built an interactive Figma prototype.',
    },
    result: {
      mn: 'Цөөн алхамтай, ойлгомжтой захиалгын урсгал — шинжилгээг хүнд ойлгомжтой болгох ур чадвар.',
      en: 'A shorter, clearer ordering flow — making things understandable for people.',
    },
    link: 'https://www.figma.com', // TODO: Figma холбоос
    viz: 'cup',
    vizData: [],
  },
];
