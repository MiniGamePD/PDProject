class LogicVirus extends SceneElementBase
{
    public constructor()
    {
        super();
        this.renderer = new egret.Bitmap();       
        this.color = this.RandomColor(); 
        this.canDrop = false;
        this.RefreshTexture();
    }

    public RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = "pd_res_json.Virus_";
        switch(this.color)
        {
            case GameElementColor.red:
                path += "Red";
                break;
            case GameElementColor.blue:
                path += "Blue";
                break;
            case GameElementColor.yellow:
                path += "Yellow";
                break;
            default:
                if(DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }    
                break;
        }
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
    }
}