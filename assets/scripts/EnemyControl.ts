
import { _decorator, Component, Node, Prefab, director, Collider, CollisionEventType, ICollisionEvent, instantiate, tween, Vec3, random, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyControl')
export class EnemyControl extends Component {
    
    @property
    hitCount: number = 1;
    @property
    maxRandom: number = 2;

    @property(Prefab)
    projectile: Prefab = null;

    private _startMove = false;
    private _moveStep = 0;
    private curPosition = new Vec3();
    private newPosition = new Vec3();
    private _deltaPos = new Vec3();
    private _curMoveTime = 0;
    private _curMoveSpeed = 0;
    private _moveTime = 0.1;
    private shootTime:number = 0;
    private reloadTime:number = 2;
    private prevShootTime:number = 0;
    private curTime:number = 0;
    private startMoveTime:number = 0;
    private newMoveTime:number = 1;
    private newProjectile;

    start ()
    {
        let collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter(event : ICollisionEvent)
    {
        if(event.otherCollider.name == "Projectile")
        {    
            this.hitCount -= 1;
            event.otherCollider.node.destroy();
        }
        if(this.hitCount == 0)
        {
            event.selfCollider.destroy();
            this.node.destroy();
        }
    }

    shoot()
    {
        this.shootTime = this.curTime;
        if(this.shootTime - this.prevShootTime >= this.reloadTime)
        {
            if(randomRangeInt(-2,this.maxRandom))
            {
                this.prevShootTime = this.curTime;
                this.newProjectile = instantiate(this.projectile);
                this.newProjectile.setPosition(0,0,-1.5);
                this.node.addChild(this.newProjectile);
                tween(this.newProjectile).to(0.5, { position: new Vec3(0, 0, -15)}).start();
            }
        }
    }

    move()
    {
        var axis = randomRangeInt(-1,1);
        if(axis)
        {
            axis = -7;
        }
        else
        {
            axis = 7;
        }
        this._startMove = true;
        this._moveStep = axis;
        this._curMoveSpeed = this._moveStep / this._moveTime;
        this._curMoveTime = 0;
        this.node.getPosition(this.curPosition);
        if(this.newPosition.z <= 40 && this.newPosition.z >= -40)
        { 
            Vec3.add(this.newPosition, this.curPosition, new Vec3(0 ,0, this._moveStep)); 
        }
        else
        {
            if(this.newPosition.z < 0)
            {
                this.newPosition.z += 7;
            }
            else
            {
                this.newPosition.z -= 7;
            }
            this.newPosition.x -= 2;
            this.curPosition.x -=2;
            console.log("ERROR 3" + this.node.name);
        }
    }

    update (deltaTime: number) 
    {
        this.curTime += deltaTime;
        if(this._startMove)
        {
            this._curMoveTime += deltaTime;
            if(this._curMoveTime > this._moveTime)
            {
                if(this.newPosition.z <= 40 && this.newPosition.z >= -40)
                { 
                    this.node.setPosition(this.newPosition);
                    this._startMove = false;
                }
                else
                {
                    if(this.newPosition.z < 0)
                    {
                        this.newPosition.z += 7;
                    }
                    else
                    {
                        this.newPosition.z -= 7;
                    }
                    this.newPosition.x -= 2;
                    this.curPosition.x -=2;
                    console.log("ERROR 1 " + this.node.name);
                }
            }
            else
            {
                this.node.setPosition(this.curPosition);
                this._deltaPos.z = this._curMoveSpeed * deltaTime;
                Vec3.add(this.curPosition, this.curPosition, this._deltaPos);
                if(this.curPosition.z <= 40 && this.curPosition.z >= -40)
                {
                    this.node.setPosition(this.curPosition);
                }
                else
                {
                    if(this.curPosition.z < 0)
                    {
                        this.curPosition.z += 7;
                    }
                    else
                    {
                        this.curPosition.z -= 7;
                    }
                    this.newPosition.x -= 2;
                    this.curPosition.x -=2;
                    console.log("ERROR 2" + this.node.name);
                }
            }
        }
        if(this.node.isValid)
        {
            if(this.curTime - this.startMoveTime >= this.newMoveTime || this.curTime <= 0)
            {
                this.startMoveTime = this.curTime;
                this.move();
            }
            this.shoot();
        }
    }
}
