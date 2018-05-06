class ControlableElementCreator extends GameplayElementCreator
{
    public readonly normalParams:InternalCreatorBase[];
    public readonly allRandomPillParams:InternalCreatorBase[];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super(gameplayElementFactory);
        this.paramDic = [];
        this.paramDic.length = ControlableElementCreateType.Count;

        this.allRandomPillParams = [];
        this.allRandomPillParams.push(new InternalCreator<Pill>(0, 2, GameElementColor.random, Pill));
        this.paramDic[ControlableElementCreateType.AllRandomPill] = this.allRandomPillParams;

        this.normalParams = [];
        this.normalParams.push(new InternalCreator<Pill>(0, 0.7, GameElementColor.random, Pill));
        this.normalParams.push(new InternalCreator<Vitamins>(0.7, 0.85, GameElementColor.random, Vitamins));
        this.normalParams.push(new InternalCreator<RowEliminater>(0.85, 1, GameElementColor.random, RowEliminater));

        this.paramDic[ControlableElementCreateType.Normal] = this.normalParams;
    }

    public Work(param:any):any
    {
        return super.Work(param);
    }
}

enum ControlableElementCreateType
{
    AllRandomPill,
    Normal,
    Count,
}