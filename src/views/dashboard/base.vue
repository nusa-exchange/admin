<template>
  <a-layout class="page-dashboard ant-layout-has-sider">
    <dashboard-menu :collapsed="collapsed" />
    <div
      class="page-dashboard-body ant-layout ant-layout-sider"
      :class="{ 'collapsed-dashboard': collapsed }"
    >
      <dashboard-header
        :collapsed="collapsed"
        @change-collapsed="changeCollapsed"
      />
      <a-layout-content>
        <a-breadcrumb>
          <a-breadcrumb-item v-for="(name, index) in routes" :key="index">
            {{ name }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-page-header :title="routes[routes.length - 1]" />
        <router-view />
      </a-layout-content>
      <div class="page-dashboard-footer">
        © 2018-2022 
        <a href="https://fortem-one.tech" target="_blank">Fortem Technologies Inc</a>
         Copyright
      </div>
    </div>
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "dashboard-menu": () => import("@/layouts/dashboard/menu.vue"),
    "dashboard-header": () => import("@/layouts/dashboard/header.vue"),
  },
})
export default class App extends Vue {
  collapsed = false;

  get routes() {
    const routes = new Array<string>();
    this.$route.matched.slice(1, this.$route.matched.length).forEach(route => {
      if (route.meta["parent"]) {
        routes.push(route.meta["parent"]);
      }
      routes.push(route.name);
    });

    return routes;
  }

  changeCollapsed() {
    this.collapsed = !this.collapsed;
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }
}
</script>

<style lang="less">
@import "~@styles/views/dashboard.less";
</style>
