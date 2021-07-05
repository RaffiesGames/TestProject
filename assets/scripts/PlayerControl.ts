
import { _decorator, Component, Node, systemEvent, SystemEventType, EventKeyboard, Vec3, macro, SystemEvent, EventMouse, Prefab, instantiate, tween, Collider, ICollisionEvent, ITriggerEvent, clamp, AudioClip, AudioSource,  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerControl')
export class PlayerControl extends Component 
{
    @property
    HP: number = 3;

    //@property(AudioClip)
    //hitAudio: AudioClip = null!;
    

    private aSource: AudioSource = null!;
    private _startMove = false;
    private _moveTime = 0.1;
    private _curMoveTime = 0;
    private _curMoveSpeed = 0;
    private _moveStep = 0;
    private curPosition = new Vec3();
    private newPosition = new Vec3();
    private _deltaPos = new Vec3();
    private accLeft = false;
    private accRight = false;
    private collider:Collider = null!;
    public _curScore = 0;
    public active = false;

    start() 
    {
        this.collider = this.getComponent(Collider)!;
    }

    setInputActive(activeState:boolean)
    {
        this.active = activeState;
        if(this.active)
        {
            this.collider.on('onTriggerEnter', this.onCollisionEnter, this)!;
            systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)!;
            systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this)!;
        }
        else
        {
            this.collider.off('onTriggerEnter', this.onCollisionEnter, this)!;
            systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)!;
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this)!;
        }
    }

    onCollisionEnter(event : ITriggerEvent)
    {        
        if(event.otherCollider.name == "EProjectile<SphereCollider>")
        {
            //this.playHitAudio();
            this.HP -= 1;
            event.otherCollider.node.destroy();
        }
        else if(event.otherCollider.name == "Projectile<SphereCollider>")
        {
            event.otherCollider.node.destroy();
        }
    }

    onKeyDown(event : EventKeyboard)
    {
        switch(event.keyCode)
        {
            case macro.KEY.a:
                this.move(-2, true, false);
                break;
            case macro.KEY.d:
                this.move(2, false, true);
                break;
        }
    }

    onKeyUp(event : EventKeyboard)
    {
        this.accLeft = false;
        this.accRight = false;
    }

/*
    playHitAudio()
    {
        this.aSource = this.node.getComponent(AudioSource)!;
        this.aSource.clip = this.hitAudio;
        this.aSource.play();
    }
*/
    move(axis: number, left:boolean, right:boolean)
    {
        this.accLeft = left;
        this.accRight = right;
        this._startMove = true;
        this._moveStep = axis;
        this._curMoveSpeed = this._moveStep / this._moveTime;
        this._curMoveTime = 0;
        this.node.getPosition(this.curPosition);
        if(this.accLeft)
        {
            this.newPosition.z = clamp(this.newPosition.z, -35, 35);
            Vec3.add(this.newPosition, this.curPosition, new Vec3(0 ,0, this._moveStep)); 
        }
        else if(this.accRight)
        {
            this.newPosition.z = clamp(this.newPosition.z, -35, 35);
            Vec3.add(this.newPosition, this.curPosition, new Vec3(0 ,0, this._moveStep));
        }
    }

    

    update (deltaTime: number) 
    {
        if(this._startMove)
        {
            this._curMoveTime += deltaTime;
            if(this._curMoveTime > this._moveTime)
            {
                this.newPosition.z = clamp(this.newPosition.z, -35, 35);
                this.node.setPosition(this.newPosition);
                this._startMove = false;
            }
            else
            {
                this.curPosition.z = clamp(this.curPosition.z, -35, 35);
                this.node.setPosition(this.curPosition);
                this._deltaPos.z = this._curMoveSpeed * deltaTime;
                Vec3.add(this.curPosition, this.curPosition, this._deltaPos);
                this.curPosition.z = clamp(this.curPosition.z, -35, 35);
                this.node.setPosition(this.curPosition);
            }
        }
    }
}

