<template>
  <div class="page-user user-kyc">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="Profile" key="1">
        <profiles-table :user_info="user_info" />
      </a-tab-pane>
      <a-tab-pane tab="Document" key="2">
        <documents-table :user_info="user_info" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "profiles-table": () => import("./profiles-table.vue"),
    "documents-table": () => import("./documents-table.vue")
  }
})
export default class UserDirectoryKYC extends Vue {
  @Prop() readonly user_info!: User;
}
</script>

<style lang="less">
@import "~@styles/views/users/user-directory/kyc";
</style>
