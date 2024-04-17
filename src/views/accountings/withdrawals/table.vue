<template>
  <z-table
    :loading="loading"
    :columns="COLUMN"
    :data="data"
    :scroll="false"
    :pagination="true"
    :hover="true"
    :page="page"
    :page-size="limit"
    @change-pagination="loadData"
    @click="on_table_click"
  >
    <template slot="email" slot-scope="{ item, column }">
      <span :class="['email', `text-${column.algin}`]">
        <router-link :to="`/users/user-directory/${item.uid}`">
          {{ item.email }}
        </router-link>
      </span>
    </template>
    <template slot="blockchain_txid" slot-scope="{ item, column }">
      <span :class="['blockchain_txid', `text-${column.algin}`]">
        <a
          :href="getTxIDUrl(item.blockchain_key, item.blockchain_txid)"
          target="_blank"
          @click.stop
        >
          {{ item.blockchain_txid }}
        </a>
      </span>
    </template>
    <template slot="rid" slot-scope="{ item, column }">
      <span :class="['rid', `text-${column.algin}`]">
        <a
          :href="getAddressUrl(item.blockchain_key, item.rid)"
          target="_blank"
          @click.stop
        >
          {{ item.rid }}
        </a>
      </span>
    </template>
  </z-table>
</template>

<script lang="ts">
import { getTxIDUrl, getAddressUrl } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class WithdrawalsTable extends Vue {
  @Prop() readonly loading!: boolean;
  @Prop() readonly data!: Withdraw;
  @Prop() readonly limit!: number;
  @Prop() readonly total!: number;
  @Prop() readonly page!: number;
  @Prop() readonly loadData!: void;

  getTxIDUrl = getTxIDUrl;
  getAddressUrl = getAddressUrl;

  COLUMN = [
    { title: "ID", key: "id", algin: "left" },
    { title: "Email", key: "email", algin: "left", scopedSlots: true },
    { title: "Currency", key: "currency", algin: "left" },
    { title: "TxID", key: "blockchain_txid", algin: "left", scopedSlots: true },
    {
      title: "Recipient Address",
      key: "rid",
      algin: "left",
      scopedSlots: true
    },
    { title: "Created At", key: "created_at", algin: "left" },
    { title: "Amount", key: "amount", algin: "left" },
    { title: "State", key: "state", algin: "right" },
  ];

  on_table_click(item: Withdraw) {
    this.$emit("click", item);
  }
}
</script>

<style lang="less">
@import "~@styles/views/accountings/withdrawals/table";
</style>
