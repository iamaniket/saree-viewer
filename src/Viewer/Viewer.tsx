/*
 Auther : Aniket Wachakawade
 Date   : 04/04/2022
 For three.js base basic viewer component using React(typescript) 
*/

import isMobile from "is-mobile";
import React from "react";
import { ACESFilmicToneMapping, CylinderGeometry, Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, PMREMGenerator, Raycaster, sRGBEncoding, Vector2 } from "three";

import { Box3 } from "three/src/math/Box3";
import { Vector3 } from "three/src/math/Vector3";

import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { Scene } from "three/src/scenes/Scene";
import { OrbitControls } from "../lib/OrbitControls.js";
import { RoomEnvironment } from "../lib/RoomEnvironment.js";
// import { EffectComposer } from "../lib/EffectComposer";
// import { RenderPass } from '../lib/RenderPass.js';
// import { ShaderPass } from '../lib/ShaderPass.js';
// import { OutlinePass } from '../lib/OutlinePass.js';
// import { FXAAShader } from '../lib/shaders/FXAAShader.js';

import { loadModel } from "./ModelLoader";

export class Viewer extends React.Component<({ selectionMode: boolean, allModelLoadCallback: Function, modelSelectCallback: Function, onViewerInit: Function })> {

 renderer!: WebGLRenderer;
 camera: PerspectiveCamera;
 scene: Scene;
 model1 = new Object3D();
 model2 = new Object3D();
 model3 = new Object3D();
 _drag = false;
 floor = new Object3D();
 controls: any;
 raycaster = new Raycaster();
 mouse = new Vector2();

 constructor(props: { selectionMode: boolean, allModelLoadCallback: Function, modelSelectCallback: Function, onViewerInit: Function }) {
  super(props);
  this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  this.scene = new Scene();
  this.scene.add(this.floor);
  this.scene.add(this.model1);
  this.scene.add(this.model2);
  this.scene.add(this.model3);
 }

 async loadSelectedModels(name: string, design: string, sareeColor: string, blouseColor: string, resetView: boolean) {
  this.model1.children = [];

  const geometry = new CylinderGeometry(.8, .8, .1, 32);
  const material = new MeshStandardMaterial({ color: 0x571616 });
  const geometry2 = new CylinderGeometry(1.1, 1.1, .1, 32);
  const cylinder = new Mesh(geometry, material);
  const cylinder2 = new Mesh(geometry2, material);
  cylinder.receiveShadow = true;
  cylinder.castShadow = true;
  cylinder.position.y = -0.1;
  cylinder2.receiveShadow = true;
  cylinder2.castShadow = true;
  cylinder2.position.y = -0.2;


  let gltf = await loadModel(name, design + "_" + sareeColor + ".jpg", blouseColor + ".jpg");

  this.model1.name = name;
  this.model1.add(gltf.scene);
  this.model1.add(cylinder);
  this.model1.add(cylinder2);
  if (resetView)
   this.setIsoView();
  this.props.allModelLoadCallback();
 }

 async loadInitModels(modelList: Array<string>) {
  this.model1.children = [];
  let gltf = await loadModel(modelList[0], "", "");

  const geometry = new CylinderGeometry(1.3, 1.3, .1, 32);
  const material = new MeshStandardMaterial({ color: 0x571616 });
  const geometry2 = new CylinderGeometry(1.5, 1.5, .1, 32);
  const cylinder = new Mesh(geometry, material);
  const cylinder2 = new Mesh(geometry2, material);
  cylinder.receiveShadow = true;
  cylinder.castShadow = true;
  cylinder.position.y = -0.1;
  cylinder2.receiveShadow = true;
  cylinder2.castShadow = true;
  cylinder2.position.y = -0.2;

  this.floor.add(cylinder);
  this.floor.add(cylinder2);

  gltf.scene.position.z = 1;


  this.model1.name = modelList[0]
  gltf.scene.castShadow = true;
  this.model1.add(gltf.scene);


  gltf = await loadModel(modelList[1], "", "");
  gltf.scene.position.x = -0.875;
  gltf.scene.position.z = -0.5;
  this.model2.name = modelList[1]// 'models/Girl_2_Dress_2.gltf'
  gltf.scene.castShadow = true;
  this.model2.add(gltf.scene);


  gltf = await loadModel(modelList[2], "", "");
  gltf.scene.position.x = 0.875;
  gltf.scene.position.z = -0.5;
  this.model3.name = modelList[2];//'models/Girl_3_Dress_3.gltf'
  gltf.scene.castShadow = true;
  this.model3.add(gltf.scene);
  this.setIsoView();



  this.props.allModelLoadCallback();
 }

 componentDidMount() {
  this.props.onViewerInit(this);
  if (this.props.selectionMode) {
   this.loadInitModels(['models/Girl_1.gltf', 'models/Girl_2.gltf', 'models/Girl_3.gltf']);
  }

  // Placeholder for light
  // const ambientLight = new AmbientLight(0xffffff);
  // this.scene.add(ambientLight);

  this.renderer = new WebGLRenderer({ canvas: document.getElementById("viewer-3d") as HTMLCanvasElement, antialias: true, alpha: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);

  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.controls.listenToKeyEvents(window); // optional

  this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  this.controls.dampingFactor = 0.05;
  this.controls.screenSpacePanning = false;
  this.controls.minDistance = 0;
  this.controls.maxDistance = 5000;
  this.controls.maxPolarAngle = Math.PI / 2;

  this.renderer.setAnimationLoop(this.animation.bind(this));
  this.renderer.toneMapping = ACESFilmicToneMapping;
  this.renderer.toneMappingExposure = 1;
  this.renderer.outputEncoding = sRGBEncoding;
  this.renderer.pixelRatio = 1;

  const environment = new RoomEnvironment();
  const pmremGenerator = new PMREMGenerator(this.renderer);
  this.scene.environment = pmremGenerator.fromScene(environment).texture;

  // this.composer = new EffectComposer(this.renderer);
  // const renderPass = new RenderPass(this.scene, this.camera);
  // this.composer.addPass(renderPass);

  // this.outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
  // this.composer.addPass(this.outlinePass);

  // const textureLoader = new TextureLoader();
  // const self = this;
  // textureLoader.load('tri_pattern.jpg', function (texture) {

  //  self.outlinePass.patternTexture = texture;
  //  texture.wrapS = RepeatWrapping;
  //  texture.wrapT = RepeatWrapping;
  // });

  // this.effectFXAA = new ShaderPass(FXAAShader);
  // this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  // this.composer.addPass(this.effectFXAA);

  window.addEventListener("resize", this.onWindowResize.bind(this));
  this.renderer.domElement.style.touchAction = 'none';
  this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this), true);
  this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this), true);
  this.renderer.domElement.addEventListener('pointerup', this.onPointerUp.bind(this), true);

  this.setIsoView()

 }

 onModelSelect(obj: { name: string, id: number }): void {
  this.model1.children = [];
  this.model2.children = [];
  this.model3.children = [];
  this.props.modelSelectCallback(obj);
 }

 onPointerUp(event: MouseEvent) {
  if (this._drag === true) return;

  if (this.props.selectionMode) {
   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

   const result = this.checkIntersection();
   if (result) {
    this.onModelSelect(result);
   }
  }
 }

 onPointerDown(event: MouseEvent) {
  this._drag = false;

  // if (this.props.selectionMode) {
  //  this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //  this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  //  const result = this.checkIntersection();
  //  if (result) {
  //   this.onModelSelect(result);
  //  }
  // }
 }

 onPointerMove(event: MouseEvent) {
  this._drag = true;


  // if (event.isPrimary === false) return;

  this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // this.checkIntersection();
 }

 private checkIntersection(): { name: string, id: number } | undefined {
  this.raycaster.setFromCamera(this.mouse, this.camera);

  const result1 = this.raycaster.intersectObject(this.model1);
  const result2 = this.raycaster.intersectObject(this.model2);
  const result3 = this.raycaster.intersectObject(this.model3);

  if (result1.length > 0) {
   return { name: this.model1.name, id: 1 };
  }

  if (result2.length > 0) {
   return { name: this.model2.name, id: 2 };
  }

  if (result3.length > 0) {
   return { name: this.model3.name, id: 3 };
  }

  return undefined;
 }

 onWindowResize() {
  this.camera.aspect =
   window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(
   window.innerWidth,
   window.innerHeight
  );
 }


 setIsoView() {
  var camera = this.camera;
  let box = new Box3().setFromObject(this.scene);
  if (box === undefined) {
   return;
  }

  var center = new Vector3();
  box.getCenter(center);
  if (center === undefined) {
   return;
  }

  this.controls.reset();
  this.controls.target.copy(center);
  var distance = box.min.distanceTo(box.max);

  var dirVec = new Vector3(0, 0, 1);
  var position = center.clone();
  position.addScaledVector(dirVec.normalize(), distance * 1);
  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
 }

 animation() {
  this.controls.update();
  // this.composer.render();
  this.renderer.render(this.scene, this.camera);
 }

 render() {
  return <canvas id="viewer-3d" style={{ cursor: "grab", marginLeft: this.props.selectionMode ? "0" : isMobile({ tablet: true }) ? "0" : "-20%", marginTop: isMobile({ tablet: true }) ? "-20%" : "0px", marginBottom: isMobile({ tablet: true }) ? "20%" : "0px" }} />
 }
}