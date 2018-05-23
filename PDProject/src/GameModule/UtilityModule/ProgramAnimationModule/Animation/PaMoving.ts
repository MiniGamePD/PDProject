class PaMovingParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.Moving;

	public displayObj: egret.DisplayObject;	// 目标
	public duration: number; 		// 时长
	public targetPosX: number;	// 目标X
	public targetPosY: number;	// 目标Y
}

class PaMoving extends ProgramAnimationBase<PaMovingParam>
{
	private startX: number;
	private startY: number;
	protected OnInit()
	{
		this.startX = this.param.displayObj.x;
		this.startY = this.param.displayObj.y;
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime <= this.param.duration)
		{
			var rate = this.runningTime / this.param.duration;
			this.param.displayObj.x = Tools.Lerp(this.startX, this.param.targetPosX, rate);
			this.param.displayObj.y = Tools.Lerp(this.startY, this.param.targetPosY, rate);
		}
	}

	protected OnRelease()
	{

	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}