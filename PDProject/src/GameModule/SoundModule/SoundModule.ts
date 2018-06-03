class SoundModule extends ModuleBase implements ISoundModule
{
	private mResModule: IResModule;
	private mBgmChannel: egret.SoundChannel;
	private mFadeParamArray: SoundFadeParam[];

	private mBgmChannelDic:{[index:number]: egret.SoundChannel};
	private mBgmPausePosDic:{[index:number]: number};

	public Init(): boolean 
	{
		this.isForeground = true;
		this.mFadeParamArray = [];
		this.mBgmChannelDic = {};
		this.mBgmPausePosDic = {};
		this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		GameMain.GetInstance().AddEventListener(PlaySoundEvent.EventName, this.OnPlaySoundEvent, this);
		GameMain.GetInstance().AddEventListener(SoundControlEvent.EventName, this.OnSoundControlEvent, this);
		GameMain.GetInstance().AddEventListener(BgmControlEvent.EventName, this.OnBgmControlEvent, this);
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
		GameMain.GetInstance().RemoveEventListener(BgmControlEvent.EventName, this.OnBgmControlEvent, this);
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

	private OnBgmControlEvent(event:BgmControlEvent)
	{
		switch(event.controlType)
		{
			case BgmControlType.Play:
				this.PlayBgm(event.bgmStage, 0);
				break;
			case BgmControlType.Stop:
				this.StopBgm(event.bgmStage);
				break;
			case BgmControlType.FadeIn:
				this.FadeBgm(event.bgmStage, true, <number>event.controlParam);
				break;
			case BgmControlType.FadeOut:
				this.FadeBgm(event.bgmStage, false, <number>event.controlParam);
				break;
			case BgmControlType.Pause:
				this.PauseBgm(event.bgmStage);
				break;
			case BgmControlType.Resume:
				this.ResumeBgm(event.bgmStage);
				break;
			default:
				console.error("Unknow Bgm Control Type");
		}
	}

	public PlayBgm(stage:BgmStage, pos:number) 
	{
		if (this.mResModule != null)
		{
			var bgmChannel:egret.SoundChannel = this.mBgmChannelDic[stage];
			
			if(bgmChannel != undefined && bgmChannel != null)
			{
				if(DEBUG)
				{
					console.error("BGM is playing:" + stage);
				}
				return;
			}

			var bgmRes:string;
			if(stage == BgmStage.Global)
			{
				bgmRes = "bgm_mp3";
			}
			else if(stage == BgmStage.Fever)
			{
				bgmRes = "fever_bgm_mp3";
			}
			else 
			{
				console.error("Unknow Bgm Stage:" + stage);
				return;
			}

			var sound:egret.Sound = this.mResModule.GetRes(bgmRes);
			sound.type = egret.Sound.MUSIC;
			if (sound != null)
			{
				this.mBgmChannel = sound.play(pos, -1);
				this.mBgmChannelDic[stage] = this.mBgmChannel;
			}
		}
	}

	private StopBgm(stage:BgmStage)
	{
		var bgmChannel:egret.SoundChannel = this.mBgmChannelDic[stage];
			
		if(bgmChannel == undefined && bgmChannel == null)
		{
			if(DEBUG)
			{
				console.error("BGM is not playing:" + stage);
			}
			return;
		}

		bgmChannel.stop();
		this.mBgmChannelDic[stage] = null;
		this.mBgmPausePosDic[stage] = null;
	}

	public FadeBgm(stage:BgmStage, fadeIn:boolean, fadeSpeed:number)
	{
		var bgmChannel:egret.SoundChannel = this.mBgmChannelDic[stage];
			
		if(bgmChannel == undefined && bgmChannel == null)
		{
			if(DEBUG)
			{
				console.error("BGM is not playing:" + stage);
			}
			return;
		}

		var fadeParam:SoundFadeParam = new SoundFadeParam();
		fadeParam.channel = bgmChannel;
		fadeParam.fadeIn = fadeIn;
		fadeParam.speed = fadeSpeed;

		this.mFadeParamArray.push(fadeParam);
	}

	private PauseBgm(stage:BgmStage)
	{
		var bgmChannel:egret.SoundChannel = this.mBgmChannelDic[stage];
			
		if(bgmChannel == undefined && bgmChannel == null)
		{
			if(DEBUG)
			{
				console.error("BGM is not playing:" + stage);
			}
			return;
		}

		this.mBgmPausePosDic[stage] = bgmChannel.position;
		bgmChannel.stop();
		this.mBgmChannelDic[stage] = null;
	}

	private ResumeBgm(stage:BgmStage)
	{
		var pos:number = this.mBgmPausePosDic[stage];
			
		if(pos == undefined && pos == null)
		{
			if(DEBUG)
			{
				console.error("BGM is not paused:" + stage);
			}
			return;
		}

		this.PlayBgm(stage, pos);
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

enum BgmStage
{
    Global,
    Fever,
}
