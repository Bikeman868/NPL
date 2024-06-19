/**
 * Defines the possible states for the parser state machine
 */
export type StateName =
    | 'sourcefile' // Initial state and final state when parsing a file
    | 'using' // Parsing a `using <namespace>` statement
    | 'namespace' // Parsing a `namespace <name>` statement
    | 'application' // Parsing an `application <name>` statement
    | 'connection' // Parsing a `connection <qualified>` statement bringing a connection into an application
    | 'connectionEntry' // Parsing a connection ingress or egress
    | 'enum' // Parsing a `enum <name>` statement defining an enum within the namespace
    | 'message' // Parsing a `message <name>` statement defining a message within the namespace
    | 'network' // Parsing a `network <name>` statement that defines a network within a namespace
    | 'networkEntry' // Parsing `network ingress` or `netword egress`
    | 'pipe' // Parsing a `pipe <name>` defining a pipe within a network
    | 'pipeRoute' // Parsing a `route <message-type>` statement that defines message routing within a pipe
    | 'pipeRouteStatement' // Parsing an append, prepend, remove statement within a pipe route
    | 'pipePrepend' // Parsing an prepend statement within a pipe route
    | 'pipeRemove' // Parsing a remove statement within a pipe route
    | 'pipeConditionalStatement' // Parsing an if, elseif or while statement within a pipe route
    | 'pipeElse' // Parsing an else statement within a pipe route
    | 'pipeFor' // Parsing a for statement within a pipe route
    | 'process' // Parsing a `process <name>` defining a process within a network
    | 'processAccept' // Parsing an accept statement that defines the message type to process
    | 'processEmit' // Parsing an emit statement that constructs and sends a new message
    | 'processAwait' // Parsing an await statement that waits for messages to be received
    | 'processConditionalStatement' // Parsing a conditional code block
    | 'processElse' // Parsing an alternate code block
    | 'processFor' // Parsing a for loop
    | 'object' // Parsing the body of an object definition with fields and dynamic expressions
    | 'config' // Parsing the body of a config override with fields and constant expressions
    | 'expression' // Parsing an expression that is evaluated each time the code is executed
    | 'constant' // Parsing an expression that is evaluated once only at startup
    | 'test' // Parsing a unit test
    | 'testEmit' // Parsing an emit statement within a test
    | 'testExpect'; // Parsing an expect statement within a test
