class LobbyMgr extends ModuleBase implements ILobbyMgr {

	public Init(): boolean {
		return true;
	}

	public Update(deltaTime: number): void {
		console.log("LobbyMgr update, deltaTime=" + deltaTime);
	}

	public Release(): void {

	}
}