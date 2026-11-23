import React, { useState } from 'react';
import { Image, ImageSourcePropType, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, radius, space } from '../theme';
import { tap } from '../utils/haptics';

/**
 * Бүтээлийн screenshot-ууд: жижиг хүрээнүүд хажуу тийш гүйлгэнэ → дарахад бүтэн дэлгэцээр (2 хуруугаар томруулж) үзнэ.
 */
export default function Gallery({ images, thumbs, color }: { images: ImageSourcePropType[]; thumbs?: ImageSourcePropType[]; color: string }) {
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  // Жижиг хүрээ: тогтмол өндөр, өргөн нь зургийн жинхэнэ харьцаагаар → зураг тайрагдахгүй, бүтнээрээ харагдана
  const FRAME_H = 200;
  const maxW = Math.round(width * 0.7);
  const sizeOf = (src: ImageSourcePropType) => {
    const r = Image.resolveAssetSource(src as any);
    const ratio = r && r.width ? r.height / r.width : 2.16; // өндөр / өргөн (утасны screenshot ~2.16)
    const w = Math.min(Math.round(FRAME_H / ratio), maxW);
    return { width: w, height: Math.round(w * ratio) };
  };

  return (
    <>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.strip}
      >
        {images.map((src, i) => {
          const sz = sizeOf(src);
          return (
          <Pressable
            key={i}
            onPress={() => {
              tap();
              setPage(i);
              setOpen(i);
            }}
            style={[styles.thumb, { borderColor: color }]}
          >
            {/* Жижиг thumbnail нь хүрээтэйгээ ижил хэмжээтэй тул iOS дээр ч томрохгүй, бүтнээрээ харагдана */}
            <Image source={thumbs?.[i] ?? src} style={{ width: sz.width, height: sz.height }} resizeMode="contain" />
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>
                {i + 1}/{images.length}
              </Text>
            </View>
          </Pressable>
          );
        })}
      </ScrollView>
      {images.length > 1 && <Text style={styles.hint}>← → гүйлгэх · дарж томруулах 🔍</Text>}

      <Modal visible={open !== null} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
        <View style={styles.viewer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: (open ?? 0) * width, y: 0 }}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {images.map((src, i) => (
              <ScrollView
                key={i}
                style={{ width, height }}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                maximumZoomScale={3}
                minimumZoomScale={1}
                centerContent
                showsVerticalScrollIndicator={false}
              >
                <Image source={src} style={{ width: width - 16, height: height * 0.86 }} resizeMode="contain" />
              </ScrollView>
            ))}
          </ScrollView>
          <Text style={styles.counter}>
            {page + 1} / {images.length}
          </Text>
          <Pressable onPress={() => setOpen(null)} style={styles.close} hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

/** Хөрөг зураг — гэрэлтсэн тойрог хүрээтэй (зураг байхгүй бол эхний үсэг) */
export function Avatar({ source, size = 96, letter = 'Б' }: { source?: ImageSourcePropType; size?: number; letter?: string }) {
  return (
    <View style={[styles.avatarRing, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View style={[styles.avatarEmpty, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.avatarLetter, { fontSize: size * 0.42 }]}>{letter}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { marginHorizontal: -space.l, marginBottom: space.xs },
  row: { gap: space.s, paddingHorizontal: space.l, alignItems: 'center' },
  thumb: { borderRadius: radius.m, borderWidth: 1.5, overflow: 'hidden', backgroundColor: '#0B0718' },
  badge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#140C2A', fontSize: 11, fontWeight: '800' },
  hint: { color: colors.muted, fontSize: 11, textAlign: 'center', marginBottom: space.m },
  viewer: { flex: 1, backgroundColor: 'rgba(3,5,15,0.96)', justifyContent: 'center' },
  counter: { position: 'absolute', bottom: 40, alignSelf: 'center', color: colors.muted, fontSize: 14 },
  close: { position: 'absolute', top: 56, right: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.text, fontSize: 26 },
  avatarRing: {
    borderWidth: 2,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  avatarEmpty: { backgroundColor: colors.bg2, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: colors.cyan, fontWeight: '900' },
});
