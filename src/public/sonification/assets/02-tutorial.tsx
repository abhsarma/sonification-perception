import { useMemo } from 'react';
import { Center, Stack, Text, Group } from '@mantine/core';
import BarPlot from './barplot';
import AudioPlot from './sonification';
import { StimulusParams } from '../../../store/types';

export default function Task({parameters}: StimulusParams<{ taskid: string, mapping: string, prop: number }>) {
    const prop = 0.5
    const n = 5;

    const { data, dataA, dataB, dataC, dataD, indicators } = useMemo(() => {
        const data = [35, 80, 10, 40, 65];

        // generate a random sequence of numbers
        const dataA = [1, 100];
        const dataB = [10, 20];
        const dataC = [70, 100];
        const dataD = [21, 70];


        // replace S and L with the respective indices
        // using the indicators array
        // indicators is not sorted, so whether S or L appears first is random
        const indicators: any[] = [1, 3];

        return { data, dataA, dataB, dataC, dataD, indicators};
    }, []); // fixed per trial mount

    const exampleMapping = "pitch"

    return (
        <Group>
            <Stack style={{ width: '100%', height: '100%' }}>
                <h2 className="trialHeader">Tutorial</h2>
                <Text>
                    In this study, you will be presented with a sonification of a dataset. The dataset comprises of five data points, with values ranging between zero and 100. You will be asked to compare the values of two of the data points. The values that you are supposed to compare will be marked by a distinct sound before they are played.
                </Text>
                <h3 className="trialHeader">Example stimuli</h3>
                <Text>
                    Below is an example of what a sonification that would be presented to you looks like. Your task is to compare the values of two of the data points. The values that you are supposed to compare will be marked by a distinct sound before they are played.
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
                <h3 className="trialHeader">Minimum and Maximum Stimuli</h3>
                <Text>
                    The data values in the sonification below are 1 and 100 respectively. These are the minimum and maximum values (and thus pitch) that you will be hear.
                </Text>
                <AudioPlot data={dataA} mapping={exampleMapping} indicators={[]} />
                <h3 className="trialHeader">How to Compare Values: example #1</h3>
                <Text>
                    In this study, you will be asked to estimate the ratio of the sound encoding the smaller value to the sound encoding the larger value as a percentage. For instance, take the following sonification
                </Text>
                <AudioPlot data={dataB} mapping={exampleMapping} indicators={[]} />
                <Text>
                    The data values in the previous sonification were 10 and 20. The ratio of the smaller value (10) relative to the larger value (20) is 0.5. Thus, the answer we are looking for is 50%.
                </Text>
                <h3 className="trialHeader">How to Compare Values: example #2</h3>
                <AudioPlot data={dataC} mapping={exampleMapping} indicators={[]} />
                <Text>
                    The data values in the previous sonification were 70 and 100. The correct answer is 70%.
                </Text>
                <h3 className="trialHeader">How to Compare Values: example #3</h3>
                <AudioPlot data={dataD} mapping={exampleMapping} indicators={[]} />
                <Text>
                    The data values in the previous sonification were 21 and 70. The correct answer is 30%.
                </Text>
                <h3 className="trialHeader">Next: Training</h3>
                <Text>
                    Over the next four pages, you will encounter training trials. For these trials, you will be given feedback on whether the answer is correct or not.
                </Text>
            </Stack>
        </Group>
    );
}