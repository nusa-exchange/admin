<template>
  <div v-if="!loading" class="page-bot-strategies edit">
    <z-configuration>
      <div class="z-edit-panel" style="padding: 0">
        <div class="z-edit-panel-head">
          <div class="z-edit-panel-title">
            {{ title }}
          </div>
          <z-info-row
            v-model="strategy.state"
            :item="{
              title: 'Status',
              key: 'status',
              value: strategy.state,
              type: 'switch',
              switch: {
                0: 'disabled',
                1: 'enabled'
              },
              loading: strategy.loading
            }"
            style="width: auto;"
          />
        </div>
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_LIST"
            v-model="strategy[setting.key]"
            :key="setting.key"
            :item="setting"
          />
          <div class="z-edit-panel-action">
            <a-button
              :loading="strategy.loading"
              type="primary"
              @click="onSubmit"
            >
              Submit
            </a-button>
          </div>
        </div>
      </div>
    </z-configuration>
    <z-table-select
      left-title="Linked Source Market"
      right-title="Existing Source Market"
      :left-columns="market_columns('linked')"
      :right-columns="market_columns('existing')"
      :left-data="linked_markets"
      :right-data="existing_markets"
      :search-keys="['symbol']"
      style="margin-top: 12px"
    >
      <template slot="right-search-action">
        <a-button
          v-if="page_type != 'create'"
          type="primary"
          style="margin-left: 12px"
          :disabled="source_market_cached.length == 0"
          @click="add_source_markets"
        >
          Add selected
        </a-button>
      </template>
      <template slot="symbol" slot-scope="{ item, column }">
        <span :class="`symbol text-${column.algin}`">
          {{ item.ask.toUpperCase() }}/{{ item.bid.toUpperCase() }}
        </span>
      </template>
      <template slot="exchange" slot-scope="{ item, column }">
        <span :class="`exchange text-${column.algin}`">
          {{ get_exchange_name(item.exchange_id) }}
        </span>
      </template>

      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-icon
            type="delete"
            theme="filled"
            @click="delete_linked_market(item.id)"
          />
        </span>
      </template>
      <template slot="checkbox" slot-scope="{ item, column }">
        <span :class="`checkbox text-${column.algin}`">
          <a-checkbox
            :value="item.id"
            :checked="source_market_cached.includes(item.id)"
            :disabled="strategy.target_market == item.id"
            @change="onCheckboxMarketChanged"
          />
        </span>
      </template>
    </z-table-select>
    <flow-table
      v-if="page_type == 'update' && !loading"
      :strategy_id="strategy_id"
    />
    <modal-copy-flows
      v-if="page_type == 'update' && !loading"
      ref="modal-copy-flows"
      :strategy_id="strategy_id"
    />
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { QuantexController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "flow-table": () => import("./flow-table.vue"),
    "modal-copy-flows": () => import("./modal-copy-flows.vue")
  }
})
export default class Base extends Vue {
  linked_markets_search = "";
  existing_markets_search = "";

  strategy: Quantex.Strategy = {
    source_markets: []
  };

  source_market_cached = Array<number>();

  get loading() {
    return (
      this.exchanges.loading || this.markets.loading || this.strategies.loading
    );
  }

  get title() {
    return this.page_type == "update" ? "Update Strategy" : "Create Strategy";
  }

  get strategy_id() {
    return (this.$route.params["id"] as unknown) as number;
  }

  get page_type() {
    return this.$route.meta["type"] as string;
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

  market_columns(type: string) {
    return [
      { title: "", key: "checkbox", algin: "left", scopedSlots: true },
      { title: "Symbol", key: "symbol", algin: "left", scopedSlots: true },
      { title: "Exchange", key: "exchange", algin: "left", scopedSlots: true },
      { title: "Action", key: "action", algin: "right", scopedSlots: true }
    ]
      .filter(x => {
        if (type == "linked" && x.key == "checkbox") return false;
        if (type != "linked" && x.key == "action") return false;

        return true;
      })
      .map(x => {
        if (type == "existing" && x.key == "exchange") x.algin = "right";

        return x;
      });
  }

  get FLOW_COLUMN() {
    return [];
  }

  get linked_markets() {
    const search = this.linked_markets_search;

    return (this.strategy.source_markets || [])
      .map(id => this.markets.data.find(market => market.id == id))
      .filter(market => {
        return market?.symbol.includes(search.toLowerCase());
      });
  }

  get existing_markets() {
    const search = this.existing_markets_search;

    return this.markets.data.filter(market => {
      for (const id of this.strategy.source_markets || []) {
        if (market.id == id) return false;
      }

      if (this.existing_markets_search.length) {
        return market?.symbol.includes(search.toLowerCase());
      }

      return true;
    });
  }

  get SETTING_LIST() {
    return [
      {
        title: "Type",
        key: "type",
        value: this.strategy.type,
        type: "select",
        list: (() => {
          return QuantexController.strategy_types.data.reduce((obj, type) => {
            return {
              ...obj,
              [type]: type.toUpperCase()
            };
          }, {});
        })()
      },
      {
        title: "Side",
        key: "side",
        value: this.strategy.side,
        type: "select",
        list: {
          buy: "BUY",
          sell: "SELL",
          both: "BOTH"
        }
      },
      {
        title: "Target Market",
        key: "target_market",
        value: this.strategy.target_market,
        type: "select",
        list: (() => {
          return this.markets.data.reduce((obj, market) => {
            return {
              ...obj,
              [market["id"]]:
                (market.ask + "/" + market.bid).toUpperCase() +
                " - (" +
                this.exchanges.data.find(
                  exchange => exchange.id == market.exchange_id
                )?.name +
                ")"
            };
          }, {});
        })()
      },
    ];
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Copy Strategy",
        key: "copy_strategy",
        icon: "copy",
        theme: "filled",
        callback: () => {
          (this.$refs["modal-copy-flows"] as any).create();
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  beforeMount() {
    if (this.page_type == "update") {
      this.strategy =
        QuantexController.strategies.data.find(
          strategy => strategy.id == this.strategy_id
        ) || {};
    }
  }

  mounted() {
    if (this.page_type == "update") {
      this.set_action_header();
    }
  }

  add_source_markets() {
    QuantexController.add_strategy_source_market(
      Number(this.strategy_id),
      this.source_market_cached,
      () => {
        this.source_market_cached = [];
      }
    );
  }

  delete_linked_market(market_id: number) {
    QuantexController.delete_strategy_source_market(
      Number(this.strategy_id),
      market_id
    );
  }

  async onSubmit() {
    const payload: Quantex.Strategy = {
      type: this.strategy.type,
      side: this.strategy.side,
      enable_orderback: this.strategy.enable_orderback,
      target_market: Number(this.strategy.target_market),
      state: this.strategy.state || "disabled"
    };

    if (this.page_type == "update") {
      payload.id = this.strategy.id;
      await QuantexController.update_strategy(payload);
    } else {
      await QuantexController.create_strategy(payload);
    }
  }

  onCheckboxMarketChanged(event) {
    const value: number = event.target.value;
    const checked: boolean = event.target.checked;

    if (checked) {
      this.source_market_cached.push(value);
    } else {
      const index = this.source_market_cached.indexOf(value);

      if (index < 0) return;

      this.source_market_cached.splice(index, 1);
    }
  }

  get_exchange_name(exchange_id: number) {
    return this.exchanges.data.find(exchange => exchange.id == exchange_id)?.name;
  }
}
</script>

<style lang="less">
.page-bot-strategies.edit {
  .z-table {
    width: 100%;
  }
}
</style>
