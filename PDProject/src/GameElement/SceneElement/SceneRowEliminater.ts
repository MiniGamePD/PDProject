class SceneRowEliminater extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.canDrop = true;
        this.color = GameElementColor.random;
        this.eliminateMinCount = 1;
        this.RefreshTexture();
        this.eliminateSound = "EliminateRow_mp3";
    }

    public RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = "pd_res_json.RowEliminater";
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
    }
}