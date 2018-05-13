abstract class NpcElement extends GameplayElementBase
{
    public bornType:NpcBornType;
    protected bornSound:string;

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
}

enum NpcBornType
{
    Normal, //普通出生方式，寻找一个足够大的空位出生
    Destroy, //霸道的出生方式，将同一列的其他元素全部销毁之后，落在scene的最底部
}

enum NpcAnimType
{
    Born,
    Idel,
}

enum NpcSoundType
{
    Born,
}