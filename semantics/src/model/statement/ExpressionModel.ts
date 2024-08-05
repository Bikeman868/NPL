import { IToken } from "npl-syntax";
import { RouteStatementModel } from "./RouteStatementModel.js";

export type LiteralField = {
    comments: string[];
    fieldName: string;
    fieldValue: ExpressionModel;
}

export type MessageLiteralExpression = {
    messageType: string;
    fields: LiteralField[];
    originContext: LiteralField[];
    networkContext: LiteralField[];
    messageContext: LiteralField[];
    route: RouteStatementModel[];
}

export type MapLiteralExpression = {
    fields: LiteralField[];
}

export type ListLiteralExpression = {
    values: ExpressionModel[];
}

export type MathExpression = {
    tokens: IToken[];
}

export type ExpressionModel = {
    expressionType: 'message' | 'map' | 'list' | 'math';
    expression: 
        MessageLiteralExpression | 
        MapLiteralExpression | 
        ListLiteralExpression | 
        MathExpression;
}