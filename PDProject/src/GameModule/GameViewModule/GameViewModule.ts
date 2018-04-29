abstract class GameViewModule extends ModuleBase
{	
    protected gameViewList: IGameView[] = [];

	public SwitchToForeground(): void
    {
        this.CreateView();

        if(this.gameViewList.length > 0)
        {
            var event:DisplayChangeEvent = new DisplayChangeEvent(this.gameViewList);        
            GameMain.GetInstance().DispatchEvent(event);            
        }
	}

    public SwitchToBackground(): void
    {
        this.ReleaseView();
    }

    public Update(deltaTime: number):void
    {
        this.UpdateView(deltaTime);
    }

    protected abstract CreateView():boolean;    

	private UpdateView(deltaTime: number): void
    {
        for (var i = 0; i < this.gameViewList.length; ++i)
        {
            this.gameViewList[i].UpdateView(deltaTime);
        }
	}

	private ReleaseView(): void 
    {
        for (var i = 0; i < this.gameViewList.length; ++i)
        {
            this.gameViewList[i].ReleaseView();
        }
        this.gameViewList.slice();
	}

    abstract SwitchForeOrBack(from: GameStateType, to: GameStateType):void;
}