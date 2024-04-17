import GettersSetters from "./getters_setters";
import Store, { IStore } from "./store";
import { applyMixins } from "../mixins";

class PublicController {
  store = Store;
}

interface PublicController extends GettersSetters {
  store: IStore;
};

applyMixins(PublicController, [GettersSetters]);

export { PublicController };

const class_mounted = new PublicController();

export default class_mounted;
