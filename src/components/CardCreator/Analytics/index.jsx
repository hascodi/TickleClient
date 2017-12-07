import React from 'react';
import { appleStock } from '@vx/mock-data';
import { Group } from '@vx/group';
import { scaleTime, scaleLinear } from '@vx/scale';
import { AreaClosed } from '@vx/shape';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { LinearGradient } from '@vx/gradient';
import * as d3 from 'd3';

const data = appleStock;

const x = d => new Date(d.date);
const y = d => d.close;

// Bounds

export default ({ width, height, closeHandler }) => {
  const margin = {
    top: 0,
    bottom: 10,
    left: 40,
    right: 20
  };
  const offsetY = 100;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom - offsetY;

  const xScale = scaleTime({
    range: [0, xMax],
    domain: d3.extent(data, x)
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, d3.max(data, y)]
  });

  return (
    <div>
      <h2>Analytics</h2>
      <button className="close mr-2" onClick={closeHandler}>
        <i className="fa fa-window-close fa-lg" aria-hidden="true" />
      </button>
      <svg width={width} height={height}>
        <LinearGradient from="#fbc2eb" to="#a6c1ee" id="gradient" />
        <Group top={margin.top} left={margin.left}>
          <AreaClosed
            data={data}
            xScale={xScale}
            yScale={yScale}
            x={x}
            y={y}
            fill={'url(#gradient)'}
            stroke={''}
          />

          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />

          <AxisBottom
            scale={xScale}
            top={yMax}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />
        </Group>
      </svg>
    </div>
  );
};
