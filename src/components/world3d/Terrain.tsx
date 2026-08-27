export function Terrain() {
  return (
    <group>
      {/* Base ground plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#55B84A" roughness={0.8} />
      </mesh>

      {/* A procedural river (simple plane) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0.5]} position={[0, 0.01, 0]}>
        <planeGeometry args={[120, 4]} />
        <meshStandardMaterial color="#4A90E2" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Simple low poly mountains in the background */}
      <mesh receiveShadow castShadow position={[-20, 2, -15]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5, 8, 4]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} flatShading />
      </mesh>

      <mesh receiveShadow castShadow position={[-15, 3, -18]} rotation={[0, Math.PI / 6, 0]}>
        <coneGeometry args={[6, 10, 4]} />
        <meshStandardMaterial color="#388E3C" roughness={0.9} flatShading />
      </mesh>

      <mesh receiveShadow castShadow position={[25, 2.5, -20]} rotation={[0, -Math.PI / 4, 0]}>
        <coneGeometry args={[5, 9, 4]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}
