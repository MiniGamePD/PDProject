abstract class NpcElement extends GameplayElementBase
{
    public bornType:NpcBornType;
    protected bornSound:string;

    protected hp:number; //生命值
    protected shield:number; //护甲值
    protected hasReduceHpThisRound:boolean = false;

    public MoveTo(posx:number, posy:number){}

    public PlayAnim(animTYpe:NpcAnimType){}

    public PlaySound(soundType:NpcSoundType)
    {
        if(soundType == NpcSoundType.Born)
        {
            this.PlaySoundInternal(this.bornSound);
        }
    }

    private PlaySoundInternal(soundName:string)
    {
		let event = new PlaySoundEvent(soundName, 1);
        GameMain.GetInstance().DispatchEvent(event);
    }

    public SkillType():NpcSkillType
    {
        return NpcSkillType.None;
    }

    public OnEliminate():boolean
    {
        //一回合只受到一次伤害
        if(this.hasReduceHpThisRound)
        {
            return false;
        }

        this.hasReduceHpThisRound = true;
        if(this.shield > 0)
        {
            this.shield--;
            return true;
        }

        if(this.hp > 0)
        {
            this.hp--;
            return true;
        }

        return false;
    }

    public IsAlive():boolean
    {
        return this.shield > 0 || this.hp > 0;
    }

    public HasShield():boolean
    {
        return this.shield > 0;
    }

    public OnStartNewTurn()
    {
        this.hasReduceHpThisRound = false;
    }
}

enum NpcBornType
{
    Normal, //普通出生方式，寻找一个足够大的空位出生
    DestroyObstruction, //霸道的出生方式，销毁即将出生位置的所有东西后出生
}

enum NpcAnimType
{
    Born,
    Idel,
    UseSkill,
}

enum NpcSoundType
{
    Born,
}

enum NpcSkillType
{
    None,
    AddShieldForVirus,
    ChangePillToVirus,
    ChangeVirusColor
}