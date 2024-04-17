<template>
  <orders
    type="open"
    :loading="loading"
    :data="data"
    :page="page"
    :page-size="limit"
    :disabled_columns="['email']"
    @change-pagination="get_orders"
  />
</template>

<script lang="ts">
import store from "@/store";
import { CANCEL_ORDER } from "@/store/types";
import { getDate, runNotice } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";
import { GET_ORDERS } from "@/store/types";

@Component({
  components: {
    orders: () => import("@/layouts/orders")
  }
})
export default class App extends Vue {
  loading = false;
  data: UserOrder[] = [];
  page = 1;
  limit = 50;

  @Prop() readonly user_info!: User;

  mounted() {
    this.get_orders({
      page: this.page,
      limit: this.limit
    });
  }

  async get_orders(payload?) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_ORDERS,
        Object.assign(
          {
            state: "wait"
          },
          payload
        )
      );
      this.data = data;
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  get orders_data() {
    return this.data.map(order => {
      order["market"] = order["market"].toUpperCase();
      (order as any)["created_at"] = getDate(order.created_at as Date, true);
      (order as any)["updated_at"] = getDate(order.created_at as Date, true);

      return order;
    });
  }

  async cancel_order(id: number) {
    try {
      await store.dispatch(CANCEL_ORDER, id);

      runNotice("success", "Order has been canceled");
      const index = this.data.findIndex(order => order.id === id);
      if (index < 0) return;

      this.data.splice(index, 1);
    } catch (error) {
      return error;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/users/user-directory/open_oders";
</style>
