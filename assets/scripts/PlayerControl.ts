
import { _decorator, Component, Node, systemEvent, SystemEventType, EventKeyboard, Vec3, macro, SystemEvent, EventMouse, Prefab, instantiate, tween, Collider, ICollisionEvent,  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerControl')
export class PlayerControl extends Component 
{
    @property
    HP: number = 5;
    
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

    start() 
    {
        let collider = this.getComponent(Collider);
        collider?.on('onCollisionEnter', this.onCollisionEnter, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onCollisionEnter(event : ICollisionEvent)
    {        
        this.HP -= 1;
        if(this.HP == 0)
        {
            event.selfCollider.destroy();
            this.node.destroy();
        }
        event.otherCollider.node.destroy();
    }

    onKeyDown(event : EventKeyboard)
    {
        switch(event.keyCode)
        {
            case macro.KEY.a:
                this.accLeft = true;
                this.move(-2);
                break;
            case macro.KEY.d:
                this.accRight = true;
                this.move(2);
                break;
        }
    }

    onKeyUp(event : EventKeyboard)
    {
        this.accLeft = false;
        this.accRight = false;
    }

    move(axis: number)
    {
        this._startMove = true;
        this._moveStep = axis;
        this._curMoveSpeed = this._moveStep / this._moveTime;
        this._curMoveTime = 0;
        this.node.getPosition(this.curPosition);
        if(this.accLeft)
        {
            Vec3.add(this.newPosition, this.curPosition, new Vec3(0 ,0, this._moveStep)); 
        }
        else if(this.accRight)
        {
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
                this.node.setPosition(this.newPosition);
                this._startMove = false;
            }
            else
            {
                this.node.setPosition(this.curPosition);
                this._deltaPos.z = this._curMoveSpeed * deltaTime;
                Vec3.add(this.curPosition, this.curPosition, this._deltaPos);
                this.node.setPosition(this.curPosition);
            }
        }
    }
}

