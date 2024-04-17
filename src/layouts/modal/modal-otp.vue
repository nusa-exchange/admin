<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-otp"
    title=""
    :width="width"
    :footer="false"
  >
    <img src="@/assets/img/example_modal_logo.jpg" class="ant-modal-logo" />
    <div class="ant-modal-title">
      OTP Code
    </div>
    <div class="ant-modal-desc">
      Enter the authentication code from the app below.
    </div>
    <form class="ant-modal-form" @submit.prevent="sendData">
      <auth-input
        v-model="otp_code"
        maxlength="6"
        type="number"
        placeholder="2FA Code"
      />
      <auth-button type="submit">Submit</auth-button>
    </form>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import { Component, Mixins, Watch } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/auth-input.vue")
  }
})
export default class ModalOTP extends Mixins(ZModalMixin) {
  otp_code = "";

  public sendData() {
    this.$emit("submit", this.otp_code);
  }

  @Watch("otp_code")
  onOtpCodeChanged(otp_code: string) {
    if (otp_code.length === 6) {
      this.sendData();
    }
  }

  onDelete() {
    this.otp_code = "";
    this.$emit("cancel");
  }
}
</script>

<style lang="less">
.ant-modal {
  &-logo {
    width: 100px;
    height: 100px;
    display: block;
    margin: 16px auto 45px;
  }

  &-title {
    padding-left: 15px;
    font-size: 28px;
    height: 30px;
    line-height: 30px;
    background-size: auto 30px;
    margin-bottom: 0.5em;
    text-align: center;
  }

  &-desc {
    line-height: 24px;
    font-size: 16px;
    text-align: center;
  }

  &-wrap form {
    margin-top: 24px;
    margin-bottom: 32px;
  }

  button {
    margin-top: 12px;
  }
}
</style>
