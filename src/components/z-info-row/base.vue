<template>
  <div
    :class="[
      this['row-prefix-cls'],
      this['row-prefix-cls'] + '-' + item.key,
      this['row-prefix-cls'] + '-type-' + item.type,
      { [`${this['row-prefix-cls']}-desc`]: item.desc }
    ]"
    :style="item.style"
  >
    <div :class="`${this['row-prefix-cls']}-head`" :style="item.style_title">
      <div class="title">{{ item.title }}</div>
      <div v-if="item.desc" class="desc">{{ item.desc }}</div>
    </div>
    <div
      :class="`${this['row-prefix-cls']}-content`"
      :style="item.style_content"
    >
      <div v-if="$slots.prefix" :class="`${this['row-prefix-cls']}-prefix`">
        <slot name="prefix" />
      </div>
      <a-input
        v-if="item.type === 'input' && item.edit"
        type="text"
        :value="item.value"
        :disabled="!item.edit"
        @input="input"
        @focus="focus"
        @blur="blur"
      />
      <span
        :class="[
          'z-info-row-no-edit',
          { 'z-info-row-no-edit-border': item.border }
        ]"
        v-else-if="item.type === 'input' && !item.edit"
      >
        {{ item.value }}
      </span>
      <slot v-else-if="item.type === 'slot'" :name="item.key" :item="item" />
      <a-select
        show-search
        v-else-if="item.type === 'select'"
        :value="(item.value || '').toString()"
        @change="onChange"
        @focus="focus"
        @blur="blur"
      >
        <a-select-option
          v-for="(select, key) in item.list"
          :key="key"
          :value="key"
        >
          {{ select }}
        </a-select-option>
      </a-select>
      <template v-else-if="item.type === 'switch'">
        <a-switch
          :checked="!!switch_active_key"
          :loading="item.loading"
          @change="onChange"
        >
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </template>
      <div v-if="$slots.suffix" :class="`${this['row-prefix-cls']}-suffix`">
        <slot name="suffix" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  private readonly "row-prefix-cls" = "z-info-row";
  @Prop() readonly item!: {
    title: string;
    desc?: string;
    key: string;
    value: string | number | boolean;
    type: "input" | "slot" | "select" | "switch";
    edit?: boolean;
    style?: string;
    style_title?: string;
    style_content?: string;
    border?: boolean;
    list?: {
      [key: string]: string;
    };
    switch: {
      0: string | number | number | boolean;
      1: string | number | number | boolean;
    };
    loading: boolean;
  };

  get switch_active_key() {
    let val = 0;
    for (const key in this.item.switch) {
      if (this.item.value == this.item.switch[key]) {
        val = Number(key);
      }
    }

    return val;
  }

  input($event) {
    const { value } = $event.target;

    this.onChange(value);
  }

  focus() {
    this.$el.classList.add(`${this["row-prefix-cls"]}-focus`);
  }

  blur() {
    this.$el.classList.remove(`${this["row-prefix-cls"]}-focus`);
  }

  onChange(value: string | number | boolean) {
    if (this.item.type == "switch") {
      const val = this.item.switch[Number(value)];

      this.$emit("change", { key: this.item.key, value: val });
      this.$emit("input", val);
    } else {
      this.$emit("change", { key: this.item.key, value: value });
      this.$emit("input", value);
    }
  }
}
</script>
