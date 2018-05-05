class MatchScore 
{
	public curScore: number;
	private scoreChangeEvent: MatchScoreChangeEvent

	public Init()
	{
		this.curScore = 0;
		this.scoreChangeEvent = new MatchScoreChangeEvent();

		GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateEvent, this)
	}

	private OnEliminateEvent(event: EliminateEvent)
	{
		if (event != null
			&& event.eliminateInfo != null
			&& event.eliminateInfo.HasInfo)
		{
			var changeValue = event.eliminateInfo.EliminatedElements.length;
			this.curScore += changeValue;
			this.DispatchScoreChangeEvent(this.curScore, changeValue);
		}
	}

	private DispatchScoreChangeEvent(targetScore: number, changeValue: number)
	{
		this.scoreChangeEvent.targetScore = this.curScore;
		this.scoreChangeEvent.changeValue = changeValue;
		GameMain.GetInstance().DispatchEvent(this.scoreChangeEvent);
	}
}