//横排消除
class CrossEliminater extends EliminateTool
{
    private sceneCrossEliminater:SceneCrossEliminater;

    public constructor()
    {
        super();
        this.sceneCrossEliminater = new SceneCrossEliminater(this);
        this.sceneCrossEliminater.MoveTo(3,0);
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
        this.sceneElements.push(this.sceneCrossEliminater);
    }
}