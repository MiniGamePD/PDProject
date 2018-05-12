class MatchScoreItem extends egret.DisplayObjectContainer
{
	private scoreText: egret.TextField;

	public Init()
	{
		let stageWidth = GameMain.GetInstance().GetStageWidth();
		let stageHeight = GameMain.GetInstance().GetStageHeight();

		this.scoreText = new egret.TextField();
		this.scoreText.x = stageWidth/2 + 20;
		this.scoreText.y = 70;
		this.scoreText.width = 200;
		this.scoreText.height = 100;
		this.scoreText.textColor = 0xff0000;
		this.scoreText.fontFamily = "Impact";
		this.scoreText.size *= 1.8;
		this.scoreText.textAlign = "left";
		this.scoreText.text = "0";
		this.addChild(this.scoreText);

		GameMain.GetInstance().AddEventListener(MatchScoreChangeEvent.EventName, this.OnScoreChange, this);
	}

	public Update(deltaTime: number)
	{

	}

    private OnScoreChange(event: MatchScoreChangeEvent)
    {
        this.SetScore(event.targetScore);
    }

	private SetScore(score: number)
	{
		this.scoreText.text = score.toString();
	}

	public Reset()
	{
		this.SetScore(0);
	}
}