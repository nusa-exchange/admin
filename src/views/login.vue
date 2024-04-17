<template>
  <z-content class="page-login">
    <logo-box />
    <form-box :loading="loading" ref="form-box" @submit="login" />
    <modal-otp ref="modal-otp" @submit="login" @cancel="need2fa = false" />
  </z-content>
</template>

<script lang="ts">
import ModalOTP from "@/layouts/modal/modal-otp.vue";
import { FormBox, LogoBox } from "@/layouts/login";
import { Vue, Component, Watch } from "vue-property-decorator";
import { UserController } from "@/controllers";

@Component({
  components: {
    "form-box": FormBox,
    "logo-box": LogoBox,
    "modal-otp": ModalOTP
  }
})
export default class App extends Vue {
  $refs!: {
    "form-box": FormBox;
    "modal-otp": ModalOTP;
  };

  get loading() {
    return UserController.state == "loading";
  }

  get email() {
    return this.$refs["form-box"].email;
  }

  get password() {
    return this.$refs["form-box"].password;
  }

  get captcha_response() {
    return this.$refs["form-box"].captcha_response;
  }

  get need2fa() {
    return UserController.need2fa;
  }

  set need2fa(value) {
    UserController.need2fa = value;
  }

  async login(otp_code = "") {
    await UserController.login({
        email: this.email,
        password: this.password,
        otp_code: otp_code,
        captcha_response: this.captcha_response
      },
      "/dashboard/analysis"
    );
  }

  @Watch("need2fa")
  onNeed2FAChanged(need2fa: boolean) {
    if (!need2fa) return;
    this.$refs["modal-otp"].create();
  }
}
</script>

<style lang="less">
@import "~@styles/views/login.less";
</style>
