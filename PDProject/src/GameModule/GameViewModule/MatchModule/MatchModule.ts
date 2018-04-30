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

	public SwitchForeOrBack(from: GameStateType, to: GameStateType):void
	{
		this.isForeground = to == GameStateType.Match;	
	}

    //##############游戏逻辑##################
    private matchState:MatchState = MatchState.None;
    private matchData:MatchData;

    public Update(deltaTime: number):void
    {
        //这里只处理match data的变化, view会根据data的变化进行绘制内容的更新
        switch(this.matchState)
        {
			case MatchState.Init:
				this.UpdateInitState();
				break;
            case MatchState.PlayerControl:
                this.UpdatePlayerControlState();
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

    private UpdatePlayerControlState(): void
    {

    }

	private OnChangeToPlayerControlState():void
	{
		if(!this.matchData.TryCreatePill())
		{
			this.OnChangeToGameOverState();
			this.matchState = MatchState.GameOver;
		}
	}

    private UpdateEliminateState(): void
    {

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