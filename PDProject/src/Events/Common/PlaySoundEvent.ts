class PlaySoundEvent extends egret.Event {
	public static EventName: string = "PlaySoundEvent";
	public Key: string;
	public Loops: number;
	public SoundType:string;
	public constructor(key: string, loops: number, bubbles: boolean = false, cancelable: boolean = false) {
		super(PlaySoundEvent.EventName, bubbles, cancelable);
		this.Key = key;
		this.Loops = loops;
		this.SoundType = egret.Sound.EFFECT;
	}
}
