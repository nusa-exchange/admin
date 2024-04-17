<template>
  <a-tabs defaultActiveKey="1" class="page-user-directory history">
    <a-tab-pane tab="Trades" key="1">
      <trades :user_info="user_info" />
    </a-tab-pane>
    <a-tab-pane tab="Orders" key="2">
      <orders :user_info="user_info" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import ZTable from "@/components/z-table";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "z-table": ZTable,
    orders: () => import("./orders.vue"),
    trades: () => import("./trades.vue")
  }
})
export default class App extends Vue {
  @Prop() readonly user_info!: User;
}
</script>

<style lang="less">
@import "~@styles/views/users/user-directory/history";
</style>
