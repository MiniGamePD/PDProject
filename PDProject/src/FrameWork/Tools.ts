class Tools
{
	public static MatchViewBattleGroundStartXCenter: number = 0; //00号元素的中心点坐标x
	public static MatchViewBattleGroundStartYCenter: number = 0; //00号元素的中心点坐标y
	public static MatchViewElementHeight: number = 0;
	public static MatchViewElementWidth: number = 0;

	public static GetMatchViewRenderPosX(posx: number): number
    {
        return Tools.MatchViewBattleGroundStartXCenter + Tools.MatchViewElementWidth * posx;
    }

	public static GetMatchViewRenderPosY(posy: number): number
    {
        return Tools.MatchViewBattleGroundStartYCenter + Tools.MatchViewElementHeight * posy;
    }

	public static MoveScenePosX(posX: number, dir: Direction, step: number): number
	{
		var targetPosX = posX;
		switch (dir)
		{
			case Direction.Left:
				targetPosX -= step;
				break;
			case Direction.Right:
				targetPosX += step;
				break;
			default:
				break;
		}
		return targetPosX;
	}

	public static MoveScenePosY(posY: number, dir: Direction, step: number): number
	{
		var targetPosY = posY;
		switch (dir)
		{
			case Direction.Up:
				targetPosY -= step;
				break;
			case Direction.Down:
				targetPosY += step;
				break;
			default:
				break;
		}
		return targetPosY;
	}

	public static ZeroValue = 0.00001;
	public static IsZero(value: number)
	{
		return Math.abs(value) < Tools.ZeroValue;
	}

	public static MoveNumber(from: number, to: number, moveValue: number): number
	{
		if (Tools.IsZero(from - to))
		{
			return to;
		}
		else
		{
			var value = from;
			if (from < to)
			{
				value += moveValue;
			}
			else
			{
				value -= moveValue;
			}
			value = Tools.Clamp(value, from, to);
			return value
		}
	}

	public static Clamp(value: number, p1: number, p2: number): number
	{
		var result = value;
		if (p1 < p2)
		{
			result = value < p1 ? p1 : value;
			result = value > p2 ? p2 : value;
		}
		else if (p1 > p2)
		{
			result = value > p1 ? p1 : value;
			result = value < p2 ? p2 : value;
		}
		return result;
	}

	// 顺时针旋转
	public static RotateCW(center: number[], pos: number[]): number[]
	{
		if (center.length != 2 && pos.length != 2)
		{
			if (DEBUG)
			{
				console.assert(false, "Can not move element while elements not in scene!");
			}
		}
		var target: number[] = [];
		target.push(center[0] - (pos[1] - center[1]));
		target.push(center[1] + (pos[0] - center[0]));

		return target;
	}

	// 逆时针旋转
	public static RotateACW(center: number[], pos: number[]): number[]
	{
		if (center.length != 2 && pos.length != 2)
		{
			if (DEBUG)
			{
				console.assert(false, "Can not move element while elements not in scene!");
			}
		}
		var target: number[] = [];
		target.push(center[0] + (pos[1] - center[1]));
		target.push(center[1] - (pos[0] - center[0]));

		return target;
	}

	// 计算以某个点为中心，range为外围圈数的一个正方形的列表
	public static GetSquareRangePosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var x = -range; x <= range; ++x)
		{
			for (var y = -range; y<= range; ++y)
			{
				target.push(centerX + x, centerY + y);
			}
		}
		return target;
	}

	// 计算以某个点为中心，range为单边扩充数量的一列坐标
	public static GetColunmPosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var y = -range; y <= range; ++y)
		{
			target.push(centerX , centerY + y);
		}
		return target;
	}

	// 计算以某个点为中心，range为单边扩充数量的一行坐标
	public static GetRowPosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var x = -range; x <= range; ++x)
		{
			target.push(centerX + x , centerY);
		}
		return target;
	}

	// 计算以某个点为中心，range为单边扩充数量的一行和一列坐标
	public static GetCrossPosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var y = -range; y <= range; ++y)
		{
			target.push(centerX , centerY + y);
		}

		for (var x = -range; x <= range; ++x)
		{
			if (x != 0)
			{
				target.push(centerX + x, centerY);
			}
		}
		return target;
	}

	// 计算某两个左边的构成的区域的坐标点
	public static GetRegionPosList(startX: number, startY: number, endX: number, endY: number): number[]
	{
		var target: number[] = [];
		var minX = Math.min(startX, endX);
		var maxX = Math.max(startX, endX);
		var minY = Math.min(startY, endY);
		var maxY = Math.max(startY, endY);
		for (var x = minX; x <= maxX; ++x)
		{
			for (var y = minY; y <= maxY; ++y)
			{
				target.push(x, y);
			}
		}
		return target;
	}

	// 判断一个boss是否在列表内
	public static IsInSuperVirusList(superVirus: SuperVirus, list: SuperVirus[]): boolean
	{
		var result = false;
		if (list != null)
		{
			for (var i = 0; i < list.length; ++i)
			{
				if (list[i] == superVirus)
				{
					result = true;
					break;
				}
			}
		}
		return result;
	}

	// 判读一个元素是否在列表里面
	public static IsInList<T>(t: T, list: T[])
	{
		var result = false;
		if (list != null)
		{
			for (var i = 0; i < list.length; ++i)
			{
				if (list[i] == t)
				{
					result = true;
					break;
				}
			}
		}
		return result;		
	}

	// public static GetRotateAngle(fromX: number, fromY: number, toX: number, toY: number): number
	// {
	// 	Math.
	// }
}