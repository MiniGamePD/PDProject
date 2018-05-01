class MatchModule extends GameViewModule
{		
	private matchState:MatchState = MatchState.None;
    private scene:Scene;
	private playerControl:PlayerControl;

    protected CreateView(): boolean
	{
		GameMain.GetInstance().AddEventListener(PlayerControlFinishEvent.EventName, this.OnPlayerControlFinish, this);
		GameMain.GetInstance().AddEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneElininateFinish, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);

		this.scene = new Scene();
        this.scene.Init();

		let view = new MatchView();
		view.SetScene(this.scene);
		view.CreateView();
		this.gameViewList.push(view);
    
		this.playerControl = new PlayerControl();
		this.playerControl.Init();

		//TODO:应该先从Init事件开始
		this.OnInitFinish();
		 
		return true;
	}

	public ReleaseView():void
	{
		super.ReleaseView();
		this.scene.Release();
		this.scene = null;
		this.playerControl.Release();
		this.playerControl = null;

		GameMain.GetInstance().RemoveEventListener(PlayerControlFinishEvent.EventName, this.OnPlayerControlFinish, this);
		GameMain.GetInstance().RemoveEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneElininateFinish, this);
		GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
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

	private OnInitFinish()
	{
		this.matchState = MatchState.PlayerControl;
		let pill = new Pill();//TODO
		this.playerControl.SetTarget(pill);
		this.playerControl.Work();
		this.scene.Sleep();
	}

	private OnPlayerControlFinish(event:PlayerControlFinishEvent)
	{
		this.matchState = MatchState.Eliminate;
		this.playerControl.Sleep();
		this.scene.Work();
	}

	private OnSceneElininateFinish(event:SceneEliminateFinishEvent)
	{
		this.matchState = MatchState.PlayerControl;
		let pill = new Pill();//TODO
		this.playerControl.SetTarget(pill);
		this.playerControl.Work();
		this.scene.Sleep();
	}

	private OnGameOver(event:GameOverEvent)
	{

	}
}

enum MatchState
{
    None,    
	Init, //预先生成一些细菌
    PlayerControl, //该状态下玩家可控制药丸旋转、下落
    Eliminate, //消除阶段，计算刚才玩家的操作是否产生消除，以及处理消除的各种效果
    GameOver //拜拜了
}