abstract class ProgrameAnimationBase
{
    protected processList:PAParamBase[];

    public abstract UpdateAnimation(deltaTime:number);
}

abstract class PAParamBase
{
    public target:egret.DisplayObject;
}