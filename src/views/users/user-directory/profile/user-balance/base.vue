<template>
  <z-table
    class="page-user user-open-orders"
    :columns="COLUMN"
    :data="balance_data"
    :scroll="false"
    :pagination="false"
  />
</template>

<script lang="ts">
import ZTable from "@/components/z-table";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "z-table": ZTable
  }
})
export default class App extends Vue {
  @Prop() readonly member_info!: Member;

  protected readonly COLUMN = [
    { title: "Currency", key: "currency", algin: "left" },
    { title: "Available balance", key: "balance", algin: "left" },
    { title: "Locked balance", key: "locked", algin: "left" },
    { title: "Total balance", key: "total", algin: "left" }
  ];

  get balance_data() {
    return this.member_info.accounts.map((record: any) => {
      record.currency = record.currency.toUpperCase();
      record.balance = (record.balance * 1).toFixed(8);
      record.locked = (record.locked * 1).toFixed(8);
      record.total = (record.locked * 1 + record.balance * 1).toFixed(8);

      return record;
    });
  }
}
</script>

<style lang="less">
@import "~@styles/views/users/user-directory/balance";
</style>
