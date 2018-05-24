class SceneSuperVirus extends ScenePlaceholder
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.PlaceHolder;
        this.RefreshTexture();
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Boss_";
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

    public BlockWidth():number
    {
        return this.owner.blockWidth;
    }

    public BlockHeight():number
    {
        return this.owner.blockHeight;
    }
}