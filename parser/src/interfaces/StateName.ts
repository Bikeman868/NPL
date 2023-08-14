export type StateName =
  | 'sourcefile' // Initial state and final state when parsing a file
  | 'using' // Parsing a `using <namespace>` statement
  | 'namespace' // Parsing a `namespace <name>` statement
  | 'application' // Parsing an `application <name>` statement
  | 'network' // Parsing a `network <name>` statement that defines a network within a namespace
  | 'networkEntry' // Parsing `network ingress` or `netword egress`
  | 'message' // Parsing a `message <name>` statement defining a message within the namespace
  | 'enum' // Parsing a `enum <name>` statement defining an enum within the namespace
  | 'connection' // Parsing a `connection <qualified>` statement bringing a connection into an application
  | 'process' // Parsing a `process <name>` defining a process within a network
  | 'pipe' // Parsing a `pipe <name>` defining a pipe within a network
  | 'object' // Parsing the body of an object definition with fields and dynamic expressions
  | 'config' // Parsing the body of a config override with fields and constant expressions
  | 'expression' // Parsing an expression that is evaluated each time the code is executed
  | 'constant' // Parsing an expression that is evaluated once only at startup
  | 'processAccept' // Parsing an accept statement that defines the message type to process
  | 'processEmit' // Parsing an emit statement that constructs and sends a new message
  | 'pipeRoute' // Parsing a `route <message-type>` statement that defines message routing within a pipe
  | 'connectionEntry' // Parsing a connection ingress or egress
  | 'appendRoute' // Parsing an append statement within a pipe route
  | 'prependRoute' // Parsing an prepend statement within a pipe route
  | 'clearRoute' // Parsing a clear statement within a pipe route
  | 'captureRoute' // Parsing a capture statement within a pipe route
  | 'removeRoute' // Parsing a remove statement within a pipe route
  | 'ifRoute' // Parsing an if statement within a pipe route
  | 'elseRoute' // Parsing an else statement within a pipe route
  | 'elseifRoute' // Parsing an elseif statement within a pipe route;
