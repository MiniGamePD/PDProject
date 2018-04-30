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

        if(pill1.posy > pill2.posy)
        {
            //pill1在底部
            let newPosx = pill1.posx;
            let newPosy = pill1.posy+1;
            result = newPosy < MatchData.battleGroundRows && this.sceneData[newPosx][newPosy] == null;
            if(result)
            {
                this.MoveElement(pill2, pill1.posx, pill1.posy);
                this.MoveElement(pill1, newPosx, newPosy);
            }
        }
        else if(pill1.posy < pill2.posy)
        {
            //pill2在底部
            let newPosx = pill2.posx;
            let newPosy = pill2.posy+1;
            result = newPosy < MatchData.battleGroundRows && this.sceneData[newPosx][newPosy] == null;
            if(result)
            {
                this.MoveElement(pill1, pill2.posx, pill2.posy);
                this.MoveElement(pill2, newPosx, newPosy);
            }
        }
        else
        {
            //药丸是横着的
            let newPosx1 = pill1.posx;
            let newPosy1 = pill1.posy+1;
            let newPosx2 = pill2.posx;
            let newPosy2 = pill2.posy+1;
            result = newPosy1 < MatchData.battleGroundRows && this.sceneData[newPosx1][newPosy1] == null
                && newPosy2 < MatchData.battleGroundRows && this.sceneData[newPosx2][newPosy2] == null;
            if(result)
            {                
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }        
        }
        return result;
    }

    public TryMoveLeftPill():boolean
    {
        let result:boolean = true;
        let pill1 = this.playerControlPill.pill1;
        let pill2 = this.playerControlPill.pill2;

        if(pill1.posx < pill2.posx)
        {
            //pill1在左边
            let newPosx = pill1.posx-1;
            let newPosy = pill1.posy;
            result = newPosx >= 0 && this.sceneData[newPosx][newPosy] == null;
            if(result)
            {
                this.MoveElement(pill2, pill1.posx, pill1.posy);
                this.MoveElement(pill1, newPosx, newPosy);
            }
        }
        else if(pill1.posx > pill2.posx)
        {
            //pill2在左边
            let newPosx = pill2.posx-1;
            let newPosy = pill2.posy;
            result = newPosx >= 0 && this.sceneData[newPosx][newPosy] == null;
            if(result)
            {
                this.MoveElement(pill1, pill2.posx, pill2.posy);
                this.MoveElement(pill2, newPosx, newPosy);
            }
        }
        else
        {
            //药丸是竖着的
            let newPosx1 = pill1.posx-1;
            let newPosy1 = pill1.posy;
            let newPosx2 = pill2.posx-1;
            let newPosy2 = pill2.posy;
            result = newPosx1 >= 0 && this.sceneData[newPosx1][newPosy1] == null
                && newPosx2 >= 0 && this.sceneData[newPosx2][newPosy2] == null;
            if(result)
            {                
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }         
        }
        return result;
    }

    public TryMoveRightPill():boolean
    {
        let result:boolean = true;
        let pill1 = this.playerControlPill.pill1;
        let pill2 = this.playerControlPill.pill2;

        if(pill1.posx > pill2.posx)
        {
            //pill1在右边
            let newPosx = pill1.posx+1;
            let newPosy = pill1.posy;
            result = newPosx < MatchData.battleGroundColumns && this.sceneData[newPosx][newPosy] == null;
            if(result)
            {
                this.MoveElement(pill2, pill1.posx, pill1.posy);
                this.MoveElement(pill1, newPosx, newPosy);
            }
        }
        else if(pill1.posx < pill2.posx)
        {
            //pill2在左边
            let newPosx = pill2.posx+1;
            let newPosy = pill2.posy;
            result = newPosx < MatchData.battleGroundColumns && this.sceneData[newPosx][newPosy] == null;
            if(result)
            {
                this.MoveElement(pill1, pill2.posx, pill2.posy);
                this.MoveElement(pill2, newPosx, newPosy);
            }
        }
        else
        {
            //药丸是竖着的
            let newPosx1 = pill1.posx+1;
            let newPosy1 = pill1.posy;
            let newPosx2 = pill2.posx+1;
            let newPosy2 = pill2.posy;
            result = newPosx1 < MatchData.battleGroundColumns && this.sceneData[newPosx1][newPosy1] == null
                && newPosx2 < MatchData.battleGroundColumns && this.sceneData[newPosx2][newPosy2] == null;
            if(result)
            {                
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }         
        }
        return result;
    }

    public TryRotatePill():boolean
    {
        return false;
    }

    //把Element移动到newPos，并把老位置制成null
    private MoveElement(element:GameElementBase, newPosx:number, newPosy:number)
    {
        let gameElementInColumn = this.sceneData[element.posx];
        gameElementInColumn[element.posy] = null;

        gameElementInColumn = this.sceneData[newPosx];
        gameElementInColumn[newPosy] = element;

        element.MoveTo(newPosx, newPosy);
    }
}