import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
    // .vue

    render() {
        // ui
        return h("div", "Hello World! " + this.msg);
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}