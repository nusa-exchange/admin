<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-fee-schedule"
    :title="title"
    :width="width"
    :footer="false"
  >
    <z-info-row
      v-for="setting in SETTING_LIST()"
      :key="setting.key"
      :item="setting"
      v-model="payload.item[setting.key]"
    />

    <a-button type="primary" @click="onSubmit">
      Submit
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import { Component, Prop, Mixins } from "vue-property-decorator";

interface Payload {
  type: "edit" | "create";
  item: PayloadItem;
}

interface PayloadItem {
  id?: number;
  group: string;
  market_id: string;
  maker: string;
  taker: string;
}

@Component
export default class ModalFeeSchedule extends Mixins(ZModalMixin) {
  @Prop() readonly markets!: Market[];

  protected payload: Payload = {
    type: "create",
    item: {
      group: "",
      maker: "",
      market_id: "",
      taker: ""
    }
  };

  get title() {
    return this.payload?.type === "edit"
      ? "Edit fees schedule"
      : "Create fees schedule";
  }

  SETTING_LIST() {
    return [
      {
        title: "Name",
        key: "group",
        value: this.payload.item?.group,
        type: "input",
        edit: true
      },
      {
        title: "Market ID",
        key: "market_id",
        value: this.payload.item?.market_id,
        type: "select",
        list: {
          any: "ANY",
          ...this.markets.reduce(
            (a, b) => ((a[b.id] = b.name.toUpperCase()), a),
            {}
          )
        }
      },
      {
        title: "Maker Fee",
        key: "maker",
        value: this.payload.item?.maker,
        type: "input",
        edit: true
      },
      {
        title: "Taker Fee",
        key: "taker",
        value: this.payload.item?.taker,
        type: "input",
        edit: true
      }
    ];
  }

  onCreate(payload: Payload) {
    this.payload = payload;
  }

  private onSubmit() {
    this.$emit("submit", {
      type: this.payload?.type,
      item: this.payload.item
    });
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/fees-schedules/modal";
</style>
