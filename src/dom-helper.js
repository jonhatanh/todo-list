
export function create(name){
    return document.createElement(name);   
}

export function addClass(element, ...classes) {
    for(let cssClass of classes) {
        if(cssClass === '') continue;
        element.classList.add(cssClass);
    }
    return element;
}

export function addChilds(element, ...childs) {
    for(let child of childs) {
        element.appendChild(child);
    }
}
