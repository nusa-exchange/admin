import Store from './store';

export default class GettersSetters {
  store!: typeof Store;

  get page_ready() {
    return this.store.page_ready;
  }

  set page_ready(page_ready) {
    this.store.page_ready = page_ready;
  }
}