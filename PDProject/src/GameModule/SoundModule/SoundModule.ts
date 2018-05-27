class SoundModule extends ModuleBase implements ISoundModule
{
	private mResModule: IResModule;
	private mBgmChannel: egret.SoundChannel;
	private mFadeParamArray: SoundFadeParam[];

	public Init(): boolean 
	{
		this.isForeground = true;
		this.mFadeParamArray = [];
		this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		GameMain.GetInstance().AddEventListener(PlaySoundEvent.EventName, this.OnPlaySoundEvent, this);
		GameMain.GetInstance().AddEventListener(SoundControlEvent.EventName, this.OnSoundControlEvent, this);
		return true;
	}

	public Update(deltaTime: number): void 
	{
		var tobeDelete:SoundFadeParam[] = null;
		for(var i = 0; i < this.mFadeParamArray.length; ++i)
		{
			var fadeParam:SoundFadeParam = this.mFadeParamArray[i];
			if(fadeParam.fadeIn)
			{
				var newVolume = fadeParam.channel.volume + fadeParam.speed * deltaTime;
				
				if(newVolume > 1)
				{
					newVolume = 1;
					if(tobeDelete == null)
					{
						tobeDelete = [];
					}
					tobeDelete.push(fadeParam);
				}

				fadeParam.channel.volume = newVolume;
			}
			else
			{
				var newVolume = fadeParam.channel.volume - fadeParam.speed * deltaTime;
				if(newVolume < 0)
				{
					newVolume = 0;
					if(tobeDelete == null)
					{
						tobeDelete = [];
					}
					tobeDelete.push(fadeParam);
				}

				fadeParam.channel.volume = newVolume;
			}
		}

		if(tobeDelete != null)
		{
			for(var i = 0; i < tobeDelete.length; ++i)
			{
				var index = this.mFadeParamArray.indexOf(tobeDelete[i])
				this.mFadeParamArray.splice(index, 1);
			}
		}
	}

	public Release(): void 
	{
		GameMain.GetInstance().RemoveEventListener(PlaySoundEvent.EventName, this.OnPlaySoundEvent, this);
		GameMain.GetInstance().RemoveEventListener(SoundControlEvent.EventName, this.OnSoundControlEvent, this);
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void 
	{
		this.isForeground = true;
	} 

	public PlaySound(key: string, loops: number):egret.SoundChannel 
	{
		if (this.mResModule != null)
		{
			var sound:egret.Sound = this.mResModule.GetRes(key);
			if (sound != null)
			{
				return sound.play(0, loops);
			}
		}
		return null;
	}

	public PlayBGM(key: string, loops: number):egret.SoundChannel 
	{
		if (this.mResModule != null)
		{
			if(this.mBgmChannel != undefined && this.mBgmChannel != null)
			{
				this.mBgmChannel.stop();
			}

			var sound:egret.Sound = this.mResModule.GetRes(key);
			sound.type = egret.Sound.MUSIC;
			if (sound != null)
			{
				this.mBgmChannel = sound.play(0, loops);
				return this.mBgmChannel
			}
		}
		return null;
	}

	private OnPlaySoundEvent(event: PlaySoundEvent)
	{
		if (event != null)
		{
			if(event.SoundType == egret.Sound.EFFECT)
				this.PlaySound(event.Key, event.Loops);
			else if(event.SoundType == egret.Sound.MUSIC)
				this.PlayBGM(event.Key, event.Loops);
			else
				console.error("Invalid SoundType " + event.SoundType);
		}
	}

	private OnSoundControlEvent(event:SoundControlEvent)
	{
		if(event.controlType == SoundControlType.FadeIn || event.controlType == SoundControlType.FadeOut)
		{
			var fadeParam:SoundFadeParam = new SoundFadeParam();
			fadeParam.channel = event.channel;
			fadeParam.fadeIn = event.controlType == SoundControlType.FadeIn;
			fadeParam.speed = <number>event.controlParam;

			this.mFadeParamArray.push(fadeParam);
		}
	}

	public GetCurrentBgmChannel():egret.SoundChannel
	{
		return this.mBgmChannel;
	}
}

class SoundFadeParam
{
	public channel:egret.SoundChannel;
	public fadeIn:boolean;
	public speed:number;
}