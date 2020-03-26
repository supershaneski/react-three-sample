import React from 'react';
import ThreeContainer from './threecontainer';
import ThreeObject from './threeobjects';
import Lib from '../lib/utils';

export default class SandBox extends React.Component {
    
    constructor() {
        super();
        this.threeContainer = React.createRef();
        this.mycontrol = null;
        this.state = {
            objects:[],
            color: 'white',
            type: 'cube',
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            selected: '',
            texture: 'none',
            toggleCamera: false,
        };
        
        this.updateControl = this.updateControl.bind(this);
        this.selectObject = this.selectObject.bind(this);

        this.addObject = this.addObject.bind(this);
        this.setObjectType = this.setObjectType.bind(this);
        this.setObjectColor = this.setObjectColor.bind(this);
        this.handleTexture = this.handleTexture.bind(this);

        this.handlePositionX = this.handlePositionX.bind(this);
        this.handlePositionY = this.handlePositionY.bind(this);
        this.handlePositionZ = this.handlePositionZ.bind(this);

        this.setSelectedTexture = this.setSelectedTexture.bind(this);
        this.setSelectedColor = this.setSelectedColor.bind(this);
        this.deleteSelected = this.deleteSelected.bind(this);

    }
    
    updateControl(callback) {
        this.mycontrol = callback; //e.g. this.mycontrol.funcName(arg);
    }

    addObject() {
        const id = Lib.getSimpleId();
        const index = this.state.objects.length;
        
        const newchild = <ThreeObject
            key={index}
            id={id}
            type={this.state.type}
            position={{
                x: this.state.position.x,
                y: this.state.position.y,
                z: this.state.position.z,
            }}
            color={this.state.color}
            texture={this.state.texture}
            />;

        const children = this.state.objects.splice(0);
        children.push(newchild);

        this.setState({
            objects: children,
        })
    }

    setObjectColor(event) {
        this.setState({
            color: event.target.value
        })
    }

    setObjectType(event) {
        this.setState({
            type: event.target.value
        })
    }

    handleTexture(event) {
        this.setState({
            texture: event.target.value
        })
    }

    handlePositionX(event) {
        const pos = this.state.position;
        pos.x = event.target.value;
        this.setState({
            position: pos,
        });
    }

    handlePositionY(event) {
        const pos = this.state.position;
        pos.y = event.target.value;
        this.setState({
            position: pos,
        });
    }
    
    handlePositionZ(event) {
        const pos = this.state.position;
        pos.z = event.target.value;
        this.setState({
            position: pos,
        });
    }

    selectObject(name) {
        this.setState({
            selected: name
        })
    }

    deleteSelected() {
        var objects = this.state.objects.splice(0);
        objects = objects.filter(object => {
            return object.props.id.indexOf(this.state.selected) < 0;
        });
        this.mycontrol.delete(this.state.selected);
        this.setState({
            selected: '',
            objects: objects,
        });
    }

    setSelectedColor() {
        
        const objects = this.state.objects.splice(0);
        objects.some((object) => {
            if(object.props.id.indexOf(this.state.selected) >= 0){
                //object.props.color = this.state.color;
                return true;
            }
        });
        
        this.mycontrol.setColor(this.state.selected, this.state.color);
        
    }

    setSelectedTexture() {
        this.mycontrol.setTexture(this.state.selected, this.state.texture);
    }
    
    render() {
        
        const colors = [
            'white', 
            'gold', 
            'aqua', 
            'crimson',
            'chartreuse',
        ];
        
        const objectTypes = [
            'cube', 
            'cylinder', 
            'sphere'
        ];
        
        const textures = [
            'none',
            'apple.jpg',
            'flower.jpg'
        ];
        
        return (
            <>
            <section className="three-contents">
                <ThreeContainer 
                ref={el => this.threeContainer = el}
                control={callback => this.updateControl(callback)}
                options={{
                    backgroundColor: 0xfefefe,
                    grid: true,
                    origin: true,
                }}
                forceUpdate={false}
                onClick={elname => this.selectObject(elname)}
                >
                {
                    this.state.objects
                }
                </ThreeContainer>
            </section>
            <section>

            <button onClick={this.addObject}>Add Object</button>
            &nbsp;
            <label><span>Type:</span>
            &nbsp;
            <select
            onChange={this.setObjectType}
            value={this.state.type}
            >
            {
                objectTypes.map((stype, index) => {
                    return (
                        <option key={ index }>{ stype }</option>
                    )
                })
            }
            </select>
            </label>
            &nbsp;
            <label><span>Color:</span>
            &nbsp;
            <select 
            onChange={this.setObjectColor}
            value={this.state.color}
            >
            {
                colors.map((color, index) => {
                    return (
                        <option key={ index }>{ color }</option>
                    )
                })
            }
            </select>
            </label>
            &nbsp;
            <label><span>Texture:</span>
            &nbsp;
            <select
            onChange={this.handleTexture}
            value={this.state.texture}
            >
            {
                textures.map((texture, index) => {
                    return (
                        <option key={ index }>{ texture }</option>
                    )
                })
            }
            </select>
            </label>
            &nbsp;
            <label><span>X:</span>
            &nbsp;
            <input 
                type="number"
                min={-50}
                max={50}
                maxLength={3}
                increment={1}
                value={this.state.position.x}
                onChange={this.handlePositionX}
            />
            </label>
            &nbsp;
            <label><span>Y:</span>
            &nbsp;
            <input 
                type="number"
                min={0}
                max={50}
                maxLength={3}
                increment={1}
                value={this.state.position.y}
                onChange={this.handlePositionY}
            />
            </label>
            &nbsp;
            <label><span>Z:</span>
            &nbsp;
            <input 
                type="number"
                min={-50}
                max={50}
                maxLength={3}
                increment={1}
                value={this.state.position.z}
                onChange={this.handlePositionZ}
            />
            </label>
            </section>
            <section>
            {
                this.state.selected && 
                <React.Fragment>
                    <button 
                        className="selected"
                        onClick={this.setSelectedTexture}
                    >Set Texture</button>
                    <button 
                        className="selected"
                        onClick={this.setSelectedColor}
                    >Set Color</button>
                    <button 
                        className="selected"
                        onClick={this.deleteSelected}
                    >Delete Selected</button>
                </React.Fragment>                
            }        
            </section>
            <style jsx>
            {`
            section {
                margin: 10px;
            }
            section.three-contents {
                position: relative;
                height: 300px;
            }
            button, select {
                height: 25px;
                line-height: 100%;
                font-size: 0.7em;
                color: #222;
            }
            input[type="number"] {
                width: 40px;
                height: 20px;
                padding: 0px;
            }
            span {
                font-size: 0.7em;
            }
            button.selected {
                border: 1px solid crimson;
                background-color: crimson;
                padding: 0px 10px !important;
                border-radius: 4px;
                color: #000;
                outline: none;
                margin-left: 5px;
            }
            button.selected:hover {
                border: 1px solid #666;
            }
            button.selected:active {
                background-color: #eb2d53;
                color: #fff;
            }
            `}
            </style>
            </>
        )
    }
}