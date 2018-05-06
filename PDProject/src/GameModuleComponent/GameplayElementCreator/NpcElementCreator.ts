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

    public ArrangePos(elements:GameplayElementBase[])
    {
        let npcArray:NpcElement[] = [];
        for(var i = 0; i < elements.length; ++i)
        {
            npcArray.push(<NpcElement>elements[i]);
        }
		for(var i = 0; i < npcArray.length; ++i)
		{
			while(true)
			{
				let posx = Math.floor(Math.random() * Scene.Columns);
				let posy = Math.floor(Math.random() * Scene.Rows);

				let find = false;
				for(var j = 0; j < npcArray.length; ++j)
				{
					if(npcArray[j].posx == posx || npcArray[j].posy == posy || posy <= 2)
					{
						find = true;
						break;
					}
				}

				if(!find)
				{
					npcArray[i].MoveTo(posx, posy);
					break;
				}
			}
		}
    }
}

enum NpcElementCreateType
{
    RandomVirus,
    Count,
}