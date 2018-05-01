class GameModuleComponentBase extends egret.EventDispatcher
{
    protected isWorking:boolean = false;

    public Work()
    {
        this.isWorking = true;
    }

    public Sleep()
    {
        this.isWorking = false;
    }
}