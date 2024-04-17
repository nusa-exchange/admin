<template>
  <div class="page-exchange-markets create">
    <configuration
      :market="market"
      :setting_list="setting_list"
      @submit="create_market"
    />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { runNotice } from "@/mixins";
import { CREATE_MARKET, GET_CURRENCIES } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    configuration: () => import("./info/configuration.vue")
  }
})
export default class App extends Vue {
  market: Market = {
    id: "",
    name: "",
    base_unit: "",
    quote_unit: "",
    min_price: "0",
    max_price: "0",
    min_amount: "0",
    amount_precision: 0,
    price_precision: 0,
    total_precision: 0,
    state: "disabled",
    position: 1
  };
  currencies: string[] = [];

  get currencies_list() {
    return this.currencies.reduce((a, b) => ((a[b] = b.toUpperCase()), a), {});
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
        value: this.market.base_unit,
        style: "width: 30%",
        type: "select",
        list: this.currencies_list
      },
      {
        title: "Quote currency",
        key: "quote_unit",
        value: this.market.quote_unit,
        style: "width: 30%",
        type: "select",
        list: this.currencies_list
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

  mounted() {
    this.get_currencies();
  }

  async get_currencies() {
    try {
      const { data } = await store.dispatch(GET_CURRENCIES, { limit: 100 });
      this.currencies = data.map(currency => currency.code);
    } catch (error) {
      return error;
    }
  }

  async create_market() {
    try {
      await store.dispatch(CREATE_MARKET, {
        base_currency: this.market.base_unit,
        quote_currency: this.market.quote_unit,
        min_price: this.market.min_price,
        max_price: this.market.max_price,
        min_amount: this.market.min_amount,
        price_precision: this.market.price_precision,
        amount_precision: this.market.amount_precision,
        total_precision: this.market.total_precision,
        position: this.market.position,
        state: this.market.state,
        engine_id: 1
      });

      runNotice(
        "success",
        `Market ${[this.market.base_unit, this.market.quote_unit]
          .join("/")
          .toUpperCase()} created successfully`
      );
      this.$router.push("/exchange/markets");
    } catch (error) {
      return error;
    }
  }
}
</script>
