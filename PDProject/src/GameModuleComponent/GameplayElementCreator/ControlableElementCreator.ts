class ControlableElementCreator extends GameplayElementCreator
{
    public readonly normalParams:InternalCreatorBase[];
    public readonly allRandomPillParams:InternalCreatorBase[];
    public readonly randomEliminateTool:InternalCreatorBase[];

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

        this.randomEliminateTool = [];
        this.randomEliminateTool.push(new InternalCreator<Vitamins>(0.0, 0.2, GameElementColor.random, Vitamins)); //20%
        this.randomEliminateTool.push(new InternalCreator<CrossEliminater>(0.2, 0.4, GameElementColor.random, CrossEliminater)); //20%
        this.randomEliminateTool.push(new InternalCreator<RowEliminater>(0.4, 0.7, GameElementColor.random, RowEliminater)); //30%
        this.randomEliminateTool.push(new InternalCreator<ColumnEliminater>(0.7, 0.1, GameElementColor.random, ColumnEliminater)); //30%
    }
}

enum ControlableElementCreateType
{
    AllRandomPill,
    Normal,
    RandomEliminateTool,
    Count,
}