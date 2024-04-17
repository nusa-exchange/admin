<template>
  <a-card
    :loading="loading"
    class="metrics-chart"
    title="Last 7 days user activity"
    :bordered="false"
  >
    <a-button @click="get_metrics" slot="extra">Reload</a-button>
    <line-chart ref="metrics" :height="350" />
  </a-card>
</template>

<script lang="ts">
import moment from "moment";
import store from "@/store";
import { LineChart } from "@/components/chart";
import { Vue, Component } from "vue-property-decorator";

interface MetricsLineChart {
  date: string;
  signups?: number;
  sucessful_logins?: number;
  failed_logins?: number;
}

@Component({
  components: {
    LineChart
  }
})
export default class App extends Vue {
  loading: boolean;
  is_chart_draw: boolean;
  $refs!: {
    metrics: LineChart;
  };
  constructor() {
    super();

    this.is_chart_draw = false;
    this.loading = true;
    this.get_metrics();
  }

  metric_name_to_lang(name) {
    if (name === "signups") return "SignUp";
    if (name === "sucessful_logins") return "Sucessful Login";
    if (name === "failed_logins") return "Failed Login";
    return name;
  }

  async get_metrics() {
    await store.dispatch("admin/GET_METRICS");
    this.loading = false;
    this.$nextTick(() => {

      if (!this.$refs.metrics) return;
      if (!this.is_chart_draw) {
        this.$refs.metrics.create_chart();
        this.draw_chart(this.metrics);
        this.is_chart_draw = true;
      }
      this.$refs.metrics.chart_data(this.metrics);
      this.$refs.metrics.render_chart();
    });
  }

  draw_chart(metrics: MetricsLineChart[]) {
    let max_sucessful_logins = 0;
    let max_signups = 0;
    let max_failed_logins = 0;

    for (const metric of metrics) {
      if (metric[this.metric_name_to_lang("signups")] > max_signups) {
        max_signups = metric[this.metric_name_to_lang("signups")];
      }
      if (
        metric[this.metric_name_to_lang("sucessful_logins")] >
        max_sucessful_logins
      ) {
        max_sucessful_logins = metric[this.metric_name_to_lang("sucessful_logins")];
      }
      if (
        metric[this.metric_name_to_lang("failed_logins")] > max_failed_logins
      ) {
        max_failed_logins = metric[this.metric_name_to_lang("failed_logins")];
      }
    }

    const max = Math.max(max_signups, max_sucessful_logins, max_failed_logins)

    const { chart } = this.$refs.metrics;

    chart.scale({
      [this.metric_name_to_lang("signups")]: {
        min: 0,
        max: max + 5
      },
      [this.metric_name_to_lang("sucessful_logins")]: {
        min: 0,
        max: max + 5
      },
      [this.metric_name_to_lang("failed_logins")]: {
        min: 0,
        max: max + 5
      }
    });

    chart.tooltip({
      shared: true
    });

    chart
      .area()
      .adjust("stack")
      .position(`date*${this.metric_name_to_lang("signups")}`)
      .color("#1890ff");
    chart
      .area()
      .adjust("stack")
      .position(`date*${this.metric_name_to_lang("sucessful_logins")}`)
      .color("#2fc25b");
    chart
      .area()
      .adjust("stack")
      .position(`date*${this.metric_name_to_lang("failed_logins")}`)
      .color("#e97878");
  }

  get metrics() {
    const { metrics } = store.state.admin;
    const keys = Object.keys(metrics);

    const out_data: MetricsLineChart[] = [];

    for (const metric_name of keys) {
      if (metric_name === "pending_applications") {
        continue;
      }
      const name = this.metric_name_to_lang(metric_name);

      for (const date in metrics[metric_name]) {
        const metric_value = metrics[metric_name][date];
        const index = out_data.findIndex(record => {
          return date === record.date;
        });
        if (index >= 0) {
          (out_data[index] as any) = {
            ...out_data[index],
            [name]: metric_value
          };
          continue;
        }

        const data = { date };
        data[name] = metric_value;
        out_data.push(data);
      }
    }

    for (let index = 0; index < out_data.length; index++) {
      for (const metric_name of keys) {
        const name = this.metric_name_to_lang(metric_name);

        if (!out_data[index][name]) {
          out_data[index][name] = 0;
        }
      }
    }

    out_data.sort((first, end) => {
      const first_date = moment(first.date, "YYYY-MM-DD").toDate();
      const end_date = moment(end.date, "YYYY-MM-DD").toDate();

      return first_date.getTime() - end_date.getTime();
    });

    return out_data;
  }
}
</script>
