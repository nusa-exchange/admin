<template>
  <div v-if="!loading" class="page-exchange-currencies update">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-head">
          <div class="z-edit-panel-title">
            {{ title }}
          </div>
        </div>
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_LEFT"
            v-model="currency[setting.key]"
            :key="setting.key"
            :item="setting"
          />
        </div>
      </div>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_RIGHT"
            v-model="currency[setting.key]"
            :key="setting.key"
            :item="setting"
          >
            <template v-if="setting.type === 'slot'" :slot="setting.key">
              <span>
                {{ currency[setting.key] ? "Enabled" : "Disabled" }}
              </span>
              <span>
                <a-switch v-model="currency[setting.key]" />
              </span>
            </template>
          </z-info-row>
          <div class="z-edit-panel-action">
            <a-button @click="onSubmit" type="primary">Submit</a-button>
          </div>
        </div>
      </div>
    </z-configuration>
    <z-table
      v-if="type == 'update'"
      :columns="NETWORK_COLUMN"
      :data="currency.networks"
      :hover="true"
      :scroll="false"
      :pagination="false"
      @click="on_table_network_clicked"
    >
      <template slot="deposit_enabled" slot-scope="{ item, column }">
        <span :class="`deposit_enabled text-${column.algin}`">
          <span @click.stop.prevent>
            <a-switch
              :checked="item.deposit_enabled"
              @click="
                update_network(item, { deposit_enabled: !item.deposit_enabled })
              "
            >
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </span>
        </span>
      </template>
      <template slot="withdrawal_enabled" slot-scope="{ item, column }">
        <span :class="`withdrawal_enabled text-${column.algin}`">
          <span @click.stop.prevent>
            <a-switch
              :checked="item.withdrawal_enabled"
              @click="
                update_network(item, {
                  withdrawal_enabled: !item.withdrawal_enabled
                })
              "
            >
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </span>
        </span>
      </template>
    </z-table>

    <div v-if="type == 'update'" class="add-network">
      <a-button type="primary" @click="add_network">ADD NETWORK</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { runNotice } from "@/mixins";
import {
  GET_CURRENCY,
  CREATE_CURRENCY,
  UPDATE_CURRENCY,
  UPDATE_BLOCKCHAIN_CURRENCY
} from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  new_property_value = "";
  loading = false;
  currency: Currency = {
    id: null,
    name: "",
    status: "disabled",
    code: "",
    type: "coin",
    precision: null,
    position: null,
    icon_url: null,
    price: 0,
    networks: []
  };

  get title() {
    return this.type == "update" ? "Update Currency" : "Create Currency";
  }

  get NETWORK_COLUMN() {
    return [
      { title: "ID", key: "id", algin: "left" },
      { title: "Key", key: "blockchain_key", algin: "left" },
      { title: "Min deposit", key: "min_deposit_amount", algin: "left" },
      { title: "Min withdrawal", key: "min_withdraw_amount", algin: "left" },
      { title: "Withdrawal fee", key: "withdraw_fee", algin: "right" },
      { title: "Subunits", key: "subunits", algin: "right" },
      {
        title: "Deposit Enabled",
        key: "deposit_enabled",
        algin: "right",
        scopedSlots: true
      },
      {
        title: "Withdrawal Enabled",
        key: "withdrawal_enabled",
        algin: "right",
        scopedSlots: true
      },
      // { title: "", key: "action", algin: "right" }
    ];
  }

  get type() {
    return this.$route.meta.type;
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Name",
        key: "name",
        value: this.currency.name,
        type: "input",
        style: "width: 47.5%",
        edit: true
      },
      {
        title: "Status",
        key: "status",
        value: this.currency.status,
        style: "position: absolute; width: auto; right: 0px;padding-top: 24px;",
        type: "switch",
        switch: {
          0: "disabled",
          1: "enabled"
        }
      },
      {
        title: "Code",
        key: "code",
        value: this.currency.code,
        type: "input",
        edit: true
      },
      {
        title: "Type",
        key: "type",
        value: this.currency.type,
        type: "select",
        list: {
          coin: "coin",
          fiat: "fiat"
        }
      },
      {
        title: "Precision",
        key: "precision",
        value: this.currency.precision,
        type: "input",
        edit: true
      }
    ];
  }

  get SETTING_PANEL_RIGHT() {
    return [
      {
        title: "Position",
        key: "position",
        value: this.currency.position,
        type: "input",
        edit: true
      },
      {
        title: "Icon URL",
        key: "icon_url",
        value: this.currency.icon_url,
        type: "input",
        edit: true
      },
      {
        title: "Price",
        key: "price",
        value: this.currency.price,
        type: "input",
        edit: true
      }
    ];
  }

  get code() {
    return this.$route.params.code;
  }

  async beforeMount() {
    this.loading = true;
    if (this.type === "update") await this.get_currency();
    this.loading = false;
  }

  async get_currency() {
    try {
      const { data } = await store.dispatch(GET_CURRENCY, this.code);
      this.currency = data;
    } catch (error) {
      return error;
    }
  }

  add_property(property: string) {
    const { options } = this.currency as any;

    if (!property) return;
    this.new_property_value = "";
    options[property] = "";
    (this.currency as any).options = options;

    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  remove_property(property) {
    delete (this.currency as any).options[property];

    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  /**
   * @method $forceUpdate for update value input when it changed
   */
  set_options_value(key: string, value) {
    (this.currency as any).options[key] = value;
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  async onSubmit() {
    let payload = {
      code: this.currency.code,
      name: this.currency.name,
      type: this.currency.type,
      status: this.currency.status,
      position: this.currency.position,
      precision: this.currency.precision,
      price: this.currency.price,
      icon_url: this.currency.icon_url
    };

    if (this.type == "update") {
      payload = Object.assign(payload, { id: this.currency.id });
    }

    try {
      await store.dispatch(
        this.type === "update" ? UPDATE_CURRENCY : CREATE_CURRENCY,
        payload
      );

      runNotice(
        "success",
        this.type === "update"
          ? "Currency updated successfully"
          : "Currency created successfully"
      );
      this.$router.push("/exchange/currencies");
    } catch (error) {
      return error;
    }
  }

  on_table_network_clicked(item) {
    this.$router.push({
      path: `/exchange/currencies/${this.currency.code}/networks/${item.id}`
    });
  }

  add_network() {
    this.$router.push({
      path: `/exchange/currencies/${this.currency.code}/networks/create`
    });
  }

  async update_network(network: BlockchainCurrency, payload) {
    try {
      await store.dispatch(
        UPDATE_BLOCKCHAIN_CURRENCY,
        Object.assign(payload, { id: network.id })
      );
      const index = this.currency.networks.findIndex(n => n.id == network.id);

      this.currency.networks[index] = Object.assign(network, payload);
    } catch (error) {
      return error;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/exchange/currencies/update";
</style>
