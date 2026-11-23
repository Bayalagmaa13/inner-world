import type { ImageSourcePropType } from 'react-native';
import type { L } from '../i18n';

/**
 * Бүтээл бүрийг дата аналистын «case study» хэлбэрээр:
 * Асуудал → Өгөгдөл → Арга → Үр дүн
 *
 * viz: 'zodiac' = 12 ордны дугуй, бусад нь 'flow' = vizData-ийн label-уудаар зурсан алхмын урсгал.
 * link байхгүй бол «Нээх» товч харагдахгүй.
 */
export type Viz = 'zodiac' | 'flow';

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
  link?: string;
  viz: Viz;
  vizData: { label: string; value: number }[];
  /** Screenshot-ууд — бүгд өөрийн бүтээлийн дэлгэцийн зураг */
  images?: ImageSourcePropType[];
};

const GITHUB = 'https://github.com/bayalagmaa';

const flow = (...labels: string[]) => labels.map((label) => ({ label, value: 1 }));

export const projects: Project[] = [
  {
    id: 'mystic',
    emoji: '🌙',
    type: 'app',
    title: { mn: 'Mystic — зурхайн апп', en: 'Mystic — Zodiac App' },
    course: 'Mobile Programming · SWM231',
    tools: ['React Native', 'Expo', 'Supabase', 'Figma'],
    problem: {
      mn: 'Зурхай сонирхогчид өдрийн зурхай, ордын тайлбар, таро уншлагаа нэг дор, хувийн байдлаар авах апп хэрэгтэй.',
      en: 'Astrology fans want daily horoscopes, sign details and tarot readings in one personal place.',
    },
    data: {
      mn: 'Хэрэглэгч, 12 орд, өдрийн зурхай, таро уншигч, захиалга, төлбөрийн хүснэгтүүд — Supabase өгөгдлийн санд.',
      en: 'Users, 12 signs, daily horoscopes, tarot readers, orders and payments — stored in Supabase.',
    },
    method: {
      mn: 'Figma-д загварчилж, React Native + Expo-оор хөгжүүлсэн: ордын тохироо (%), таро уншигч сонгох, асуултын тоогоор үнэ бодох, QR төлбөр.',
      en: 'Designed in Figma, built with React Native + Expo: sign compatibility (%), choosing a tarot reader, price by number of questions, QR payment.',
    },
    result: {
      mn: 'Нэвтрэлтээс төлбөр хүртэлх бүтэн урсгалтай мобайл апп — өгөгдлийг хэрэглэгчид хүргэх «сүүлийн миль»-ийг өөрөө хийж чадна.',
      en: 'A full mobile app from sign-in to payment — I can build the “last mile” that delivers data to users.',
    },
    link: GITHUB,
    viz: 'zodiac',
    vizData: [],
    images: [
      require('../../assets/projects/mystic-1.jpg'),
      require('../../assets/projects/mystic-2.jpg'),
      require('../../assets/projects/mystic-3.jpg'),
      require('../../assets/projects/mystic-4.jpg'),
      require('../../assets/projects/mystic-5.jpg'),
    ],
  },
  {
    id: 'studymate',
    emoji: '📚',
    type: 'app',
    title: { mn: 'StudyMate AI — суралцах туслах', en: 'StudyMate AI — Study Assistant' },
    course: 'Mobile Programming · Challenge',
    tools: ['React Native', 'TypeScript', 'Supabase'],
    problem: {
      mn: 'Оюутнууд хичээлээ төлөвлөх, давтах, ахицаа харах нэг хэрэгсэл хэрэгтэй.',
      en: 'Students need one tool to plan, review and see their progress.',
    },
    data: {
      mn: 'Даалгавар, quiz-ийн оноо, өдөр бүрийн суралцсан минут, streak — Supabase.',
      en: 'Tasks, quiz scores, daily study minutes and streaks — Supabase.',
    },
    method: {
      mn: '14 хоногийн challenge: Төлөвлөгч, AI Tutor (mock), Quiz, Ахиц гэсэн 5 таб бүхий TypeScript апп.',
      en: '14-day challenge: a TypeScript app with 5 tabs — Planner, AI Tutor (mock), Quiz and Progress.',
    },
    result: {
      mn: 'Ахиц дэлгэц нь дууссан даалгавар, quiz-ийн дундаж, 7 хоногийн суралцалтыг тоо, графикаар харуулдаг — өгөгдөлд суурилсан зуршил.',
      en: 'The Progress screen shows finished tasks, quiz average and 7-day study time as numbers and charts — data-driven habits.',
    },
    link: GITHUB,
    viz: 'flow',
    vizData: flow('Plan', 'Study', 'Quiz', '📈'),
    images: [require('../../assets/projects/studymate-1.jpg')],
  },
  {
    id: 'coffee',
    emoji: '☕',
    type: 'design',
    title: { mn: 'Coffee House — Figma прототип', en: 'Coffee House — Figma Prototype' },
    course: 'HCI · CGR321',
    tools: ['Figma', 'UI/UX', 'Prototyping'],
    problem: {
      mn: 'Кофе хүргэлтийн захиалга хийх урсгал олон алхамтай, ойлгомжгүй байдаг.',
      en: 'Coffee-delivery ordering flows tend to be long and confusing.',
    },
    data: {
      mn: 'Хэрэглэгчийн ажиглалт, HCI-ийн зарчмууд (Weinschenk — «100 Things Every Designer Needs to Know About People»).',
      en: 'User observation and HCI principles (Weinschenk — “100 Things Every Designer Needs to Know About People”).',
    },
    method: {
      mn: '15 дэлгэцтэй интерактив прототип: бүртгэл (OTP), каталог, сагс ба купон, хүргэлт, төлбөр, захиалгын түүх, профайл.',
      en: 'A 15-screen interactive prototype: sign-up (OTP), catalog, cart & coupons, delivery, payment, order history, profile.',
    },
    result: {
      mn: 'Цөөн алхамтай, ойлгомжтой захиалгын урсгал — зүйлсийг хүнд ойлгомжтой болгох ур чадвар.',
      en: 'A short, clear ordering flow — the skill of making things understandable for people.',
    },
    viz: 'flow',
    vizData: flow('Menu', 'Cart', 'Pay', '✓'),
    images: [
      require('../../assets/projects/coffee-1.jpg'),
      require('../../assets/projects/coffee-2.jpg'),
      require('../../assets/projects/coffee-3.jpg'),
      require('../../assets/projects/coffee-4.jpg'),
      require('../../assets/projects/coffee-5.jpg'),
    ],
  },
  {
    id: 'churn',
    emoji: '📉',
    type: 'data',
    title: { mn: 'Онлайн дэлгүүрийн хэрэглэгч алдагдлын таамаглал', en: 'Online-shop Customer Churn Prediction' },
    course: 'Data Mining · DBM433',
    tools: ['RapidMiner', 'Feature Eng.', 'Classification'],
    problem: {
      mn: 'Аль хэрэглэгч дэлгүүрээс худалдан авалт хийхээ болих вэ? Эрт мэдвэл урамшуулал санал болгож буцааж татаж болно.',
      en: 'Which customers will stop buying? Knowing early lets the shop win them back with offers.',
    },
    data: {
      mn: 'Хэрэглэгчийн худалдан авалтын түүх. Өөрөө шинэ атрибут нэмсэн: orders_90d (сүүлийн 90 хоногийн захиалга).',
      en: 'Customer purchase history. I added my own attribute: orders_90d (orders in the last 90 days).',
    },
    method: {
      mn: 'RapidMiner дээр атрибут бүтээх, сонгох, бууруулах алхмуудыг хийж, загваруудыг харьцуулсан.',
      en: 'Built, selected and reduced attributes in RapidMiner, then compared models.',
    },
    result: {
      mn: 'Зөв атрибут нь загвараас дутахгүй чухал гэдгийг ойлгосон — өгөгдлийг бэлдэх нь шинжилгээний гол хэсэг.',
      en: 'Learned that the right attributes matter as much as the model — preparing data is the core of analysis.',
    },
    viz: 'flow',
    vizData: flow('Raw', 'Build', 'Select', 'Model'),
  },
  {
    id: 'dwm',
    emoji: '🗄️',
    type: 'data',
    title: { mn: 'Өгөгдлийн агуулах ба Jasper тайлангууд', en: 'Data Warehouse & Jasper Reports' },
    course: 'DWM431',
    tools: ['SQL', 'Data Warehouse', 'Jaspersoft'],
    problem: {
      mn: 'Удирдлагад борлуулалтын байдлыг хурдан харах тайлан хэрэгтэй.',
      en: 'Management needs a quick way to see sales performance.',
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
    viz: 'flow',
    vizData: flow('SQL', 'Fact', 'Jasper', '📊'),
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
    viz: 'flow',
    vizData: flow('Golomt', 'DBS', 'Gap', '💡'),
  },
];
