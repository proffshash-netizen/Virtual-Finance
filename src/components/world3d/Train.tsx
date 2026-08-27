import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function Train() {
  const trainRef = useRef<THREE.Group>(null);
  
  // A simple looping track around the main districts
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25, 0.5, -10),
      new THREE.Vector3(0, 0.5, -15),
      new THREE.Vector3(25, 0.5, -10),
      new THREE.Vector3(30, 0.5, 10),
      new THREE.Vector3(10, 0.5, 20),
      new THREE.Vector3(-10, 0.5, 20),
      new THREE.Vector3(-30, 0.5, 10),
    ], true); // true = closed loop
  }, []);

  const progress = useRef(0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((_, delta) => {
    if (prefersReducedMotion || !trainRef.current) return;

    // Move train along the curve
    progress.current += delta * 0.05; // Speed
    if (progress.current > 1) progress.current = 0;

    const currentPos = curve.getPointAt(progress.current);
    // Look slightly ahead to rotate the train
    const lookAtPos = curve.getPointAt((progress.current + 0.01) % 1);

    trainRef.current.position.copy(currentPos);
    trainRef.current.lookAt(lookAtPos);
  });

  return (
    <group>
      {/* Train Engine */}
      <group ref={trainRef}>
        {/* Main Body */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 5]} />
          <meshStandardMaterial color="#E74C3C" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 2.5, -1]} castShadow receiveShadow>
          <boxGeometry args={[2, 1.5, 2]} />
          <meshStandardMaterial color="#C0392B" roughness={0.5} />
        </mesh>
        {/* Smokestack */}
        <mesh position={[0, 2.5, 1.5]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.5]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Render the track as a subtle line so it looks grounded */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <tubeGeometry args={[curve, 100, 0.2, 8, true]} />
        <meshStandardMaterial color="#8B4513" roughness={1} />
      </mesh>
    </group>
  );
}
