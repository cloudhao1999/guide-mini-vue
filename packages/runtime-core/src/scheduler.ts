
const queue: any[] = []

let isFlushPending = false

export function nextTick(fn?: () => void) {
    const p = Promise.resolve()
    if (fn) {
        p.then(fn)
    }
    return p
}

export function queueJobs(job) {
    if (!queue.includes(job)) {
        queue.push(job)
    }
    queueFlush()
}

function queueFlush() {
    if (isFlushPending) return;
    isFlushPending = true
    nextTick(flushJobs)
}

function flushJobs() {
    isFlushPending = false
    let job;
    while ((job = queue.shift()) !== undefined) {
        job()
    }
}