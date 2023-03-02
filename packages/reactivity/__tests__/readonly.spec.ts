import { isReadOnly, readonly, isProxy } from "../src/reactive"
import { vi } from "vitest";

describe('readonly', () => {
    it('happy path', () => {
        // not set
        const original = { foo: 1, bar: { baz: 2 } };
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(isReadOnly(wrapped)).toBe(true);
        expect(isReadOnly(original)).toBe(false);
        expect(isReadOnly(wrapped.bar)).toBe(true);
        expect(isProxy(wrapped)).toBe(true);
        expect(wrapped.foo).toBe(1);
    })

    it('warn then call set', () => {
        // console.warn()
        // mock
        console.warn = vi.fn();

        const user = readonly({
            age: 10
        })

        user.age = 11;

        expect(console.warn).toBeCalled();
    })
})