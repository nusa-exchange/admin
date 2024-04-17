<template>
  <div class="page-accountings-withdrawals">
    <withdrawals-table
      :loading="loading"
      :data="withdrawals"
      :page="page"
      :limit="limit"
      :load-data="get_withdrawals"
      @click="on_table_click"
    />

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
import { getDate } from "@/mixins";
import { GET_WITHDRAWS } from "@/store/types";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {
    "withdrawals-table": () => import("./table.vue")
  }
})
export default class Withdrawals extends Vue {
  loading = false;
  data: Withdraw[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    from: "",
    to: "",
    state: "",
    account: "",
    id: "",
    txid: "",
    rid: "",
    uid: "",
    currency: ""
  };

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
        title: "Account",
        key: "account",
        value: this.payload_filter.account,
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
        title: "TxID",
        key: "txid",
        value: this.payload_filter.txid,
        type: "input",
        edit: true
      },
      {
        title: "Recipient Address",
        key: "rid",
        value: this.payload_filter.rid,
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
        title: "Currency",
        key: "currency",
        value: this.payload_filter.currency,
        type: "input",
        edit: true
      }
    ];
  }

  get page_type() {
    return this.$route.meta.page_type;
  }

  get withdrawals() {
    return this.data.map(withdraw => {
      withdraw.currency = withdraw.currency.toUpperCase();
      (withdraw as any).created_at = getDate(withdraw.created_at, true);

      return withdraw;
    });
  }

  mounted() {
    this.get_withdrawals();
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

  async get_withdrawals(payload = { limit: this.limit, page: this.page }) {
    payload = Object.assign(payload, { ordering: "desc" });
    if (this.page_type === "pending") {
      payload = Object.assign(payload, { state: "errored" });
    }
    payload = Object.assign(payload, this.payload_filter);
    if (this.page_type == "pending") {
      payload = Object.assign(payload, {
        url_extend:
          "state[]=accepted&state[]=errored&state[]=skipped&state[]=confirming"
      });
    }

    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(GET_WITHDRAWS, payload);

      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
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
    this.get_withdrawals();
    (this.$refs.filter as any).remove();
  }

  on_table_click(item: Withdraw) {
    const url_path_prefix =
      this.page_type === "pending" ? "withdrawals-pending" : "withdrawals";
    this.$router.push(`/accountings/${url_path_prefix}/${item.id}/details`);
  }

  @Watch("page_type")
  onPageTypeChanged() {
    this.data = [];
    this.get_withdrawals();
  }
}
</script>
