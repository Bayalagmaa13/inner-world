import React, { createContext, useContext, useState } from 'react';

// Хоёр хэлтэй текст: { mn: '...', en: '...' }
export type L = { mn: string; en: string };
export type Lang = 'mn' | 'en';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (text: L) => string };

const LangContext = createContext<Ctx>({ lang: 'mn', setLang: () => {}, t: (x) => x.mn });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('mn');
  const t = (text: L) => text[lang];
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// Апп-ын UI текстүүд
export const ui = {
  kicker: { mn: 'СЭТГЭЛ ЗҮЙ × ӨГӨГДӨЛ', en: 'PSYCHOLOGY × DATA' },
  tapMe: { mn: '👆 Над дээр дарж сэтгэл хөдлөлийг минь солиорой', en: '👆 Tap me to change my mood' },
  scrollDown: { mn: '↓ Дотоод ертөнц рүү минь ор', en: '↓ Step into my inner world' },
  s1: { mn: '01 · Ухамсар', en: '01 · Conscious mind' },
  s1t: { mn: 'Миний тухай', en: 'About me' },
  s2: { mn: '02 · Бодлын бөмбөлгүүд', en: '02 · Thought bubbles' },
  s2t: { mn: 'Толгой дотор минь юу эргэлддэг вэ', en: 'What spins inside my head' },
  s3: { mn: '03 · Дурсамж', en: '03 · Memories' },
  s3t: { mn: 'Миний бүтээлүүд', en: 'My projects' },
  s4: { mn: '04 · Далд ухамсар', en: '04 · Subconscious' },
  s4t: { mn: 'Намайг хөдөлгөдөг зүйлс', en: 'What drives me' },
  s5: { mn: '05 · Холбогдох', en: '05 · Connect' },
  s5t: { mn: 'Ярилцах уу?', en: 'Shall we talk?' },
  projects: { mn: 'Бүтээлүүд', en: 'Projects' },
  stats: [
    { mn: 'Бүтээл', en: 'Projects' },
    { mn: 'Ур чадвар', en: 'Skills' },
    { mn: 'Төгсөх он', en: 'Graduating' },
  ],
  experience: { mn: 'Туршлага', en: 'Experience' },
  problem: { mn: 'Асуудал', en: 'Problem' },
  data: { mn: 'Өгөгдөл', en: 'Data' },
  method: { mn: 'Арга', en: 'Method' },
  result: { mn: 'Үр дүн / Insight', en: 'Result / Insight' },
  open: { mn: 'Нээх ↗', en: 'Open ↗' },
  swipe: { mn: '← гүйлгэж үзнэ үү →', en: '← swipe →' },
  exportCv: { mn: '📄 CV татах (PDF)', en: '📄 Download CV (PDF)' },
  cvMn: { mn: 'Монгол', en: 'Mongolian' },
  cvEn: { mn: 'Англи', en: 'English' },
  bye: { mn: 'Дотоод ертөнцөөр минь аялсанд баярлалаа 💜', en: 'Thanks for visiting my inner world 💜' },
  shake: { mn: 'Өө! Намайг сэгсэрчихлээ 😳', en: 'Whoa! You shook me 😳' },
};
