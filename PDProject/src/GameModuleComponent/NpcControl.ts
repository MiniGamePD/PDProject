class NpcControl extends GameModuleComponentBase
{
    private enemyArray:NpcElement[];
    private bossArray:NpcElement[];  
    private creatorWorkParam:CreatorWorkParam;
	private npcElementCreator: NpcElementCreator;

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super();
        this.creatorWorkParam = new CreatorWorkParam();
        this.npcElementCreator = new NpcElementCreator(gameplayElementFactory);
    }

    public Init():void
    {
        GameMain.GetInstance().AddEventListener(SceneElementAccessAnswerEvent.EventName, this.OnReciveSceneData, this);
    }

    public Release():void
    {
        GameMain.GetInstance().RemoveEventListener(SceneElementAccessAnswerEvent.EventName, this.OnReciveSceneData, this);
    }

    protected UpdateInternal(deltaTime:number)
    {
        //todo：不应该放在这
        let event = new NpcControlFinishEvent();
        GameMain.GetInstance().DispatchEvent(event);
        this.isWorking = false;
    }

    public Work(param?:any):any
    {
        super.Work(param);

        let controlWorkParam:GameplayControlWorkParam = param;
        //Todo:thinking

        if(controlWorkParam.turn % createEnemyTurnNum != 0)
            return;

        let event = new SceneElementAccessEvent();
        event.accessType = SceneElementAccessType.GetEmptyBlocks;
        event.startX = 0;
        event.startY = 2;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnReciveSceneData(event:SceneElementAccessAnswerEvent)
    {
        let sceneEmptyBlocks = event.queryElementBlocks;

		this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
		this.creatorWorkParam.createNum = 8;
		let npcElements:NpcElement[] = this.npcElementCreator.Work(this.creatorWorkParam);

		this.ArrangePos(npcElements, sceneEmptyBlocks);
    }

    private ArrangePos(elements:GameplayElementBase[], sceneEmptyBlocks:number[][])
    {
		if(sceneEmptyBlocks == undefined || elements.length > sceneEmptyBlocks.length)
		{
			console.error("Not Enough Empty Blocks For New Npcs");
			return;
		}

        for(var i = 0; i < elements.length; ++i)
        {
			let npc:NpcElement = <NpcElement>elements[i];
            if(npc.bornType == NpcBornType.Normal)
            {
                this.ArrangePosForNormalNpc(npc, sceneEmptyBlocks);
            }
            else if(npc.bornType == NpcBornType.Destroy)
            {
                //todo
                this.ArrangePosForDestroyNpc();
            }
        }
    }

    private ArrangePosForNormalNpc(npc:NpcElement, sceneEmptyBlocks:number[][])
    {
        if(sceneEmptyBlocks == undefined || sceneEmptyBlocks.length <= 0)
		{
			console.error("Not Enough Empty Blocks For New Npcs");
			return;
		}

        let randomIndex = Math.floor(Math.random() * sceneEmptyBlocks.length);
        let pos:number[] = sceneEmptyBlocks.splice(randomIndex, 1)[0];
        npc.MoveTo(pos[0], pos[1]);

        let event = new SceneElementControlEvent();
        event.controlType = SceneElementControlType.Add;
        event.sceneElements = npc.GetSceneElements();
        GameMain.GetInstance().DispatchEvent(event);
    }

    private ArrangePosForDestroyNpc()
    {

    }
}
