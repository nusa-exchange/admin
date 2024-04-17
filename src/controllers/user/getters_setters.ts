import Store from "./store";

export default class GettersSetters {
  store!: typeof Store;

  get state() {
    return this.store.state;
  }

  set state(state) {
    this.store.state = state;
  }

  get email() {
    return this.store.email;
  }

  set email(email) {
    this.store.email = email;
  }

  get uid() {
    return this.store.uid;
  }

  set uid(uid) {
    this.store.uid = uid;
  }

  get role() {
    return this.store.role;
  }

  set role(role) {
    this.store.role = role;
  }

  get level() {
    return this.store.level;
  }

  set level(level) {
    this.store.level = level;
  }

  get otp() {
    return this.store.otp;
  }

  set otp(otp) {
    this.store.otp = otp;
  }

  get need2fa() {
    return this.store.need2fa;
  }

  set need2fa(need2fa) {
    this.store.need2fa = need2fa;
  }
}
