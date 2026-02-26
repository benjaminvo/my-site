<template>
  <div class="fixed inset-0 bg-black">
    <div ref="container" class="h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import {
  ShaderMount,
  grainGradientFragmentShader,
  GrainGradientShapes,
  getShaderColorFromString,
  getShaderNoiseTexture,
  ShaderFitOptions,
} from "@paper-design/shaders";

useSeoMeta({ title: "Shader" });

const container = ref<HTMLElement | null>(null);

// Exact parameters from the Paper design
const colors = ["#7300FF", "#EBA8FF", "#00BFFF", "#2A00FF"];
const colorBack = "#00000000";
const speed = 1.73;
const scale = 0.1;
const rotation = -23;
const offsetX = 0;
const offsetY = 0;
const softness = 0.5;
const intensity = 0.77;
const noise = 0;
const shape = GrainGradientShapes.sphere;
const frame = 53665.77;

onMounted(() => {
  if (!container.value) return;

  const parsedColors = colors.map(getShaderColorFromString);
  // Pad to maxColorCount (7)
  while (parsedColors.length < 7) parsedColors.push([0, 0, 0, 0]);

  const mount = new ShaderMount(
    container.value,
    grainGradientFragmentShader,
    {
      u_colorBack: getShaderColorFromString(colorBack),
      u_colors: parsedColors,
      u_colorsCount: colors.length,
      u_softness: softness,
      u_intensity: intensity,
      u_noise: noise,
      u_shape: shape,
      u_scale: scale,
      u_rotation: rotation,
      u_offsetX: offsetX,
      u_offsetY: offsetY,
      u_fit: ShaderFitOptions.none,
      u_originX: 0,
      u_originY: 0,
      u_worldWidth: 0,
      u_worldHeight: 0,
      u_noiseTexture: getShaderNoiseTexture(),
    },
    undefined,
    speed,
    frame,
  );

  onUnmounted(() => mount.dispose());
});
</script>
