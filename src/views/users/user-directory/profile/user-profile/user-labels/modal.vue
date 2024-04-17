<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-label"
    :title="title"
    :width="width"
    :footer="false"
  >
    <a-input
      v-model="cache_edit.key"
      placeholder="Key *"
      :disabled="payload.type === 'edit'"
    />
    <a-input v-model="cache_edit.value" placeholder="Value *" />

    <a-select v-model="cache_edit.scope">
      <a-select-option value="private">private</a-select-option>
      <a-select-option value="public">public</a-select-option>
    </a-select>

    <a-button
      type="primary"
      @click="$emit('submit', { type: payload.type, payload: cache_edit })"
      :disabled="button_disabled"
    >
      {{ title }}
    </a-button>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import ZModal from "@/layouts/z-modal.vue";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class ModalLabel extends Mixins(ZModalMixin) {
  $refs!: {
    modal: ZModal;
  };

  payload?: {
    type: "edit" | "create";
    key?: string;
    payload?: {
      key: string;
      value: string;
      scope: "private" | "public";
    };
  } = null;

  cache_edit = {
    key: "",
    value: "",
    scope: "private"
  };

  beforeMount() {
    this.reload_payload();
  }

  reload_payload() {
    this.payload = { type: "create" };
    this.cache_edit = {
      key: "",
      value: "",
      scope: "private"
    };
  }

  get button_disabled() {
    let allow = this.cache_edit.key !== "" && this.cache_edit.value !== "";
    if (this.payload.type === "edit") {
      if (!this.payload.payload) return false;
      allow = allow && this.cache_edit.key !== this.payload.payload.key;
      allow = allow || this.cache_edit.value !== this.payload.payload.value;
      allow = allow || this.cache_edit.scope !== this.payload.payload.scope;
    }
    return !allow;
  }

  get title() {
    return this.payload.type === "edit" ? "Edit label" : "Create label";
  }

  onCreate(payload) {
    this.payload = payload;
    if (!this.payload.payload) return;

    this.cache_edit.key = this.payload.payload.key;
    this.cache_edit.value = this.payload.payload.value;
    this.cache_edit.scope = this.payload.payload.scope;
  }

  onDelete() {
    this.$emit("cancel");
    this.reload_payload();
  }
}
</script>
