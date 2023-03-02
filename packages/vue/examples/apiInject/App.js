import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderFoo)]);
  }
}

const ProviderFoo = {
  name: "ProviderFoo",
  setup() {
    provide("foo", "footwo");
    const foo = inject("foo");

    return {
      foo
    }
  },
  render() {
    return h("div", {}, [h("p", {}, `ProviderFoo foo: ${this.foo}`), h(Consumer)]);
  }
}

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", () => "bazVal");

    return {
      foo,
      bar,
      baz
    }
  },
  render() {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
  }
}

export const App = {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  }
}