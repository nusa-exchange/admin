<template>
  <div class="flow-table">
    <z-table
      :columns="FLOW_COLUMN"
      :data="strategy.flows"
      :hover="true"
      :scroll="false"
      :pagination="false"
      @click="
        (item) =>
          this.$refs['modal-flow'].create({
            type: 'edit',
            payload: { ...item },
            strategy: this.strategy,
          })
      "
    >
      <template slot="first_spread" slot-scope="{ item, column }">
        <span :class="`first_spread text-${column.algin}`">
          {{ item.options.first_spread }}
        </span>
      </template>
      <template slot="spread" slot-scope="{ item, column }">
        <span :class="`spread text-${column.algin}`">
          {{ item.options.spread }}
        </span>
      </template>
      <template slot="levels_size" slot-scope="{ item, column }">
        <span :class="`levels_size text-${column.algin}`">
          {{ item.options.levels_size }}
        </span>
      </template>
      <template slot="levels_count" slot-scope="{ item, column }">
        <span :class="`levels_count text-${column.algin}`">
          {{ item.options.levels_count }}
        </span>
      </template>
      <template slot="levels_start" slot-scope="{ item, column }">
        <span :class="`levels_start text-${column.algin}`">
          {{ item.options.levels_start }}
        </span>
      </template>
      <template slot="update_chance" slot-scope="{ item, column }">
        <span :class="`update_chance text-${column.algin}`">
          {{ item.options.update_chance }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <span @click.stop.prevent>
            <a-switch
              :checked="item.state == 'enabled'"
              :loading="item.loading"
              @click="
                update_strategy_flow_state(
                  item,
                  item.state == 'enabled' ? 'disabled' : 'enabled'
                )
              "
            >
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
            <a-icon
              type="delete"
              theme="filled"
              @click.stop="delete_strategy_flow(item.id, item.strategy_id)"
            />
          </span>
        </span>
      </template>
    </z-table>
    <div class="add-flow">
      <a-button type="primary" @click="add_flow">ADD FLOW</a-button>
    </div>
    <modal-flow ref="modal-flow" />
  </div>
</template>

<script lang="ts">
import { QuantexController } from "@/controllers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "modal-flow": () => import("./modal-flow.vue"),
  },
})
export default class FlowTable extends Vue {
  @Prop() readonly strategy_id!: number;

  get strategy() {
    return QuantexController.strategies.data.find(
      strategy => strategy.id == this.strategy_id
    );
  }

  get FLOW_COLUMN() {
    return [
      { title: "ID", key: "id", algin: "left" },
      { title: "Period", key: "period", algin: "left" },
      {
        title: "First Spread",
        key: "first_spread",
        algin: "left",
        scopedSlots: true,
      },
      {
        title: "Spread",
        key: "spread",
        algin: "left",
        scopedSlots: true,
      },
      {
        title: "Levels Size",
        key: "levels_size",
        algin: "center",
        scopedSlots: true,
      },
      {
        title: "Levels Count",
        key: "levels_count",
        algin: "right",
        scopedSlots: true,
      },
      {
        title: "Levels Start",
        key: "levels_start",
        algin: "right",
        scopedSlots: true,
      },
      {
        title: "Update Chance",
        key: "update_chance",
        algin: "right",
        scopedSlots: true,
      },
      { title: "Action", key: "action", algin: "right", scopedSlots: true },
    ].filter(item => {
      if (this.strategy.type == "trade" && item.key == "first_spread") {
        return false;
      } else if (this.strategy.type == "trade" && item.key == "spread") {
        return false;
      } else if (this.strategy.type == "trade" && item.key == "levels_count") {
        return false;
      } else if (this.strategy.type == "trade" && item.key == "levels_start") {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "first_spread"
      ) {
        return false;
      } else if (this.strategy.type == "fixed_trade" && item.key == "spread") {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "levels_size"
      ) {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "levels_count"
      ) {
        return false;
      } else if (
        this.strategy.type == "fixed_trade" &&
        item.key == "levels_start"
      ) {
        return false;
      } else if (
        this.strategy.type == "market_making" &&
        item.key == "levels_size"
      ) {
        return false;
      } else if (
        this.strategy.type == "market_making" &&
        item.key == "levels_start"
      ) {
        return false;
      } else if (this.strategy.type == "copy" && item.key == "first_spread") {
        return false;
      }

      if (
        this.strategy.type != "market_making" &&
        item.key == "update_chance"
      ) {
        return false;
      }

      return true;
    });
  }

  add_flow() {
    (this.$refs["modal-flow"] as any).create({
      type: "create",
      strategy: this.strategy,
    });
  }

  async update_strategy_flow_state(
    flow: Quantex.StrategyFlow,
    state: Quantex.StrategyState
  ) {
    const payload: Quantex.StrategyFlow = {
      id: flow.id,
      strategy_id: this.strategy.id,
      period: Number(flow.period),
      state: state,
      options: flow.options
    };

    try {
      await QuantexController.update_strategy_flow(payload);
    } catch (error) {
      return;
    }
  }

  delete_strategy_flow(id: number, strategy_id: number) {
    QuantexController.delete_strategy_flow(id, strategy_id);
  }
}
</script>

<style lang="less">
.page-bot-strategies .flow-table {
  margin-top: 12px;

  .add-flow {
    width: 100%;
    margin: 12px auto 0;
    text-align: center;
  }
}
</style>
