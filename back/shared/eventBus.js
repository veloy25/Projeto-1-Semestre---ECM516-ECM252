import {EventEmitter} from 'events';

class eventBus extends EventEmitter{
    constructor(){
        super()
    }
}
const eventBus = new EventBus();
export default eventBus;