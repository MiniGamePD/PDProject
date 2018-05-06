class MatchModule extends GameViewModule
{
	private matchState: MatchState = MatchState.None;
	private scene: Scene;
	private playerControl: PlayerControl;
	private matchScore: MatchScore;
	private gameplayElementFactory:GameplayElementFactory;
	private creatorWorkParam:CreatorWorkParam;
	private controlableElementCreator: ControlableElementCreator;
	

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

		this.matchScore = new MatchScore();
		this.matchScore.Init();

		this.creatorWorkParam = new CreatorWorkParam();
		this.gameplayElementFactory = new GameplayElementFactory();
		this.controlableElementCreator = new ControlableElementCreator(this.gameplayElementFactory);

		this.InitMatch();

		return true;
	}

	public ReleaseView(): void
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

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
	{
		this.isForeground = to == GameStateType.Match;
	}

	public Update(deltaTime: number): void
	{
		super.Update(deltaTime);
		this.scene.Update(deltaTime);
		this.playerControl.Update(deltaTime);
	}

	private InitMatch()
	{
		this.matchState = MatchState.Init;

		let virusArray:Virus[] = [];
		for(var i = 0; i < 8; ++i)
		{
			while(true)
			{
				let posx = Math.floor(Math.random() * Scene.Columns);
				let posy = Math.floor(Math.random() * Scene.Rows);

				let find = false;
				for(var j = 0; j < virusArray.length; ++j)
				{
					if(virusArray[j].posx == posx || virusArray[j].posy == posy || posy <= 2)
					{
						find = true;
						break;
					}
				}

				if(!find)
				{
					virusArray.push(new Virus(posx, posy));
					break;
				}
			}
		}

		this.OnInitFinish();
	}

	private OnInitFinish()
	{
		this.matchState = MatchState.PlayerControl;

		this.creatorWorkParam.paramIndex = ControlableElementCreateType.AllRandomPill;
		this.creatorWorkParam.createNum = 1;
		let controlElement:ControlableElement = this.controlableElementCreator.Work(this.creatorWorkParam);
		this.controlableElementCreator.Sleep();
		this.playerControl.SetTarget(controlElement);
		this.playerControl.Work();
		this.scene.Sleep();
	}

	private OnPlayerControlFinish(event: PlayerControlFinishEvent)
	{
		this.matchState = MatchState.Eliminate;
		this.playerControl.Sleep();
		this.scene.Work();
	}

	private OnSceneElininateFinish(event: SceneEliminateFinishEvent)
	{
		this.matchState = MatchState.PlayerControl;

		this.creatorWorkParam.paramIndex = ControlableElementCreateType.Normal;
		this.creatorWorkParam.createNum = 1;
		let controlElement:ControlableElement = this.controlableElementCreator.Work(this.creatorWorkParam);
		this.controlableElementCreator.Sleep();

		this.playerControl.SetTarget(controlElement);
		this.playerControl.Work();

		this.scene.Sleep();
	}

	private OnGameOver(event: GameOverEvent)
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