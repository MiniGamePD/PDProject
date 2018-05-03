abstract class LogicElementBase
{
    public posx:number;
    public posy:number;

    protected targets:DisplayElementBase[] = [];
    private targetsFilled:boolean = false;

    public GetControledElements():DisplayElementBase[]
    {
        if(!this.targetsFilled)
        {
            this.FillTargets();
            this.targetsFilled = true;
        }    

        return this.targets;
    }

    protected abstract FillTargets();
}