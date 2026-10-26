// @ts-ignore
import { TopLevelSpec } from 'erie-web';

const SCALE_TONE = "sine"
const MARKER_TONE = "hithat"
const MIN_PITCH = 300;
const MAX_PITCH = 3000;
const range = [MIN_PITCH, MAX_PITCH];
const TOTAL_DURATION = 2
const SOUND_DURATION = 0.5
const offset = 0.5;

export function pitchPlot(sonData: Array<{index: number, y: number}>, markerIndex: Array<number>, domain: Array<number>) {
    const timeLength = sonData.length;

    const timeDomain = [0, sonData.length - 1];
    // subtracting `offset` from index 0 could lead to a time before the stream starts so push the range out
    const timeRange = [0, sonData.length - 1].map(d => d*TOTAL_DURATION + 1);

    // shared by both the single-stream and overlay cases, so changes only need to be made here
    const dataStream = {
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
                    title: 'y',
                    description: 'skip'
                }
            }
        }
    };
    const config = { skipStartSpeech: true };
    const ordering = [{
        specifier: { role: 'sound', stream: { index: 0 } },
        notify: { beforePlay: false, afterPlay: false }
    }];

    let spec: TopLevelSpec;

    if (markerIndex.length === 0) {
        // only one dataset is being mapped to audio, so no overlay is needed
        spec = {
            config,
            ...dataStream,
            ordering
        } as unknown as TopLevelSpec;
    } else {
        const markerData = markerIndex.map(d => ({index: d * (timeRange[1] - timeRange[0])/(sonData.length - 1) + timeRange[0] - offset}));

        spec = {
            config,
            overlay: [
                { name: 'data', ...dataStream },
                {
                    name: 'marker',
                    data: { values: markerData },
                    tone: {type: MARKER_TONE, continued: false},
                    encoding: {
                        time: {
                            field: 'index',
                            type: 'quantitative',
                            scale: {domain: timeRange, range: timeRange, length: timeLength, description: 'skip'},
                        },
                        duration: { value: 0.5 },
                        loudness: { value: 0.4 }
                    }
                }
            ],
            ordering
        } as unknown as TopLevelSpec;
    }

    return spec
}

export function pitchScales(domain: Array<number>) {
    const data = domain.map((d, i) => ({index: i, y: d}));

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
