<template>
  <div class="page-settings-broadcasts">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="broadcasts"
      :hover="false"
      :scroll="false"
      :pagination="false"
      :allow-empty="false"
    >
      <template slot="title" slot-scope="{ item, column }">
        <span :class="`title text-${column.algin}`">
          <a-textarea v-model="item.title" placeholder="Title" auto-size />
        </span>
      </template>
      <template slot="url" slot-scope="{ item, column }">
        <span :class="`url text-${column.algin}`">
          <a-textarea v-model="item.url" placeholder="URL" auto-size />
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-button type="update" @click="update_broadcast(item)">Update</a-button>
          <a-button type="delete" @click="delete_broadcast(item)">Delete</a-button>
        </span>
      </template>
      <template v-if="!loading" slot="row-extend">
        <row-create @created="get_broadcasts" />
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { GET_BROADCASTS, UPDATE_BROADCAST } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "row-create": () => import("./row-create.vue")
  }
})
export default class PageBroadcasts extends Vue {
  loading = false;
  broadcasts: BroadCast[] = [];
  readonly COLUMN = [
    { title: "ID", key: "id", algin: "left" },
    { title: "State", key: "state", algin: "left" },
    { title: "Title", key: "title", algin: "left", scopedSlots: true },
    { title: "URL", key: "url", algin: "left", scopedSlots: true },
    { title: "Action", key: "action", algin: "center", scopedSlots: true }
  ]

  mounted() {
    this.get_broadcasts();
  }

  async get_broadcasts() {
    this.loading = true;

    try {
      const { data } = await store.dispatch(GET_BROADCASTS);

      this.broadcasts = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  async update_broadcast(broadcast: BroadCast) {
    try {
      const { data } = await store.dispatch(UPDATE_BROADCAST, broadcast);

      this.get_broadcasts();
    } catch (error) {
      return error;
    }
  }

  delete_broadcast(broadcast: BroadCast) {
    this.update_broadcast(Object.assign(broadcast, { state: "deleted" }));
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/broadcasts/base";
</style>
