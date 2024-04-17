import Store from "./store";

export default class GettersSetters {
  store!: typeof Store;

  get blockchains() {
    return this.store.blockchains;
  }

  set blockchains(blockchains: Blockchain[]) {
    this.store.blockchains = blockchains;
  }
}
