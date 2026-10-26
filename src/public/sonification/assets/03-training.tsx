import { useEffect, useMemo } from 'react';
import { Center, Stack, Text } from '@mantine/core';
import { range } from 'd3-array';
import BarPlot from './barplot';
import AudioPlot, { Mapping } from './sonification';
import { StimulusParams } from '../../../store/types';

export default function Task({parameters}: StimulusParams<{ taskid: string, prop: number, mapping: Mapping }>) {
    const prop = parameters.prop
    const n = 5;

    const { data, indicators } = useMemo(() => {
        // generate a random sequence of numbers
        const arr = range(n);
        const L = prop > 50 ? Math.round(Math.random() * 9 + 1) * 10 : Math.round((Math.random()/2 + 0.5) * 10) * 10;
        const S = L * prop / 100;

        // generate a random sequence of numbers
        const data = arr.map(() => Math.round(Math.random() * 9 + 1)*10);

        // replace S and L with the respective indices
        // using the indicators array
        // indicators is not sorted, so whether S or L appears first is random
        const indicators = [...arr].sort(() => 0.5 - Math.random()).slice(0, 2);
        data[indicators[0]] = S;
        data[indicators[1]] = L;

        return { data, indicators };
    }, []); // fixed per trial mount

    useEffect(() => {
        console.log(indicators, data);
    }, [data, indicators]);

    return (
        <Stack style={{ width: '100%', height: '100%' }}>
            <h3 className="trialHeader">Training</h3>
            <Text>
                In the following sonification of a dataset, you will be presented with five data points, with values ranging between zero and 100. You will be asked to compare the values of two of the data points. The values that you are supposed to compare will be marked by a distinct sound before they are played. When you are ready, please play the sonification.
            </Text>
            {/* <Center>
                <BarPlot data={data} indicators={indicators} />
            </Center> */}
            <Center>
                <AudioPlot data={data} mapping={parameters.mapping} indicators={indicators} />
            </Center>
            <Text>
                <span className="questionPrompt">What percentage does the smaller value represent of the larger value. Please enter a number between 0 and 100.</span>
                <span className="requiredQuestion">*</span><br/>
                <span className="questionSecondaryText">The two values are marked by a distinct sound preceding the sound encoding.</span>
            </Text>
        </Stack>
    );
}