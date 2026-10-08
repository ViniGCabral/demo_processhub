import xml.etree.ElementTree as ET
import json
import re

file_path = r'c:\Users\ViniciusCabral\OneDrive - EloGroup\Documentos\Processhub\ProcessHub_Demo\Ingest\cadastro-de-conta-bancaria-macro.bpmn'
tree = ET.parse(file_path)
root = tree.getroot()

ns = {
    'bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
    'bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
    'dc': 'http://www.omg.org/spec/DD/20100524/DC',
    'di': 'http://www.omg.org/spec/DD/20100524/DI'
}

process = root.find('bpmn:process', ns)
plane = root.find('.//bpmndi:BPMNPlane', ns)

phases = []
elements = []
connections = []

# Phases
lane_set = process.find('bpmn:laneSet', ns)
if lane_set is not None:
    for lane in lane_set.findall('bpmn:lane', ns):
        lane_id = lane.get('id')
        lane_name = lane.get('name')
        shape = plane.find(f".//bpmndi:BPMNShape[@bpmnElement='{lane_id}']", ns)
        if shape is not None:
            bounds = shape.find('dc:Bounds', ns)
            phases.append({
                'id': lane_id,
                'label': lane_name,
                'y': float(bounds.get('y')),
                'height': float(bounds.get('height')),
                'color': '#E3F2FD'
            })

# Elements
node_types = [
    {'tag': 'bpmn:startEvent', 'type': 'start-event', 'fill': '#C8E6C9', 'stroke': '#388E3C'},
    {'tag': 'bpmn:endEvent', 'type': 'end-event', 'fill': '#FFCDD2', 'stroke': '#C62828'},
    {'tag': 'bpmn:userTask', 'type': 'task', 'fill': '#E3F2FD', 'stroke': '#1976D2'},
    {'tag': 'bpmn:exclusiveGateway', 'type': 'gateway-exclusive', 'fill': '#FFF9C4', 'stroke': '#F57F17'},
    {'tag': 'bpmn:boundaryEvent', 'type': 'intermediate-event', 'fill': '#FFECB3', 'stroke': '#FF8F00'}
]

for nt in node_types:
    for node in process.findall(nt['tag'], ns):
        node_id = node.get('id')
        node_name = node.get('name', '')
        shape = plane.find(f".//bpmndi:BPMNShape[@bpmnElement='{node_id}']", ns)
        if shape is not None:
            bounds = shape.find('dc:Bounds', ns)
            if bounds is not None:
                elements.append({
                    'id': node_id,
                    'type': nt['type'],
                    'x': float(bounds.get('x')),
                    'y': float(bounds.get('y')),
                    'width': float(bounds.get('width')),
                    'height': float(bounds.get('height')),
                    'label': node_name,
                    'fillColor': nt['fill'],
                    'strokeColor': nt['stroke']
                })

# Connections
for flow in process.findall('bpmn:sequenceFlow', ns):
    connections.append({
        'id': flow.get('id'),
        'type': 'sequence-flow',
        'sourceId': flow.get('sourceRef'),
        'targetId': flow.get('targetRef'),
        'sourcePoint': {'x': 0, 'y': 0},
        'targetPoint': {'x': 0, 'y': 0},
        'label': flow.get('name', '')
    })

data = {
    'phases': phases,
    'elements': elements,
    'connections': connections
}

json_str = json.dumps(data, indent=2)

ts_file = r'c:\Users\ViniciusCabral\OneDrive - EloGroup\Documentos\Processhub\ProcessHub_Demo\src\data\bpmnData.ts'
with open(ts_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the span-layer object
pattern = re.compile(r'("span-layer":\s*\{)[\s\S]*?(^\s*\},)', re.MULTILINE)
def repl(match):
    return match.group(1) + '\n' + json_str[1:-1] + '\n  },'

new_content = re.sub(pattern, repl, content)

with open(ts_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done replacing span-layer in bpmnData.ts")
