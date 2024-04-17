<template>
  <div v-if="!loading" :class="['page-exchange-ieo', page_type]">
    <z-configuration>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_LEFT"
            v-model="ieo[setting.key]"
            :key="setting.key"
            :item="setting"
          />
        </div>
      </div>
      <div class="z-edit-panel">
        <div class="z-edit-panel-content">
          <z-info-row
            v-for="setting in SETTING_PANEL_RIGHT"
            v-model="ieo[setting.key]"
            :key="setting.key"
            :item="setting"
          >
            <template slot="start_time">
              <a-date-picker
                :defaultValue="
                  page_type == 'update' ? moment.unix(ieo.start_time) : null
                "
                @change="onStartTimeChanged"
              />
            </template>
            <template slot="end_time">
              <a-date-picker
                :defaultValue="
                  page_type == 'update' ? moment.unix(ieo.end_time) : null
                "
                @change="onEndTimeChanged"
              />
            </template>
          </z-info-row>
          <div class="z-edit-panel-action">
            <a-button @click="onSubmit" type="primary">
              {{ page_type == "update" ? "Update" : "Submit" }}
            </a-button>
          </div>
        </div>
      </div>
    </z-configuration>

    <z-configuration>
      <ckeditor v-model="ieo.data" :editor="editor" :config="editorConfig" />
    </z-configuration>

    <z-table-select
      v-if="page_type != 'create'"
      left-title="Linked Payment Currency"
      right-title="Existing Payment Currency"
      :left-columns="currency_columns('linked')"
      :right-columns="currency_columns('existing')"
      :left-data="linked_currencies"
      :right-data="existing_currencies"
      :search-keys="['code']"
      style="margin-top: 12px"
    >
      <template slot="right-search-action">
        <a-button
          type="primary"
          style="margin-left: 12px"
          :disabled="currency_cached.length == 0"
          @click="add_payment_currencies"
        >
          Add selected
        </a-button>
      </template>
      <template slot="code" slot-scope="{ item, column }">
        <span :class="`code text-${column.algin}`">
          {{ item.code.toUpperCase() }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <span :class="`action text-${column.algin}`">
          <a-icon
            type="delete"
            theme="filled"
            @click="delete_linked_currency(item.code)"
          />
        </span>
      </template>
      <template slot="checkbox" slot-scope="{ item, column }">
        <span :class="`checkbox text-${column.algin}`">
          <a-checkbox
            :value="item.code"
            :checked="currency_cached.includes(item.code)"
            @change="onCheckboxCurrencyChanged"
          />
        </span>
      </template>
    </z-table-select>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import {
  ADD_IEO_CURRENCIES,
  CREATE_IEO,
  GET_CURRENCIES,
  GET_IEO,
  REMOVE_IEO_CURRENCIES,
  UPDATE_IEO
} from "@/store/types";
import moment from "moment";
import { Vue, Component } from "vue-property-decorator";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({})
export default class IEOCreateUpdate extends Vue {
  loading = false;
  ieo: IEO = {};
  currencies: Currency[] = [];

  editor = ClassicEditor;
  editorData = "";
  editorConfig = {};
  linked_currencies_search = "";
  existing_currencies_search = "";

  currency_cached = [];

  get moment() {
    return moment;
  }

  get page_type() {
    return this.$route.meta.type;
  }

  get SETTING_PANEL_LEFT() {
    return [
      {
        title: "Currency",
        key: "currency_id",
        value: this.ieo.currency_id,
        type: "select",
        list: this.currencies
          .filter(c => c.code != this.ieo.main_payment_currency)
          .reduce((a, b) => ((a[b.code] = b.code.toUpperCase()), a), {})
      },
      {
        title: "Main Paymnet Currency",
        key: "main_payment_currency",
        value: this.ieo.main_payment_currency,
        type: "select",
        list: this.currencies
          .filter(c => c.code != this.ieo.currency_id)
          .reduce((a, b) => ((a[b.code] = b.code.toUpperCase()), a), {})
      },
      {
        title: "Price",
        key: "price",
        type: "input",
        value: this.ieo.price,
        edit: true
      },
      {
        title: "Origin Quantity",
        key: "origin_quantity",
        type: "input",
        value: this.ieo.origin_quantity,
        edit: true
      },
      {
        title: "Limit Per User",
        key: "limit_per_user",
        type: "input",
        value: this.ieo.limit_per_user,
        edit: true
      }
    ];
  }

  get SETTING_PANEL_RIGHT() {
    return [
      {
        title: "Min Amount",
        key: "min_amount",
        type: "input",
        value: this.ieo.min_amount,
        style: "width: 50%;",
        edit: true
      },
      {
        title: "State",
        key: "state",
        value: this.ieo.state,
        style: "position: absolute; width: auto; right: 0px;padding-top: 24px;",
        type: "switch",
        switch: {
          0: "disabled",
          1: "enabled"
        }
      },
      {
        title: "Start Time",
        key: "start_time",
        value: this.ieo.start_time,
        type: "slot"
      },
      {
        title: "End Time",
        key: "end_time",
        value: this.ieo.end_time,
        type: "slot"
      },
      {
        title: "Banner Url",
        key: "banner_url",
        type: "input",
        value: this.ieo.banner_url,
        edit: true
      }
    ];
  }

  currency_columns(type: string) {
    return [
      { title: "", key: "checkbox", algin: "left", scopedSlots: true },
      { title: "Code", key: "code", algin: "left", scopedSlots: true },
      { title: "Name", key: "name", algin: "left" },
      { title: "Action", key: "action", algin: "right", scopedSlots: true }
    ]
      .filter(x => {
        if (type == "linked" && x.key == "checkbox") return false;
        if (type != "linked" && x.key == "action") return false;

        return true;
      })
      .map(col => {
        if (type != "linked" && col.key == "name") col.algin = "right";

        return col;
      });
  }

  get linked_currencies() {
    const search = this.linked_currencies_search;

    return (this.ieo.payment_currencies || [])
      .map(payment_currency_id =>
        this.currencies.find(currency => currency.code == payment_currency_id)
      )
      .filter(currency => {
        return currency.code.includes(search.toLowerCase());
      });
  }

  get existing_currencies() {
    const search = this.existing_currencies_search;

    return this.currencies.filter(currency => {
      for (const payment_currency_id of this.ieo.payment_currencies || []) {
        if (currency.code == payment_currency_id) return false;
      }

      if (this.existing_currencies_search.length) {
        return currency.code.includes(search.toLowerCase());
      }

      return true;
    });
  }

  mounted() {
    this.get_currencies();

    if (this.page_type == "update") {
      this.get_ieo();
    }
  }

  async get_currencies() {
    try {
      const { data } = await store.dispatch(GET_CURRENCIES, { limit: 100 });
      this.currencies = data;
    } catch (error) {
      return error;
    }
  }

  async add_payment_currencies() {
    try {
      await store.dispatch(ADD_IEO_CURRENCIES, {
        id: this.ieo.id,
        currencies: this.currency_cached
      });
      this.ieo.payment_currencies.push(...this.currency_cached);

      this.currency_cached = [];
    } catch (error) {
      return error;
    }
  }

  async delete_linked_currency(id: string) {
    try {
      await store.dispatch(REMOVE_IEO_CURRENCIES, {
        id: this.ieo.id,
        currencies: [id]
      });
      const index = this.ieo.payment_currencies.findIndex(payment_currency_id => payment_currency_id == id);

      if (index >= 0) {
        this.ieo.payment_currencies.splice(index, 1);
      }
    } catch (error) {
      return error;
    }
  }

  onCheckboxCurrencyChanged(event) {
    const value: number = event.target.value;
    const checked: boolean = event.target.checked;

    if (checked) {
      this.currency_cached.push(value);
    } else {
      const index = this.currency_cached.indexOf(value);

      if (index < 0) return;

      this.currency_cached.splice(index, 1);
    }
  }

  onStartTimeChanged(date?: moment.Moment) {
    if (date) {
      this.ieo.start_time = date.unix();
    } else {
      this.ieo.start_time = null;
    }
  }

  onEndTimeChanged(date?: moment.Moment) {
    if (date) {
      this.ieo.end_time = date.unix();
    } else {
      this.ieo.end_time = null;
    }
  }

  async get_ieo() {
    this.loading = true;
    try {
      const { data } = await store.dispatch(GET_IEO, this.$route.params.id);
      this.ieo = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    let payload = {
      currency_id: this.ieo.currency_id,
      main_payment_currency: this.ieo.main_payment_currency,
      price: this.ieo.price,
      origin_quantity: this.ieo.origin_quantity,
      limit_per_user: this.ieo.limit_per_user,
      min_amount: this.ieo.min_amount,
      state: this.ieo.state || "disabled",
      start_time: this.ieo.start_time,
      end_time: this.ieo.end_time,
      data: this.ieo.data || null,
      banner_url: this.ieo.banner_url
    };

    if (this.page_type == "update") {
      payload = Object.assign(payload, { id: this.ieo.id });
    }

    try {
      await store.dispatch(
        this.page_type == "update" ? UPDATE_IEO : CREATE_IEO,
        payload
      );
      this.$router.push("/exchange/ieo");
    } catch (error) {
      return error;
    }
  }
}
</script>

<style lang="less">
.page-exchange-ieo {
  --ck-color-text: var(--text-color);
  --ck-color-base-border: var(--border-color);
  --ck-color-base-background: var(--bg-card-color);
  --ck-color-base-foreground: var(--bg-card-color);
  --ck-color-toolbar-background: rgba(255, 255, 255, 0.05);
  --ck-color-toolbar-border: var(--border-color);
  --ck-color-dropdown-panel-border: var(--border-color);
  --ck-color-button-default-hover-background: var(--color-gray);
  --ck-color-button-on-hover-background: var(--color-gray);
  --ck-color-button-on-background: var(--blue-color);
  --ck-color-list-background: var(--bg-dropdown-color);
  --ck-color-dropdown-panel-background: var(--bg-dropdown-color);
}

.ck-editor {
  width: 100%;
}
</style>
