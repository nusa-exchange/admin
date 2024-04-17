<template>
  <div
    class="z-table"
    :class="{
      'z-table-no-scroll': !scroll,
      'z-table-hoverable': hover,
      'z-table-empty': !data.length,
      'z-table-loading': loading
    }"
  >
    <div class="z-table-head">
      <span
        v-for="column of columns"
        v-text="column.title"
        :key="column.key"
        :class="[`${column.key} text-${column.algin}`]"
      />
    </div>
    <div class="z-table-content">
      <z-loading v-if="loading" />
      <z-empty v-else-if="!data.length && allowEmpty" />
      <p
        v-for="item of data"
        class="z-table-row"
        :key="item.key"
        @click="onClick(item)"
      >
        <template v-for="column of columns">
          <slot
            v-if="column.scopedSlots"
            :name="column.key"
            :item="item"
            :column="column"
          />
          <span
            v-else
            :key="column.key"
            :class="[column.key, `text-${column.algin}`]"
            v-text="value_by_key(item, column.key)"
          />
        </template>
      </p>
      <p v-if="$slots['row-extend']" class="z-table-row">
        <slot name="row-extend" />
      </p>
    </div>
    <z-pagination
      class="z-table-pagination"
      v-if="pagination"
      size="small"
      :loading="loading"
      :page="page"
      :page-size="pageSize"
      :count-row="data.length"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Column {
  title: string;
  key: string;
  algin: "left" | "center" | "right";
  sort?: boolean; //TODO Add support sort table in this components
  scopedSlots: boolean;
}

@Component({})
export default class ZTable extends Vue {
  @Prop() readonly title!: string;
  @Prop({ default: false }) readonly loading!: boolean;
  @Prop() readonly columns!: Column[];
  @Prop() readonly data!: any[];
  @Prop({ default: false }) readonly hover!: boolean;
  @Prop({ default: true }) readonly scroll!: boolean;
  @Prop() readonly pagination!: boolean;
  @Prop() readonly total!: number;
  @Prop() readonly page!: number;
  @Prop() readonly pageSize!: number;
  @Prop({ default: true }) readonly allowEmpty!: boolean;

  onChange(page: number) {
    this.$emit("change-pagination", { page, limit: this.pageSize });
  }

  onClick(item) {
    this.$emit("click", item);
  }

  value_by_key(item: any, key: string) {
    return item[key];
  }
}
</script>
