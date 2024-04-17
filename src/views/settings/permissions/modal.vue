<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-permission"
    :title="title"
    :width="width"
    :footer="false"
  >
    <z-info-row
      v-for="setting in SETTING_LIST"
      :key="setting.key"
      :item="setting"
      v-model="payload.item[setting.key]"
    />

    <a-button type="primary" @click="onSubmit">
      {{ button_string }}
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import { Component, Mixins } from "vue-property-decorator";

interface Payload {
  type: "edit" | "create";
  item: PayloadItem;
}

interface PayloadItem {
  id?: number;
  role: string;
  path: string;
  topic: string | null;
  verb: string;
  action: string;
}

@Component
export default class ModalPermission extends Mixins(ZModalMixin) {
  payload: Payload = {
    type: "create",
    item: {
      role: "",
      path: "",
      topic: "",
      verb: "",
      action: ""
    }
  };
  cache_edit: PayloadItem = this.payload.item;

  get title() {
    return this.payload?.type === "edit"
      ? "Edit permission"
      : "Create permission";
  }

  get SETTING_LIST() {
    return [
      {
        title: "Role",
        key: "role",
        value: this.cache_edit?.role,
        type: "input",
        edit: true
      },
      {
        title: "Path",
        key: "path",
        value: this.cache_edit?.path,
        type: "input",
        edit: true
      },
      {
        title: "Topic",
        key: "topic",
        value: this.cache_edit?.topic,
        type: "input",
        edit: true
      },
      {
        title: "Verb",
        key: "verb",
        value: this.cache_edit?.verb,
        type: "input",
        edit: true
      },
      {
        title: "Action",
        key: "action",
        value: this.cache_edit?.action,
        type: "input",
        edit: true
      }
    ];
  }

  get button_string() {
    return this.payload?.type === "edit" ? "Edit" : "Create";
  }

  onCreate(payload: Payload) {
    this.payload = payload;
    this.cache_edit = payload.item;
  }

  onSubmit() {
    this.$emit("submit", {
      type: this.payload?.type,
      item: this.cache_edit
    });
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/permissions/modal";
</style>
