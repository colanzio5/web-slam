<template>
  <SLAM />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SLAM from "./components/SLAM.vue";

@Options({
  components: {
    SLAM,
  },
})
export default class App extends Vue {}
</script>
