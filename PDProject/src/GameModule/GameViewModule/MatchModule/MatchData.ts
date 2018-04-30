//MVC中的M
class MatchData
{    
    public static readonly battleGroundColumns:number = 8;
    public static readonly battleGroundRows:number = 16;  
    public sceneData:GameElementBase[][] = []; //左上角是00
    public playerControlPill:PlayerControlPill = new PlayerControlPill(); 

    public Init(): void
    {       
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

    public TryDropdownPill():boolean
    {        
        let result:boolean = true;
        let pill1 = this.playerControlPill.pill1;
        let pill2 = this.playerControlPill.pill2;

        if(pill1.posy > pill1.posy)
        {
            //pill1在底部
            let newPosx = pill1.posx;
            let newPosy = pill1.posy+1;
            result = this.sceneData[newPosx][newPosy] == null && newPosy < MatchData.battleGroundRows;
            if(result)
            {
                this.sceneData[pill2.posx][pill2.posy] = null;
                pill2.MoveTo(pill1.posx, pill1.posy);
                pill1.MoveTo(newPosx, newPosy);
            }
        }
        else if(pill1.posy < pill2.posy)
        {
            //pill2在底部
            let newPosx = pill2.posx;
            let newPosy = pill2.posy+1;
            result = this.sceneData[newPosx][newPosy] == null && newPosy < MatchData.battleGroundRows;
            if(result)
            {
                this.sceneData[pill1.posx][pill1.posy] = null;
                pill1.MoveTo(pill2.posx, pill2.posy);
                pill2.MoveTo(newPosx, newPosy);
            }
        }
        else
        {
            //药丸是横着的
            let newPosx1 = pill1.posx;
            let newPosy1 = pill1.posy+1;
            let newPosx2 = pill2.posx;
            let newPosy2 = pill2.posy+1;
            result = this.sceneData[newPosx1][newPosy1] == null && newPosy1 < MatchData.battleGroundRows
                && this.sceneData[newPosx2][newPosy2] == null && newPosy2 < MatchData.battleGroundRows;
            if(result)
            {                
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }
            else
            {
                console.log("Try drop down 2 " + result);
            }            
        }
        return result;
    }

    private MoveElement(element:GameElementBase, newPosx:number, newPosy:number)
    {
        let gameElementInColumn = this.sceneData[element.posx];
        gameElementInColumn[element.posy] = null;

        gameElementInColumn = this.sceneData[newPosx];
        gameElementInColumn[newPosy] = element;

        element.MoveTo(newPosx, newPosy);
    }
}