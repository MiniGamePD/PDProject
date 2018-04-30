//MVC中的M
class MatchData
{    
    public static readonly battleGroundColumns:number = 8;
    public static readonly battleGroundRows:number = 16;  
    public sceneData:GameElementBase[][] = []; //左上角是00
    public playerControlPill:PlayerControlPill = new PlayerControlPill(); 

    public Init(): void
    {
        //this.sceneData.length = MatchData.battleGroundColumns * MatchData.battleGroundRows;

        for(var i = 0; i < MatchData.battleGroundColumns; ++i)
        {
            this.sceneData.push([]);
            for(var j = 0; j < MatchData.battleGroundRows; ++j)
            {
                this.sceneData[i].push(null);
            }
        }
    }

    public TryCreatePill():boolean
    {
        this.playerControlPill.Reset();//复用药丸实例
        let pill1 = this.playerControlPill.pill1;
        let pill2 = this.playerControlPill.pill2;
        //TODO：如果在sceneData中已经存在东西了，则GameOver
        this.sceneData[pill1.posx][pill1.posy] = pill1;
        this.sceneData[pill2.posx][pill2.posy] = pill2;
        return true;        
    }

    public DropdownPill():void
    {

    }
}