<template>
  <div class="page-user-directory">
    <z-table
      :loading="loading"
      :columns="columns"
      :data="users"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_users"
    >
      <template slot="otp" slot-scope="{ item, column }">
        <span :class="`text-${column.algin}`">
          {{ item.otp === true ? "ON" : "OFF" }}
        </span>
      </template>
      <template slot="action" slot-scope="{ item, column }">
        <router-link
          :to="`/users/user-directory/${item.uid}`"
          :class="`text-${column.algin}`"
        >
          Info
        </router-link>
      </template>
    </z-table>

    <z-filter-drawer
      ref="filter"
      @reset="onDrawerReset"
      @submit="onDrawerSubmit"
    >
      <z-info-row
        v-for="item in filter_list"
        :item="item"
        :key="item.key"
        v-model="payload_filter[item.key]"
      >
        <template
          v-for="date_picker in [
            { key: 'from', placeholder: 'From date' },
            { key: 'to', placeholder: 'To date' }
          ]"
          :slot="date_picker.key"
        >
          <a-date-picker
            :key="date_picker.key"
            :placeholder="date_picker.placeholder"
            @change="
              moment => {
                payload_filter[date_picker.key] = moment.unix();
              }
            "
          />
        </template>
      </z-info-row>
    </z-filter-drawer>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import { GET_USERS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Template extends Vue {
  loading = false;
  users: User[] = [];
  page = 1;
  limit = 50;
  payload_filter = {
    from: null,
    to: null,
    email: null,
    uid: null,
    role: null,
    country: null,
    level: null,
    state: null
  };

  protected readonly columns = [
    { title: "Email", key: "email", algin: "left" },
    { title: "UID", key: "uid", algin: "left" },
    { title: "Role", key: "role", algin: "left" },
    { title: "Level", key: "level", algin: "center" },
    { title: "OTP", key: "otp", algin: "right", scopedSlots: true },
    { title: "State", key: "state", algin: "right" },
    {
      title: "Action",
      key: "action",
      algin: "right",
      scopedSlots: true
    }
  ];

  get filter_list() {
    return [
      {
        title: "From date",
        key: "from",
        value: this.payload_filter.from,
        type: "slot",
        style: "width: 45%"
      },
      {
        title: "To date",
        key: "to",
        value: this.payload_filter.to,
        type: "slot",
        style: "width: 45%"
      },
      {
        title: "Email",
        key: "email",
        value: this.payload_filter.email,
        type: "input",
        edit: true
      },
      {
        title: "UID",
        key: "uid",
        value: this.payload_filter.uid,
        type: "input",
        edit: true
      },
      {
        title: "Role",
        key: "role",
        value: this.payload_filter.role,
        type: "input",
        edit: true
      },
      {
        title: "Country",
        key: "country",
        value: this.payload_filter.country,
        type: "input",
        edit: true
      },
      {
        title: "Level",
        key: "level",
        value: this.payload_filter.level,
        type: "input",
        edit: true
      },
      {
        title: "State",
        key: "state",
        value: this.payload_filter.state,
        type: "input",
        edit: true
      }
    ];
  }

  onDrawerReset() {
    for (const index in this.payload_filter) {
      this.payload_filter[index] = "";
    }
    (this.$refs.filter as any).remove();
  }

  onDrawerSubmit() {
    this.get_users();
    (this.$refs.filter as any).remove();
  }

  mounted() {
    this.get_users();
    this.set_action_header();
  }

  async get_users(payload = { limit: this.limit, page: this.page }) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(
        GET_USERS,
        Object.assign(payload, this.payload_filter)
      );
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.users = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  set_action_header() {
    this.$route.meta["action-header"] = [
      {
        title: "Filter",
        key: "filter",
        icon: "funnel-plot",
        callback: () => {
          (this.$refs.filter as any).create();
        }
      }
    ];

    this.$nextTick(() => {
      ZSmartModel.emit("set-action-header");
    });
  }
}
</script>
