<template>
  <a-drawer
    wrapClassName="filter-drawer"
    placement="right"
    :visible="visible"
    @close="remove"
    :width="500"
  >
    <slot />
    <div class="action">
      <a-button style="marginRight: 8px" @click="reset">Reset All</a-button>
      <a-button type="primary" @click="submit">Apply Filters</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "z-info-row": () => import("@/components/z-info-row")
  }
})
export default class App extends Vue {
  visible = false;

  submit() {
    this.$emit("submit");
    this.remove();
  }

  reset() {
    this.$emit("reset");
  }

  create() {
    this.visible = true;
  }

  remove() {
    this.visible = false;
  }
}
</script>
