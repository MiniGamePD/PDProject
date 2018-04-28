class ModuleMgr implements IModuleMgr {

	//模块列表
	private mModuleList: IModule[];

	//模块数量
	private mModuleCount: number;

	public Init(): void {
		this.CreateModule();
		this.InitModule();
	}

	private CreateModule() {
		this.mModuleList = [];
		this.mModuleList.push(new LobbyMgr);
		this.mModuleList.push(new MatchMgr);

		this.mModuleCount = this.mModuleList.length;
	}

	private InitModule() {
		for (var i = 0; i < this.mModuleCount; ++i) {
			this.mModuleList[i].Init();
		}
	}

	public Update(deltaTime: number): void {
		for (var i = 0; i < this.mModuleCount; ++i) {
			this.mModuleList[i].Update(deltaTime);
		}
	}

	public Release(): void {
		for (var i = 0; i < this.mModuleCount; ++i) {
			this.mModuleList[i].Release();
		}
	}

	public GetModule(moduleType: ModuleType): IModule {
		return this.mModuleList[moduleType];
	}

	public OnGameStateChange(from: GameStateType, to: GameStateType): void {
		for (var i = 0; i < this.mModuleCount; ++i) {
			this.mModuleList[i].OnGameStateChange(from, to);
		}
	}
}