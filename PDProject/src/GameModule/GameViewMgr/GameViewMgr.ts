abstract class GameViewMgr extends ModuleBase implements IModule
{	
    protected gameViewList: IGameView[] = [];

	public Init(): boolean
    {
        if(this.gameViewList.length > 0)
        {
            var event:DisplayChangeEvent = new DisplayChangeEvent(this.gameViewList);        
            GameMain.GetInstance().DispatchEvent(event);            
        }
		return true;
	}

	public Update(deltaTime: number): void
    {
        for (var i = 0; i < this.gameViewList.length; ++i)
        {
            this.gameViewList[i].UpdateView(deltaTime);
        }
	}

	public Release(): void 
    {
        for (var i = 0; i < this.gameViewList.length; ++i)
        {
            this.gameViewList[i].ReleaseView();
        }
        this.gameViewList.slice();
	}
}