import { useRef } from 'react';
import { Group, Button } from '@mantine/core';

// @ts-ignore
import { compileAudioGraph, SequenceStream } from 'erie-web';
import { pitchPlot, pitchScales } from './erie/01-pitch';
import { tapPlot } from './erie/02-tapping';
import { playGeigerTone } from "./erie/geiger";

const AUDIO_PLOTS = {
    pitch: pitchPlot,
    tapping: tapPlot,
} as const;

export type Mapping = keyof typeof AUDIO_PLOTS; // "pitch" | "tapping"

export default function AudioPlot({data, mapping, indicators} : {
    data: Array<number>, 
    mapping: Mapping, 
    indicators: Array<number> 
}) {
    const streamRef = useRef<SequenceStream | null>(null);

    const MIN_DATA = 0;
    const MAX_DATA = 100;

    // Both overlay streams share the same time domain/range so the marker
    // stream's events line up with the corresponding bar in the data stream.
    const sonData = data.map((y, i) => ({index: i, y}));
    
    const play = async () => {
        const spec = await AUDIO_PLOTS[mapping](sonData, indicators, [MIN_DATA, MAX_DATA]);

        const stream = await compileAudioGraph(spec, {baseUrl: import.meta.env.BASE_URL}) as SequenceStream;
        streamRef.current = stream;

        const audioQueue = await stream.prerender();
        await stream.playQueue();
    };

    const playMin = async () => {
        const spec = pitchScales(MIN_DATA, [MIN_DATA, MAX_DATA]);
        const stream = await compileAudioGraph(spec, {baseUrl: import.meta.env.BASE_URL}) as SequenceStream;
        streamRef.current = stream;

        // const audioQueue = await stream.prerender();
        await stream.playQueue();
    };

    const playMax = async () => {
        const spec = pitchScales(MAX_DATA, [MIN_DATA, MAX_DATA]);
        const stream = await compileAudioGraph(spec, {baseUrl: import.meta.env.BASE_URL}) as SequenceStream;
        streamRef.current = stream;

        // const audioQueue = await stream.prerender();
        await stream.playQueue();
    };

    const stop = async () => {
        await streamRef.current?.stopQueue();
    };

    // plays the rendered WAV that tapPlot uses as its tap sample
    const playGeigerSample = async () => {
        playGeigerTone();
    };

    return (
        <Group>
            <Button onClick={play}>Play</Button>
            {/* <Button onClick={playGeigerSample} variant="light">Play Geiger Sample</Button> */}
            {/* <Button onClick={stop} variant="default">Stop</Button> */
            /* <Button onClick={playMin} variant="light">Play Min</Button>
            <Button onClick={playMax} variant="light">Play Max</Button> */}
        </Group>
    );
}