<template>
  <div class="z-configuration">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() readonly setting!: {
    "two-panel": boolean;
  };
}
</script>
