abstract class ControlableElement extends GameplayElementBase
{
    protected hasEliminated: boolean;

    // 【逆时针】旋转的处理。处理旋转后各个元素的贴图方向
    public abstract OnRotateACW();

    // 返回【逆时针】旋转要占用的位置列表
    // 返回格式列表：[targets[1].x, targets[1].y, targets[2].x, targets[2].y, ... ]
    public abstract GetRotateACWPosList(): number[];

    public OnEliminate():boolean
    {
        this.hasEliminated = true;
        return true;
    }

    public IsAlive():boolean
    {
        return !this.hasEliminated;
    }

    public abstract GetPreViewContainer():egret.DisplayObjectContainer
}