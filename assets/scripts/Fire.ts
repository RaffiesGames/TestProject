
import { _decorator, Component, Node, systemEvent, SystemEvent, EventMouse, instantiate, tween, Prefab, Tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fire')
export class Fire extends Component {
    
    @property(Prefab)
    projectile: Prefab = null;

    private posX:number = 0;
    private posY:number = 0;
    private posZ:number = 0;
    private shootTime:number = 0;
    private reloadTime:number = 1;
    private prevShootTime:number = 0;
    private curTime:number = 0;
    private newProjectile;

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
        //newProjectile.setPosition(this.node.position.x, this.node.position.y, this.node.position.z-1);
        this.newProjectile.setPosition(0,0,-1);
        this.node.addChild(this.newProjectile);
        tween(this.newProjectile).to(0.5, { position: new Vec3(0, 0, 0-10)}).start();
        //this.node.removeChild(newProjectile);
        
    }

    update (deltaTime: number) 
    {
        this.curTime += deltaTime;
        
        if(this.newProjectile)
        {
            if(this.newProjectile.position.z == -10)
            {
                this.newProjectile.destroy();        
            }
        }
    }
}
