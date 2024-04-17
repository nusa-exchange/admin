<template>
  <z-table
    class="trades"
    :loading="loading"
    :columns="columns"
    :data="trades"
    :scroll="false"
    :pagination="true"
    :page="page"
    :page-size="pageSize"
    @change-pagination="change_pagination"
  >
    <template
      v-for="key in [
        'maker_order_email',
        'taker_order_email',
        'maker_uid',
        'taker_uid'
      ]"
      :slot="key"
      slot-scope="{ item, column }"
    >
      <router-link
        :key="key"
        :class="[key, `text-${column.algin}`]"
        :to="
          `/users/user-directory/${
            ['maker_order_email', 'maker_uid'].includes(key)
              ? item.maker_uid
              : item.taker_uid
          }`
        "
      >
        {{ item[key] }}
      </router-link>
    </template>
    <template slot="taker_type" slot-scope="{ item, column }">
      <span
        :class="[
          'taker_type',
          `text-${column.algin}`,
          `text-${item.taker_type === 'buy' ? 'up' : 'down'}`
        ]"
      >
        {{ item.taker_type }}
      </span>
    </template>
  </z-table>
</template>

<script lang="ts">
import { getDate } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TradesComponent extends Vue {
  @Prop({ default: false }) readonly loading: boolean;
  @Prop({ default: () => [] }) readonly data: UserTrade[];
  @Prop({ default: 0 }) readonly total: number;
  @Prop({ default: 1 }) readonly page: number;
  @Prop({ default: 50 }) readonly pageSize: number;
  @Prop({ default: () => [] }) readonly disabled_columns!: string[];

  get columns() {
    return [
      { title: "Trade ID", key: "id", algin: "left" },
      {
        title: "Marker order email",
        key: "maker_order_email",
        algin: "left",
        scopedSlots: true
      },
      {
        title: "Taker order email",
        key: "taker_order_email",
        algin: "left",
        scopedSlots: true
      },
      {
        title: "Marker UID",
        key: "maker_uid",
        algin: "left",
        scopedSlots: true
      },
      {
        title: "Taker UID",
        key: "taker_uid",
        algin: "left",
        scopedSlots: true
      },
      { title: "Market", key: "market", algin: "left" },
      { title: "Price", key: "price", algin: "left" },
      { title: "Amount", key: "amount", algin: "left" },
      { title: "Total", key: "total", algin: "left" },
      { title: "Side", key: "taker_type", algin: "left", scopedSlots: true },
      { title: "Trade time", key: "created_at", algin: "left" }
    ];
  }

  get trades() {
    return this.data.map(trade => {
      trade.market = trade.market.toUpperCase();
      (trade as any).created_at = getDate(trade.created_at as Date, true);

      return trade;
    });
  }

  change_pagination(payload) {
    this.$emit("change-pagination", payload);
  }
}
</script>

<style lang="less">
.trades {
  .id {
    flex: 0.75;
  }

  .maker_order_email,
  .taker_order_email {
    flex: 1.25;
  }

  .side {
    flex: 0.75;
  }

  .created_at {
    flex: 1;
  }

  .z-table-row {
    .maker_order_email,
    .taker_order_email,
    .maker_uid,
    .taker_uid {
      color: inherit;
      &:hover {
        text-decoration: underline;
      }
    }

    .taker_type {
      text-transform: capitalize;
    }
  }
}
</style>
