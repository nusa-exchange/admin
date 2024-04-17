<template>
  <!-- TODO: Add v-for -->
  <div class="orderbook">
    <a-card
      v-for="side in ['bids', 'asks']"
      :key="side"
      class="ant-card-no-padding"
      title="Buy orders"
    >
      <z-table
        :loading="loading[side]"
        :columns="ORDERS_COLUMN"
        :data="data[side]"
        :hover="true"
        :scroll="false"
        :pagination="true"
        :page="page[side]"
        :page-size="limit[side]"
        @change-pagination="payload => get_orders(side, payload)"
      >
        <template slot="uid" slot-scope="{ item, column }">
          <router-link
            :class="['uid', `text-${column.algin}`]"
            :to="`/users/user-directory/${item.uid}`"
          >
            {{ item.uid }}
          </router-link>
        </template>
        <template slot="total" slot-scope="{ item, column }">
          <span :class="['total', `text-${column.algin}`]">
            {{ get_total(item) }}
          </span>
        </template>
        <template slot="action" slot-scope="{ item, column }">
          <span :class="['action', `text-${column.algin}`]">
            <span @click="close_order(item.id)">
              Cancel <a-icon type="close-circle" />
            </span>
          </span>
        </template>
      </z-table>
    </a-card>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { runNotice } from "@/mixins";
import { GET_ORDERS, CANCEL_ORDER } from "@/store/types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() readonly market!: Market;

  loading = {
    asks: false,
    bids: true
  };
  data: { asks: UserOrder[]; bids: UserOrder[] } = {
    asks: [],
    bids: []
  };
  page = {
    asks: 1,
    bids: 1
  };
  limit = {
    asks: 50,
    bids: 50
  };

  private readonly ORDERS_COLUMN = [
    { title: "Order ID", key: "id", algin: "left" },
    { title: "UID", key: "uid", algin: "left", scopedSlots: true },
    { title: "Type", key: "ord_type", algin: "left" },
    { title: "Price", key: "price", algin: "left" },
    { title: "Amount", key: "origin_volume", algin: "left" },
    { title: "Total", key: "total", algin: "left", scopedSlots: true },
    { title: "", key: "action", algin: "center", scopedSlots: true }
  ];

  mounted() {
    this.get_orders("asks");
    this.get_orders("bids");
  }

  get_total(order: UserOrder) {
    return Number(
      (Number(order.price) * Number(order.origin_volume)).toFixed(
        this.market.total_precision
      )
    );
  }

  async get_orders(
    side: "asks" | "bids",
    payload = {
      page: this.page[side],
      limit: this.limit[side]
    }
  ) {
    try {
      this.loading.asks = true;
      const { data, headers } = await store.dispatch(
        GET_ORDERS,
        Object.assign(
          {
            market: this.market.id,
            state: "wait",
            type: "sell",
            order_by: "price"
          },
          payload
        )
      );
      this.page[side] = Number(headers.page);
      this.limit[side] = Number(headers["per-page"]);
      this.data[side] = data;
      this.loading[side] = false;
    } catch (error) {
      this.loading[side] = false;
      return error;
    }
  }

  async cancel_order(id: number) {
    try {
      await store.dispatch(CANCEL_ORDER, id);

      runNotice("success", "Order has been canceled");

      const SIDE = ["asks", "bids"];

      SIDE.forEach(side => {
        const index = this.data[side].findIndex(order => order.id === id);
        if (index < 0) return;

        this.data[side].splice(index, 1);
      });
    } catch (error) {
      return error;
    }
  }
}
</script>
