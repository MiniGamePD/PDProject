abstract class ProgramAnimationParamBase
{
	public abstract animType: ProgramAnimationType;
	public callBack: Function;
	public delayTime: number;

	constructor()
	{
		this.callBack = null;
		this.delayTime = 0;
	}
}