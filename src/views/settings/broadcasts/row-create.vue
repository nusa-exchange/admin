<template>
  <fragment>
    <span class="id text-left">AUTO</span>
    <span class="state">PENDING</span>
    <span class="title text-left">
      <a-textarea v-model="title" placeholder="Title" auto-size />
    </span>
    <span class="url text-left">
      <a-textarea v-model="url" placeholder="URL" auto-size />
    </span>
    <span class="action text-center">
      <a-button
        type="primary"
        @click="create_broadcast"
        :disabled="button_disabled"
      >
        Create
      </a-button>
    </span>
  </fragment>
</template>

<script lang="ts">
import { isValidUrl } from "@/mixins";
import store from "@/store";
import { CREATE_BROADCAST } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class RowCreate extends Vue {
  title = "";
  url = "";

  get url_error() {
    if (!this.url.length) return null;

    return isValidUrl(this.url) ? null : "This link is not valid";
  }

  get button_disabled() {
    return !(this.title && this.url && this.url_error == null);
  }

  async create_broadcast() {
    try {
      await store.dispatch(CREATE_BROADCAST, { title: this.title, url: this.url });

      this.$emit("created");
    } catch (error) {
      return error;
    }
  }
}
</script>
