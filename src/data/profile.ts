import type { ImageSourcePropType } from 'react-native';
import type { L } from '../i18n';

export const profile = {
  // TODO: хөрөг зургаа assets/photo.jpg болгон хийгээд доорх мөрийг: photo: require('../../assets/photo.jpg') as ImageSourcePropType,
  photo: undefined as ImageSourcePropType | undefined,
  name: { mn: 'Н.Баялагмаа', en: 'Bayalagmaa N.' } as L,
  role: { mn: 'Ирээдүйн дата аналист', en: 'Aspiring Data Analyst' } as L,
  tagline: {
    mn: 'Хүний зан төлөвийг өгөгдлөөр ойлгохыг зорьдог.',
    en: 'I want to understand human behaviour through data.',
  } as L,
  school: {
    mn: 'СЭЗИС · Мэдээллийн систем (2028 төгсөнө)',
    en: 'UFE · Information Systems (graduating 2028)',
  } as L,
  bio: {
    mn: 'Би мэдээллийн системийн оюутан. Өгөгдлийн агуулах, өгөгдөл олборлолт, бизнес шинжилгээний хичээлүүдээр SQL, RapidMiner, Jaspersoft ашиглан бодит асуудлыг тоогоор тайлбарлаж сурсан. Апп хөгжүүлж, дизайн хийж чаддаг тул шинжилгээгээ хэрэглэгчид ойлгомжтой хэлбэрээр хүргэж чадна. Одоо дата аналистын дадлага хайж байна.',
    en: 'I’m an Information Systems student. Through data warehousing, data mining and business analysis courses I learned to explain real problems with numbers using SQL, RapidMiner and Jaspersoft. I can also build apps and design interfaces, so my analysis reaches people in a clear form. Currently looking for a data analyst internship.',
  } as L,
  contact: {
    email: 'nbayalagmaaa@gmail.com',
    phone: '+97685053023',
    github: 'https://github.com/Bayalagmaa13',
    facebook: 'https://www.facebook.com/Bayalagmaa.bk/',
  },
  experience: [
    {
      title: { mn: 'Борлуулалтын зөвлөх · Good Price', en: 'Sales Consultant · Good Price' } as L,
      period: { mn: '2025.09 – 2025.10', en: 'Sep – Oct 2025' } as L,
      note: {
        mn: 'Худалдан авагчийн хэрэгцээг сонсож, бүтээгдэхүүн санал болгох — өгөгдлийн цаана хүн байдгийг ойлгосон.',
        en: 'Listened to customer needs and recommended products — learned that behind every data point is a person.',
      } as L,
    },
  ],
  languages: [
    { name: { mn: 'Монгол', en: 'Mongolian' } as L, level: { mn: 'Төрөлх', en: 'Native' } as L },
    { name: { mn: 'Англи', en: 'English' } as L, level: { mn: 'B1', en: 'B1' } as L },
  ],
  // Далд ухамсар: намайг хөдөлгөдөг зүйлс
  drives: [
    { emoji: '🔍', title: { mn: 'Сониуч зан', en: 'Curiosity' }, text: { mn: 'Тоо бүрийн цаана «яагаад?» гэсэн асуулт нуугдаж байдаг.', en: 'Behind every number hides a “why?”.' } },
    { emoji: '🫶', title: { mn: 'Хүнийг ойлгох', en: 'Understanding people' }, text: { mn: 'Борлуулалтын зөвлөх байхдаа хүмүүсийн шийдвэр гаргалт сонирхолтой санагдсан.', en: 'As a sales consultant I got fascinated by how people make decisions.' } },
    { emoji: '🌱', title: { mn: 'Тасралтгүй өсөлт', en: 'Constant growth' }, text: { mn: 'Өчигдрийн өөрөөсөө өнөөдөр арай илүү байх.', en: 'Be a little better than yesterday’s me.' } },
  ] as { emoji: string; title: L; text: L }[],
  dream: {
    mn: 'Мөрөөдөл: хэрэглэгчийн зан төлөвийг өгөгдлөөр тайлбарлаж, компаниудад хүмүүсээ илүү сайн ойлгоход тусалдаг аналист болох.',
    en: 'Dream: become an analyst who explains customer behaviour with data and helps companies understand their people.',
  } as L,
  // Easter egg: утсаа сэгсрэхэд гарах нууц баримт
  funFact: {
    mn: 'Би одод болон өгөгдлийг адилхан хардаг — хоёулаа холоос замбараагүй, ойроос хэв маягтай. Тийм ч учраас зурхайн «Mystic» апп хийсэн 🌙',
    en: 'I see stars and data the same way — chaotic from afar, patterned up close. That’s why I built a zodiac app called “Mystic” 🌙',
  } as L,
};
