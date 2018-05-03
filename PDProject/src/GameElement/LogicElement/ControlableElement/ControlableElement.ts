abstract class ControlableElement
{
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

    public abstract GetRotateCenter(): number[];

    protected abstract FillTargets();
}