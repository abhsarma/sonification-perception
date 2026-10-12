import { useState, useMemo, useEffect, useRef } from 'react';
import { Center, Stack, Text, Group, Button } from '@mantine/core';
import { range } from 'd3-array';
import BarPlot from './barplot';
import AudioPlot from './sonification';
import { StimulusParams } from '../../../store/types';

export default function Task({parameters}: StimulusParams<{ taskid: string, mapping: string, prop: number }>) {
    const prop = 0.5
    const n = 5;

    const { data, indicators } = useMemo(() => {
        // generate a random sequence of numbers
        const data = [35, 80, 10, 40, 65];
        
        // replace S and L with the respective indices
        // using the indicators array
        // indicators is not sorted, so whether S or L appears first is random
        const indicators = [1, 3];
        const prop = 0.5;

        return { data, indicators };
    }, []); // fixed per trial mount

    const exampleMapping = "pitch"

    return (
        <Stack style={{ width: '100%', height: '100%' }}>
            <h3 className="trialHeader">Training</h3>
            <Text>
                In this study, you will be presented with a sonification of a dataset. The dataset comprises of five data points, with values ranging between zero and 100. You will be asked to compare the values of two of the data points. The values that you are supposed to compare will be marked by a distinct sound before they are played.
            </Text>
            <Center>
                <BarPlot data={data} indicators={indicators} />
            </Center>
            <Center>
                <AudioPlot data={data} mapping={exampleMapping} indicators={indicators} />
            </Center>
            <Text>
                In the previous sonification, the markers were played before the second and fourth data points. Thus, you need to compare the pitch for the second and fourth data points.
            </Text>
        </Stack>
    );
}