import * as THREE from 'three';
import { DragControls } from '../lib/DragControls';
import { TrackballControls } from '../lib/TrackballControls';

export default (containerElement, options, flagUpdate = false) => {
    
    const flagGrid = (options && options.hasOwnProperty("grid"))?options.grid:false;
    const flagOrigin = (options && options.hasOwnProperty("origin"))?options.origin:false;
    const _backgroundColor = (options && options.hasOwnProperty('backgroundColor'))?options.backgroundColor:0xfefefe;

    const { offsetWidth, offsetHeight } = containerElement;
    let objects = [];
    let _objects = [];
    let box = null;

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( _backgroundColor );
    
    // camera
    var camwidth = offsetWidth;
    var camheight = offsetHeight;
    var camfov = 60;
    
    const camera = new THREE.PerspectiveCamera( camfov, camwidth / camheight, 0.1, 10000 );
    camera.position.set(30, 50, 30);
    camera.lookAt(scene.position);
    camera.name = "Camera";
    scene.add( camera );
    
    // lights
    var light1	= new THREE.AmbientLight( 0x202020 );
    scene.add( light1 );
    var light2	= new THREE.DirectionalLight('white', 0.8);
    light2.position.set(0.5, 0.0, 2);
    scene.add( light2 );
    var light3	= new THREE.DirectionalLight('white', 0.8);
    light3.position.set(-0.5, -0.5, -2);
    scene.add( light3 );
    var light4	= new THREE.DirectionalLight('white', 0.4);
    light4.position.set(0.0, 1.0, 0.0);
    light4.rotation.x = Math.PI/2;
    scene.add( light4 );
    
    // grid
    if(flagGrid) {
        var grid = new THREE.GridHelper( 100, 20 );
        grid.material.opacity = 0.5;
        grid.material.transparent = true;
        grid.name = "Grid";
        scene.add( grid );
    }
    
    // arrow
    if(flagOrigin) {
        var arrowX = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0).normalize(),
            new THREE.Vector3(0, 0, 0),
            10,
            0x00ff00);
        scene.add(arrowX);        
        var arrowY = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0).normalize(),
            new THREE.Vector3(0, 0, 0),
            10,
            0xff0000);
        scene.add(arrowY);    
        var arrowZ = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1).normalize(),
            new THREE.Vector3(0, 0, 0),
            10,
            0x0000ff);
        scene.add(arrowZ);
    }
    
    // canvas
    const canvas = createCanvas(document, containerElement);
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    
    // renderer
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    }); 
    
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(offsetWidth, offsetHeight);
    
    // trackball
    const controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0;
    
    // drag
    var dragControls = undefined;
    if(!flagUpdate) {
        dragControls = new DragControls(_objects, camera, renderer.domElement);
        dragControls.snapGrid = true;
    
        dragControls.addEventListener( 'dragstart', function ( event ) {
            controls.enabled = false;

            const obj = event.object;
            
            if(box) scene.remove(box);

            box = new THREE.BoxHelper( obj );
            box.material.color.set( 0xffff00 );
            if(box.target === "undefined") {
                box.target = obj.name;
            } else {
                box.target = obj.name;
            }
            box.name = "BoundingBox";
            scene.add( box );

            var event = new CustomEvent(
                "ObjectClick", 
                {
                    detail: {
                        name: obj.name,
                    },
                    bubbles: true,
                    cancelable: true
                }
            );
        containerElement.dispatchEvent(event);
        });
        dragControls.addEventListener( 'drag', function ( event ) {
            box.update()
        });
        dragControls.addEventListener( 'dragend', function ( event ) {
            controls.enabled = true;
        });
    }
    
    window.addEventListener('resize', () => {
        
        const width = containerElement.offsetWidth;
        const height = containerElement.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize( width, height );
        
    }, false);

    function createCanvas(document, container) {
        const _canvas = document.createElement('canvas');
        _canvas.id = "canvas1";
        container.appendChild(_canvas);
        return _canvas;
    }

    function render() {
        requestAnimationFrame(render);

        _objects.map(item => {
            if(item.flag) {
                item.rotation.y += 0.01;
            }
        })

        controls.update();

        renderer.render(scene, camera);
        
    }

    render();
    
    function addObject(param) {
        
        const _obj = objects.find(obj => {
            return obj.id === param.id
        });

        if(typeof _obj === "undefined") {
            if(param.type.indexOf("sphere") >= 0) {
                addSphere(param);
            } else if(param.type.indexOf("cube") >= 0) {
                addCube(param);
            } else {
                addCylinder(param);
            }
        }        
    }
    
    function updateScene(children) {
        
        const newlist = children.map(child => {
            const found = objects.some(obj => obj.id.indexOf(child.props.id)>=0);
            return {
                id: child.props.id,
                flag: found,
                props: child.props
            }
        })

        newlist.forEach((child) => {
            if(child.flag) {
                updateObject(child.props)
            } else {
                addObject(child.props)
            }
        })

    }

    function addCube({ 
        id, 
        position = {x: 0, y: 5, x:0 },
        color = 0xe6e6e6,
        texture = undefined,
    }) {
        
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshPhongMaterial({ color: color }); //0xFFFF00
        if(texture && texture !== "none") {
            var loader = new THREE.TextureLoader();
            material.map = loader.load(texture);
        }

        var cube = new THREE.Mesh(geometry, material);
        cube.name = id;
        cube.flag = false;

        const x = parseInt(position.x);
        const y = parseInt(position.y) + 5;
        const z = parseInt(position.z);
        
        cube.position.set(x, y, z);
        objects.push({
            id: id,
            type: 'cube'
        });
        _objects.push(cube);
        scene.add( cube );
    }

    function addCylinder({ 
        id, 
        position = {x: 0, y: 6, x:0 },
        color = 0xe6e6e6,
        texture = undefined,
    }) {
        
        var geometry = new THREE.CylinderGeometry( 5, 5, 10, 12 );
        var material = new THREE.MeshPhongMaterial({ 
            color: color,
            flatShading: true
        });
        if(texture && texture !== "none") {
            var loader = new THREE.TextureLoader();
            material.map = loader.load(texture);
        }

        var cube = new THREE.Mesh(geometry, material);
        cube.name = id;
        cube.flag = false;

        const x = parseInt(position.x);
        const y = parseInt(position.y) + 5;
        const z = parseInt(position.z);

        cube.position.set(x, y, z);

        objects.push({
            id: id,
            type: 'cube'
        });
        _objects.push(cube);

        scene.add( cube );
    }

    function addSphere({ 
        id, 
        position = {x: 0, y: 6, x:0 },
        color = 0xe6e6e6,
        texture = undefined,
    }) {
        
        const geometry = new THREE.SphereGeometry( 5, 12, 12 );
        var material = new THREE.MeshPhongMaterial({ 
            color: color,
            flatShading: true
        });

        if(texture && texture !== "none") {
            var loader = new THREE.TextureLoader();
            material.map = loader.load(texture);
        }

        var cube = new THREE.Mesh(geometry, material);
        cube.name = id;
        cube.flag = false;

        const x = parseInt(position.x);
        const y = parseInt(position.y) + 5;
        const z = parseInt(position.z);

        cube.position.set(x, y, z);
        objects.push({
            id: id,
            type: 'sphere'
        });
        _objects.push(cube);
        scene.add( cube );
    }

    function updateObject({
        id, 
        position = {x: 0, y: 6, x:0 },
        color = undefined,
        texture = undefined,
    }) {

        const obj = scene.getObjectByName(id);
        const curpos = obj.position;
        
        if(flagUpdate) {
            if(position) {
                const x = (position.hasOwnProperty("x"))?position.x:curpos.x;
                const y = (position.hasOwnProperty("y"))?position.y + 5:curpos.y;
                const z = (position.hasOwnProperty("z"))?position.z:curpos.z;
                obj.position.set(x, y, z);
                
                if(box && box.target.indexOf(id) >= 0) {
                    box.position.set(x,y,z);
                }
            }
        }        

        if(color) obj.material.color.set(color);

        if(texture) {
            if(texture === "none") {
                obj.material.map = null;
            } else {
                var loader = new THREE.TextureLoader();
                obj.material.map = loader.load(texture);
            }
            obj.material.needsUpdate = true;
        }
        
    }

    function deleteObject(name) {
        const obj = scene.getObjectByName(name);

        objects = objects.filter(item => {
            return item.id.indexOf(name) < 0;
        });
        
        _objects = _objects.filter(item => {
            return item.name.indexOf(name) < 0;
        });
        if(!flagUpdate) dragControls.setObjects(_objects);
        
        scene.remove(obj);
        scene.remove(box);
    }

    function setObjectColor(name, color) {
        const obj = scene.getObjectByName(name);
        obj.material.color.set(color); 
    }

    function setObjectTexture(name, texture) {
        const obj = scene.getObjectByName(name);
        if(texture === "none") {
            obj.material.map = null;
        } else {
            var loader = new THREE.TextureLoader();
            obj.material.map = loader.load(texture);
        }
        obj.material.needsUpdate = true;
    }
    
    return {
        addObject,
        updateObject,
        deleteObject,
        setObjectColor,
        setObjectTexture,
        updateScene,
    }
}