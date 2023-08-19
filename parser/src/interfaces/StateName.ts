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
  | 'pipeAppend' // Parsing an append statement within a pipe route
  | 'pipePrepend' // Parsing an prepend statement within a pipe route
  | 'pipeClear' // Parsing a clear statement within a pipe route
  | 'pipeCapture' // Parsing a capture statement within a pipe route
  | 'pipeRemove' // Parsing a remove statement within a pipe route
  | 'pipeIf' // Parsing an if statement within a pipe route
  | 'pipeElse' // Parsing an else statement within a pipe route
  | 'pipeElseif' // Parsing an elseif statement within a pipe route
  | 'pipeWhile' // Parsing a while statement within a pipe route
  | 'pipeFor' // Parsing a for statement within a pipe route
  | 'process' // Parsing a `process <name>` defining a process within a network
  | 'processAccept' // Parsing an accept statement that defines the message type to process
  | 'processEmit' // Parsing an emit statement that constructs and sends a new message
  | 'processAwait' // Parsing an await statement that waits for messages to be received
  | 'processIf' // Parsing a conditional code block
  | 'processElse' // Parsing an alternate code block
  | 'processElseif' // Parsing elseif
  | 'processWhile' // Parsing a while loop
  | 'processFor' // Parsing a for loop
  | 'object' // Parsing the body of an object definition with fields and dynamic expressions
  | 'config' // Parsing the body of a config override with fields and constant expressions
  | 'expression' // Parsing an expression that is evaluated each time the code is executed
  | 'constant'; // Parsing an expression that is evaluated once only at startup
