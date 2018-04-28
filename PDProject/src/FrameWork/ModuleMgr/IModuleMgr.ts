interface IModuleMgr {
	/**
	 * 初始化
	 */
	Init():void;

	/**
	 * 更新
	 */
	Update(deltaTime: number):void;

	/**
	 * 释放
	 */
	Release():void;

	/**
	 * 获取模块
	 */
	GetModule(moduleType: ModuleType): IModule;

	/**
	 * 游戏状态机更新
	 */
	OnGameStateChange(from: GameStateType, to: GameStateType):void;
}

enum ModuleType{
	LOBBY_MGR = 0,
	MATCH_MGR,
	MAX
}