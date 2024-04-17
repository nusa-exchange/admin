<template>
  <div class="page-settings-banners">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="banners"
      :hover="false"
      :scroll="false"
      :pagination="false"
      :allow-empty="false"
    >
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-button type="preview" @click="open_modal_image(item.uuid)">Image</a-button>
          <a-button type="delete" @click="delete_banner(item)">Delete</a-button>
        </span>
        <modal-upload-image
          :ref="`modal-upload-image-${item.uuid}`"
          :value="item.uuid"
          :edit-image="false"
        />
      </template>
      <template v-if="!loading" slot="row-extend">
        <row-create @created="get_banners" />
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { GET_BANNERS, UPDATE_BANNER } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";
import ModalUploadImage from "./modal-upload-image.vue";

@Component({
  components: {
    "row-create": () => import("./row-create.vue"),
    "modal-upload-image": ModalUploadImage
  }
})
export default class PageBanners extends Vue {
  loading = false;
  banners: Banner[] = [];
  readonly COLUMN = [
    { title: "UUID", key: "uuid", algin: "left" },
    { title: "State", key: "state", algin: "left" },
    { title: "URL", key: "url", algin: "left" },
    { title: "Action", key: "action", algin: "center", scopedSlots: true }
  ];

  mounted() {
    this.get_banners();
  }

  open_modal_image(uuid: string) {
    (this.$refs[`modal-upload-image-${uuid}`] as ModalUploadImage).create();
  }

  async get_banners() {
    this.loading = true;
    try {
      const { data } = await store.dispatch(GET_BANNERS);
      this.banners = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  async delete_banner(banner: Banner) {
    this.loading = true;

    try {
      await store.dispatch(
        UPDATE_BANNER,
        Object.assign(banner, { state: "deleted" })
      );

      setTimeout(() => {
        this.get_banners();
      }, 500);
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/banners/base";
</style>
