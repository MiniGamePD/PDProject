class NpcElementCreator extends GameplayElementCreator
{
    public readonly randomVirusParams:InternalCreatorBase[];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super(gameplayElementFactory);
        this.paramDic = [];
        this.paramDic.length = NpcElementCreateType.Count;

        this.randomVirusParams = [];
        this.randomVirusParams.push(new InternalCreator<Virus>(0, 2, GameElementColor.random, Virus));
        this.paramDic[NpcElementCreateType.RandomVirus] = this.randomVirusParams;
    }
}

enum NpcElementCreateType
{
    RandomVirus,
    Count,
}