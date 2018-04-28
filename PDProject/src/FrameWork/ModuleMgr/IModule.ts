interface IModule{
	/**
	 * 初始化
	 */
	Init():boolean;

	/**
	 * 更新
	 */
	Update(deltaTime: number):void;

	/**
	 * 释放
	 */
	Release():void;

	/**
	 * 游戏状态机更新
	 */
	OnGameStateChange(from: GameStateType, to: GameStateType):void;
}