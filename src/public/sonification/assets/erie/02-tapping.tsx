import { TopLevelSpec } from 'erie-web';

const SCALE_TONE = "sine"
const MARKER_TONE = "hithat"
const MIN_TAPS = 1;
const MAX_TAPS = 25;
const STEP_SECONDS = 2; // pause between successive data points, in seconds

export function tapPlot(sonData: Array<{index: number, y: number}>, markerData: Array<{index: number}>, domain: Array<number>) {
    const timeLength = sonData.length;

    console.log(sonData, markerData);

    const range = [MIN_TAPS, MAX_TAPS];
    const timeDomain: [number, number] = [0, sonData.length - 1];
    // subtracting `offset` from index 0 could lead to a time before the stream starts so push the range out
    const timeRange: [number, number] = [1, 1 + STEP_SECONDS * (timeLength - 1)];

    const spec: TopLevelSpec = {
        config: { skipStartSpeech: true },
        overlay: [
            {
                name: 'data',
                data: { values: sonData },
                tone: {type: 'hithat', continued: false},
                encoding: {
                    time: {
                        field: 'index',
                        type: 'quantitative',
                        scale: {domain: timeDomain, range: timeRange, length: timeLength, description: 'skip'},
                    },
                    tapCount: {
                        field: 'y',
                        type: 'quantitative',
                        scale: {
                            domain: domain,
                            range: range,
                            band: 0.025,
                            polarity: 'positive',
                            singleTappingPosition: 'start',
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
                    duration: { value: 0.5  },
                    pitch: { value: 500 },
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

export function tapScales(value: number, domain: Array<number>, range: Array<number>) {
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