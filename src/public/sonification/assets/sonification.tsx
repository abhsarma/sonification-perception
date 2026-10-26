import { useRef } from 'react';
import { Group, Button } from '@mantine/core';

// @ts-ignore
import { compileAudioGraph, SequenceStream, TopLevelSpec, ConfigInterface } from 'erie-web';
import { pitchPlot, pitchScales } from './erie/01-pitch';
import { geigerPlot, geigerScales } from './erie/02-geiger';
import { volumePlot, volumeScales } from './erie/03-volume';
import { durationPlot, durationScales } from './erie/04-duration';
import { playGeigerTone } from "./erie/geiger";

const AUDIO_PLOTS = {
    pitch: pitchPlot,
    tapping: geigerPlot,
    loudness: volumePlot,
    duration: durationPlot,
} as const;

const AUDIO_SCALES = {
    pitch: pitchScales,
    tapping: geigerScales,
    loudness: volumeScales,
    duration: durationScales,
} as const;

// // erie-web 1.0.3's setPlayerEvents only creates this map for the first player id
// // it sees, so playing any later stream throws "reading 'set'". Remove once fixed upstream.
// function ensureErieEventMap(playerId: string) {
//     const w = window as unknown as { ErieGlobalPlayerEvents?: Record<string, Map<string, unknown>> };
//     w.ErieGlobalPlayerEvents ??= {};
//     w.ErieGlobalPlayerEvents[playerId] ??= new Map();
// }

// Compiles a spec into a stream that is safe to pla
async function createErieStream(spec: TopLevelSpec, options: ConfigInterface = {baseUrl: import.meta.env.BASE_URL}) {
    const stream = await compileAudioGraph(spec, options) as SequenceStream;
    // ensureErieEventMap(stream.player_id);

    return stream;
}

export type Mapping = keyof typeof AUDIO_PLOTS; // "pitch" | "tapping" | "loudness" | "duration"

export default function AudioPlot({data, mapping, indicators} : {
    data: Array<number>, 
    mapping: Mapping, 
    indicators: Array<number> 
}) {
    const MIN_DATA = 0;
    const MAX_DATA = 100;

    const streamRef = useRef<SequenceStream | null>(null);

    // Both overlay streams share the same time domain/range so the marker
    // stream's events line up with the corresponding bar in the data stream.
    const sonData = data.map((y, i) => ({index: i, y}));

    
    const play = async () => {
        const spec = await AUDIO_PLOTS[mapping](sonData, indicators, [MIN_DATA, MAX_DATA]);

        const stream = await createErieStream(spec);
        streamRef.current = stream;

        await stream.prerender(); // required for the console output
        console.log(stream.queue?.queue[0].overlays);

        await stream.playQueue();
    };

    const playScales = async () => {
        const spec = await AUDIO_SCALES[mapping]([MIN_DATA, MAX_DATA]);
        const stream = await createErieStream(spec);
        streamRef.current = stream;

        const audioQueue = await stream.prerender();
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
            {/* <Button onClick={playGeigerSample} variant="light">Play Geiger Sample</Button> 
            <Button onClick={stop} variant="default">Stop</Button>*/}
            <Button onClick={playScales} variant="light">Play Scales</Button>
        </Group>
    );
}