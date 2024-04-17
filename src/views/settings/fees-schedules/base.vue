<template>
  <div class="page-settings-fee-schedules">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="data"
      :scroll="false"
      :pagination="true"
      :hover="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_trading_fees"
      @click="edit_trading_fee"
    >
      <template
        v-for="slot in ['group', 'market_id', 'maker', 'taker']"
        :slot="slot"
        slot-scope="{ item, column }"
      >
        <span :class="`${slot} text-${column.algin}`" :key="slot">
          {{
            ["group", "market_id"].includes(slot)
              ? item[slot].toUpperCase()
              : item[slot] + "%"
          }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-icon theme="filled" type="edit" @click="edit_trading_fee(item)" />
          <a-icon
            theme="filled"
            type="delete"
            @click.stop="delete_trading_fee(item.id)"
          />
        </span>
      </template>
    </z-table>

    <modal-fee-schedule
      ref="modal-fee-schedule"
      :markets="markets"
      @submit="onModalSubmit"
    />

    <z-filter-drawer
      ref="filter"
      @reset="onDrawerReset"
      @submit="onDrawerSubmit"
    >
      <z-info-row
        v-for="item in filter_list"
        :item="item"
        :key="item.key"
        v-model="payload_filter[item.key]"
      >
      </z-info-row>
    </z-filter-drawer>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import ModalFeeSchedule from "./modal.vue";
import store from "@/store";
import { runNotice } from "@/mixins";
import {
  GET_TRADING_FEES,
  CREATE_TRADING_FEE,
  UPDATE_TRADING_FEE,
  DELETE_TRADING_FEE,
  GET_MARKETS
} from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-fee-schedule": ModalFeeSchedule
  }
})
export default class FeesSchedules extends Vue {
  data: TradingFee[] = [];
  page = 1;
  limit = 50;
  loading_trading_fees = false;
  loading_markets = false;
  readonly COLUMN = [
    { title: "Id", key: "id", algin: "left" },
    { title: "Group", key: "group", algin: "left", scopedSlots: true },
    { title: "Market", key: "market_id", algin: "left", scopedSlots: true },
    { title: "Maker fee", key: "maker", algin: "left", scopedSlots: true },
    { title: "Taker fee", key: "taker", algin: "left", scopedSlots: true },
    { title: "", key: "action", algin: "right", scopedSlots: true }
  ];
  $refs!: {
    "modal-fee-schedule": ModalFeeSchedule;
    filter: Vue | Element | Vue[] | Element[];
  };
  markets: Market[] = [];
  payload_filter = {
    group: "",
    market_id: ""
  };

  get loading() {
    return this.loading_trading_fees || this.loading_markets;
  }

  get filter_list() {
    return [
      {
        title: "Group",
        key: "group",
        value: this.payload_filter.group,
        type: "input",
        edit: true
      },
      {
        title: "Market",
        key: "market_id",
        value: this.payload_filter.market_id,
        type: "input",
        edit: true
      }
    ];
  }

  mounted() {
    this.get_markets();
    this.get_trading_fees();
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Add Fees Schedule",
        key: "add_fees_schedule",
        icon: "plus-circle",
        callback: () => {
          this.$refs["modal-fee-schedule"].create({
            type: "create",
            item: {
              group: "",
              market_id: "",
              maker: "",
              taker: ""
            }
          });
        }
      },
      {
        title: "Filter",
        key: "filter",
        icon: "funnel-plot",
        callback: () => {
          (this.$refs.filter as any).create();
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  async get_markets() {
    this.loading_markets = true;
    try {
      const { data } = await store.dispatch(GET_MARKETS);

      this.markets = data;
      this.loading_markets = false;
    } catch (error) {
      this.loading_markets = false;
      return error;
    }
  }

  async get_trading_fees(payload = { page: this.page, limit: this.limit }) {
    this.loading_trading_fees = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_TRADING_FEES,
        Object.assign(payload, this.payload_filter)
      );
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading_trading_fees = false;
    } catch (error) {
      this.loading_trading_fees = false;
      return error;
    }
  }

  edit_trading_fee(item: TradingFee) {
    this.$refs["modal-fee-schedule"].create({
      type: "edit",
      item: {
        id: item.id,
        group: item.group.toLowerCase(),
        market_id: item.market_id.toLowerCase(),
        maker: item.maker,
        taker: item.taker
      }
    });
  }

  async update_trading_fee(payload, callback?: () => void) {
    try {
      const { data } = await store.dispatch(UPDATE_TRADING_FEE, payload);

      runNotice("success", "Trading fee updated successfully");

      const index = this.data.findIndex(record => record.id === data.id);

      if (index >= 0) this.data[index] = data;
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async create_trading_fee(payload, callback?: () => void) {
    try {
      await store.dispatch(CREATE_TRADING_FEE, payload);

      runNotice("success", "Trading fee created successfully");

      this.get_trading_fees();

      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async delete_trading_fee(id: number) {
    try {
      await store.dispatch(DELETE_TRADING_FEE, id);

      runNotice("success", "Trading fee deleted successfully");

      const index = this.data.findIndex(record => record.id === id);

      if (index >= 0) {
        this.data.splice(index, 1);
      }
    } catch (error) {
      return error;
    }
  }

  onModalSubmit(payload) {
    if (payload.type === "edit") {
      this.update_trading_fee(payload.item, () => {
        this.$refs["modal-fee-schedule"].delete();
        this.$forceUpdate();
      });
    } else {
      this.create_trading_fee(
        payload.item,
        this.$refs["modal-fee-schedule"].delete
      );
    }
  }

  onDrawerReset() {
    for (const index in this.payload_filter) {
      this.payload_filter[index] = "";
    }
    (this.$refs.filter as any).remove();
  }

  onDrawerSubmit() {
    this.get_trading_fees();
    (this.$refs.filter as any).remove();
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/fees-schedules/base";
</style>
