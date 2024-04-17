<template>
  <z-table
    class="orders"
    :loading="loading"
    :columns="columns"
    :data="orders"
    :scroll="false"
    :pagination="true"
    :page="page"
    :page-size="pageSize"
    @change-pagination="change_pagination"
  >
    <template slot="email" slot-scope="{ item, column }">
      <router-link
        :class="['email', `text-${column.algin}`]"
        :to="`/users/user-directory/${item.uid}`"
      >
        {{ item.email }}
      </router-link>
    </template>
    <template slot="price" slot-scope="{ item, column }">
      <span :class="`price text-${column.algin}`">
        {{ item.price || "NULL" }}
      </span>
    </template>
    <template slot="side" slot-scope="{ item, column }">
      <span
        :class="[
          'side',
          `text-${column.algin}`,
          `text-${item.side === 'buy' ? 'up' : 'down'}`
        ]"
      >
        {{ item.side }}
      </span>
    </template>
    <template slot="action" slot-scope="{ item, column }">
      <span :class="`action text-${column.algin}`">
        <span @click="cancel_order(item.id)">
          Cancel
          <a-icon type="close-circle" />
        </span>
      </span>
    </template>
  </z-table>
</template>

<script lang="ts">
import store from "@/store";
import { CANCEL_ORDER } from "@/store/types";
import { runNotice, getDate } from "@/mixins";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class OrdersComponent extends Vue {
  @Prop() readonly type: "open" | "history";
  @Prop({ default: false }) readonly loading: boolean;
  @Prop({ default: () => [] }) readonly data: UserOrder[];
  @Prop({ default: 1 }) readonly page: number;
  @Prop({ default: 50 }) readonly pageSize: number;
  @Prop({ default: () => [] }) readonly disabled_columns!: string[];

  orders_removed: number[] = [];

  get columns() {
    const columns = [
      { title: "Order ID", key: "id", algin: "left" },
      { title: "Email", key: "email", algin: "left", scopedSlots: true },
      { title: "Market", key: "market", algin: "left" },
      { title: "Type", key: "ord_type", algin: "left" },
      { title: "Amount", key: "origin_volume", algin: "left" },
      { title: "Executed", key: "executed_volume", algin: "left" },
      { title: "Price", key: "price", algin: "left", scopedSlots: true },
      { title: "Side", key: "side", algin: "center", scopedSlots: true },
      { title: "Created", key: "created_at", algin: "right" },
      { title: "Action", key: "action", algin: "center", scopedSlots: true },
      { title: "Status", key: "state", algin: "right" }
    ];

    return columns.filter(col => {
      if (col.key === "action" && this.type === "history") return false;
      if (col.key === "state" && this.type === "open") return false;

      return !this.disabled_columns.includes(col.key);
    });
  }

  get orders() {
    return this.data
      .filter(order => {
        return !this.orders_removed.includes(order.id);
      })
      .map(order => {
        order["market"] = order["market"].toUpperCase();
        (order as any)["created_at"] = getDate(order.created_at as Date, true);
        (order as any)["updated_at"] = getDate(order.created_at as Date, true);

        return order;
      });
  }

  change_pagination(payload) {
    this.$emit("change-pagination", payload);
  }

  async cancel_order(id: number) {
    try {
      await store.dispatch(CANCEL_ORDER, id);

      runNotice("success", "Order has been canceled");
      this.orders_removed.push(id);
    } catch (error) {
      return error;
    }
  }

  @Watch("data")
  onDataChanged() {
    this.orders_removed = [];
  }
}
</script>

<style lang="less">
//TODO: Move to less file
@import "~ant-design-vue/es/style/themes/default";

.orders {
  .id {
    flex: 0.75;
  }
  .email {
    flex: 1.75;
  }
  .ord_type {
    flex: 0.75;
    text-transform: capitalize;
  }
  .side {
    flex: 0.75;
    text-transform: capitalize;
  }
  .created_at,
  .updated_at {
    flex: 1.25;
  }
  .state,
  .action {
    flex: 0.5;
  }

  .z-table-row {
    .email {
      color: inherit;
      &:hover {
        text-decoration: underline;
      }
    }

    .action {
      span {
        cursor: pointer;
        color: @processing-color;
        &:hover {
          color: @error-color;
        }
      }
    }
  }
}
</style>
