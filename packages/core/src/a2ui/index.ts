export type JsonObject = Record<string, unknown>;

export const stringRefLiteral = (value: string): JsonObject => ({
    literalString: value
});

export const stringRefPath = (path: string): JsonObject => ({
    path
});

export const numberRefLiteral = (value: number): JsonObject => ({
    literalNumber: value
});

export const numberRefPath = (path: string): JsonObject => ({
    path
});

export const boolRefLiteral = (value: boolean): JsonObject => ({
    literalBoolean: value
});

export const boolRefPath = (path: string): JsonObject => ({
    path
});

export const stringArrayRefLiteral = (values: string[]): JsonObject => ({
    literalArray: values
});

export const stringArrayRefPath = (path: string): JsonObject => ({
    path
});

export const actionValuePath = (path: string): JsonObject => ({
    path
});

export const actionValueLiteralString = (value: string): JsonObject => ({
    literalString: value
});

export const actionValueLiteralNumber = (value: number): JsonObject => ({
    literalNumber: value
});

export const actionValueLiteralBoolean = (value: boolean): JsonObject => ({
    literalBoolean: value
});

export const action = (
    name: string,
    context?: Array<{ key: string; value: JsonObject }>
): JsonObject => {
    const payload: JsonObject = { name };
    if (context && context.length > 0) {
        payload.context = context;
    }
    return payload;
};

export const childrenExplicit = (ids: string[]): JsonObject => ({
    explicitList: ids
});

export const childrenTemplate = (componentId: string, dataBinding: string): JsonObject => ({
    template: { componentId, dataBinding }
});

export const component = (
    id: string,
    type: string,
    props: JsonObject,
    weight?: number
): JsonObject => {
    const entry: JsonObject = {
        id,
        component: { [type]: props }
    };
    if (weight !== undefined) {
        entry.weight = weight;
    }
    return entry;
};

export const text = (id: string, textRef: JsonObject, usageHint?: string): JsonObject => {
    const props: JsonObject = { text: textRef };
    if (usageHint) {
        props.usageHint = usageHint;
    }
    return component(id, 'Text', props);
};

export const image = (
    id: string,
    url: JsonObject,
    fit?: string,
    usageHint?: string
): JsonObject => {
    const props: JsonObject = { url };
    if (fit) {
        props.fit = fit;
    }
    if (usageHint) {
        props.usageHint = usageHint;
    }
    return component(id, 'Image', props);
};

export const icon = (id: string, name: JsonObject): JsonObject =>
    component(id, 'Icon', { name });

export const divider = (id: string, axis?: string): JsonObject =>
    component(id, 'Divider', axis ? { axis } : {});

export const row = (
    id: string,
    children: JsonObject,
    distribution?: string,
    alignment?: string
): JsonObject => {
    const props: JsonObject = { children };
    if (distribution) {
        props.distribution = distribution;
    }
    if (alignment) {
        props.alignment = alignment;
    }
    return component(id, 'Row', props);
};

export const column = (
    id: string,
    children: JsonObject,
    distribution?: string,
    alignment?: string
): JsonObject => {
    const props: JsonObject = { children };
    if (distribution) {
        props.distribution = distribution;
    }
    if (alignment) {
        props.alignment = alignment;
    }
    return component(id, 'Column', props);
};

export const list = (
    id: string,
    children: JsonObject,
    direction?: string,
    alignment?: string
): JsonObject => {
    const props: JsonObject = { children };
    if (direction) {
        props.direction = direction;
    }
    if (alignment) {
        props.alignment = alignment;
    }
    return component(id, 'List', props);
};

export const button = (
    id: string,
    child: string,
    actionPayload: JsonObject,
    primary?: boolean
): JsonObject => {
    const props: JsonObject = { child, action: actionPayload };
    if (primary !== undefined) {
        props.primary = primary;
    }
    return component(id, 'Button', props);
};

export const textField = (
    id: string,
    textRef?: JsonObject,
    label?: JsonObject,
    textFieldType?: string,
    validationRegexp?: string,
    onSubmittedAction?: JsonObject
): JsonObject => {
    const props: JsonObject = {};
    if (textRef) props.text = textRef;
    if (label) props.label = label;
    if (textFieldType) props.textFieldType = textFieldType;
    if (validationRegexp) props.validationRegexp = validationRegexp;
    if (onSubmittedAction) props.onSubmittedAction = onSubmittedAction;
    return component(id, 'TextField', props);
};

export const checkBox = (id: string, label: JsonObject, value: JsonObject): JsonObject =>
    component(id, 'CheckBox', { label, value });

export const card = (id: string, child: string): JsonObject =>
    component(id, 'Card', { child });

export const modal = (id: string, entryPointChild: string, contentChild: string): JsonObject =>
    component(id, 'Modal', { entryPointChild, contentChild });

export const tabs = (id: string, tabItems: Array<{ title: JsonObject; child: string }>): JsonObject =>
    component(id, 'Tabs', { tabItems });

export const tabItem = (title: JsonObject, child: string): JsonObject => ({ title, child });

export const multipleChoice = (
    id: string,
    selections: JsonObject,
    options: Array<{ label: JsonObject; value: string }>,
    maxAllowedSelections?: number
): JsonObject => {
    const props: JsonObject = { selections, options };
    if (maxAllowedSelections !== undefined) {
        props.maxAllowedSelections = maxAllowedSelections;
    }
    return component(id, 'MultipleChoice', props);
};

export const choiceOption = (label: JsonObject, value: string): JsonObject => ({
    label,
    value
});

export const slider = (
    id: string,
    value: JsonObject,
    minValue?: number,
    maxValue?: number
): JsonObject => {
    const props: JsonObject = { value };
    if (minValue !== undefined) props.minValue = minValue;
    if (maxValue !== undefined) props.maxValue = maxValue;
    return component(id, 'Slider', props);
};

export const dateTimeInput = (
    id: string,
    value: JsonObject,
    enableDate?: boolean,
    enableTime?: boolean,
    firstDate?: string,
    lastDate?: string
): JsonObject => {
    const props: JsonObject = { value };
    if (enableDate !== undefined) props.enableDate = enableDate;
    if (enableTime !== undefined) props.enableTime = enableTime;
    if (firstDate) props.firstDate = firstDate;
    if (lastDate) props.lastDate = lastDate;
    return component(id, 'DateTimeInput', props);
};

export const audioPlayer = (id: string, url: JsonObject): JsonObject =>
    component(id, 'AudioPlayer', { url });

export const video = (id: string, url: JsonObject): JsonObject =>
    component(id, 'Video', { url });

export const timeline = (
    id: string,
    children: JsonObject,
    orientation?: string,
    alignment?: string,
    autoFollow?: JsonObject,
    laneMode?: string,
    currentItemId?: JsonObject
): JsonObject => {
    const props: JsonObject = { children };
    if (orientation) props.orientation = orientation;
    if (alignment) props.alignment = alignment;
    if (autoFollow) props.autoFollow = autoFollow;
    if (laneMode) props.laneMode = laneMode;
    if (currentItemId) props.currentItemId = currentItemId;
    return component(id, 'Timeline', props);
};

export const timelineItem = (
    id: string,
    itemId: string,
    title?: JsonObject,
    subtitle?: JsonObject,
    timestamp?: JsonObject,
    kind?: string,
    state?: string,
    severity?: string,
    icon?: JsonObject,
    contentChild?: string,
    actionPayload?: JsonObject
): JsonObject => {
    const props: JsonObject = { itemId };
    if (title) props.title = title;
    if (subtitle) props.subtitle = subtitle;
    if (timestamp) props.timestamp = timestamp;
    if (kind) props.kind = kind;
    if (state) props.state = state;
    if (severity) props.severity = severity;
    if (icon) props.icon = icon;
    if (contentChild) props.contentChild = contentChild;
    if (actionPayload) props.action = actionPayload;
    return component(id, 'TimelineItem', props);
};

export const timelineGroup = (
    id: string,
    groupId: string,
    children: JsonObject,
    title?: JsonObject,
    summary?: JsonObject,
    collapsed?: JsonObject,
    badgeCount?: JsonObject,
    groupState?: string
): JsonObject => {
    const props: JsonObject = { groupId, children };
    if (title) props.title = title;
    if (summary) props.summary = summary;
    if (collapsed) props.collapsed = collapsed;
    if (badgeCount) props.badgeCount = badgeCount;
    if (groupState) props.groupState = groupState;
    return component(id, 'TimelineGroup', props);
};

export const timelineLane = (
    id: string,
    laneId: string,
    children: JsonObject,
    title?: JsonObject
): JsonObject => {
    const props: JsonObject = { laneId, children };
    if (title) props.title = title;
    return component(id, 'TimelineLane', props);
};
