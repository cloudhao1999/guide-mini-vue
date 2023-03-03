
const queue: any[] = []
const activePreFlushCbs: any[] = []

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

export function queueFlushCb(job) {
    activePreFlushCbs.push(job);

    queueFlush()
}

function flushJobs() {
    isFlushPending = false

    flushPreFlushCbs()

    let job;
    while ((job = queue.shift()) !== undefined) {
        job()
    }
}

function flushPreFlushCbs() {
    for (let i = 0; i < activePreFlushCbs.length; i++) {
        activePreFlushCbs[i]()
    }
}
