import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Linking, Platform } from 'react-native';
import type { Lang } from '../i18n';

// CV-нүүд апп дотор хадгалагдсан тул интернэтгүй ч ажиллана
const CV_FILES = {
  mn: require('../../assets/cv/CV_Bayalagmaa_MN.pdf'),
  en: require('../../assets/cv/CV_Bayalagmaa_EN.pdf'),
};

export async function downloadCV(lang: Lang) {
  // 1. Апп-ын asset-аас PDF-ийг утасны санах ойд гаргана
  const asset = Asset.fromModule(CV_FILES[lang]);
  await asset.downloadAsync();

  // Web дээр шууд шинэ цонхонд нээнэ
  if (Platform.OS === 'web') {
    Linking.openURL(asset.localUri ?? asset.uri);
    return;
  }

  // 2. Ойлгомжтой нэртэй файл болгон хуулна
  const source = new File(asset.localUri!);
  const target = new File(Paths.cache, `CV_Bayalagmaa_${lang.toUpperCase()}.pdf`);
  await source.copy(target, { overwrite: true });

  // 3. «Хадгалах / Илгээх» цэсийг нээнэ (Files, Telegram, Gmail ...)
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(target.uri, { mimeType: 'application/pdf', dialogTitle: 'CV', UTI: 'com.adobe.pdf' });
  }
}
