<template>
  <div class="user-level">
    <div class="user-level-head">
      <div class="title">Level: {{ level }}</div>
    </div>
    <div class="user-level-content">
      <z-info-row
        v-for="setting in LABEL_LIST"
        :key="setting.key"
        :item="setting"
      >
        <template :slot="setting.key">
          <a-switch
            :checked="setting.value"
            @change="
              onUserLabelChange({ key: setting.key, value: !setting.value })
            "
          />
        </template>
      </z-info-row>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import {
  CREATE_USER_LABEL,
  DELETE_USER_LABEL
} from "@/store/modules/admin/action-types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  loading = -1;
  @Prop() readonly user_info!: User;

  get LABEL_LIST() {
    return [
      {
        key: "email",
        title: "Email verification",
        desc: "Confirm the email",
        value: !!this.labels.find(
          record => record.key === "email" && record.value === "verified"
        ),
        style: "justify-content: space-between;display: flex;flex-wrap: wrap",
        style_content: "margin: auto 0",
        type: "slot"
      },
      {
        key: "phone",
        title: "Phone verification",
        desc: "Confirm the phone",
        value: !!this.labels.find(
          record => record.key === "phone" && record.value === "verified"
        ),
        style: "justify-content: space-between;display: flex;flex-wrap: wrap",
        style_content: "margin: auto 0",
        type: "slot"
      },
      {
        key: "profile",
        title: "Residence verification",
        desc: "Confirm the profile",
        value: !!this.labels.find(
          record => record.key === "profile" && record.value === "verified"
        ),
        style: "justify-content: space-between;display: flex;flex-wrap: wrap",
        style_content: "margin: auto 0",
        type: "slot"
      },
      {
        key: "document",
        title: "Residence verification",
        desc: "Confirm the document",
        value: !!this.labels.find(
          record => record.key === "document" && record.value === "verified"
        ),
        style: "justify-content: space-between;display: flex;flex-wrap: wrap",
        style_content: "margin: auto 0",
        type: "slot"
      }
    ];
  }

  get level() {
    return this.user_info?.level;
  }

  get labels() {
    return this.user_info?.labels || [];
  }

  async delete_label() {
    return;
  }

  async onUserLabelChange(payload: { key: string; value: boolean }) {
    const index = this.LABEL_LIST.findIndex(
      record => record.key === payload.key
    );
    this.loading = index;

    await store.dispatch(
      payload.value ? CREATE_USER_LABEL : DELETE_USER_LABEL,
      {
        uid: this.user_info?.uid,
        key: payload.key,
        scope: "private",
        value: payload.value ? "verified" : null
      }
    );
    this.loading = -1;
  }
}
</script>
