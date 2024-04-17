<template>
  <div class="page-dashboard-users user-profile">
    <user-static class="left-panel" :user_info="user_info" />
    <div class="right-panel">
      <user-level :user_info="user_info" />
      <user-setting :user_info="user_info" :member_info="member_info" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "user-static": () => import("./user-static/base.vue"),
    "user-level": () => import("./user-level/base.vue"),
    "user-setting": () => import("./user-setting/base.vue")
  }
})
export default class App extends Vue {
  @Prop() readonly user_info?: User;
  @Prop({ default: null }) readonly member_info?: Member;
}
</script>
