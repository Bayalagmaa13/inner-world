import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, G, Line, Path, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import type { Project } from '../data/projects';
import { colors } from '../theme';

/**
 * Бүтээл бүрт зориулсан жижиг дүрслэл (SVG-ээр өөрөө зурсан).
 * Карт гарч ирэхэд доороос «ургаж» гарна.
 */
export default function ProjectViz({ p, width, active }: { p: Project; width: number; active: boolean }) {
  const H = 130;
  const grow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      grow.setValue(0);
      Animated.spring(grow, { toValue: 1, useNativeDriver: true, damping: 12 }).start();
    }
  }, [active]);

  return (
    <Animated.View
      style={{
        height: H,
        opacity: grow,
        transform: [{ scaleY: grow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }, { translateY: grow.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
      }}
    >
      <Svg width={width} height={H}>{draw(p, width, H)}</Svg>
    </Animated.View>
  );
}

function draw(p: Project, W: number, H: number) {
  const d = p.vizData;
  switch (p.viz) {
    case 'bars': {
      // Загварын нарийвчлалын харьцуулалт
      const bw = W / (d.length * 2);
      return (
        <G>
          {d.map((v, i) => {
            const h = v.value * (H - 34);
            const x = bw / 2 + i * bw * 2;
            return (
              <G key={i}>
                <Rect x={x} y={H - 18 - h} width={bw} height={h} rx={6} fill={i === d.length - 1 ? colors.cyan : 'rgba(94,234,212,0.35)'} />
                <SvgText x={x + bw / 2} y={H - 22 - h} fill={colors.text} fontSize={12} fontWeight="700" textAnchor="middle">
                  {Math.round(v.value * 100)}%
                </SvgText>
                <SvgText x={x + bw / 2} y={H - 3} fill={colors.muted} fontSize={11} textAnchor="middle">
                  {v.label}
                </SvgText>
              </G>
            );
          })}
        </G>
      );
    }
    case 'line':
    case 'study': {
      const color = p.viz === 'line' ? colors.gold : colors.violet;
      const step = (W - 40) / (d.length - 1);
      const pts = d.map((v, i) => [20 + i * step, H - 22 - v.value * (H - 40)]);
      const area = `M${pts[0][0]},${H - 22} ` + pts.map((q) => `L${q[0]},${q[1]}`).join(' ') + ` L${pts[pts.length - 1][0]},${H - 22} Z`;
      return (
        <G>
          <Line x1={10} y1={H - 22} x2={W - 10} y2={H - 22} stroke={colors.cardBorder} />
          <Path d={area} fill={color} fillOpacity={0.15} />
          <Polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={3} />
          {pts.map((q, i) => (
            <G key={i}>
              <Circle cx={q[0]} cy={q[1]} r={5} fill={colors.bg} stroke={color} strokeWidth={2.5} />
              <SvgText x={q[0]} y={H - 6} fill={colors.muted} fontSize={11} textAnchor="middle">
                {d[i].label}
              </SvgText>
            </G>
          ))}
        </G>
      );
    }
    case 'compare': {
      // Хоёр банкны үзүүлэлтийн харьцуулалт (хэвтээ баар)
      const rowH = (H - 10) / d.length;
      const max = W - 110;
      return (
        <G>
          {d.map((v, i) => {
            const y = 6 + i * rowH;
            const other = Math.min(1, v.value + 0.15 + (i % 2) * 0.1);
            return (
              <G key={i}>
                <SvgText x={4} y={y + rowH / 2 + 4} fill={colors.muted} fontSize={11}>
                  {v.label}
                </SvgText>
                <Rect x={44} y={y + 3} width={v.value * max} height={rowH / 2 - 4} rx={4} fill={colors.gold} />
                <Rect x={44} y={y + rowH / 2} width={other * max} height={rowH / 2 - 4} rx={4} fill={colors.pink} fillOpacity={0.6} />
              </G>
            );
          })}
          <SvgText x={W - 4} y={14} fill={colors.gold} fontSize={11} textAnchor="end">■ Golomt</SvgText>
          <SvgText x={W - 4} y={30} fill={colors.pink} fontSize={11} textAnchor="end">■ DBS</SvgText>
        </G>
      );
    }
    case 'zodiac': {
      // 12 ордны дугуй
      const cx = W / 2;
      const cy = H / 2;
      const r = H / 2 - 8;
      return (
        <G>
          <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.violet} strokeOpacity={0.6} />
          <Circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={colors.violet} strokeOpacity={0.3} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <G key={i}>
                <Line x1={cx + Math.cos(a) * r * 0.6} y1={cy + Math.sin(a) * r * 0.6} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={colors.violet} strokeOpacity={0.4} />
                <Circle cx={cx + Math.cos(a + 0.26) * r * 0.8} cy={cy + Math.sin(a + 0.26) * r * 0.8} r={2.5} fill={colors.star} />
              </G>
            );
          })}
          <SvgText x={cx} y={cy + 8} fontSize={24} textAnchor="middle">🌙</SvgText>
        </G>
      );
    }
    case 'cup':
    default: {
      // Захиалгын урсгал: алхам цөөрсөн
      const steps = ['Menu', 'Size', 'Pay', '✓'];
      const gap = (W - 40) / (steps.length - 1);
      return (
        <G>
          <Line x1={20} y1={H / 2} x2={W - 20} y2={H / 2} stroke={colors.pink} strokeOpacity={0.5} strokeWidth={2} />
          {steps.map((s, i) => (
            <G key={s}>
              <Circle cx={20 + i * gap} cy={H / 2} r={20} fill={i === steps.length - 1 ? colors.pink : colors.bg} stroke={colors.pink} strokeWidth={2} />
              <SvgText x={20 + i * gap} y={H / 2 + 4} fill={i === steps.length - 1 ? colors.bg : colors.text} fontSize={11} fontWeight="700" textAnchor="middle">
                {s}
              </SvgText>
            </G>
          ))}
          <SvgText x={W / 2} y={22} fill={colors.muted} fontSize={12} textAnchor="middle">☕ order flow</SvgText>
        </G>
      );
    }
  }
}
