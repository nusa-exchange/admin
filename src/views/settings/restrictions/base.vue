<template>
  <div class="page-settings-restrictions">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="data"
      :scroll="false"
      :pagination="true"
      :hover="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_restrictions"
      @click="edit_restriction"
    >
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-icon theme="filled" type="edit" @click="edit_restriction(item)" />
          <a-icon
            theme="filled"
            type="delete"
            @click.stop="delete_restriction(item.id)"
          />
        </span>
      </template>
    </z-table>
    <modal-restriction ref="modal-restriction" @submit="onModalSubmit" />
  </div>
</template>

<script lang="ts">
import ModalRestriction from "./modal.vue";
import store from "@/store";
import { runNotice } from "@/mixins";
import { GET_RESTRICTIONS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-restriction": ModalRestriction
  }
})
export default class Restriction extends Vue {
  loading = false;
  data: Restriction[] = [];
  limit = 50;
  page = 1;

  COLUMN = [
    { title: "Scope", key: "scope", algin: "left" },
    { title: "Value", key: "value", algin: "left" },
    { title: "Created at", key: "created_at", algin: "left" },
    { title: "Updated at", key: "updated_at", algin: "left" },
    { title: "State", key: "state", algin: "left" },
    { title: "", key: "action", algin: "right", scopedSlots: true }
  ];

  $refs!: {
    "modal-restriction": ModalRestriction;
  };

  mounted() {
    this.get_restrictions();
  }

  async get_restrictions(payload = { limit: this.limit, page: this.page }) {
    this.loading = false;
    try {
      const { data, headers } = await store.dispatch(GET_RESTRICTIONS, payload);
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  edit_restriction(item) {
    this.$refs["modal-restriction"].create({
      type: "edit",
      item
    });
  }

  //TODO: add support update create delete restriction
  async update_restriction(item: Restriction, callback?: () => void) {
    try {
      runNotice("success", "Restriction updated successfully");

      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  create_restriction(item: Restriction, callback?: () => void) {
    try {
      runNotice("success", "Restriction created successfully");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  delete_restriction(id: number) {
    runNotice("success", "Restriction deleted successfully");
  }

  onModalSubmit(payload) {
    if (payload.type === "edit") {
      this.update_restriction(payload.item, () => {
        this.$refs["modal-restriction"].delete();
        this.$forceUpdate();
      });
    } else {
      this.create_restriction(
        payload.item,
        this.$refs["modal-restriction"].delete
      );
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/restrictions/base";
</style>
