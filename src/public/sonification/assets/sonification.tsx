import { useRef } from 'react';
import { Button } from '@mantine/core';
import { compileAudioGraph, SequenceStream, TopLevelSpec } from 'erie-web';

// Deliberately outside PITCH_DOMAIN so the marker tone is always distinguishable
// from a real data point; Erie clamps it to the top of PITCH_RANGE.
const MARKER_PITCH = -20;


export default function AudioPlot({data, indicators} : {data: Array<number>, indicators: Array<number> }) {
    const streamRef = useRef<SequenceStream | null>(null);

    // Erie's conditional encoding isn't wired up for pre-recorded (non-streaming)
    // specs, so the marker tone is added as its own row placed right before the
    // indicator's row, rather than as a condition on the pitch channel.
    let acc: number = 0;
    const sonData = data.flatMap((y, i) => {
        const isIndicator = indicators.includes(i);
        const rows: {index: number, type: string, y: number}[] = [];
        if (isIndicator) {
            rows.push({index: i + acc, type: 'signal', y: MARKER_PITCH});
        }
        acc = isIndicator ? acc + 0.5 : acc;
        rows.push({index: i + acc, type: 'data', y});
        return rows;
    });

    const play = async () => {
        const spec: TopLevelSpec = {
            data: { values: sonData },
            tone: {type: 'sine', continued: false},
            config: { skipStartSpeech: true },
            encoding: {
                time: {
                    field: 'index',
                    type: 'quantitative',
                    scale: {length: 5, description: 'skip'},
                },
                duration: {
                    field: "type",
                    type: "nominal",
                    scale: {
                        domain: ["data", "signal"],
                        range: [0.5, 0.05],
                        description: "skip"
                    }
                },
                timbre: {
                    field: "type",
                    type: "nominal",
                    scale: {
                        domain: ["data", "signal"],
                        range: ["sine", "triangle"],
                        description: 'skip'
                    }
                },
                pitch: {
                    field: 'y',
                    type: 'quantitative',
                    scale: {
                        domain: [-20, 0, 100],
                        range: [3000, 220, 2000],
                        band: 1,
                        polarity: 'positive',
                        singleTappingPosition: 'middle',
                        title: 'y',
                        description: 'skip'
                    }
                }
            },
            ordering: [{
                specifier: { role: 'sound', stream: { index: 0 } },
                notify: { beforePlay: false, afterPlay: false }
            }]
        } as TopLevelSpec;

        const stream = await compileAudioGraph(spec, {}) as SequenceStream;
        streamRef.current = stream;

        const audioQueue = await stream.prerender();
        console.log(audioQueue.queue);
        await stream.playQueue();
    };

    const stop = async () => {
        await streamRef.current?.stopQueue();
    };

    return (
        <Button.Group>
            <Button onClick={play}>Play</Button>
            <Button onClick={stop} variant="default">Stop</Button>
        </Button.Group>
    );
}