import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    // .vue

    render() {
        // ui
        return h(
          "div",
          {
            id: "root",
            class: ["red", "hard"],
          },
        //   "Hello World! " + this.msg
        // Array of children
        [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
        );
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}