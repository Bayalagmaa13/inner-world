import React, { useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LangProvider, ui, useLang } from './src/i18n';
import { colors, radius, space, TOUCH } from './src/theme';
import Scene, { SceneInput } from './src/three/Scene';
import { emotions } from './src/data/emotions';
import { profile } from './src/data/profile';
import { projects } from './src/data/projects';
import { groups, skills, Group } from './src/data/skills';
import { Card, Chip, LangToggle } from './src/components/ui';
import CvExport from './src/components/CvExport';
import { Avatar } from './src/components/Gallery';
import ProjectsScreen from './src/screens/ProjectsScreen';
import { useShake } from './src/hooks/useShake';
import { useTiltRef } from './src/hooks/useTiltRef';
import { tap, thud, success, warn } from './src/utils/haptics';
import { playChime, playPop } from './src/utils/sound';

export default function App() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <StatusBar style="light" />
        <InnerWorld />
      </LangProvider>
    </SafeAreaProvider>
  );
}

const SECTIONS = 6;

/**
 * Апп-ын бүтэц:
 *   Ар талд — 3D ертөнц (Scene)
 *   Урд талд — доош гүйлгэдэг 6 хэсэг. Гүйлгэх тусам 3D камер дүрийн «дотоод ертөнц» рүү шумбана.
 */
function InnerWorld() {
  const { t } = useLang();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // 3D руу дамжуулах өгөгдөл — ref тул өөрчлөгдөхөд дахин render хийгдэхгүй
  const input = useRef<SceneInput>({ look: { x: 0, y: 0 }, wave: false, bounce: false, visible: true, progress: 0 });
  const lastTouch = useRef(0);
  useTiltRef(input, lastTouch);

  const [emo, setEmo] = useState(0);
  const [section, setSection] = useState(0);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);
  const tops = useRef<number[]>(Array.from({ length: SECTIONS }, (_, i) => i * height));

  const changeEmotion = (i: number, sound = true) => {
    thud();
    if (sound) playChime(i);
    setEmo(i);
    input.current.bounce = true;
  };

  // Easter egg — сэгсрэхэд: гайхсан царай + дуу + нууц баримт
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useShake(() => {
    warn();
    playPop();
    changeEmotion(1, false);
    setToast(`${t(ui.shake)}\n${t(profile.funFact)}`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, openProject === null);

  // Хуруу (эсвэл вэб дээр хулгана) хөдлөхөд дүр тийш харна
  const onMove = (x: number, y: number) => {
    lastTouch.current = Date.now();
    input.current.look.x = (x / width) * 2 - 1;
    input.current.look.y = -((y / height) * 2 - 1);
  };

  // Гүйлгэлтийн байрлалаас 0..5 progress тооцоолох (хэсэг бүрийн өндөр өөр байж болно)
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const T = tops.current;
    let i = 0;
    while (i < SECTIONS - 2 && y >= T[i + 1]) i++;
    const p = i + Math.min(1, Math.max(0, (y - T[i]) / (T[i + 1] - T[i])));
    input.current.progress = p;
    input.current.wave = p > 4.5;
    const s = Math.round(p);
    if (s !== section) {
      tap();
      setSection(s);
      if (s === SECTIONS - 1) success();
    }
  };

  const goTo = (i: number) => {
    tap();
    scroll.current?.scrollTo({ y: tops.current[i], animated: true });
  };

  const e = emotions[emo];
  const sectionStyle = { minHeight: height, paddingTop: insets.top + 70, paddingBottom: insets.bottom + space.xl };

  return (
    <View
      style={styles.root}
      onTouchMove={(ev: GestureResponderEvent) => onMove(ev.nativeEvent.pageX, ev.nativeEvent.pageY)}
      onPointerMove={(ev) => onMove(ev.nativeEvent.pageX, ev.nativeEvent.pageY)}
    >
      <View style={StyleSheet.absoluteFill}>
        <Scene input={input} emotion={e} />
      </View>

      <ScrollView
        ref={scroll}
        style={StyleSheet.absoluteFill}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* 0 — Танилцуулга */}
        <Section index={0} tops={tops} style={sectionStyle}>
          <Pressable
            style={{ height: height * 0.4 }}
            onPress={() => changeEmotion((emo + 1) % emotions.length)}
            onLongPress={() => {
              input.current.wave = true;
              success();
              setTimeout(() => (input.current.wave = input.current.progress > 4.5), 2500);
            }}
            accessibilityLabel="avatar"
          />
          <View style={{ flex: 1 }} />
          <View style={{ alignItems: 'center', marginBottom: space.s }}>
            <Avatar source={profile.photo} size={72} />
          </View>
          <Text style={[styles.kicker, { color: e.color }]}>{t(ui.kicker)}</Text>
          <Text style={styles.name}>{t(profile.name)}</Text>
          <Text style={styles.role}>{t(profile.role)}</Text>
          <Text style={styles.tagline}>{t(profile.tagline)}</Text>

          <View style={styles.emoRow}>
            {emotions.map((em, i) => (
              <Pressable
                key={em.id}
                onPress={() => changeEmotion(i)}
                style={[styles.emoBtn, i === emo && { borderColor: em.color, backgroundColor: 'rgba(255,255,255,0.08)' }]}
              >
                <Text style={{ fontSize: 22 }}>{em.emoji}</Text>
                <Text style={[styles.emoName, i === emo && { color: em.color }]}>{t(em.name)}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.quote, { color: e.color }]}>“{t(e.quote)}”</Text>
          <Text style={styles.hint}>{t(ui.tapMe)}</Text>
          <Text style={[styles.hint, { marginTop: 4 }]}>{t(ui.scrollDown)}</Text>
        </Section>

        {/* 1 — Ухамсар: Миний тухай */}
        <Section index={1} tops={tops} style={sectionStyle}>
          <View style={{ flex: 1 }} />
          <Card>
            <Text style={[styles.label, { color: colors.curious }]}>{t(ui.s1)}</Text>
            <Text style={styles.h}>{t(ui.s1t)}</Text>
            <Text style={styles.body}>{t(profile.bio)}</Text>
            <View style={styles.stats}>
              {[projects.length, skills.length, 2028].map((v, i) => (
                <View key={i} style={styles.stat}>
                  <Text style={[styles.statV, { color: [colors.curious, colors.joy, colors.love][i] }]}>{v}</Text>
                  <Text style={styles.statL}>{t(ui.stats[i])}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.small}>
              💼 {t(profile.experience[0].title)} · {t(profile.experience[0].period)}
            </Text>
            <Text style={styles.small}>🎓 {t(profile.school)}</Text>
          </Card>
        </Section>

        {/* 2 — Бодлын бөмбөлгүүд: Ур чадвар */}
        <Section index={2} tops={tops} style={sectionStyle}>
          <View style={{ flex: 1 }} />
          <Card>
            <Text style={[styles.label, { color: colors.calm }]}>{t(ui.s2)}</Text>
            <Text style={styles.h}>{t(ui.s2t)}</Text>
            {(Object.keys(groups) as Group[]).map((g) => (
              <View key={g} style={{ marginTop: space.m }}>
                <Text style={[styles.group, { color: groups[g].color }]}>
                  {groups[g].emoji} {t(groups[g].name)} <Text style={styles.groupDesc}>· {t(groups[g].desc)}</Text>
                </Text>
                <View style={styles.chips}>
                  {skills
                    .filter((s) => s.group === g)
                    .map((s) => (
                      <Chip key={s.id} label={`${s.name}  ${'●'.repeat(s.level)}${'○'.repeat(5 - s.level)}`} color={groups[g].color} />
                    ))}
                </View>
              </View>
            ))}
          </Card>
        </Section>

        {/* 3 — Дурсамж: Бүтээлүүд */}
        <Section index={3} tops={tops} style={sectionStyle}>
          <View style={{ flex: 1 }} />
          <Card>
            <Text style={[styles.label, { color: colors.joy }]}>{t(ui.s3)}</Text>
            <Text style={styles.h}>{t(ui.s3t)}</Text>
            {projects.map((p, i) => (
              <Pressable
                key={p.id}
                onPress={() => {
                  tap();
                  setOpenProject(i);
                }}
                style={({ pressed }) => [styles.proj, pressed && { backgroundColor: 'rgba(255,255,255,0.06)' }]}
              >
                <Text style={styles.projEmoji}>{p.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projTitle} numberOfLines={1}>
                    {t(p.title)}
                  </Text>
                  <Text style={styles.projSub}>{p.course}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}
          </Card>
        </Section>

        {/* 4 — Далд ухамсар */}
        <Section index={4} tops={tops} style={sectionStyle}>
          <View style={{ flex: 1 }} />
          <Card style={{ backgroundColor: 'rgba(8,6,20,0.82)' }}>
            <Text style={[styles.label, { color: colors.love }]}>{t(ui.s4)}</Text>
            <Text style={styles.h}>{t(ui.s4t)}</Text>
            {profile.drives.map((d) => (
              <View key={d.emoji} style={styles.drive}>
                <Text style={{ fontSize: 24 }}>{d.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driveT}>{t(d.title)}</Text>
                  <Text style={styles.body}>{t(d.text)}</Text>
                </View>
              </View>
            ))}
            <Text style={[styles.dream]}>✨ {t(profile.dream)}</Text>
          </Card>
        </Section>

        {/* 5 — Холбогдох */}
        <Section index={5} tops={tops} style={sectionStyle}>
          <View style={{ flex: 1 }} />
          <Text style={[styles.label, { color: colors.curious, textAlign: 'center' }]}>{t(ui.s5)}</Text>
          <View style={{ alignItems: 'center', marginVertical: space.m }}>
            <Avatar source={profile.photo} size={120} />
          </View>
          <Text style={[styles.name, { fontSize: 30 }]}>{t(ui.s5t)}</Text>
          <Text style={[styles.tagline, { marginBottom: space.l }]}>{t(ui.bye)}</Text>
          <View style={styles.links}>
            {[
              { icon: '✉️', label: 'Email', url: `mailto:${profile.contact.email}` },
              { icon: '📞', label: 'Phone', url: `tel:${profile.contact.phone}` },
              { icon: '🐙', label: 'GitHub', url: profile.contact.github },
              { icon: '👥', label: 'Facebook', url: profile.contact.facebook },
            ].map((l) => (
              <Pressable
                key={l.label}
                onPress={() => {
                  tap();
                  Linking.openURL(l.url);
                }}
                style={({ pressed }) => [styles.link, { transform: [{ scale: pressed ? 0.93 : 1 }] }]}
              >
                <Text style={{ fontSize: 24 }}>{l.icon}</Text>
                <Text style={styles.linkL}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
          <CvExport />
        </Section>
      </ScrollView>

      {/* Дээд мөр: лого + хэл */}
      <View style={[styles.top, { paddingTop: insets.top + space.s }]} pointerEvents="box-none">
        <Pressable onPress={() => goTo(0)} style={[styles.logo, { borderColor: e.color }]}>
          <Text style={[styles.logoT, { color: e.color }]}>Б</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <LangToggle />
      </View>

      {/* Баруун талын хэсгийн цэгүүд */}
      <View style={[styles.dots, { top: height / 2 - SECTIONS * 14 }]}>
        {Array.from({ length: SECTIONS }, (_, i) => (
          <Pressable key={i} onPress={() => goTo(i)} hitSlop={10} style={styles.dotHit}>
            <View style={[styles.dot, i === section && { height: 22, backgroundColor: e.color }]} />
          </Pressable>
        ))}
      </View>

      {toast && (
        <Pressable onPress={() => setToast(null)} style={[styles.toast, { top: insets.top + 64 }]}>
          <Text style={styles.toastT}>{toast}</Text>
        </Pressable>
      )}

      {openProject !== null && <ProjectsScreen initial={openProject} onClose={() => setOpenProject(null)} />}
    </View>
  );
}

/** Нэг хэсэг — өөрийн дээд байрлалыг (top) хэмжиж хадгална */
function Section({
  index,
  tops,
  style,
  children,
}: {
  index: number;
  tops: React.RefObject<number[]>;
  style: object;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[styles.section, style]}
      onLayout={(ev) => {
        tops.current[index] = ev.nativeEvent.layout.y;
      }}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  section: { paddingHorizontal: space.l, paddingRight: space.xl + 8 },
  top: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.l },
  logo: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(20,12,42,0.6)' },
  logoT: { fontSize: 20, fontWeight: '900' },
  dots: { position: 'absolute', right: 8, alignItems: 'center' },
  dotHit: { width: 24, height: 28, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 3, textAlign: 'center' },
  name: { color: colors.text, fontSize: 36, fontWeight: '900', textAlign: 'center', marginTop: 4, textShadowColor: '#000', textShadowRadius: 10 },
  role: { color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center', opacity: 0.9, marginTop: 2 },
  tagline: { color: '#D9D0F5', fontSize: 14.5, textAlign: 'center', marginTop: space.s, lineHeight: 21, textShadowColor: '#000', textShadowRadius: 6 },
  emoRow: { flexDirection: 'row', gap: space.s, marginTop: space.l },
  emoBtn: { flex: 1, minHeight: 60, borderRadius: radius.m, borderWidth: 1.5, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(20,12,42,0.55)' },
  emoName: { color: colors.muted, fontSize: 11, marginTop: 2, fontWeight: '700' },
  quote: { fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginTop: space.m, minHeight: 40 },
  hint: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: space.s },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  h: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 4, marginBottom: space.s },
  body: { color: colors.text, fontSize: 14.5, lineHeight: 22, opacity: 0.92 },
  small: { color: colors.muted, fontSize: 12.5, marginTop: space.s },
  stats: { flexDirection: 'row', marginVertical: space.m, gap: space.s },
  stat: { flex: 1, alignItems: 'center', paddingVertical: space.s, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  statV: { fontSize: 24, fontWeight: '900' },
  statL: { color: colors.muted, fontSize: 11.5 },
  group: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  groupDesc: { color: colors.muted, fontSize: 12, fontWeight: '500' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  proj: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: TOUCH + 8, paddingHorizontal: 6, borderRadius: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  projEmoji: { fontSize: 24 },
  projTitle: { color: colors.text, fontSize: 14.5, fontWeight: '700' },
  projSub: { color: colors.muted, fontSize: 12, marginTop: 1 },
  arrow: { color: colors.muted, fontSize: 26 },
  drive: { flexDirection: 'row', gap: space.m, marginTop: space.m },
  driveT: { color: colors.love, fontSize: 15, fontWeight: '800', marginBottom: 2 },
  dream: { color: colors.joy, fontSize: 14.5, lineHeight: 22, marginTop: space.l, fontStyle: 'italic' },
  links: { flexDirection: 'row', gap: space.s, marginBottom: space.m },
  link: { flex: 1, height: 72, borderRadius: radius.m, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  linkL: { color: colors.text, fontSize: 11.5, fontWeight: '700', marginTop: 2 },
  toast: { position: 'absolute', alignSelf: 'center', maxWidth: '88%', backgroundColor: colors.card, borderColor: colors.curious, borderWidth: 1, borderRadius: 20, paddingHorizontal: space.l, paddingVertical: space.s },
  toastT: { color: colors.text, fontWeight: '700', textAlign: 'center', lineHeight: 21 },
});
