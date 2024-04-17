<template>
  <div class="pending-table">
    <z-table
      :loading="pending.loading"
      :columns="pending.columns"
      :data="pending.data"
      :hover="true"
      :scroll="false"
      :pagination="true"
      :total="pending.total"
      :page="pending.page"
      :page-size="pending.limit"
      @click="on_table_click"
      @change-pagination="change_pagination"
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class PendingTable extends Vue {
  @Prop({
    default: () => ({
      loading: false,
      data: [],
      columns: [],
      page: 1,
      total: 0,
      limit: 50
    })
  })
  readonly pending!: {
    loading: boolean;
    type: string;
    data: UserLabel[];
    columns: any[];
    page: number;
    total: number;
    limit: number;
    load_data(type: string, payload?: { [key: string]: string });
  };

  on_table_click(item) {
    this.$router.push(`/users/user-directory/${item.uid}`);
  }

  change_pagination(payload) {
    this.pending.load_data(this.pending.type, payload);
  }
}
</script>
