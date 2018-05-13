class ScenePlaceholder extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        //纯粹的placeHolder不显示任何东西
        //TODO: scene还没有兼容placeholder，暂时先new一个
        this.renderer = new egret.Bitmap();

        //For DEBUG
        let path = "pd_res_json.Virus_Yellow";
        this.renderer.texture = this.GetTexture(path);
        this.renderer.alpha = 0.2;
        //For DEBUG

        this.color = owner.color;
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.PlaceHolder;
    }
}