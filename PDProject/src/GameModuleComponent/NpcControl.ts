class NpcControl extends GameModuleComponentBase
{
    private enemyArray:NpcElement[];
    private bossArray:NpcElement[];  
    private creatorWorkParam:CreatorWorkParam;
	private npcElementCreator: NpcElementCreator;

    //用于将npc一个一个添加进场景中的表现
    private tobeAddToSceneNpcArray:NpcElement[];
    private addNpcToSceneInterval:number;

    //如果创建了Npc，则播放一个很贱的笑声
    private npcSmileSound:string;

    private npcControlTimer:number;
    private npcControlState:NpcControlState;

    //用于消除创建NPC的阻碍元素
    private obstruction:number[];

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

        if(this.npcControlState == NpcControlState.DestroyObstruction)
        {
            //接上一次NpcControl的操作，直接跳转到AddNpcToScene
            this.obstruction = null;
            this.npcControlState = NpcControlState.AddNpcToScene;
            return;
        }

        let controlWorkParam:GameplayControlWorkParam = param;
         //Todo:thinking
        if(controlWorkParam.turn % createEnemyTurnNum != 0)
        {
            this.npcControlState = NpcControlState.NpcControlFinish;
            return;
        }    

        this.npcSmileSound = null;

        if(controlWorkParam.turn < 10)
        {
            //创建普通小怪
            this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
		    this.creatorWorkParam.createNum = 8;
		    this.tobeAddToSceneNpcArray = this.npcElementCreator.CreateElement(this.creatorWorkParam);

            //向scene询问空的格子，用来放置新生成的小怪
            let event = new SceneElementAccessEvent();
            event.accessType = SceneElementAccessType.GetEmptyBlocks;
            event.startX = 0;
            event.startY = 2;
            GameMain.GetInstance().DispatchEvent(event);

            this.npcSmileSound = "EnemySinisterSmile1_mp3"; 
        }
        else
        {
            //创建boss
            this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomSuperVirus;
		    this.creatorWorkParam.createNum = 1;
            this.tobeAddToSceneNpcArray = [];
            this.tobeAddToSceneNpcArray.push(this.npcElementCreator.CreateElement(this.creatorWorkParam));

            //向scene询问已经存在的boss的格子，用来放置新生成的boss
            let event = new SceneElementAccessEvent();
            event.accessType = SceneElementAccessType.GetPlaceholderBlocks;
            event.startX = 0;
            event.startY = 2;
            GameMain.GetInstance().DispatchEvent(event);

            this.npcSmileSound = "EnemySinisterSmile2_mp3"; 
        }
    }

    private OnReciveSceneData(event:SceneElementAccessAnswerEvent)
    {
        this.obstruction = [];
        for(var i = 0; i < this.tobeAddToSceneNpcArray.length; ++i)
        {
            let npc:NpcElement = this.tobeAddToSceneNpcArray[i];
            let subObstruction = this.ArrangePos(npc, event.queryElementBlocks);
            if(subObstruction != null)
            {
                this.obstruction = this.obstruction.concat(subObstruction);
            }
        }

        this.npcControlTimer = 0;
        this.addNpcToSceneInterval = addNpcToSceneIntervalMax;

        if(this.obstruction.length > 0)
        {
            this.npcControlState = NpcControlState.DestroyObstruction;
        }
        else
        {
            this.npcControlState = NpcControlState.AddNpcToScene;
        }
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
            case NpcControlState.DestroyObstruction:
                this.UpdateDestroyObstruction(deltaTime);
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
                this.AddNpcToScene(npc);
                this.tobeAddToSceneNpcArray.splice(index, 1);
                this.npcControlTimer = 0;
                this.addNpcToSceneInterval -= addNpcToSceneIntervalStep;
                this.addNpcToSceneInterval = Math.max(this.addNpcToSceneInterval, addNpcToSceneIntervalMin);
            }
        }
        else
        {
            this.tobeAddToSceneNpcArray = null;

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

    private UpdateDestroyObstruction(delteTime:number)
    {
        let event = new NpcControlFinishEvent();
        event.specialEliminateMethod = new EliminateMethod();
        event.specialEliminateMethod.methodType = EliminateMethodType.SpecificRegion;
        event.specialEliminateMethod.specificRegion = this.obstruction;
        event.specialEliminateMethod.eliminateElementType = EliminateElementType.Normal;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private ArrangePos(npc:NpcElement, querySceneBlocks:number[][]):number[]
    {
		if(querySceneBlocks == undefined || querySceneBlocks == null)
		{
			console.error("Query Scene Blocks Failed");
			return null;
		}

        let result = null;
        if(npc.bornType == NpcBornType.Normal)
        {
            this.ArrangePosForNormalNpc(npc, querySceneBlocks);
        }
        else if(npc.bornType == NpcBornType.Destroy)
        {
            result = this.ArrangePosForDestroyNpc(npc, querySceneBlocks);
        }
        return result;
    }

    private ArrangePosForNormalNpc(npc:NpcElement, querySceneBlocks:number[][])
    {
        if(querySceneBlocks == undefined || querySceneBlocks.length <= 0)
		{
			console.error("Not Enough Space For Normal Born Type Npcs");
			return;
		}

        let randomIndex = Math.floor(Math.random() * querySceneBlocks.length);
        let pos:number[] = querySceneBlocks.splice(randomIndex, 1)[0];
        npc.MoveTo(pos[0], pos[1]);
    }

    private ArrangePosForDestroyNpc(npc:NpcElement, querySceneBlocks:number[][]):number[]
    {
        if(querySceneBlocks == undefined || querySceneBlocks == null)
		{
			console.error("Can't Get Placeholder Array In Scene?");
			return null;
		}

        let result:number[] = null;
        let validPos:number[][] = this.GetValidPosForDestroyNpc(npc, querySceneBlocks);
        if(validPos.length > 0)
        {
            let randomIndex = Math.floor(Math.random() * validPos.length);
            let pos:number[] = validPos.splice(randomIndex, 1)[0];
            npc.MoveTo(pos[0], pos[1]);

            result = Tools.GetRegionPosList(pos[0], pos[1], pos[0] + npc.blockWidth - 1, pos[1] + npc.blockHeight - 1);
        }
        else
        {
            console.error("Not Enough Space For Destroy Born Type NPC");
        }
        return result;
    }

    private GetValidPosForDestroyNpc(npc:NpcElement, querySceneBlocks:number[][]):number[][]
    {
        let validPos:number[][] = [];
        for (var i = 0; i < Scene.Columns; ++i) 
        {
            validPos.push([]);
            for (var j = 0; j < Scene.Rows; ++j) 
            {
                let valid:boolean = (i <= Scene.Columns - npc.blockWidth) && 
                    (j <= Scene.Rows - npc.blockHeight) && j >= 2;
                validPos[i].push(valid ? 1 : 0);
            }
        }

        //根据现有的placeholder的位置，把不能生成的位置都排除掉
        for(var i = 0; i < querySceneBlocks.length; ++i)
        {
            let pos:number[] = querySceneBlocks[i];
            let invalidStartX = pos[0] - npc.blockWidth + 1;
            invalidStartX = Math.max(0, invalidStartX);
            let invalidStartY = pos[1] - npc.blockHeight + 1;
            invalidStartY = Math.max(0, invalidStartY);

            for(var ix = invalidStartX; ix <= pos[0]; ++ix)
            {
                for(var iy = invalidStartY; iy <= pos[1]; ++iy)
                {
                    validPos[ix][iy] = 0;
                }
            }
        }

        let result:number[][] = [];
        for (var i = 0; i < (Scene.Columns - npc.blockWidth); ++i) 
        {
            for (var j = 0; j < (Scene.Rows - npc.blockHeight); ++j) 
            {
                if(validPos[i][j] == 1)
                {
                    let block:number[] = [];
                    block.push(i);
                    block.push(j);
                    result.push(block);
                }
            }
        }

        return result;
    }

    private AddNpcToScene(npc:NpcElement)
    {
        let event = new SceneElementControlEvent();
        event.controlType = SceneElementControlType.Add;
        event.sceneElements = npc.GetSceneElements();
        event.playerControl = false;
        GameMain.GetInstance().DispatchEvent(event);

        npc.PlaySound(NpcSoundType.Born);
    }
}

enum NpcControlState
{
    None,
    DestroyObstruction,
    AddNpcToScene,
    PlaySinisterSmileSound,
    NpcControlFinish,
}