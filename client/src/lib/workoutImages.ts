type Gender = "feminino" | "masculino";
type WorkoutType = "superiores" | "inferiores" | "cardio" | "condicionamento" | "core" | "fullbody";

const imageMap: Record<Gender, Record<WorkoutType, string[]>> = {
  feminino: {
    superiores: [
      "/figmaAssets/workout/f-superiores-1.jpg",
      "/figmaAssets/workout/f-superiores-2.jpg",
      "/figmaAssets/workout/f-superiores-3.jpg",
      "/figmaAssets/workout/f-superiores-4.jpg",
      "/figmaAssets/workout/f-superiores-5.jpg",
      "/figmaAssets/workout/f-superiores-6.jpg",
    ],
    inferiores: [
      "/figmaAssets/workout/f-inferiores-1.jpg",
      "/figmaAssets/workout/f-inferiores-2.jpg",
    ],
    cardio: [
      "/figmaAssets/workout/f-cardio-1.jpg",
      "/figmaAssets/workout/f-condicionamento-1.jpg",
    ],
    condicionamento: [
      "/figmaAssets/workout/f-condicionamento-1.jpg",
      "/figmaAssets/workout/f-fullbody-1.jpg",
      "/figmaAssets/workout/f-cardio-1.jpg",
    ],
    core: [
      "/figmaAssets/workout/f-core-1.jpg",
      "/figmaAssets/workout/f-core-2.jpg",
    ],
    fullbody: [
      "/figmaAssets/workout/f-fullbody-1.jpg",
      "/figmaAssets/workout/f-fullbody-2.jpg",
      "/figmaAssets/workout/f-condicionamento-1.jpg",
    ],
  },
  masculino: {
    superiores: [
      "/figmaAssets/workout/m-superiores-1.jpg",
      "/figmaAssets/workout/m-condicionamento-1.jpg",
    ],
    inferiores: [
      "/figmaAssets/workout/m-superiores-1.jpg",
      "/figmaAssets/workout/m-cardio-1.jpg",
    ],
    cardio: [
      "/figmaAssets/workout/m-cardio-1.jpg",
      "/figmaAssets/workout/m-condicionamento-1.jpg",
    ],
    condicionamento: [
      "/figmaAssets/workout/m-condicionamento-1.jpg",
      "/figmaAssets/workout/m-cardio-1.jpg",
    ],
    core: [
      "/figmaAssets/workout/m-condicionamento-1.jpg",
      "/figmaAssets/workout/m-superiores-1.jpg",
    ],
    fullbody: [
      "/figmaAssets/workout/m-superiores-1.jpg",
      "/figmaAssets/workout/m-cardio-1.jpg",
      "/figmaAssets/workout/m-condicionamento-1.jpg",
    ],
  },
};

function workoutNameToType(name: string): WorkoutType {
  const lower = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (lower.includes("superior") || lower.includes("peito") || lower.includes("costas") || lower.includes("brac") || lower.includes("ombro")) return "superiores";
  if (lower.includes("inferior") || lower.includes("perna") || lower.includes("gluteo") || lower.includes("quadricep") || lower.includes("posterior")) return "inferiores";
  if (lower.includes("cardio") || lower.includes("corrida") || lower.includes("bike") || lower.includes("bicicleta") || lower.includes("esteira")) return "cardio";
  if (lower.includes("condicion") || lower.includes("funcional") || lower.includes("hiit") || lower.includes("circuito")) return "condicionamento";
  if (lower.includes("core") || lower.includes("abdom") || lower.includes("prancha") || lower.includes("lombar")) return "core";
  if (lower.includes("full") || lower.includes("corpo") || lower.includes("completo") || lower.includes("geral")) return "fullbody";
  return "superiores";
}

export function getWorkoutImage(workoutName: string, gender: string | null | undefined, seed?: number): string {
  const g: Gender = gender === "masculino" ? "masculino" : "feminino";
  const type = workoutNameToType(workoutName);
  const images = imageMap[g][type];
  const index = seed !== undefined ? Math.abs(seed) % images.length : 0;
  return images[index];
}

export function getWorkoutImages(workoutName: string, gender: string | null | undefined): string[] {
  const g: Gender = gender === "masculino" ? "masculino" : "feminino";
  const type = workoutNameToType(workoutName);
  return imageMap[g][type];
}
