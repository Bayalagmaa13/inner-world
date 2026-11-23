import React, { useRef } from 'react';
import { useFrame } from './fiber';
import * as THREE from 'three';
import type { Emotion } from '../data/emotions';

/**
 * Кодоор зурсан 3D дүр (гаднаас загвар татаагүй).
 * Энгийн геометр дүрсүүдээс бүтсэн: бөмбөрцөг, капсул, тор (torus), хайрцаг.
 *
 * look   — толгой, нүд хаашаа харах (-1..1), хуруу/хазайлтаас ирнэ
 * wave   — гараа даллах эсэх
 * bounce — true болгоход дүр нэг удаа үсэрнэ (сэтгэл хөдлөл солигдоход)
 */
export type AvatarInput = {
  look: { x: number; y: number };
  wave: boolean;
  bounce: boolean;
  visible: boolean;
};

const SKIN = '#F2C7A5';
const HAIR = '#2A1A16';
const SWEATER = '#6D5BD0';
const EYE = '#1B1230';

export default function Avatar({ input, emotion }: { input: React.RefObject<AvatarInput>; emotion: Emotion }) {
  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const head = useRef<THREE.Group>(null!);
  const pupils = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const blink = useRef<THREE.Group>(null!);
  const bounceStart = useRef(-10);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const inp = input.current;
    if (!inp) return;
    root.current.visible = inp.visible;
    if (!inp.visible) return;

    // 1. Амьсгалах — бие бага зэрэг томорч багасна
    body.current.scale.y = 1 + Math.sin(t * 1.6) * 0.02;

    // 2. Толгой хуруу/хазайлтыг зөөлөн дагана (lerp = аажмаар ойртох)
    const k = 1 - Math.pow(0.001, dt);
    head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, inp.look.x * 0.55, k);
    head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -inp.look.y * 0.3 + Math.sin(t * 0.8) * 0.03, k);
    head.current.rotation.z = Math.sin(t * 0.6) * 0.04;

    // 3. Хүүхэн хараа илүү хөдөлнө
    pupils.current.position.x = THREE.MathUtils.lerp(pupils.current.position.x, inp.look.x * 0.035, k);
    pupils.current.position.y = THREE.MathUtils.lerp(pupils.current.position.y, inp.look.y * 0.03, k);

    // 4. Нүд цавчих — 4 секунд тутамд
    const b = (t % 4) < 0.12 ? 0.1 : 1;
    blink.current.scale.y = THREE.MathUtils.lerp(blink.current.scale.y, b, 0.6);

    // 5. Сэтгэл хөдлөл солигдоход үсрэх
    if (inp.bounce) {
      inp.bounce = false;
      bounceStart.current = t;
    }
    const since = t - bounceStart.current;
    root.current.position.y = since > 0 && since < 0.6 ? Math.sin((since / 0.6) * Math.PI) * 0.25 : 0;

    // 6. Гар даллах
    const targetZ = inp.wave ? 2.5 + Math.sin(t * 9) * 0.35 : 0.12;
    rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, targetZ, k);
    leftArm.current.rotation.z = -0.12 + Math.sin(t * 1.6) * 0.02;
  });

  return (
    <group ref={root}>
      {/* Бие */}
      <mesh ref={body} position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.55, 0.55, 8, 24]} />
        <meshStandardMaterial color={SWEATER} roughness={0.8} />
      </mesh>
      {/* Захны хэсэг */}
      <mesh position={[0, 1.12, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.05, 12, 24]} />
        <meshStandardMaterial color={emotion.color} roughness={0.6} />
      </mesh>
      {/* Хүзүү */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.25, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>

      {/* Гарууд — мөрнөөс эргэнэ */}
      <group ref={rightArm} position={[0.58, 0.98, 0]}>
        <mesh position={[0, -0.38, 0]}>
          <capsuleGeometry args={[0.14, 0.5, 6, 16]} />
          <meshStandardMaterial color={SWEATER} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
      </group>
      <group ref={leftArm} position={[-0.58, 0.98, 0]}>
        <mesh position={[0, -0.38, 0]}>
          <capsuleGeometry args={[0.14, 0.5, 6, 16]} />
          <meshStandardMaterial color={SWEATER} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
      </group>

      {/* Толгой */}
      <group ref={head} position={[0, 1.78, 0]}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.65} />
        </mesh>
        {/* Үс: оройн малгай + ар тал + урт үс */}
        <mesh rotation={[-0.35, 0, 0]}>
          <sphereGeometry args={[0.585, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, -0.1]} scale={[1, 1, 0.95]}>
          <sphereGeometry args={[0.58, 32, 32, Math.PI * 0.9, Math.PI * 1.2, 0, Math.PI * 0.75]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.45, -0.25]}>
          <capsuleGeometry args={[0.42, 0.5, 8, 24]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} />
        </mesh>
        {/* Чих */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.54, -0.02, 0]} scale={[0.5, 1, 0.8]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
        ))}

        {/* Нүд: цагаан + хүүхэн хараа (хамт цавчина) */}
        <group ref={blink} position={[0, 0.03, 0]}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.2, 0, 0.47]} scale={[1, 1.15, 0.5]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
          ))}
          <group ref={pupils}>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.2, 0, 0.52]}>
                <mesh>
                  <sphereGeometry args={[0.062, 16, 16]} />
                  <meshStandardMaterial color={EYE} roughness={0.2} />
                </mesh>
                <mesh position={[0.02, 0.025, 0.05]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* Хөмсөг — сэтгэл хөдлөлөөс хамаарч өнцөг, өндөр өөрчлөгдөнө */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.2, 0.2 + emotion.browLift, 0.5]} rotation={[0, 0, -s * emotion.browTilt]}>
            <boxGeometry args={[0.17, 0.03, 0.03]} />
            <meshStandardMaterial color={HAIR} />
          </mesh>
        ))}

        {/* Хамар */}
        <mesh position={[0, -0.09, 0.54]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#E8AE8A" />
        </mesh>

        {/* Ам */}
        <Mouth type={emotion.mouth} />

        {/* Хацрын улайлт */}
        {emotion.blush &&
          [-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.3, -0.12, 0.44]} scale={[1, 0.6, 0.3]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#FF8FAB" transparent opacity={0.55} />
            </mesh>
          ))}
      </group>
    </group>
  );
}

function Mouth({ type }: { type: Emotion['mouth'] }) {
  const pos: [number, number, number] = [0, -0.24, 0.5];
  if (type === 'o')
    return (
      <mesh position={pos}>
        <torusGeometry args={[0.045, 0.018, 10, 24]} />
        <meshStandardMaterial color="#8A3B4A" />
      </mesh>
    );
  if (type === 'flat')
    return (
      <mesh position={pos} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.13, 0.022, 0.02]} />
        <meshStandardMaterial color="#8A3B4A" />
      </mesh>
    );
  // smile / grin: доошоо харсан нум
  const r = type === 'grin' ? 0.12 : 0.09;
  return (
    <mesh position={[0, pos[1] + r * 0.6, pos[2]]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[r, 0.02, 10, 24, Math.PI]} />
      <meshStandardMaterial color="#8A3B4A" />
    </mesh>
  );
}
