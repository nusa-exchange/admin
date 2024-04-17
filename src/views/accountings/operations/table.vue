<template>
  <z-table
    class="assets-page"
    :loading="operation.loading"
    :columns="operation.columns"
    :data="operation.data"
    :hover="true"
    :scroll="false"
    :pagination="true"
    :page="operation.page"
    :page-size="operation.limit"
    @change-pagination="change_pagination"
  >
  </z-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class OperationTable extends Vue {
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
  readonly operation!: {
    loading: boolean;
    type: string;
    data:
      | Operation.Asset[]
      | Operation.Liability[]
      | Operation.Revenue[]
      | Operation.Expense[];
    columns: any[];
    page: number;
    total: number;
    limit: number;
    load_data(type: string, payload?: { [key: string]: string });
  };

  change_pagination(payload) {
    this.operation.load_data(this.operation.type, payload);
  }
}
</script>
