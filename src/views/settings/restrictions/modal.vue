<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-restriction"
    :title="title"
    :width="width"
    :footer="false"
  >
    <z-info-row
      v-for="setting in SETTING_LIST"
      :key="setting.key"
      :item="setting"
      @input="value => set_cache_value(setting.key, value)"
    />

    <a-button type="primary" :disabled="button_disabled" @click="onSubmit">
      {{ button_string() }}
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import { Component, Mixins } from "vue-property-decorator";

interface Payload {
  type: "edit" | "create";
  item: Restriction;
}

@Component
export default class ModalRestriction extends Mixins(ZModalMixin) {
  payload: Payload = {
    type: "create",
    item: {
      category: "",
      scope: "",
      value: "",
      code: "",
      state: ""
    }
  };
  cache_edit?: Restriction = this.payload.item;

  get title() {
    return this.payload?.type === "edit"
      ? "Edit permission"
      : "Create permission";
  }

  get button_disabled() {
    const diff_object = this.diff_object(this.payload?.item, this.cache_edit, [
      "scope",
      "value",
      "state"
    ]);
    const value_exists = this.value_exists(this.cache_edit, [
      "scope",
      "value",
      "state"
    ]);

    return diff_object || !value_exists;
  }

  diff_object(source, target, keys: string[]) {
    const map_diff = keys.map(key => source[key] === target[key]);

    return map_diff.reduce((a, b) => a && b, true);
  }

  value_exists(object, keys: string[]) {
    const map_exists = keys.map(key => !!object[key]);

    return map_exists.reduce((a, b) => a && b, true);
  }

  get SETTING_LIST() {
    return [
      {
        title: "Scope",
        key: "scope",
        value: this.cache_edit?.scope,
        type: "select",
        list: {
          ip: "ip",
          ip_subnet: "ip_subnet",
          country: "country"
        }
      },
      {
        title: "Value",
        key: "value",
        value: this.cache_edit?.value,
        type: "input",
        edit: true
      },
      {
        title: "State",
        key: "state",
        value: this.cache_edit?.state,
        type: "select",
        list: {
          enabled: "enabled",
          disabled: "disabled"
        }
      }
    ];
  }

  button_string() {
    return this.payload?.type === "edit" ? "Edit" : "Create";
  }

  set_cache_value(key: string, value: string) {
    (this.cache_edit as any)[key] = value;
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  onCreate(payload: Payload) {
    this.payload = payload;
    this.cache_edit = payload.item;
  }

  private onSubmit() {
    this.$emit("submit", {
      type: this.payload?.type,
      item: this.cache_edit
    });
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/restrictions/modal";
</style>
