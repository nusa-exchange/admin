<template>
  <div class="page-exchange-markets info">
    <a-tabs v-if="!loading" defaultActiveKey="1">
      <a-tab-pane tab="Orderbook" key="1">
        <orderbook :market="market" />
      </a-tab-pane>
      <a-tab-pane tab="Configuration" key="2">
        <configuration
          :market="market"
          :setting_list="setting_list"
          @submit="update_market"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { runNotice } from "@/mixins";
import { GET_MARKET, UPDATE_MARKET } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    orderbook: () => import("./orderbook.vue"),
    configuration: () => import("./configuration.vue")
  }
})
export default class App extends Vue {
  loading = false;
  market: Market | null = null;

  get market_id() {
    return this.$route.params.market;
  }

  get setting_list() {
    return [
      {
        title: "Market name",
        key: "name",
        value: `${this.market.base_unit}/${this.market.quote_unit}`.toUpperCase(),
        style: "width: 30%",
        type: "input",
        edit: false
      },
      {
        title: "Base currency",
        key: "base_unit",
        value: this.market.base_unit.toUpperCase(),
        style: "width: 30%",
        type: "input",
        edit: false
      },
      {
        title: "Quote currency",
        key: "quote_unit",
        value: this.market.quote_unit.toUpperCase(),
        style: "width: 30%",
        type: "input",
        edit: false
      },
      {
        title: "Min price",
        key: "min_price",
        value: this.market.min_price,
        style: "width: 30%",
        type: "input",
        edit: true
      },
      {
        title: "Max price",
        key: "max_price",
        value: this.market.max_price,
        style: "width: 30%",
        type: "input",
        edit: true
      },
      {
        title: "Min amount",
        key: "min_amount",
        value: this.market.min_amount,
        style: "width: 30%",
        type: "input",
        edit: true
      },
      {
        title: "Price precision",
        key: "price_precision",
        value: this.market.price_precision,
        style: "width: 30%",
        type: "input",
        edit: true
      },
      {
        title: "Amount precision",
        key: "amount_precision",
        value: this.market.amount_precision,
        style: "width: 30%",
        type: "input",
        edit: true
      },
      {
        title: "Total precision",
        key: "total_precision",
        value: this.market.total_precision,
        style: "width: 30%",
        type: "input",
        edit: true
      },
      {
        title: "Position",
        key: "position",
        value: this.market.position,
        style: "width: 30%",
        type: "input",
        edit: true
      }
    ];
  }

  beforeMount() {
    this.get_market();
  }

  async get_market() {
    const { market_id } = this;
    this.loading = true;

    try {
      const { data } = await store.dispatch(GET_MARKET, market_id);
      this.market = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  async update_market() {
    try {
      await store.dispatch(UPDATE_MARKET, {
        id: this.market.id,
        min_price: this.market.min_price,
        max_price: this.market.max_price,
        min_amount: this.market.min_amount,
        price_precision: this.market.price_precision,
        amount_precision: this.market.amount_precision,
        total_precision: this.market.total_precision,
        position: this.market.position,
        state: this.market.state
      });

      runNotice(
        "success",
        `Market ${[this.market.base_unit, this.market.quote_unit]
          .join("/")
          .toUpperCase()} updated successfully`
      );
      this.$router.push("/exchange/markets");
    } catch (error) {
      return error;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/exchange/markets/info";
</style>
