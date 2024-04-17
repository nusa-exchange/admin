<template>
  <a-modal
    :visible="modal_enabled"
    :footer="null"
    :width="width"
    :title="title"
    :closable="true"
    :wrap-class-name="wrapClassName"
    @cancel="$emit('cancel')"
  >
    <slot />
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ZModal extends Vue {
  @Prop() readonly title!: string;
  @Prop({ default: 400 }) readonly width!: number;
  @Prop() readonly wrapClassName!: string;
}
</script>
