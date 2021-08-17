export class VideoFrameLoader {
  currentFrameIndex = 0;
  currentFrameImage: HTMLImageElement;
  videoFrames: { path: string; image: HTMLImageElement; status: string }[];

  constructor(videoFramePaths: string[]) {
    // load the frames produced by ffmpg
    // command ran:  `$ffmpeg -i  <path to mp4> <path_to_output_directory>/frame-%d.jpg`
    // make sure the only numeric characters in the frame names,
    // are the index number of the frame, this is how we sort the imported frames.
    this.videoFrames = videoFramePaths
      .map((path: string) => {
        const image = new Image();
        return { path, image, status: "not-started" };
      })
      // ! we're sorting in a strange way
      // ! (see comment about numeric characters in frame paths)
      .sort((a, b) => {
        const aSanitized = parseInt(a.path.replace(/^\D+/g, ""));
        const bSanitized = parseInt(b.path.replace(/^\D+/g, ""));
        return aSanitized < bSanitized ? -1 : aSanitized > bSanitized ? 1 : 0;
      });
    this.currentFrameImage = this.videoFrames[this.currentFrameIndex].image;
    this.createLoadingBuffer(0, 5);
  }

  async startLoadAtIndex(index: number): Promise<void> {
    if (this.videoFrames[index].status == "complete") return;
    this.videoFrames[index].status = "loading";
    const path = this.videoFrames[index].path;
    const image = new Image();
    image.src = path;
    await image.decode();
    this.videoFrames[index] = { path, image, status: "complete" };
  }

  async getCurrentFrameImage(): Promise<HTMLImageElement> {
    return await this.currentFrameImage;
  }

  async setCurrentFrame(frameIndex: number): Promise<void> {
    await this.startLoadAtIndex(frameIndex);
    this.currentFrameIndex = frameIndex;
    this.currentFrameImage = await this.videoFrames[this.currentFrameIndex]
      .image;
    this.createLoadingBuffer(frameIndex, 5);
  }

  createLoadingBuffer(idxLoaded: number, preloadBufferSize: number): void {
    // preload some data in a ring around the idxLoaded
    const ring = [...new Array(preloadBufferSize).keys()];
    ring.map((e) =>
      this.startLoadAtIndex(this.getNextFrameIndexWrapped(idxLoaded, e))
    );
    ring.map((e) =>
      this.startLoadAtIndex(this.getPreviousFrameIndexWrapped(idxLoaded, e))
    );
  }

  getNextFrameIndexWrapped(startingIdx: number, n: number): number {
    const numberItems = this.videoFrames.length;
    const nextIndex = startingIdx + n;
    const wrappedIndex =
      ((nextIndex % numberItems) + numberItems) % numberItems;
    return wrappedIndex;
  }

  getPreviousFrameIndexWrapped(startingIdx: number, n: number): number {
    const numberItems = this.videoFrames.length;
    const nextIndex = startingIdx - n;
    const wrappedIndex =
      ((nextIndex % numberItems) + numberItems) % numberItems;
    return wrappedIndex;
  }
}
