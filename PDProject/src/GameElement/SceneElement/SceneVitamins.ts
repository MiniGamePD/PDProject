class SceneVitamins extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.color = this.RandomColor(); 
        this.canDrop = true;
        this.elementType = SceneElementType.Vitamins;
        this.RefreshTexture();
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.eliminateSound = "Boom_mp3";
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Vitamins_";
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
        return path;
    }
}