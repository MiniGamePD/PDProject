class MatchScore 
{
	public curScore: number;

	public Init()
	{
		this.curScore = 0;

		GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateEvent, this)
	}

	public Release()
	{
		GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateEvent, this);
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
		let event = new HUDEvent();
		event.eventType = HUDEventType.ChangeScore;
		event.param = this.curScore;
		GameMain.GetInstance().DispatchEvent(event);
	}
}