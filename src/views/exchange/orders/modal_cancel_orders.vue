<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-cancel-orders"
    title="Cancel orders"
    :width="width"
    :footer="false"
  >
    <z-info-row
      v-model="market"
      :item="{
        title: 'Market',
        key: 'market',
        value: market,
        type: 'select',
        list: markets
      }"
    />

    <a-button type="primary" :disabled="button_disabled" @click="onSubmit">
      {{ button_text }}
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";

@Component
export default class ModalCancelOrders extends Mixins(ZModalMixin) {
  @Prop() readonly markets!: { [key: string]: string };

  market = "";

  get button_disabled() {
    return !this.market.length;
  }

  get button_text() {
    return "Cancel All Orders";
  }

  onSubmit() {
    this.$emit("submit", this.market);
  }

  @Watch("modal_enabled")
  onModalEnabledChanged() {
    this.market = "";
  }
}
</script>
