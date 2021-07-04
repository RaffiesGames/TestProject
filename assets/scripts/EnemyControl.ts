
import { _decorator, Component, Node, Prefab, director, Collider, CollisionEventType, ICollisionEvent, instantiate, tween, Vec3, random, randomRangeInt, ITriggerEvent } from 'cc';
import { PlayerControl } from './PlayerControl';

const { ccclass, property } = _decorator;

@ccclass('EnemyControl')
export class EnemyControl extends Component {
    
    @property
    hitCount: number = 1;

    @property
    reloadTime: number = 2;

    @property(PlayerControl)
    playControl: PlayerControl = null!;

    @property(Prefab)
    projectile: Prefab = null!;

    private _startMove = false;
    private _moveStep = 0;
    private curPosition = new Vec3();
    private newPosition = new Vec3();
    private _deltaPos = new Vec3();
    private _curMoveTime = 0;
    private _curMoveSpeed = 0;
    private _moveTime = 0.1;
    private shootTime:number = 0;
    private prevShootTime:number = 0;
    private curTime:number = 0;
    private startMoveTime:number = 0;
    private newMoveTime:number = 0.1;
    private newProjectile:Node = null!;
    private collider:Collider = null!;
    

    start ()
    {
        this.collider = this.getComponent(Collider)!;
        this.collider.on('onTriggerEnter', this.onCollisionEnter, this);

    }

    onCollisionEnter(event : ITriggerEvent)
    {
        if(event.otherCollider.name == "Projectile<SphereCollider>")
        {   
            this.hitCount -= 1;
            event.otherCollider.node.destroy();
        }
        if(event.otherCollider.name == "EProjectile<SphereCollider>")
        {
            event.otherCollider.node.destroy();
        }
        
        if(this.hitCount == 0)
        {
            event.selfCollider.destroy();
            if(event.selfCollider.name == "Enemy<BoxCollider>")
            {
                this.playControl._curScore+=1;
            }
            else if(event.selfCollider.name == "Enemy2<BoxCollider>")
            {
                this.playControl._curScore+=2;
            }
            else if(event.selfCollider.name == "Enemy3<BoxCollider>")
            {
                this.playControl._curScore+=3;
            }
            this.node.destroy();
        }
    }

    shoot()
    {
        this.shootTime = this.curTime;
        if(this.shootTime - this.prevShootTime >= this.reloadTime)
        {            
            this.prevShootTime = this.curTime;
            this.newProjectile = instantiate(this.projectile);
            this.newProjectile.setPosition(0,0,-1.5);
            this.node.addChild(this.newProjectile);
            tween(this.newProjectile).to(0.5, { position: new Vec3(0, 0, -15)}).start();
        }
    }

    move()
    {
        var newX = this.node.position.x;
        var newY = this.node.position.y;
        var newZ = this.node.position.z;

        newZ += 1;
        
        if(this.node.position.z >= 35)
        {
            newX -= 3;
            newZ = -35;
        }
        if(newX <= -12)
        {
            this.playControl.HP = 0;
        }
        this.node.setPosition(newX, newY, newZ);
    }

    update (deltaTime: number) 
    {
        if(this.playControl.active)
        {
            this.curTime += deltaTime;
            if(this.node.isValid)
            {
                if(this.curTime - this.startMoveTime >= this.newMoveTime)
                {
                    this.startMoveTime = this.curTime;
                    this.move();
                }
                this.shoot();      
                
            }
        }
    }
}