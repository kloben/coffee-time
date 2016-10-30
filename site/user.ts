export class User{
    name: string;
    status: string;

    constructor(name:string){
        this.name = name;
    }

    getData(dataId:string): string{
        return this[dataId];
    }

    setStatus(status:string): void{
        this.status = status;
    }
}