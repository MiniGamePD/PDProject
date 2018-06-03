class SceneBoom extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.color = GameElementColor.random;
        this.canDrop = true;
        this.elementType = SceneElementType.Boom;
        this.RefreshTexture();
        this.eliminateMinCount = 1;
        this.eliminateSound = "Boom_mp3";
    }

	public RefreshTexture():void
    {
        this.framesAnim = this.CreateFramesAnim();
    }

	private CreateFramesAnim(): SyncFramesAnim
    {
        var textureSeq = ["pd_res_json.Vitamins_Red", "pd_res_json.Vitamins_Blue", "pd_res_json.Vitamins_Yellow"];
        var framesAnim = new SyncFramesAnim();
        framesAnim.Init(<egret.Bitmap>this.renderer, textureSeq, 100);
        return framesAnim;
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Vitamins_Red";
        return path;
    }

    protected PlayBoomEffect()
    {
        var param = new PaPlayDBAnimationParam;
        param.resName = "DB_Boom_Bomb";
        param.animationName = "Boom1";
        param.playTimes = 1;
        param.scaleX = 1.8;
        param.scaleY = 1.8;
        param.posX = Tools.ElementPosToGameStagePosX(this.posx);
        param.posY = Tools.ElementPosToGameStagePosY(this.posy);
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }
}