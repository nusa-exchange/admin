<template>
  <div class="page-exchange-currencies">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="currencies_data"
      :hover="true"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_currencies"
      @click="on_table_click"
    >
      <template slot="code" slot-scope="{ item, column }">
        <span :class="`code text-${column.algin}`">
          {{ item.code.toUpperCase() }}
        </span>
      </template>
      <template slot="status" slot-scope="{ item, column }">
        <span :class="`status text-${column.algin}`">
          <span @click.stop.prevent>
            <a-switch
              :checked="item.status == 'enabled'"
              :loading="item.loading"
              @click="
                update_currency_status(
                  item.code,
                  item.status == 'enabled' ? 'disabled' : 'enabled'
                )
              "
            >
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </span>
        </span>
      </template>
    </z-table>
    <z-filter-drawer
      ref="filter"
      @reset="onDrawerReset"
      @submit="onDrawerSubmit"
    >
      <z-info-row
        v-for="item in filter_list"
        v-model="payload_filter[item.key]"
        :item="item"
        :key="item.key"
      />
    </z-filter-drawer>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { getDate } from "@/mixins";
import store from "@/store";
import { GET_CURRENCIES, UPDATE_CURRENCY } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  loading = false;
  data: Currency[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    type: ""
  };
  private readonly COLUMN = [
    { title: "Code", key: "code", algin: "left", scopedSlots: true },
    { title: "Name", key: "name", algin: "left" },
    { title: "Type", key: "type", algin: "left" },
    { title: "Price", key: "price", algin: "left" },
    { title: "Status", key: "status", algin: "right", scopedSlots: true }
  ];

  get filter_list() {
    return [
      {
        title: "Type",
        key: "type",
        value: this.payload_filter.type,
        type: "select",
        list: {
          coin: "Coin",
          fiat: "Fiat"
        }
      }
    ];
  }

  get currencies_data() {
    return this.data.map(currency => {
      (currency as any).created_at = getDate(currency.created_at as Date, true);

      return currency;
    });
  }

  mounted() {
    this.get_currencies();
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Create Currency",
        key: "create_currency",
        icon: "plus-circle",
        callback: () => {
          this.$router.push("/exchange/currencies/create");
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

  async get_currencies(
    payload = {
      limit: this.limit,
      page: this.page
    }
  ) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_CURRENCIES,
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

  async update_currency_status(code: string, status: "enabled" | "disabled") {
    const index = this.data.findIndex(currency => currency.code == code);
    Vue.set(this.data[index], "loading", true);

    try {
      const { data } = await store.dispatch(UPDATE_CURRENCY, { code, status });
      Vue.set(this.data, index, data);
    } catch (error) {
      Vue.set(this.data[index], "loading", false);
      return error;
    } finally {
      Vue.delete(this.data[index], "loading");
    }
  }

  onDrawerReset() {
    for (const index in this.payload_filter) {
      this.payload_filter[index] = "";
    }
    (this.$refs.filter as any).remove();
  }

  on_table_click(item) {
    this.$router.push(`/exchange/currencies/${item.code.toLowerCase()}`);
  }

  onDrawerSubmit() {
    this.get_currencies();
  }
}
</script>

<style lang="less">
@import "~@styles/views/exchange/currencies/base";
</style>
