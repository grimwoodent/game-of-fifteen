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
    hightlight() {
        console.log(`Move "${this.value || 'empty'}" block`);
    }
}

class ConsoleRenderer extends AbstractRenderer {
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
    async moveBlock(point, direction) {
        const block = this.findBlockByPoint(point);
        await block?.hightlight();
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
    appendTo(targetElement) {
        assertTargetElement(targetElement);
        targetElement.append(this.element);
    }
    hightlight(timeout = 100) {
        return new Promise((resolve) => {
            this.element.classList.add('active');
            window.setTimeout(() => {
                this.element.classList.remove('active');
                resolve();
            }, timeout);
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
    async moveBlock(point, direction) {
        const block = this.findBlockByPoint(point);
        await block?.hightlight();
    }
    onMainElementClick(e) {
        const target = e.target || e.srcElement;
        if (!target || !(target instanceof HTMLElement)) {
            return;
        }
        if (!target.classList.contains("js-block" /* ACTION_CLASS.BLOCK */)) {
            return;
        }
        if (!target.dataset.x || !target.dataset.y) {
            return;
        }
        this.rendererEvents.requestMoveBlock?.({
            x: parseInt(target.dataset.x, 10),
            y: parseInt(target.dataset.y, 10),
        });
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
            requestMoveBlock: async (point) => {
                await this.moveBlock(point);
                this.render();
            },
        }));
        return this;
    }
    start() {
        this.render();
    }
    async moveBlock(point) {
        await Promise.allSettled(this.renderers.map((renderer) => renderer.moveBlock(point, 1)));
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
