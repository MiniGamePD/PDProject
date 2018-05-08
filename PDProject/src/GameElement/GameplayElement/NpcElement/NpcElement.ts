abstract class NpcElement extends GameplayElementBase
{
    public bornType:NpcBornType;

    public MoveTo(posx:number, posy:number){}
}

enum NpcBornType
{
    Normal, //普通出生方式，寻找一个足够大的空位出生
    Destroy, //霸道的出生方式，将同一列的其他元素全部销毁之后，落在scene的最底部
}