<template>
  <div v-if="!loading" class="blockchain-currency">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-head">
          <div class="z-edit-panel-title">
            {{ currency.name }}
          </div>
          <z-info-row
            v-model="blockchain_currency.status"
            :item="{
              title: 'Status',
              key: 'status',
              value: blockchain_currency.status,
              type: 'switch',
              switch: {
                0: 'disabled',
                1: 'enabled'
              }
            }"
            style="width: auto;"
          />
        </div>
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_LEFT"
            v-model="blockchain_currency[setting.key]"
            :key="setting.key"
            :item="setting"
          />
        </div>
      </div>
      <div class="z-edit-panel">
        <div class="z-edit-panel-head">
          <z-info-row
            v-for="setting in SETTING_PANEL_HEAD_RIGHT"
            v-model="blockchain_currency[setting.key]"
            :key="setting.key"
            :item="setting"
          />
        </div>
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_RIGHT"
            v-model="blockchain_currency[setting.key]"
            :key="setting.key"
            :item="setting"
          />

          <div class="z-edit-panel-action">
            <a-button
              type="primary"
              @click="create_or_update_blockchain_currency"
            >
              Submit
            </a-button>
          </div>
        </div>
      </div>
    </z-configuration>
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-head">
          <div class="z-edit-panel-title">
            Properties
          </div>
          <div class="add-property">
            <a-popover placement="bottomRight" trigger="click">
              <template slot="content">
                <z-info-row
                  class="add-property"
                  v-model="new_property_value"
                  :item="{
                    title: 'New property',
                    value: new_property_value,
                    type: 'input',
                    edit: true
                  }"
                >
                  <template slot="suffix">
                    <a-icon
                      type="plus-circle"
                      @click="add_property(new_property_value)"
                    />
                  </template>
                </z-info-row>
              </template>
              <div>
                <a-icon type="plus-circle" />
                Add property
              </div>
            </a-popover>
          </div>
        </div>
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in PROPERTIES()"
            :key="setting.key"
            :item="setting"
            @input="value => set_options_value(setting.key, value)"
          >
            <template slot="suffix">
              <a-icon
                type="minus-circle"
                @click="remove_property(setting.key)"
              />
            </template>
          </z-info-row>
        </div>
      </div>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <div class="note-borderable">
            <p class="note-borderable-head">JSON</p>
            <pre>{{ properties_as_string() }}</pre>
          </div>
          <div class="z-edit-panel-action">
            <a-button
              type="primary"
              @click="create_or_update_blockchain_currency"
            >
              Submit
            </a-button>
          </div>
        </div>
      </div>
    </z-configuration>
  </div>
</template>

<script lang="ts">
import { runNotice } from "@/mixins";
import store from "@/store";
import {
  CREATE_BLOCKCHAIN_CURRENCY,
  GET_BLOCKCHAINS,
  GET_CURRENCIES,
  UPDATE_BLOCKCHAIN_CURRENCY
} from "@/store/modules/admin/action-types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class BlockchainCurrencyPage extends Vue {
  new_property_value = "";
  loading = true;
  currencies: Currency[] = [];
  blockchains: Blockchain[] = [];
  blockchain_currency: BlockchainCurrency = {
    blockchain_key: null,
    parent_id: null,
    subunits: null,
    status: "disabled",
    deposit_enabled: false,
    withdrawal_enabled: null,
    min_collection_amount: null,
    withdraw_fee: null,
    min_withdraw_amount: null,
    auto_update_fees_enabled: false,
    options: {}
  };

  get id() {
    return Number(this.$route.params["id"]);
  }

  get code() {
    return this.$route.params["code"];
  }

  get page_type() {
    return this.$route.meta["type"];
  }

  get currency() {
    return this.currencies.find(currency => currency.code == this.code);
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Blockchain Key",
        key: "blockchain_key",
        value: this.blockchain_currency.blockchain_key,
        type: "select",
        list: (() => {
          return this.blockchains.reduce((obj, blockchain) => {
            return {
              ...obj,
              [blockchain["key"]]: blockchain.name
            };
          }, {});
        })()
      },
      {
        title: "Parent Currency (optional)",
        key: "parent_id",
        value: this.blockchain_currency.parent_id,
        type: "select",
        list: (() => {
          return this.currencies
            .filter(c => !c.networks.every(n => n.parent_id))
            .reduce((obj, currency) => {
              return {
                null: "NULL",
                ...obj,
                [currency["code"]]: currency.name
              };
            }, {});
        })()
      },
      {
        title: "Subunits",
        key: "subunits",
        value: this.blockchain_currency.subunits,
        type: "input",
        edit: true
      },
      {
        title: "Min Collection Amount",
        key: "min_collection_amount",
        value: this.blockchain_currency.min_collection_amount,
        type: "input",
        edit: true
      }
    ];
  }

  get SETTING_PANEL_HEAD_RIGHT() {
    return [
      {
        title: "Deposit",
        key: "deposit_enabled",
        value: this.blockchain_currency.deposit_enabled,
        type: "switch",
        switch: {
          0: false,
          1: true
        }
      },
      {
        title: "Withdrawal",
        key: "withdrawal_enabled",
        value: this.blockchain_currency.withdrawal_enabled,
        type: "switch",
        switch: {
          0: false,
          1: true
        },
        style: "position: absolute;width: auto;right: 0;"
      }
    ];
  }

  get SETTING_PANEL_RIGHT() {
    return [
      {
        title: "Min deposit amount",
        key: "min_deposit_amount",
        value: this.blockchain_currency.min_deposit_amount,
        type: "input",
        edit: true,
        style: "width: 45%;"
      },
      {
        title: "Auto Update",
        key: "auto_update_fees_enabled",
        value: this.blockchain_currency.auto_update_fees_enabled,
        type: "switch",
        switch: {
          0: false,
          1: true
        },
        style: "position: absolute;width: auto;right: 0;display: inline-flex;"
      },
      {
        title: "Withdrawal fee",
        key: "withdraw_fee",
        value: this.blockchain_currency.withdraw_fee,
        type: "input",
        edit: true
      },
      {
        title: "Min Withdrawal Amount",
        key: "min_withdraw_amount",
        value: this.blockchain_currency.min_withdraw_amount,
        type: "input",
        edit: true
      }
    ];
  }

  async mounted() {
    this.loading = true;
    await Promise.all([this.get_currencies(), this.get_blockchains()]);
    if (this.page_type == "update") {
      this.blockchain_currency = this.currency.networks.find(
        network => network.id == this.id
      );
    }
    this.loading = false;
  }

  async get_currencies() {
    try {
      const { data } = await store.dispatch(GET_CURRENCIES, { limit: 100 });
      this.currencies = data;
    } catch (error) {
      return error;
    }
  }

  async get_blockchains() {
    try {
      const { data } = await store.dispatch(GET_BLOCKCHAINS, { limit: 100 });
      this.blockchains = data;
    } catch (error) {
      return error;
    }
  }

  PROPERTIES() {
    const options = this.blockchain_currency.options;
    if (typeof options == "object") {
      return Object.keys(options).map(key => {
        return {
          title: key,
          key: key,
          value: options[key],
          type: "input",
          edit: true
        };
      });
    } else {
      return [];
    }
  }

  properties_as_string() {
    return JSON.stringify(this.blockchain_currency.options, undefined, 2);
  }

  add_property(property: string) {
    const { options } = this.blockchain_currency as any;

    if (!property) return;
    this.new_property_value = "";
    options[property] = "";
    (this.blockchain_currency as any).options = options;

    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  remove_property(property) {
    delete (this.blockchain_currency as any).options[property];

    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  /**
   * @method $forceUpdate for update value input when it changed
   */
  set_options_value(key: string, value) {
    (this.blockchain_currency as any).options[key] = value;
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  async create_or_update_blockchain_currency() {
    let payload = {
      currency_id: this.code,
      blockchain_key: this.blockchain_currency.blockchain_key,
      parent_id:
        this.blockchain_currency.parent_id == "null"
          ? null
          : this.blockchain_currency.parent_id,
      subunits: this.blockchain_currency.subunits,
      status: this.blockchain_currency.status,
      deposit_enabled: this.blockchain_currency.deposit_enabled,
      withdrawal_enabled: this.blockchain_currency.withdrawal_enabled,
      min_deposit_amount: this.blockchain_currency.min_deposit_amount,
      min_collection_amount: this.blockchain_currency.min_collection_amount,
      withdraw_fee: this.blockchain_currency.withdraw_fee,
      min_withdraw_amount: this.blockchain_currency.min_withdraw_amount,
      auto_update_fees_enabled: this.blockchain_currency
        .auto_update_fees_enabled,
      options: this.blockchain_currency.options
    };

    if (this.page_type == "update") {
      payload = Object.assign(payload, { id: this.blockchain_currency.id });
    }

    try {
      await store.dispatch(
        this.page_type == "update"
          ? UPDATE_BLOCKCHAIN_CURRENCY
          : CREATE_BLOCKCHAIN_CURRENCY,
        payload
      );

      runNotice(
        "success",
        this.page_type == "update"
          ? "Update network successfuly"
          : "Network create successfuly"
      );
      this.$router.push(`/exchange/currencies/${this.code}`);
    } catch (error) {
      return error;
    }
  }
}
</script>

<style lang="less">
.add-property {
  font-size: 14px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
