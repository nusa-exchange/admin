<template>
  <div class="page-operators">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="operators_data"
      :scroll="false"
      :pagination="true"
      :page="page"
      :page-size="limit"
      @change-pagination="get_operators"
    >
      <template slot="email" slot-scope="{ item, column }">
        <router-link
          :class="`email text-${column.algin}`"
          :to="`/users/user-directory/${item.admin.uid}`"
        >
          {{ item.admin.email }}
        </router-link>
      </template>
      <template slot="role" slot-scope="{ item, column }">
        <span :class="`role text-${column.algin}`">
          {{ item.admin.role }}
        </span>
      </template>
      <template slot="target" slot-scope="{ item, column }">
        <router-link
          v-if="item.target"
          :class="`target text-${column.algin}`"
          :to="`/users/user-directory/${item.admin.uid}`"
        >
          {{ item.admin.email }}
        </router-link>
        <span v-else :class="`target text-${column.algin}`">
          {{ get_target_email(item.target) }}
        </span>
      </template>
      <template slot="browser" slot-scope="{ item, column }">
        <span :class="`browser text-${column.algin}`">
          {{
            get_user_agent(item.user_agent).getBrowser().name || "Undetected"
          }}
        </span>
      </template>
      <template slot="os" slot-scope="{ item, column }">
        <span :class="`os text-${column.algin}`">
          {{ get_user_agent(item.user_agent).getOS().name || "Undetected" }}
        </span>
      </template>
      <template slot="info" slot-scope="{ item, column }">
        <span :class="`info text-${column.algin}`">
          <a-popover trigger="click" placement="left">
            <template slot="content">
              <z-info-row
                v-for="(data, key) in dataParser(item.data)"
                :key="key"
                :item="{
                  title: key,
                  key: key,
                  value: data,
                  type: 'slot'
                }"
              >
                <template :slot="key">
                  <span>{{ data }}</span>
                </template>
              </z-info-row>
            </template>
            <a-icon type="info-circle" />
          </a-popover>
        </span>
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import UAParser from "ua-parser-js";
import { getDate } from "@/mixins";
import store from "@/store";
import { GET_OPERATORS } from "@/store/types";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  loading = false;
  data: Operator[] = [];
  page = 1;
  limit = 50;

  readonly COLUMN = [
    { title: "Email", key: "email", algin: "left", scopedSlots: true },
    { title: "Date", key: "created_at", algin: "left" },
    { title: "Role", key: "role", algin: "left", scopedSlots: true },
    { title: "Topic", key: "topic", algin: "left" },
    { title: "Action", key: "action", algin: "left" },
    { title: "Target", key: "target", algin: "left", scopedSlots: true },
    { title: "Browser", key: "browser", algin: "left", scopedSlots: true },
    { title: "IP", key: "user_ip", algin: "left" },
    { title: "OS", key: "os", algin: "left", scopedSlots: true },
    { title: "Result", key: "result", algin: "left" },
    { title: "", key: "info", algin: "right", scopedSlots: true }
  ];

  mounted() {
    this.get_operators({
      limit: this.limit,
      page: this.page
    });
  }

  dataParser(data: string) {
    return JSON.parse(data);
  }

  get_user_agent(user_agent) {
    return new UAParser(user_agent);
  }

  get_target_email(target) {
    return target ? target.email : "-";
  }

  get operators_data() {
    return this.data.map(operator => {
      (operator as any).created_at = getDate(operator.created_at as Date, true);

      return operator;
    });
  }

  async get_operators(payload) {
    this.loading = true;
    try {
      const { data, headers } = await store.dispatch(GET_OPERATORS, payload);
      this.page = Number(headers.page);
      this.limit = Number(headers["per-page"]);
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }
}
</script>

<style lang="less">
@import "~@styles/views/users/operators/base";
</style>
