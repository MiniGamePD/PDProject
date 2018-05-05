class MatchScoreChangeEvent extends egret.Event
{
	public static EventName: string = "MatchScoreChangeEvent";
	public targetScore: number;
	public changeValue: number;

	public constructor(bubbles: boolean = false, cancelable: boolean = false)
	{
		super(MatchScoreChangeEvent.EventName, bubbles, cancelable);
	}
}
