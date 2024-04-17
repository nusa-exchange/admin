<template>
  <div class="page-dashboard-analysis">
    <status-bars />
    <metrics />
  </div>
</template>

<script lang="ts">
import metrics from "./metrics.vue";
import status_bars from "./status_bars.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    metrics,
    "status-bars": status_bars
  }
})
export default class App extends Vue {
  data: any;
  constructor() {
    super();
  }
}
</script>

<style lang="less">
@import "~@styles/views/analysis.less";
</style>
