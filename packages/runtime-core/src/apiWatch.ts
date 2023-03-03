import { ReactiveEffect } from "../../reactivity/src/effect";
import { queueFlushCb } from "./scheduler";


export function watchEffect(source) {

    function job() {
        effect.run()
    }

    let cleanup;
    const onCleanup = function(fn) {
        cleanup = effect.onStop = () => {[
            fn()
        ]}
    }

    function getter() {
        if (cleanup) {
            cleanup();
        }
        source(onCleanup)
    }

    const effect = new ReactiveEffect(getter, () => {
        queueFlushCb(job)
    })

    effect.run()

    return () => {
        effect.stop()
    }
}