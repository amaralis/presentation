export default function disposeOfObjects(objPropType, arr, scene, renderer){    
    let children = [];
    if(objPropType === "name"){
        arr.forEach(name => {
            const obj = scene.getObjectByName(name);
            obj.traverse(child=> {
                children.push(child);
            });
        });
        
        // Traverse the children array backwards, to delete children first (just for caution)
        for(let i = children.length - 1; i >= 0; i--){
            children[i].parent.remove(children[i]);
            children[i].geometry.dispose();
            if(children[i].material.map){
                children[i].material.map.dispose();
            }
            if(children[i].material.normalMap){
                children[i].material.normalMap.dispose();
            }
            if(children[i].material.displacementMap){
                children[i].material.displacementMap.dispose();
            }
            children[i].material.dispose();
        }

        renderer.renderLists.dispose();
        
        return;

    } else if(objPropType === "id"){
        arr.forEach(id => {
            const obj = scene.getObjectById(id);
            if(obj.type === "Mesh"){
                obj.traverse(child=> {                    
                    children.push(child);
                });
            }
        });
        
        // Traverse the children array backwards, to delete children first (just for caution)
        for(let i = children.length - 1; i >= 0; i--){
            children[i].parent.remove(children[i]);
            children[i].geometry.dispose();
            if(children[i].material.map){
                children[i].material.map.dispose();
            }
            if(children[i].material.normalMap){
                children[i].material.normalMap.dispose();
            }
            if(children[i].material.displacementMap){
                children[i].material.displacementMap.dispose();
            }
            children[i].material.dispose();
            
        }

        renderer.renderLists.dispose();        
        console.log(scene);

        return;

    } else if(objPropType === "all"){
        scene.traverse(child => {
            if(child.type === "Mesh")
            children.push(child.id);
        });
        
        for(let i = children.length - 1; i >= 0; i--){
            const obj = scene.getObjectById(children[i]);

            if(obj.parent){
                obj.parent.remove(obj);
            }
            obj.geometry.dispose();
            if(obj.material.map){
                obj.material.map.dispose();
            }
            if(obj.material.normalMap){
                obj.material.normalMap.dispose();
            }
            if(obj.material.displacementMap){
                obj.material.displacementMap.dispose();
            }
            obj.material.dispose();
        }

        const background = scene.background;

        scene.background = null;
        background.dispose();

        renderer.renderLists.dispose();
        console.log(scene)
        return;
    } else {
        console.log("objPropType param must be 'name', 'id', or 'all'")
    }    
}