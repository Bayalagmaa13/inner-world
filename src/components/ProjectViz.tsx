import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
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

const flowColor = { data: colors.cyan, app: colors.violet, design: colors.pink };

function draw(p: Project, W: number, H: number) {
  const d = p.vizData;
  switch (p.viz) {
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
    case 'flow':
    default: {
      // Ажлын урсгал: vizData-ийн label бүр нэг алхам, сүүлийнх нь онцлогдоно
      const c = flowColor[p.type];
      const steps = d.map((v) => v.label);
      const gap = (W - 60) / Math.max(1, steps.length - 1);
      return (
        <G>
          <Line x1={30} y1={H / 2} x2={W - 30} y2={H / 2} stroke={c} strokeOpacity={0.5} strokeWidth={2} />
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <G key={s + i}>
                <Circle cx={30 + i * gap} cy={H / 2} r={26} fill={last ? c : colors.bg} stroke={c} strokeWidth={2} />
                <SvgText x={30 + i * gap} y={H / 2 + 4} fill={last ? colors.bg : colors.text} fontSize={11} fontWeight="700" textAnchor="middle">
                  {s}
                </SvgText>
              </G>
            );
          })}
          <SvgText x={W / 2} y={18} fill={colors.muted} fontSize={12} textAnchor="middle">{p.emoji} workflow</SvgText>
        </G>
      );
    }
  }
}
