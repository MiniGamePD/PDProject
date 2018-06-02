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
	protected OnInit()
	{
		var font = this.resModule.GetRes("font_num1_fnt");

		this.scoreText = new egret.BitmapText();
		this.scoreText.x = this.param.pos.x;
		this.scoreText.y = this.param.pos.y;
		this.scoreText.font = font;
		this.scoreText.width = 150;
		this.scoreText.height = 37
		this.scoreText.textAlign = "center";
		this.scoreText.text = this.param.score.toString();
		this.scoreText.anchorOffsetX = this.scoreText.width / 2;
		this.scoreText.anchorOffsetY = this.scoreText.height / 2;
		this.scoreText.scaleX = 0;
		this.scoreText.scaleY = 0;
		this.scoreText.alpha = 0;
		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.scoreText);
		GameMain.GetInstance().AdapteDisplayObject(this.scoreText);
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime < 500)
		{
			var rate = this.runningTime / 500;
			this.scoreText.scaleX = Tools.Lerp(0, 1, rate);
			this.scoreText.scaleY = Tools.Lerp(0, 1, rate);
			this.scoreText.alpha = Tools.Lerp(0, 1, rate);
		}
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