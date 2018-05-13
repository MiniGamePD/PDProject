class MatchModule extends GameViewModule
{
	private matchState: MatchState = MatchState.None;
	private scene: Scene;
	private playerControl: PlayerControl;
	private npcControl: NpcControl;
	private matchScore: MatchScore;
	private gameplayElementFactory:GameplayElementFactory;
	private controlWorkParam: GameplayControlWorkParam;

	private difficulty:number; //游戏的难度系数，随着时间增长
	private turn:number; //回合数

	private matchView:MatchView;

	protected CreateView(): boolean
	{
		GameMain.GetInstance().AddEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().AddEventListener(SceneEliminateFinishEvent.EventName, this.StartNpcControl, this);
		GameMain.GetInstance().AddEventListener(NpcControlFinishEvent.EventName, this.OnNpcControlFinish, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
		GameMain.GetInstance().AddEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);

		this.InitComponents();

		this.matchView = new MatchView();
		this.matchView.SetScene(this.scene);
		this.matchView.CreateView();
		this.gameViewList.push(this.matchView);

		this.InitMatch();

		return true;
	}

	public ReleaseView(): void
	{
		super.ReleaseView();
		
		this.DeInitComponents();

		GameMain.GetInstance().RemoveEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().RemoveEventListener(SceneEliminateFinishEvent.EventName, this.StartNpcControl, this);
		GameMain.GetInstance().RemoveEventListener(NpcControlFinishEvent.EventName, this.OnNpcControlFinish, this);
		GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
		GameMain.GetInstance().RemoveEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
	}

	private InitComponents()
	{
		this.scene = new Scene();
		this.scene.Init();

		this.gameplayElementFactory = new GameplayElementFactory();

		this.playerControl = new PlayerControl(this.gameplayElementFactory);
		this.playerControl.Init();

		this.npcControl = new NpcControl(this.gameplayElementFactory);
		this.npcControl.Init();

		this.matchScore = new MatchScore();
		this.matchScore.Init();
		
		this.controlWorkParam = new GameplayControlWorkParam();

		this.difficulty = 0;
		this.turn = 0;
	}

	private DeInitComponents()
	{
		this.scene.Release();
		this.scene = null;
		this.playerControl.Release();
		this.playerControl = null;
		this.npcControl.Release();
		this.npcControl = null;
		this.matchScore.Release();
		this.matchScore = null;
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
		this.npcControl.Update(deltaTime);
	}

	private InitMatch()
	{
		this.difficulty = 0;
		this.turn = 0;
		this.StartNpcControl(null);
	}

	private StartSceneEliminate(event: PlayerControlFinishEvent)
	{
		this.matchState = MatchState.Eliminate;

		this.playerControl.Sleep();
		this.scene.Work();
	}

	private StartNpcControl(event: SceneEliminateFinishEvent)
	{
		this.matchState = MatchState.NpcControl;

		this.scene.Sleep();

		this.controlWorkParam.difficulty = this.difficulty;
		this.controlWorkParam.turn = this.turn;
		this.npcControl.Work(this.controlWorkParam);
	}

	private OnNpcControlFinish(event: NpcControlFinishEvent)
	{
		if(event.specialEliminateMethod == null)
		{
			this.StartPlayerControl();
		}
		else
		{
			this.StartSpecialSceneEliminate(event);
		}
	}

	private StartPlayerControl()
	{
		this.matchState = MatchState.PlayerControl;
		this.AddTurn();

		this.npcControl.Sleep();

		this.controlWorkParam.difficulty = this.difficulty;
		this.controlWorkParam.turn = this.turn;
		this.playerControl.Work(this.controlWorkParam);
	}

	private StartSpecialSceneEliminate(event: NpcControlFinishEvent)
	{
		this.matchState = MatchState.SpecialEliminate;
		this.npcControl.Sleep();
		this.scene.SetEliminateMethodNext(event.specialEliminateMethod.methodType, 
			event.specialEliminateMethod.specificColor,
			event.specialEliminateMethod.specificRegion,
			event.specialEliminateMethod.eliminateElementType);
		this.scene.SetNextEliminateUnMove();			
		this.scene.Work();
	}

	private OnGameOver(event: GameOverEvent)
	{
		this.matchState = MatchState.GameOver;

		this.playerControl.Sleep();
		this.npcControl.Sleep();
		this.scene.Sleep();
	}

	private OnReplayGame(event: ReplayGameEvent)
	{
		this.DeInitComponents();
		this.InitComponents();
		this.matchView.SetScene(this.scene);
		this.InitMatch();
	}

	private AddTurn()
	{
		this.turn++;
		let event = new HUDEvent();
		event.eventType = HUDEventType.ChangeStep;
		event.param = this.turn;
		GameMain.GetInstance().DispatchEvent(event);
	}
}

enum MatchState
{
	None,
	Init, //游戏开始
	NpcControl, //处理Npc的AI，是否要生成新的Npc
	PlayerControl, //该状态下玩家可控制药丸旋转、下落
	SpecialEliminate, //特殊消除阶段，用来做一些特殊事件的（比如boss出场）的消除
	Eliminate, //消除阶段，计算刚才玩家的操作是否产生消除，以及处理消除的各种效果
	GameOver //拜拜了
}