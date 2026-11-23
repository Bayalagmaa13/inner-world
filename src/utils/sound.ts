import { AudioPlayer, createAudioPlayer } from 'expo-audio';

/**
 * Микро-интеракцийн дуу.
 * Дуунууд нь энэ төсөлд зориулж Python-оор синтезлэсэн богино аялгууд (assets/sounds).
 * Сэтгэл хөдлөл бүр өөр нотоор дуугарна: Баяр, Сониуч, Тайван бодол, Хайр.
 */
const chimeSources = [
  require('../../assets/sounds/chime-0.wav'),
  require('../../assets/sounds/chime-1.wav'),
  require('../../assets/sounds/chime-2.wav'),
  require('../../assets/sounds/chime-3.wav'),
];
const popSource = require('../../assets/sounds/pop.wav');

// Player-уудыг анх хэрэгтэй үед нь нэг удаа үүсгээд дахин ашиглана
const cache = new Map<number, AudioPlayer>();

function play(key: number, source: number) {
  try {
    let player = cache.get(key);
    if (!player) {
      player = createAudioPlayer(source);
      player.volume = 0.6;
      cache.set(key, player);
    }
    player.seekTo(0);
    player.play();
  } catch {
    // Дуу тоглуулж чадахгүй бол (жишээ нь вэб дээр зөвшөөрөлгүй) чимээгүй алгасна
  }
}

export const playChime = (emotion: number) => play(emotion, chimeSources[emotion % chimeSources.length]);
export const playPop = () => play(99, popSource);
