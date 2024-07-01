# NPL Syntax

This document defines what is valid for an NPL program. If you want a more formal definition, then the language is fully
defined by the [syntax graphs](./parser/src/parser/syntaxGraphs) in the parser.

Note that this document defines the syntax. It is possible for code to be syntactically correct but semantically invalid. For 
example having multiple application definitions within a source file is not allowed, but is syntactially correct.

## Contents

- General [Comments](#comments) [Whitespace](#whitespace) [Identifiers](#identifiers) [Scope blocks](#scope-blocks)
- Program structure [Source files](#source-files) [Using](#using) [Namespace](#namespace) [Application](#application) [Enum](#enum) [Connection](#connection)
- Misc [Config](#config) [Expressions](#expressions) [Variables](#var-and-const) [Unit tests](#test)
- Routing [Messages](#message) [Network](#network) [Entry point](#network-entry-point) [Pipe](#pipe) [Route](#route) [Append](#append) [Prepend](#prepend) [Destinations](#routing-destinations) [Clear](#clear) [Capture](#capture) 
- Processing [Process](#process) [Accept](#accept) [Emit](#emit) [Clone](#clone) [Await](#await)
- Control flow - [If](#if) [Else](#else) [Elseif](#elseif) [While](#while) [For](#for)

## Comments

Comments can appear in most of the places you would expect, but this is not explicitly called out in the
syntax definitions below. NPL supports C-like comments, with `//` commenting to the end of the line, and `/*` and `*/` 
providing multi-line comments.

## Whitespace

Anywhere where a space is required, you can put one or more spaces, or tabs.

There are many places in the syntax of NPL where newline characters are significant. In these places, the newline character is not
whitespace, but has significance. In most places, where newline is not part of the syntax, newlines are treated the
same as spaces.

The linefeed character is ignored everywhere, so you can save your source files in Linux or Windows format.

## Identifiers

Identifiers are names that you give to things in your program. Identifiers are case sensitive, and comprise
letters, digits and underscores. The first letter of the identifier name can not be a digit.

You cannot use a reserved word as an identifier in places where the compiler cannot differentiate between the
two. To be safe, it is advisable to avoid using keywords as identifiers altogether to avoid confusion.

Qualified identifiers are a list of identifers separated by the decimal character.

Examples of valid identifiers are: _count person1 person_record

Examples of valid qualified identifiers are: message.id npl.scheduling.emitter

## Scope blocks

A scope block is a section of code enclosed in `{}`. Scope blocks can be nested as deeply as required. When the
compiler needs to resolve an identifier, it searches the current scope first, then the nested scopes from inside to outside.

When the outermost scope has been searched, if the identifier has not been resolved, then namespaces defined by `using`
statements are searched.

Scope blocks are not only used to define an area of code to search when resolving identifiers, they are also used to 
define blocks of code that are executed only in certain contexts. For example `if` statements can be followed by a scope
block, and the code in that block is only executed if the `if` expression evaluates to `true`.

NPL is quite strict about where the opening `{` is placed. If you are declaring something that has a scope block, 
the opening `{` must appear on the same line as the declaration.

Because of this rule, you can omit the `{}` when there are zero or one statement inside the scope block. In this case the
statement must be all on one line.

The following veriations are all valid for multiple statements:

```npl
<keyword> <identifier> {
    <statement>
    <statement>
    <statement>
}
```

```npl
<identifier> {
    <statement>
    <statement>
    <statement>
}
```

```npl
<keyword> {
    <statement>
    <statement>
    <statement>
}
```

The following veriations are all valid for a single statement:

```npl
<identifier> { <statement> }
```

```npl
<identifier> <statement>
```

The following veriations are all valid for an empty scope block:

```npl
<keyword> {}
``

```npl
<keyword> <identifier> {}
``

```npl
<keyword> {
}
``

```npl
<keyword> <identifier> {
}
``

```npl
<keyword>
``

```npl
<keyword> <identifier>
``

Note that you can never put multiple statements on one line. NPL does not use a terminator like semi-colon to separate
statements. Statements are separated by newline characters. 

## Syntax patterns

### Declarations

When declaring a new identifier, the general syntax pattern is <type> <identifier> <scope-block>

For example:

```npl
message MyMessageType {
    string field1
    string field2
}

process process1 {
    accept MessageType1 message1
    accept app.interface.MessageType2 message2
}
```

Note that the opening `{` of the <scope-block> must be on the same line as the <keyword>

Note that the `{}` is optional if you only have one statement

Note that you can not omit multiple nested pairs of `{}` on the same line, so that instead of typing

```npl
emit MyMessage {
    route {
        append process process process1
    }
}
```

You can abbrebiate it to
```npl
emit MyMessage route append process process1
```

### Scope config

When a scope block follows an identifier declaration, it can contain a `config` statement to define some
values that are configurable within that scope. See the section on configuration for more details.

For example:
```npl
namespace app {
    config {
        timeout 10
    }

    process myProcess {
        config {
            directory './data'
        }
    }
}
```

You can only include `config` statements where the scope block has a name, because otherwise there is no
way specify the runtime values for these configurations. The nesting structure of your config file must
match the structure of your source code, so for the example above, you can change the runtime configuration
with this yaml file:

```yaml
---
app
    timeout: 20
    myProcess:
        directory '~/data'
---
```

### Message instances

Message types define the characteristics of all messages of the same type, and also serve to construct a message.
Messages are similar to classes in object oriented languages, excapt that they do not define behavior (methods)
and do define context and routing.

In general <message-type> <scope-block> will create a new message. For example to define a message type,
then construct an instance of that message type, we can write:

```npl
message MyMessage {
    string field1
}

const myMessage MyMessage {
    message {
        field1 "some value"
    }
}

emit myMessage
```

Becasue of the scope block rules, this can be abbreviated to a single line when there is only one field as follows:

```npl
message MyMessage string field1

const myMessage MyMessage { 
    message field1 "some value"
}
```

You can also construct a new message as a modified copy of an existing message instance using the same syntax, but 
using a message reference in place of the message type. For example:


```npl
message MyMessage {
    string field1
    string field2
}

const message1 MyMessage {
    message {
        field1 "field1 value"
        field2 "field2 value"
    }
}

const message2 message1 {
    message {
        field1 "new field1 value"
    }
}
```

You can also construct messages from strings of JSON, for example:

```npl
message MyMessage {
    string field1
    string field2
}

const message1 MyMessage {
    json '{"field1": "value1", "field2": "value2"}'
}
```

## Source files

Each source code file can start with any number of `using` statements, including none, followed by one or more `namespace`
statements. You can put as much whitespace and comments as you like around these statements.

Using statements at the source file level apply to the whole file. Using statements can also be placed within the
namespace scope block to apply only within that scope block.

## Using
Using statements start with the reserved word `using`, followed by at least one space, then the qualified identifier for
a namespace, followed by a newline. You can not put multiple `using` statements on one line.

In the case where you put multiple `namespace` statements in one source file, you can put the `using` statements inside the
`namespace` definition to reduce the scope of where the `using` statement applies.

These are valid `using` statements:

```npl
using myapp
using some.other.namespace
using app.shared // Shared code

namespace app {
    using npl.data
}
```

## Namespace

Namespace statements start with the reserved word `namespace`, followed by at least one space, then the qualified identifier name of
the namespace, followed by a scope block. You can have whitespace between the namespace name and the opening `{` of the scope block.
Unlike many curly brace languages, in NPL you can not have newline characters before the opening `{` of the scope block.

The scope block may contain any number of `const`, `config`, `using`, `application`, `network`, `message` and `enum` statements.

These are valid `namespace` statements:

```npl
namespace app {}

namespace drivers{}

namespace app.data {
    using npl.data
}

namespace app const applicationName 'My next big thing'
```

## Application

Application statements start with the reserved word `application` followed by at least one space, then the name of the application
as an identifier. This is usually followed by a scope block, but it's also permitted to have an application placeholder with no 
scope block - in this case the application will not do anything if you run it.

When you run an NPL program, you must specify a source file that contains exactly one `application` statement. Any `application`
statements in other source files will be ignored.

When a scope block is present, it can contain a `config` statement, and any number of `connection` statements.

This is an example of valid a `application` statement:

```npl
namespace app {
    application IntegrationTest {
        config {
            url 'https://myservice.com/api'
        }

        connection npl.connection.HttpListener httpListener {
            config port 80
            ingress egress http.Router
        }
    }
}
```

## Message

Message statements start with the reserved word `message`, followed by at least one space, then the name of the message
type, followed by an optional scope block. Messages can be defined within a `namespace`, `network` or `process`. 
Messages defined within the scope block of a `namespace` can be referenced anywhere in the program. From other namespaces
you can use the fully qualified identifier, or add a `using` statement to reduce typing. Messages defined within a network
are only accessible within that network. Messages defined within a process are only accessible within that process.

If you want to define some messages so that their identifiers will be resolvable (to avoid compillation errors), but you
are not ready to define the fields of the messages yet, you can omit the scope block, and the message type will exist
with no fields. For example:

```npl
namespace app {
    message Message1
    message Message2
}
```

More typically, you will define messages with some fields, because they are marginally useful otherwise. In this case the
opening `{` for the scope block must be on the same line as the `message` keyword, and each field must be on a separate 
line. Line breaks are significant.

If your message type only has one field, then you can put the whole declaration on a single line, and omit the `{}`.

Each message field comprises an optional qualifier, the type name, and the field name identifier. These elements must be separated
by at least 1 space, but must not be separated by a line break. The optional qualifiers are `new` and `deprecated` are only
meaningful for messages defined at the `namespace` level.

The `new` qualifier makes the field required for `emit` statements and optional for read operations.

The `deprecated` qualifier makes the field accesible for `emit` statements (and required unless it has a `?` suffix) but inaccessible for read operations.

These are examples of valid `message` statements:

```npl
namespace app {
    enum RecordType {
        person
        address
    }

    message Message1 {
        RecordType type
        string id
        new string name
        date? start_date
    }

    message Message2 {
        Message1 original_message
        deprecated string[] categories
        map<string string> tags
    }

    message Message3 string theOnly field

    message Message5
}
```

The type name for each field can be:
- The qualified identifier for another message type
- The qualified identifier for an `enum` type
- One of the following reserved words: `string`, `number`, `boolean`, `date`
- Any of the above with a `?` suffix to indicate that the field is optional
- Any of the above followed by `[]` to define a list of values. This can not be combined with the `?` suffix
- `map<K V>` where `K` can be any of `string`, `number`, or `date` and `V` can be any other type name including another message type.

Note that type restrictions exist because messages are transmitted between networks, and these networks
can be vertically scaled across clusters of compute nodes. This means that messages can be serialized and
transimitted over the wire in some configurations.

When deploying an application with modifictions to the message fields, NPL is strict about whet it produces
and lienient about what it will accept. To avoid issues with modifying message definitions:
- Delete fields over two releases of the code. In the first releasea add the `deprecated` qualifier to the field. This will make all attepmts to read this field fail compillation. The field must still be initialized in `emit` statements. In the second release you can remove the field entirely.
- Add new required fields over two released of the code. In the first release add the `new` qualifier to the field. This makes the field optional on read but required on `emit`. In the second release you can remove the `new` qualifier.
- New optional fields can be added at any time without using the `new` qualifier. The `new` qualifier does not make sense on optional fields and is a compiler warning.
- To rename a field, follow the steps above to add a field with the new name and delete the original field name.
- To change the data type of a field, add a new field with the new type, then delete the field with the original type using the `new` and `deprecated` qualifiers as described above.

Note that each time you compile the application, the compiler will generate a schema version UUID and build 
this into the compiled code. When messages are transmitted over a network between compute instances, the 
schema UUID is included in the transmission so that the recieving instance can interpret the message correctly.
If an instance running your program encounters an unknown version UUID then it will send a request to the message
originator for the message schema of that version of the code so that it can interpret the message correctly.

During deployments, some instances will be using different versions of the message schema. This is 
handled automatically by the NPL runtime provided you use the `new` and `deprecated` qualifiers as
described above.

Note that messages are immutable once created, as are lists and maps, but new lists and maps can be 
very efficiently created out of existing ones. For example you can create a new list by combining two
existing lists, and the contents of the lists will not be copied.

## Network

Network statements start with the reserved word `network`, followed by at least one space, then the name of the network
as an identifier, followed by an optional scope block. Networks must be defined within a `namespace`.

If you want to define some networks so that their identifiers will be resolvable, but you are not ready to define the
behavior of the network yet, you can omit the scope block, and the network will exist with no entry points. For example:

```npl
namespace app {
    network network1
    network network2
}
```

More typically, you will define entry points, processes and pipes within the network, because they are not useful 
otherwise. In this case the opening `{` for the scope block must be on the same line as the `network` keyword.

The following statement types can be defined within the scope block of a network: `config`, `ingress`, `egress`,
`message`, `pipe` or `process`.

These are examples of valid `network` statements:

```npl
namespace app {
    network network1 {
        config {
            timeout_seconds 20
        }

        message InternalMessage {
        }

        ingress default {
        }

        egress ingress entryPoint1 {
        }

        pipe pipe1
        pipe pipe2
        process process1
        process process2
    }
}
```

## Network entry point

Network entry points are defined within the scope block of a `network`. They comprise the keyword `ingress`, `egress`
or both in either order, followed by the name of the entry point, or the reserved word `default`. This is followed by a 
scope block containing a list of the networks, processes and pipes that accept or emit messages though this entry point.

If you only have one element in the list, the scope block is allowed to be all on one line, but if you have multiple
elements, then each element must be on a separate line with the closing `}` on a line by itself.

These are examples of valid network entry point syntax:

```npl
namespace app {
    network network1 {
        ingress incomming

        egress outgoing

        egress ingress default process process1

        egress logging { 
            process process1 
            process process2
            pipe pipe1 
        }

        ingress egress input1 network network2.entrypoint1

        ingress splitEntrypoint netwoek network3
        egress splitEntrypoint network network4
    }
}
```

For entry points that are `ingress`, messages received by the entry point will be sent to the first process
or pipe in the list that knows how to process it. For entry points that are `egress`, all messages emitted
by all processes and pipes in the list will be emitted by the entry point.

When an entry point list includes networks, each network will receive a copy of each incomming message if
the entry point is an `ingress` and will forward all emitted messages from these networks if the entry point
is an `egress`.

You can not have two `ingress` entry points with the same name on the same network. You also can not have
two `egress` entry points with the same name on the same network, but you can have separate `ingress` and
`egress` definitions for the same entry point name.

Note that the entry point with the `default` reserved word in place of the entry point name is referenced
whenever the name of the network is not qualified by the entry point name. For example 
`network network1.entryPoint1` refers to `entryPoint1` on the `network1` network, and `network network1` 
refers to the default entry point for `network1`.

## Enum

Enum statements start with the reserved word `enum`, followed by at least one space, then the name of the enum
as an identifier, followed by an optional scope block. Enums must be defined within a `namespace`.

If you want to define some enums so that their identifiers will be resolvable, but you are not ready to define the
values of the enum yet, you can omit the scope block. For example:

```npl
namespace app {
    enum Enum1
    enum Enum2
}
```

The scope block of the `enum` should contain a list of identifiers separated by whitespace. This list can span 
multiple lines if it is within a scope block. If the enum values are all on one line then the scope block
is optional.

Examples of valid enum syntax:

```npl
namespace app {
    enum Enum1 value1 value2 value3

    enum Enum2 { 
        value1 
        value2 
        value3
    }
}
```

## Connection

Connection statements start with the reserved word `connection`, followed by at least 1 space, followed by
the qualified identifier of a connection type, the name of the connection (to facilitate configuration)
and a scope block. There are many connection types built into the NPL runtime, and others can be added 
from shared modules. You can not create new connection types within your NPL program, but you can write 
new connection types in TypeScript.

Connections can only be defined within an `application`, and define how your application communicates with the
the world outside of your application. This includes network ports, files, APIs, data streams, databases etc.

Connections are generic and reusable accross multiple applications. Although the `config` statement within a
`connection` scope block is optional, very few connections are useful without some configuration.

To configure different connections for different situations (for example local vs production) you can create
a source file for each situation, where each source file contains an `application` statement that is
specific to that situation. You can also add `config` statements to your application and override the
values by providing a yaml file when you run the program.

As well as configuring your connection, you also need to route messages to/from the connection to a network
entry point within your application.

To configure the messages incomming from the connection to the application, use `ingress` followed 
by the qualified identifier of the network or network entry point.

To configure the messages outgoing from the application to the connection, use `egress` followed 
by the qualified identifier of the network or network entry point.

If the qualified identifier refers to a network, then the default entry point will be used.

You can also combine `ingress` and `egress` in the same statement.

These are examples of valid `connection` statements:

```npl
namespace app {
    application IntegrationTest {
        config {
            url 'https://myservice.com/api'
        }

        connection npl.io.HttpListener httpListener {
            config port 80
            ingress egress http.router
        }

        connection npl.scheduling.Emitter emitter { 
            ingress network1
        }

        connection npl.io.ConsoleLogger consoleLogger egress network2.entryPoint1
    }
}
```

## Config

Config statements start with the reserved word `config`, followed by a scope block defining the configuration values.
Any values defined in the config blocks in your code can be overriden by supplying a yaml file when you run the program.
These config definitions can appear in any named scope block. Scope blocks with no names (such as `if` statements) cannot
have config because there is no way to refer to them in a yaml file.

You can also use `config` in an expression to refer to configuration values. The syntax for this usage is `config.<name>`
where <name> is the name of a configuration value.

When you are defining configuration values, the scope block must contain a list of name value pairs. If you only have one
config value, then the statement can be all on one line. For multiple values, each name/value pair must be on a separate
line.

The name and value must be separated by at least one space. The name must be an identifier and must be unique within the
scope block, but bear in mind if your code refers to a config value that is not found in the current scope, the compiler 
will search outward through the nested scopes to resolve the name.

The value part is a constant expression that must be able to be evaluated at compile time. This usually means that it
is a literal. The literal can be a string, date, number or boolean. It can also be an array or map of any of these types.

For the most part, you define any config values you like in `config` statements. The other use case for the config statement
case where you are supplying the config for a `connection`. In this case you define the `config` with the same
syntax, and these configs can still be overriden by a config yaml file, but this configures the connection, and must 
conform the the connections expectations for what can be configured. Connection configuration can be defined in the 
configuration yaml file that is passed on the command line, regardless of whether you added a config definition or not
in your application.

These are examples of valid config statements and expressions

```npl
namespace app {
    config {
        delay 10
        text 'It\'s going great'
        enabled true
        tenants [
            'tenant1'
            'tenant2'
            'tenant3'
        ]
    }

    network network1 {
        config timeout 20

        process process1 {
            accept empty {
                for tenant of config.tenants {
                    emit MyMessage { 
                        message {
                            tenant tenant
                            text config.text
                            timeout config.timeout
                        }
                    }
                }
            }
        }
    }

    application myApp {
        connection npl.scheduling.Emitter emitter { 
            config {
                interval 1000
                count 10
            }
            ingress network1
        }
    }
}
```

## Process

A process statement starts with the reserved word `process` within a `network` scope block, and is followed by at least 
one space, then the name of the process. If you just want to declare the process name, you can stop 
here, or you can add a scope block to define how the process handles messages. If defining the process, the opening 
`{` must be on the same line as the `process` reserved word.

A process must be defined within the scope block of a `network` definition.

A process definition comprises any number of `config`, `const`, `message`, `accept` and `test` statements as defined below.

These are valid `process` statements:

```npl
namespace app {
    network hello {
        process responder {
            message DebugMessage {
                string text
            }

            accept DebugMessage debugMessage {
                emit console.Text {
                    message text debugMessage.text
                }
                emit logger.Info {
                    message text debugMessage.text
                }
            }

            accept * {
                emit DebugMessage message text 'Hello, world'
            }

            test 'should emit console text' {
                emit empty
                expect console.Text {
                    message { text 'Hello, world' }
                }
            }
        }

        process process2
        process process3
    }
} 
```

Note that when you `emit` a message that is defined within the `process`, that message is not routed, because the message
is meaningless outside of this process. The `accept *` syntax will not handle messages that are defined within the `process`.

## Pipe

Pipe statements start with the reserved word `pipe` within a `network` scope block. The `pipe` reserved word must be followed
by at least one space, then the pipe name identifier. Pipe names must be unique within a network. If you just want to declare 
the pipe name, you can stop here, or you can add a scope block to define the pipe. If defining the pipe, the opening `{` must 
be on the same line as the `pipe` reserved word.

A pipe must be defined within the scope block of a `network` definition.

A pipe definition comprises any number of `route` statements within its scope block as defined below.

These are valid `pipe` statements:

```npl
namespace app {
    network http {
        pipe router {
            route httpListener.HttpRequest {
                append process logger
            }
        }
        pipe pipe2
        pipe pipe3
    }
}
```

## Route

There are two types of `route` statement, one that can be used within the scope block of a `pipe` and another that can be used
within the `accept` scope block of a process. In general you should try to keep all of your routing within pipes so that
processes can be fully reusable.

### Pipe routes

Within a `pipe`, route statements start with the reserved word `route`. The `route` reserved word must be followed by at least
one space, then the qualified identifier name of a `message` type, a `*` or the reserved word `empty`. This must be followed
by a `{` to start the scope block. The `{` must be on the same line as the `route` reserved word.

Pipe routing statements are always in the context of a message type, and the fields of this message can be referred to in your code 
using the syntax `message.<field-name>` where `message` is a reserved word, and <field-name> is the name of a field defined 
within the message.

Additionally, if the message field is another message, then you can use `.` separators to traverse the hierarchy. If the message
field is an array or map, then you can index the elements of the array or map with `<field-name>[<index>]`. The index can be a 
number, date or a string for maps, and must be a number for arrays.

For example:
```npl
pipe myPipe {
    route Query {
        if message.language == 'GraphQL' {
            prepend process graphQlProcess
        }
        else {
            prepend process sqlProcess
        }
    }
}
```

### Process routing

You are strongly encouraged to perform all message routing logic in pipes, but we do allow routing changes to be
made within a process to support edge cases.

Within the `accept` block of a `process`, route statements start with the reserved word `route`. The `route` reserved word must
be followed by at least one space, then a message identifier. This must be followed by a `{` to start the scope block. The `{` 
must be on the same line as the `route` reserved word.

For example:
```npl
process myProcess {
    accept Query query {
        emit query language 'SQL' // Emit a clone of `query` with language field changed to `SQL`
        route query clear // Clear the route for the incomming message to supress any further processing
    }
}
```

### Routing statements

Inside the route scope block you can use the following reserved words. These are defined in sections below:

- `append` to add destinations to the end of the message's route.
- `prepend` to add destinations to the begining of the message's route.
- `clear` to delete all destinations from the message's route.
- `capture` to re-route messages that are emitted during the processing of this message.
- `remove` to delete specific destinations from the message's route.
- `if`, `elseif` and `else` to add conditional routing logic. The conditional scope block is syntactically identical to the scope block of the `route`.
- `while` and `for` to repeat routing logic. The loop's scope block is syntactically identical to the scope block of the `route`.

Note that this document only defines the syntax. Details of how to use these statements is contained in the [Language Handbook](./LANGUAGE.md)

## Expressions

There are various places throughout the syntex definition where you can put an expression. This section defines the syntax of 
those expressions.

Note that their are two types of expression, those that are evaluated each time the code is executed, and those that are
evaluated once only at program startup to initialize the configuration. Expressions that initialize configuration are referred
to as constant expressions. Both types have the same syntax, but constant expressions can only reference literal values or
other constant expressions.

Expression syntax in NPL is very similar to [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators) with the following exceptions:
- There are no functions, so function pointers and lambda expressions are not supported.
- Data structures are immutable, so there are no pre/post increment and decrement operators.
- Object syntax is not supported. You can not write `{ x: 1, y: 2 }` expressions.
- Since there are no objects in NPL, there is no `new`, `this`, or `super` operator.
- There is no object destructuring support in NPL, but you can use the spread operator `...` to initialize a message, list or map
with data from another message, list or map.
- NPL does not have a concept of `null`. Messages with optional fields can contain the value `undefined` as per JavaScript.

NPL has some additional reserved words that can be used in expressions as follows:

- `config.<field-name>` can be used to refer to a configured simple value.
- `config.<field-name>[<index>]` can be used to refer to a configured array element or map value.
- `<message-reference>.message.<field-name>` can be used to access the data fields associated with a message reference.
- `<message-reference>.context.origin.<field-name>` can be used to access the origin context associated with a message reference.
- `<message-reference>.context.message.<field-name>` can be used to access the message context associated with a message reference.
- `<message-reference>.context.network.<field-name>` can be used to access the network context associated with a message reference.

### Message expressions

Whenever the value of an expression is expected to be a message, you can either construct a message using the message type
identifier, or using an identifier that refers to a message instance, followed by a scope block.

For example the `emit` keyword emits a message from a process. This keyword must be followed by an expression that is a message.
If you already have an identifier that refers to a message, you can put that identifier after the `emit` keyword to emit that
message, or you can write an expression that consuructs a new message instance.

To construct a message entirely from scratch, use the message type identifier followed by a scope block as follows:

```npl
message MyMessageType {
    string name
}

process myProcess {
    accept * {
        emit MyMessageType {
            message {
                name 'This is my name'
            }
        }
    }
}
```

To construct a message as a modified copy of an existing message instance, use the message reference followed by a scope block as follows:

```npl
message MyMessageType {
    string name
}

process myProcess {
    accept MyMessageType myMessage {
        emit myMessage {
            message {
                name 'Updated name'
            }
        }
    }
}
```

You can also construct messages and assign them to `var` or `const` identifiers, for example:

```npl
message MyMessageType {
    string name
}

process myProcess {
    accept * {
        const response MyMessageType {
            message {
                name 'This is my name'
            }
        }
        emit response
    }
}
```

When messages are constructed, you can also specify a route and a context for the message using the `route` and
`context` keywords respectively. Additionally there are 3 types of context (more fully described elsewhere) that
can be specified with the keywords `message`, `network` and `origin`. This is an example of a fully defined message:

```npl
const response MyMessageType {
    message {
        name 'This is my name'
        id 'ABC87987275'
    }
    route {
        clear
        append network dataAccessLayer
    }
    context {
        message {
            field1 value1
            field2 value2
        }
        origin {
            field1 value1
            field2 value2
        }
        network {
            field1 value1
            field2 value2
        }
    }
}

```

### Literal values

When you put a literal value into an expression, the following formats are accepted:

- **number** literals use the same format as most programming languages. Like JavaScript, NPL does not differentiate between
integer and floating point numbers in the source code, but does recognise the underlying type at runtime. All of the 
following are valid: `123`, `+123`, `-123`, `+123.45`, `-123e-3`.

- **strings** literals can be enclosed in single quotes, double quotes or back ticks. To embed a quote into a string
delimited with the same quote character, prefix the quotation mark with `\`. To add `\` to a string you need to put 
two `\\` characters. The `\` can also be used to add control characters in the usual way, so `"\n"` is a string 
containg a newline character. Similarly you can use `\r`, `\t` and `\f`. All string types support multi-line strings,
but single and double quotes trim additional spaces after a newline character and back tick delimited strings are verbatim.

- **date** literals are rare in code, but maybe useful in unit tests. For places where you need them, date variables
can be initialized with a string that conforms to RFC 3339.

- **boolean** literals must use the reserved words `true` and `false`.

- **lists** can be initialized with a list of expressions enclosed in square brackets and separated by newline charaters.
Each expression must be on a separate line.

- **maps** can be initialized with a list of key/value pairs enclosed in a scope block. Each pair must be on
a separate line, and the key must be separated from the value by at least one space. If the key is an expression
then it must be enclosed in `()`.

Note that strings with single and double quotes support string interpolation where `${<expression>}` is replaced by the
result of the evaluating the expression, and `%NAME%` is replaced by the value of an environment variable. Strings 
delimited with back ticks are not interpolated, but used verbatim, including newlines and whitespace.

For example:

```npl
namespace app { 
    network network1 {
        message Message1 {
            number aNumber
            string aString
            boolean aBoolean
            date aDate
            string[] aList
            map<string number> aMap
        }

        process process1 {
            accept * {
                emit Message1 {
                    message {
                        aNumber 34.6
                        aBoolean true
                        aDate "2023-08-16T09:00Z"
                        aList {
                            "Element 0"
                            'Element 1'
                            "Element 2"
                        }
                        aMap {
                            "some key" 12
                            ("hello" + "world") 96.2
                        }
                    }
                }
            }
        }
    }
}
```

### Function calls

NPL does not allow you to define functions (or methods) in your application, instead of function calls you should `emit`
a request message and `await` for a response.

The NPL runtime is JavaScript, and it comes with a framework that does provide many essential functions, so calling these
in necessary for NPL to be useful. For example functions that split and join strings are necessary to write useful programs.

The syntax for function calls in many languages is to enclose a comma separated list in `()` brackets. I considered doing this
for NPL, and the `,` symbol is not designated for any other purpose, but this would make the function call statement have a different
look and feel from the rest of the language (which uses line breaks to separate items). Finally, I decided to use the `()` to denote
a function call, but separate the parameters with line breaks. A concequence of this desicion is that function calls loog a 
bit odd when embedded into an expression, and I recommend separating the function call into a statement that assigns the
result of the function call to a `const` or `var`.

Wheras it's valid to write:

```npl
if request.path.substring(
        1
        8
    ) == 'invoice' {
    // do something for invoice case
}
```

I think it is more readable written like this:

```npl
const isInvoice request.path.substring(
        1
        8
    ) == 'invoice'
if isInvoice {
    // do something for invoice case
}
```

In function calls you need a line break after each parameter value. When there are no parameters you can use `()` as follows:

```npl
const now = Date.now()
```

### The spread operator

Similar to TypeScript, the `...` operator will efficiently copy an existing data structure when you are constructing a new
one. This is necessary because NPL is a functional language and all data is immutable. In NPL you can declare local stack-based 
variables and mutate their values, but you can not modify the body of a message, map or list after construction.

Note that the spread operator can be very efficient even for large structures, because everything is immutable. It's never
necessary to do a deep copy on immutable data structures. If I make a new list that comprises all the elements of two existing
lists, my new list just has to reference the two existing lists, and no actual copying takes place.

For example, to extend an existing list:

```npl
const weekdays [
    'Monday'
    'Tuesday'
    'Wednesday'
    'Thursday'
    'Friday'
]

const weekendDays [
    'Saturday'
    'Sunday'
]

const days [
    ...weekdays
    ...weekendDays
]
```

Note that for lists, if both lists contain the same value then this value will appear twice in the combined list.
For maps, you can't have two entries with the same key, so maps that are merged later will hide keys from maps that are
merged earlier. For example:

```npl
const map1 {
    'key1' 'value1'
    'key2' 'value2'
}

const map2 {
    ...map1
    'key2' 'newValue2'
}
```

Results in `map2` having `key1` equal to `value1` and `key2` equal to `newValue2`.

If you want to build a list or map itteratively, it's efficient to use the spread operator in a loop. For example:

```npl
const originalList queryResult.rows

var filteredList []
for row of rows {
    if row['date'] > startDate {
        set filteredList [
            ...filteredList
            row
        ]
    }
}
```

The spread operator can also be used with messages, in which case it "copies" by reference the fields of an existing
message into the new message being constructed where the field names and data types match. You can also use the `...`
operator to initialize the fields of a message from a map.

For example:

```npl
message Address {
    string addressLine1
    string addressLine2
    string city
    string postalCode
    string country
}

const addressFields {
    ('addressLine' + 1) "Address line 1"
    ('addressLine' + 2) "Address line 2"
}

const shippingAddress Address {
    ...addressFields
    city 'Some city'
}

```

## Accept

Accept statements must be inside the scope block of a `process`, and define a message type that the process can accept
and process. The statement consists of the `accept` reserved word, a message type and an optional identifier separated
by spaces, followed by a scope block that defines how to process these messages.

The message type can be the qualified identifier for a message type, the reserved word `empty` or `*`. The empty message
is a special message type that has no fields but does have context and routing. Putting a `*` for the message type
means that the process can accept messages of any type.

You cannot have two `accept` statement within a process for the same message type, each `accept` must be for a distinct
type of message. Within the scope block you can refer to the fields of this message with `<message-identifier>.<field-name>`
if you included an optional identifier.

Note that the `empty` message has no fields, so it only makes sense to include the optional message identifier if you want to
access the `context` or `route` of the message. Using a `*` allows you to define processing for all other message types
(not captured by any other `accept` statement). In this case `<message-identifier>.<field-name>` are not checked by the 
compiler, and accessing fields that don't exist on the message will return `undefined`.

Inside the accept scope block you can use the following reserved words. These are defined in other parts of this document:

- `const` to define a local immutable value to store intermediate results from expressions.
- `var` to define a local mutable value to store intermediate results from expressions.
- `emit` to emit a message from the process.
- `await` to suspend processing until a response to your `emit` is received.
- `route` to change the route associated with a message instance.
- `if`, `elseif` and `else` to add conditional processing logic. The conditional scope block is syntactically identical to the scope block of the `accept`.
- `while` and `for` to repeat processing logic. The loop's scope block is syntactically identical to the scope block of the `accept`.

The following is an example of a process that can process any kind of message:

```npl
process dateAppender {
    accept * someMessage{
        var dateText someMessage.text + ' ' + date().toString()
        emit Response { 
            message text dateText
        }
    }
}
```

## Emit

Emit statements start with the reserved word `emit` followed by at least one space, then an expression that
evaluates to a message.

Emit statements can only exist within the scope blocks of `accept` or `test` statements.

Very often, the expression after the `emit` statement is an expression that constructs a new message. You can
consutruct a message from scratch using the message type identifier followed by a scope block that initializes
the message, or you can use a message instance followed by a scope block to clone an existing message modifying
some of its properties along the way.

Inside the scope block you can have three further scope blocks. The `message` scope block defines the fields of
the message to emit, the `context` scope block optionally adjusts the context of the new message, and the `route`
scope block optionally defines how the message should be routed. Note that `route` should be used sparignly, as
routing is supposed to happen within pipes so that processes are fully reusable.

Inside the `message` scope block should be a list of the fields of the message on separate lines. As usual in
NPL, if there is only one field it can be all on one line, otherwise the fields must be separated by line breaks.

Each field definition is in two parts separated by spaces. The first part can be either the identifier name of a 
field, or the `...` operator and a message reference. The second part is an expression that is evaluated to provide
the value for that field.

The message reference can be any identifier that refers to a message, and can be the identifier from the
`accept` statement, an identifier associated with an `await` statement, a `var` or `const` that contains a message
reference, or a field within any message that is itself a message.

Inside the `context` scope block you can set the context of the new message. By default new messages will inherit
the origin and network context of the message that is being processed, i.e. the message type defined by the `accept` 
statement. In a lot of cases this is sufficient and no `context` block is needed.

The `context` scope block supports three further scope blocks inside of it `origin`, `network` and `message`. These
scope blocks behave like `map<string string>` but have specific lifecycles.

The `origin` context of a message can only be set when a message is created, and defaults to the `origin` context
of the message being processed. The origin context contains information that should be preseved thoughout the
processing of a request, for example the JWT and Trace ID for the request.

The `message` context of a message can be initialized when the message is emitted, and can be subsequently mutated 
as the message is processed. If you don't initialize the message context then it will be an empty `map` with no fields
and any expressions that reference the message context will evaluate to `undefined`.

The `network` context of a message is for information that should remain attached to the messages as long as it
a memory pointer, but gets stripped off the message when it is transmitted over the wire to another compute instance.
To achieve consistent behavior in different configurations, the `network` context is stripped off messages when they
transition between networks even on the same machine. Network context is useful for large amounts of immulatable state
where copying the pointer is cheap but serializing it over a wire would be expensive.

These are examples of valid `emit` statements:

```npl
emit empty

emit empty {
    context {
        origin process 'MyProcess'
    }
}

emit MyMessage {
    message field1 'New value'
}

emit MyMessage {
    message {
        field1 10
        field2 20
    }
}

accept Message1 message1 {
    await Message3 message3

    emit message3 {
        message {
            ...message1 // Copies all fields from accepted message
            taxPercent message3.taxRate * 100
            maxCount config.maxCount
        }
        context {
            message {
                dateEmitted Date.now()
                tenant message3.tenantName
            }
            origin {
                processName "My process"
            }
            network {
                tenantConfig messag3.tenantConfig
            }
        }
    }
}
```

## If

The `if` reserved word can be used within a `route` or `accept` scope block. The reserved word `if` must be 
followed by at least 1 space, then an expression, and a scope block. The statements inside the scope block
are only executed if the expression is truthy (as defined by JavaScript). The opening `{` of the scope
block must be on the same line as the expression.

This syntax is illustrated by these valid examples:

```npl
    const isUxPath message.path.startsWith(
        '/ux'
    )
    if  isUxPath {
        append {
            process logger
            pipe uxRouting
        }
    }

    if (message.path == '/ux') {
        append process logger
    }

    if myBooleanVariable {
        clear
        if message.verb == 'POST'
            append { process logger }
    }
```

## Else

An `else` statement must follow an `if` or an `elseif` statement within a `route` or `accept` scope block.

The `else` statement has a scope block containg instructions to execute if the preceeding `if` condition is falsy.

## Elseif

The `elseif` statement is a shorthand way of coding a seriese of conditional statements without excessive nesting.

These two code blocks are funtionally identical:

```npl
if a {
    // Do something
}
else {
    if b {
        // Do something
    }
}

```

```npl
if a {
    // Do something
}
elseif b {
    // Do something
}

```

## While

While statements are syntactially the same as `if` statements defined above, but instead of executing the code in the 
scope block just once if the expression is truthy, the `while` statement repeats the code inside the scope block until 
the expression is falsy.

This is an example of a valid `while` statement

```npl
var x 10
while x > 0 {
    emit MyMessage message index x
    set x x-1
}
```

## For

The `for` statement will enumerate the elements of a list or map. There are two types of `for` statement, one that
enumerates the keys and another that enumerates the values. These are the same as the options in TypeScript, and use
the same `for <index-variable> in <collection> {}` to enumerate indexes, and `for <value-variable> of <collection> {}`
to enumerate the values.

This is an example of a valid `for` statement:

```npl
config {
    tenants [
        'tenant1'
        'tenant2'
    ]
}

for tenant of config.tenants {
    emit MyMessage { 
        message {  
            theTenant tenant
        }
    }
}
```

## Append

The `append` reserved word can be used within the scope block of a `route`, and adds new destinations to the end
of the route for the message that is being routed. This extends the current route, adding new destinations to
visit after the current route has been exhausted.

You can only have `append` statements within the scope block of a `route` statement. They affect the message
that is currently being routed.

The keyword `append` should be followed by a scope block containing a list of routing destinations (see below).
If there are multiple destinations, then each one must be on a separate line. If you have only one destination
then the statement can be all on one line.

Note that including multiple destinations is equivalent to multiple append statements, so that the following
two route statements are functionally equivalent:

```npl
namespace app {
    network myNetwork {
        route * {
            append {
                process process1
                process process2
                process process3
            }
        }
    }
}

namespace app {
    network myNetwork {
        route * {
            append process process1
            append process process2
            append process process3
        }
    }
}
```

## Prepend

The `prepend` reserved word can be used within the scope block of a `route`, and adds new destinations to the beginning
of the route for the message that is being routed. This adds new destinations to send the message before anything
that is currently in the message's route.

You can only have `prepend` statements within the scope block of a `route` statement. They affect the message
that is currently being routed.

The keyword `prepend` should be followed by a scope block containing a list of routing destinations (see below).
If there are multiple destinations, then each one must be on a separate line. If you have only one destination
then the statement can be all on one line.

Note that including multiple destinations is equivalent to multiple prepend statements, so that the following
two route statements are functionally equivalent:

```npl
namespace app {
    network myNetwork {
        route * {
            prepend {
                process process1
                process process2
                process process3
            }
        }
    }
}

namespace app {
    network myNetwork {
        route * {
            prepend process process1
            prepend process process2
            prepend process process3
        }
    }
}
```

## remove

The `remove` reserved word can be used within the scope block of a `route`, and removes destinations from the 
route of the message that is being routed. The specified destinations will be removed from the route nomatter
where they are in the routing list.

You can only have `remove` statements within the scope block of a `route` statement. They affect the message
that is currently being routed.

The keyword `remove` should be followed by a scope block containing a list of routing destinations (see below).
If there are multiple destinations, then each one must be on a separate line. If you have only one destination
then the statement can be all on one line.

## Routing destinations

Routing destinations are defined within the scope block of a `prepend`, `append` or `remove` statement, and 
define a place where the message will be sent to. Each destination starts with the keyword `process`, `pipe` 
or `network` followed by at least one space, and an identifier. As expected, if you use the `process` reserved 
word, then the identifier must refer to a `process` identifier etc.

For a process or pipe, the identifier must ne the name of a process or pipe within the same network. You cannot
route messages directly to something internal to another network.

For a network, the identifier can reference a network or a network entry point. If the identifier is the name
of a network, then the `default` entry point is assumed. The compiler tries to resolve the network identifier
in the current namespace first, then searches nameapaces referenced in any `using` statements in reverse order,
then accends the namespace hierarchy to broader and broader scope until the network name is found.

For example:

```npl
using namespace1
using namespace2.namespace3

namespace namespace4 {
    network myNetwork {
        route * {
            append {
                network anotherNetwork.entryPoint1
            }
        }
    }
}
```

When the compiler resolves the name `anotherNetwork.entryPoint1` is will first look in `namespace4`, but if it is not
found here, then it will look in `namespace2.namespace3` and finally it will look in `namespace1`.

The `using` statements are examined in reverse order, because each `using` establishes a new identifier scope nested
inside of the current scope.

You can also specify the network identifier explicitly using the fully qualified name as follows:

```npl
using namespace1
using namespace2.namespace3

namespace namespace4 {
    network myNetwork {
        route * {
            append { 
                network namespace1.anotherNetwork.entryPoint1
            }
        }
    }
}
```

In which case the `using` statements are not required.

## Clear

The reserved word `clear` can be used in the scope block of a `route` statement, and clears the
routing table for the message. After clearing the routing table, the message will not be procesed any
further by the application unless the `clear` statement is followed by a `append` or `prepend` to establish
a new route

## Capture

The `capture` keyword is used to add a capture instruction to a message. You can only use this statement 
within the scope block of a `route` statement. Capture instructions set up routing for messages that are 
emitted during the processing of the messaging that we are routing.

Every message has a route attached to it. The route comprises a list of destinations, a global capture list
and a capture list associated with each destination on the route. When a message is processed by a
destination, the capture lists are used to modify the routes of any messages that are emitted during processing.
Emitted messages are compared to the capture list associatd with the destination first, then the global capture list.

The capture lists are effectively a map of message type and route. If the message type in the capture list
matches the type of the emitted message, then the route from the capture list will be applied to the newly emitted
message as follows:

1. Whenever a process constructs a new message, the new message initially has copy of the route from the message that
the process is processing, including any global or destination specific captures that are defined for that route.

2. The route is ammended by routing statements within the message constructor. If these routing statements include
a `clear` statement, this resets the route to empty, and removes any captures that are destination specific. Note that
the `clear` statement will not delete global captures - more on this below.

3. The route is ammended by applicable captures. These captures can also `clear` the route and define a new route for
the newly constructed message. Destination specific captures are applied before global captures.

The emitted message is now processed according to the resulting route.

### Global capture

The global capture list for a message is initialized with an entry that matches all message types, and routes the
message back to the originator of the message that is being processed. This means that if you don't use any `capture`
statements, then emitted messages will be routed to the process, or connection that emitted the original
message.

This is helpful because if my process emits a message requesting some data, by default anything emitted 
whilst processing that message will come back to me. This is frequently what we want, but the `capture`
reserved word can change this.

To add to the global capture list for a message, use the `capture` keyword like this:

```npl
pipe dataAccess {
    route * {
        capture GraphQlRequest {
            clear
            prepend network graphQl
        }
    }
}
```

This code means that for all messages routed to the `datAccess` pipe, add an entry to the global capture
list of the message saying that any `GraphQlRequest` messages that are emitted during its
processing should be sent only to the `graphQl` network's default entry point.

To unpack this a little, `route * {}` sets up a routing rule in the pipe for all other message 
types not explicitly routed, where the contents of the scope block defines how to modify the 
message's routing.

The `capture GraphQlRequest {}` part means add a new entry in the global capture list for messages of
type `GraphQlRequest`, or replace the existing one. The code inside the scope block defines 
how to modify the routing table of any `GraphQlRequest` messages that are emitted during processing
of the original message that we are routing.

Inside this scope block we have `clear` then `prepend network graphQl` which deletes the contents
of the routing table entirely, then adds just one destination `network graphQl`, routing all emitted
`GraphQlRequest` messages to `network graphQl` and nowhere else.

Note that any `capture` statement replaces and existing global capture for the same message type, so
you can delete an existing capture with a new one that does nothing like this:

```npl
pipe dataAccess {
    route * {
        capture GraphQlRequest // Do nothing with emitted GraphQlRequest messages
    }
}
```

Note that you can also `capture *` to define emit capturing for all other message types. This
capture statement will be used for all other types of message that are not explicitly captured.


### Destination capture

As well as a global capture list for the route, there can also be a capture list for every destination
on the route. These can only be set up when the destination is added to the route. This is accomplished
using the same `capture` statement described above after the `append` or `prepend` reserved word.

For example if we change the previous example to:

```npl
pipe dataAccess {
    route * {
        append { 
            process myProcess {
                capture GraphQlRequest {
                    clear
                    prepend network graphQl
                }
            }
        }
    }
}
```

This means for all messages routed to the `dataAccess` pipe, append `myProcess` to the list of destinations, 
and if `myProcess` emits a `GraphQlRequest` then route it to `network graphQl`.

Note that in this example if any other processes along the route emits a `GraphQlRequest` then it
will not be affected by this capture, because the capture is specific to the `process myProcess` destination.

You may heve noticed that append and prepend statements can have capture statements within them, and 
capture statements have append and prepend within them, so these can be nested to any depth. This is
true, but deeply nested capture statements can be very difficult to understand and debug, so this is
strongly discouraged.

If a message is emitted that matches a destination capture rule and a global capture rule, the destination
rule is executed first, and the global rule afterwards. For this reason you should be very careful about
adding global capture rules that `clear` the route. This cascade exists for the following scenario:

Assume that we want to send all database queries to the data access layer, and we define this as a global
capture rule on all messages entering a network. Assume that we also want to log queries that are emitted
by a specific process, and we set this up as a destination specific capture rule by prepending the logging
process to the route. In this case we want any database queries emitted to go to the logger, but we also
want them to go to the data access layer for processing. This is why destination specific captures and global
captures are both applied to emitted messages.

As with global captures, you can also remove destination specific captures by adding a `capture` with an empty
scope block.

## Clone

Anywhere where a message reference is expected, you can follow the message reference with a scope block
to create a mutated clone of the message. Messages are immutable, but you can make a new message that is 
mostly copied from an existing message, and has some fields with new values.

You can also create a copy of another message's data with the `...` spread operator, but this only copies the
data fields, whereas cloning also copies the context and route.

The example below accepts a `Message1` type message and emits a clone of this message with value of `field3`
changed to the value `96`. The `emit` is followed by a route clear, that deletes the routing information
from the original incomming `Message1` so that it is not routed any further.

```npl
process process1 {
    accept Message1 message1 {
        emit message1 {
            message {
                field3 96
            }
        }
        route message1 clear
    }
}
```

The example below starts processing a `Message1`, then waits for a `Message2` to be recieved, then emits a copy
of `message2` with one of the fields copied from `message1`.


```npl
process process1 {
    accept Message1 message1 {
        await Message2 message2
        emit message2 message field3 message1.field3
    }
}
```

## Await

You can use an `await` statement in a process scope block to suspend processing until a particular combination
of messages have been received.

Note that you can only `await` messages that were received in response to messages that were emitted by this
process so that the processing context is preserved. Every message contains an internal reference to the execution
context in which the message was emitted. The `await` statement waits for a message to be received that has the
same execution context, then continues processing.

NPL applications are designed to process millions of messages concurrently. If your application emits a message
in the context of processing a specific message, and awaits a response, then the response will be processed
in the context of the message that was being processed when the request was emitted. This is what the `await`
reserved word is for.

The `await` keyword should be followed by a scope block containing pairs of message type and identifier. Each
pair must be on a separate line unless you only have one. The message type and the identifier must be separated
by at least one space. The identifier can be used further down your code to refer to the message that was
received.

The await will suspend execution until any one of these message types are received. To
suspend processing until all of these messages are received, use multiple `await` statements.

For example:

```npl
namespace app {
    network invoiceLogic {
        process taxCalculator {
            accept Invoice invoice {
                emit data.GraphQlRequest {
                    message { 
                        query "{ tenant(id: $tenantId)\n{ taxRate\n}\n}"
                        params { 
                            'tenantId' invoice.tenantId
                        }
                    }
                }
                await { 
                    data.GraphQlResponse response
                    Error error
                }
                if response {
                    emit invoice {
                        taxRate response['tenant']['taxRate']
                    }
                    route invoice { clear }
                }
            }
        }
    }
}
```

In this example the `taxCalculator` process accepts an `Invoice` message, executes a GraphQL query to retrieve
the tax rate to apply, then emits a clone of the invoice with this tax rate included in the invoice. This is
a very typical use case for the `await` keyword.

Note that the `await` statement waits for either a `data.GraphQlResponse` message or an `Error` message, 
and will continue processing when either of these is emitted whilst processing this specific `data.GraphQlRequest`
message.

## Var and Const

Sometimes you need to use the result of evaluating an expression multiple times. To avoid evaluating the
expression more than once, you can assign the retult to a variable or constant. The only difference between
`var` and `const` is that the compiler will report an error if you try to reassign the `const` value, and it
will not perform this check on `var`.

The keyword `const` or `var` is followed by an identifier and an optional expression. This must be all on one 
line, and the keyword, identifier and expression must be separated by at least 1 space.

The type of the variable is determined by the type of the expression, so the expression is required. Literal values
are distinguishable by syntax. The reserved words `true` and `false` denote a boolean value, string delimiters (single
quote, double quote and back tick) denote a string value, digits denote a number value, a qualified identifier
followed by `{` denote a message, `{}` without a preceeding identifier denote a `map` and `[]` denotes a list. Anything
else is an expression.

To subsequently update the value of a `var` you must use the `set` statement. For example:

```npl
var x 10
while x  > 0 {
    // do something
    set x x-1
}
```

The syntax of set statements is the reserved word `set` followed by at least one space, then the name of the
variable followed by at least one space, followed by an expression to evaluate.

## Test

The `test` reserved word introduces a unit test, and can only be used within a `process` scope block. Unit tests
test the functionallity of the process that they are contained within. When you ask NPL to run unit tests, these
unit tests are compiled into the code, otherwise the compiler skips over them and produces no output. This
means that the size of your production application will not be impacted by the number of tests that you
write.

Unit testing in NPL is rather simple because of the nature of the language. Since processes are self-contained
and stand-alone with no direct dependencies on anything else, you don't need to mock dependencies as you might
in other languages.

NPL processes simply accept messages and emit messages in response. The unit tests are the opposite, emitting
the messages that the process can accept, and expecting the messages that the process emits in response. These
are defined with the `emit` and `expect` reserved words within the `test` scope block.

Below is an example of a process that performs simple arithmetic and has some unit tests:

```npl
namespace app {
    enum Operation add subtract multiply divide

    message MathQuestion {
        number a
        number b
        Operation operation
    }

    message MathAnswer {
        number answer
    }

    network math {
        ingress egress mathQuestions process doMath

        process doMath {
            accept MathQuestion question {
                if question.operation == Operation.add {
                    emit MathAnswer message answer question.a + question.b
                }
                elseif question.operation == Operation.subtract {
                    emit MathAnswer message answer question.a - question.b
                }
                else {
                    emit Exception message text `Unknown math operation ${question.operation}`
                }
            }

            test 'should add numbers' {
                emit MathQuestion {
                    message {
                        a 12
                        b 20
                        operation Operation.add
                    }
                }
                expect MathAnswer {
                    message {
                        answer 32
                    }
                }
            }

            test 'should subtract numbers' {
                emit MathQuestion {
                    message {
                        a 12
                        b 20
                        operation Operation.subtract
                    }
                }
                expect MathAnswer {
                    message {
                        answer -8
                    }
                }
            }

            test 'should error on unknown operation' {
                emit MathQuestion {
                    message {
                        operation Operation.multiply
                    }
                }
                expect Exception {
                    message {
                        text 'Unknown math operation multiply'
                    }
                }
            }
        }
    }
}
```
