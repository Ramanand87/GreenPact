import React from 'react';
import ReactFlow, { Controls } from 'react-flow-renderer';

const nodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Login/Register' },
    position: { x: 250, y: 0 },
    className: 'node-animation',
  },
  {
    id: '2',
    data: { label: 'Home' },
    position: { x: 250, y: 100 },
    className: 'node-animation',
  },
  {
    id: '3',
    data: { label: 'Key Features' },
    position: { x: 100, y: 200 },
    className: 'node-animation',
  },
  {
    id: '4',
    data: { label: 'FlowChart' },
    position: { x: 250, y: 200 },
    className: 'node-animation',
  },
  {
    id: '5',
    data: { label: 'Documents' },
    position: { x: 400, y: 200 },
    className: 'node-animation',
  },
  {
    id: '6',
    data: { label: 'Contracts' },
    position: { x: 100, y: 300 },
    className: 'node-animation',
  },
  {
    id: '7',
    data: { label: 'Reviews' },
    position: { x: 250, y: 300 },
    className: 'node-animation',
  },
  {
    id: '8',
    data: { label: 'Payments' },
    position: { x: 400, y: 300 },
    className: 'node-animation',
  },
  {
    id: '9',
    data: { label: 'Your crops' },
    position: { x: 250, y: 400 },
    className: 'node-animation',
  },
  {
    id: '10',
    data: { label: 'Hashboard/Profit' },
    position: { x: 100, y: 500 },
    className: 'node-animation',
  },
  {
    id: '11',
    data: { label: 'Help&Support' },
    position: { x: 250, y: 500 },
    className: 'node-animation',
  },
  {
    id: '12',
    data: { label: 'Market' },
    position: { x: 400, y: 500 },
    className: 'node-animation',
  },
  {
    id: '13',
    data: { label: 'All crops' },
    position: { x: 250, y: 600 },
    className: 'node-animation',
  },
  {
    id: '14',
    data: { label: 'Chat' },
    position: { x: 400, y: 600 },
    className: 'node-animation',
  },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e4-7', source: '4', target: '7' },
  { id: 'e5-8', source: '5', target: '8' },
  { id: 'e7-9', source: '7', target: '9' },
  { id: 'e9-10', source: '9', target: '10' },
  { id: 'e9-11', source: '9', target: '11' },
  { id: 'e9-12', source: '9', target: '12' },
  { id: 'e12-13', source: '12', target: '13' },
  { id: 'e12-14', source: '12', target: '14' },
];

function FlowChart() {
  return (
    <div className="w-full h-screen bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        className="animate-fade-in"
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowChart;