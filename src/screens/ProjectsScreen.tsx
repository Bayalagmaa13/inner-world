import React, { useState } from 'react';
import { Linking, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ProjectViz from '../components/ProjectViz';
import Gallery from '../components/Gallery';
import Sheet from '../components/Sheet';
import { Btn, Card, Chip } from '../components/ui';
import { projects } from '../data/projects';
import { L, ui, useLang } from '../i18n';
import { colors, space } from '../theme';
import { tap } from '../utils/haptics';

const typeColor = { data: colors.cyan, app: colors.violet, design: colors.pink };

/** Бүтээлүүд: хуруугаар баруун/зүүн гүйлгэдэг case study картууд */
export default function ProjectsScreen({ onClose, initial = 0 }: { onClose: () => void; initial?: number }) {
  const { t } = useLang();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(initial);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) {
      tap(); // карт солигдох бүрт жижиг чичиргээ
      setPage(p);
    }
  };

  return (
    <Sheet title={`🔭 ${t(ui.projects)}`} onClose={onClose}>
      {/* Хуудасны цэгүүд */}
      <View style={styles.dots}>
        {projects.map((p, i) => (
          <View key={p.id} style={[styles.dot, i === page && { width: 22, backgroundColor: typeColor[p.type] }]} />
        ))}
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentOffset={{ x: initial * width, y: 0 }}
      >
        {projects.map((p, i) => {
          const c = typeColor[p.type];
          return (
            <ScrollView key={p.id} style={{ width }} contentContainerStyle={styles.page}>
              <Text style={styles.counter}>
                {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}  ·  {p.course}
              </Text>
              <Text style={styles.title}>
                {p.emoji} {t(p.title)}
              </Text>
              <View style={styles.chips}>
                {p.tools.map((tool) => (
                  <Chip key={tool} label={tool} color={c} />
                ))}
              </View>

              <Card style={{ paddingHorizontal: space.s, marginBottom: space.m }}>
                <ProjectViz p={p} width={width - space.l * 2 - space.s * 2 - 2} active={i === page} />
              </Card>

              {p.images && p.images.length > 0 && <Gallery images={p.images} color={c} />}

              <Step n="01" label={ui.problem} text={p.problem} color={c} />
              <Step n="02" label={ui.data} text={p.data} color={c} />
              <Step n="03" label={ui.method} text={p.method} color={c} />
              <Step n="04" label={ui.result} text={p.result} color={c} highlight />

              <Btn label={t(ui.open)} onPress={() => Linking.openURL(p.link)} variant="ghost" color={c} style={{ marginTop: space.m }} />
              <Text style={styles.swipe}>{t(ui.swipe)}</Text>
            </ScrollView>
          );
        })}
      </ScrollView>
    </Sheet>
  );
}

function Step({ n, label, text, color, highlight }: { n: string; label: L; text: L; color: string; highlight?: boolean }) {
  const { t } = useLang();
  return (
    <View style={[styles.step, highlight && { borderColor: color, backgroundColor: 'rgba(255,255,255,0.04)' }]}>
      <Text style={[styles.stepN, { color }]}>{n}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.stepLabel, { color }]}>{t(label)}</Text>
        <Text style={styles.stepText}>{t(text)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: space.s },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cardBorder },
  page: { paddingHorizontal: space.l, paddingBottom: space.xxl },
  counter: { color: colors.muted, fontSize: 12, letterSpacing: 1, marginBottom: 4 },
  title: { color: colors.text, fontSize: 21, fontWeight: '800', lineHeight: 28, marginBottom: space.s },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: space.s },
  step: { flexDirection: 'row', gap: space.m, padding: space.m, borderRadius: 12, borderWidth: 1, borderColor: 'transparent', marginBottom: 2 },
  stepN: { fontSize: 13, fontWeight: '900', width: 22, marginTop: 2 },
  stepLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  stepText: { color: colors.text, fontSize: 14.5, lineHeight: 21 },
  swipe: { color: colors.muted, textAlign: 'center', marginTop: space.m, fontSize: 12 },
});
