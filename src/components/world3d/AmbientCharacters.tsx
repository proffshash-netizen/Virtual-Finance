import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Simple capsule to represent a low-poly character
function Character({ position, color, offset }: { position: [number, number, number], color: string, offset: number }) {
  const ref = useRef<THREE.Group>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((state) => {
    if (prefersReducedMotion || !ref.current) return;
    // Simple bobbing and slight rotation
    const time = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(time * 2 + offset) * 0.2;
    ref.current.rotation.y = Math.sin(time * 0.5 + offset) * 0.5;
  });

  return (
    <group ref={ref} position={position} castShadow>
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Simple head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#FFDCB1" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function AmbientCharacters() {
  const characters = useMemo(() => [
    { pos: [-12, 0, -8], color: '#3498db' },
    { pos: [15, 0, -12], color: '#e74c3c' },
    { pos: [5, 0, 15], color: '#9b59b6' },
    { pos: [-18, 0, 12], color: '#f1c40f' },
    { pos: [22, 0, 8], color: '#2ecc71' }
  ], []);

  return (
    <group>
      {characters.map((char, i) => (
        <Character key={i} position={char.pos as [number, number, number]} color={char.color} offset={i * Math.PI} />
      ))}
    </group>
  );
}
