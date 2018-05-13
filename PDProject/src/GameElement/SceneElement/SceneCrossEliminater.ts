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

    public RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = "pd_res_json.CrossEliminater";
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
    }
}