import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
    setup() {
        return {}
    },
    render() {
        const foo = h("p", {}, "foo");

        // renderSlots
        // 获取到渲染的元素
        // 获取到渲染的位置
        // 作用域插槽
        const age = 10;
        return h("div", {}, [
            renderSlots(this.$slots, "header", {
                age
            }),
            foo,
            renderSlots(this.$slots, "footer")
        ]);
    }
}