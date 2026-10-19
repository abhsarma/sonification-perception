import { TopLevelSpec } from 'erie-web';

const SCALE_TONE = "triangle"
const MARKER_TONE = "hithat"
const MIN_TAPS = 1;
const MAX_TAPS = 100;
const range = [MIN_TAPS, MAX_TAPS];
const STEP_SECONDS = 5;
// length of the tapping window for each value; the remaining STEP_SECONDS - TAP_SECONDS is silence
const TAP_SECONDS = STEP_SECONDS - 1;
const offset = 0.5;

export function tapPlot(
    sonData2: Array<{index: number, y: number}>, 
    markerIndex: Array<number>, 
    domain: Array<number>
) {
    let sonData = [1, 100, 2, 5, 2].map((d, i) => ({index: i, y: d}));
    console.log(sonData.map(d => d.y));
    const timeLength = sonData.length;

    const timeDomain: [number, number] = [0, sonData.length - 1];
    // subtracting `offset` from index 0 could lead to a time before the stream starts so push the range out
    const timeRange: [number, number] = [1, 1 + STEP_SECONDS * (timeLength - 1)];

    // shared by both the single-stream and overlay cases, so changes only need to be made here
    const dataStream = {
        data: { values: sonData },
        tone: {type: "click", continued: false},
        encoding: {
            time: {
                field: 'index',
                type: 'quantitative',
                scale: {domain: timeDomain, range: timeRange, length: timeLength, description: 'skip'},
            },
            // tapSpeed range is in taps/second and band is the tapping window (s), so
            // #taps = speed * band; dividing the domain by the window makes #taps == y
            tapSpeed: {
                field: 'y',
                type: 'quantitative',
                scale: {
                    domain: domain,
                    range: domain.map(d => d / TAP_SECONDS),
                    band: TAP_SECONDS,
                    title: 'y',
                    description: 'skip',
                    pauseRate: 0.5
                }
            }
        },
        "sampling": [
            {
                "name": "click",
                "sample": {
                    "mono": "https://cdn.pixabay.com/audio/2022/03/09/audio_76595fcf48.mp3"
                }
            }
        ]
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

export function tapScales(value: number, domain: Array<number>) {
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