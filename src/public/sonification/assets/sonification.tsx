import { useRef } from 'react';
import { Group, Button } from '@mantine/core';
import { compileAudioGraph, SequenceStream } from 'erie-web';
import { pitchPlot, pitchScales } from './erie/01-pitch';
import { tapPlot, tapScales } from './erie/02-tapping';


export default function AudioPlot({data, mapping, indicators} : {data: Array<number>, mapping: String, indicators: Array<number> }) {
    const streamRef = useRef<SequenceStream | null>(null);

    const MIN_DATA = 0;
    const MAX_DATA = 100;

    // Both overlay streams share the same time domain/range so the marker
    // stream's events line up with the corresponding bar in the data stream.
    const offset = 0.5;
    const sonData = data.map((y, i) => ({index: i, y}));
    const markerData = indicators.map((i) => ({index: i - offset}));
    

    const play = async () => {
        let spec;

        if (mapping) {
            if (mapping == "pitch") {
                spec = pitchPlot(sonData, markerData, [MIN_DATA, MAX_DATA]);
            } else if (mapping == "tapping") {
                spec = tapPlot(sonData, markerData, [MIN_DATA, MAX_DATA]);
            }

            if (!spec) return;

            const stream = await compileAudioGraph(spec, {baseUrl: '/'}) as SequenceStream;
            streamRef.current = stream;

            const audioQueue = await stream.prerender();
            console.log(audioQueue.queue);

            await stream.playQueue();
        }
    };

    const playMin = async () => {
        const spec = pitchScales(MIN_DATA, [MIN_DATA, MAX_DATA]);
        const stream = await compileAudioGraph(spec, {baseUrl: '/'}) as SequenceStream;
        streamRef.current = stream;

        // const audioQueue = await stream.prerender();
        await stream.playQueue();
    };

    const playMax = async () => {
        const spec = pitchScales(MAX_DATA, [MIN_DATA, MAX_DATA]);
        const stream = await compileAudioGraph(spec, {baseUrl: '/'}) as SequenceStream;
        streamRef.current = stream;

        // const audioQueue = await stream.prerender();
        await stream.playQueue();
    };

    const stop = async () => {
        await streamRef.current?.stopQueue();
    };

    return (
        <Group>
            <Button onClick={play}>Play</Button>
            {/* <Button onClick={stop} variant="default">Stop</Button> */
            /* <Button onClick={playMin} variant="light">Play Min</Button>
            <Button onClick={playMax} variant="light">Play Max</Button> */}
        </Group>
    );
}