// Properties that all statement models have
export type Statement = {
    statementType:
        | 'append'
        | 'capture'
        | 'clear'
        | 'elseif'
        | 'else'
        | 'emit'
        | 'expect'
        | 'for'
        | 'if'
        | 'prepend'
        | 'remove'
        | 'route'
        | 'set'
        | 'var'
        | 'while';
};
