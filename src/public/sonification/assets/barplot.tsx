import { scaleLinear, scaleBand } from 'd3-scale';
import { range } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { useCallback, useEffect, useRef } from 'react';
import { select } from 'd3-selection';

const width = 300;
const height = 300;

export default function BarPlot({data, indicators} : {data: Array<number>, indicators: Array<number> }) {
    const d3Container = useRef(null);

    const margin = {left: 0, top: 20, right: 20, bottom: 20};
    const innerHeight = height - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const createChart = useCallback(() => {
        if (data.length === 0) return;

        const xScale = scaleBand()
            .domain(range(data.length))
            .range([margin.left, innerWidth])
            .paddingInner(0.2)
            .paddingOuter(0.5);
        const yScale = scaleLinear().domain([0, 100]).range([innerHeight, margin.top]);

        const xAxis = axisBottom(xScale).tickSize(0).tickFormat(() => '');
        const yAxis = axisLeft(yScale).tickSize(0).tickFormat(() => '');

        const svg = select(d3Container.current).attr('width', width).attr('height', height);
        svg.selectAll('*').remove();

        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis);

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis);

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale(i))
            .attr('y', (d) => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d))
            .style('fill', '#fafafa')
            .style('stroke', '#333');

        // console.log(data, indicators);
        svg.selectAll('.dot')
            .data(indicators)
            .enter()
            .append('circle')
            .attr('class', 'indicator')
            .attr('cx', (d) => xScale(d) + xScale.bandwidth()/2)
            .attr('cy', yScale(0) + 10)
            .attr("r", 2)
            .style('stroke', '#333');
    }, [data, innerWidth, innerHeight]);

    useEffect(() => {
        createChart();
    }, [createChart]);

    return (
        <svg
            className="d3-component"
            width={width}
            height={height}>
            <g id="d3Stuff" ref={d3Container} />
            {/* <rect
                x={0}
                y={20}
                width={innerWidth}
                height={innerHeight}
                cursor="pointer"
                opacity={isHover ? 0.2 : 0.0}
                fill="cornflowerblue"
            /> */}
        </svg>
    );
}