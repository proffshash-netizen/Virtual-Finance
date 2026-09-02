import { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Terrain } from './Terrain';
import { DistrictNode } from './DistrictNode';
import { Train } from './Train';
import { useGameState } from '../../lib/gameState';

interface SceneProps {
  onLocationClick: (id: string) => void;
}

export function Scene({ onLocationClick }: SceneProps) {
  const { districts } = useGameState();

  // Positions mapped roughly to match 2D layout in a 3D coordinate space
  const districtLayout = useMemo(() => {
    return {
      academy: { pos: [-10, 0, -10], color: '#3498db' },
      market: { pos: [15, 0, -10], color: '#e67e22' },
      investment: { pos: [-15, 0, 10], color: '#9b59b6' },
      life: { pos: [20, 0, 15], color: '#2ecc71' },
      security: { pos: [0, 0, -18], color: '#e74c3c' },
      social: { pos: [25, 0, -2], color: '#f1c40f' },
      study: { pos: [-25, 0, 5], color: '#1abc9c' }
    };
  }, []);

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      
      {/* Lighting for a bright stylized day */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Orbit Controls restricted to isometric-ish view */}
      <OrbitControls 
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.2} // Prevent going under the floor
        minPolarAngle={Math.PI / 6}   // Prevent going directly top-down
      />

      <group>
        <Terrain />
        <Train />
        
        {districts.map(d => {
          const layout = districtLayout[d.id as keyof typeof districtLayout];
          if (!layout) return null;
          
          return (
            <DistrictNode 
              key={d.id}
              id={d.id}
              name={d.name}
              position={layout.pos as [number, number, number]}
              color={layout.color}
              locked={d.locked}
              onClick={onLocationClick}
            />
          );
        })}
      </group>
    </>
  );
}
