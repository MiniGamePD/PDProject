class EliminatingAnimation
{
	private static readonly LightningStateTime: number = 300; // 闪烁总时长
	private static readonly LightningInterval: number = 150; // 闪烁一个周期的时间
	private static readonly LightningHideRate: number = 0.5; // 闪烁一个周期中，隐藏显示的时间占比
	private static readonly MoveDownSpeed: number = 300; // 一秒移动多少像素

	private matchView: MatchView;
	private runningTime: number;
	private state: EliminatingAnimState;
	private eliminateInfo: EliminateInfo;
	private moveDownFinish: boolean;
	private isLightningHide: boolean;

	private playSoundEvent: PlaySoundEvent;

	public Init(view: MatchView)
	{
		this.matchView = view;

		this.state = EliminatingAnimState.Init;
		this.runningTime = 0;
		this.moveDownFinish = false;
	}

	public IsPlaying(): boolean
	{
		return this.state != EliminatingAnimState.Init;
	}

	public Start(eliminateInfo: EliminateInfo)
	{
		this.runningTime = 0;
		this.moveDownFinish = false;
		this.isLightningHide = false;
		this.eliminateInfo = eliminateInfo;
		if (this.eliminateInfo.EliminatedElements.length > 0)
		{
			this.EnterState(EliminatingAnimState.Lightning);
			this.PlayEliminateSound();
		}
		else
		{
			this.EnterState(EliminatingAnimState.MoveDown);
		}
	}

	public Update(deltaTime: number)
	{
		this.runningTime += deltaTime;
		switch (this.state)
		{
			case EliminatingAnimState.Lightning:
				{
					this.UpdateLightning(deltaTime);
					if (this.runningTime >= EliminatingAnimation.LightningStateTime)
					{
						this.DeleteEliminatElements();
						this.matchView.RefreshTextrue();
						this.EnterState(EliminatingAnimState.MoveDown);
					}
					break;
				}
			case EliminatingAnimState.MoveDown:
				{
					this.UpdateMoveDown(deltaTime);

					if (this.moveDownFinish)
					{
						this.EnterState(EliminatingAnimState.Init);
					}
				}
		}
	}

	private EnterState(toState: EliminatingAnimState)
	{
		this.state = toState;
	}

	private UpdateLightning(deltaTime: number)
	{
		var cycle = this.runningTime / EliminatingAnimation.LightningInterval;
		var rate = cycle - Math.floor(cycle);
		var needHide = rate < EliminatingAnimation.LightningHideRate;
		if (needHide != this.isLightningHide)
		{
			this.isLightningHide = needHide;
			var alpha = needHide ? 0 : 1;
			for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i)
			{
				this.eliminateInfo.EliminatedElements[i].renderer.alpha = alpha;
			}

			var scale = needHide ? 0.5 : 1.5;
			for (var i = 0; i < this.eliminateInfo.SpecialEliminatedElement.length; ++i)
			{
				this.eliminateInfo.SpecialEliminatedElement[i].renderer.alpha = 1;
				this.eliminateInfo.SpecialEliminatedElement[i].renderer.scaleX = scale;
				this.eliminateInfo.SpecialEliminatedElement[i].renderer.scaleY = scale;
			}
		
		}
	}

	private DeleteEliminatElements()
	{
		for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i)
		{
			this.eliminateInfo.EliminatedElements[i].renderer.alpha = 0; //Todo 改成释放这个元素
		}
	}

	private UpdateMoveDown(deltaTime: number)
	{
		var hasMove = false;
		var moveValue = EliminatingAnimation.MoveDownSpeed * deltaTime * 0.001;
		for (var i = 0; i < this.eliminateInfo.MoveElements.length; ++i)
		{
			var result = this.MoveRenderDown(moveValue, this.eliminateInfo.MoveElements[i].MoveElement)
			hasMove = hasMove || result;
		}

		if (!hasMove)
		{
			this.eliminateInfo.Reset();
			this.EnterState(EliminatingAnimState.Init);
		}
	}

	private MoveRenderDown(moveValue: number, element: SceneElementBase)
	{
		var result = false;
		if (element != null)
		{
			var targetRenderPosX = this.matchView.GetRenderPosX(element.posx);
			var targetRenderPosY = this.matchView.GetRenderPosY(element.posy);
			result = Math.abs(element.renderer.x - targetRenderPosX) >= moveValue
				|| Math.abs(element.renderer.y - targetRenderPosY) >= moveValue;
			element.renderer.x = Tools.MoveNumber(element.renderer.x, targetRenderPosX, moveValue);
			element.renderer.y = Tools.MoveNumber(element.renderer.y, targetRenderPosY, moveValue);
		}
		return result;
	}

	private PlaySound(sound: string)
	{
		if (this.playSoundEvent == null)
		{
			this.playSoundEvent = new PlaySoundEvent(sound, 1);
		}
		this.playSoundEvent.Key = sound;
        GameMain.GetInstance().DispatchEvent(this.playSoundEvent);
	}

	private PlayEliminateSound()
	{
		this.PlaySound("Eliminate2_mp3");
		for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i)
		{
			var element = this.eliminateInfo.EliminatedElements[i];
			if (element != null
				&& element.eliminateSound != null
				&& element.eliminateSound != "")
			{
				this.PlaySound(element.eliminateSound);
			}
		}
	}
}

enum EliminatingAnimState
{
	Init,
	Lightning,
	MoveDown,
} 