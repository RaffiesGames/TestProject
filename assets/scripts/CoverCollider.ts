
import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
import { PlayerControl } from './PlayerControl';
const { ccclass, property } = _decorator;

@ccclass('CoverCollider')
export class CoverCollider extends Component 
{

    private hitCount = 5;
    
    @property(PlayerControl)
    playControl: PlayerControl = null!;

    start () 
    {
        let collider = this.getComponent(Collider);
        collider?.on('onTriggerEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter(event : ITriggerEvent)
    {
        if(event.otherCollider.name == "EProjectile<SphereCollider>")
        {    
            this.hitCount -= 1;
            event.otherCollider.node.destroy();
        }
        if(event.otherCollider.name == "Projectile<SphereCollider>")
        {
            event.otherCollider.node.destroy();
        }
        if( event.otherCollider.name == "Enemy<BoxCollider>"|| 
            event.otherCollider.name == "Enemy2<BoxCollider>"||
            event.otherCollider.name == "Enemy3<BoxCollider>")
        {
            this.playControl.HP = 0;
        }
        if(this.hitCount == 0)
        {
            event.selfCollider.destroy();
            this.node.destroy();
        }
    }

}

