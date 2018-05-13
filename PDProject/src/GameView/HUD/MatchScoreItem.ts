class MatchScoreItem extends egret.DisplayObjectContainer
{
	private scoreText: egret.TextField;
	private stepText: egret.TextField;

	public Init()
	{
		let stageWidth = GameMain.GetInstance().GetStageWidth();
		let stageHeight = GameMain.GetInstance().GetStageHeight();

		this.scoreText = new egret.TextField();
		this.scoreText.x = stageWidth/2 - 150;
		this.scoreText.y = 70;
		this.scoreText.width = 200;
		this.scoreText.height = 100;
		this.scoreText.textColor = 0xff0000;
		this.scoreText.fontFamily = "Impact";
		this.scoreText.size = 40;
		this.scoreText.textAlign = "left";
		this.addChild(this.scoreText);

		this.stepText = new egret.TextField();
		this.stepText.x = stageWidth/2 + 150;
		this.stepText.y = 70;
		this.stepText.width = 200;
		this.stepText.height = 100;
		this.stepText.textColor = 0xff0000;
		this.stepText.fontFamily = "Impact";
		this.stepText.size = 40;
		this.stepText.textAlign = "left";
		this.addChild(this.stepText);

		this.Reset();
	}

	public Update(deltaTime: number)
	{

	}

	public SetScore(score: number)
	{
		this.scoreText.text = "Score:" + score.toString();
	}

	public SetStep(step: number)
	{
		this.stepText.text = "Move:" + step.toString();
	}

	public Reset()
	{
		this.SetScore(0);
		this.SetStep(0);
	}
}