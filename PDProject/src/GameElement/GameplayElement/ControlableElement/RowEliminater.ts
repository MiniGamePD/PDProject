//横排消除
class RowEliminater extends EliminateTool
{
    private sceneRowEliminater:SceneRowEliminater;

    public constructor()
    {
        super();
        this.sceneRowEliminater = new SceneRowEliminater(this);
        this.sceneRowEliminater.MoveTo(3,0);
        this.eliminateType = EliminateType.Row;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneRowEliminater);
    }
}