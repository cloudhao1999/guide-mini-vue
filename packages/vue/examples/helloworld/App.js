import { h } from "../../dist/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;

export const App = {
    // .vue

    render() {
        window.self = this;
        // ui
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
            onClick() {
              console.log("click");
            }
          },
          // settup state
          // this.$el -> get root element
          // "Hello World! " + this.msg
          // Array of children
          // [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
          [h("div", {}, "hi, " + this.msg), h(Foo, { count: 1 })]
        );
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}