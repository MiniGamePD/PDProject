class PillRenderer extends DisplayElementBase
{
    public constructor()
    {
        super();
        this.renderer = new egret.Bitmap();        
    }

    public ChangePillTexByColor():void
    {
        this.color = this.RandomColor();
        let texture: egret.Texture;
        switch(this.color)
        {
            case GameElementColor.red:
                texture = this.GetTexture("pd_res_json.Pill_Red");
                break;
            case GameElementColor.blue:
                texture = this.GetTexture("pd_res_json.Pill_Blue");
                break;
            case GameElementColor.yellow:
                texture = this.GetTexture("pd_res_json.Pill_Yellow");
                break;
            default:
                if(DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }    
                break;
        }

		this.renderer.texture = texture;
    }
}

