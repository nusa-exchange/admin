<template>
  <div class="page-settings-permissions">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="data"
      :scroll="false"
      :pagination="true"
      :hover="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_permissions"
      @click="edit_permission"
    >
      <template slot="topic" slot-scope="{ item, column }">
        <span :class="['topic', `text-${column.algin}`]">
          {{ item.topic || "Empty" }}
        </span>
      </template>
      <template slot="action-edit-delete" slot-scope="{ item, column }">
        <span :class="`action-edit-delete text-${column.algin}`">
          <a-icon theme="filled" type="edit" @click="edit_permission(item)" />
          <a-icon
            theme="filled"
            type="delete"
            @click.stop="delete_permission(item.id)"
          />
        </span>
      </template>
    </z-table>
    <modal-permission ref="modal-permission" @submit="onModalSubmit" />
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import ModalPermission from "./modal.vue";
import { runNotice } from "@/mixins";
import store from "@/store";
import {
  GET_PERMISSIONS,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION
} from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-permission": ModalPermission
  }
})
export default class App extends Vue {
  loading = false;
  data: Permission[] = [];
  page = 1;
  limit = 50;
  $refs!: {
    "modal-permission": ModalPermission;
  };
  readonly COLUMN = [
    { title: "Role", key: "role", algin: "left" },
    { title: "Verb", key: "verb", algin: "left" },
    { title: "Path", key: "path", algin: "left" },
    { title: "Topic", key: "topic", algin: "left", scopedSlots: true },
    { title: "Action", key: "action", algin: "left" },
    { title: "", key: "action-edit-delete", algin: "right", scopedSlots: true }
  ];

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Add Permission",
        key: "add_permission",
        icon: "plus-circle",
        callback: () => {
          this.$refs["modal-permission"].create({
            type: "create",
            item: {
              role: "",
              path: "",
              topic: "",
              verb: "",
              action: ""
            }
          });
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  mounted() {
    this.get_permissions();
    this.set_action_header();
  }

  async get_permissions(payload = { limit: this.limit, page: this.page }) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(GET_PERMISSIONS, payload);
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  edit_permission(item: Permission) {
    this.$refs["modal-permission"].create({
      type: "edit",
      item: {
        id: item.id,
        role: item.role,
        path: item.path,
        topic: item.topic || null,
        verb: item.verb,
        action: item.action
      }
    });
  }

  async update_permission(payload, callback?: () => void) {
    try {
      const { data } = await store.dispatch(UPDATE_PERMISSION, payload);

      runNotice("success", "Permission updated successfully");

      const index = this.data.findIndex(record => record.id === data.id);

      if (index >= 0) this.data[index] = data;
      if (callback) callback();
      this.$forceUpdate();
    } catch (error) {
      return error;
    }
  }

  async create_permission(payload, callback) {
    try {
      await store.dispatch(CREATE_PERMISSION, payload);

      runNotice("success", "Permission created successfully");

      this.get_permissions();

      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async delete_permission(id: number) {
    try {
      await store.dispatch(DELETE_PERMISSION, id);

      runNotice("success", "Permission deleted successfully");

      const index = this.data.findIndex(record => record.id == id);

      if (index >= 0) {
        this.data.splice(index, 1);
      }
    } catch (error) {
      return error;
    }
  }

  onModalSubmit(payload) {
    if (payload.type === "edit") {
      this.update_permission(payload.item, () => {
        this.$refs["modal-permission"].delete();
        this.$forceUpdate();
      });
    } else {
      this.create_permission(
        payload.item,
        this.$refs["modal-permission"].delete()
      );
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/permissions/base";
</style>
