import Vue from 'vue';
import { Store, IStoreData } from './store';

export default class GettersSetters {
  store!: Store;

  get drivers() {
    return this.store.drivers;
  }

  set drivers(drivers: IStoreData<string>) {
    this.store.drivers = drivers;
  }

  get exchanges() {
    return this.store.exchanges;
  }

  set exchanges(exchanges: IStoreData<Quantex.Exchange>) {
    this.store.exchanges = exchanges;
  }

  get markets() {
    return this.store.markets;
  }

  set markets(markets: IStoreData<Quantex.Market>) {
    this.store.markets = markets;
  }

  get strategies() {
    return this.store.strategies;
  }

  set strategies(strategies: IStoreData<Quantex.Strategy>) {
    this.store.strategies = strategies;
  }

  get strategy_types() {
    return this.store.strategy_types;
  }

  set strategy_types(strategy_types: IStoreData<string>) {
    this.store.strategy_types = strategy_types;
  }
}
