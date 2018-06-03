interface IProgramAnimationModule extends IModule
{

}

enum ProgramAnimationType
{
	None,
	PositionLerp, //位置插值
	Lightning, //闪烁
	Scaling, //缩放
	DynamicMoving, //动态移动
	Moving,   //移动
	PlayPartical, //播放粒子效果
	MovePartical, //播放粒子，并且移动到目标位置
	PlayDBAnimation, // 播放序列帧动画
	AddScole, //播放元素消除，加分动画
	PlayFramesAnim, // 播放帧动画
	AlphaLoop, // Alpha滚动
	Max
}