<template>
  <div :id="id" class="line-chart"></div>
</template>

<script lang="ts">
import uuid from "uuid/v4";
import { Chart } from "@antv/g2";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
  @Prop({ default: 500 }) readonly height!: number;

  id: string;
  chart!: Chart;
  constructor() {
    super();

    this.id = uuid();
  }

  beforeDestroy() {
    this.destroy_chart();
  }

  chart_data(data) {
    this.chart.data(data);
  }

  create_chart() {
    this.chart = new Chart({
      container: this.id,
      autoFit: true,
      height: this.height,
      padding: [30, 20, 70, 30]
    });
  }

  destroy_chart() {
    this.chart.destroy();
  }

  render_chart() {
    this.chart.render();
  }
}
</script>
