import {Injectable} from "@angular/core";
import "rxjs/Rx";

@Injectable()
export class PusherService {

    defaultChannel: string = 'my-channel';
    pusher:any;

    constructor() {

        // Enable pusher logging - don't include this in production



    }

    init(Pusher: any) {

        Pusher.logToConsole = true;

        this.pusher = new Pusher('3fd1303efc2c6712d0e2', {
            cluster: 'ap1',
            encrypted: true
        });

    }

    subscribe(channelString: string){

        return this.pusher.subscribe(channelString);

    }

    event(channelString:string, event:string, responseToDo: any){

        let channel = this.pusher.subscribe(channelString);
        channel.bind(event, responseToDo);

    }

    bindDefault(event:string, responseToDo: any){

        let channel = this.pusher.subscribe(this.defaultChannel);
        channel.bind(event, responseToDo);

    }



}