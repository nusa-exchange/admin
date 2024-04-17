<template>
  <div class="page-exchange-ieo">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="ieo_list"
      :hover="true"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_ieo_list"
      @click="on_table_click"
    >
    </z-table>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import { GET_IEO_LIST } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";
import moment from "moment";

@Component({})
export default class IEOPage extends Vue {
  loading = false;
  data: IEO[] = [];
  page = 1;
  limit = 50;

  get ieo_list() {
    return this.data.map(ieo => {
      ieo.currency_id = ieo.currency_id.toUpperCase();
      ieo.main_payment_currency = ieo.main_payment_currency.toUpperCase();
      ieo.start_time = moment.unix(ieo.start_time).format("YYYY-DD-MM") as any;
      ieo.end_time = moment.unix(ieo.end_time).format("YYYY-DD-MM") as any;

      return ieo;
    });
  }

  get COLUMN() {
    return [
      { title: "ID", key: "id", algin: "left" },
      { title: "Currency", key: "currency_id", algin: "left" },
      {
        title: "Main Payment Currency",
        key: "main_payment_currency",
        algin: "left"
      },
      { title: "Price", key: "price", algin: "left" },
      { title: "Min Amount", key: "min_amount", algin: "left" },
      { title: "Start Time", key: "start_time", algin: "left" },
      { title: "End Time", key: "end_time", algin: "left" },
    ];
  }

  mounted() {
    this.get_ieo_list();
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Create IEO",
        key: "create_ieo",
        icon: "plus-circle",
        callback: () => {
          this.$router.push("/exchange/ieo/create");
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  on_table_click(item: IEO) {
    this.$router.push("/exchange/ieo/" + item.id);
  }

  async get_ieo_list(payload = { page: this.page, limit: this.limit }) {
    this.loading = true;
    try {
      const { data } = await store.dispatch(GET_IEO_LIST, payload);
      this.data = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
