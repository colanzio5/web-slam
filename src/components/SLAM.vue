<template>
  <div>{{ videoLoader.currentFrameIndex }}</div>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { VideoFrameLoader } from "@/lib/videoFrameLoader";
import { Vue } from "vue-class-component";
import { videoLoader } from "../main";

export default class SLAM extends Vue {
  videoLoader: VideoFrameLoader = videoLoader;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  async mounted() {
    this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    await this.videoLoader.videoFrames[0].image;
    await this.updateCurrentFrame(0);
  }

  created(): void {
    window.addEventListener("keyup", this.onKeyUp);
  }

  destroy(): void {
    window.removeEventListener("keyup", this.onKeyUp);
  }

  async updateCurrentFrame(index: number) {
    await this.videoLoader.setCurrentFrame(index);
    const currentFrameImage = await this.videoLoader.getCurrentFrameImage();
    this.loadFrameImageToCanvas(currentFrameImage);
  }

  loadFrameImageToCanvas(frame: any) {
    if (this.canvas) {
      this.canvas.height = 720;
      this.canvas.width = 1280;
      this.ctx?.drawImage(frame, 0, 0);
    }
  }

  async onKeyUp(event: KeyboardEvent): Promise<void> {
    const currentIndex = this.videoLoader.currentFrameIndex;
    if (event.keyCode == 39 || event.keyCode == 68) {
      await this.updateCurrentFrame(
        this.videoLoader.getNextFrameIndexWrapped(currentIndex, 1)
      );
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
      await this.updateCurrentFrame(
        this.videoLoader.getPreviousFrameIndexWrapped(currentIndex, 1)
      );
    }
  }
}
</script>

<style scoped>
video,
canvas,
img {
  max-width: 100%;
}
</style>
