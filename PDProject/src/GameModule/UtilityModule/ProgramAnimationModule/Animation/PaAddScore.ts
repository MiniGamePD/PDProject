class PaAddScoreParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.AddScole;

	public score: number;
	public pos: egret.Point;
	public duration: number;

	public constructor()
	{
		super();
		this.score = 0; 
		this.pos = null;
		this.duration = 800;
	}
}

class PaAddScore extends ProgramAnimationBase<PaAddScoreParam>
{
    private scoreText: egret.BitmapText;
	private readonly scaleDurationRate = 0.4; // 缩放出现的时间百分比
	private readonly fateOutStartRate = 0.6; // 渐隐消失启动时间的百分比
	private readonly moveUpRate = 0.5; //上移一个格子宽度的百分比
	private scaleDuration = 0;
	private fateOutStartTime = 0;
	private fateOutDuration = 0;
	private startPosY = 0;
	private targetPosY = 0;

	protected OnInit()
	{
		this.scoreText = this.resModule.CreateBitmapText("font_num1_fnt");
		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.scoreText);
		this.scoreText.x = this.param.pos.x;
		this.scoreText.y = this.param.pos.y;
		this.scoreText.width = 150;
		this.scoreText.height = 37
		this.scoreText.anchorOffsetX = this.scoreText.width / 2;
		this.scoreText.anchorOffsetY = this.scoreText.height / 2;
		this.scoreText.textAlign = "center";
		this.scoreText.text = this.param.score.toString();
		GameMain.GetInstance().AdapteDisplayObjectScale(this.scoreText);
		this.scoreText.scaleX = 0;
		this.scoreText.scaleY = 0;
		this.scoreText.alpha = 0;


		this.scaleDuration = this.scaleDurationRate * this.param.duration;
		this.fateOutStartTime = this.fateOutStartRate * this.param.duration;
		this.fateOutDuration = (1 - this.fateOutStartRate) * this.param.duration;

		this.startPosY = this.scoreText.y;
		this.targetPosY = this.startPosY - this.moveUpRate * Tools.MatchViewElementHeight;
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime < this.scaleDuration)
		{
			var rate = this.runningTime / this.scaleDuration;
			this.scoreText.scaleX = Tools.Lerp(0, 0.5, rate);
			this.scoreText.scaleY = Tools.Lerp(0, 0.7, rate);
			this.scoreText.alpha = Tools.Lerp(0, 1, rate);
		}
		
		if (this.runningTime > this.fateOutStartTime
		 	&& this.runningTime <= this.fateOutStartTime + this.fateOutDuration)
		{
			var rate = (this.runningTime - this.fateOutStartTime) /  this.fateOutDuration;
			this.scoreText.alpha = Tools.Lerp(1, 0, rate);
		}

		var moveRate = this.runningTime / this.param.duration;
		this.scoreText.y = Tools.Lerp(this.startPosY, this.targetPosY, moveRate);
	}

	protected OnRelease()
	{
		if (this.scoreText != null
			&& this.scoreText.parent != null
			&& this.scoreText.parent != undefined)
		{
			this.scoreText.parent.removeChild(this.scoreText);
			this.scoreText = null;
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}