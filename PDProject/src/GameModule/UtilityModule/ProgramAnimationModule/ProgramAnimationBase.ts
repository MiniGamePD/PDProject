abstract class ProgramAnimationBase<T extends ProgramAnimationParamBase> implements IProgramAnimation
{
	public animType: ProgramAnimationType;
	public runningTime = 0;
	public param: T;

	// 派生类的初始化处理
	protected abstract OnInit();

	// 派生类的更新处理
	protected abstract OnUpdate(deltaTime: number);

	// 派生类的析构处理
	protected abstract OnRelease();

	// 派生类返回是否完成
	public abstract IsFinish();

	public Init(param: ProgramAnimationParamBase): boolean
	{
		this.runningTime = 0;
		this.animType = param.animType;
		this.param = <T>param;
		if (this.param != null)
		{
			this.OnInit();
			return true;
		}
		else
		{
			return false;
		}
	}

	public Update(deltaTime: number): void
	{
		this.runningTime += deltaTime;
		this.OnUpdate(deltaTime);
	}

	public Release(): void 
	{
		this.OnRelease();
		this.runningTime = 0;
		this.animType = ProgramAnimationType.None;
		this.param = null;
	}
}