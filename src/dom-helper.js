
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

export function createGeneralCategory(name) {
    const div = create('div');
    const title = create('h4');
    addClass(div, 'category');
    title.textContent = name;
    div.appendChild(title);
    return div
}

export function createSocial(iconName, name, data, url = null) {
    const social = create('div');
    const icon = create('i');
    const spanName = create('span');
    const spanData = create('span');
    addClass(social, 'social');
    addClass(icon, 'fa-solid', iconName.includes('facebook') || iconName.includes('instagram') || iconName.includes('git') ? 'fa-brands' : '', iconName);
    addClass(spanName, 'social-name');
    addClass(spanData, 'social-data');
    spanName.textContent = name;

    if(url === null) {
        spanData.textContent = data;
    } else {
        const a = create('a');
        a.href = url;
        a.textContent = data;
        spanData.appendChild(a);
    }
    addChilds(social, icon, spanName, spanData);
    return social;
}
export function createParagraph(text) {
    const p = create('p');
    p.textContent = text;
    return p;
}