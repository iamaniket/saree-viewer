import { Scene } from "three";
import { GLTFLoader } from "../lib/GLTFLoader";

const gLTFLoader = new GLTFLoader();

export function loadGltf(
  modelUrl: string,
  design: string,
  blouseColor: string,
  onLoad: (gltf: { scene: Scene }) => void,
  onProgress?: (progress: ProgressEvent<EventTarget>) => void,
  onError?: (error: ErrorEvent) => void
): void {
  gLTFLoader.load(modelUrl, design, blouseColor, onLoad, onProgress, onError);
}

export function loadModel(
  fileName: string,
  designName: string,
  blouseColor: string
): Promise<{ scene: Scene }> {
  return new Promise((resolve, reject) => {
    loadGltf(
      fileName,
      designName,
      blouseColor,
      (gltf: { scene: Scene }): void => {
        console.log(`Loading Complete :${fileName}`);
        resolve(gltf);
      },
      (event: ProgressEvent<EventTarget>) => {
        console.log(`Loading model :${fileName}`);
        console.log(event);
      },
      (errorEvent: ErrorEvent) => {
        console.error(`Loading model :${fileName}`);
        console.error(errorEvent);
        reject(errorEvent);
      }
    );
  });
}
