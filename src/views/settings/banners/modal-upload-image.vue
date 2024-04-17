<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-upload-image"
    title="Image"
    width="748px"
    :footer="false"
    :destroyOnClose="true"
  >
    <div class="upload-banner-container">
      <img v-if="value" :src="image_preview">
      <div v-else class="upload-banner-button">
        <a-icon type="plus" />
        <div>Upload</div>
      </div>
      <input v-if="editImage" type="file" accept="image/*" @change="onFileUpload" />
    </div>
  </a-modal>
</template>

<script lang="ts">
import ZModalMixin from "@/mixins/z-modal";
import ApiClient from "@zsmartex/z-apiclient";
import { getFileBase64 } from "@/mixins";
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { UUIDv4 } from "uuid-v4-validator";

type UUID = string;

@Component
export default class PageBannersModalUploadImage extends Mixins(ZModalMixin) {
  @Prop({ default: null }) readonly value?: string | UUID;
  @Prop({ default: true }) readonly editImage!: boolean;
  image_preview?: string | ArrayBuffer = null;

  get isUUID() {
    return UUIDv4.validate(this.value);
  }

  onCreate() {
    if (this.image_preview) return;
    if (this.isUUID) this.get_image_preview();
    else this.image_preview = this.value;
  }

  async get_image_preview() {
    try {
      const { data } = await new ApiClient("applogic").get(`public/banners/preview/${this.value}`, null, { responseType: "arraybuffer" });

      this.image_preview = ["data:image/png;base64", Buffer.from(data, "binary").toString("base64")].join(",");
    } catch (error) {
      return error;
    }
  }

  async onFileUpload(e) {
    const files = e.target.files;

    if (files.length) {
      const file = files[0];
      this.$emit("change", file);
    } else {
      this.$emit("change", null);
    }
  }

  @Watch("value")
  onFileChanged(value) {
    if (!this.isUUID) this.image_preview = value;
  }
}
</script>

<style lang="less">
@import "~@styles/views/settings/banners/modal";
</style>
