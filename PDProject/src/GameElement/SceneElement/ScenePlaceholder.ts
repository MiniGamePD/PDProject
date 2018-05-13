class ScenePlaceholder extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        //纯粹的placeHolder不显示任何东西
        this.renderer = null;
        this.color = owner.color;
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.PlaceHolder;
    }
}