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
            return false;
        }

        if(this.hp > 0)
        {
            this.hp--;
            this.isAlive = this.hp > 0;

            if(DEBUG)
            {
                if(!this.isAlive)
                {
                    console.log(typeof(this) + " has dead");
                }
            }

            return !this.isAlive;
        }

        console.error("An Error Npc, no shield no hp, but alive");
        return false;
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