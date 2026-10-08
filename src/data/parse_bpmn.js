const fs = require('fs');
const xml2js = require('xml2js');

const xml = fs.readFileSync('c:/Users/ViniciusCabral/OneDrive - EloGroup/Documentos/Processhub/ProcessHub_Demo/Ingest/cadastro-de-conta-bancaria-macro.bpmn', 'utf-8');

xml2js.parseString(xml, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const process = result['bpmn:definitions']['bpmn:process'][0];
  const diagram = result['bpmn:definitions']['bpmndi:BPMNDiagram'][0]['bpmndi:BPMNPlane'][0];
  
  const elements = [];
  const connections = [];
  const phases = [];
  
  // Extract lanes/phases
  if (process['bpmn:laneSet']) {
    const lanes = process['bpmn:laneSet'][0]['bpmn:lane'];
    lanes.forEach(lane => {
      const id = lane.$.id;
      const name = lane.$.name;
      const shape = diagram['bpmndi:BPMNShape'].find(s => s.$.bpmnElement === id);
      if (shape && shape['dc:Bounds']) {
        const bounds = shape['dc:Bounds'][0].$;
        phases.push({
          id: id,
          label: name,
          y: parseFloat(bounds.y),
          height: parseFloat(bounds.height),
          color: "#E3F2FD" // default color
        });
      }
    });
  }
  
  // Extract nodes
  const nodeTypes = [
    { key: 'bpmn:startEvent', type: 'start-event', defaultColor: '#C8E6C9', stroke: '#388E3C' },
    { key: 'bpmn:endEvent', type: 'end-event', defaultColor: '#FFCDD2', stroke: '#C62828' },
    { key: 'bpmn:userTask', type: 'task', defaultColor: '#E3F2FD', stroke: '#1976D2' },
    { key: 'bpmn:exclusiveGateway', type: 'gateway-exclusive', defaultColor: '#FFF9C4', stroke: '#F57F17' },
    { key: 'bpmn:boundaryEvent', type: 'intermediate-event', defaultColor: '#FFECB3', stroke: '#FF8F00' }
  ];
  
  nodeTypes.forEach(nt => {
    if (process[nt.key]) {
      process[nt.key].forEach(node => {
        const id = node.$.id;
        const name = node.$.name || "";
        const shape = diagram['bpmndi:BPMNShape'].find(s => s.$.bpmnElement === id);
        if (shape && shape['dc:Bounds']) {
          const bounds = shape['dc:Bounds'][0].$;
          elements.push({
            id: id,
            type: nt.type,
            x: parseFloat(bounds.x),
            y: parseFloat(bounds.y),
            width: parseFloat(bounds.width),
            height: parseFloat(bounds.height),
            label: name,
            fillColor: nt.defaultColor,
            strokeColor: nt.stroke
          });
        }
      });
    }
  });
  
  // Extract connections
  if (process['bpmn:sequenceFlow']) {
    process['bpmn:sequenceFlow'].forEach(flow => {
      connections.push({
        id: flow.$.id,
        type: 'sequence-flow',
        sourceId: flow.$.sourceRef,
        targetId: flow.$.targetRef,
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 0, y: 0 },
        label: flow.$.name || ""
      });
    });
  }
  
  console.log(JSON.stringify({ phases, elements, connections }, null, 2));
});
