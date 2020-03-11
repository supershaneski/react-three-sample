import React from 'react';
import ThreeLoader from './threeloader';

export default class ThreeContainer extends React.Component {
    
    constructor(props) {
        super(props)
        this.container = React.createRef()
        this.control = null;
    }
    
    componentDidMount() {

        const forceUpdate = this.props.forceUpdate;
        
        this.control = ThreeLoader(this.container, this.props.options, forceUpdate);
        
        const that = this;
        this.container.addEventListener("ObjectClick",function(event){
            if(that.props.onClick) that.props.onClick(event.detail.name);
        });
        
        if(this.props.control) {
            this.props.control({
                delete: (...param) => this.delete(...param),
                setColor: (...param) => this.setColor(...param),
                setTexture: (...param) => this.setTexture(...param),
            })
        }
        
        if(forceUpdate) {
            this.control.updateScene(this.props.children);
        } else {
            const children = this.props.children;
            if(Array.isArray(children)) {
                children.forEach(child => this.control.addObject(child.props));
            } else {
                if(children) this.control.addObject(children.props);
            }
        }
        
    }
    
    delete(name) {
        this.control.deleteObject(name);
    }
    
    setColor(name, color) {
        this.control.setObjectColor(name, color);
    }

    setTexture(name, texture) {
        this.control.setObjectTexture(name, texture);
    }
    
    componentDidUpdate() {
        
        const forceUpdate = this.props.forceUpdate;
        if(forceUpdate) {
            this.control.updateScene(this.props.children);
        } else {
            const children = this.props.children;
            if(Array.isArray(children)) {
                children.forEach(child => this.control.addObject(child.props));
            } else {
                if(children) this.control.addObject(children.props);
            }
        }
        
    }

    render() {
        return (
            <>
            <div ref={el => this.container = el} style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
            }}>
            {
                this.props.children
            }
            </div>
            </>
        )
    }

}

ThreeContainer.defaultProps = {
    forceUpdate: true
}