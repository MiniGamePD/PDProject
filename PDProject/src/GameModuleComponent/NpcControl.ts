class NpcControl extends GameModuleComponentBase
{
    private enemyArray:NpcElement[];
    private bossArray:NpcElement[];  
    private creatorWorkParam:CreatorWorkParam;
	private npcElementCreator: NpcElementCreator;

    //用于将npc一个一个添加进场景中的表现
    private tobeAddToSceneNpcArray:NpcElement[];
    private sceneEmptyBlocks:number[][];
    private addNpcToSceneInterval:number;

    //如果创建了Npc，则播放一个很贱的笑声
    private npcSmileSound:string;

    private npcControlTimer:number;
    private npcControlState:NpcControlState;

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

    public Work(param?:any):any
    {
        super.Work(param);

        let controlWorkParam:GameplayControlWorkParam = param;
        //Todo:thinking

        if(controlWorkParam.turn % createEnemyTurnNum != 0)
        {
            this.npcControlState = NpcControlState.NpcControlFinish;
            return;
        }    

        this.npcSmileSound = null;

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
        
        this.npcControlTimer = 0;
        
        this.npcControlState = NpcControlState.AddNpcToScene;
        this.addNpcToSceneInterval = addNpcToSceneIntervalMax;

        this.npcSmileSound = "EnemySinisterSmile1_mp3";
    }

    protected UpdateInternal(deltaTime:number)
    { 
        switch(this.npcControlState)
        {
            case NpcControlState.AddNpcToScene:
                this.UpdateAddNpcToScene(deltaTime);
                break;
            case NpcControlState.PlaySinisterSmileSound:
                this.UpdatePlaySinisterSmileSound(deltaTime);
                break;
            case NpcControlState.NpcControlFinish:
                this.UpdateNpcControlFinish(deltaTime);
                break;
        }
    }

    private UpdateAddNpcToScene(deltaTime:number)
    {
        if(this.tobeAddToSceneNpcArray != null && this.tobeAddToSceneNpcArray.length > 0)
        {
            this.npcControlTimer += deltaTime;
            if(this.npcControlTimer >= this.addNpcToSceneInterval)
            {
                let index = this.tobeAddToSceneNpcArray.length - 1;
                let npc = this.tobeAddToSceneNpcArray[index];
                this.ArrangePos(npc, this.sceneEmptyBlocks);
                this.tobeAddToSceneNpcArray.splice(index, 1);
                this.npcControlTimer = 0;
                this.addNpcToSceneInterval -= addNpcToSceneIntervalStep;
                this.addNpcToSceneInterval = Math.max(this.addNpcToSceneInterval, addNpcToSceneIntervalMin);
            }
        }
        else
        {
            this.tobeAddToSceneNpcArray = null;
            this.sceneEmptyBlocks = null;

            if(this.npcSmileSound != null)
            {
                this.npcControlState = NpcControlState.PlaySinisterSmileSound;
            }
            else
            {
                this.npcControlState = NpcControlState.NpcControlFinish;
            }
        }
    }

    private UpdatePlaySinisterSmileSound(deltaTime:number)
    {
        if(this.npcSmileSound != null)
        {
            this.npcControlTimer = playEnemySinisterSmileTime;    

            let event = new PlaySoundEvent(this.npcSmileSound, 1);
            GameMain.GetInstance().DispatchEvent(event);

            this.npcSmileSound = null;
        }
        else
        {
            this.npcControlTimer -= deltaTime;
            if(this.npcControlTimer <= 0)
            {
                this.npcControlState = NpcControlState.NpcControlFinish;
            }
        }
    }

    private UpdateNpcControlFinish(delteTime:number)
    {
        this.npcControlState = NpcControlState.None;
        let event = new NpcControlFinishEvent();
        GameMain.GetInstance().DispatchEvent(event);
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

enum NpcControlState
{
    None,
    AddNpcToScene,
    PlaySinisterSmileSound,
    NpcControlFinish,
}