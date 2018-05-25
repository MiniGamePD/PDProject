class SceneCrossEliminater extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.canDrop = true;
        this.color = GameElementColor.random;
        this.eliminateMinCount = 1;
        this.elementType = SceneElementType.CrossEliminater;
        this.RefreshTexture();
        this.eliminateSound = "EliminateRow_mp3";
    }

    protected GetResPathByColor():string
    {
        return "pd_res_json.CrossEliminater";
    }

    public PlayEliminateAnim()
    {
        this.PlayParticalEff();
        this.PlayScaling();
        this.MoveOneSide(Direction.Up);
        this.MoveOneSide(Direction.Down);
        this.MoveOneSide(Direction.Left);
        this.MoveOneSide(Direction.Right);
    }
}