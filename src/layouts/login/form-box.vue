<template>
  <form class="page-login-form-box" @submit.prevent="login">
    <auth-input v-model="email" placeholder="Email">
      <template v-slot:prefix>
        <a-icon type="user" />
      </template>
    </auth-input>
    <auth-input v-model="password" type="password" placeholder="Password">
      <template v-slot:prefix>
        <a-icon type="lock" />
      </template>
    </auth-input>

    <auth-button type="submit" :loading="loading" :disabled="button_disabled">
      Login
    </auth-button>
  </form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/auth-input.vue")
  }
})
export default class App extends Vue {
  @Prop() readonly loading!: boolean;

  email = "";
  password = "";
  captcha_response = "";

  get button_disabled() {
    if (!this.email) return true;
    if (!this.password) return true;

    return false;
  }

  login() {
    this.$emit("submit");
  }
}
</script>
