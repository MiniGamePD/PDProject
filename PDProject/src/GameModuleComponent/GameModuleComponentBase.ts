class GameModuleComponentBase extends egret.EventDispatcher
{
    protected isWorking:boolean = false;

    public Work(param?:any):any
    {
        this.isWorking = true;
    }

    public Sleep()
    {
        this.isWorking = false;
    }
}