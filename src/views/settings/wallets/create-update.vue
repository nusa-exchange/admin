<template>
  <div class="page-settings-wallets">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_LEFT"
            :key="setting.key"
            :item="setting"
            v-model="wallet[setting.key]"
          >
            <template slot="status">
              <span>
                {{ wallet[setting.key] == "active" ? "Enabled" : "Disabled" }}
              </span>
              <span>
                <a-switch
                  :checked="wallet[setting.key] == 'active'"
                  @change="
                    checked =>
                      (wallet[setting.key] = checked ? 'active' : 'disabled')
                  "
                />
              </span>
            </template>
          </z-info-row>
        </div>
      </div>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_RIGHT"
            :key="setting.key"
            :item="setting"
            v-model="wallet[setting.key]"
          />
          <div class="z-edit-panel-action">
            <a-button type="primary" @click="onSubmit">Submit</a-button>
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
            @input="value => set_wallet_settings_value(setting.key, value)"
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
        <div class="note-borderable">
          <p class="note-borderable-head">JSON</p>
          <pre>{{ wallet_settings_as_string() }}</pre>
        </div>
      </div>
    </z-configuration>
    <z-table-select
      left-title="Linked Currencies"
      right-title="Existing Currencies"
      :left-columns="currency_columns('linked')"
      :right-columns="currency_columns('existing')"
      :left-data="linked_currencies"
      :right-data="existing_currencies"
      :search-keys="['name', 'code']"
      style="margin-top: 12px"
    >
      <template slot="right-search-action">
        <a-button
          v-if="page_type != 'create'"
          type="primary"
          style="margin-left: 12px"
          :disabled="wallet_currencies_cache.length == 0"
          @click="add_wallet_currencies"
        >
          Add Selected
        </a-button>
      </template>

      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-icon
            type="delete"
            theme="filled"
            @click="delete_wallet_currency(item.code)"
          />
        </span>
      </template>
      <template slot="checkbox" slot-scope="{ item, column }">
        <span :class="`checkbox text-${column.algin}`">
          <a-checkbox
            :value="item.code.toLowerCase()"
            :checked="wallet_currencies_cache.includes(item.code.toLowerCase())"
            @change="onCheckboxCurrenciesChanged"
          />
        </span>
      </template>
    </z-table-select>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { runNotice } from "@/mixins";
import {
  GET_WALLET,
  GET_CURRENCIES,
  GET_WALLET_KINDS,
  GET_WALLET_GATEWAYS,
  GET_BLOCKCHAINS,
  CREATE_WALLET,
  UPDATE_WALLET,
  UPDATE_WALLET_CURRENCIES,
  DELETE_WALLET_CURRENCIES
} from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class WalletSettingUpdateAndCreate extends Vue {
  new_property_value = "";
  page_state = "loading";
  wallet: Wallet = {
    name: "",
    kind: "",
    currencies: [],
    address: "",
    gateway: "",
    max_balance: "",
    blockchain_key: "",
    status: "disabled"
  };
  blockchains: { [key: string]: string } = {};
  currencies: Currency[] = [];
  wallet_settings: WalletSettings = {
    uri: "",
    secret: ""
  };
  wallet_currencies_cache: string[] = [];
  linked_currencies_search = "";
  existing_currencies_search = "";

  get id() {
    return this.$route.params.id;
  }

  get page_type() {
    return this.$route.meta.type;
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Name",
        key: "name",
        value: this.wallet?.name,
        type: "input",
        style: "width: 47.5%",
        edit: true
      },
      {
        title: "Status",
        key: "status",
        value: this.wallet?.status, // active | disabled
        style: "float: right;width: 47.5%",
        style_content:
          "justify-content: space-between;display: flex;flex-wrap: wrap",
        type: "slot"
      },
      {
        title: "Blockchain Key",
        key: "blockchain_key",
        value: this.wallet?.blockchain_key,
        type: "select",
        list: this.blockchains
      },
      {
        title: "Gateway Client",
        key: "gateway",
        value: this.wallet?.gateway,
        type: "select",
        list: this.gateways
      },
      {
        title: "Address",
        key: "address",
        value: this.wallet?.address,
        type: "input",
        edit: true
      }
    ];
  }

  get SETTING_PANEL_RIGHT() {
    return [
      {
        title: "Kind",
        key: "kind",
        value: this.wallet?.kind,
        type: "select",
        list: this.kinds
      },
      {
        title: "Maximum Balance",
        key: "max_balance",
        value: this.wallet?.max_balance,
        type: "input",
        edit: true
      }
    ];
  }

  get SETTING_PANEL_EXTRA() {
    return [
      {
        title: "Uri",
        key: "uri",
        value: this.wallet_settings.uri,
        type: "input",
        edit: true
      },
      {
        title: "Secret",
        key: "secret",
        value: this.wallet_settings.secret,
        type: "input",
        edit: true
      }
    ];
  }

  currency_columns(type: "linked" | "existing") {
    return [
      { title: "", key: "checkbox", algin: "left", scopedSlots: true },
      { title: "Code", key: "code", algin: "left" },
      { title: "Name", key: "name", algin: "left" },
      { title: "Action", key: "action", algin: "right", scopedSlots: true }
    ]
      .filter(col => {
        if (type == "linked" && col.key == "checkbox") return false;
        if (type == "existing" && col.key == "action") return false;

        return true;
      })
      .map(col => {
        if (type == "existing" && col.key == "name") col.algin = "right";

        return col;
      });
  }

  get kinds() {
    return store.state.admin.kinds.reduce((a, b) => ((a[b] = b), a), {});
  }

  get gateways() {
    return store.state.admin.gateways.reduce(
      (a, b) => ((a[b] = b.toUpperCase()), a),
      {}
    );
  }

  get linked_currencies(): Currency[] {
    const search = this.linked_currencies_search;

    if (this.page_state == "loading" || this.page_type == "create") return [];

    return (this.wallet.currencies as string[])
      .map(currency_id => {
        return this.currencies.find(currency => currency.code == currency_id);
      })
      .filter(currency => {
        return (
          currency.code.toLowerCase().includes(search.toLowerCase()) ||
          currency.name.toLowerCase().includes(search.toLowerCase())
        );
      });
  }

  get existing_currencies() {
    const search = this.existing_currencies_search;

    if (this.page_state == "loading") return [];

    return this.currencies.filter(currency => {
      if (!currency.code.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (!currency.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (
        this.wallet.currencies.includes(currency.code) &&
        this.page_type != "create"
      )
        return false;

      return true;
    });
  }

  PROPERTIES() {
    const { wallet_settings } = this;
    if (typeof wallet_settings == "object") {
      return Object.keys(wallet_settings).map(key => {
        return {
          title: key,
          key: key,
          value: wallet_settings[key],
          type: "input",
          edit: true
        };
      });
    } else {
      return [];
    }
  }

  set_wallet_settings_value(key: string, value) {
    this.wallet_settings[key] = value;
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  wallet_settings_as_string() {
    return JSON.stringify(this.wallet_settings, undefined, 2);
  }

  async mounted() {
    this.page_state = "loading";
    await Promise.all([
      this.page_type === "update" ? this.get_wallet() : null,
      store.state.admin.kinds.length ? null : await this.get_kinds(),
      store.state.admin.gateways.length ? null : await this.get_gateways(),
      this.get_blockchains(),
      this.get_currencies()
    ]);
    this.page_state = "ready";
  }

  add_property(property: string) {
    const { wallet_settings } = this;

    if (!property) return;
    this.new_property_value = "";
    wallet_settings[property] = "";
    this.wallet_settings = wallet_settings;

    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  async get_blockchains() {
    try {
      const { data } = await store.dispatch(GET_BLOCKCHAINS);
      this.blockchains = data.reduce((a, b) => ((a[b.key] = b.name), a), {});
    } catch (error) {
      return error;
    }
  }

  async get_currencies() {
    try {
      const { data } = await store.dispatch(GET_CURRENCIES);
      this.currencies = data;
    } catch (error) {
      return error;
    }
  }

  get_kinds() {
    store.dispatch(GET_WALLET_KINDS);
  }

  get_gateways() {
    store.dispatch(GET_WALLET_GATEWAYS);
  }

  async get_wallet() {
    try {
      const { data } = await store.dispatch(GET_WALLET, this.id);

      this.wallet = data;
    } catch (error) {
      return error;
    }
  }

  async onSubmit() {
    const action = this.page_type === "create" ? CREATE_WALLET : UPDATE_WALLET;
    const {
      id,
      address,
      blockchain_key,
      gateway,
      kind,
      max_balance,
      name,
      status
    } = this.wallet;

    let payload: { [key: string]: any } = {
      id,
      address,
      blockchain_key,
      gateway,
      kind,
      max_balance: max_balance || 0,
      name,
      status
    };

    if (Object.values(this.wallet_settings).join("").length > 0) {
      payload = Object.assign({ settings: this.wallet_settings }, payload);
    }

    if (this.page_type == "create") {
      delete payload.id;

      payload.currencies = this.wallet_currencies_cache;
    }

    try {
      await store.dispatch(action, payload);

      runNotice(
        "success",
        this.page_type === "create"
          ? "Create wallet successfully"
          : "Update wallet successfully"
      );
      this.$router.push("/settings/wallets");
    } catch (error) {
      return error;
    }
  }

  onCheckboxCurrenciesChanged(event) {
    const vaule: string = event.target.value;
    const checked: boolean = event.target.checked;

    if (checked) {
      this.wallet_currencies_cache.push(vaule);
    } else {
      const index = this.wallet_currencies_cache.indexOf(vaule);

      if (index < 0) return;

      this.wallet_currencies_cache.splice(index, 1);
    }
  }

  async add_wallet_currencies() {
    try {
      await store.dispatch(UPDATE_WALLET_CURRENCIES, {
        id: this.wallet.id,
        currencies: this.wallet_currencies_cache
      });
      await this.get_wallet();

      this.wallet_currencies_cache = [];
    } catch (error) {
      return error;
    }
  }

  async delete_wallet_currency(currency_id) {
    try {
      await store.dispatch(DELETE_WALLET_CURRENCIES, {
        id: this.wallet.id,
        currencies: currency_id
      });
      await this.get_wallet();
    } catch (error) {
      return error;
    }
  }
}
</script>

<style lang="less">
.page-settings-wallets {
  .z-table {
    width: 100%;

    &-row {
      .code {
        text-transform: uppercase;
      }

      i {
        cursor: pointer;
      }
    }
  }
}
</style>
