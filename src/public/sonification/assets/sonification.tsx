import { useEffect, useRef, useState } from 'react';
import { Group, Button, VisuallyHidden } from '@mantine/core';

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

let isSequencePlaying = false;

export default function AudioPlot({data, mapping, indicators, label = "Play sounds"} : {
    data: Array<number>, 
    mapping: Mapping, 
    indicators: Array<number>,
    label?: string
}) {
    const streamRef = useRef<SequenceStream | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState('');

    const MIN_DATA = 0;
    const MAX_DATA = 100;

    // Both overlay streams share the same time domain/range so the marker
    // stream's events line up with the corresponding bar in the data stream.
    const sonData = data.map((y, i) => ({index: i, y}));

    useEffect(() => {
        return () => {
            streamRef.current?.stopQueue();
            // cancel erie's spoken "Stopped." (speechSynthesis)
            window.speechSynthesis?.cancel();
            setTimeout(() => window.speechSynthesis?.cancel(), 50);
            isSequencePlaying = false;
        };
    }, []);
    
    const play = async () => {
        if (isSequencePlaying) return;
        isSequencePlaying = true;
        setIsPlaying(true);
        setStatus('');

        try {
            const spec = await AUDIO_PLOTS[mapping](sonData, indicators, [MIN_DATA, MAX_DATA]);

            const stream = await compileAudioGraph(spec, {baseUrl: import.meta.env.BASE_URL}) as SequenceStream;
            streamRef.current = stream;

            const audioQueue = await stream.prerender();
            // erie-web bug: without this, only the first playback on a page works
            delete (window as any).ErieGlobalPlayerEvents;
            await stream.playQueue();
        } finally {
            isSequencePlaying = false;
            setIsPlaying(false);
            setStatus('Finished');
        }
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
            <Button onClick={play}>{isPlaying ? 'Playing' : label}</Button>
            <VisuallyHidden role="status" aria-live="polite">{status}</VisuallyHidden>
            {/* <Button onClick={playGeigerSample} variant="light">Play Geiger Sample</Button> */}
            {/* <Button onClick={stop} variant="default">Stop</Button> */
            /* <Button onClick={playMin} variant="light">Play Min</Button>
            <Button onClick={playMax} variant="light">Play Max</Button> */}
        </Group>
    );
}