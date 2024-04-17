<template>
  <div class="user-info">
    <div class="user-info-head">
      <div class="title">
        <div class="email">{{ email }}</div>
        <div class="last-activity">
          Last activity: {{ getDate(updated_at) }}
        </div>
      </div>
      <div class="action">
        <a-button type="primary" @click="start_edit">
          {{ edit ? "Save" : "Edit" }}
        </a-button>
      </div>
    </div>
    <div class="user-info-content">
      <z-info-row
        v-for="setting in INFO_LIST"
        :key="setting.key"
        :item="setting"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getDate } from "@/mixins";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() readonly user_info!: User;

  edit = false;

  get INFO_LIST() {
    return [
      {
        title: "UID",
        key: "uid",
        value: this.user_info?.uid,
        style: "width: 45%",
        type: "input",
        edit: false
      },
      {
        title: "Created at",
        key: "created_at",
        value: this.getDate(this.user_info?.created_at as Date),
        style: "width: 45%",
        type: "input",
        edit: false
      }
    ];
  }

  get email() {
    return this.user_info?.email;
  }

  get updated_at() {
    return this.user_info?.updated_at;
  }

  start_edit() {
    this.edit = !this.edit;
  }

  getDate(date: Date) {
    return getDate(date, true);
  }
}
</script>
