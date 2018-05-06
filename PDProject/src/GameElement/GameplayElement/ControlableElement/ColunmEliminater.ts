//横排消除
class ColumnEliminater extends EliminateTool
{
    private sceneColumnEliminater:SceneColunmEliminater;

    public constructor()
    {
        super();
        this.sceneColumnEliminater = new SceneColunmEliminater(this);
        this.sceneColumnEliminater.MoveTo(3,0);
        this.eliminateType = EliminateType.Cloumn;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneColumnEliminater);
    }
}