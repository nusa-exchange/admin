<template>
  <div class="page-accountings-adjustments">
    <z-table
      :loading="loading"
      :data="adjustments"
      :columns="COLUMN"
      :scroll="false"
      :pagination="true"
      :hover="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_adjustments"
      @click="on_table_click"
    >
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
import { GET_ADJUSTMENTS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Adjustments extends Vue {
  loading = false;
  data: Adjustment[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    from: "",
    to: "",
    currency: "",
    state: "",
    category: ""
  };

  COLUMN = [
    { title: "ID", key: "id", algin: "left" },
    { title: "Reason", key: "reason", algin: "left" },
    { title: "Amount", key: "amount", algin: "left" },
    { title: "Currency", key: "currency", algin: "left" },
    { title: "category", key: "category", algin: "left" },
    { title: "Creator UID", key: "creator_uid", algin: "left" },
    { title: "Receiving Account", key: "receiving_member_uid", algin: "left" },
    { title: "State", key: "state", algin: "left" },
    { title: "", key: "action", algin: "right", scopedSlots: true }
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
        title: "Category",
        key: "category",
        value: this.payload_filter.category,
        type: "input",
        edit: true
      }
    ];
  }

  get adjustments() {
    return this.data;
  }

  mounted() {
    this.get_adjustments();
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Add Adjustment",
        key: "add_fees_adjustment",
        icon: "plus-circle",
        callback: () => {
          this.$router.push("/accountings/adjustments/add");
        }
      },
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

  async get_adjustments(payload = { page: this.page, limit: this.limit }) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_ADJUSTMENTS,
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

  onDrawerReset() {
    for (const index in this.payload_filter) {
      this.payload_filter[index] = "";
    }
    (this.$refs.filter as any).remove();
  }

  onDrawerSubmit() {
    this.get_adjustments();
    (this.$refs.filter as any).remove();
  }

  on_table_click(item: Adjustment) {
    this.$router.push(`/accountings/adjustments/${item.id}`);
  }
}
</script>

<style lang="less">
@import "~@styles/views/accountings/adjustments/base";
</style>
