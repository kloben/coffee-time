/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" />
import * as io from 'socket.io-client';
import {User} from "./user";
declare var Notification: any;

export class PeopleService {
    private url = '/';
    private userName:string;
    private socket;

    private peopleList = [];

    setOwnStatus(status:boolean){
        this.socket.emit('changeStatus', status);
    }

    getPeopleList() {
        return this.peopleList;
    }

    sendToAll(msg){
        this.socket.emit('msgToAll', msg);
    }

    register(userName){
        this.userName = userName;

        this.socket = io(this.url);
        this.socket.emit('register', this.userName);

        this.socket.on('statusChanged', (data) => {
            let count = this.peopleList.length;

            for(var i = 0;i<count;i++){
                if(this.peopleList[i].getData('uuid') == data.uuid){
                    this.peopleList[i].setStatus(data.inCoffee);
                    if(data.inCoffee){
                        new Notification('Coffee Time', {icon:'/dist/img/coffee.jpg',body: this.peopleList[i].getData('name')+' quiere café'});
                    }
                    return;
                }
            }
        });

        this.socket.on('registerOk', (data) => {
            for(var sUuid in data.connectedUsers){
                let oUser = data.connectedUsers[sUuid];

                this.peopleList.push(new User(sUuid, oUser.name, oUser.inCoffee));
            }
        });


        this.socket.on('newUser', (data) => {
           this.peopleList.push(new User(data.uuid, data.name, data.inCoffee));
        });

        this.socket.on('userDisconnected', (data) => {
            let count = this.peopleList.length;

            for(var i = 0;i<count;i++){
                if(this.peopleList[i].getData('uuid') == data.uuid){
                    this.peopleList.splice(i, 1);
                    return;
                }
            }
        });

        this.socket.on('msgBroadcast', (data) => {
            new Notification(data.userName+' dice', {icon:'/dist/img/coffee.jpg',body: data.msg})
        });
    }
}