class NpcControl extends GameModuleComponentBase
{
    private enemyArray:NpcElement[];
    private bossArray:NpcElement[];  

    public ArrangePos(elements:GameplayElementBase[], sceneEmptyBlocks:number[][])
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