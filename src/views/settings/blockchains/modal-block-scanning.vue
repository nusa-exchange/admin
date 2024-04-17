<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="modal-block-scanning"
    title="Block scanning"
    :width="width"
    :footer="false"
  >
    <z-info-row
      :item="{
        title: 'Current Height',
        key: 'height',
        value: this.blockchain.height,
        type: 'input',
        edit: true
      }"
    />
    <z-info-row
      :item="{
        title: 'Latest block',
        key: 'latest_block',
        value: latest_block,
        type: 'input',
        edit: true
      }"
    >
      <template slot="suffix">
        <a-button
          type="primary"
          :loading="loading_get_latest_block"
          :disabled="latest_block <= 0"
          @click="get_latest_block"
        >
          Request
        </a-button>
      </template>
    </z-info-row>
    <z-info-row
      v-model="block_scan"
      :item="{
        title: 'Scan a specific block',
        key: 'block_scan',
        value: block_scan,
        type: 'input',
        edit: true
      }"
    >
      <template slot="suffix">
        <a-button
          :loading="loading_scan_block"
          :disabled="!block_scan"
          type="primary"
          @click="scan_block"
        >
          Scan
        </a-button>
      </template>
    </z-info-row>
  </a-modal>
</template>

<script lang="ts">
import store from "@/store";
import ZModalMixin from "@/mixins/z-modal";
import { Component, Prop, Mixins } from "vue-property-decorator"
import { GET_BLOCKCHAIN_LATEST_BLOCK, SCAN_BLOCK } from "@/store/types";

@Component({})
export default class ModalBlockScanning extends Mixins(ZModalMixin) {
  @Prop() readonly blockchain!: Blockchain;

  latest_block = 0;
  block_scan?: number = null;
  loading_get_latest_block = false;
  loading_scan_block = false;

  mounted() {
    this.get_latest_block();
  }

  async get_latest_block() {
    this.loading_get_latest_block = true;
    try {
      const { data } = await store.dispatch(
        GET_BLOCKCHAIN_LATEST_BLOCK,
        this.blockchain.id
      );
      this.latest_block = data;
    } catch (error) {
      return error;
    } finally {
      this.loading_get_latest_block = false;
    }
  }

  async scan_block() {
    this.loading_scan_block = true;
    try {
      await store.dispatch(SCAN_BLOCK, {
        id: this.blockchain.id,
        block_number: Number(this.block_scan)
      });
    } catch (error) {
      return error;
    } finally {
      this.loading_scan_block = false;
    }
  }
}
</script>
