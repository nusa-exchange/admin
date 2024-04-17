<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-copy-flows"
    title="Confirm Copy Strategy"
    :width="width"
    @ok="onSubmit"
  >
    <template v-if="source_strategy_id">
      Are you sure you want to copy Strategy:
      <br />
      {{ source_strategy.id }}
      -
      {{ source_strategy.type.toUpperCase() }}
      -
      {{ get_market_name(source_strategy.target_market) }}
      - ({{
        get_exchange_name(
          get_market_exchange_id(source_strategy.target_market)
        )
      }})
    </template>
  </a-modal>
</template>

<script lang="ts">
import { QuantexController } from "@/controllers";
import ZModalMixin from "@/mixins/z-modal";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ModalConfirmCopyFlows extends Mixins(ZModalMixin) {
  @Prop() readonly strategy_id!: number;

  source_strategy_id?: number = null;

  get exchanges() {
    return QuantexController.exchanges;
  }

  get markets() {
    return QuantexController.markets;
  }

  get strategies() {
    return QuantexController.strategies;
  }

  get target_strategy() {
    return QuantexController.strategies.data.find(
      (strategy) => strategy.id == this.strategy_id
    );
  }

  get source_strategy() {
    return QuantexController.strategies.data.find((strategy) => {
      console.log(strategy.id);

      return strategy.id == this.source_strategy_id;
    });
  }

  onCreate(source_strategy_id: number) {
    console.log(source_strategy_id);
    this.source_strategy_id = source_strategy_id;

    console.log(this.source_strategy);
  }

  get_market_name(id: number) {
    const market = this.markets.data.find((market) => market.id == id);

    return (market?.ask + "/" + market?.bid).toUpperCase();
  }

  get_market_exchange_id(id: number) {
    const market = this.markets.data.find((market) => market.id == id);

    return market?.exchange_id;
  }

  get_exchange_name(id: number) {
    return this.exchanges.data.find((exchange) => exchange.id == id)?.name;
  }

  onSubmit() {
    QuantexController.copy_strategy_flows(
      this.strategy_id,
      this.source_strategy_id,
      () => {
        this.delete();
      }
    );
  }
}
</script>
