import { useState, useMemo, useEffect, useRef } from 'react';
import { Center, Stack, Text, Group, Button } from '@mantine/core';
import { range } from 'd3-array';
import BarPlot from './barplot';
import AudioPlot from './sonification';
import { StimulusParams } from '../../../store/types';

export default function Task({parameters}: StimulusParams<{ taskid: string, mapping: string, prop: number }>) {
    const prop = 0.5
    const n = 5;

    const { dataA, dataB, dataC, dataD, indicators } = useMemo(() => {
        // generate a random sequence of numbers
        const dataA = [1, 100];
        const dataB = [10, 20];
        const dataC = [70, 100];
        const dataD = [21, 70];
        
        const propB = 0.5;
        const propC = 0.5;
        const propD = 0.5;


        // replace S and L with the respective indices
        // using the indicators array
        // indicators is not sorted, so whether S or L appears first is random
        const indicators: any[] = [];

        return { dataA, dataB, dataC, dataD, indicators};
    }, []); // fixed per trial mount

    const exampleMapping = "pitch"

    return (
        <Group>
            <Stack style={{ width: '100%', height: '100%' }}>
                <h3 className="trialHeader">Training</h3>
                <Text>
                    In this study, you will be presented with a sonification of a dataset. The dataset comprises of five data points, with values ranging between zero and 100. You will be asked to compare the values of two of the data points. The values that you are supposed to compare will be marked by a distinct sound before they are played.
                </Text>
                <AudioPlot data={dataA} mapping={exampleMapping} indicators={indicators} />
                <Text>
                    The data values in the previous sonification were 1 and 100 respectively. These are the minimum and maximum values (and thus pitch) that you will be hear.
                </Text>
                <Text>
                    In this study, you will be asked to estimate the ratio of the sound encoding the smaller value to the sound encoding the larger value as a percentage. For instance, take the following sonification
                </Text>
                <AudioPlot data={dataB} mapping={exampleMapping} indicators={indicators} />
                <Text>
                    The data values in the previous sonification were 10 and 20. The ratio of the smaller value (10) relative to the larger value (20) is 0.5. Thus, the answer we are looking for is 50%.
                </Text>
                <AudioPlot data={dataC} mapping={exampleMapping} indicators={indicators} />
                <Text>
                    The data values in the previous sonification were 70 and 100. The correct answer is 70%.
                </Text>
                <AudioPlot data={dataD} mapping={exampleMapping} indicators={indicators} />
                <Text>
                    The data values in the previous sonification were 21 and 70. The correct answer is 30%.
                </Text>
            </Stack>
        </Group>
    );
}