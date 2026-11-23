import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

/**
 * Утасны хазайлтыг ref руу бичнэ (-1..1).
 * State биш ref ашигласан → 3D дүр секундэд 60 удаа уншихад апп дахин render хийгдэхгүй.
 * Хэрэглэгч сүүлийн 2 секундэд хуруугаар хүрсэн бол хуруу давуу эрхтэй.
 */
export function useTiltRef(target: { current: { look: { x: number; y: number } } | null }, lastTouch: { current: number }) {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let fx = 0;
    let fy = 0;
    Accelerometer.setUpdateInterval(40);
    const sub = Accelerometer.addListener(({ x, y }) => {
      fx = fx * 0.85 + x * 0.15; // low-pass filter
      fy = fy * 0.85 + y * 0.15;
      if (Date.now() - lastTouch.current < 2000 || !target.current) return;
      target.current.look.x = Math.max(-1, Math.min(1, -fx * 1.6));
      target.current.look.y = Math.max(-1, Math.min(1, (fy + 0.5) * 1.6)); // утсыг ихэвчлэн 30° хазайлгаж барьдаг
    });
    return () => sub.remove();
  }, []);
}
