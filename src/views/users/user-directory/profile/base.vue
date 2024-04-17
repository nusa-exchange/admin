<template>
  <div class="page-user-directory profile">
    <a-tabs
      class="profile-content"
      :activeKey="active_tab_key"
      @change="onTabsChange"
    >
      <a-tab-pane tab="User profile" key="1">
        <div class="profile-container">
          <user-info :user_info="user_info" :member_info="member" />
          <user-labels :user_info="user_info" />
        </div>
      </a-tab-pane>
      <a-tab-pane tab="KYC" key="2">
        <user-kyc :user_info="user_info" />
      </a-tab-pane>
      <a-tab-pane tab="Balance" key="3">
        <user-balance :member_info="member" />
      </a-tab-pane>
      <a-tab-pane tab="Open orders" key="4">
        <open-orders :user_info="user_info" />
      </a-tab-pane>
      <a-tab-pane tab="History" key="5">
        <user-history :user_info="user_info" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { GET_USER_INFO, GET_MEMBER } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "user-kyc": () => import("./kyc/base.vue"),
    "user-balance": () => import("./user-balance/base.vue"),
    "user-info": () => import("./user-profile/user-info/base.vue"),
    "user-labels": () => import("./user-profile/user-labels/base.vue"),
    "open-orders": () => import("./open-orders/base.vue"),
    "user-history": () => import("./history/base.vue")
  }
})
export default class App extends Vue {
  loading = false;
  active_tab_key = "1";
  member?: Member = null;

  beforeMount() {
    this.get_user_info();
  }

  get UID() {
    return this.$route.params.uid;
  }

  get user_info() {
    return store.state.admin.user_info;
  }

  async get_user_info() {
    const { UID } = this;

    this.loading = true;
    await store.dispatch(GET_USER_INFO, UID);
    await this.get_member();
    this.loading = false;
  }

  async get_member() {
    try {
      const { data } = await store.dispatch(GET_MEMBER, this.UID);

      this.member = data;
    } catch (error) {
      return error;
    }
  }

  onTabsChange(activeKey: string) {
    if (this.loading) return;

    this.active_tab_key = activeKey;
  }
}
</script>

<style lang="less">
@import "~@styles/views/users/user-directory/base";
@import "~@styles/views/users/user-directory/profile";
</style>
