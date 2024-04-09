import { Backdrop, Environment, MeshReflectorMaterial, OrbitControls, Outlines, Sampler, SoftShadows, useFBX } from "@react-three/drei";
import { Canvas } from '@react-three/fiber'
import Utilities from "./r3f-gist/utility/Utilities";
import { Suspense, useEffect, useRef } from "react";
import { DepthOfField, EffectComposer, GodRays, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import * as THREE from 'three'
import { BlendFunction } from "postprocessing";

export default function App() {
    const geomRef = useRef()
    const instances = useRef()


    useEffect(() => {
        // instances.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        // instances.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
    }, [])

    const statue = useFBX('Maria.fbx').children[0]
    const count = 300
    const sun = useRef()
    return <>
        <Canvas
            shadows
            camera={{
                fov: 60,
                position: [0, 0, 5]
            }}
            gl={{ preserveDrawingBuffer: true }}

        >
            <mesh
                receiveShadow
                castShadow
                ref={geomRef}
                geometry={statue.geometry}>
                <meshStandardMaterial wireframe />
            </mesh>


            <instancedMesh
                args={[null, null, count]}
                ref={instances}
            >
                <boxGeometry args={[2, 2, 2]} />
                {/* <sphereGeometry args={[1, 16, 16]} /> */}
                <meshBasicMaterial color='white' wireframe />
            </instancedMesh>

            <mesh
                receiveShadow
                rotation={[Math.PI * -0.5, 0, 0]}>
                <planeGeometry args={[10, 10, 1, 1]} />
                <shadowMaterial transparent opacity={0.75} />

                {/* <MeshReflectorMaterial
                    blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
                    mixBlur={1} // How much blur mixes with surface roughness (default = 1)
                    mixStrength={0.3} // Strength of the reflections
                    mixContrast={1} // Contrast of the reflections
                    resolution={256} // Off-buffer resolution, lower=faster, higher=better quality, slower
                    mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                    depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                    minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                    maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                    depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                    distortion={1} // Amount of distortion based on the distortionMap texture
                    debug={1}
                /> */}
            </mesh>
            {/* <fog color="#ff0000" attach="fog" near={8} far={30} /> */}

            <directionalLight castShadow intensity={1} position={[0, 5, 5]} color="white" />

            <Sampler
                transform={({ position, normal, dummy: object }) => {
                    object.scale.setScalar(Math.random() * 0.075)
                    object.position.copy(position)
                    // object.lookAt(normal.add(position))
                    // object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
                    // object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
                    // object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
                    object.updateMatrix()
                    return object
                }}
                mesh={geomRef}
                instances={instances}
                weight="density"
                count={count}
            />

            <Environment preset="city" />

            <OrbitControls makeDefault />

            <EffectComposer multisampling={0}>
                <ToneMapping />

            </EffectComposer>

            <SoftShadows size={40} samples={16} />
            <Utilities />
        </Canvas>
    </>
}