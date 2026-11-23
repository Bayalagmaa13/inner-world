import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

/**
 * Утсыг сэгсрэхэд onShake дуудагдана.
 * Хурдатгалын нийт хэмжээ (√(x²+y²+z²)) 1 g-ээс их хэтэрвэл сэгсэрсэн гэж үзнэ.
 */
export function useShake(onShake: () => void, enabled = true, threshold = 1.9) {
  const last = useRef(0);
  const cb = useRef(onShake);
  cb.current = onShake;

  useEffect(() => {
    if (Platform.OS === 'web' || !enabled) return;
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const g = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (g > threshold && now - last.current > 1500) {
        last.current = now; // 1.5 секундэд нэг л удаа
        cb.current();
      }
    });
    return () => sub.remove();
  }, [enabled]);
}
