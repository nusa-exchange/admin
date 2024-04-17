<template>
  <div class="whitelisted-smart-contract">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="smart_contracts"
      :hover="true"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_smart_contracts"
      @click="
        item =>
          $refs['modal-edit-new'].create({
            type: 'edit',
            payload: item,
            blockchains: this.blockchains
          })
      "
    >
    </z-table>
    <modal-edit-new ref="modal-edit-new" @updated="get_smart_contracts" />
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import {
  GET_BLOCKCHAINS,
  GET_WHITELISTED_SMART_CONTRACTS
} from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-edit-new": () => import("./modal-edit-new.vue")
  }
})
export default class WhitelistedSmartContractPage extends Vue {
  smart_contracts: SmartContract[] = [];
  blockchains: Blockchain[] = [];
  loading = false;
  page = 1;
  limit = 50;
  readonly COLUMN = [
    { title: "Title", key: "description", algin: "left" },
    { title: "Address", key: "address", algin: "left" },
    { title: "State", key: "state", algin: "left" }
  ];

  async mounted() {
    await this.get_data();
    this.set_action_header();
  }

  async get_data() {
    this.loading = true;
    await Promise.all([this.get_blockchains(), this.get_smart_contracts()]);
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Add Smart Contract",
        key: "add_smart_contract",
        icon: "plus-circle",
        callback: () => {
          (this.$refs["modal-edit-new"] as any).create({
            type: "create",
            blockchains: this.blockchains
          });
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  async get_blockchains() {
    try {
      const { data } = await store.dispatch(GET_BLOCKCHAINS, {
        limit: 100
      });
      this.blockchains = data;
    } catch (error) {
      return error;
    }
  }

  async get_smart_contracts() {
    this.loading = true;

    try {
      const { data } = await store.dispatch(GET_WHITELISTED_SMART_CONTRACTS, {
        limit: 100
      });
      this.smart_contracts = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
