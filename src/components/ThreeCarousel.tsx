'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Canvas, useThree } from '@react-three/fiber';
import { Image, Environment } from '@react-three/drei';
import { easing } from 'maath';
import { type Post } from '../lib/blog';

const GOLDEN_RATIO = 1.61803398875;

interface CarouselImageProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  active: boolean;
  onClick: () => void;
}

function GlowingFrame({ active, children }: { active: boolean, children: React.ReactNode }) {
  return (
    <group>
      {/* Outer glow */}
      <mesh scale={[2.1, 2.1 / GOLDEN_RATIO, 1]} position={[0, 0, -0.1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color={active ? "#00ffff" : "#004444"} 
          opacity={active ? 0.5 : 0.2} 
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner frame */}
      <mesh scale={[2.05, 2.05 / GOLDEN_RATIO, 1]} position={[0, 0, -0.05]}>
        <planeGeometry />
        <meshBasicMaterial color="black" />
      </mesh>
      {children}
    </group>
  );
}

function CarouselImage({ url, position, rotation, active, onClick }: CarouselImageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smooth position easing
    easing.damp3(
      groupRef.current.position,
      [
        position[0],
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.02,
        position[2]
      ],
      0.3,
      delta
    );

    // Keep frames facing the camera
    groupRef.current.lookAt(camera.position);
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      <GlowingFrame active={active}>
        <Image
          url={url}
          scale={[2, 2 / GOLDEN_RATIO, 1]}
          transparent
          opacity={active ? 1 : 0.6}
        />
      </GlowingFrame>
    </group>
  );
}

interface ThreeCarouselProps {
  posts: Post[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function ThreeCarousel({ posts, currentIndex, onSelect }: ThreeCarouselProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth position for linear layout
    easing.damp3(
      groupRef.current.position,
      [-currentIndex * 4.5, 0, 0],  // Slide horizontally based on current index
      0.4,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      {posts.map((post, index) => {
        if (!post.featured_image) return null;
        
        // Linear arrangement with slight z-offset for depth
        const xPos = index * 4.5;  // Horizontal spacing
        const zPos = Math.abs(index - currentIndex) * -0.5;  // Push non-active slides back
        
        return (
          <CarouselImage
            key={post.id}
            url={post.featured_image}
            position={[xPos, 0, zPos]}
            rotation={[0, 0, 0]}
            active={currentIndex === index}
            onClick={() => onSelect(index)}
          />
        );
      })}
    </group>
  );
}

export function ThreeCarouselContainer({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full h-[400px] bg-[#001]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#001']} />
        <fog attach="fog" args={['#001', 10, 20]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 5, 5]} intensity={0.5} />
        <ThreeCarousel
          posts={posts}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
        />
      </Canvas>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
        <button
          className="text-cyan-500 hover:text-cyan-300 transition-colors"
          onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : posts.length - 1))}
        >
          ← Previous
        </button>
        
        <div className="flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              className={`h-1 transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-cyan-500' 
                  : 'w-2 bg-cyan-900 hover:bg-cyan-700'
              } rounded-full`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="text-cyan-500 hover:text-cyan-300 transition-colors"
          onClick={() => setCurrentIndex(prev => (prev < posts.length - 1 ? prev + 1 : 0))}
        >
          Next →
        </button>
      </div>

      {/* Current Post Info */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">
              {posts[currentIndex]?.title}
            </h2>
            <p className="text-cyan-300/80 line-clamp-2">
              {posts[currentIndex]?.excerpt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
