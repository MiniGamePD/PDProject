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

    public ArrangePos(elements:GameplayElementBase[], sceneEmptyBlocks:number[][])
    {
		if(sceneEmptyBlocks == undefined || elements.length > sceneEmptyBlocks.length)
		{
			console.error("Not Enough Empty Blocks For New Npcs");
			return;
		}

        let npcArray:NpcElement[] = [];
        for(var i = 0; i < elements.length; ++i)
        {
			let npc:NpcElement = <NpcElement>elements[i];
			let randomIndex = Math.floor(Math.random() * sceneEmptyBlocks.length);
			let pos:number[] = sceneEmptyBlocks.splice(randomIndex, 1)[0];
			console.log("Scene Empty Block Length : " + sceneEmptyBlocks.length);
			npc.MoveTo(pos[0], pos[1]);
        }
    }
}

enum NpcElementCreateType
{
    RandomVirus,
    Count,
}