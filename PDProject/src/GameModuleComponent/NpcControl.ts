class NpcControl extends GameModuleComponentBase
{
    private enemyArray:NpcElement[];
    private bossArray:NpcElement[];  
    private creatorWorkParam:CreatorWorkParam;
	private npcElementCreator: NpcElementCreator;

    //用于将npc一个一个添加进场景中的表现
    private tobeAddToSceneNpcArray:NpcElement[];
    private sceneEmptyBlocks:number[][];
    private addNpcTimer:number;
    private addNpcToSceneInterval:number;

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
        if(this.tobeAddToSceneNpcArray != null && this.tobeAddToSceneNpcArray.length > 0)
        {
            this.addNpcTimer += deltaTime;
            if(this.addNpcTimer >= this.addNpcToSceneInterval)
            {
                let index = this.tobeAddToSceneNpcArray.length - 1;
                let npc = this.tobeAddToSceneNpcArray[index];
                this.ArrangePos(npc, this.sceneEmptyBlocks);
                this.tobeAddToSceneNpcArray.splice(index, 1);
                this.addNpcTimer = 0;
                this.addNpcToSceneInterval -= addNpcToSceneIntervalStep;
                this.addNpcToSceneInterval = Math.max(this.addNpcToSceneInterval, addNpcToSceneIntervalMin);
            }
        }
        else
        {
            this.addNpcTimer = 0;
            this.tobeAddToSceneNpcArray = null;
            this.sceneEmptyBlocks = null;
            this.addNpcToSceneInterval = addNpcToSceneIntervalMax;

            let event = new NpcControlFinishEvent();
            GameMain.GetInstance().DispatchEvent(event);
            this.isWorking = false;
        }
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
        this.sceneEmptyBlocks = event.queryElementBlocks;

		this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
		this.creatorWorkParam.createNum = 8;
		this.tobeAddToSceneNpcArray = this.npcElementCreator.CreateElement(this.creatorWorkParam);
        this.addNpcTimer = 0;
        this.addNpcToSceneInterval = addNpcToSceneIntervalMax;
    }

    private ArrangePos(npc:NpcElement, sceneEmptyBlocks:number[][])
    {
		if(sceneEmptyBlocks == undefined || sceneEmptyBlocks.length <= 0)
		{
			console.error("Not Enough Empty Blocks For New Npcs");
			return;
		}

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

    private ArrangePosForNormalNpc(npc:NpcElement, sceneEmptyBlocks:number[][])
    {
        if(sceneEmptyBlocks == undefined || sceneEmptyBlocks.length <= 0)
		{
			console.error("Not Enough Empty Blocks For New Npcs");
			return;
		}

        let randomIndex = Math.floor(Math.random() * sceneEmptyBlocks.length);
        let pos:number[] = sceneEmptyBlocks.splice(randomIndex, 1)[0];
        npc.PlaySound(NpcSoundType.Born);
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
