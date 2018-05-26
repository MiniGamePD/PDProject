class PaPlayDBAnimationParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayDBAnimation;

	public resName: string; // 粒子贴图名字
	public animationName: string; //动画名字
	public duration: number; 	// 总时长
	public playTimes: number; //playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
	public posX: number; 		// 坐标X
	public posY: number; 		// 坐标Y

	public constructor()
	{
		super();
		this.resName = "";
		this.animationName = "";
		this.duration = 0;
		this.playTimes = -1;
		this.posX = 0;
		this.posY = 0;
	}
}

class PaPlayDBAnimation extends ProgramAnimationBase<PaPlayDBAnimationParam>
{
	private armatureDisplay: dragonBones.EgretArmatureDisplay;
	protected OnInit()
	{
		let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
		this.armatureDisplay = egretFactory.buildArmatureDisplay(this.param.animationName);
		if (this.armatureDisplay != null)
		{
			GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.armatureDisplay);
			this.armatureDisplay.x = this.param.posX;
			this.armatureDisplay.y = this.param.posY;
			this.armatureDisplay.animation.play(this.param.animationName, 1);
		}
	}

	protected OnUpdate(deltaTime: number)
	{

	}

	protected OnRelease()
	{
		if (this.armatureDisplay != null
		&& this.armatureDisplay.parent != null
		&& this.armatureDisplay.parent != undefined)
		{
			this.armatureDisplay.parent.removeChild(this.armatureDisplay);
			this.armatureDisplay = null;
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}