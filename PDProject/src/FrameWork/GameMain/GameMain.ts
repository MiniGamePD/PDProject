class GameMain implements IGameMain {
	//单例
	private static msInstance: GameMain;

	//场景主舞台
	private GameStage: egret.Stage;
	//适配过的，用来显示非背景的主要游戏元素的显示范围
	private adaptedDisplayRect:egret.Rectangle;

	//状态机管理器
	private mStateMgr: IStateMgr;

	//模块管理器
	private mModuleMgr: IModuleMgr;

	//白鹭Main
	private mEgretMain: Main;

	//创建单例
	public static CreatInstance(egretMain:Main): boolean 
	{
		if (!GameMain.HasInstance()) 
		{
			GameMain.msInstance = new GameMain();
			GameMain.msInstance.mEgretMain = egretMain;
			return true;
		}
		else 
		{
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
	public Init(stage: egret.Stage): void 
	{
		this.GameStage = stage;

		this.mStateMgr = new StateMgr();
		this.mStateMgr.Init();

		this.mModuleMgr = new ModuleMgr();
		this.mModuleMgr.Init();

		this.SwitchGameState(GameStateType.Init);
	}

	//更新
	public Update(deltaTime: number): void 
	{
		if (this.mStateMgr != null) 
		{
			this.mStateMgr.Update(deltaTime);
		}

		if (this.mModuleMgr != null) 
		{
			this.mModuleMgr.Update(deltaTime);
		}
	}

	//释放
	public Release(): void 
	{
		if (this.mStateMgr != null) 
		{
			this.mStateMgr.Release();
		}

		if (this.mModuleMgr != null) 
		{
			this.mModuleMgr.Release();
		}
	}

	public GetGameStage(): egret.Stage 
	{
		return this.GameStage;
	}

	public GetCureGameState(): GameStateType 
	{
		if (this.mStateMgr != null) 
		{
			return this.mStateMgr.CurGameState();
		}
		return GameStateType.Init;
	}

	public SwitchGameState(toState: GameStateType): boolean 
	{
		let hasSwitch: boolean = false;
		if (this.mStateMgr != null) 
		{
			let fromState: GameStateType = this.mStateMgr.CurGameState();
			if (fromState != toState) 
			{
				hasSwitch = this.mStateMgr.SwitchGameState(toState);
				if (hasSwitch && this.mModuleMgr != null) 
				{
					this.mModuleMgr.OnGameStateChange(fromState, toState);
				}
			}
		}
		return hasSwitch;
	}

	public GetModule(moduleType: ModuleType): IModule 
	{
		if (this.mModuleMgr != null) 
		{
			return this.mModuleMgr.GetModule(moduleType);
		}
		return null;
	}

	public GetEgretMain():Main
	{
		return this.mEgretMain;
	}	

	public DispatchEvent(event:egret.Event): void
	{
		if(this.mEgretMain.hasEventListener(event.$type))
		{
			//if(DEBUG)
			//	console.log(event.$type + " dispatch event " + this.mEgretMain.willTrigger(event.$type));
			this.mEgretMain.dispatchEvent(event);
		}
		else
		{
			if(DEBUG)
				console.log(event.$type + " has no lisenter");
		}		
	}

	public AddEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void
	{
		this.mEgretMain.addEventListener(type, listener, thisObject, useCapture, priority);
	}

	public RemoveEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void
	{
		this.mEgretMain.removeEventListener(type, listener, thisObject, useCapture);
	}

	public GetStageWidth(): number
	{
		return this.GameStage.stageWidth
	}

	public GetStageHeight(): number
	{
		return this.GameStage.stageHeight;
	}

	public GetAdaptedDisplayRect(): egret.Rectangle
	{
		if(this.adaptedDisplayRect == undefined)
			this.AdaptDisplayRect();

		return this.adaptedDisplayRect;
	}

	private AdaptDisplayRect()
	{
		this.adaptedDisplayRect = new egret.Rectangle();

		var screenAspect = egret.Capabilities.boundingClientWidth / egret.Capabilities.boundingClientHeight;
		var standerAspect = standerScreenWidth / standerScreenHeight; //9:16
		if(screenAspect <= standerAspect)
		{
			//屏幕很长，iphonex
			//有富余的高度，因此以宽度为准进行适配
			this.adaptedDisplayRect.width = egret.Capabilities.boundingClientWidth;
			this.adaptedDisplayRect.height = Math.ceil(this.adaptedDisplayRect.width / standerAspect);
			//将这块显示区域，放在屏幕的中间
			this.adaptedDisplayRect.x = 0;
			this.adaptedDisplayRect.y = Math.ceil((egret.Capabilities.boundingClientHeight - this.adaptedDisplayRect.height) / 2);
		}
		else
		{
			//屏幕更短，ipad
			//有富余的宽度，因此以高度为准进行适配
			this.adaptedDisplayRect.height = egret.Capabilities.boundingClientHeight;
			this.adaptedDisplayRect.width = Math.ceil(this.adaptedDisplayRect.height * standerAspect);
			//将这块显示区域，放在屏幕中间
			this.adaptedDisplayRect.y = 0;
			this.adaptedDisplayRect.x = Math.ceil((egret.Capabilities.boundingClientWidth - this.adaptedDisplayRect.width) / 2);
		}
	}
}