import React from 'react';
import ThreeContainer from './threecontainer';
import ThreeObject from './threeobjects';

export default class SandBox1 extends React.Component {
    
    constructor() {

        super();
        
        this.timer = null;
        this.delta = 0;

        this.colors = [
            'crimson', 
            'chartreuse', 
            'royalblue', 
            'aqua', 
            'gold', 
            'blueviolet'
        ]
        
        this.state = {
            objects: [],
        }

        this.updateObjects = this.updateObjects.bind(this);
    }

    componentDidMount() {

        // initialize objects

        var objects = [];
        var n = -1;
        for (var i = 0; i < 6; i++) {
            const k = i % 2;
            n = (k === 0)?n+1:n;
            objects.push({
                id: "abc000" + i,
                type: "cube",
                position: {
                    x: -8 + 16 * k,
                    y: 0,
                    z: -8 + 16 * n
                },
                color: this.colors[i % this.colors.length]
            });
        }

        this.setState({
            objects: objects,
        })

    }
    
    updateObjects() {
        
        // update objects

        clearInterval(this.timer);

        this.delta = 0;
        const that = this;

        this.timer = setInterval(() => {
            that.delta++;

            var objects = that.state.objects.slice(0);
            const selected = (that.delta - 1) % objects.length;
            const flag = (that.delta > 30)?true:false;

            objects = objects.map((object, index) => {
                
                // change color
                object.color = that.colors[(that.delta + index)%that.colors.length];
                
                // update posy of selected
                object.position.y = (!flag && selected === index)?10:0;
                
                return object;
            })

            that.setState({
                objects: objects
            })
            
            if(flag) clearInterval(that.timer);

        }, 200)
    }

    render() {
        return (
            <>
            <section className="player">
                <ThreeContainer
                options={{
                    grid: true,
                }}
                >
                {
                this.state.objects.map((item, index) => {
                    return (
                        <ThreeObject
                        key={index}
                        id={item.id}
                        type={item.type}
                        position={{
                            x: item.position.x,
                            y: item.position.y,
                            z: item.position.z
                        }}
                        color={item.color}
                         />
                    )
                })
                }
                </ThreeContainer>
            </section>
            <section className="control">
                <button onClick={this.updateObjects}>Animate Objects</button>
            </section>
            <style jsx>
            {`
            section.player {
                position: relative;
                background-color: white;
                height: 400px;
            }
            section.control {
                padding: 10px;
            }
            `}
            </style>
            </>
        )
    }
}