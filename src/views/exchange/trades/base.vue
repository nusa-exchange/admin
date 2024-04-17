<template>
  <div class="page-exchange-trades">
    <trades
      :loading="loading"
      :data="data"
      :page="page"
      :page-size="limit"
      @change-pagination="get_trades"
    />

    <z-filter-drawer
      ref="filter"
      @reset="onDrawerReset"
      @submit="onFilterSubmit"
    >
      <z-info-row
        v-for="item in filter_list"
        v-model="payload_filter[item.key]"
        :ref="`z-info-row-${item.key}`"
        :item="item"
        :key="item.key"
      >
        <template
          v-for="date_picker in [
            { key: 'from', placeholder: 'From date' },
            { key: 'to', placeholder: 'To date' }
          ]"
          :slot="date_picker.key"
        >
          <a-date-picker
            :key="date_picker.key"
            :placeholder="date_picker.placeholder"
            @change="
              moment => {
                payload_filter[date_picker.key] = moment.toDate().toISOString();
              }
            "
          />
        </template>
      </z-info-row>
    </z-filter-drawer>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { jsonToCSV, saveFile } from "@/mixins";
import store from "@/store";
import { GET_TRADES } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    trades: () => import("@/layouts/trades")
  }
})
export default class App extends Vue {
  loading = false;
  data: UserTrade[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    uid: "",
    from: "",
    to: "",
    order_id: ""
  };

  get filter_list() {
    return [
      {
        title: "From date",
        key: "from",
        value: this.payload_filter.from,
        type: "slot",
        style: "width: 45%"
      },
      {
        title: "To date",
        key: "to",
        value: this.payload_filter.to,
        type: "slot",
        style: "width: 45%"
      },
      {
        title: "UID",
        key: "uid",
        value: this.payload_filter.uid,
        type: "input",
        edit: true
      },
      {
        title: "Order ID",
        key: "order_id",
        value: this.payload_filter.order_id,
        type: "input",
        edit: true
      }
    ];
  }

  mounted() {
    this.get_trades();
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Filter",
        key: "filter",
        icon: "funnel-plot",
        callback: () => {
          (this.$refs.filter as any).create();
        }
      },
      {
        title: "Export",
        key: "export",
        icon: "file-zip",
        callback: async () => {
          const csvString = await jsonToCSV(
            this.data.map(order => {
              return order;
            })
          );
          saveFile(csvString, "trades.csv", {
            type: "text/csv;charset=utf-8;"
          });
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  async get_trades(
    payload = {
      page: this.page,
      limit: this.limit
    }
  ) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_TRADES,
        Object.assign(payload, this.payload_filter)
      );
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  onDrawerReset() {
    for (const index in this.payload_filter) {
      this.payload_filter[index] = "";
    }
    (this.$refs.filter as any).remove();
  }

  onFilterSubmit() {
    this.get_trades();
  }
}
</script>

<style lang="less">
@import "~@styles/views/exchange/trades/base";
</style>
