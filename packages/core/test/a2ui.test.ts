import {
    text,
    image,
    icon,
    divider,
    row,
    column,
    list,
    button,
    textField,
    checkBox,
    card,
    modal,
    tabs,
    tabItem,
    multipleChoice,
    choiceOption,
    slider,
    dateTimeInput,
    audioPlayer,
    video,
    timeline,
    timelineItem,
    timelineGroup,
    timelineLane,
    stringRefLiteral,
    stringRefPath,
    stringArrayRefPath,
    numberRefPath,
    numberRefLiteral,
    boolRefLiteral,
    childrenExplicit,
    childrenTemplate,
    action
} from '../src/a2ui/index.js';

describe('A2UI builder', () => {
    test('serializes core widgets', () => {
        expect(text('text', stringRefLiteral('Hello'), 'h1')).toEqual({
            id: 'text',
            component: { Text: { text: { literalString: 'Hello' }, usageHint: 'h1' } }
        });

        expect(image('img', stringRefLiteral('https://example.com/logo.png'), 'cover', 'mediumFeature')).toEqual({
            id: 'img',
            component: {
                Image: {
                    url: { literalString: 'https://example.com/logo.png' },
                    fit: 'cover',
                    usageHint: 'mediumFeature'
                }
            }
        });

        expect(icon('icon', stringRefLiteral('check'))).toEqual({
            id: 'icon',
            component: { Icon: { name: { literalString: 'check' } } }
        });

        expect(divider('divider', 'horizontal')).toEqual({
            id: 'divider',
            component: { Divider: { axis: 'horizontal' } }
        });

        expect(row('row', childrenExplicit(['a', 'b']), 'spaceBetween', 'center')).toEqual({
            id: 'row',
            component: {
                Row: {
                    children: { explicitList: ['a', 'b'] },
                    distribution: 'spaceBetween',
                    alignment: 'center'
                }
            }
        });

        expect(column('column', childrenTemplate('item', '/items'), 'start', 'stretch')).toEqual({
            id: 'column',
            component: {
                Column: {
                    children: { template: { componentId: 'item', dataBinding: '/items' } },
                    distribution: 'start',
                    alignment: 'stretch'
                }
            }
        });

        expect(list('list', childrenExplicit(['one', 'two']), 'vertical', 'start')).toEqual({
            id: 'list',
            component: {
                List: {
                    children: { explicitList: ['one', 'two'] },
                    direction: 'vertical',
                    alignment: 'start'
                }
            }
        });

        expect(button('button', 'button-text', action('submit'), true)).toEqual({
            id: 'button',
            component: { Button: { child: 'button-text', action: { name: 'submit' }, primary: true } }
        });

        expect(
            textField(
                'text-field',
                stringRefPath('/email'),
                stringRefLiteral('Email'),
                'shortText',
                '^.+@.+$',
                action('submit_form')
            )
        ).toEqual({
            id: 'text-field',
            component: {
                TextField: {
                    text: { path: '/email' },
                    label: { literalString: 'Email' },
                    textFieldType: 'shortText',
                    validationRegexp: '^.+@.+$',
                    onSubmittedAction: { name: 'submit_form' }
                }
            }
        });

        expect(checkBox('check', stringRefLiteral('Agree'), { path: '/agree' })).toEqual({
            id: 'check',
            component: { CheckBox: { label: { literalString: 'Agree' }, value: { path: '/agree' } } }
        });

        expect(card('card', 'card-content')).toEqual({
            id: 'card',
            component: { Card: { child: 'card-content' } }
        });

        expect(modal('modal', 'open-btn', 'modal-content')).toEqual({
            id: 'modal',
            component: { Modal: { entryPointChild: 'open-btn', contentChild: 'modal-content' } }
        });

        expect(
            tabs('tabs', [
                tabItem(stringRefLiteral('Overview'), 'overview'),
                tabItem(stringRefLiteral('Details'), 'details')
            ])
        ).toEqual({
            id: 'tabs',
            component: {
                Tabs: {
                    tabItems: [
                        { title: { literalString: 'Overview' }, child: 'overview' },
                        { title: { literalString: 'Details' }, child: 'details' }
                    ]
                }
            }
        });

        expect(
            multipleChoice(
                'choices',
                stringArrayRefPath('/choices'),
                [choiceOption(stringRefLiteral('One'), '1'), choiceOption(stringRefLiteral('Two'), '2')],
                1
            )
        ).toEqual({
            id: 'choices',
            component: {
                MultipleChoice: {
                    selections: { path: '/choices' },
                    options: [
                        { label: { literalString: 'One' }, value: '1' },
                        { label: { literalString: 'Two' }, value: '2' }
                    ],
                    maxAllowedSelections: 1
                }
            }
        });

        expect(slider('slider', numberRefPath('/rating'), 0, 10)).toEqual({
            id: 'slider',
            component: { Slider: { value: { path: '/rating' }, minValue: 0, maxValue: 10 } }
        });

        expect(dateTimeInput('date', stringRefPath('/date'), true, false, '2024-01-01', '2024-12-31')).toEqual({
            id: 'date',
            component: {
                DateTimeInput: {
                    value: { path: '/date' },
                    enableDate: true,
                    enableTime: false,
                    firstDate: '2024-01-01',
                    lastDate: '2024-12-31'
                }
            }
        });

        expect(audioPlayer('audio', stringRefLiteral('https://example.com/audio.mp3'))).toEqual({
            id: 'audio',
            component: { AudioPlayer: { url: { literalString: 'https://example.com/audio.mp3' } } }
        });

        expect(video('video', stringRefLiteral('https://example.com/video.mp4'))).toEqual({
            id: 'video',
            component: { Video: { url: { literalString: 'https://example.com/video.mp4' } } }
        });

        expect(
            timeline(
                'timeline',
                childrenExplicit(['item-1', 'item-2']),
                'vertical',
                'alternate',
                boolRefLiteral(true),
                'single',
                stringRefLiteral('item-2')
            )
        ).toEqual({
            id: 'timeline',
            component: {
                Timeline: {
                    children: { explicitList: ['item-1', 'item-2'] },
                    orientation: 'vertical',
                    alignment: 'alternate',
                    autoFollow: { literalBoolean: true },
                    laneMode: 'single',
                    currentItemId: { literalString: 'item-2' }
                }
            }
        });

        expect(
            timelineItem(
                'item-1',
                'item-1',
                stringRefLiteral('Step Started'),
                stringRefLiteral('Preparing data'),
                stringRefLiteral('2026-01-24T00:00:00Z'),
                'step',
                'running',
                'info',
                stringRefLiteral('bolt'),
                'detail',
                action('timeline.focus_item')
            )
        ).toEqual({
            id: 'item-1',
            component: {
                TimelineItem: {
                    itemId: 'item-1',
                    title: { literalString: 'Step Started' },
                    subtitle: { literalString: 'Preparing data' },
                    timestamp: { literalString: '2026-01-24T00:00:00Z' },
                    kind: 'step',
                    state: 'running',
                    severity: 'info',
                    icon: { literalString: 'bolt' },
                    contentChild: 'detail',
                    action: { name: 'timeline.focus_item' }
                }
            }
        });

        expect(
            timelineGroup(
                'group-1',
                'group-1',
                childrenExplicit(['item-1']),
                stringRefLiteral('Task Group'),
                stringRefLiteral('2 tasks'),
                boolRefLiteral(false),
                numberRefLiteral(2),
                'running'
            )
        ).toEqual({
            id: 'group-1',
            component: {
                TimelineGroup: {
                    groupId: 'group-1',
                    children: { explicitList: ['item-1'] },
                    title: { literalString: 'Task Group' },
                    summary: { literalString: '2 tasks' },
                    collapsed: { literalBoolean: false },
                    badgeCount: { literalNumber: 2 },
                    groupState: 'running'
                }
            }
        });

        expect(
            timelineLane('lane-1', 'lane-1', childrenExplicit(['item-1']), stringRefLiteral('Lane A'))
        ).toEqual({
            id: 'lane-1',
            component: {
                TimelineLane: {
                    laneId: 'lane-1',
                    children: { explicitList: ['item-1'] },
                    title: { literalString: 'Lane A' }
                }
            }
        });
    });
});
