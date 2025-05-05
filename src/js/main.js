// import { animate, utils, stagger, onScroll } from "animejs";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// document.addEventListener("DOMContentLoaded", () => {
//     const spacers = document.querySelectorAll(".page-spacer");

//     const box = document.createElement("div");
//     box.classList.add("box");
//     spacers.forEach((spacer) => {
//         for (let i = 0; i < 25; i++) {
//             for (let i = 0; i < 30; i++) {
//                 spacer.appendChild(box.cloneNode(true));
//             }
//         }
//     });
// });

function main() {
    /** @type {THREE.Group<THREE.Object3DEventMap>[]} */
    let propellerPivotGroup = [];

    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector(".drone-target");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    // renderer.setSize(window.innerWidth - 100, window.innerHeight);

    const fov = 50;
    const aspect = 2; // the canvas default //window.innerWidth / window.innerHeight,
    const near = 0.1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // camera.position.set( 0, 10, 30 );
    // camera.position.set(0, 2, 5.5);

    // const controls = new OrbitControls(camera, canvas);
    // controls.target.set(0, 5, 0);
    // // controls.minDistance = 2;
    // // controls.maxDistance = 7;
    // // controls.enableDamping = true; // Must can update on animation loop.
    // // controls.autoRotate = true;
    // controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#abafb4");

    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper);

    const boom = new THREE.Group();
    scene.add(boom);
    boom.add(camera);
    camera.position.set(0, 150, 300); // this sets the boom's length
    camera.lookAt(0, 0, 0); // camera looks at the boom's zero

    // gsap.to(boom.rotation, {
    //     y: 2 * Math.PI,
    //     duration: 4,
    //     repeat: 0,
    //     ease: "none",
    // }).then(() => {
    //     // eslint-disable-next-line no-console
    //     console.log(
    //         "%cAnimation Should be completed.",
    //         "color:#00ff00;font-size:30px;font-weight:bold;"
    //     );
    //     // camera.lookAt(50, 50, 0);
    //     // boom.position.set(10, 10, 0);
    //     // gsap.to(boom.position, {
    //     //     x: 10,
    //     //     y: 10,
    //     //     duration: 2,
    //     //     repeat: 0,
    //     //     ease: "none",
    //     // });
    // });

    // {
    //     const planeSize = 60;

    //     const loader = new THREE.TextureLoader();
    //     const texture = loader.load(
    //         "https://threejs.org/manual/examples/resources/images/checker.png"
    //     );
    //     texture.colorSpace = THREE.SRGBColorSpace;
    //     texture.wrapS = THREE.RepeatWrapping;
    //     texture.wrapT = THREE.RepeatWrapping;
    //     texture.magFilter = THREE.NearestFilter;
    //     const repeats = planeSize / 2;
    //     texture.repeat.set(repeats, repeats);

    //     const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    //     const planeMat = new THREE.MeshPhongMaterial({
    //         map: texture,
    //         side: THREE.DoubleSide,
    //     });
    //     const mesh = new THREE.Mesh(planeGeo, planeMat);
    //     mesh.rotation.x = Math.PI * -0.5;
    //     scene.add(mesh);
    // }

    {
        const skyColor = 0xb1e1ff; // light blue
        const groundColor = 0xb97a20; // brownish orange
        const intensity = 2;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xffffff;
        const intensity = 2.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }

    const mtlLoader = new MTLLoader();
    const modelObject = {};

    mtlLoader.load("/assets/Drone_Ob.mtl", (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        // 2. Load 3D model (replace with your model)
        objLoader.load("/assets/Drone_Ob.obj", (model) => {
            model.scale.set(0.2, 0.2, 0.2);
            // model.position.z = 50
            scene.add(model);
            model.children.forEach((child) => {
                modelObject[child.name] = child;
            });

            // /** @type {THREE.Mesh} */
            // const propeller_01 = modelObject["GEO_Propeller_01"];
            // const propeller_01_center = getCenterPoint(propeller_01);

            // propeller_01.scale.set(0.2, 0.2, 0.2);
            // const pivotGroup = new THREE.Group();
            // pivotGroup.position.set(
            //     propeller_01_center.x,
            //     propeller_01_center.y,
            //     propeller_01_center.z
            // );
            // scene.add(pivotGroup);
            // propeller_01.position.sub(propeller_01_center); // shift to pivot center
            // pivotGroup.add(propeller_01);

            // const spinUpDuration = 2;
            // const spinHoldDuration = 10; // customize as needed
            // const spinDownDuration = 3;

            // gsap.timeline({
            //     onUpdate: () => {
            //         pivotGroup.rotation.y %= Math.PI * 2; // prevent huge values
            //     },
            // })
            //     .to(pivotGroup.rotation, {
            //         y: "+=" + Math.PI * 40,
            //         duration: spinUpDuration,
            //         ease: "power2.in",
            //     })
            //     .to(pivotGroup.rotation, {
            //         y: "+=" + Math.PI * 2000,
            //         duration: spinHoldDuration,
            //         ease: "none",
            //     })
            //     .to(pivotGroup.rotation, {
            //         y: "+=" + Math.PI * 40,
            //         duration: spinDownDuration,
            //         ease: "power2.out",
            //     });
            handleAnimation();
        });
    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // function spinPropellers() {
    //     /** @type {THREE.Mesh[]} */
    //     const propellers = [
    //         modelObject["GEO_Propeller_01"],
    //         modelObject["GEO_Propeller_02"],
    //         modelObject["GEO_Propeller_03"],
    //         modelObject["GEO_Propeller_04"],
    //     ];

    //     // propellers.forEach((propeller) => {
    //     const propeller_01 = propellers[0];
    //     // const propeller_01 = propeller;
    //     const propeller_01_center = getCenterPoint(propeller_01);

    //     propeller_01.scale.set(0.2, 0.2, 0.2);
    //     const pivotGroup = new THREE.Group();
    //     pivotGroup.position.set(
    //         propeller_01_center.x,
    //         propeller_01_center.y,
    //         propeller_01_center.z
    //     );
    //     scene.add(pivotGroup);
    //     propeller_01.position.sub(propeller_01_center); // shift to pivot center
    //     pivotGroup.add(propeller_01);

    //     const spinUpDuration = 2;
    //     const spinHoldDuration = 10; // customize as needed
    //     const spinDownDuration = 3;

    //     const timeline = gsap.timeline({
    //         onUpdate: () => {
    //             pivotGroup.rotation.y %= Math.PI * 2;
    //         },
    //     });

    //     // gsap.timeline({
    //     //     onUpdate: () => {
    //     //         pivotGroup.rotation.y %= Math.PI * 2; // prevent huge values
    //     //     },
    //     // })
    //     timeline
    //         .to(pivotGroup.rotation, {
    //             y: "+=" + Math.PI * 40,
    //             duration: spinUpDuration,
    //             repeat: -1,
    //             ease: "power2.in",
    //         })
    //         .to(pivotGroup.rotation, {
    //             y: "+=" + Math.PI * 2000,
    //             duration: spinHoldDuration,
    //             repeat: -1,
    //             ease: "none",
    //         });
    //     // .to(pivotGroup.rotation, {
    //     //     y: "+=" + Math.PI * 40,
    //     //     duration: spinDownDuration,
    //     //     ease: "power2.out",
    //     // })
    //     // });

    //     return () => {
    //         timeline.kill(); // stop current spin

    //         gsap.to(pivotGroup.rotation, {
    //             y: "+=" + Math.PI * 8,
    //             duration: 3,
    //             ease: "power2.out",
    //             onUpdate: () => {
    //                 pivotGroup.rotation.y %= Math.PI * 2;
    //             }
    //         });
    //     };
    // }

    const getPivotGroups = () => {
        if (propellerPivotGroup && propellerPivotGroup?.length > 0) {
            return propellerPivotGroup;
        }
        /** @type {THREE.Mesh[]} */
        const propellers = [
            modelObject["GEO_Propeller_01"],
            modelObject["GEO_Propeller_02"],
            modelObject["GEO_Propeller_03"],
            modelObject["GEO_Propeller_04"],
        ];

        propellerPivotGroup = propellers.map((propeller) => {
            const propeller_01 = propeller;
            const propeller_01_center = getCenterPoint(propeller_01);

            propeller_01.scale.set(0.2, 0.2, 0.2);
            const pivotGroup = new THREE.Group();
            pivotGroup.position.set(
                propeller_01_center.x,
                propeller_01_center.y,
                propeller_01_center.z
            );
            scene.add(pivotGroup);
            propeller_01.position.sub(propeller_01_center); // shift to pivot center
            pivotGroup.add(propeller_01);

            return pivotGroup;
        });

        return propellerPivotGroup;
    };
    /**
     *
     * @returns
     */
    function spinPropellers() {
        const pivotGroups = getPivotGroups();

        let sharedRotation = 0;

        const timeline = gsap.timeline({
            onUpdate: () => {
                sharedRotation %= Math.PI * 2;
                pivotGroups.forEach((p) => (p.rotation.y = sharedRotation));
            },
        });

        // const onUpdate = (() => {
        //     sharedRotation %= Math.PI * 2;
        //     pivotGroups.forEach((p) => (p.rotation.y = sharedRotation));
        // });

        const spinUpDuration = 2;
        const spinHoldDuration = 10; // customize as needed
        const spinDownDuration = 3;

        timeline
            .to(
                { r: 0 },
                {
                    r: Math.PI * 40,
                    duration: spinUpDuration,
                    ease: "power2.in",
                    onUpdate() {
                        sharedRotation = this.targets()[0].r;
                        // onUpdate()
                    },
                }
            )
            .to(
                { r: Math.PI * 40 },
                {
                    r: Math.PI * 2000,
                    duration: spinHoldDuration,
                    ease: "none",
                    onUpdate() {
                        sharedRotation = this.targets()[0].r;
                        // onUpdate()
                    },
                }
            );

        const stop = () => {
            timeline.kill();
            const pivotGroups = getPivotGroups();

            gsap.to(
                { r: sharedRotation },
                {
                    r: sharedRotation + Math.PI * 8,
                    duration: spinDownDuration,
                    ease: "power2.out",
                    onUpdate() {
                        sharedRotation = this.targets()[0].r % (Math.PI * 2);
                        pivotGroups.forEach((p) => (p.rotation.y = sharedRotation));
                        // onUpdate()
                    },
                }
            );
        };

        return stop;
    }

    // function handleAnimation() {
    //     const timeline = gsap.timeline();

    //     // Zoom into drone.
    //     camera.position.set(0, 150, 300); // this sets the boom's length
    //     let stopSpin;
    //     timeline.to(camera.position, {
    //         x: 0,
    //         y: 0,
    //         z: 50,
    //         duration: 5,
    //         onUpdate: () => {
    //             camera.lookAt(0, 0, 0);
    //         },
    //         onStart: () => {
    //             setTimeout(() => {
    //                 stopSpin = spinPropellers();
    //             }, 1000);
    //         },
    //     });

    //     gsap.timeline().to(boom.rotation, {
    //         delay: 1.5,
    //         y: 2 * Math.PI,
    //         duration: 4,
    //         repeat: 0,
    //         ease: "power1.inOut",
    //     });

    //     gsap.to(
    //         {},
    //         {
    //             delay: 3,
    //             onComplete: () => {
    //                 stopSpin && stopSpin();
    //             },
    //         }
    //     );
    // }
    function handleAnimation() {
        let stopSpin;

        const startSpin = () => {
            stopSpin = spinPropellers();
        };
        const initStopSpin = () => {
            stopSpin && stopSpin();
        };
        const timeline = gsap.timeline({
            scrollTrigger: {
                // markers: true,
                trigger: "#animation-container", // <-- update this selector
                start: "top+=50 top",
                // endTrigger: "#animation-container",
                end: "bottom+=1500 bottom", // scroll distance
                pin: "#animation-container",
                // pinSpacing: false,
                scrub: 0.5, // ties to scroll position
                onEnter: () => {
                    startSpin();
                },
                onEnterBack: () => {
                    startSpin();
                },
                onLeave: () => {
                    initStopSpin();
                },
                onLeaveBack: () => {
                    initStopSpin();
                },
            },
        });

        // Zoom into drone.
        camera.position.set(0, 150, 300); // this sets the boom's length

        timeline.to(camera.position, {
            scrollTrigger: {
                trigger: "#animation-container",
                scrub: true,
                // markers: true,
                start: "top top+=100",
                end: "center-=100 top",
            },
            x: 0,
            y: 0,
            z: 50,
            // duration: 5,
            onUpdate: () => {
                camera.lookAt(0, 0, 0);
            },
        });

        // number of 180 degree rotations
        // so value 2 mean full 360 turn
        const numberOfFlips = 1;
        timeline.to(boom.rotation, {
            scrollTrigger: {
                trigger: "#animation-container",
                scrub: true,
                // markers: true,
                start: "center-=500 top",
                end: "center+=200 top",
            },
            // y: (2 * Math.PI) - (2 * Math.PI/ 2),
            y: numberOfFlips * Math.PI,
            // duration: 4,
            // repeat: 0,
            ease: "power1.inOut",
        });

        // gsap.to(
        //     {},
        //     {
        //         delay: 3,
        //         onComplete: () => {
        //             stopSpin && stopSpin(timeline);
        //         },
        //     }
        // );
    }
}

/**
 *
 * @param {THREE.Mesh} mesh
 * @returns {THREE.Vector3}
 */
function getCenterPoint(mesh) {
    var middle = new THREE.Vector3();
    var geometry = mesh.geometry;

    geometry.computeBoundingBox();

    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

    mesh.localToWorld(middle);
    return middle;
}

main();
