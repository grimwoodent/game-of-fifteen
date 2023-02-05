'use strict';

class LinearField {
    width;
    height;
    values = [];
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.values = (new Array(width * height)).fill(null);
        for (let i = 0; i < width * height - 1; i++) {
            this.values[i] = i + 1;
        }
    }
    get size() {
        return {
            width: this.width,
            height: this.height,
        };
    }
    toMatrix() {
        return [...this.values];
    }
    moveValue(targetValue) {
        let direction = null;
        if (targetValue === null) {
            return direction;
        }
        const valueIndex = this.values.findIndex((value) => value === targetValue);
        const nullIndex = this.values.findIndex((value) => value === null);
        if (valueIndex === -1 || nullIndex === -1) {
            return direction;
        }
        if (nullIndex - valueIndex === -1 && (valueIndex % this.width > 0)) {
            direction = 2 /* MOVE_DIRECTION.RIGHT */;
        }
        else if (nullIndex - valueIndex === 1 && (nullIndex % this.width > 0)) {
            direction = 4 /* MOVE_DIRECTION.LEFT */;
        }
        else if (nullIndex - valueIndex === -this.width) {
            direction = 1 /* MOVE_DIRECTION.UP */;
        }
        else if (nullIndex - valueIndex === this.width) {
            direction = 3 /* MOVE_DIRECTION.DOWN */;
        }
        if (direction !== null) {
            this.values[nullIndex] = targetValue;
            this.values[valueIndex] = null;
            return direction;
        }
        return null;
    }
}

function isPointsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}

class AbstractRenderer {
    rendererEvents = {};
    field;
    blocks = [];
    init(field, rendererEvents) {
        this.field = field;
        this.rendererEvents = rendererEvents || {};
    }
    findBlockByPoint(point) {
        return this.blocks.find((block) => isPointsEqual(point, block.position));
    }
    findBlockByValue(value) {
        return this.blocks.find((block) => value === block.value);
    }
}

class ConsoleRendererBlock {
    position;
    value;
    constructor(position, value) {
        this.position = position;
        this.value = value;
    }
    getLabel() {
        return this.value !== null
            ? (this.value < 10 ? `  ${this.value}` : ` ${this.value}`)
            : '   ';
    }
    showMoved() {
        console.log(`Move "${this.value || 'empty'}" block`);
        return Promise.resolve();
    }
    showBlocked() {
        console.log(`Can't move "${this.value || 'empty'}" block`);
        return Promise.resolve();
    }
}

class ConsoleRenderer extends AbstractRenderer {
    constructor() {
        super();
        window.moveNumber = (value) => {
            if (typeof value !== 'number') {
                throw new Error('Input type must be Number');
            }
            this.rendererEvents.requestMoveValue?.(value);
        };
    }
    render() {
        const field = this.field;
        if (!field) {
            throw new Error('Field not found');
        }
        const { height, width } = field.size;
        const matrix = field.toMatrix();
        let result = '';
        this.blocks = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = matrix[y * width + x];
                const block = new ConsoleRendererBlock({ x, y }, value);
                this.blocks.push(block);
                result += block.getLabel();
            }
            result += '\r\n';
        }
        console.log(result + '\r\n');
    }
    async moveBlock(value) {
        const block = this.findBlockByValue(value);
        await block?.showMoved();
    }
    async cantMoveBlock(value) {
        const block = this.findBlockByValue(value);
        await block?.showBlocked();
    }
}

function assertTargetElement(target) {
    if (!target || !(target instanceof HTMLElement) || !target.isConnected) {
        throw new Error('Renderer target element not found');
    }
}

class DomRendererBlock {
    position;
    value;
    element;
    constructor(position, value) {
        this.position = position;
        this.value = value;
        this.element = document.createElement('span');
        this.element.innerHTML = String(value || '');
        this.element.classList.add("js-block" /* ACTION_CLASS.BLOCK */);
        this.element.dataset.x = String(position.x);
        this.element.dataset.y = String(position.y);
    }
    isElement(targetElement) {
        return this.element === targetElement;
    }
    appendTo(targetElement) {
        assertTargetElement(targetElement);
        targetElement.append(this.element);
    }
    showMoved(direction) {
        return new Promise((resolve) => {
            this.element.classList.add('active');
            window.setTimeout(() => {
                this.element.classList.remove('active');
                resolve();
            }, 300);
        });
    }
    showBlocked() {
        return new Promise((resolve) => {
            this.element.classList.add('blocked');
            window.setTimeout(() => {
                this.element.classList.remove('blocked');
                resolve();
            }, 300);
        });
    }
}

class DomRenderer extends AbstractRenderer {
    fieldElement;
    constructor(targetElement) {
        super();
        assertTargetElement(targetElement);
        this.fieldElement = document.createElement('div');
        targetElement.append(this.fieldElement);
        this.fieldElement.classList.add('field');
        this.fieldElement.addEventListener('click', this.onMainElementClick.bind(this));
    }
    render() {
        const field = this.field;
        if (!field) {
            throw new Error('Field not found');
        }
        assertTargetElement(this.fieldElement);
        const { height, width } = field.size;
        const matrix = field.toMatrix();
        this.fieldElement.innerHTML = '';
        this.blocks = [];
        for (let y = 0; y < height; y++) {
            const lineElement = document.createElement('div');
            this.fieldElement.append(lineElement);
            for (let x = 0; x < width; x++) {
                const value = matrix[y * width + x];
                const block = new DomRendererBlock({ x, y }, value);
                this.blocks.push(block);
                block.appendTo(lineElement);
            }
        }
    }
    async moveBlock(value, direction) {
        const block = this.findBlockByValue(value);
        await block?.showMoved(direction);
    }
    async cantMoveBlock(value) {
        const block = this.findBlockByValue(value);
        await block?.showBlocked();
    }
    onMainElementClick(e) {
        const target = e.target || e.srcElement;
        if (!target || !(target instanceof HTMLElement)) {
            return;
        }
        if (!target.classList.contains("js-block" /* ACTION_CLASS.BLOCK */)) {
            return;
        }
        const block = this.blocks.find((block) => block.isElement(target));
        if (!block) {
            return;
        }
        this.rendererEvents.requestMoveValue?.(block.value);
    }
}

class Game {
    renderers;
    field = new LinearField(4, 4);
    constructor(renderers) {
        this.renderers = renderers;
    }
    init() {
        this.renderers.forEach((renderer) => renderer.init(this.field, {
            requestMoveValue: (value) => this.requestMoveBlock(value),
        }));
        return this;
    }
    start() {
        this.render();
    }
    async requestMoveBlock(value) {
        const direction = this.field.moveValue(value);
        if (direction === null) {
            await Promise.allSettled(this.renderers.map((renderer) => renderer.cantMoveBlock(value)));
            return;
        }
        await Promise.allSettled(this.renderers.map((renderer) => renderer.moveBlock(value, 1)));
        this.render();
    }
    render() {
        this.renderers.forEach((renderer) => renderer.render());
    }
}
document.addEventListener('DOMContentLoaded', () => {
    (new Game([
        new ConsoleRenderer(),
        new DomRenderer(document.getElementById('content')),
    ])).init().start();
});
