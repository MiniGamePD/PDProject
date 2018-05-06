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
        this.normalParams.push(new InternalCreator<Pill>(0, 0.6, GameElementColor.random, Pill));
        this.normalParams.push(new InternalCreator<Vitamins>(0.6, 0.7, GameElementColor.random, Vitamins));
        this.normalParams.push(new InternalCreator<RowEliminater>(0.7, 0.8, GameElementColor.random, RowEliminater));
        this.normalParams.push(new InternalCreator<ColumnEliminater>(0.8, 0.9, GameElementColor.random, ColumnEliminater));
        this.normalParams.push(new InternalCreator<CrossEliminater>(0.9, 1, GameElementColor.random, CrossEliminater));

        this.paramDic[ControlableElementCreateType.Normal] = this.normalParams;
    }
}

enum ControlableElementCreateType
{
    AllRandomPill,
    Normal,
    Count,
}