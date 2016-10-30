import { Component } from '@angular/core';
import {PeopleService} from "./people.service";

@Component({
    selector: 'coffee-time',
    template: `
        <div *ngIf="!userSet" class="usernameContainer">
            <h3>¿Tu nombre?</h3>
            <input [(ngModel)]="userName" placeholder="Nombre">
            <div *ngIf="userName.length != 0" class="usernameSet" (click)="register()">Aceptar</div>
        </div>
        <div *ngIf="userSet" class="logoContainer"
            [ngClass]="{'active':inCoffee}"
            (click)="toggleStatus()"></div>
        <div *ngIf="userSet" class="peopleContainer">
            <div *ngFor="let oUser of userList" class="people">
                {{oUser.getData('name')}} {{oUser.getData('inCoffee')}}
            </div>
        </div>
    `,
    providers:[PeopleService]
})
export class AppComponent {
    userSet:boolean = false;
    userName:string = 'Valero';
    inCoffee: boolean = false;

    userList;

    constructor(private peopleService: PeopleService){
        this.userList = peopleService.getPeopleList();
    }

    toggleStatus():void{
        this.inCoffee = !this.inCoffee;
        this.peopleService.setOwnStatus(this.inCoffee);
    }

    register():void{
        if(this.userName.length >= 3){
            this.userSet = true;
            this.peopleService.register(this.userName);
        }
    }
}