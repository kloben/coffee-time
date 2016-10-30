import { Component } from '@angular/core';
import {PeopleService} from "./people.service";

@Component({
    selector: 'coffee-time',
    template: `
        <div *ngIf="!userSet" class="usernameContainer isBox">
            <h3>¿Tu nombre?</h3>
            <input [(ngModel)]="userName" placeholder="Nombre">
            <div *ngIf="userName.length != 0" class="usernameSet" (click)="register()">Aceptar</div>
        </div>
        
        <div *ngIf="userSet" class="logoContainer"
            [ngClass]="{'active':inCoffee}"
            (click)="toggleStatus()"></div>
        <div *ngIf="userSet" class="statusIndicator">Hola <b>{{userName}}</b></div>
        <div *ngIf="userSet" class="peopleContainer isBox">
            <div *ngFor="let oUser of userList" class="people">
                {{oUser.getData('name')}} <span>{{oUser.getData('inCoffee')?'En el café':'Trabajando'}}</span>
            </div>
            <div *ngIf="userList.length == 0">
                Nadie por aqui...
            </div>
            
            <input placeholder="Mensaje para todos" (keyup)="sendToAll($event.keyCode)" class="msgToAll" *ngIf="userList.length != 0" [(ngModel)]="chatText" type="text">
        </div>
    `,
    providers:[PeopleService]
})
export class AppComponent{
    userSet:boolean = false;
    userName:string = 'Valero';
    inCoffee: boolean = false;
    chatText: string = "";

    userList;

    constructor(private peopleService: PeopleService){
        this.userList = peopleService.getPeopleList();

        var aName = localStorage.getItem('savedName');
        if(aName){
            this.userName = aName;
            this.userSet = true;
            this.peopleService.register(this.userName);
        }
        if(Notification.permission == 'default'){
            Notification.requestPermission();
        }
    }

    toggleStatus():void{
        this.inCoffee = !this.inCoffee;
        this.peopleService.setOwnStatus(this.inCoffee);
    }

    register():void{
        if(this.userName.length >= 3){
            localStorage.setItem('savedName', this.userName);
            this.userSet = true;
            this.peopleService.register(this.userName);
        }
    }

    sendToAll(key):void{
        if(key==13 && this.chatText.length != 0){
            this.peopleService.sendToAll(this.chatText);
            this.chatText = "";
        }
    }
}