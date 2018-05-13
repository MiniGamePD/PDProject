class ScenePlaceholder extends SceneElementBase
{
    public constructor(owner:GameplayElementBase, color:GameElementColor)
    {
        super(owner);
        //纯粹的placeHolder不显示任何东西
        this.renderer = null;
        this.color = color;
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
    }
}