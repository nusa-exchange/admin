<template>
  <div class="auth-input" :class="{ 'has-error': isError }">
    <div class="ant-input-affix-wrapper">
      <a-input-password
        v-if="input_type === 'password'"
        :value="value"
        :type="input_type"
        :placeholder="placeholder"
        :max-length="Number(maxlength)"
        ref="input"
        @input="onInputChange"
      >
        <slot slot="prefix" name="prefix" />
      </a-input-password>
      <a-input
        v-else
        :value="value"
        :type="input_type"
        :placeholder="placeholder"
        :max-length="Number(maxlength)"
        ref="input"
        @input="onInputChange"
      >
        <slot slot="prefix" name="prefix" />
      </a-input>
    </div>
    <div v-if="isError" class="ant-form-explain">
      Please input your Password!
    </div>
  </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuthInput extends Vue {
  @Prop() readonly type!: string;
  @Prop() readonly placeholder!: string;
  @Prop() readonly value!: string | number;
  @Prop() readonly maxlength!: string | number;
  @Prop() readonly isError!: boolean;

  get input_type() {
    return this.type === "number" ? "text" : this.type;
  }

  onInputChange(event) {
    let value: string = event.target.value;

    if (this.type === "number") {
      value = value.replace(/[^\d]/, "");
    }
    if (this.maxlength) {
      value = value.substring(0, Number(this.maxlength));
    }

    this.$emit("input", value);
  }
}
</script>

<style lang="less">
.auth-input {
  input {
    height: 50px;
    width: 100%;
    padding: 0 20px;
    font-size: 14px;
    z-index: 1;
    border-radius: 0;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      box-shadow: 0 0 0 1000px var(--bg-color) inset !important;
      -webkit-text-fill-color: var(--text-color) !important;
    }
  }
}
</style>
