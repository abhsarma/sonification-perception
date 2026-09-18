import { useState, useMemo, useEffect, useRef } from 'react';
import { Center, Stack, Text, Group, Button } from '@mantine/core';
import { range } from 'd3-array';
import BarPlot from './barplot';
import AudioPlot from './sonification';
// import Result from './responseFeedback';
import { StimulusParams } from '../../../store/types';
import { useNextStep } from '../../../store/hooks/useNextStep';

export default function Task({setAnswer, answers, parameters}: StimulusParams<{ taskid: string, r1: number; r2: number, vis: string, index: number}>) {
    // const [result, setResult] = useState<string | null>(null);

    const trialIndex = 1;
    const prop = parameters.prop / 20;
    const n = 5;
    const n_distractors = n - 2;

    const { data, indicators } = useMemo(() => {
        const arr = range(n);
        const L = prop > 0.5 ? Math.round(Math.random() * 100) : Math.round((Math.random()/2 + 0.5) * 100);
        const S = L * prop;

        // generate a random sequence of numbers
        const data = arr.map(() => Math.round(Math.random() * 100));
        
        // replace S and L with the respective indices
        // using the indicators array
        // indicators is not sorted, so whether S or L appears first is random
        const indicators = [...arr].sort(() => 0.5 - Math.random()).slice(0, 2);
        data[indicators[0]] = S;
        data[indicators[1]] = L;

        return { data, indicators };
    }, []); // fixed per trial mount

    return (
        <Stack style={{ width: '100%', height: '100%' }}>
            <h3 className="trialHeader">Trial number:<span id="task-index"> {trialIndex}</span></h3>
            <Center>
                <BarPlot data={data} indicators={indicators} />
            </Center>
            <Center>
                <AudioPlot data={data} indicators={indicators} />
            </Center>
        </Stack>
    );
}