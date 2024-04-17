<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-exchange"
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
export default class ModalExchange extends Mixins(ZModalMixin) {
  loading = false;
  modal_type?: ModalType = null;
  modal_payload: Quantex.Exchange = {};

  get title() {
    return this.modal_type === "update" ? "Update Exchange" : "Create Exchange";
  }

  get SETTING_LIST() {
    return [
      {
        title: "Name",
        key: "name",
        value: this.modal_payload?.name,
        type: "input",
        edit: true
      },
      {
        title: "Driver",
        key: "driver",
        value: this.modal_payload?.driver,
        type: "select",
        list: (() => {
          return QuantexController.drivers.data.reduce((obj, driver) => {
            return {
              ...obj,
              [driver]: driver.toUpperCase()
            };
          }, {});
        })()
      }
    ];
  }

  get button_disabled() {
    return this.loading;
  }

  get button_string() {
    return this.modal_type === "update" ? "Update" : "Create";
  }

  onCreate(payload: { type: ModalType; payload: Quantex.Exchange }) {
    this.modal_type = payload.type;
    if (this.modal_type == "update") {
      this.modal_payload = payload.payload;
    } else {
      this.modal_payload = {
        name: "",
        driver: ""
      };
    }
  }

  async onSubmit() {
    this.loading = true;
    const payload = {
      name: this.modal_payload.name,
      driver: this.modal_payload.driver
    };

    try {
      if (this.modal_type == "update") {
        await QuantexController.update_exchange(
          Object.assign(payload, { id: this.modal_payload.id })
        );
        runNotice("success", "Exchange update successfully");
      } else {
        await QuantexController.create_exchange(payload);
        runNotice("success", "Exchange created successfully");
      }
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
.modal-exchange {
  .ant-modal-body {
    button {
      margin-top: 12px;
      width: 100%;
    }
  }
}
</style>
