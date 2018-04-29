class LobbyMgr extends GameViewMgr
{
	public Init(): boolean
	{
		let view = new LobbyView();
		view.CreateView();
		this.gameViewList.push(view);
		super.Init();
		return true;
	}
}