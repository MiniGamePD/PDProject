class MatchModule extends GameViewModule
{		
    protected CreateView(): boolean
	{
		this.matchData = new MatchData();
        this.matchData.Init();

		let view = new MatchView();
		view.SetMatchData(this.matchData);
		view.CreateView();
		this.gameViewList.push(view);
    
		this.matchState = MatchState.Init;

		return true;
	}

	public Release():void
	{
		this.matchData = null;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType):void
	{
		this.isForeground = to == GameStateType.Match;	
	}

    //##############游戏逻辑##################
    private matchState:MatchState = MatchState.None;
    private matchData:MatchData;
	public static readonly PillDropdownInterval:number = 500;//每隔多久药丸下落一格
	private pillDropdownTimer:number;

    public Update(deltaTime: number):void
    {
        //这里只处理match data的变化, view会根据data的变化进行绘制内容的更新
        switch(this.matchState)
        {
			case MatchState.Init:
				this.UpdateInitState();
				break;
            case MatchState.PlayerControl:
                this.UpdatePlayerControlState(deltaTime);
                break;
            case MatchState.Eliminate:
                this.UpdateEliminateState();
                break;
            case MatchState.GameOver:
                this.UpdateGameOverState();
                break;
            default:
                break;
        }
        super.Update(deltaTime);
    }

	private UpdateInitState():void
	{
		//TODO:处理初始细菌出现的过程
		this.OnChangeToPlayerControlState();
		this.matchState = MatchState.PlayerControl;
	}

	private OnChangeToInitState():void
	{

	}

    private UpdatePlayerControlState(deltaTime:number): void
    {
		this.pillDropdownTimer += deltaTime;
		if(this.pillDropdownTimer >= MatchModule.PillDropdownInterval)
		{
			//即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
			this.pillDropdownTimer = 0;
			if(!this.matchData.TryDropdownPill())
			{
				//下落到不能再下落了，就进入消除状态
				this.OnChangeToEliminateState();
				this.matchState = MatchState.Eliminate;
			}
		}
    }

	private OnChangeToPlayerControlState():void
	{
		if(!this.matchData.TryCreatePill())
		{
			this.OnChangeToGameOverState();
			this.matchState = MatchState.GameOver;
		}
		else
		{
			this.pillDropdownTimer = 0;
		}
	}

    private UpdateEliminateState(): void
    {
		//TODO:处理消除的逻辑
		this.OnChangeToPlayerControlState();
		this.matchState = MatchState.PlayerControl;
    }

	private OnChangeToEliminateState():void
	{
		
	}

    private UpdateGameOverState(): void
    {

    }

	private OnChangeToGameOverState():void
	{
		
	}
    //#######################################
}

enum MatchState
{
    None,    
	Init, //预先生成一些细菌
    PlayerControl, //该状态下玩家可控制药丸旋转、下落
    Eliminate, //消除阶段，计算刚才玩家的操作是否产生消除，以及处理消除的各种效果
    GameOver //拜拜了
}