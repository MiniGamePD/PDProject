class SoundControlEvent extends egret.Event 
{
	public static EventName: string = "SoundControlEvent";
	public channel:egret.SoundChannel;
    public controlType:SoundControlType;
    public controlParam:any;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
    {
		super(SoundControlEvent.EventName, bubbles, cancelable);
	}
}

enum SoundControlType
{
    FadeIn,
    FadeOut,
}
