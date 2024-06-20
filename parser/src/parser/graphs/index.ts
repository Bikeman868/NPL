import {
    buildKeywordParser,
} from '../stateMachine/SyntaxParser.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';

/* 
    This source file defines all of the syntax graphs used by the parser
    so that the graphs can reference each other without circular references
    in cases where the syntax is recursively nested
*/

export const parseIngressKeyword = buildKeywordParser(['ingress'], 'Keyword');
export const parseEgressKeyword = buildKeywordParser(['egress'], 'Keyword');
export const parseConstKeyword = buildKeywordParser(['const'], 'Keyword');
export const parseEmitKeyword = buildKeywordParser(['emit'], 'Keyword');
export const parseEmptyKeyword = buildKeywordParser(['empty'], 'Keyword');
export const parseEnumKeyword = buildKeywordParser(['enum'], 'Keyword');


export const applicationConnectionGraphBuilder = new GraphBuilder('connection');
export const applicationGraphBuilder = new GraphBuilder('application');
export const configGraphBuilder = new GraphBuilder('config');
export const configFieldGraphBuilder = new GraphBuilder('config-field');
export const constGraphBuilder = new GraphBuilder('const');
export const dataTypeGraphBuilder = new GraphBuilder('data-type');
export const destinationGraphBuilder = new GraphBuilder('destination');
export const destinationListGraphBuilder = new GraphBuilder('destination-list');
export const emitGraphBuilder = new GraphBuilder('emit');
export const enumGraphBuilder = new GraphBuilder('enum');
export const eolGraphBuilder = new GraphBuilder('eol');


export const applicationConnectionGraph = applicationConnectionGraphBuilder.build();
export const applicationGraph = applicationGraphBuilder.build();
export const configGraph = configGraphBuilder.build();
export const configFieldGraph = configFieldGraphBuilder.build();
export const constGraph = constGraphBuilder.build();
export const dataTypeGraph = dataTypeGraphBuilder.build();
export const destinationGraph = destinationGraphBuilder.build();
export const destinationListGraph = destinationListGraphBuilder.build();
export const emitGraph = emitGraphBuilder.build();
export const enumGraph = enumGraphBuilder.build();
export const eolGraph = eolGraphBuilder.build();
