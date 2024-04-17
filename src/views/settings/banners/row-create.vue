<template>
  <fragment>
    <span class="uuid text-left">AUTO</span>
    <span class="state text-left">
      PENDING
    </span>
    <span class="url text-left">
      <a-textarea v-model="url" placeholder="URL" auto-size />
    </span>
    <span class="action text-center">
      <a-button type="preview" @click="open_modal_image">Image</a-button>
      <a-button type="primary" @click="create_banner" :disabled="button_disabled">Create</a-button>
    </span>

    <modal-upload-image ref="modal-upload-image" @change="onFileChanged" v-model="image_base64" />
  </fragment>
</template>

<script lang="ts">
import { getFileBase64, isValidUrl } from "@/mixins";
import { CREATE_BANNER } from "@/store/types";
import { Vue, Component, Watch } from "vue-property-decorator";
import store from "@/store";
import ModalUploadImage from "./modal-upload-image.vue";

@Component({
  components: {
    "modal-upload-image": ModalUploadImage
  }
})
export default class RowCreate extends Vue {
  $refs!: {
    "modal-upload-image": ModalUploadImage
  }
  image_base64?: string | ArrayBuffer = null;

  url = "";
  file?: File = null;

  get url_error() {
    if (!this.url.length) return null;

    return isValidUrl(this.url) ? null : "This link is not valid";
  }

  get button_disabled() {
    return !(this.file && this.url && this.url_error == null);
  }

  async onFileChanged(file?: File) {
    this.file = file;

    if (file) {
      this.image_base64 = await getFileBase64(this.file);
    }
  }

  open_modal_image() {
    this.$refs["modal-upload-image"].create();
  }

  async create_banner() {
    if (!this.file) return;
    const payload = new FormData();

    payload.set("url", this.url)
    payload.set("upload", this.file);
    try {
      store.dispatch(CREATE_BANNER, payload);
      setTimeout(() => {
        this.$emit("created");
      }, 500);
    } catch (error) {
      return error;
    }
  }
}
</script>
