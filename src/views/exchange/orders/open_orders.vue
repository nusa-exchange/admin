<template>
  <div>
    <orders
      type="open"
      :loading="loading"
      :data="data"
      :page="page"
      :page-size="limit"
      @change-pagination="get_orders"
    />

    <modal-cancel-orders
      ref="modal-cancel-orders"
      :markets="markets"
      @submit="onModalSubmit"
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
import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import { GET_ORDERS, CANCEL_ORDERS } from "@/store/types";
import { runNotice, jsonToCSV, saveFile } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    orders: () => import("@/layouts/orders"),
    "modal-cancel-orders": () => import("./modal_cancel_orders.vue")
  }
})
export default class OpenOrders extends Vue {
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
    this.set_action_header();
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Cancel Orders",
        icon: "close-circle",
        key: "cancel_orders",
        callback: () => {
          (this.$refs["modal-cancel-orders"] as any).create();
        }
      },
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
              state: "wait",
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

  onModalSubmit(market: string) {
    this.cancel_orders(market);
  }

  async cancel_orders(market: string) {
    try {
      await store.dispatch(CANCEL_ORDERS, market);

      (this.$refs["modal-cancel-orders"] as any).delete();
      runNotice(
        "success",
        `All orders from market ${this.markets[market]} have been canceled`
      );
      this.get_orders();
    } catch (error) {
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
