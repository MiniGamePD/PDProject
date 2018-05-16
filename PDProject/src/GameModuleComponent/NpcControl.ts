class NpcControl extends GameModuleComponentBase
{
    //保存这个数组，后面这些npc需要通过NpcControl来触发技能
    private skillNpcArray:NpcElement[];  

    private creatorWorkParam:CreatorWorkParam;
	private npcElementCreator: NpcElementCreator;

    //用于将npc一个一个添加进场景中的表现
    private tobeAddToSceneNpcArray:NpcElement[];
    private addNpcToSceneInterval:number;

    //如果创建了Npc，则播放一个很贱的笑声
    private npcSmileSound:string;

    private npcControlTimer:number;
    private npcControlState:NpcControlState;

    //用于记录当前npc的skill信息
    private curNpcSkillInfo:BossSkillInfo;

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super();
        this.creatorWorkParam = new CreatorWorkParam();
        this.npcElementCreator = new NpcElementCreator(gameplayElementFactory);
        this.skillNpcArray = [];
    }

    public Init():void
    {
        GameMain.GetInstance().AddEventListener(SceneElementAccessAnswerEvent.EventName, this.OnReciveSceneData, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlFailedEvent.EventName, this.OnAddElementToSceneFailed, this);
    }

    public Release():void
    {
        GameMain.GetInstance().RemoveEventListener(SceneElementAccessAnswerEvent.EventName, this.OnReciveSceneData, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlFailedEvent.EventName, this.OnAddElementToSceneFailed, this);
    }

    public Work(param?:any):any
    {
        super.Work(param);

        if(this.npcControlState == NpcControlState.DestroyObstruction)
        {
            //接上一次NpcControl的操作，直接跳转到AddNpcToScene
            this.npcControlState = NpcControlState.AddNpcToScene;
            return;
        }

        if(this.npcControlState == NpcControlState.NpcSkill)
        {
             //接上一次NpcControl的操作，直接跳转到NpcControlFinish
            this.npcControlState = NpcControlState.NpcControlFinish;
            return;
        }

        let controlWorkParam:GameplayControlWorkParam = param;

        this.npcSmileSound = null;
        this.curNpcSkillInfo = null;

        if(controlWorkParam.turn != 0 && controlWorkParam.turn % createSkillBossTurnNum == 0 
            && this.skillNpcArray.length < skillBossMaxNum)
        {
            //创建boss
            this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomSuperVirus;
		    this.creatorWorkParam.createNum = 1;
            this.tobeAddToSceneNpcArray = [];
            this.tobeAddToSceneNpcArray.push(this.npcElementCreator.CreateElement(this.creatorWorkParam));

            //向scene询问已经存在的boss的格子，用来放置新生成的boss
            let event = new SceneElementAccessEvent();
            event.accessType = SceneElementType.PlaceHolder;
            event.answerType = SceneElementAccessAnswerType.Pos;
            event.startX = 0;
            event.startY = 2;
            GameMain.GetInstance().DispatchEvent(event);

            this.npcSmileSound = "EnemySinisterSmile2_mp3"; 
            return;
        }    

        if(this.skillNpcArray.length > 0 && controlWorkParam.turn % bossSkillTurnNum == 0)
        {
            //boss放技能
            let id:number = Math.floor(this.skillNpcArray.length * Math.random());
            let skillNpc:NpcElement = this.skillNpcArray[id];

            //首先向scene查询对应物体的列表
            let event = new SceneElementAccessEvent();
            event.answerType = SceneElementAccessAnswerType.Instance;
            if(skillNpc.SkillType() == NpcSkillType.AddShieldForVirus ||
                skillNpc.SkillType() == NpcSkillType.ChangeVirusColor)
            {
                event.accessType == SceneElementType.Virus;
            }
            else if(skillNpc.SkillType() == NpcSkillType.ChangePillToVirus)
            {
                event.accessType == SceneElementType.Pill;
            }
            else
            {
                console.error("Invalid Skill Type " + skillNpc.SkillType());
            }

            this.curNpcSkillInfo = new BossSkillInfo();
            this.curNpcSkillInfo.skillCaster = skillNpc;
            GameMain.GetInstance().DispatchEvent(event);
            
            return;
        }

        if(controlWorkParam.turn % createEnemyTurnNum == 0)
        {
            //创建普通小怪
            this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
		    this.creatorWorkParam.createNum = 8;
		    this.tobeAddToSceneNpcArray = this.npcElementCreator.CreateElement(this.creatorWorkParam);

            //向scene询问空的格子，用来放置新生成的小怪
            let event = new SceneElementAccessEvent();
            event.accessType = SceneElementType.Empty;
            event.answerType = SceneElementAccessAnswerType.Pos;
            event.startX = 0;
            event.startY = 2;
            GameMain.GetInstance().DispatchEvent(event);

            this.npcSmileSound = "EnemySinisterSmile1_mp3"; 
            return;
        }

        //npc 啥事也不做
        this.npcControlState = NpcControlState.NpcControlFinish;
    }

    private OnReciveSceneData(event:SceneElementAccessAnswerEvent)
    {
        if(this.curNpcSkillInfo != null)
        {
            this.PrepareNpcSkillInfo(event.queryAnswerArray);
        }
        else
        {
            this.ArrangePosForNewNpcElements(event.queryAnswerArray);
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

    private PrepareNpcSkillInfo(querySceneInstances:SceneElementBase[])
    {
         let skillTargetArray:SceneElementBase[] = [];
            
        let skillTargetNum = Math.min(querySceneInstances.length, bossSkillTargetNum);
        while(skillTargetNum > 0)
        {
            skillTargetNum--;
            let id = Math.floor(Math.random() * querySceneInstances.length);
            let sceneElement = querySceneInstances.slice(id, 1)[0];
            skillTargetArray.push(sceneElement);
        }

        if(skillTargetArray.length > 0)
        {
            //找到了一些元素来施放技能
            let skillCaster = this.curNpcSkillInfo.skillCaster;
            if(skillCaster.SkillType() == NpcSkillType.AddShieldForVirus)
            {
                this.curNpcSkillInfo.addHealthElement = skillTargetArray;
            }
            else if(skillCaster.SkillType() == NpcSkillType.ChangePillToVirus)
            {
                this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
                this.creatorWorkParam.createNum = skillTargetArray.length;
                let transToElementArray = this.npcElementCreator.CreateElement(this.creatorWorkParam);

                this.curNpcSkillInfo.elementTransList = [];
                for(var i = 0; i < skillTargetArray.length; ++i)
                {
                    let transInfo = new ElementTransInfo();
                    transInfo.fromElement = skillTargetArray[i];
                    transInfo.toElement = transToElementArray[i];
                    this.curNpcSkillInfo.elementTransList.push(transInfo);
                }
            }
            else if(skillCaster.SkillType() == NpcSkillType.ChangeVirusColor)
            {
                this.curNpcSkillInfo.elementChangeColorList = [];
                for(var i = 0; i < skillTargetArray.length; ++i)
                {
                    let changeColorInfo = new ElementChangeColorInfo();
                    changeColorInfo.element = skillTargetArray[i];
                    changeColorInfo.targetColor = GameElementColorGenerator.RandomColor(skillTargetArray[i].color); 
                    this.curNpcSkillInfo.elementChangeColorList.push(changeColorInfo);
                }
            }
        }
        else
        {
            this.curNpcSkillInfo = null;
        }

        this.npcControlState = NpcControlState.NpcSkill;

        let controlFinishEvent = new NpcControlFinishEvent();
        controlFinishEvent.specialEliminateMethod = null;
        controlFinishEvent.bossSkillInfo = this.curNpcSkillInfo;
        GameMain.GetInstance().DispatchEvent(controlFinishEvent);
    }

    private ArrangePosForNewNpcElements(querySceneBlocks:number[][])
    {
        let obstruction:number[] = [];
        for(var i = 0; i < this.tobeAddToSceneNpcArray.length; ++i)
        {
            let npc:NpcElement = this.tobeAddToSceneNpcArray[i];
            let subObstruction = this.ArrangePos(npc, querySceneBlocks);
            if(subObstruction != null)
            {
                obstruction = obstruction.concat(subObstruction);
            }
        }

        this.npcControlTimer = 0;
        this.addNpcToSceneInterval = addNpcToSceneIntervalMax;

        if(obstruction.length > 0)
        {
            this.npcControlState = NpcControlState.DestroyObstruction;

            let event = new NpcControlFinishEvent();
            event.specialEliminateMethod = new EliminateMethod();
            event.specialEliminateMethod.methodType = EliminateMethodType.SpecificRegion;
            event.specialEliminateMethod.specificRegion = obstruction;
            event.specialEliminateMethod.eliminateElementType = EliminateElementType.Normal;
            GameMain.GetInstance().DispatchEvent(event);
        }
        else
        {
            this.npcControlState = NpcControlState.AddNpcToScene;
        }
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
        else if(npc.bornType == NpcBornType.DestroyObstruction)
        {
            result = this.ArrangePosForDestroyObstructionNpc(npc, querySceneBlocks);
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

    private ArrangePosForDestroyObstructionNpc(npc:NpcElement, querySceneBlocks:number[][]):number[]
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
            console.error("Not Enough Space For Destroy Obstruction Born Type NPC");
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

        //默认是会成功的，不成功会报错，所以这里就直接添加到逻辑数组里去了
        if(npc.SkillType() != NpcSkillType.None)
        {
            this.skillNpcArray.push(npc);
        }
    }

    private OnAddElementToSceneFailed(event:SceneElementControlFailedEvent)
    {
        if(!event.playerControl)
        {
            console.error("NpcControl Add Element To Scene Failed");
        }
    }
}

enum NpcControlState
{
    None,
    DestroyObstruction,
    AddNpcToScene,
    PlaySinisterSmileSound,
    NpcSkill,
    NpcControlFinish,
}