class PaAddFeverPowerEffectParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.AddFeverPowerEffect;

	public pos: egret.Point;

	public constructor()
	{
		super();
		this.pos = null;
	}
}

class PaAddFeverPowerEffect extends ProgramAnimationBase<PaAddFeverPowerEffectParam>
{
    private bitMap: egret.Bitmap;
	private duration: number = 900;
	protected OnInit()
	{
		this.bitMap = this.resModule.CreateBitmapByName("jineng");
		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.bitMap);
		this.bitMap.x = this.param.pos.x;
		this.bitMap.y = this.param.pos.y;
		this.bitMap.anchorOffsetX = this.bitMap.width;
		this.bitMap.scaleX = 0.5;
		this.bitMap.scaleY = 0.5;
		GameMain.GetInstance().AdapteDisplayObjectScale(this.bitMap);

		this.FlyMove();
		this.PlayPartical();
	}

	private FlyMove()
	{
		var movingParam = new PaMovingParam;
        movingParam.displayObj = this.bitMap;
        movingParam.duration = this.duration;
        movingParam.targetPosX = Tools.FeverPowerTargetPos.x;
        movingParam.targetPosY = Tools.FeverPowerTargetPos.y;
        movingParam.needRotate = true;
        movingParam.needRemoveOnFinish = false;
        var event = new PlayProgramAnimationEvent();
        event.param = movingParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private PlayPartical()
	{
	    var startX = this.param.pos.x;
        var startY = this.param.pos.y;

		var particalParam = new PaMoveParticalParam;
        particalParam.textureName = "boss_jineng";
        particalParam.jsonName = "boss_jineng";
        particalParam.duration = 2000;
        particalParam.flyDuration = this.duration;
        particalParam.stayDuration = 0;
        particalParam.stratPosX = startX;
        particalParam.stratPosY = startY;
        particalParam.endPosX = Tools.FeverPowerTargetPos.x;
        particalParam.endPosY = Tools.FeverPowerTargetPos.y;
        particalParam.isMoveEmitter = true;
        var event = new PlayProgramAnimationEvent();
        event.param = particalParam;
        GameMain.GetInstance().DispatchEvent(event);
	}

	protected OnUpdate(deltaTime: number)
	{
		
	}

	protected OnRelease()
	{
		if (this.bitMap != null
			&& this.bitMap.parent != null
			&& this.bitMap.parent != undefined)
		{
			this.bitMap.parent.removeChild(this.bitMap);
			this.bitMap = null;
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.duration;
	}

}