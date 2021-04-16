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
            children[i].material.dispose();
        }

        renderer.renderLists.dispose();
        console.log(scene);
        
        return;

    } else if(objPropType === "id"){
        arr.forEach(id => {
            const obj = scene.getObjectById(id);
            obj.traverse(child=> {
                children.push(child);
            });
        });
        
        // Traverse the children array backwards, to delete children first (just for caution)
        for(let i = children.length - 1; i >= 0; i--){
            children[i].parent.remove(children[i]);
            children[i].geometry.dispose();
            children[i].material.dispose();
            
        }

        renderer.renderLists.dispose();        
        console.log(scene);

        return;

    } else if(objPropType === "all"){
        scene.traverse(child => {
            children.push(child.id);
        });
        
        for(let i = children.length - 1; i >= 0; i--){
            const obj = scene.getObjectById(children[i]);

            if(obj.parent){
                obj.parent.remove(obj);
            }
            if(obj.geometry){
                obj.geometry.dispose();
            }
            if(obj.material){
                obj.material.dispose();
            }
        }

        renderer.renderLists.dispose();
        console.log(scene)
        return;
    } else {
        console.log("objPropType param must be 'name', 'id', or 'all'")
    }    
}