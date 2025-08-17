import { Object3DNode } from '@react-three/fiber'
import { Group, Mesh } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: Object3DNode<Group, typeof Group>
    mesh: Object3DNode<Mesh, typeof Mesh>
  }
}
