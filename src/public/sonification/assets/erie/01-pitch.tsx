import { TopLevelSpec } from 'erie-web';

const SCALE_TONE = "sine"
const MARKER_TONE = "hithat"
const MIN_PITCH = 500;
const MAX_PITCH = 3000;
const range = [MIN_PITCH, MAX_PITCH];

export function pitchPlot(sonData: Array<{index: number, y: number}>, markerData: Array<{index: number}>, domain: Array<number>) {
    const timeLength = sonData.length;

    const timeDomain: [number, number] = [0, sonData.length - 1];
    // subtracting `offset` from index 0 could lead to a time before the stream starts so push the range out
    const timeRange: [number, number] = [1, timeLength + 1];

    const spec: TopLevelSpec = {
        config: { skipStartSpeech: true },
        overlay: [
            {
                name: 'data',
                data: { values: sonData },
                tone: {type: SCALE_TONE, continued: false},
                encoding: {
                    time: {
                        field: 'index',
                        type: 'quantitative',
                        scale: {domain: timeDomain, range: timeRange, length: timeLength, description: 'skip'},
                    },
                    duration: { value: .5 },
                    pitch: {
                        field: 'y',
                        type: 'quantitative',
                        scale: {
                            domain: domain,
                            range: range,
                            band: 1,
                            polarity: 'positive',
                            singleTappingPosition: 'middle',
                            title: 'y',
                            description: 'skip'
                        }
                    }
                }
            },
            {
                name: 'marker',
                data: { values: markerData },
                tone: {type: MARKER_TONE, continued: false},
                encoding: {
                    time: {
                        field: 'index',
                        type: 'quantitative',
                        scale: {domain: timeDomain, range: timeRange, length: timeLength, description: 'skip'},
                    },
                    duration: { value: 0.5 },
                    loudness: { value: 0.4 }
                }
            }
        ],
        ordering: [{
            specifier: { role: 'sound', stream: { index: 0 } },
            notify: { beforePlay: false, afterPlay: false }
        }]
    } as unknown as TopLevelSpec;

    return spec
}

export function pitchScales(value: number, domain: Array<number>) {
    const data = [{index: 0, y: value}];

    const spec: TopLevelSpec = {
        config: { skipStartSpeech: true },
        data: { values: data },
        tone: {type: SCALE_TONE, continued: false},
        encoding: {
            time: {
                field: 'index',
                type: 'quantitative',
                scale: {length: 1, description: 'skip'},
            },
            pitch: {
                field: 'y',
                type: 'quantitative',
                scale: {
                    domain: domain,
                    range: range,
                    polarity: 'positive',
                    description: 'skip'
                }
            }
        },
        ordering: [{
            specifier: { role: 'sound', stream: { index: 0 } },
            notify: { beforePlay: false, afterPlay: false }
        }]
    } as TopLevelSpec;

    return spec
}
