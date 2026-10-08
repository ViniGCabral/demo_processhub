import fs from 'fs';
const xml = fs.readFileSync('Ingest/cadastro-de-conta-bancaria-macro.bpmn', 'utf-8');
const escapedXml = xml.replace(/`/g, '\\`');
fs.writeFileSync('src/data/bpmnXmlData.ts', 'export const cadastroContaBancariaXml = `' + escapedXml + '`;');
