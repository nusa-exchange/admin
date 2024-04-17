<template>
  <div>
    <orders
      type="history"
      :loading="loading"
      :data="data"
      :page="page"
      :page-size="limit"
      @change-pagination="get_orders"
    />

    <z-filter-drawer
      ref="filter"
      @reset="onDrawerReset"
      @submit="onFilterSubmit"
    >
      <z-info-row
        v-for="item in filter_list"
        v-model="payload_filter[item.key]"
        :ref="`z-info-row-${item.key}`"
        :item="item"
        :key="item.key"
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
import ZSmartModel from "@zsmartex/z-eventbus";
import { jsonToCSV, saveFile } from "@/mixins";
import store from "@/store";
import { GET_ORDERS } from "@/store/types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    orders: () => import("@/layouts/orders")
  }
})
export default class App extends Vue {
  @Prop() readonly markets!: { [key: string]: string };

  loading = false;
  data: UserOrder[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    market: "",
    ord_type: "", //type
    price: "",
    origin_volume: "",
    type: "", //side
    email: "",
    uid: "",
    from: "",
    to: ""
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
        title: "Market",
        key: "market",
        value: this.payload_filter.market,
        type: "select",
        list: this.markets
      },
      {
        title: "Order type",
        key: "ord_type",
        value: this.payload_filter.ord_type,
        type: "input",
        edit: true
      },
      {
        title: "Price",
        key: "price",
        value: this.payload_filter.price,
        type: "input",
        edit: true
      },
      {
        title: "Amount",
        key: "origin_volume",
        value: this.payload_filter.origin_volume,
        type: "input",
        edit: true
      },
      {
        title: "Side",
        key: "type",
        value: this.payload_filter.type,
        type: "input",
        edit: true
      },
      {
        title: "Email",
        key: "email",
        value: this.payload_filter.type,
        type: "input",
        edit: true
      },
      {
        title: "UID",
        key: "uid",
        value: this.payload_filter.uid,
        type: "input",
        edit: true
      }
    ];
  }

  mounted() {
    this.get_orders();
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
      },
      {
        title: "Export",
        key: "export",
        icon: "file-zip",
        callback: async () => {
          const csvString = await jsonToCSV(
            this.data.map(order => {
              return order;
            })
          );
          saveFile(csvString, "orders.csv", {
            type: "text/csv;charset=utf-8;"
          });
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  async get_orders(
    payload = {
      page: this.page,
      limit: this.limit
    }
  ) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_ORDERS,
        Object.assign(
          Object.assign(
            {
              order_by: "desc"
            },
            payload
          ),
          this.payload_filter
        )
      );
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
  }

  onFilterSubmit() {
    this.get_orders();
  }
}
</script>
