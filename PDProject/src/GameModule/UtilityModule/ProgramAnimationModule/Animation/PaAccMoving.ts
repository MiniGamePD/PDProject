class PaAccMovingParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.AccMoving;

	public displayObj: egret.DisplayObject;	// 目标
	public startSpeed: number; 	// 初始速度
	public accelerate: number; 	// 加速度
	public startPos: egret.Point; // 开始位置
	public targetPos: egret.Point;	// 目标位置
	public needRotate: boolean; // 是否需要旋转，朝向目标点
	public needRemoveOnFinish: boolean; // 动画结束是否需要从场景中移除

	public constructor()
	{
		super();
		this.displayObj = null;
		this.startSpeed = 0;
		this.accelerate = 0;
		this.startPos = null;
		this.targetPos = null;
		this.needRotate = false;
		this.needRemoveOnFinish = false;
	}
}

class PaAccMoving extends ProgramAnimationBase<PaAccMovingParam>
{
	private startPos: egret.Point;
	private moveDir: egret.Point;
	private isFinish: boolean;
	private moveDistance: number;
	private targetDistance: number;
	private speed: number;

	protected OnInit()
	{
		this.isFinish = false;
		this.moveDistance = 0;
		if ( this.param.startPos != null && this.param.startPos != undefined)
		{
			this.startPos = this.param.startPos;
			this.param.displayObj.x = this.param.startPos.x;
			this.param.displayObj.y = this.param.startPos.y;
		}
		else
		{
			this.startPos = new egret.Point(this.param.displayObj.x, this.param.displayObj.y);
		}
		this.moveDir = this.param.targetPos.subtract(this.startPos);
		this.targetDistance = this.moveDir.length;
		this.speed = this.param.startSpeed;

		if (this.param.needRotate)
		{
			this.param.displayObj.rotation =
				Tools.GetRotateAngle(this.startPos.x, this.startPos.y, this.param.targetPos.x, this.param.targetPos.y);
		}
	}

	protected OnUpdate(deltaTime: number)
	{
		if (!this.isFinish)
		{
			this.speed += this.param.accelerate * deltaTime * 0.001;
			var moveDis = this.speed * deltaTime * 0.001;
			this.moveDistance += moveDis;
			this.moveDir.normalize(moveDis);
			this.param.displayObj.x += this.moveDir.x;
			this.param.displayObj.y += this.moveDir.y;
			if (this.moveDistance > this.targetDistance)
			{
				this.param.displayObj.x = this.param.targetPos.x;
				this.param.displayObj.y = this.param.targetPos.y;
				this.isFinish = true;
			}
		}

	}

	protected OnRelease()
	{
		if (this.param.needRemoveOnFinish)
		{
			if (this.param.displayObj.parent != undefined
				&& this.param.displayObj.parent != null)
			{
				this.param.displayObj.parent.removeChild(this.param.displayObj);
			}
		}
	}

	public IsFinish()
	{
		return this.isFinish
	}

}