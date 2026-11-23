import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Btn, Card } from './ui';
import { Lang, ui, useLang } from '../i18n';
import { colors, space } from '../theme';
import { downloadCV } from '../utils/downloadCV';
import { success, warn } from '../utils/haptics';

/** CV татах: Монгол / Англи хувилбар */
export default function CvExport() {
  const { t } = useLang();
  const [busy, setBusy] = useState<Lang | null>(null);

  const go = async (l: Lang) => {
    setBusy(l);
    try {
      await downloadCV(l);
      success();
    } catch {
      warn();
    }
    setBusy(null);
  };

  return (
    <Card style={{ borderColor: colors.joy }}>
      <Text style={styles.title}>{t(ui.exportCv)}</Text>
      <View style={styles.row}>
        {(['mn', 'en'] as const).map((l) =>
          busy === l ? (
            <View key={l} style={styles.busy}>
              <ActivityIndicator color={colors.joy} />
            </View>
          ) : (
            <Btn
              key={l}
              label={l === 'mn' ? `🇲🇳 ${t(ui.cvMn)}` : `🇬🇧 ${t(ui.cvEn)}`}
              onPress={() => go(l)}
              color={colors.joy}
              variant={l === 'mn' ? 'primary' : 'ghost'}
              style={{ flex: 1, paddingHorizontal: space.s }}
            />
          )
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.joy, fontSize: 17, fontWeight: '800' },
  row: { flexDirection: 'row', gap: space.s, marginTop: space.m },
  busy: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center' },
});
