//和gameplay相关的对象的封装，可能包含一个或多个SceneElement
abstract class GameplayElementBase
{
    public posx:number;
    public posy:number;

    protected displayElements:SceneElementBase[] = [];
    private displayElementsFilled:boolean = false;

    public GetDisplayElements():SceneElementBase[]
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
