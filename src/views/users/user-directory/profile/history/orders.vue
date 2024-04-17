<template>
  <orders
    type="history"
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
import { GET_ORDERS } from "@/store/types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    orders: () => import("@/layouts/orders")
  }
})
export default class App extends Vue {
  loading = false;
  page = 1;
  limit = 50;
  data: UserOrder[] = [];

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
            uid: this.user_info.uid,
            ordering: "desc"
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
}
</script>
