import React, { useState } from 'react';
import { Image, ImageSourcePropType, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, radius, space } from '../theme';
import { tap } from '../utils/haptics';

/**
 * Бүтээлийн screenshot-ууд: жижиг зургууд → дарахад бүтэн дэлгэцээр гүйлгэж үзнэ.
 */
export default function Gallery({ images, color }: { images: ImageSourcePropType[]; color: string }) {
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  return (
    <>
      <View style={styles.row}>
        {images.slice(0, 3).map((src, i) => (
          <Pressable
            key={i}
            onPress={() => {
              tap();
              setPage(i);
              setOpen(i);
            }}
            style={[styles.thumb, { borderColor: color }]}
          >
            <Image source={src} style={StyleSheet.absoluteFill} resizeMode="cover" />
            {i === 2 && images.length > 3 && (
              <View style={styles.more}>
                <Text style={styles.moreText}>+{images.length - 3}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

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
              <Image key={i} source={src} style={{ width, height: height * 0.8 }} resizeMode="contain" />
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
  row: { flexDirection: 'row', gap: space.s, marginBottom: space.m },
  thumb: { flex: 1, aspectRatio: 9 / 16, maxHeight: 180, borderRadius: radius.s, borderWidth: 1, overflow: 'hidden', backgroundColor: colors.card },
  more: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  moreText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  viewer: { flex: 1, backgroundColor: 'rgba(3,5,15,0.96)', justifyContent: 'center' },
  counter: { position: 'absolute', bottom: 48, alignSelf: 'center', color: colors.muted, fontSize: 14 },
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
