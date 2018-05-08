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

        let npcArray:NpcElement[] = [];
        for(var i = 0; i < elements.length; ++i)
        {
			let npc:NpcElement = <NpcElement>elements[i];
			let randomIndex = Math.floor(Math.random() * sceneEmptyBlocks.length);
			let pos:number[] = sceneEmptyBlocks.splice(randomIndex, 1)[0];
			console.log("Scene Empty Block Length : " + sceneEmptyBlocks.length);
			npc.MoveTo(pos[0], pos[1]);

            let event = new SceneElementControlEvent();
            event.controlType = SceneElementControlType.Add;
            event.sceneElements = npc.GetSceneElements();
            GameMain.GetInstance().DispatchEvent(event);
        }
    }
}

enum NpcType
{
    Enemy,
    Boss,
}