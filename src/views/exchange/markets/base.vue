<template>
  <div class="page-exchange-markets">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="markets_data"
      :hover="true"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_markets"
      @click="on_table_click"
    >
      <template slot="status" slot-scope="{ item, column }">
        <span :class="`status text-${column.algin}`">
          <span @click.stop.prevent>
            <a-switch
              :checked="item.state == 'enabled'"
              :loading="item.loading"
              @click="
                update_market_state(
                  item.id,
                  item.state == 'enabled' ? 'disabled' : 'enabled'
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
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import { getDate } from "@/mixins";
import { GET_MARKETS, UPDATE_MARKET } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Markets extends Vue {
  loading = false;
  data: Market[] = [];
  page = 1;
  limit = 50;

  readonly COLUMN = [
    { title: "Market ID", key: "name", algin: "left" },
    { title: "Price precision", key: "price_precision", algin: "left" },
    { title: "Amount precision", key: "amount_precision", algin: "left" },
    { title: "Total precision", key: "total_precision", algin: "left" },
    { title: "Min Price", key: "min_price", algin: "left" },
    { title: "Max Price", key: "max_price", algin: "left" },
    { title: "Min Amount", key: "min_amount", algin: "left" },
    { title: "Created", key: "created_at", algin: "left" },
    { title: "Status", key: "status", algin: "right", scopedSlots: true }
  ];

  get markets_data() {
    return this.data.map(market => {
      (market as any).created_at = getDate(market.created_at as Date, true);

      return market;
    });
  }

  mounted() {
    this.get_markets({ limit: this.limit, page: this.page });
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Create Market",
        key: "create_market",
        icon: "plus-circle",
        callback: () => {
          this.$router.push("/exchange/markets/create");
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  async get_markets(payload) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(GET_MARKETS, payload);
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  async update_market_state(id: string, state: "enabled" | "disabled") {
    const index = this.data.findIndex(market => market.id == id);
    Vue.set(this.data[index], "loading", true);

    try {
      const { data } = await store.dispatch(UPDATE_MARKET, { id, state });
      Vue.set(this.data, index, data);
    } catch (error) {
      Vue.set(this.data[index], "loading", false);
      return error;
    } finally {
      Vue.delete(this.data[index], "loading");
    }
  }

  on_table_click(item) {
    this.$router.push(`/exchange/markets/${item.id.toLowerCase()}`);
  }
}
</script>

<style lang="less">
@import "~@styles/views/exchange/markets/base";
</style>
