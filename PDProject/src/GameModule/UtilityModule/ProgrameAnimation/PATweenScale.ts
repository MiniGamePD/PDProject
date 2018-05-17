class PATweenScale extends ProgrameAnimationBase
{
    public UpdateAnimation(deltaTime:number)
    {
        let tobeDelete:number[] = null;
        for(var i = 0; i < this.processList.length; ++i)
        {
            let param:PATweenScaleParam = <PATweenScaleParam>this.processList[i];

        }

        
    }
}

class PATweenScaleParam extends PAParamBase
{
    public scaleBegin:number;
    public scaleEnd:number;
    public length:number;
    
    public time:number;
}