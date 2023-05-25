export class Binding {
    /**
     *
     * @param {State} state
     * @param {any => any} setter
     */
    constructor(state, setter) {
        this._state = state;

        this._setter = setter;

        this._prop;
    }

    hasStateElement(element) {
        for (const binding in this._state._bindings) {
            if (binding instanceof element) {
                return true;
            }
        }

        return false;
    }

    hasElementSelf() {
        for (const binding in this._state._bindings) {
            return this._state._bindings.get(binding).includes(this);
        }
    }

    addSelfToElement(element) {
        if (!(this.hasElementSelf(element))) {
            this._state._bindings.get(element).push(this);
            this._state.update();
        }
    }

    set(value, element) {
        element[this._prop] = this._setter(value);
    }
}
export class State {
    constructor(value) {
        this._value = null;

        this._bindings = new Map();

        this.value = value;
    }

    update() {
        for (const mapped of this._bindings) {
            for (const binding of mapped[1]) {
                binding.set(this.value, mapped[0]);
            }
        }
    }

    set value(value) {
        this._value = value;
        this.update();
    }
    get value() { return this._value; }

    bind(setter = v => v) {
        return new Binding(this, setter);
    }
}
export const valueOf = (value) => {
    return new State(value);
}

export class ListBinding extends Binding {
    /**
     *
     * @param {ListState} state
     * @param {(value: any, key: number) => any} each
     */
    constructor(state, each) {
        super(state, v => v);

        this._each = each;
    }

    requestViewUpdate() {
        const stateValueKeys = [];
        for (const value of this._state.value) {
            stateValueKeys.push(value);
        }

        for (const bindingMap of this._state._listBindings) {
            if (bindingMap[1] === this) {

                for (let i = 0; i < stateValueKeys.length; i++) {
                    bindingMap[0].appendChild(this._each(stateValueKeys[i][1], stateValueKeys[i][0]));
                }
            }
        }
    }
}
export class ListState extends State {
    constructor(...values) {
        super(new Map());

        this._idIncrement = 0;
        this._listBindings = new Map();

        for (const value of values) {
            this.add(value);
        }
    }

    requestViewUpdate() {
        for (const bindingMap of this._listBindings) {
            bindingMap[0].appendChild(bindingMap[1]._each(this.value.get(this._idIncrement), this._idIncrement));
        }
    }

    add(value) {
        this.set(++this._idIncrement, value);

        this.requestViewUpdate();
    }

    set(key, value) {
        this.value.set(key, value);
    }

    get(key) {
        this._value.get(key);
    }

    remove(key) {
        let mapKeys = [];
        for (const pair of this.value) {
            mapKeys.push(pair[0]);
        }

        for (let i = 0; i < mapKeys.length; i++) {
            if (mapKeys[i] === key) {
                for (const bindingMap of this._listBindings) {
                    this.value.delete(key);
                    bindingMap[0].removeChild(bindingMap[0].children.item(i));
                }
                break;
            }
        }

        if (this.value.size === 0) {
            this._idIncrement = 0;
        }
    }

    pop() {
        this.remove(this._idIncrement);
    }

    bindEach(each = (value, key) => value) {
        return new ListBinding(this, each);
    }
}
export const listOf = (...values) => {
    return new ListState(...values);
}


export const $ = (tag = 'div', props = { classList: [] }, children = []) => {
    const compiledTag = tag.split('.');
    let tagName = compiledTag[0];
    compiledTag.splice(0, 1);

    if (tagName.includes('#')) {
        const tagContent = tagName.split('#');

        if (tagContent[0] === '') {
            tagName = 'div';
        } else {
            tagName = tagContent[0];
            props.id = tagContent[1];
        }
    }

    props.className = props.className ?? [];

    for (const className of compiledTag) {
        if (!(className.includes('#'))) {
            props.className.push(className);
        }
    }

    props.className = props.className.join(' ');

    const el = document.createElement(tagName);

    // property value binding
    for (const prop in props) {
        if (!(props[prop] instanceof Binding)) {
            el[prop] = props[prop];
        }
        else if (props[prop] instanceof Binding) {
            bindToEl(props[prop], el, prop)
        }
    }

    // element children binding
    if (children instanceof ListBinding) {
        children._state._listBindings.set(el, children);

        children.requestViewUpdate();
    } else {
        for (const child of children) {

            if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else {
                const tn = document.createTextNode(child);
                el.appendChild(tn);

                if (child instanceof Binding) {
                    bindToEl(child, tn, 'textContent');
                }
            }
        }
    }

    return el;
}

const bindToEl = (binding, el, prop) => {
    if (binding.hasStateElement(el)) {
        binding.addSelfToElement(el);
    } else {
        binding._state._bindings.set(el, []);
        binding._prop = prop;
        binding.addSelfToElement(el);
    }
}
