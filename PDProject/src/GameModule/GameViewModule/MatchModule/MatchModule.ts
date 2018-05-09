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

	protected CreateView(): boolean
	{
		GameMain.GetInstance().AddEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().AddEventListener(SceneEliminateFinishEvent.EventName, this.StartNpcControl, this);
		GameMain.GetInstance().AddEventListener(NpcControlFinishEvent.EventName, this.StartPlayerControl, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);

		this.scene = new Scene();
		this.scene.Init();

		let view = new MatchView();
		view.SetScene(this.scene);
		view.CreateView();
		this.gameViewList.push(view);

		this.gameplayElementFactory = new GameplayElementFactory();

		this.playerControl = new PlayerControl(this.gameplayElementFactory);
		this.playerControl.Init();

		this.npcControl = new NpcControl(this.gameplayElementFactory);
		this.npcControl.Init();

		this.matchScore = new MatchScore();
		this.matchScore.Init();
		
		this.controlWorkParam = new GameplayControlWorkParam();

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
		this.npcControl.Release();
		this.npcControl = null;

		GameMain.GetInstance().RemoveEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().RemoveEventListener(SceneEliminateFinishEvent.EventName, this.StartNpcControl, this);
		GameMain.GetInstance().RemoveEventListener(NpcControlFinishEvent.EventName, this.StartPlayerControl, this);
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

	private StartPlayerControl(event: NpcControlFinishEvent)
	{
		this.matchState = MatchState.PlayerControl;
		this.turn++;

		this.npcControl.Sleep();

		this.controlWorkParam.difficulty = this.difficulty;
		this.controlWorkParam.turn = this.turn;
		this.playerControl.Work(this.controlWorkParam);
	}

	private OnGameOver(event: GameOverEvent)
	{
		this.matchState = MatchState.GameOver;

		this.playerControl.Sleep();
		this.npcControl.Sleep();
		this.scene.Sleep();
	}
}

enum MatchState
{
	None,
	Init, //游戏开始
	NpcControl, //处理Npc的AI，是否要生成新的Npc
	PlayerControl, //该状态下玩家可控制药丸旋转、下落
	Eliminate, //消除阶段，计算刚才玩家的操作是否产生消除，以及处理消除的各种效果
	GameOver //拜拜了
}