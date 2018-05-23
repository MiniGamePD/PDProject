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
	MovePartical, //播放粒子，并且移动到目标位置
	Max
}