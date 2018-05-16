class BossSkillAnimation
{
	private static readonly BossAnimDuration: number = 500;
	private static readonly LinkElementDuration: number = 500;
	private static readonly PreElementAnimDuration: number = 500;
	private static readonly NewElementAnimDuration: number = 500;

	private bossSkillInfo: BossSkillInfo;
	private state: BossSkillAnimState;
	private matchView: MatchView;
	private runningTime: number;
	private stateRunningTime: number;

	private skillMoveEffects: SkillMoveEffect[];

	public Init(view: MatchView)
	{
		this.matchView = view;
		this.runningTime = 0;
		this.skillMoveEffects = [];
	}

	public IsPlaying(): boolean
	{
		return this.state != BossSkillAnimState.Init;
	}

	public Start(bossSkillInfo: BossSkillInfo)
	{
		this.runningTime = 0;
		this.stateRunningTime = 0;
		this.bossSkillInfo = bossSkillInfo;
		if (bossSkillInfo != null
			&& bossSkillInfo.hasInfo
			&& bossSkillInfo.skillCaster != null)
		{
			this.EnterState(BossSkillAnimState.BossAnim);
		}
	}

	public Update(deltaTime: number)
	{
		this.runningTime += deltaTime;
		this.stateRunningTime += deltaTime;
		switch (this.state)
		{
			case BossSkillAnimState.BossAnim:
				{
					if (this.stateRunningTime > BossSkillAnimation.BossAnimDuration)
						this.EnterState(BossSkillAnimState.LinkElement);
					break;
				}
			case BossSkillAnimState.LinkElement:
				{
					if (this.stateRunningTime > BossSkillAnimation.LinkElementDuration)
						this.EnterState(BossSkillAnimState.PreElementAnim);
					break;
				}
			case BossSkillAnimState.PreElementAnim:
				{
					if (this.stateRunningTime > BossSkillAnimation.PreElementAnimDuration)
						this.EnterState(BossSkillAnimState.NewElementAnim);
					break;
				}
			case BossSkillAnimState.NewElementAnim:
				{
					if (this.stateRunningTime > BossSkillAnimation.NewElementAnimDuration)
						this.EnterState(BossSkillAnimState.Init);
					break;
				}
		}

		this.UpdateMoveEffect(deltaTime);
	}

	private EnterState(toState: BossSkillAnimState)
	{
		this.stateRunningTime = 0;
		if (this.state != toState)
		{
			if (toState == BossSkillAnimState.Init)
			{
				this.bossSkillInfo.Reset();
			}
			else if (toState == BossSkillAnimState.BossAnim)
			{
				this.bossSkillInfo.skillCaster.PlayAnim(NpcAnimType.UseSkill);
			}
			else if (toState == BossSkillAnimState.LinkElement)
			{
				this.CreateMoveEffectList();
			}
			else if (toState == BossSkillAnimState.PreElementAnim)
			{
				this.OnEnterPreElementAnim();
			}
			else if (toState == BossSkillAnimState.NewElementAnim)
			{
				this.OnEnterNewElementAnim();
			}
			this.state = toState;
		}
	}

	private CreateMoveEffectList()
	{
		var fromX = this.matchView.GetRenderPosX(this.bossSkillInfo.skillCaster.posx);
		var fromY = this.matchView.GetRenderPosY(this.bossSkillInfo.skillCaster.posy);
		if (this.bossSkillInfo.addHealthElement != null)
		{
			for (var i = 0; i < this.bossSkillInfo.addHealthElement.length; ++i)
			{
				var toX = this.matchView.GetRenderPosX(this.bossSkillInfo.addHealthElement[i].posx);
				var toY = this.matchView.GetRenderPosY(this.bossSkillInfo.addHealthElement[i].posy);
				this.CreateMoveEffect(fromX, fromY, toX, toY);
			}
		}

		if (this.bossSkillInfo.elementChangeColorList != null)
		{
			for (var i = 0; i < this.bossSkillInfo.elementChangeColorList.length; ++i)
			{
				var toX = this.matchView.GetRenderPosX(this.bossSkillInfo.elementChangeColorList[i].element.posx);
				var toY = this.matchView.GetRenderPosY(this.bossSkillInfo.elementChangeColorList[i].element.posy);
				this.CreateMoveEffect(fromX, fromY, toX, toY);
			}
		}

		if (this.bossSkillInfo.elementTransList != null)
		{
			for (var i = 0; i < this.bossSkillInfo.elementTransList.length; ++i)
			{
				var toX = this.matchView.GetRenderPosX(this.bossSkillInfo.elementTransList[i].fromElement.posx);
				var toY = this.matchView.GetRenderPosY(this.bossSkillInfo.elementTransList[i].fromElement.posy);
				this.CreateMoveEffect(fromX, fromY, toX, toY);
			}
		}
	}

	private CreateMoveEffect(fromX: number, fromY: number, toX: number, toY: number)
	{
		var effect = new SkillMoveEffect();
		effect.Init(fromX, fromY, toX, toY, BossSkillAnimation.LinkElementDuration);
		this.skillMoveEffects.push(effect);
	}

	private UpdateMoveEffect(deltaTime: number)
	{
		for (var i = 0; i < this.skillMoveEffects.length; ++i)
		{
			this.skillMoveEffects[i].Update(deltaTime);
			if (this.skillMoveEffects[i].IsFinish())
			{
				this.skillMoveEffects[i].Release();
				this.skillMoveEffects.splice(i, 1);
				--i;
			}
		}
	}

	private OnEnterPreElementAnim()
	{
		if (this.bossSkillInfo.elementTransList != null)
		{
			for (var i = 0; i < this.bossSkillInfo.elementTransList.length; ++i)
			{
				this.bossSkillInfo.elementTransList[i].fromElement.renderer.alpha = 0; // 改成播放消除动画
			}
		}
	}

	private OnEnterNewElementAnim()
	{
		this.matchView.RefreshTextrue();
	}
}

enum BossSkillAnimState
{
	Init, 			 //初始化
	BossAnim,		 //Boss动画
	LinkElement,	 //Boss飞出粒子到各个元素
	PreElementAnim,	 //前面的元素动画
	NewElementAnim,	 //最后新元素的出现动画
}