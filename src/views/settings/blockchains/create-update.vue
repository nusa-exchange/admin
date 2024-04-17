<template>
  <div v-if="!loading" class="page-settings-blockchains update">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_LEFT"
            v-model="blockchain[setting.key]"
            :key="setting.key"
            :item="setting"
          />
        </div>
      </div>
      <div class="z-edit-panel" :style="{ paddingBottom: '60px' }">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_RIGHT"
            v-model="blockchain[setting.key]"
            :key="setting.key"
            :item="setting"
          />
          <div class="z-edit-panel-action">
            <a-button @click="onSubmit" type="primary">Submit</a-button>
          </div>
        </div>
      </div>
    </z-configuration>

    <modal-block-scanning
      v-if="page_type === 'update' && !loading"
      :blockchain="blockchain"
      ref="modal-block-scanning"
    />
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import { runNotice } from "@/mixins";
import {
  GET_BLOCKCHAIN,
  GET_BLOCKCHAIN_CLIENTS,
  CREATE_BLOCKCHAIN,
  UPDATE_BLOCKCHAIN
} from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "modal-block-scanning": () => import("./modal-block-scanning.vue")
  }
})
export default class App extends Vue {
  loading = false;
  blockchain: Blockchain = {
    key: "",
    name: "",
    client: "",
    server: "",
    height: 0,
    explorer_address: "",
    explorer_transaction: "",
    min_confirmations: null,
    min_deposit_amount: null,
    withdraw_fee: null,
    min_withdraw_amount: null,
    collection_gas_speed: "standard",
    withdrawal_gas_speed: "standard",
    status: "disabled",
    protocol: ""
  };

  get id() {
    return this.$route.params.id;
  }

  get page_type() {
    return this.$route.meta.type;
  }

  get clients() {
    return store.state.admin.clients.reduce(
      (a, b) => ((a[b] = b.toUpperCase()), a),
      {}
    ) as { [key: string]: string };
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Name",
        key: "name",
        value: this.blockchain?.name,
        type: "input",
        style: "width: 47.5%",
        edit: true
      },
      {
        title: "Status",
        key: "status",
        value: this.blockchain?.status, // active || disabled
        style: "width: 47.5%",
        style_content:
          "justify-content: space-between;display: flex;flex-wrap: wrap",
        type: "switch",
        switch: {
          0: "disabled",
          1: "active"
        }
      },
      {
        title: "Client",
        key: "client",
        value: this.blockchain?.client,
        type: "select",
        list: this.clients
      },
      {
        title: "Server",
        key: "server",
        value: this.blockchain?.server,
        type: "input",
        edit: true
      },
      {
        title: "Min confirmations",
        key: "min_confirmations",
        value: this.blockchain?.min_confirmations,
        type: "input",
        edit: true
      },
      {
        title: "Min deposit amount",
        key: "min_deposit_amount",
        value: this.blockchain?.min_deposit_amount,
        type: "input",
        edit: true
      },
      {
        title: "Min withdrawal amount",
        key: "min_withdraw_amount",
        value: this.blockchain?.min_withdraw_amount,
        type: "input",
        edit: true
      },
      {
        title: "Withdrawal fee",
        key: "withdraw_fee",
        value: this.blockchain?.withdraw_fee,
        type: "input",
        edit: true
      }
    ];
  }

  get SETTING_PANEL_RIGHT() {
    return [
      {
        title: "Height",
        key: "height",
        value: this.blockchain?.height,
        type: "input",
        edit: true
      },
      {
        title: "Key",
        key: "key",
        value: this.blockchain?.key,
        type: "input",
        edit: true
      },
      {
        title: "Explorer Address",
        key: "explorer_address",
        value: this.blockchain?.explorer_address,
        type: "input",
        edit: true
      },
      {
        title: "Explorer Transaction",
        key: "explorer_transaction",
        value: this.blockchain?.explorer_transaction,
        type: "input",
        edit: true
      },
      {
        title: "Deposit collection gas speed",
        key: "collection_gas_speed",
        value: this.blockchain?.collection_gas_speed,
        type: "select",
        list: {
          standard: "standard",
          safelow: "safelow",
          fast: "fast"
        }
      },
      {
        title: "Withdrawal collection gas speed",
        key: "withdrawal_gas_speed",
        value: this.blockchain?.withdrawal_gas_speed,
        type: "select",
        list: {
          standard: "standard",
          safelow: "safelow",
          fast: "fast"
        }
      },
      {
        title: "Protocol",
        key: "protocol",
        value: this.blockchain?.protocol,
        type: "input",
        edit: true
      }
    ];
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Scan Blocks",
        key: "scan_blocks",
        icon: "search",
        callback: () => {
          (this.$refs["modal-block-scanning"] as any).create();
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }

  async mounted() {
    if (!store.state.admin.clients.length) this.get_clients();
    if (this.page_type === "update") {
      await this.get_blockchain();
      this.set_action_header();
    }
  }

  async get_blockchain() {
    this.loading = true;
    try {
      const { data } = await store.dispatch(GET_BLOCKCHAIN, this.id);

      this.blockchain = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  async get_clients() {
    await store.dispatch(GET_BLOCKCHAIN_CLIENTS);
  }

  async onSubmit() {
    let payload = {
      key: this.blockchain.key,
      name: this.blockchain.name,
      client: this.blockchain.client,
      height: this.blockchain.height,
      protocol: this.blockchain.protocol,
      server: this.blockchain.server,
      min_confirmations: this.blockchain.min_confirmations,
      min_deposit_amount: this.blockchain.min_deposit_amount,
      min_withdraw_amount: this.blockchain.min_withdraw_amount,
      withdraw_fee: this.blockchain.withdraw_fee,
      explorer_address: this.blockchain.explorer_address,
      explorer_transaction: this.blockchain.explorer_transaction,
      collection_gas_speed: this.blockchain.collection_gas_speed,
      withdrawal_gas_speed: this.blockchain.withdrawal_gas_speed,
      status: this.blockchain.status
    };

    if (this.page_type == "update") {
      payload = Object.assign(payload, { id: this.blockchain.id });
    }

    try {
      await store.dispatch(
        this.page_type === "update" ? UPDATE_BLOCKCHAIN : CREATE_BLOCKCHAIN,
        payload
      );

      runNotice(
        "success",
        `Blockchain ${this.blockchain.name} ${
          this.page_type === "update" ? "updated" : "created"
        } successfully`
      );

      this.$router.push("/settings/blockchains");
    } catch (error) {
      return error;
    }
  }
}
</script>
