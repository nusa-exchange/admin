<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-market"
    :title="title"
    :width="width"
    :footer="false"
  >
    <z-info-row
      v-for="setting in SETTING_LIST"
      :key="setting.key"
      :item="setting"
      v-model="modal_payload[setting.key]"
    />

    <a-button
      type="primary"
      :loading="loading"
      :disabled="button_disabled"
      @click="onSubmit"
    >
      {{ button_string }}
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import { QuantexController } from "@/controllers";
import { runNotice } from "@/mixins";
import ZModalMixin from "@/mixins/z-modal";
import { Component, Mixins } from "vue-property-decorator";

type ModalType = "update" | "create";

@Component
export default class ModalMarket extends Mixins(ZModalMixin) {
  loading = false;
  modal_type?: ModalType = null;
  modal_payload: Quantex.Market = {};

  get title() {
    return this.modal_type === "update" ? "Update Exchange" : "Create Exchange";
  }

  get SETTING_LIST() {
    return [
      {
        title: "Symbol",
        key: "symbol",
        value: (
          this.modal_payload?.ask +
          "/" +
          this.modal_payload?.bid
        ).toUpperCase(),
        type: "input",
        edit: false
      },
      {
        title: "Ask",
        key: "ask",
        value: this.modal_payload?.ask,
        type: "input",
        edit: true
      },
      {
        title: "Bid",
        key: "bid",
        value: this.modal_payload?.bid,
        type: "input",
        edit: true
      },
      {
        title: "Exchange",
        key: "exchange_id",
        value: this.modal_payload.exchange_id,
        type: "select",
        list: (() => {
          return QuantexController.exchanges.data.reduce((obj, exchange) => {
            return {
              ...obj,
              [exchange["id"]]: exchange.name
            };
          }, {});
        })()
      },
      {
        title: "Min Amount",
        key: "min_amount",
        value: this.modal_payload?.min_amount,
        type: "input",
        edit: true
      },
      {
        title: "Max amount",
        key: "max_amount",
        value: this.modal_payload?.max_amount,
        type: "input",
        edit: true
      },
      {
        title: "Price Precision",
        key: "price_precision",
        value: this.modal_payload?.price_precision,
        type: "input",
        edit: true
      },
      {
        title: "Amount Precision",
        key: "amount_precision",
        value: this.modal_payload?.amount_precision,
        type: "input",
        edit: true
      }
    ].filter(item => {
      if (item.key == "ask" && this.modal_type == "update") return false;
      if (item.key == "bid" && this.modal_type == "update") return false;

      return true;
    });
  }

  get button_disabled() {
    return this.loading;
  }

  get button_string() {
    return this.modal_type === "update" ? "Update" : "Create";
  }

  onCreate(payload: {
    type: ModalType;
    payload: Quantex.Market;
    exchanges: Quantex.Exchange[];
  }) {
    this.modal_type = payload.type;
    if (this.modal_type == "update") {
      this.modal_payload = payload.payload;
    } else {
      this.modal_payload = {
        ask: "",
        bid: "",
        exchange_id: null,
        min_amount: null,
        max_amount: null,
        price_precision: null,
        amount_precision: null
      };
    }
  }

  async onSubmit() {
    this.loading = true;
    let payload = {
      exchange_id: Number(this.modal_payload.exchange_id),
      min_amount: this.modal_payload.min_amount,
      max_amount: this.modal_payload.max_amount,
      price_precision: Number(this.modal_payload.price_precision),
      amount_precision: Number(this.modal_payload.amount_precision)
    };

    try {
      if (this.modal_type == "update") {
        await QuantexController.update_market(
          Object.assign(payload, { id: this.modal_payload.id })
        );
        runNotice("success", "Market update successfully");
      } else {
        payload = Object.assign(payload, {
          ask: this.modal_payload.ask,
          bid: this.modal_payload.bid
        });
        await QuantexController.create_market(payload);
        runNotice("success", "Market created successfully");
      }
      this.$emit("updated");
      this.delete();
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="less">
.modal-market {
  .ant-modal-body {
    button {
      margin-top: 12px;
      width: 100%;
    }
  }
}
</style>
