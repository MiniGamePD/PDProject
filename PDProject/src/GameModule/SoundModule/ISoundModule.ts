interface ISoundModule extends IModule {
	/**
	 * 播放声音
	 */
	PlaySound(name: string, loops: number):egret.SoundChannel;
}