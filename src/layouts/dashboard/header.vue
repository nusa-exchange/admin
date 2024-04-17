<template>
  <header class="page-dashboard-header ant-layout-header">
    <span class="ant-layout-header-trigger" @click="$emit('change-collapsed')">
      <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </span>

    <div class="action">
      <div
        v-for="action in actions()"
        :key="action.key"
        @click="action.callback"
      >
        <a-icon :type="action.icon" :theme="action.theme" />
        {{ action.title }}
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { Vue, Component, Prop } from "vue-property-decorator";

interface Action {
  title: string;
  key: string;
  icon: string;
}

@Component({})
export default class Header extends Vue {
  @Prop() protected readonly collapsed!: string;

  mounted() {
    ZSmartModel.on("set-action-header", () => {
      this.$forceUpdate();
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("set-action-header");
  }

  actions(): Action[] {
    const { meta } = this.$route;
    return meta["action-header"] || [];
  }
}
</script>
