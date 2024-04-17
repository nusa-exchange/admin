<template>
  <div class="page-bot-exchanges">
    <z-table
      :loading="markets.loading"
      :columns="COLUMN"
      :data="markets.data"
      :hover="true"
      :scroll="false"
      :pagination="false"
      @click="
        item =>
          this.$refs['modal-market'].create({
            type: 'update',
            payload: item
          })
      "
    >
      <template slot="symbol" slot-scope="{ item, column }">
        <span :class="['symbol', `text-${column.algin}`]">
          {{ (item.ask + "/" + item.bid).toUpperCase() }}
        </span>
      </template>
      <template slot="exchange" slot-scope="{ item, column }">
        <span :class="['exchange', `text-${column.algin}`]">
          {{ get_exchange_name(item.exchange_id) }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="['action', `text-${column.algin}`]">
          <a-icon
            type="delete"
            theme="filled"
            @click.stop="delete_market(item.id)"
          />
        </span>
      </template>
    </z-table>

    <modal-market ref="modal-market" />
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { QuantexController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-market": () => import("./modal-market.vue")
  }
})
export default class Base extends Vue {
  COLUMN = [
    { title: "Symbol", key: "symbol", algin: "left", scopedSlots: true },
    { title: "Exchange", key: "exchange", algin: "left", scopedSlots: true },
    { title: "Min Amount", key: "min_amount", algin: "left" },
    { title: "Max Amount", key: "max_amount", algin: "left" },
    { title: "Price Precision", key: "price_precision", algin: "left" },
    { title: "Amount Precision", key: "amount_precision", algin: "left" },
    { title: "Action", key: "action", algin: "right", scopedSlots: true }
  ];

  get exchanges() {
    return QuantexController.exchanges;
  }

  get markets() {
    return QuantexController.markets;
  }

  mounted() {
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Create Market",
        key: "create_exchange",
        icon: "plus-circle",
        callback: () => {
          (this.$refs["modal-market"] as any).create({
            type: "create"
          });
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  get_exchange_name(exchange_id: number) {
    return this.exchanges.data.find(exchange => exchange.id == exchange_id)
      ?.name;
  }

  delete_market(id: number) {
    QuantexController.delete_market(id);
  }
}
</script>
