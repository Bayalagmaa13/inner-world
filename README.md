# 💜 Inner World — Н.Баялагмаагийн 3D портфолио апп

**SWM231 Mobile Programming · Бүтээлч ажил** · B22FT1005 · 406 анги

📲 **Утсан дээр нээх:** APK — `<EAS build-ийн холбоосыг энд тавина>`
🐙 **GitHub:** https://github.com/Bayalagmaa13
✉️ nbayalagmaaa@gmail.com

> Сэтгэл зүй × Өгөгдөл. Доош гүйлгэх тусам камер миний толгой руу шумбаж,
> ухамсар → бодол → дурсамж → далд ухамсар гэсэн давхаргуудаар аялна.

## 💡 Бүтээлч санаа
Фрейдийн ухамсрын загварыг (мөсөн уул) портфолиогийн бүтэц болгосон:

| # | Давхарга | Агуулга | 3D-д юу болох |
|---|---|---|---|
| 0 | Танилцуулга | Нэр, чиглэл, сэтгэл хөдлөл | 3D дүр хуруу / хазайлтыг дагаж харна |
| 1 | Ухамсар | Миний тухай | Камер толгой руу ойртоно |
| 2 | Бодлын бөмбөлгүүд | Ур чадвар (Бодол, Илэрхийлэл, Үйлдэл, Мэдрэмж) | Толгой дотор бөмбөлгүүд эргэлдэнэ |
| 3 | Дурсамж | 6 бүтээл (case study, screenshot-той) | Дурсамжийн талстууд эргэнэ |
| 4 | Далд ухамсар | Намайг хөдөлгөдөг зүйлс, мөрөөдөл | Харанхуй гүнд цохилох «цөм» |
| 5 | Холбогдох | Холбоос, CV татах | Дүр гараа даллана 👋 |

### Мобайлын давуу тал
- 📱 **Accelerometer** — утсаа хазайлгахад дүр тийш харж, камер parallax хөдөлнө
- 👆 **Touch** — хуруу хөдлөхөд дүрийн толгой, нүд дагана; дүр дээр товшвол сэтгэл хөдлөл солигдоно; удаан дарвал гар даллана
- 🫨 **Сэгсрэх** — дүр гайхаж үсэрнэ
- 📳 **Haptics** — хэсэг солигдох, товч, сэтгэл хөдлөл бүрт
- 🔊 **Дуу** — сэтгэл хөдлөл бүр өөр нотоор дуугарна, сэгсрэхэд «поп» дуу (`expo-audio`)
- 🥚 **Easter egg** — утсаа сэгсрэхэд дүр гайхаж, миний тухай нууц баримт гарч ирнэ
- 👉 **Swipe картууд** — бүтээлүүдийг хуруугаар баруун/зүүн гүйлгэж, screenshot-ыг бүтэн дэлгэцээр үзнэ
- 🎨 **Өнгөний сэтгэл зүй** — 4 сэтгэл хөдлөл (Баяр, Сониуч, Тайван бодол, Хайр) нь дүрийн царай, гэрэл, «цөм»-ийн өнгийг өөрчилнө
- 🌐 MN / EN хэл, өөрийн icon, splash

## 🛠 Технологи
- React Native + Expo (TypeScript) — утас болон **вэб сайт** хоёуланд ажиллана
- `three` + `@react-three/fiber` + `expo-gl` — 3D
- 3D дүрийг **гаднаас татаагүй** — бөмбөрцөг, капсул, torus зэрэг геометрээр кодоор зурсан (`src/three/Avatar.tsx`)
- `expo-sensors`, `expo-haptics`, `expo-audio`, `expo-asset`, `expo-file-system`, `expo-sharing`, `react-native-svg`

## 📁 Бүтэц
```
App.tsx                 # 6 хэсэг + гүйлгэлт → 3D progress
src/three/Avatar.tsx    # Кодоор зурсан 3D дүр (толгой дагах, нүд цавчих, үсрэх, даллах)
src/three/Scene.tsx     # Камерын замнал, бодлын бөмбөлөг, дурсамж, далд ухамсрын цөм
src/data/               # profile, emotions, skills, projects
src/hooks/              # useTiltRef (хазайлт), useShake (сэгсрэлт)
src/utils/              # haptics, sound (дуу), downloadCV
src/screens/            # ProjectsScreen (case study картууд)
assets/cv/              # CV PDF (MN, EN)
assets/projects/        # Бүтээлүүдийн screenshot
assets/sounds/          # Кодоор синтезлэсэн дуунууд
```

## ▶️ Ажиллуулах
```bash
npm install
npx expo start          # утсан дээр Expo Go-оор QR уншуулна
npx expo start --web    # вэб сайт хэлбэрээр
```
APK (`eas.json` дахь `preview` профайл нь APK гаргана):
```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

## 🔗 Бүтээлүүдийн холбоос
- Mystic — https://github.com/Bayalagmaa13/mystic
- StudyMate AI — https://github.com/Bayalagmaa13/StudyMateAI
- Coffee House (Figma прототип) — https://www.figma.com/proto/Q864pKIQ7mS7rPr5hLkdHt/N.Bayalagmaa_CGR321Coffee-House-Prototype?node-id=2-403&starting-point-node-id=2%3A388

## 📚 Эх сурвалж
- Санаа: moncy.dev зэрэг 3D портфолио сайтуудаас санаа авсан (код хуулаагүй).
- Бүх 3D дүр, график, icon-ыг энэ төсөлд зориулж кодоор бүтээсэн.
- Бүтээлүүдийн screenshot бүгд миний өөрийн ажил (Mystic апп, StudyMate AI апп, Coffee House Figma прототип).
- Дуунуудыг (`assets/sounds`) Python-оор синтезлэж өөрөө үүсгэсэн — гаднаас татаагүй.
- AI хэрэгсэл (Claude) ашиглан санаа боловсруулж, кодын суурийг бичүүлсэн. Бүх хэсгийг өөрөө уншиж ойлгон, өөрчилсөн.
