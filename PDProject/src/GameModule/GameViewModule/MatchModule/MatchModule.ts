class MatchModule extends GameViewModule
{	
    protected CreateView(): boolean
	{
		let view = new MatchView();
		view.CreateView();
		this.gameViewList.push(view);
		super.Init();
		return true;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType):void
	{
		this.isForeground = to == GameStateType.Match;	
	}
}