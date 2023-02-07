import { h } from "../../lib/guide-mini-vue.esm.js";

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
          },
          // settup state
          // this.$el -> get root element
          "Hello World! " + this.msg
        // Array of children
        // [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
        );
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}