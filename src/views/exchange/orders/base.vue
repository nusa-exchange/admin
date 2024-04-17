<template>
  <div v-if="!loading" class="page-exchange-orders">
    <a-tabs @change="tabChange" :animated="false">
      <a-tab-pane tab="Open Orders" key="1" forceRender>
        <open-orders ref="open-orders" :markets="markets" />
      </a-tab-pane>
      <a-tab-pane tab="Orders History" key="2" forceRender>
        <orders-history ref="orders-history" :markets="markets" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { GET_MARKETS } from "@/store/types";
import open_orders from "./open_orders.vue";
import orders_history from "./orders_history.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "z-table": () => import("@/components/z-table"),
    "open-orders": open_orders,
    "orders-history": orders_history
  }
})
export default class Orders extends Vue {
  $refs!: {
    "open-orders": open_orders;
    "orders-history": orders_history;
  };
  loading = false;
  active_key = "1";
  markets: { [key: string]: string } = {};

  mounted() {
    this.get_markets();
    this.tabChange(this.active_key);
  }

  async get_markets() {
    this.loading = true;
    try {
      const { data }: { data: Market[] } = await store.dispatch(GET_MARKETS);

      this.markets = data.reduce((a, b) => ((a[b.id] = b.name), a), {});
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  tabChange(activeKey) {
    switch (activeKey) {
      case "1":
        this.$refs["open-orders"].set_action_header();
        return;
      case "2":
        this.$refs["orders-history"].set_action_header();
        return;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/exchange/orders/base";
</style>
