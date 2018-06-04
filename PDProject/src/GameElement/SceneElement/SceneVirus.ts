class SceneVirus extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.color = this.RandomColor(); 
        this.renderer = new egret.Bitmap();
        this.accessory = new egret.DisplayObjectContainer();
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Virus;
        this.RefreshTexture();
        this.eliminateSound = "VirusEliminate_mp3";
    }

    private CreateFramesAnim(): SyncFramesAnim
    {
        var textureSeq = [];
        var textName = this.GetResPathByColor();
        for (var i = 1; i <=5; ++i)
        {
            textureSeq.push(textName + "_Idle" + i.toString());
        }
        var framesAnim = new SyncFramesAnim();
        framesAnim.Init(<egret.Bitmap>this.renderer, textureSeq, 100);
        return framesAnim;
    }

    public RefreshTexture():void
    {
        this.framesAnim = this.CreateFramesAnim();
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Virus_";
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

    public PlayEliminateAnim()
    {
        this.PlayBoomEffect();
        this.PlayScaling();
    }
}