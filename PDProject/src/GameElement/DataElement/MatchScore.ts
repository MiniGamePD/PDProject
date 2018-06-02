class MatchScore 
{
	public curScore: number;
	public isInFeverTime: boolean;
	private addScoreEvent: HUDEvent;

	public Init()
	{
		this.curScore = 0;
		this.isInFeverTime = false;
		this.addScoreEvent = new HUDEvent();
		this.addScoreEvent.eventType = HUDEventType.ChangeScore;

		GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateEvent, this)
	}

	public Release()
	{
		GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateEvent, this);
	}

	private OnEliminateEvent(event: EliminateEvent)
	{
		// if (event != null
		// 	&& event.eliminateInfo != null
		// 	&& event.eliminateInfo.HasInfo)
		// {
		// 	var changeValue = event.eliminateInfo.EliminatedElements.length;
		// 	this.curScore += changeValue * 10;
		// 	this.DispatchScoreChangeEvent(this.curScore, changeValue);
		// }
	}

	// 加分。返回值：增加的分数
	public AddScore(element: SceneElementBase, eliminateRound: number): number
	{
		var eliminateRoundScale = this.GetEliminateRoundScale(eliminateRound);
		var feverTimeScale = this.GetFeverTimeScale();
		var addScore = Score_BaseScore * eliminateRoundScale * feverTimeScale;
		this.curScore += addScore;
		this.DispatchScoreChangeEvent(this.curScore, addScore);
		return addScore;
	}

	// 根据连消数量，计算倍率
	private GetEliminateRoundScale(eliminateRound: number): number
	{
		var eliminateRoundScale = 1;
		var index = eliminateRound - 1;
		if (index >= 0 && index < Score_EliminateRoundScale.length)
		{
			eliminateRoundScale = Score_EliminateRoundScale[index];
		}
		else if (index >= Score_EliminateRoundScale.length)
		{
			eliminateRoundScale = Score_EliminateRoundScale[Score_EliminateRoundScale.length - 1];
		}
		return eliminateRoundScale;
	}

	private GetFeverTimeScale(): number
	{
		if (this.isInFeverTime)
		{
			return Score_FeverTimeScale;
		}
		return 1;
	}

	private DispatchScoreChangeEvent(targetScore: number, changeValue: number)
	{
		this.addScoreEvent.param = targetScore;
		GameMain.GetInstance().DispatchEvent(this.addScoreEvent);
	}
}