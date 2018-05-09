interface IResModule extends IModule
{
	/**
	 * 开始加载资源
	 */
	StartLoadResource(): void;

	/**
	 * 获取资源
	 */
	GetRes(key: string): any;

	/**
     * 根据name关键字创建一个Bitmap对象。
     */
	CreateBitmapByName(key: string): egret.Bitmap;
}