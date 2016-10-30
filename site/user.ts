export class User{
    name: string;
    inCoffee: boolean;
    uuid: string;

    constructor(uuid:string,name:string, inCoffee:boolean){
        this.uuid = uuid;
        this.name = name;
        this.inCoffee = inCoffee;
    }

    getData(dataId:string): string{
        return this[dataId];
    }

    setStatus(inCoffee:boolean): void{
        this.inCoffee = inCoffee;
    }
}