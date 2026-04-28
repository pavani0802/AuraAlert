import * as faceapi from "face-api.js";

const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;
  
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    console.log("Face models loaded successfully");
  } catch (error) {
    console.error("Error loading face models:", error);
  }
};

export const getFaceDescriptor = async (imageElement: HTMLImageElement | HTMLCanvasElement) => {
  await loadModels();
  const detection = await faceapi.detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  if (!detection) return null;
  return Array.from(detection.descriptor);
};

export const compareFaces = (descriptor1: number[], descriptor2: number[]) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  // Distance < 0.6 is typically considered a match in face-api.js
  const confidence = Math.max(0, 1 - distance);
  return {
    isMatch: distance < 0.6,
    distance,
    confidence
  };
};
