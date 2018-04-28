class GameMain implements IGameMain {
	//单例
	private static msInstance: GameMain;

	//场景主舞台
	private GameStage: egret.Stage;

	//状态机管理器
	private mStateMgr: IStateMgr;

	//模块管理器
	private mModuleMgr: IModuleMgr;

	//创建单例
	public static CreatInstance(): boolean {
		if (!GameMain.HasInstance()) {
			GameMain.msInstance = new GameMain();
			return true;
		}
		else {
			return false;
		}
	}

	//是否存在单例
	public static HasInstance(): boolean {
		return GameMain.msInstance != null;
	}

	//获取单例
	public static GetInstance(): GameMain {
		return GameMain.msInstance;
	}

	//初始化
	public Init(stage: egret.Stage): void {
		this.GameStage = stage;

		this.mStateMgr = new StateMgr();
		this.mStateMgr.Init();

		this.mModuleMgr = new ModuleMgr();
		this.mModuleMgr.Init();
	}

	//更新
	public Update(deltaTime: number): void {
		if (this.mStateMgr != null) {
			this.mStateMgr.Update(deltaTime);
		}

		if (this.mModuleMgr != null) {
			this.mModuleMgr.Update(deltaTime);
		}
	}

	//释放
	public Release(): void {
		if (this.mStateMgr != null) {
			this.mStateMgr.Release();
		}

		if (this.mModuleMgr != null) {
			this.mModuleMgr.Release();
		}
	}

	public GetGameStage(): egret.Stage {
		return this.GameStage;
	}

	public GetCureGameState(): GameStateType {
		if (this.mStateMgr != null) {
			return this.mStateMgr.CurGameState();
		}
		return GameStateType.Init;
	}

	public SwitchGameState(toState: GameStateType): boolean {
		let hasSwitch: boolean = false;
		if (this.mStateMgr != null) {
			let fromState: GameStateType = this.mStateMgr.CurGameState();
			if (fromState != toState) {
				hasSwitch = this.mStateMgr.SwitchGameState(toState);
				if (hasSwitch && this.mModuleMgr != null) {
					this.mModuleMgr.OnGameStateChange(fromState, toState);
				}
			}
		}
		return hasSwitch;
	}

	public GetModule(moduleType: ModuleType): IModule {
		if (this.mModuleMgr != null) {
			return this.mModuleMgr.GetModule(moduleType);
		}
		return null;
	}
}