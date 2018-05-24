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

    protected GetResPathByColor():string
    {
        return "pd_res_json.CrossEliminater";
    }

    public PlayEliminateAnim()
    {
        this.PlayParticalEff();
        this.PlayScaling();
        this.MoveOneSide();
    }

    public MoveOneSide()
    {
        var startX = Tools.ElementPosToGameStagePosX(this.posx);
        var startY = Tools.ElementPosToGameStagePosY(this.posy);
        var headPic = this.resModule.CreateBitmapByName("huojian1");
        headPic.anchorOffsetX = headPic.width / 2;
        headPic.anchorOffsetY = headPic.height / 2;
        headPic.x = startX;
        headPic.y = startY;
        GameMain.GetInstance().GetAdaptedStageContainer().addChild(headPic);
        var movingParam = new PaMovingParam;
        movingParam.displayObj = headPic;
        movingParam.duration = 2000;
        movingParam.targetPosX = startX;
        movingParam.targetPosY = startY + 1000;
        movingParam.needRotate = true;
        var event = new PlayProgramAnimationEvent();
        event.param = movingParam;
        GameMain.GetInstance().DispatchEvent(event);

        var particalParam = new PaMoveParticalParam;
        particalParam.textureName = "huojian";
        particalParam.jsonName = "huojian";
		particalParam.duration = 2000;
		particalParam.flyDuration = 1000;
		particalParam.stayDuration = 0;
		particalParam.stratPosX = startX;
		particalParam.stratPosY = startY;
		particalParam.endPosX = startX;
		particalParam.endPosY = startY + 1000;
		particalParam.isMoveEmitter = true;
		var event = new PlayProgramAnimationEvent();
        event.param = particalParam;
        GameMain.GetInstance().DispatchEvent(event);
    }
}