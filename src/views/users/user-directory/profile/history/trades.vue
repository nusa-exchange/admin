<template>
  <trades
    :loading="loading"
    :data="data"
    :page="page"
    :page-size="limit"
    @change-pagination="get_trades"
  />
</template>

<script lang="ts">
import store from "@/store";
import { GET_TRADES } from "@/store/types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    trades: () => import("@/layouts/trades")
  }
})
export default class App extends Vue {
  loading = false;
  page = 1;
  limit = 50;
  data: UserTrade[] = [];

  @Prop() readonly user_info!: User;
  mounted() {
    this.get_trades({
      page: this.page,
      limit: this.limit
    });
  }

  async get_trades(payload?) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_TRADES,
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
