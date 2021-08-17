# web-slam

Informal Slam Development Environment. If all else, some boilerplate code to step through some video frame by frame in the browser, with some neat caching. 

**Note**:

I'm not actually streaming video frame from a video source...

`$ffmpeg -i  <path to mp4> <path_to_output_directory>/frame-%d.jpg` 


...was used to generate an image for every frame of the video. We load a buffer of images in a ring around the currently selected frame index to reduce latency on scrolling.

Current browser streaming implementations make it difficult to steam data from a video a single frame at a time. Will return to support multiple data options, but current `ffmpg` workflow stands. 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
