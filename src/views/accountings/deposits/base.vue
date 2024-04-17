<template>
  <div class="page-accountings-deposits">
    <z-table
      :loading="loading"
      :data="deposits"
      :columns="COLUMN"
      :scroll="false"
      :pagination="true"
      :hover="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_deposits"
      @click="on_table_click"
    >
      <template slot="email" slot-scope="{ item, column }">
        <span :class="['email', `text-${column.algin}`]">
          <router-link :to="`/users/user-directory/${item.email}`">
            {{ item.email }}
          </router-link>
        </span>
      </template>
      <template slot="txid" slot-scope="{ item, column }">
        <span :class="['txid', `text-${column.algin}`]">
          <a
            :href="getTxIDUrl(item.blockchain_key, item.txid)"
            target="_blank"
            @click.stop
          >
            {{ item.txid }}
          </a>
        </span>
      </template>
      <template slot="state" slot-scope="{ item, column }">
        <span
          :class="[
            'state',
            `text-${column.algin}`,
            {
              'text-up': ['collected'].includes(item.state),
              'text-down': ['skipped', 'rejected', 'canceled'].includes(
                item.state
              ),
              'text-warn': [
                'accepted',
                'processing',
                'fee_processing',
                'submitted'
              ].includes(item.state)
            }
          ]"
        >
          {{ item.state }}
        </span>
      </template>
      <template slot="action" slot-scope="{ column }">
        <span :class="`action text-${column.algin}`">
          <a-icon type="right" />
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
        :item="item"
        :key="item.key"
        v-model="payload_filter[item.key]"
      >
        <template
          v-for="date_picker in [
            { key: 'from', placeholder: 'From date' },
            { key: 'to', placeholder: 'To date' }
          ]"
          :slot="date_picker.key"
        >
          <a-date-picker
            :key="date_picker.key"
            :placeholder="date_picker.placeholder"
            @change="
              moment => {
                payload_filter[date_picker.key] = moment.toDate().toISOString();
              }
            "
          />
        </template>
      </z-info-row>
    </z-filter-drawer>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import { getDate, getTxIDUrl } from "@/mixins";
import { GET_DEPOSITS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";
import { TradeController } from "@/controllers";

@Component({})
export default class Deposits extends Vue {
  loading = false;
  data: Deposit[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    from: "",
    to: "",
    email: "",
    currency: "",
    state: "",
    id: "",
    uid: "",
    txid: "",
    type: ""
  };
  getTxIDUrl = getTxIDUrl;

  COLUMN = [
    { title: "ID", key: "id", algin: "left" },
    { title: "Email", key: "email", algin: "left", scopedSlots: true },
    { title: "TxID", key: "txid", algin: "left", scopedSlots: true },
    { title: "Created At", key: "created_at", algin: "left" },
    { title: "Amount", key: "amount", algin: "left" },
    { title: "Currency", key: "currency", algin: "left" },
    { title: "Confirmations", key: "confirmations", algin: "left" },
    { title: "State", key: "state", algin: "right", scopedSlots: true },
    { title: "", key: "action", algin: "center", scopedSlots: true }
  ];

  get filter_list() {
    return [
      {
        title: "From date",
        key: "from",
        value: this.payload_filter.from,
        type: "slot",
        style: "width: 45%"
      },
      {
        title: "To date",
        key: "to",
        value: this.payload_filter.to,
        type: "slot",
        style: "width: 45%"
      },
      {
        title: "Email",
        key: "email",
        value: this.payload_filter.email,
        type: "input",
        edit: true
      },
      {
        title: "Currency",
        key: "currency",
        value: this.payload_filter.currency,
        type: "input",
        edit: true
      },
      {
        title: "State",
        key: "state",
        value: this.payload_filter.state,
        type: "input",
        edit: true
      },
      {
        title: "ID",
        key: "id",
        value: this.payload_filter.id,
        type: "input",
        edit: true
      },
      {
        title: "UID",
        key: "uid",
        value: this.payload_filter.uid,
        type: "input",
        edit: true
      },
      {
        title: "TxID",
        key: "txid",
        value: this.payload_filter.txid,
        type: "input",
        edit: true
      },
      {
        title: "Type",
        key: "type",
        value: this.payload_filter.type,
        type: "input",
        edit: true
      }
    ];
  }

  get deposits() {
    return this.data.map(deposit => {
      (deposit as any).created_at = getDate(deposit.created_at, true);
      deposit.currency = deposit.currency.toUpperCase();

      return deposit;
    });
  }

  mounted() {
    this.get_deposits();
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
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

  blockchain(key: string) {
    return TradeController.blockchains.find(
      blockchain => blockchain.key == key
    );
  }

  onDrawerReset() {
    for (const index in this.payload_filter) {
      this.payload_filter[index] = "";
    }
    (this.$refs.filter as any).remove();
  }

  onDrawerSubmit() {
    this.get_deposits();
    (this.$refs.filter as any).remove();
  }

  async get_deposits(payload = { limit: this.limit, page: this.page }) {
    this.loading = true;
    payload = Object.assign(payload, { ordering: "desc" });
    try {
      const { data, headers } = await store.dispatch(
        GET_DEPOSITS,
        Object.assign(payload, this.payload_filter)
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

  on_table_click(item: Deposit) {
    this.$router.push(`/accountings/deposits/${item.tid}/details`);
  }
}
</script>

<style lang="less">
@import "~@styles/views/accountings/deposits/base";
</style>
