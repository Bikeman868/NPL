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

Note that comments can appear in most of the places you would expect, but this is not explicitly called out in the
stntax definitions below, because it would be an optional comment element between every other element of the syntax.
NPL supports C-like comments, with `//` commenting to the end of the line, and `/*` and `*/` providing multi-line comments.

Note that this document defines the syntax. It is possible for code to be syntactically correct but structurally invalid. For example having multiple application definitions within a source file is structurally invalid but syntactially correct.

## Source code files

Each source code file must conform to the following syntax.

_source-file_ = [_whitespace_] _using_* _namespace_?

_using_ = `using` _separator_ qualified-identifier_ _new-line_ [_whitespace_]

_namespace_ = `namespace` _separator_ _qualified-identifier_ _open-scope_ _namespace-definition_ _close-scope_ [_whitespace_]

_namespace-definition_ = (_whitespace_ | _application_ | _network_ | _message_ | _enum_)*

## Namespace Type Definitions

_application_ = `application` _separator_ _identifier_ [_open-scope_ _application-definition_ _close-scope_] _new-line_

_message_ = `message` _separator_ _identifier_ [_open-scope_ _message-definition_ _close-scope_] _new-line_

_network_ = `network` _separator_ _identifier_ [_open-scope_ _network-definition_ _close-scope_] _new-line_

_enum_ = `enum` _separator_ _identifier_ [_open-scope_ (_identifier_ _whitespace_)* _close-scope_] _new-line_

### Application definitions

_application-definition_ = (_whitespace_ | _connection_)*

_connection_ = `connection` _separator_ _qualified-identifier_ [_separator_] [_open-scope_ _connection-definition_ _close-scope_] _new-line_

_connection-definition_ = [_config_] _entry-type_ [_separator_ _entry-type_] [_separator_ `network`] _qualified_identifier_ _new-line_

### Message definitions

_message-definition_ = (_whitespace_ | _message-field_)*

_message-field_ = _type_ _separator_ _identifier_ _new-line_

### Network and Pipe definitions

_network-definition_ = [_config_] (_whitespace_ | _entry-point_ | _process_ | _pipe_)*

_entry-point_ = _entry-type_ [_separator_ _entry-type_] [_separator_ _entry-name_] [_open-scope_ _route_ _close_scope_] _new-line_

_entry-type_ = `ingress` | `egress`

_entry-name_ = `default` | _identifier_

_process_ = `process` _separator_ _identifier_ [_open-scope_ _process-definition_ _close-scope_] _new-line_

_pipe_ = `pipe` _separator_ _identifier_ [_open-scope_ pipe-definition_ _close-scope_] _new-line_

_route_ = [_destination_] (_new-line_ _destination_)*

_destintion_ = (`process` | `pipe` | `network`) _separator_ _qualified-identifier_ [_open-scope_ _route_definition_ _close_scope_]  _new-line_

_route-definition_ = [_route-command_] (_new-line_ _route-command_)*

_route-command_ = _routing-logic_ | _prepend-command_ | _append-command_ | _clone-command_ | _clear-command_ | _remove-command_ | _capture-command_

_routing-logic_ = _routing-if_ | _routing-else_ | _routing-else-if_ | _routing-while_ | _routing-for_

_routing-if_ = `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

_routing-else-if_ = `elseif` _open_paren_ _expression_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

_routing-else_ = `else` _open-scope_ _route_definition_ _close_scope_ _new-line_

_routing-while_ = `while` _open_paren_ _expression_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

_routing-for_ = `for` _open_paren_ _identifier_ _separator_ `of` _separator_ _qualified_identifier_ _close_paren_ _open-scope_ _route_definition_ _close_scope_ _new-line_

_prepend-command_ = `prepend` _open-scope_ _route_ _close_scope_ _new-line_

_append-command_ = `append` _open-scope_ _route_ _close_scope_ _new-line_

_clear-command_ = `clear` _new-line_

_remove-command_ = `remove` _open-scope_ _route_ _close_scope_ _new-line_

_capture-command_ = `capture` _separator_ _qualified-identifer_ [_open-scope_ _route_ _close_scope_] _new-line_

_clone-command_ = `clone` _open-scope_ _route_ _close_scope_ _new-line_

_pipe-definition_ = [_config_] [_pipe-route_] (_new-line_ _pipe-route_)*

_pipe-route_ = `route` _separator_ _message-type_ [_open-scope_ _route_ _close_scope_] _new-line_

_message-type_ = `*` | `empty` | _qualified-identifier_

### Process definitions

_process-definition_ = [_config_] [_message-processing_] (_new-line_ _message-processing_)*

_message-processing_ = `accept` _message-type_ [_open-scope_ _statements_ _close-scope_] _new-line_

_statements_ = [_process-statement_] (_new-line_ _process-statement_)*

_process-statement_ = _process-logic_ | _emit-command_ | _clone-command_ | _clear-command_

_process-logic_ = _process-if_ | _process-else_ | _process-else-if_ | _process-while_ | _process-for_

_emit-command_ = `emit` _separator_ _qualified-identifier_ [_open-scope_ _message-init_ _close-scope_]

_message-init_ = (_message-data_ | _message-route_ | _message-context_)*

_message-data_ = `data` _open-scope_ [_field-value_] (_new-line_ _field-value_)* _close-scope_ _new-line_

_message-route_ = `route` _open-scope_ [_route_] (_new-line_ _route_)* _close-scope_ _new-line_

_message-context_ = `context` _open-scope_ [_field-value_] (_new-line_ _field-value_)* _close-scope_ _new-line_

_field-value_ = _identifier_ _separator_ _expression_

_process-if_ = `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

_process-else-if_ = `else` _separator_ `if` _open_paren_ _expression_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

_process-else_ = `else` _open-scope_ _statements_ _close_scope_ _new-line_

_process-while_ = `while` _open_paren_ _expression_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

_process-for_ = `for` _open_paren_ _identifier_ _separator_ `of` _separator_ _qualified_identifier_ _close_paren_ _open-scope_ _statements_ _close_scope_ _new-line_

## Config

_config_ = _whitespace_ `config` _open-scope_ [_config-value_] (_new-line_ _config-value_)* _close_scope_ _new_line_

_config-value_ = _whitespace_ _identifier_ _separator_ _constant-expression_

## Expressions

_expression_ = _constant-expression_ | _computed-expression_ | _array-expression_ | _map-expression_

_constant-expression_ = [_unary_operator_] [_open-paren_] [_unary_operator_] _constant-value_ [_whitespace_] [_binary-operator_ _separator_ _constant-expression_] [_close-paren_]

_computed-expression_ = [_unary_operator_] [_open-paren_] [_unary_operator_] _computed-value_ [_whitespace_] [_binary-operator_ _separator_ _computed-expression_] [_close-paren_]

_array-expression_ = _qualified-identifier_ _open-array_ _computed-expression_ _close-array_

_map-expression_ = _identifier_ (_decimal_ _identifier_)?

_computed-value_ = _constant-value_ | _qualified-identifier_ | _method-call_

_constant-value_ = _number_ | _string_ | _enum-value_ | _env-value_

_enum-value_ = _qualified-identifier_

_env-value_ = `%` _identifier_ `%`

_method-call_ = _qualified-identifier_ _open-paren_ [_expression_] (_comma-separator_ _expression_)* _close-paren_

_binary-operator_ = `<` | `>` | `<=` | `>=` | `==` | `!=` | `===` | `!==` | `+` | `-` | `/` | `*` | `%` | `<<` | `>>` | `|` | `||` | `&` | `&&`

## Types

_type_ = _primitive-type_ | _message-type_ | _array-type_ | _map-type_ | `any`

_primitive-type_ = `number` | `string` | `date`

_message-type_ = _qualified-identifier_

_array-type_ = _type_ _open-array_ _close-array_

_map-type_ = `map<` _primitive_type_ `,` _type_ `>`

## The small stuff

_linebreak_ = `/0x0a`

_space_ = `/0x20`

_tab_ = `/0x09`

_quote_ = `/0x27`

_decimal_ = `/0x2e`

_open-square_ = `/0x5b`

_close-square_ = `/0x5d`

_open_round_ = `/0x28`

_close_round_ = `/0x29`

_underscore_ = `/0x5f`

_alpha_ = `a` | `b` | ... | `Y` | `Z`

_numeric_ = `0` | `1` | ... | `9`

_alphanumeric_ = _alpha_ | _numeric

_number_ = (_numeric_)? [ _decimal_ (_numeric_)* ]

_string_ = _quote_ !(_quote_ | _linebreak_)* _quote_

_identifier_ = (_alpha_ | _underscore_) (_alphanumeric_ | _underscore_)*

_qualified-identifier_ = _identifier_ (_decimal_ _idendifier_)*

_whitespace_ = (_space_ | _tab_ | _linebreak_)?

_separator_ = (_space_ | _tab_)?

_new-line_ = [_whitespace_] _linebreak_ [_whitespace_]

_open-paren_ = (_space_ | _tab_)* _open_round_ (_space_ | _tab_)*

_close_paren_ = (_space_ | _tab_)* _close_round_ (_space_ | _tab_)*

_open-array_ = (_space_ | _tab_)* _open_square_ (_space_ | _tab_)*

_close_array_ = (_space_ | _tab_)* _close_square_ (_space_ | _tab_)*

_open-scope_ = [_whitespace_] `{` [_whitespace_]

_close-scope_ = [_whitespace_] `}`

_comma-separator_ = (_space_ | _tab_)* `,` (_space_ | _tab_)*
