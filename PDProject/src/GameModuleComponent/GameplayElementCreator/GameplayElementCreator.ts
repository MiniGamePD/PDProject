abstract class GameplayElementCreator extends GameModuleComponentBase
{
    private gameplayElementFactory:GameplayElementFactory;
    protected paramDic:InternalCreatorBase[][];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super();
        this.gameplayElementFactory = gameplayElementFactory;
    }

    public Work(param:any):any
    {
        super.Work(param);

        let workParam:CreatorWorkParam = param;

        let paramIndex:number = workParam.paramIndex;
        let params = this.paramDic[paramIndex];

        let element:GameplayElementBase = null;
		let random = Math.random();
        for(var i = 0; i < params.length; ++i)
        {
            let internalCreator:InternalCreatorBase = params[i];
            if(internalCreator.ProbabilityMatch(random))
            {
                if(workParam.createNum == 1)
                {
                    return internalCreator.CreateElement(this.gameplayElementFactory);
                }
                else
                {
                    let result:GameplayElementBase[] = [];
                    for(var i = 0; i < workParam.createNum; ++i)
                    {
                        result.push(internalCreator.CreateElement(this.gameplayElementFactory));
                    }
                    return result;
                }
            }
        }

		console.error("Can't Create GameplayElement for " + workParam.paramIndex);
    }
}

class CreatorWorkParam
{
    public paramIndex:number;
    public createNum:number;
}

interface InternalCreatorBase
{
    ProbabilityMatch(randomNum:number):boolean;
    CreateElement(gameplayElementFactory:GameplayElementFactory):GameplayElementBase;
}

class InternalCreator<T extends GameplayElementBase> implements InternalCreatorBase
{
    private objConstructor:{new(): T; };
    public probabilityBegin:number;
    public probabilityEnd:number;
    public elementColor:GameElementColor;
    //add more..

    public constructor(probabilityBegin:number, probabilityEnd:number, elementColor:GameElementColor, c:{new(): T; })
    {
        this.probabilityBegin = probabilityBegin;
        this.probabilityEnd = probabilityEnd;
        this.elementColor = elementColor;
        this.objConstructor = c;
    }

    public ProbabilityMatch(randomNum:number):boolean
    {
        return (randomNum >= this.probabilityBegin && randomNum < this.probabilityEnd);
    }

    public CreateElement(gameplayElementFactory:GameplayElementFactory):GameplayElementBase
    {
        return gameplayElementFactory.CreateGameplayElement(this.objConstructor);
    }
}