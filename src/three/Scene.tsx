import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from './fiber';
import * as THREE from 'three';
import Avatar, { AvatarInput } from './Avatar';
import type { Emotion } from '../data/emotions';
import { groups, skills } from '../data/skills';
import { projects } from '../data/projects';

/**
 * Бүхэл 3D ертөнц. Гүйлгэлтийн явц (progress: 0..5) камерыг дараах цэгүүдээр дамжуулна:
 *   0 — Танилцуулга: дүрийг холоос харна
 *   1 — Ухамсар: толгой руу ойртоно
 *   2 — Бодлын бөмбөлгүүд: толгой дотор орно (ур чадвар)
 *   3 — Дурсамж: цааш гүнзгийрнэ (бүтээлүүд)
 *   4 — Далд ухамсар: хамгийн гүн, харанхуй
 *   5 — Буцаж гараад дүр гараа даллана
 */
const MIND = new THREE.Vector3(0, 1.78, -2.6);
const MEMORY = new THREE.Vector3(0, 1.4, -6);
const DEEP = new THREE.Vector3(0, -4, -9);

const KEYS: { pos: THREE.Vector3; look: THREE.Vector3; bg: string; fog: number }[] = [
  { pos: new THREE.Vector3(0, 1.7, 7.4), look: new THREE.Vector3(0, 0.35, 0), bg: '#24123F', fog: 0.02 },
  { pos: new THREE.Vector3(1.2, 2.25, 4.1), look: new THREE.Vector3(0, 0.95, 0), bg: '#1F1446', fog: 0.03 },
  { pos: new THREE.Vector3(0, 2.3, 1.6), look: new THREE.Vector3(0, 1.0, -2.6), bg: '#0E1838', fog: 0.06 },
  { pos: new THREE.Vector3(0.3, 2.6, -0.6), look: new THREE.Vector3(0, 0.0, -6), bg: '#0B1029', fog: 0.07 },
  { pos: new THREE.Vector3(0, -1.2, -3.8), look: new THREE.Vector3(0, -6.0, -9), bg: '#03040B', fog: 0.12 },
  { pos: new THREE.Vector3(-0.8, 1.7, 7.4), look: new THREE.Vector3(0, 0.2, 0), bg: '#2A1640', fog: 0.02 },
];

const smooth = (x: number) => x * x * (3 - 2 * x); // smoothstep: зөөлөн эхэлж, зөөлөн зогсоно
const band = (p: number, a: number, b: number, fade = 0.35) =>
  Math.min(THREE.MathUtils.clamp((p - a + fade) / fade, 0, 1), THREE.MathUtils.clamp((b + fade - p) / fade, 0, 1));

export type SceneInput = AvatarInput & { progress: number };

export default function Scene({ input, emotion }: { input: React.RefObject<SceneInput>; emotion: Emotion }) {
  return (
    <Canvas camera={{ position: [0, 1.7, 7.4], fov: 45, near: 0.05, far: 100 }} style={{ flex: 1 }}>
      <World input={input} emotion={emotion} />
    </Canvas>
  );
}

function World({ input, emotion }: { input: React.RefObject<SceneInput>; emotion: Emotion }) {
  const { camera, scene } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.35, 0));
  const bg = useMemo(() => new THREE.Color(KEYS[0].bg), []);
  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);
  const rim = useRef<THREE.PointLight>(null!);

  useMemo(() => {
    scene.background = bg;
    scene.fog = new THREE.FogExp2(KEYS[0].bg, 0.02);
  }, []);

  useFrame((_, dt) => {
    const p = THREE.MathUtils.clamp(input.current?.progress ?? 0, 0, KEYS.length - 1);
    const i = Math.min(Math.floor(p), KEYS.length - 2);
    const f = smooth(p - i);
    const A = KEYS[i];
    const B = KEYS[i + 1];

    // Камерын байрлал, харах цэгийг хоёр түлхүүр цэгийн хооронд тооцоолно
    const k = 1 - Math.pow(0.0005, dt);
    const targetPos = A.pos.clone().lerp(B.pos, f);
    // хуруу/хазайлтаар камер бага зэрэг хөдөлнө (parallax)
    targetPos.x += (input.current?.look.x ?? 0) * 0.25;
    targetPos.y += (input.current?.look.y ?? 0) * 0.15;
    camera.position.lerp(targetPos, k);
    look.current.lerp(A.look.clone().lerp(B.look, f), k);
    camera.lookAt(look.current);

    // Арын өнгө ба манан
    bg.copy(tmpA.set(A.bg).lerp(tmpB.set(B.bg), f));
    const fog = scene.fog as THREE.FogExp2;
    fog.color.copy(bg);
    fog.density = THREE.MathUtils.lerp(A.fog, B.fog, f);

    // Дүр зөвхөн гадна талд харагдана
    if (input.current) input.current.visible = p < 1.75 || p > 4.4;

    rim.current.color.set(emotion.color);
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <pointLight ref={rim} position={[-2.5, 2.5, -1.5]} intensity={18} distance={8} />
      <pointLight position={[0, 1.8, -3]} intensity={8} distance={6} color="#7DD3FC" />

      <Avatar input={input} emotion={emotion} />
      <Floor />
      <Thoughts input={input} />
      <Memories input={input} />
      <Particles />
      <Core input={input} emotion={emotion} />
    </>
  );
}

/** Дүрийн доорх гэрэлтэй тойрог */
function Floor() {
  return (
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.5, 64]} />
      <meshBasicMaterial color="#A78BFA" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Бодлын бөмбөлгүүд — ур чадвар бүр нэг бөмбөлөг, толгой дотор эргэлдэнэ */
function Thoughts({ input }: { input: React.RefObject<SceneInput> }) {
  const group = useRef<THREE.Group>(null!);
  const items = useMemo(
    () =>
      skills.map((s, i) => {
        // Фибоначчийн бөмбөрцөг дээр жигд тараана
        const n = skills.length;
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = i * 2.39996;
        return {
          pos: new THREE.Vector3(Math.cos(th) * r, y * 0.8, Math.sin(th) * r).multiplyScalar(1.5),
          size: 0.05 + s.level * 0.028,
          color: groups[s.group].color,
          phase: i,
        };
      }),
    []
  );

  useFrame((state) => {
    const p = input.current?.progress ?? 0;
    const v = band(p, 1.9, 2.3, 0.5);
    group.current.visible = v > 0.01;
    group.current.scale.setScalar(Math.max(0.001, v));
    group.current.rotation.y = state.clock.elapsedTime * 0.18;
    group.current.children.forEach((c, i) => {
      if (!items[i]) return; // сүүлийн хүүхэд нь тор хүрээ
      c.position.y = items[i].pos.y + Math.sin(state.clock.elapsedTime * 1.2 + items[i].phase) * 0.08;
    });
  });

  return (
    <group ref={group} position={MIND}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos}>
          <sphereGeometry args={[it.size, 24, 24]} />
          <meshStandardMaterial color={it.color} emissive={it.color} emissiveIntensity={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* «Тархи»-ны тор хүрээ */}
      <mesh>
        <icosahedronGeometry args={[2.1, 2]} />
        <meshBasicMaterial color="#7DD3FC" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/** Дурсамжууд — бүтээл бүр нэг эргэлдэх талст */
function Memories({ input }: { input: React.RefObject<SceneInput> }) {
  const group = useRef<THREE.Group>(null!);
  const colors = { data: '#5EEAD4', app: '#A78BFA', design: '#F9A8D4' };

  useFrame((state) => {
    const p = input.current?.progress ?? 0;
    const v = band(p, 2.9, 3.2, 0.5);
    group.current.visible = v > 0.01;
    group.current.scale.setScalar(Math.max(0.001, v));
    group.current.rotation.y = -state.clock.elapsedTime * 0.25;
    group.current.children.forEach((c, i) => {
      c.rotation.x = state.clock.elapsedTime * 0.6 + i;
      c.rotation.y = state.clock.elapsedTime * 0.4 + i;
    });
  });

  return (
    <group ref={group} position={MEMORY}>
      {projects.map((pr, i) => {
        const a = (i / projects.length) * Math.PI * 2;
        return (
          <mesh key={pr.id} position={[Math.cos(a) * 1.15, Math.sin(i * 1.7) * 0.35, Math.sin(a) * 1.15]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={colors[pr.type]} emissive={colors[pr.type]} emissiveIntensity={0.6} flatShading roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Хөвж буй гэрлийн тоосонцор (далд ухамсрын гүн рүү чиглэнэ) */
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 700;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 14 - 9;
      arr[i * 3 + 2] = Math.random() * -16 + 6;
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.045} color="#E9D5FF" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

/** Далд ухамсрын «цөм» — зүрх шиг цохилж гэрэлтэнэ, өнгө нь одоогийн сэтгэл хөдлөл */
function Core({ input, emotion }: { input: React.RefObject<SceneInput>; emotion: Emotion }) {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const v = band(input.current?.progress ?? 0, 4, 4.2, 0.7);
    group.current.visible = v > 0.01;
    // Зүрхний цохилт: хоёр богино цохилт, дараа нь завсарлага
    const beat = 1 + Math.max(0, Math.sin(t * 6)) * 0.08 * (Math.sin(t * 1.5) > 0 ? 1 : 0.3);
    group.current.scale.setScalar(Math.max(0.001, v) * beat);
    group.current.rotation.y = t * 0.3;
    inner.current.rotation.x = t * 0.5;
  });
  return (
    <group ref={group} position={DEEP}>
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={emotion.color} emissive={emotion.color} emissiveIntensity={1.4} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[0.8, 0.015, 8, 64]} />
        <meshBasicMaterial color={emotion.color} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.012, 8, 64]} />
        <meshBasicMaterial color="#E9D5FF" transparent opacity={0.35} />
      </mesh>
      <pointLight color={emotion.color} intensity={20} distance={8} />
    </group>
  );
}
