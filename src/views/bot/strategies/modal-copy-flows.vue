<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-copy-flows"
    title="Copy Strategy"
    :width="1000"
    :footer="false"
  >
    <z-table
      :data="strategies.data.filter(strategy => strategy.id != strategy_id)"
      :columns="COLUMN"
      :hover="true"
      :scroll="false"
      :pagination="false"
      @click="item => $refs['modal-confirm-copy-flows'].create(item.id)"
    >
      <template slot="type" slot-scope="{ item, column }">
        <span :class="`type text-${column.algin}`">
          {{ item.type.toUpperCase() }}
        </span>
      </template>
      <template slot="side" slot-scope="{ item, column }">
        <span :class="`side text-${column.algin}`">
          {{ item.side.toUpperCase() }}
        </span>
      </template>
      <template slot="target_market" slot-scope="{ item, column }">
        <span :class="`target_market text-${column.algin}`">
          {{ get_market_name(item.target_market) }}
          - ({{
            get_exchange_name(get_market_exchange_id(item.target_market))
          }})
        </span>
      </template>
    </z-table>

    <modal-confirm-copy-flows
      ref="modal-confirm-copy-flows"
      :strategy_id="strategy_id"
      @success="onSuccess"
    />
  </a-modal>
</template>

<script lang="ts">
import { QuantexController } from "@/controllers";
import ZModalMixin from "@/mixins/z-modal";
import { Component, Prop, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "modal-confirm-copy-flows": () => import("./modal-confirm-copy-flows.vue")
  }
})
export default class ModalCopyFlows extends Mixins(ZModalMixin) {
  @Prop() readonly strategy_id!: number;

  get COLUMN() {
    return [
      { title: "ID", key: "id", algin: "left" },
      { title: "Type", key: "type", algin: "left", scopedSlots: true },
      { title: "Side", key: "side", algin: "left", scopedSlots: true },
      {
        title: "Target Market",
        key: "target_market",
        algin: "left",
        scopedSlots: true
      },
    ];
  }

  get exchanges() {
    return QuantexController.exchanges;
  }

  get markets() {
    return QuantexController.markets;
  }

  get strategies() {
    return QuantexController.strategies;
  }

  get_market_name(id: number) {
    const market = this.markets.data.find(market => market.id == id);

    return (market?.ask + "/" + market?.bid).toUpperCase();
  }

  get_market_exchange_id(id: number) {
    const market = this.markets.data.find(market => market.id == id);

    return market?.exchange_id;
  }

  get_exchange_name(id: number) {
    return this.exchanges.data.find(exchange => exchange.id == id)?.name;
  }

  onSuccess() {
    this.delete();
  }
}
</script>
