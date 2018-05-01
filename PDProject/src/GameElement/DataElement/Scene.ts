//MVC中的M, 其他LogicElement通过消息通知Scene刷新数据
class Scene extends egret.EventDispatcher
{    
    public static readonly Columns:number = 8;
    public static readonly Rows:number = 16;  
    public sceneData:DisplayElementBase[][] = []; //左上角是00    

    public Init(): void
    {       
        for(var i = 0; i < Scene.Columns; ++i)
        {
            this.sceneData.push([]);
            for(var j = 0; j < Scene.Rows; ++j)
            {
                this.sceneData[i].push(null);
            }
        }

        GameMain.GetInstance().AddEventListener(PillControlEvent.EventName, this.PillControl, this);
        GameMain.GetInstance().AddEventListener(ChangeMatchStateEvent.EventName, this.OnChangeMatchEvent, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(PillControlEvent.EventName, this.PillControl, this);
    }

    private PillControl(event:PillControlEvent)
    {
        let operationSuccess:boolean = true;
        switch(event.pillControlType)
        {
            case PillControlType.Create:
            {
                operationSuccess = this.TryCreatePill(event.pill1, event.pill2);                
                break;
            }
            case PillControlType.MoveLeft:
            {
                operationSuccess = this.TryMoveLeftPill(event.pill1, event.pill2);
                break;
            }
            case PillControlType.MoveRight:
            {
                operationSuccess = this.TryMoveRightPill(event.pill1, event.pill2);
                break;
            }
            case PillControlType.DropDown:
            {
                operationSuccess = this.TryDropdownPill(event.pill1, event.pill2);
                break;
            }
            case PillControlType.Rotation:
            {
                operationSuccess = this.TryRotatePill(event.pill1, event.pill2);
                break;
            }
        }

        if(!operationSuccess)
        {
            let failedEvent = new PillControlFailedEvent();
            failedEvent.pillControlType = event.pillControlType;
            GameMain.GetInstance().DispatchEvent(failedEvent);
        }
    }

    private TryCreatePill(pill1:DisplayElementBase, pill2:DisplayElementBase):boolean
    {;
        //TODO：如果在sceneData中已经存在东西了，则GameOver
        this.sceneData[pill1.posx][pill1.posy] = pill1;
        this.sceneData[pill2.posx][pill2.posy] = pill2;
        return true;        
    }

    private TryDropdownPill(pill1:DisplayElementBase, pill2:DisplayElementBase):boolean
    {        
        let result:boolean = true;

        if(pill1.posy > pill2.posy)
        {
            //pill1在底部
            let newPosx = pill1.posx;
            let newPosy = pill1.posy+1;
            result = newPosy < Scene.Rows && this.sceneData[newPosx][newPosy] == null;
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
            result = newPosy < Scene.Rows && this.sceneData[newPosx][newPosy] == null;
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
            result = newPosy1 < Scene.Rows && this.sceneData[newPosx1][newPosy1] == null
                && newPosy2 < Scene.Rows && this.sceneData[newPosx2][newPosy2] == null;
            if(result)
            {                
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }        
        }
        return result;
    }

    private TryMoveLeftPill(pill1:DisplayElementBase, pill2:DisplayElementBase):boolean
    {
        let result:boolean = true;        

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

    private TryMoveRightPill(pill1:DisplayElementBase, pill2:DisplayElementBase):boolean
    {
        let result:boolean = true;

        if(pill1.posx > pill2.posx)
        {
            //pill1在右边
            let newPosx = pill1.posx+1;
            let newPosy = pill1.posy;
            result = newPosx < Scene.Columns && this.sceneData[newPosx][newPosy] == null;
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
            result = newPosx < Scene.Columns && this.sceneData[newPosx][newPosy] == null;
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
            result = newPosx1 < Scene.Columns && this.sceneData[newPosx1][newPosy1] == null
                && newPosx2 < Scene.Columns && this.sceneData[newPosx2][newPosy2] == null;
            if(result)
            {                
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }         
        }
        return result;
    }

    private TryRotatePill(pill1:DisplayElementBase, pill2:DisplayElementBase):boolean
    {
        return false;
    }

    //把Element移动到newPos，并把老位置制成null
    private MoveElement(element:DisplayElementBase, newPosx:number, newPosy:number)
    {
        let gameElementInColumn = this.sceneData[element.posx];
        gameElementInColumn[element.posy] = null;

        gameElementInColumn = this.sceneData[newPosx];
        gameElementInColumn[newPosy] = element;

        element.MoveTo(newPosx, newPosy);
    }

    private OnChangeMatchEvent(event:ChangeMatchStateEvent)
    {
        if(event.matchState == MatchState.Eliminate)
        {
            this.eliminating = true;                       
        }
    }

    private eliminating:boolean = false;
    public Update(deltaTime:number)
    {
        if(this.eliminating)
        {
            this.eliminating = false;
            let newEvent = new ChangeMatchStateEvent();
            newEvent.matchState = MatchState.PlayerControl;
            GameMain.GetInstance().DispatchEvent(newEvent); 
        }
    }
}