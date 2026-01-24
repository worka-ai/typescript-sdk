import {
    render,
    Text,
    Image,
    Icon,
    Divider,
    Row,
    Column,
    List,
    Button,
    TextField,
    CheckBox,
    Card,
    Modal,
    Tabs,
    TabItem,
    MultipleChoice,
    ChoiceOption,
    Slider,
    DateTimeInput,
    AudioPlayer,
    Video,
    Timeline,
    TimelineItem,
    TimelineGroup,
    TimelineLane,
    UiChildrenItems,
    UiStringLiteral,
    UiBoolLiteral,
    UiStringArrayPath,
    UiNumberLiteral,
    UiAction
} from '../src/ui/index.js';

const assertComponentKind = (widget: any, expected: string) => {
    const result = render(widget);
    const entry = result.components[0] as Record<string, any>;
    const component = entry.component as Record<string, any>;
    if (!component[expected]) {
        throw new Error(`expected ${expected} component`);
    }
};

describe('ui builder', () => {
    it('serializes typed widgets', () => {
        assertComponentKind(new Text(new UiStringLiteral('Hello'), 'h1'), 'Text');
        assertComponentKind(new Image(new UiStringLiteral('https://example.com')), 'Image');
        assertComponentKind(new Icon(new UiStringLiteral('check')), 'Icon');
        assertComponentKind(new Divider('horizontal'), 'Divider');
        assertComponentKind(new Row(new UiChildrenItems([])), 'Row');
        assertComponentKind(new Column(new UiChildrenItems([])), 'Column');
        assertComponentKind(new List(new UiChildrenItems([]), 'vertical'), 'List');
        assertComponentKind(
            new Button(new Text(new UiStringLiteral('Click')), new UiAction('submit')),
            'Button'
        );
        assertComponentKind(new TextField(new UiStringLiteral('value')), 'TextField');
        assertComponentKind(new CheckBox(new UiStringLiteral('Agree'), new UiBoolLiteral(true)), 'CheckBox');
        assertComponentKind(new Card(new Text(new UiStringLiteral('Card'))), 'Card');
        assertComponentKind(
            new Modal(new Text(new UiStringLiteral('Open')), new Text(new UiStringLiteral('Body'))),
            'Modal'
        );
        assertComponentKind(
            new Tabs([new TabItem(new UiStringLiteral('Tab'), new Text(new UiStringLiteral('Body')))]),
            'Tabs'
        );
        assertComponentKind(
            new MultipleChoice(new UiStringArrayPath('/choices'), [
                new ChoiceOption(new UiStringLiteral('One'), '1')
            ]),
            'MultipleChoice'
        );
        assertComponentKind(new Slider(new UiNumberLiteral(1)), 'Slider');
        assertComponentKind(new DateTimeInput(new UiStringLiteral('2024-01-01')), 'DateTimeInput');
        assertComponentKind(new AudioPlayer(new UiStringLiteral('https://example.com/audio.mp3')), 'AudioPlayer');
        assertComponentKind(new Video(new UiStringLiteral('https://example.com/video.mp4')), 'Video');
        assertComponentKind(new Timeline(new UiChildrenItems([])), 'Timeline');
        assertComponentKind(new TimelineItem('item-1'), 'TimelineItem');
        assertComponentKind(
            new TimelineGroup('group-1', undefined, undefined, new UiChildrenItems([])),
            'TimelineGroup'
        );
        assertComponentKind(new TimelineLane('lane-1', undefined, new UiChildrenItems([])), 'TimelineLane');
    });
});
