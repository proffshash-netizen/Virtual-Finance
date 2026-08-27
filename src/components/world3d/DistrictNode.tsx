import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface DistrictNodeProps {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  locked?: boolean;
  onClick: (id: string) => void;
}

export function DistrictNode({ id, name, position, color, locked = false, onClick }: DistrictNodeProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle hover animation
  useFrame(() => {
    if (group.current) {
      const targetScale = hovered ? 1.1 : 1.0;
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group 
      position={position}
      ref={group}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
    >
      {/* Base Foundation */}
      <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color={locked ? '#888888' : color} roughness={0.7} />
      </mesh>

      {/* Main Building Structure */}
      <mesh receiveShadow castShadow position={[0, 2, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color={locked ? '#aaaaaa' : '#ffffff'} roughness={0.3} />
      </mesh>
      
      {/* Roof */}
      <mesh receiveShadow castShadow position={[0, 4.5, 0]}>
        <coneGeometry args={[2.5, 2, 4]} />
        <meshStandardMaterial color={locked ? '#666666' : color} roughness={0.9} flatShading />
      </mesh>

      {/* HTML Label overlay */}
      <Html position={[0, 7, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
        <div className={`px-3 py-1.5 rounded-lg shadow-lg font-sans font-bold whitespace-nowrap transition-transform ${hovered ? 'scale-110' : 'scale-100'}`}
             style={{ 
               backgroundColor: locked ? 'rgba(100,100,100,0.9)' : 'rgba(255,255,255,0.95)',
               color: locked ? '#ffffff' : '#111827',
               border: `2px solid ${locked ? '#444' : color}`
             }}>
          {name}
          {locked && <span className="ml-2 text-xs opacity-75">🔒</span>}
        </div>
      </Html>
    </group>
  );
}
