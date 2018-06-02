class MatchModule extends GameViewModule
{
	private matchState: MatchState = MatchState.None;
	private scene: Scene;
	private playerControl: PlayerControl;
	private npcControl: NpcControl;
	private matchScore: MatchScore;
	private feverControl: FeverControl;
	private comboControl: ComboControl;
	private gameplayElementFactory:GameplayElementFactory;
	private controlWorkParam: GameplayControlWorkParam;

	private difficulty:number; //游戏的难度系数，随着时间增长
	private turn:number; //回合数

	private matchView:MatchView;

	protected CreateView(): boolean
	{
		GameMain.GetInstance().AddEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().AddEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneEliminateFinish, this);
		GameMain.GetInstance().AddEventListener(NpcControlFinishEvent.EventName, this.OnNpcControlFinish, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
		GameMain.GetInstance().AddEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);

		this.InitComponents();

		this.matchView = new MatchView();
		this.matchView.SetScene(this.scene);
		this.matchView.SetMatchScore(this.matchScore);
		this.matchView.CreateView();
		this.gameViewList.push(this.matchView);

		this.feverControl.AttachToHUD();

		this.InitMatch();

		return true;
	}

	public ReleaseView(): void
	{
		super.ReleaseView();
		
		this.DeInitComponents();

		GameMain.GetInstance().RemoveEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().RemoveEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneEliminateFinish, this);
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

		this.feverControl = new FeverControl();
		this.feverControl.Init();

		this.comboControl = new ComboControl();
		this.comboControl.Init();
		
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
		this.feverControl.Release();
		this.feverControl = null;
		this.comboControl.Release();
		this.comboControl = null;
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
		this.feverControl.Update(deltaTime);
	}

	private InitMatch()
	{
		this.difficulty = 0;
		this.turn = 0;
		this.StartNpcControl();
	}

	private StartSceneEliminate(event: PlayerControlFinishEvent)
	{
		this.matchState = MatchState.Eliminate;

		this.playerControl.Sleep();

		if (this.turn % 5 == 0)
		{
			var eliminateMethod: EliminateMethod = new EliminateMethod();
			eliminateMethod.methodType = EliminateMethodType.MoveUp;
			eliminateMethod.moveUpValue = 1;
			this.scene.SetEliminateMethodNext(eliminateMethod);
			this.scene.SetNextEliminateUnMove();	
		}

		this.scene.Work();
	}

	private OnSceneEliminateFinish(event: SceneEliminateFinishEvent)
	{
		this.comboControl.ResetCombo();	
		this.StartNpcControl();
	}

	private StartNpcControl()
	{
		this.matchState = MatchState.NpcControl;

		this.scene.Sleep();

		this.controlWorkParam.difficulty = this.difficulty;
		this.controlWorkParam.turn = this.turn;
		this.npcControl.Work(this.controlWorkParam);
	}

	private OnNpcControlFinish(event: NpcControlFinishEvent)
	{
		if(event.specialEliminateMethod != null)
		{
			this.StartSpecialSceneEliminate(event);	
		}
		else if(event.bossSkillInfo != null)
		{
			this.StartNpcSkill(event);
		}
		else
		{
			this.StartPlayerControl();
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
		this.scene.SetEliminateMethodNext(event.specialEliminateMethod);
		this.scene.SetNextEliminateUnMove();			
		this.scene.Work();
	}

	private StartNpcSkill(event: NpcControlFinishEvent)
	{
		this.matchState = MatchState.NpcSkill;
		this.npcControl.Sleep();
		this.scene.TriggerBossSkill(event.bossSkillInfo);		
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
		this.feverControl.AttachToHUD();
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
	NpcSkill, //Npc施放技能
	GameOver //拜拜了
}

enum GameMode
{
	Classic,
	BossFight,
}