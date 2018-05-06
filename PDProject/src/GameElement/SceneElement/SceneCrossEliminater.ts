class SceneCrossEliminater extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.canDrop = true;
        this.RefreshTexture();
    }

    public RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = "pd_res_json.Virus_Red";
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
        this.renderer.rotation = 180;
    }
}