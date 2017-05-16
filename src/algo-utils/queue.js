'use strict';

class Queue {
    constructor() {
        this.queueArr = [];
        this.queueCounter = 0;
    }

    enqueue(items) {
        this.queueArr.push(items);
    }

    dequeue() {
        var ret;
        if(this.queueCounter < this.queueArr.length) {
            ret = this.queueArr[this.queueCounter];
            this.queueCounter += 1;
            return ret;
        } else {
            throw 'No element in Queue';
        }
    }

    reset() {
        this.queueArr.length = 0;
        this.queueCounter = 0;
    }
}

export default Queue;
