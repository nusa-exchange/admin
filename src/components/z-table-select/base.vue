<template>
  <div class="z-table-transfer">
    <z-configuration style="padding-left: 0; padding-right: 0;">
      <div class="z-edit-panel" style="padding-left: 0; padding-right: 0;">
        <div
          class="z-edit-panel-head"
          style="padding-left: 20px; padding-right: 20px;"
        >
          <div v-if="leftTitle" class="z-edit-panel-title">
            {{ leftTitle }}
          </div>
        </div>
        <div class="z-edit-panel-content">
          <div
            style="display: flex;width: 100%; padding-left: 20px; padding-right: 20px;align-items: center;"
          >
            <a-input placeholder="Search" v-model="leftSearch" />
            <slot
              v-if="$scopedSlots['left-search-action']"
              name="left-search-action"
            />
          </div>
          <z-table
            :columns="leftColumns"
            :data="leftDataFilter"
            :hover="false"
            :scroll="false"
            :pagination="false"
            :loading="loading"
            style="border: none;"
          >
            <template
              :slot="column.key"
              v-for="column of leftColumns"
              slot-scope="{ item }"
            >
              <slot
                v-if="$scopedSlots[column.key] && column.scopedSlots"
                :name="column.key"
                :item="item"
                :column="column"
              />
              <slot
                v-else-if="column.scopedSlots"
                :name="`left-${column.key}`"
                :item="item"
                :column="column"
              />
            </template>
          </z-table>
        </div>
      </div>
      <div class="z-edit-panel" style="padding-left: 0; padding-right: 0;">
        <div
          class="z-edit-panel-head"
          style="padding-left: 20px; padding-right: 20px;"
        >
          <div v-if="rightTitle" class="z-edit-panel-title">
            {{ rightTitle }}
          </div>
        </div>
        <div class="z-edit-panel-content">
          <div
            style="display: flex;width: 100%; padding-left: 20px; padding-right: 20px;align-items: center;"
          >
            <a-input placeholder="Search" v-model="rightSearch" />
            <slot
              v-if="$scopedSlots['right-search-action']"
              name="right-search-action"
            />
          </div>
          <z-table
            :columns="rightColumns"
            :data="rightDataFilter"
            :hover="false"
            :scroll="false"
            :pagination="false"
            :loading="loading"
            style="border: none;"
          >
            <template
              :slot="column.key"
              v-for="column of rightColumns.filter(c => c.scopedSlots)"
              slot-scope="{ item }"
            >
              <slot
                v-if="$scopedSlots[column.key] && column.scopedSlots"
                :name="column.key"
                :item="item"
                :column="column"
              />
              <slot
                v-else-if="column.scopedSlots"
                :name="`right-${column.key}`"
                :item="item"
                :column="column"
              />
            </template>
          </z-table>
        </div>
      </div>
    </z-configuration>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Column {
  title: string;
  key: string;
  align: string;
}

@Component({})
export default class ZTableSelect extends Vue {
  @Prop() loading: boolean;
  @Prop() leftTitle: string;
  @Prop() rightTitle: string;
  @Prop() leftColumns: Column[];
  @Prop() rightColumns: Column[];
  @Prop() leftData: any[];
  @Prop() rightData: any[];
  @Prop({ default: false }) hiddenAddSelected: boolean;
  @Prop() searchKeys: string[];

  leftSearch = "";
  rightSearch = "";

  get leftDataFilter() {
    return this.leftData.filter(row => {
      for (const key of this.searchKeys) {
        if (row[key].toLowerCase().includes(this.leftSearch.toLowerCase())) return true;
      }
    });
  }

  get rightDataFilter() {
    return this.rightData.filter(row => {
      for (const key of this.searchKeys) {
        if (row[key].toLowerCase().includes(this.rightSearch.toLowerCase())) return true;
      }
    });
  }
}
</script>

<style lang="less">
.z-table-transfer {
  .z-table {
    width: 100%;
  }
}
</style>
