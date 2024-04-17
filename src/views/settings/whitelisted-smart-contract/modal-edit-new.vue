<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-smart-contract"
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
import { runNotice } from "@/mixins";
import ZModalMixin from "@/mixins/z-modal";
import store from "@/store";
import {
  CREATE_WHITELISTED_SMART_CONTRACT,
  UPDATE_WHITELISTED_SMART_CONTRACT
} from "@/store/types";
import { Component, Mixins } from "vue-property-decorator";

type ModalType = "edit" | "new";

@Component
export default class ModalSmartContract extends Mixins(ZModalMixin) {
  loading = false;
  modal_type?: ModalType = null;
  modal_payload: SmartContract = {};
  blockchains: Blockchain[] = [];

  get title() {
    return this.modal_type === "edit"
      ? "Edit Smart Contract"
      : "Create Smart Contract";
  }

  get SETTING_LIST() {
    return [
      {
        title: "Title",
        key: "description",
        value: this.modal_payload?.description,
        type: "input",
        edit: true
      },
      {
        title: "Address",
        key: "address",
        value: this.modal_payload?.address,
        type: "input",
        edit: true
      },
      {
        title: "Blockchain",
        key: "blockchain_key",
        value: this.modal_payload?.blockchain_key,
        type: "select",
        list: (() => {
          return this.blockchains.reduce((obj, blockchain) => {
            return {
              ...obj,
              [blockchain["key"]]: blockchain.name
            };
          }, {});
        })()
      },
      {
        title: "Status",
        key: "state",
        value: this.modal_payload?.state,
        type: "select",
        list: {
          active: "Active",
          disabled: "Disabled"
        }
      }
    ];
  }

  get button_disabled() {
    return this.loading;
  }

  get button_string() {
    return this.modal_type === "edit" ? "Edit" : "Create";
  }

  onCreate(payload: {
    type: ModalType;
    payload: SmartContract;
    blockchains: Blockchain[];
  }) {
    this.modal_type = payload.type;
    if (this.modal_type == "edit") {
      this.modal_payload = payload.payload;
    } else {
      this.modal_payload = {
        description: null,
        address: null,
        blockchain_key: null,
        state: "active"
      };
    }
    this.blockchains = payload.blockchains;
  }

  async onSubmit() {
    this.loading = true;
    let payload = {
      description: this.modal_payload.description,
      address: this.modal_payload.address,
      blockchain_key: this.modal_payload.blockchain_key,
      state: this.modal_payload.state
    };

    if (this.modal_type == "edit") {
      payload = Object.assign(payload, { id: this.modal_payload.id });
    }

    try {
      await store.dispatch(
        this.modal_type == "edit"
          ? UPDATE_WHITELISTED_SMART_CONTRACT
          : CREATE_WHITELISTED_SMART_CONTRACT,
        payload
      );
      runNotice(
        "success",
        this.modal_type == "edit"
          ? "Smart Contract updated successfully"
          : "Smart Contract created successfully"
      );
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
.modal-smart-contract {
  .ant-modal-body {
    button {
      margin-top: 12px;
      width: 100%;
    }
  }
}
</style>
