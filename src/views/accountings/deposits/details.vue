<template>
  <div class="page-accountings-deposits details">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-head">
          <div class="z-edit-panel-title">
            Deposit Details
          </div>

          <div class="z-edit-panel-action" v-if="deposit">
            <a-button
              v-if="['accepted', 'skipped', 'errored'].includes(deposit.state)"
              type="primary"
              :loading="process_loading"
              @click="send_action('process')"
            >
              Process
            </a-button>
          </div>
        </div>
        <div v-if="!loading" class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_LEFT"
            :key="setting.key"
            :item="setting"
          >
            <template slot="txid">
              <a
                :href="getTxIDUrl(deposit.blockchain_key, deposit.txid)"
                target="_blank"
              >
                {{ deposit.txid }}
              </a>
            </template>
          </z-info-row>
        </div>
        <z-loading v-else />
      </div>
    </z-configuration>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { GET_DEPOSITS, SEND_DEPOSIT_ACTION } from "@/store/types";
import { getDate, runNotice, getTxIDUrl } from "@/mixins";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class DepositDetails extends Vue {
  loading = false;
  deposit?: Deposit = null;
  process_loading = false;
  getTxIDUrl = getTxIDUrl;

  get tid(): string {
    return this.$route.params.tid;
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Name",
        key: "uid",
        value: this.deposit?.uid,
        type: "input",
        style: "width: 45%",
        edit: false
      },
      {
        title: "Date",
        key: "date",
        value: getDate(this.deposit?.created_at, true),
        type: "input",
        style: "width: 45%",
        edit: false
      },
      {
        title: "Member",
        key: "member",
        value: this.deposit?.email,
        type: "input",
        style: "width: 45%",
        edit: false
      },
      {
        title: "State",
        key: "state",
        value: this.deposit?.state,
        type: "input",
        style: "width: 45%",
        edit: false
      },
      {
        title: "Amount",
        key: "amount",
        value: this.deposit?.amount,
        type: "input",
        style: "width: 45%",
        edit: false
      },
      {
        title: "TxID",
        key: "txid",
        value: this.deposit?.txid,
        type: "slot",
        style: "width: 45%"
      }
    ];
  }

  beforeMount() {
    this.get_deposit();
  }

  async get_deposit() {
    this.loading = true;
    try {
      const { data } = await store.dispatch(GET_DEPOSITS, { tid: this.tid });
      if (data.length) this.deposit = data[0];
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  async send_action(action: string) {
    this.process_loading = true;
    try {
      const { data } = await store.dispatch(SEND_DEPOSIT_ACTION, {
        id: this.deposit.id,
        action: action
      });
      runNotice("success", "Action was send successfully");
      this.deposit = data;
    } catch (error) {
      return error;
    } finally {
      this.process_loading = false;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/accountings/deposits/details";
</style>
