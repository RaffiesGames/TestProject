
import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoverCollider')
export class CoverCollider extends Component 
{

    private hitCount = 3;
    
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
        else if(event.otherCollider.name == "Projectile<SphereCollider>")
        {
            event.otherCollider.node.destroy();
        }
        if(this.hitCount == 0)
        {
            event.selfCollider.destroy();
            this.node.destroy();
        }
    }

}

