# NPL Syntax

This document defines what is valid for an NPL program. The syntax is defined using the following notation:

- The syntax is a set of definitions of terms, where these terms are referenced elsewhere in the syntax. Each term is written as `term = definition`.
- Words in *italics* are the name of another term defined elsewhere in the syntax. For example *keyword* means that you must put a keyword here, where the keyword term is defined elsewhere in the syntax.
- Parentheses are used to group syntax elements. For example `!(quote)*` means anything other than a quote zero or more times.
- Parentheses or terms followed by a `?` means that you must have at least 1 but you can have more than one.
- Parentheses or terms followed by `*`  means that you can repeat this zero or more times.
- Parentheses or terms preceeded by `!` that means that you can have anything except this.
- Syntax in `[]` are optional, i.e. they can appear 0 or 1 time.
- The `|` symbol represents alternatives. You must have exactly one of the alternative forms of the syntax.
- Other symbols are literals. For example curly braces, quotes, commas etc must appear exactly as shown.
- Words not in italics are literal words in the syntax.

Note that this document defines the syntax. It is possible for code to be syntactically correct but structurally invalid. For example having multiple application definitions within a source file is structurally invalid but syntactially correct.

## Source code files

Each source code file must conform to the following syntax.

**source-file** = _using_* _namespace_?

**using** = _whitespace_ `using` _separator_ qualified-identifier_ _new-line_

**namespace** = _whitespace_ `namespace` _separator_ _qualified-identifier_ _open-scope_ _namespace-definition_ _close-scope_

**qualified-identifier** = _identifier_ (_decimal_ _idendifier_)*

**namespace-definition** = (_whitespace_ | _application_ | _network_ | _message_ | _enum_)*

## Type Definitions

**application** = `application` _separator_ _identifier_ [_open-scope_ _application-definition_ _close-scope_] _new-line_

**message** = `message` _separator_ _identifier_ [_open-scope_ _message-definition_ _close-scope_] _new-line_

**network** = `network` _separator_ _identifier_ [_open-scope_ _network-definition_ _close-scope_] _new-line_

**process** = `process` _separator_ _identifier_ [_open-scope_ _process-definition_ _close-scope_] _new-line_

**pipe** = `pipe` _separator_ _identifier_ [_open-scope_ pipe-definition_ _close-scope_] _new-line_

**enum** = `enum` _separator_ _identifier_ [_open-scope_ (_identifier_ _whitespace_)* _close-scope_] _new-line_

### Application definitions

**application-definition** = (_whitespace_ | _connection_)*

**connection** = `connection` _separator_ _qualified-identifier_ [_open-scope_ _connection-definition_ _close-scope_] _new-line_

**connection-definition** = [_config_] (`ingress` | `egress`)? _qualified_identifier_ _new-line_

### Message definitions

**message-definition** = (_whitespace_ | _message-field_)*

**message-field** = _type_ _separator_ _identifier_ _new-line_

### Network and Pipe definitions

**network-definition** = [_config_] (_whitespace_ | _entry-point_ | _process_)*

**entry-point** = _entry-type_ [_separator_ _entry-type_] [_separator_ _entry-name_] [_open-scope_ _route_ _close_scope_] _new-line_

**entry-type** = `ingress` | `egress`

**entry-name** = `default` | _identifier_

**route** = [_destination_] (_new-line_ _destination_)*

**destintion** = (`process` | `pipe` | `network`) _separator_ _qualified-identifier_ [_open-scope_ _route_definition_ _close_scope_]  _new-line_

**route-definition** = [_route-command_] (_new-line_ _route-command_)*

**route-command** = _routing-logic_ | _prepend-command_ | _append-command_ | _clone-command_ | _clear-command_ | _remove-command_ | _capture-command_

**routing-logic** = _routing-if_ | _routing-else_ | _routing-else-if_ | _routing-while_ | _routing-for_

**routing-if** = `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

**routing-else-if** = `else` _separator_ `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

**routing-else** = `else` _open-scope_ _route_definition_ _close_scope_ _new-line_

**routing-while** = `while` _open_paren_ _expression_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

**routing-for** = `for` _open_paren_ _identifier_ _separator_ `of` _separator_ _qualified_identifier_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

**prepend-command** = `route.prepend` _open-scope_ _route_ _close_scope_ _new-line_

**append-command** = `route.append` _open-scope_ _route_ _close_scope_ _new-line_

**clear-command** = `route.clear` _new-line_

**remove-command** = `route.remove` _open-scope_ _route_ _close_scope_ _new-line_

**capture-command** = `route.capture` _separator_ _qualified-identifer_ [_open-scope_ _route_ _close_scope_] _new-line_

**clone-command** = `clone` _open-scope_ _route_ _close_scope_ _new-line_

**pipe-definition** = [_config_] [_pipe-route_] (_new-line_ _pipe-route_)*

**pipe-route** = `route` _separator_ _message-type_ [_open-scope_ _route_ _close_scope_] _new-line_

**message-type** = `*` | `empty` | _qualified-identifier_

### Process definitions

**process-definition** = [_config_] [_message-processing_] (_new-line_ _message-processing_)*

**message-processing** = `accept` _message-type_ [_open-scope_ _statements_ _close-scope_] _new-line_

**statements** = [_process-statement_] (_new-line_ _process-statement_)*

**process-statement** = _process-logic_ | _emit-command_ | _clone-command_ | _clear-command_

**process-logic** = _process-if_ | _process-else_ | _process-else-if_ | _process-while_ | _process-for_

**emit-command** = `emit` _separator_ _qualified-identifier_ [_open-scope_ _message-init_ _close-scope_]

**message-init** = (_message-data_ | _message-route_ | _message-context_)*

**message-data** = `data` _open-scope_ [_field-value_] (_new-line_ _field-value_)* _close-scope_ _new-line_

**message-route** = `route` _open-scope_ [_route_] (_new-line_ _route_)* _close-scope_ _new-line_

**message-context** = `context` _open-scope_ [_field-value_] (_new-line_ _field-value_)* _close-scope_ _new-line_

**field-value** = _identifier_ _separator_ _expression_

**process-if** = `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

**process-else-if** = `else` _separator_ `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

**process-else** = `else` _open-scope_ _statements_ _close_scope_ _new-line_

**process-while** = `while` _open_paren_ _expression_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

**process-for** = `for` _open_paren_ _identifier_ _separator_ `of` _separator_ _qualified_identifier_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

## Config

**config** = _whitespace_ `config` _open-scope_ [_config-value_] (_new-line_ _config-value_)* _close_scope_ _new_line_

**config-value** = _whitespace_ _identifier_ _separator_ _constant-expression_

## Expressions

**expression** = _constant-expression_ | _computed-expression_ | _array-expression_ | _map-expression_

**constant-expression** = [_unary_operator_] [_open-paren_] [_unary_operator_] _constant-value_ [_whitespace_ _binary-operator_ _whitespace_ _constant-expression_] [_close-paren_]

**computed-expression** = [_unary_operator_] [_open-paren_] [_unary_operator_] _computed-value_ [_whitespace_ _binary-operator_ _whitespace_ _computed-expression_] [_close-paren_]

**array-expression** = _qualified-identifier_ _open-array_ _computed-expression_ _close-array_

**map-expression** = _qualified-identifier_ _open-array_ _computed-expression_ _close-array_

**computed-value** = _constant-value_ | _qualified-identifier_ | _method-call_

**constant-value** = _number_ | _string_ | _enum-value_ | _env-value_

**enum-value** = _qualified-identifier_

**env-value** = `%` _identifier_ `%`

**method-call** = _qualified-identifier_ _open-paren_ [_expression_] (_comma-separator_ _expression_)* _close-paren_


**binary-operator** = `<` | `>` | `<=` | `>=` | `==` | `!=` | `===` | `!==` | `+` | `-` | `/` | `*` | `%` | `<<` | `>>` | `|` | `||` | `&` | `&&`

## Types

**type** = _primitive-type_ | _message-type_ | _array-type_ | _map-type_ | `any`

**primitive-type** = `number` | `string` | `date`

**message-type** = _qualified-identifier_

**array-type** = _type_ _open-array_ _close-array_

**map-type** = `map<` _primitive_type_ `,` _type_ `>`

## The small stuff

**linebreak** = `/0x0a`

**space** = `/0x20`

**tab** = `/0x09`

**quote** = `/0x27`

**decimal** = `/0x2e`

**open-square** = `/0x5b`

**close-square** = `/0x5d`

**open_round** = `/0x28`

**close_round** = `/0x29`

**alpha** = `a` | `b` | ... | `Y` | `Z`

**numeric** = `0` | `1` | ... | `9`

**alphanumeric** = _alpha_ | _numeric

**punctuation** = ''

**char** = _alphanumeric_ | _punctuation_

**number** = (_numeric_)? [ _decimal_ (_numeric_)* ]

**string** = _quote_ !(_quote_ | _linebreak_)* _quote_

**identifier** = _alpha_ (_alphanumeric_)*

**whitespace** = (_space_ | _tab_ | _linebreak_)*

**separator** = (_space_ | _tab_)?

**new-line** = _whitespace_ _linebreak_ _whitespace_

**open-paren** = (_space_ | _tab_)* _open_round_ (_space_ | _tab_)*

**close_paren** = (_space_ | _tab_)* _close_round_ (_space_ | _tab_)*

**open-array** = (_space_ | _tab_)* _open_square_ (_space_ | _tab_)*

**close_array** = (_space_ | _tab_)* _close_square_ (_space_ | _tab_)*

**open-scope** = _whitespace_ `{` _whitespace_

**close-scope** = _whitespace_ `}`

**comma-separator** = (_space_ | _tab_)* `,` (_space_ | _tab_)*