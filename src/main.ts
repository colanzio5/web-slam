import { createApp } from "vue";
import App from "./App.vue";
import { VideoFrameLoader } from "./lib/videoFrameLoader";

// ! the paths need to be generated outside the context
// ! of the vue application so the gov't doesn't get hacked
const importAll = (r: any) => r.keys().map(r);
const videoFramePaths = importAll(
  require.context("./assets/dashcam", false, /\.(png|jpe?g|svg)$/)
);
export const videoLoader = new VideoFrameLoader(videoFramePaths);

createApp(App).mount("#app");
