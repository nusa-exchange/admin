import ZModal from "@/layouts/z-modal.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    "z-modal": ZModal
  }
})
export default class ZModalMixin extends Vue {
  @Prop({ default: 400 }) readonly width!: number;

  public modal_enabled = false;
  public onCreate?(payload?): void;
  public onDelete?(payload?): void;

  public create(payload?) {
    this.modal_enabled = true;
    if (typeof this.onCreate === "function") this.onCreate(payload);
  }

  public delete() {
    this.modal_enabled = false;
  }

  @Watch("modal_enabled")
  onModalEnabledChanged(modal_enabled: boolean) {
    if (typeof this.onDelete === "function" && !modal_enabled) this.onDelete();
  }
}
