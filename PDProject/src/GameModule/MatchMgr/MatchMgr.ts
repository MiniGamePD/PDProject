class MatchMgr extends ModuleBase implements IMatchMgr {
	
	public Init(): boolean {
		return true;
	}

	public Update(deltaTime: number): void {
		console.log("MatchMgr update, deltaTime=" + deltaTime);
	}

	public Release(): void {

	}
}