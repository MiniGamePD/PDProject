class SoundModule extends ModuleBase implements ISoundModule{
	private mResModule: IResModule;

	public Init(): boolean {
		this.isForeground = true;
		this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		return true;
	}

	public Update(deltaTime: number): void {

	}

	public Release(): void {

	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void {
		this.isForeground = true;
	} 

	public PlaySound(name: string, loops: number):egret.SoundChannel {
		if (this.mResModule != null){
			var sound:egret.Sound = this.mResModule.GetRes(name);
			if (sound != null){
				return sound.play(0, loops);
			}
		}
		return null;
	}
}