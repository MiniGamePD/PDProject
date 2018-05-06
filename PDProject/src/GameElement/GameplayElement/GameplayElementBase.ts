//和gameplay相关的对象的封装，可能包含一个或多个SceneElement
abstract class GameplayElementBase
{
    public posx:number;
    public posy:number;

    protected sceneElements:SceneElementBase[] = [];
    private sceneElementFilled:boolean = false;

    public GetSceneElements():SceneElementBase[]
    {
        if(!this.sceneElementFilled)
        {
            this.FillSceneElementArray();
            this.sceneElementFilled = true;
        }    

        return this.sceneElements;
    }

    //处理一个scene element被消除之后的逻辑，返回true来让scene继续进入消除检测
    public OnOnEliminate():boolean
    {
        return false;
    }

    protected abstract FillSceneElementArray();
}
