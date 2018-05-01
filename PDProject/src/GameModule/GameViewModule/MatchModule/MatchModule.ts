class MatchModule extends GameViewModule
{		
	private matchState:MatchState = MatchState.None;
    private scene:Scene;
	private playerControl:PlayerControl;

    protected CreateView(): boolean
	{
		this.scene = new Scene();
        this.scene.Init();

		let view = new MatchView();
		view.SetScene(this.scene);
		view.CreateView();
		this.gameViewList.push(view);
    
		this.playerControl = new PlayerControl();
		this.playerControl.Init();

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
		this.playerControl.Release();
		this.playerControl = null;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType):void
	{
		this.isForeground = to == GameStateType.Match;	
	}
    		
    public Update(deltaTime: number):void
    {        
        super.Update(deltaTime);
		this.scene.Update(deltaTime);
		this.playerControl.Update(deltaTime);
    }
}