interface IProgramAnimationModule extends IModule
{

}

enum ProgramAnimationType
{
	None,
	PositionLerp, //位置插值
	Lightning, //闪烁
	Scaling, //缩放
	PlayPartical, //播放粒子效果
	Max
}