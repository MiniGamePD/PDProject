abstract class LogicElementBase
{
    public posx:number;
    public posy:number;

    protected displayElements:DisplayElementBase[] = [];
    private displayElementsFilled:boolean = false;

    public GetDisplayElements():DisplayElementBase[]
    {
        if(!this.displayElementsFilled)
        {
            this.FillDisplayElementArray();
            this.displayElementsFilled = true;
        }    

        return this.displayElements;
    }

    protected abstract FillDisplayElementArray();
}
