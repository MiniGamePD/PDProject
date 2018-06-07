class EliminatingAnimation
{
	private static readonly EliminateEffectStateTime: number = 100; // 消除特效时长
	private static readonly MoveDownSpeed: number = 300; // 一秒移动多少像素

	private eiminateEffectStateTime = EliminatingAnimation.EliminateEffectStateTime;
	private matchView: MatchView;
	private matchScore: MatchScore;
	private runningTime: number;
	private state: EliminatingAnimState;
	private eliminateInfo: EliminateInfo;
	private moveDownFinish: boolean;
	private isLightningHide: boolean;

	private playSoundEvent: PlaySoundEvent;

	private deadElementArray: SceneElementBase[];

	public Init(view: MatchView)
	{
		this.matchView = view;

		this.state = EliminatingAnimState.Init;
		this.runningTime = 0;
		this.moveDownFinish = false;
		this.deadElementArray = [];
	}

	public IsPlaying(): boolean
	{
		return this.state != EliminatingAnimState.Init;
	}

	public Start(eliminateInfo: EliminateInfo, matchScore: MatchScore)
	{
		this.matchScore = matchScore;
		this.runningTime = 0;
		this.moveDownFinish = false;
		this.isLightningHide = false;
		this.eliminateInfo = eliminateInfo;
		this.eiminateEffectStateTime = this.GetEliminateDelayMaxTime() + EliminatingAnimation.EliminateEffectStateTime;
		if (this.eliminateInfo.EliminatedElements.length > 0
			|| this.eliminateInfo.ShieldBreakElements.length > 0)
		{
			this.EnterState(EliminatingAnimState.Lightning);
			this.PlayEliminateSound();
			// this.PlayElementEliminateAnim();
		}
		else
		{
			this.EnterState(EliminatingAnimState.MoveDown);
		}
	}

	private GetEliminateDelayMaxTime(): number
	{
		var maxTime = -1;
		for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i)
		{
			if (maxTime < this.eliminateInfo.EliminatedElements[i].eliminateDelay)
			{
				maxTime = this.eliminateInfo.EliminatedElements[i].eliminateDelay
			}
		}

		for (var i= 0; i < this.eliminateInfo.ShieldBreakElements.length; ++i)
		{
			if (maxTime < this.eliminateInfo.ShieldBreakElements[i].eliminateDelay)
			{
				maxTime = this.eliminateInfo.ShieldBreakElements[i].eliminateDelay
			}
		}
		return maxTime;
	}

	public Update(deltaTime: number)
	{
		this.runningTime += deltaTime;
		switch (this.state)
		{
			case EliminatingAnimState.Lightning:
				{
					this.UpdateLightning(deltaTime);
					if (this.runningTime >= this.eiminateEffectStateTime)
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

	// private PlayElementEliminateAnim()
	// {
	// 	for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i)
	// 	{
	// 		this.eliminateInfo.EliminatedElements[i].PlayEliminateAnim();
	// 		this.AddScore(this.eliminateInfo.EliminatedElements[i]);
	// 	}

	// 	for (var i= 0; i < this.eliminateInfo.ShieldBreakElements.length; ++i)
	// 	{
	// 		this.eliminateInfo.ShieldBreakElements[i].PlayShieldBreakAnim();
	// 	}
	// }

	private AddScore(element: SceneElementBase)
	{
		var score = this.matchScore.AddScore(element, this.eliminateInfo.EliminateRound);
		var param = new PaAddScoreParam();
		param.score = score;
		param.pos = new egret.Point(Tools.ElementPosToGameStagePosX(element.posx), Tools.ElementPosToGameStagePosY(element.posy));
		var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private UpdateLightning(deltaTime: number)
	{
		for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i)
		{
			var element = this.eliminateInfo.EliminatedElements[i];
			if (element.eliminateDelay >= 0)
			{
				element.eliminateDelay -= deltaTime;
				if (element.eliminateDelay < 0)
				{
					element.PlayEliminateAnim();
					this.AddScore(element);
					
					// if (element.eliminateSound != null
					// 	&& element.eliminateSound != "")
					// {
					// 	this.PlaySound(element.eliminateSound);
					// }
				}
			}
		}

		for (var i= 0; i < this.eliminateInfo.ShieldBreakElements.length; ++i)
		{
			var element = this.eliminateInfo.ShieldBreakElements[i];
			if (element.eliminateDelay >= 0)
			{
				element.eliminateDelay -= deltaTime;
				if (element.eliminateDelay < 0)
				{
					element.PlayShieldBreakAnim();
				}
			} 
		}
	}

	private DeleteEliminatElements()
	{
		var eliminatedElements:SceneElementBase[] = this.eliminateInfo.EliminatedElements;
		for (var i = 0; i < eliminatedElements.length; ++i)
		{
			var element:SceneElementBase = eliminatedElements[i];
			this.deadElementArray.push(element);
		}

		var superVirues:SuperVirus[] = this.eliminateInfo.EliminatedSuperVirus;
		for (var i = 0; i < superVirues.length; ++i)
		{
			if (!superVirues[i].IsAlive())
			{
				//for debug superVirues[i].GetMainSceneElement().renderer.alpha = 0.5;
				var element:SceneElementBase = superVirues[i].GetMainSceneElement();
				this.deadElementArray.push(element);
			}
			else
			{
				//这里好恶心，因为动画把alpha变成0了，这里还要设成1...
				superVirues[i].GetMainSceneElement().renderer.alpha = 1;
			}
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
			var targetRenderPosX = Tools.GetMatchViewRenderPosX(element.posx);
			var targetRenderPosY = Tools.GetMatchViewRenderPosY(element.posy);
			result = Math.abs(element.renderer.x - targetRenderPosX) >= moveValue
				|| Math.abs(element.renderer.y - targetRenderPosY) >= moveValue;
			var x = Tools.MoveNumber(element.renderer.x, targetRenderPosX, moveValue);
			var y = Tools.MoveNumber(element.renderer.y, targetRenderPosY, moveValue);

			element.SetRenderPos(x, y);
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

	public GetDeadElementArray(): SceneElementBase[]
	{
		return this.deadElementArray;
	}

	public ClearGetDeadElementRenderArray()
	{
		this.deadElementArray = [];
	}
}

enum EliminatingAnimState
{
	Init,
	Lightning,
	MoveDown,
} 