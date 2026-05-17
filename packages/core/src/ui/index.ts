import * as uiwire from '../uiwire/index.js';

export type UiString = UiStringLiteral | UiStringPath;
export type UiNumber = UiNumberLiteral | UiNumberPath;
export type UiBool = UiBoolLiteral | UiBoolPath;
export type UiStringArray = UiStringArrayLiteral | UiStringArrayPath;

export class UiStringLiteral {
    constructor(public value: string) {}
}
export class UiStringPath {
    constructor(public path: string) {}
}

export class UiNumberLiteral {
    constructor(public value: number) {}
}
export class UiNumberPath {
    constructor(public path: string) {}
}

export class UiBoolLiteral {
    constructor(public value: boolean) {}
}
export class UiBoolPath {
    constructor(public path: string) {}
}

export class UiStringArrayLiteral {
    constructor(public value: string[]) {}
}
export class UiStringArrayPath {
    constructor(public path: string) {}
}

export type UiActionValue = UiActionValuePath | UiActionValueString | UiActionValueNumber | UiActionValueBool;

export class UiActionValuePath {
    constructor(public path: string) {}
}
export class UiActionValueString {
    constructor(public value: string) {}
}
export class UiActionValueNumber {
    constructor(public value: number) {}
}
export class UiActionValueBool {
    constructor(public value: boolean) {}
}

export class UiAction {
    constructor(public name: string, public context: Record<string, UiActionValue> = {}) {}
}

export type UiChildren = UiChildrenItems | UiChildrenTemplate;

export class UiChildrenItems {
    constructor(public items: UiWidget[]) {}
}
export class UiChildrenTemplate {
    constructor(public dataBinding: string, public template: UiWidget) {}
}

export abstract class UiWidget {
    public id?: string;
    public weight?: number;
    withId(id: string): this {
        this.id = id;
        return this;
    }
    withWeight(weight: number): this {
        this.weight = weight;
        return this;
    }
}

export class Text extends UiWidget {
    constructor(public text: UiString, public usageHint?: string) {
        super();
    }
}
export class Image extends UiWidget {
    constructor(public url: UiString, public fit?: string, public usageHint?: string) {
        super();
    }
}
export class Icon extends UiWidget {
    constructor(public name: UiString) {
        super();
    }
}
export class Divider extends UiWidget {
    constructor(public axis?: string) {
        super();
    }
}
export class Row extends UiWidget {
    constructor(public children: UiChildren, public distribution?: string, public alignment?: string) {
        super();
    }
}
export class Column extends UiWidget {
    constructor(public children: UiChildren, public distribution?: string, public alignment?: string) {
        super();
    }
}
export class List extends UiWidget {
    constructor(public children: UiChildren, public direction?: string, public alignment?: string) {
        super();
    }
}
export class Button extends UiWidget {
    constructor(public child: UiWidget, public action: UiAction, public primary?: boolean) {
        super();
    }
}
export class TextField extends UiWidget {
    constructor(
        public text?: UiString,
        public label?: UiString,
        public textFieldType?: string,
        public validationRegexp?: string,
        public onSubmittedAction?: UiAction
    ) {
        super();
    }
}
export class CheckBox extends UiWidget {
    constructor(public label: UiString, public value: UiBool) {
        super();
    }
}
export class Card extends UiWidget {
    constructor(public child: UiWidget) {
        super();
    }
}
export class Modal extends UiWidget {
    constructor(public entryPoint: UiWidget, public content: UiWidget) {
        super();
    }
}
export class TabItem {
    constructor(public title: UiString, public child: UiWidget) {}
}
export class Tabs extends UiWidget {
    constructor(public tabItems: TabItem[]) {
        super();
    }
}
export class ChoiceOption {
    constructor(public label: UiString, public value: string) {}
}
export class MultipleChoice extends UiWidget {
    constructor(
        public selections: UiStringArray,
        public options: ChoiceOption[],
        public maxAllowedSelections?: number
    ) {
        super();
    }
}
export class Slider extends UiWidget {
    constructor(public value: UiNumber, public minValue?: number, public maxValue?: number) {
        super();
    }
}
export class DateTimeInput extends UiWidget {
    constructor(
        public value: UiString,
        public enableDate?: boolean,
        public enableTime?: boolean,
        public firstDate?: string,
        public lastDate?: string
    ) {
        super();
    }
}
export class AudioPlayer extends UiWidget {
    constructor(public url: UiString) {
        super();
    }
}
export class Video extends UiWidget {
    constructor(public url: UiString) {
        super();
    }
}
export class Timeline extends UiWidget {
    constructor(
        public children: UiChildren,
        public orientation?: string,
        public alignment?: string,
        public autoFollow?: UiBool,
        public laneMode?: string,
        public currentItemId?: UiString
    ) {
        super();
    }
}
export class TimelineItem extends UiWidget {
    constructor(
        public itemId?: string,
        public title?: UiString,
        public subtitle?: UiString,
        public timestamp?: UiString,
        public kind?: string,
        public state?: string,
        public severity?: string,
        public icon?: UiString,
        public content?: UiWidget,
        public action?: UiAction
    ) {
        super();
    }
}
export class TimelineGroup extends UiWidget {
    constructor(
        public groupId: string,
        public title: UiString | undefined,
        public summary: UiString | undefined,
        public children: UiChildren,
        public collapsed?: UiBool,
        public badgeCount?: UiNumber,
        public groupState?: string
    ) {
        super();
    }
}
export class TimelineLane extends UiWidget {
    constructor(public laneId: string, public title: UiString | undefined, public children: UiChildren) {
        super();
    }
}

export type UiRenderResult = { root: string; components: uiwire.JsonObject[] };

export const render = (root: UiWidget): UiRenderResult => {
    const serializer = new UiSerializer();
    const rootId = serializer.renderWidget(root);
    return { root: rootId, components: serializer.components };
};

class UiSerializer {
    private counter = 0;
    public components: uiwire.JsonObject[] = [];

    private nextId() {
        this.counter += 1;
        return `ui-${this.counter}`;
    }

    private renderChildren(children: UiChildren): uiwire.JsonObject {
        if (children instanceof UiChildrenTemplate) {
            const id = this.renderWidget(children.template);
            return uiwire.childrenTemplate(id, children.dataBinding);
        }
        const ids = children.items.map((child) => this.renderWidget(child));
        return uiwire.childrenExplicit(ids);
    }

    public renderWidget(widget: UiWidget): string {
        const id = widget.id ?? this.nextId();
        const component = this.renderKind(widget);
        const entry = uiwire.component(id, component.type, component.props, widget.weight);
        this.components.push(entry);
        return id;
    }

    private renderKind(widget: UiWidget): { type: string; props: uiwire.JsonObject } {
        if (widget instanceof Text) {
            return { type: 'Text', props: { text: toStringRef(widget.text), usageHint: widget.usageHint } };
        }
        if (widget instanceof Image) {
            return {
                type: 'Image',
                props: { url: toStringRef(widget.url), fit: widget.fit, usageHint: widget.usageHint }
            };
        }
        if (widget instanceof Icon) {
            return { type: 'Icon', props: { name: toStringRef(widget.name) } };
        }
        if (widget instanceof Divider) {
            return { type: 'Divider', props: widget.axis ? { axis: widget.axis } : {} };
        }
        if (widget instanceof Row) {
            return {
                type: 'Row',
                props: {
                    children: this.renderChildren(widget.children),
                    distribution: widget.distribution,
                    alignment: widget.alignment
                }
            };
        }
        if (widget instanceof Column) {
            return {
                type: 'Column',
                props: {
                    children: this.renderChildren(widget.children),
                    distribution: widget.distribution,
                    alignment: widget.alignment
                }
            };
        }
        if (widget instanceof List) {
            return {
                type: 'List',
                props: {
                    children: this.renderChildren(widget.children),
                    direction: widget.direction,
                    alignment: widget.alignment
                }
            };
        }
        if (widget instanceof Button) {
            const childId = this.renderWidget(widget.child);
            return {
                type: 'Button',
                props: {
                    child: childId,
                    action: toAction(widget.action),
                    primary: widget.primary
                }
            };
        }
        if (widget instanceof TextField) {
            return {
                type: 'TextField',
                props: {
                    text: widget.text ? toStringRef(widget.text) : undefined,
                    label: widget.label ? toStringRef(widget.label) : undefined,
                    textFieldType: widget.textFieldType,
                    validationRegexp: widget.validationRegexp,
                    onSubmittedAction: widget.onSubmittedAction ? toAction(widget.onSubmittedAction) : undefined
                }
            };
        }
        if (widget instanceof CheckBox) {
            return {
                type: 'CheckBox',
                props: {
                    label: toStringRef(widget.label),
                    value: toBoolRef(widget.value)
                }
            };
        }
        if (widget instanceof Card) {
            const childId = this.renderWidget(widget.child);
            return { type: 'Card', props: { child: childId } };
        }
        if (widget instanceof Modal) {
            const entryId = this.renderWidget(widget.entryPoint);
            const contentId = this.renderWidget(widget.content);
            return { type: 'Modal', props: { entryPointChild: entryId, contentChild: contentId } };
        }
        if (widget instanceof Tabs) {
            const tabItems = widget.tabItems.map((item) => ({
                title: toStringRef(item.title),
                child: this.renderWidget(item.child)
            }));
            return { type: 'Tabs', props: { tabItems } };
        }
        if (widget instanceof MultipleChoice) {
            return {
                type: 'MultipleChoice',
                props: {
                    selections: toStringArrayRef(widget.selections),
                    options: widget.options.map((option) => ({
                        label: toStringRef(option.label),
                        value: option.value
                    })),
                    maxAllowedSelections: widget.maxAllowedSelections
                }
            };
        }
        if (widget instanceof Slider) {
            return {
                type: 'Slider',
                props: {
                    value: toNumberRef(widget.value),
                    minValue: widget.minValue,
                    maxValue: widget.maxValue
                }
            };
        }
        if (widget instanceof DateTimeInput) {
            return {
                type: 'DateTimeInput',
                props: {
                    value: toStringRef(widget.value),
                    enableDate: widget.enableDate,
                    enableTime: widget.enableTime,
                    firstDate: widget.firstDate,
                    lastDate: widget.lastDate
                }
            };
        }
        if (widget instanceof AudioPlayer) {
            return { type: 'AudioPlayer', props: { url: toStringRef(widget.url) } };
        }
        if (widget instanceof Video) {
            return { type: 'Video', props: { url: toStringRef(widget.url) } };
        }
        if (widget instanceof Timeline) {
            return {
                type: 'Timeline',
                props: {
                    children: this.renderChildren(widget.children),
                    orientation: widget.orientation,
                    alignment: widget.alignment,
                    autoFollow: widget.autoFollow ? toBoolRef(widget.autoFollow) : undefined,
                    laneMode: widget.laneMode,
                    currentItemId: widget.currentItemId ? toStringRef(widget.currentItemId) : undefined
                }
            };
        }
        if (widget instanceof TimelineItem) {
            const contentChild = widget.content ? this.renderWidget(widget.content) : undefined;
            return {
                type: 'TimelineItem',
                props: {
                    itemId: widget.itemId,
                    title: widget.title ? toStringRef(widget.title) : undefined,
                    subtitle: widget.subtitle ? toStringRef(widget.subtitle) : undefined,
                    timestamp: widget.timestamp ? toStringRef(widget.timestamp) : undefined,
                    kind: widget.kind,
                    state: widget.state,
                    severity: widget.severity,
                    icon: widget.icon ? toStringRef(widget.icon) : undefined,
                    contentChild,
                    action: widget.action ? toAction(widget.action) : undefined
                }
            };
        }
        if (widget instanceof TimelineGroup) {
            return {
                type: 'TimelineGroup',
                props: {
                    groupId: widget.groupId,
                    title: widget.title ? toStringRef(widget.title) : undefined,
                    summary: widget.summary ? toStringRef(widget.summary) : undefined,
                    children: this.renderChildren(widget.children),
                    collapsed: widget.collapsed ? toBoolRef(widget.collapsed) : undefined,
                    badgeCount: widget.badgeCount ? toNumberRef(widget.badgeCount) : undefined,
                    groupState: widget.groupState
                }
            };
        }
        if (widget instanceof TimelineLane) {
            return {
                type: 'TimelineLane',
                props: {
                    laneId: widget.laneId,
                    title: widget.title ? toStringRef(widget.title) : undefined,
                    children: this.renderChildren(widget.children)
                }
            };
        }
        return { type: 'Unknown', props: {} };
    }
}

const toStringRef = (value: UiString): uiwire.JsonObject =>
    value instanceof UiStringPath ? uiwire.stringRefPath(value.path) : uiwire.stringRefLiteral(value.value);

const toNumberRef = (value: UiNumber): uiwire.JsonObject =>
    value instanceof UiNumberPath ? uiwire.numberRefPath(value.path) : uiwire.numberRefLiteral(value.value);

const toBoolRef = (value: UiBool): uiwire.JsonObject =>
    value instanceof UiBoolPath ? uiwire.boolRefPath(value.path) : uiwire.boolRefLiteral(value.value);

const toStringArrayRef = (value: UiStringArray): uiwire.JsonObject =>
    value instanceof UiStringArrayPath
        ? uiwire.stringArrayRefPath(value.path)
        : uiwire.stringArrayRefLiteral(value.value);

const toAction = (action: UiAction): uiwire.JsonObject => {
    const context =
        action.context && Object.keys(action.context).length > 0
            ? Object.entries(action.context).map(([key, value]) => ({
                  key,
                  value: toActionValue(value)
              }))
            : undefined;
    return uiwire.action(action.name, context);
};

const toActionValue = (value: UiActionValue): uiwire.JsonObject => {
    if (value instanceof UiActionValuePath) return uiwire.actionValuePath(value.path);
    if (value instanceof UiActionValueString) return uiwire.actionValueLiteralString(value.value);
    if (value instanceof UiActionValueNumber) return uiwire.actionValueLiteralNumber(value.value);
    if (value instanceof UiActionValueBool) return uiwire.actionValueLiteralBoolean(value.value);
    return {};
};
