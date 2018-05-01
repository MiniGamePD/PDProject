class MatchModule extends GameViewModule
{		
	private matchState:MatchState = MatchState.None;
    private scene:Scene;
	private playerControlPill:PlayerControlPill;

    protected CreateView(): boolean
	{
		this.scene = new Scene();
        this.scene.Init();

		let view = new MatchView();
		view.SetScene(this.scene);
		view.CreateView();
		this.gameViewList.push(view);
    
		this.playerControlPill = new PlayerControlPill();
		this.playerControlPill.Init();

		//TODO:应该先从Init事件开始
		let event = new ChangeMatchStateEvent();
		event.matchState = MatchState.PlayerControl;
		GameMain.GetInstance().DispatchEvent(event);
		 
		return true;
	}

	public ReleaseView():void
	{
		super.ReleaseView();
		this.scene.Release();
		this.scene = null;
		this.playerControlPill.Release();
		this.playerControlPill = null;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType):void
	{
		this.isForeground = to == GameStateType.Match;	
	}
    		
    public Update(deltaTime: number):void
    {        
        super.Update(deltaTime);
		this.scene.Update(deltaTime);
		this.playerControlPill.Update(deltaTime);
    }
}