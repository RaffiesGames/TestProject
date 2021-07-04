
import { _decorator, Component, Node, systemEvent, SystemEvent, EventMouse, instantiate, tween, Prefab, Tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fire')
export class Fire extends Component {
    
    @property(Prefab)
    projectile: Prefab = null!;

    private posX:number = 0;
    private posY:number = 0;
    private posZ:number = 0;
    private shootTime:number = 0;
    private reloadTime:number = 1;
    private prevShootTime:number = 0;
    private curTime:number = 0;
    private newProjectile:Node = null!;

    start () 
    {
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onMouseDown(event: EventMouse)
    {
        this.shootTime = this.curTime;
        if(event.getButton() == 0 && this.shootTime - this.prevShootTime >= this.reloadTime)
        {  
            this.prevShootTime = this.curTime;
            this.shoot();
        }
    }

    shoot()
    {
        this.newProjectile = instantiate(this.projectile);
        this.newProjectile.setPosition(0,0,-1.5);
        this.node.addChild(this.newProjectile);
        tween(this.newProjectile).to(0.5, { position: new Vec3(0, 0, -15)}).start();        
    }

    update (deltaTime: number) 
    {
        this.curTime += deltaTime;
    }
}
