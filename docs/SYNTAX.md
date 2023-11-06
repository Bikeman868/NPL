# NPL Syntax

This document defines what is valid for an NPL program.

Note that this document defines the syntax. It is possible for code to be syntactically correct but structurally invalid. For 
example having multiple application definitions within a source file is structurally invalid but syntactially correct.

## Contents

- General [Comments](#comments) [Whitespace](#whitespace) [Identifiers](#identifiers) [Scope blocks](#scope-blocks)
- Program structure [Source files](#source-files) [Using](#using) [Namespace](#namespace) [Application](#application) [Enum](#enum) [Connection](#connection)
- Misc [Config](#config) [Expressions](#expressions) [Variables](#var-and-const) [Unit tests](#test)
- Routing [Messages](#message) [Network](#network) [Entry point](#network-entry-point) [Pipe](#pipe) [Route](#route) [Append](#append) [Prepend](#prepend) [Destinations](#routing-destinations) [Clear](#clear) [Capture](#capture) 
- Processing [Process](#process) [Accept](#accept) [Emit](#emit) [Clone](#clone) [Await](#await)
- Control flow - [If](#if) [Else](#else) [Elseif](#elseif) [While](#while) [For](#for)

## Comments

Comments can appear in most of the places you would expect, but this is not explicitly called out in the
stntax definitions below. NPL supports C-like comments, with `//` commenting to the end of the line, and `/*` and `*/` 
providing multi-line comments.

## Whitespace

Anywhere where a space is required, you can put one or more spaces, or tabs.

There are a few places in the syntax of NPL where line breaks are significant. In these places, the \n character is not
whitespace, but has significance. In most places, where newline is not part of the syntax, line breaks are treated the
same as spaces.

The linefeed character is ignored everywhere, so you can save your source files in Linux or Windows format.

## Identifiers

Identifiers are names that you give to things in your program. Identifiers are case sensitive, and comprise
letters, digits and underscores. The first letter of the identifier name can not be a digit.

You cannot use a reserved word as an identifier in places where the compiler cannot differentiate between the
two. To be safe it is advisable to avoid using keywords as identifiers altogether to avoid confusion.

Qualified identifiers are a list of identifers separated by the decimal character.

Examples of valid identifiers are: _count person1 person_record

Examples of valid qualified identifiers are: message.id npl.connections.emitter

## Scope blocks

A scope block is a section of code enclosed in `{}`. Scope blocks can be nested as deeply as required. When the
compiler needs to resolve an identifier, it searches the current scope first, then the outer scopes from inside to outside.

When the outermost scope has been searched, if the identifier has not been resolved, then namespaces defined by `using`
statements are searched.

Scope blocks are not only used to define an area of code to search when resolving identifiers, they are also used to 
define blocks of code that are executed only in certain contexts. For example `if` statements can be followed by a scope
block, and the code in that block is only executed if the `if` statement evaluates to `true`.

## Source files

Each source code file can start with any number of `using` statements, including none, followed by one or more `namespace`
statements. You can put as much whitespace and comments as you like around these statements.

## Using
Using statements start with the reserved word `using`, followed by at least one space, then the qualified identifier for
a namespace, followed by a linebreak. You can not put multiple `using` statements on one line.

These are valid `using` statements:

```npl
using myapp
using some.other.namespace
using app.shared // Shared code
```

## Namespace

Namespace statements start with the reserved word `namespace`, followed by at least one space, then the qualified identifier name of
the namespace, followed by a scope block. You can have whitespace between the namespace name and the opening `{` of the scope block.
You can not have a linebreak before the opening `{` of the scope block.

The scope block may contain any number of `application`, `network`, `message` and `enum` statements.

These are valid `namespace` statements:

```npl
namespace app {}

namespace drivers{}

namespace app.data {

}
```

## Application

Application statements start with the reserved word `application`, followed by at least one space, then the name of the application
as an identifier. This is usually followed by a scope block, but it's also permitted to have an application placeholder with no 
scope block, but in this case the application will not do anything if you run it.

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

        connection npl.connection.httpListener {
            config { port 80 }
            ingress egress network http.router
        }
    }
}
```

## Message

Message statements start with the reserved word `message`, followed by at least one space, then the name of the message
identifier, followed by an optional scope block. Messages can be defined within a `namespace`, `network` or `process`. 
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

More typically, you will define messages with some fields, because they are not useful otherwise. In this case the
opening `{` for the scope block must be on the same line as the `message` keyword, and each field must be on a separate 
line. Line breaks are significant.

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

    message message2 {
        Message1 original_message
        deprecated string[] categories
        map<string, string> tags
    }
}
```

The type name can be:
- The qualified identifier for another message type
- The qualified identifier for an `enum` type
- One of the following reserved words: `string`, `number`, `boolean`, `date`
- Any of the above with a `?` suffix to indicate that the field is optional
- Any of the above followed by `[]` to define a list of values. This can not be combined with the `?` suffix
- `map<K, V>` where `K` can be any of `string`, `number`, or `date` and `V` can be any other type name.

Note that type restrictions exist because messages are transmitted between networks, and these networks
can be vertically scaled across clusters of compute instances. This means that messages can be serialized and
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

        egress ingress default { process process1 }

        egress logging { 
            process process1 
            process process2
            pipe pipe1 
        }

        ingress egress input1 { network network2.entrypoint1 }

        ingress splitEntrypoint { netwoek network3 }
        egress splitEntrypoint { network network4 } 
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

The scope block of the `enum` should contain a list of identifiers separated by whitespace. For example:

```npl
namespace app {
    enum Enum1 { value1 value2 value3 }
    enum Enum2 { 
        value1 
        value2 
        value3
    }
}
```

## Connection

Connection statements start with the reserved word `connection`, followed by at least 1 space, followed by
the qualified identifier of a connection type and a scope block. There are many connection types built into
the NPL runtime, and others can be added from shared modules. You can not create new connection types within
your NPL program.

Connections can only be defined within an `application`, and define how your application communicates with the
rest of the world. This includes network ports, files, APIs, data streams, databases etc.

Connections are generic and reusable accross multiple applications. Although the `config` statement within a
`connection` scope block is optional, very few connections are useful without some configuration.

To configure different connections for different situations (for example local vs production) you can create
a source file for each situation, where each source file contains an `application` statement that is
specific to that situation. You can also add `config` statements to your application and override the
values by providing a yaml file when you run the program.

As well as configuring your connection, you also need to route messages to/from the connection to a network
entry point within your application.

To configure the messages incomming from the connection to the application, use `ingress network` followed 
by the qualified identifier of the network or network entry point.

To configure the messages outgoing from the application to the connection, use `egress network` followed 
by the qualified identifier of the network or network entry point.

If the qualified identifier refers to a network, then the default entry point will be used.

You can also combine `ingress` and `egress` in the same statement, and the reserved work `network` is
optional, because it must always refer to network entry point.

These are examples of valid `connection` statements:

```npl
namespace app {
    application IntegrationTest {
        config {
            url 'https://myservice.com/api'
        }

        connection npl.connection.httpListener {
            config { port 80 }
            ingress egress network http.router
        }

        connection npl.connection.emitter {
            ingress network1
        }

        connection npl.connection.consoleLogger {
            egress network2.entryPoint1
        }
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
is a literal. The literal can be a string, date, number or boolean. It can also be an array of any of these types.

For the most part, you can define any config values you like in `config` statements. The only case where this is not
exactly the same, is in a `config` statement for a `connection`. In this case you define the `config` with the same
syntax, but this configures the connection, and must conform the the connections expectations for what can be configured.
Connection configuration can be defined in the configuration yaml file that is passed on the command line, regardless 
of whether you added a config definition or not in your application.

These are examples of valid config statements and expressions

```npl
namespace app {
    config {
        delay 10
        text 'It\'s going great'
        enabled true
        tenants ['tenant1', 'tenant2', 'tenant3']
    }

    network network1 {
        config { timeout 20 }

        process process1 {
            accept empty trigger {
                for (var tenant of config.tenants) {
                    emit MyMessage { 
                        message {
                            tenant tenant
                            text config.text
                            tomeout config.timeout
                        }
                    }
                }
            }
        }
    }
}
```

## Process

A process statement starts with the reserved word `process` within a `network` scope block, and is followed by at least 
one space, then the name of the process a valid identifier. If you just want to declare the process name, you can stop 
here, or you can add a scope block to define the process. If defining the process, the opening `{` must be on the same
line as the `process` reserved word.

A process must be defined within the scope block of a `network` definition.

A process definition comprises any number of `config`, `message`, `accept`, `internal` and `test` statements as defined below.

These are valid `process` statements:

```npl
namespace app {
    network hello {
        process responder {
            message DebugMessage {
                string text
            }

            accept DebugMessage {
                emit console.text {
                    message { ...message }
                }
            }

            accept * {
                emit DebugMessage {
                    message { text 'Hello, world' }
                }
            }

            test 'should emit console text' {
                emit empty
                expect console.text {
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
            route httpListener.httpRequest {
                append { process logger }
            }
        }
        pipe pipe2
        pipe pipe3
    }
}
```

## Route

Route statements start with the reserved word `route` within the scope block of a `pipe`. The `route` reserved word must be
followed by at least one space, then the qualified identifier name of a `message` definition, then a `{` to start the scope
block. The `{` must be on the same line as the `route` reserved word.

Route statements are always in the context of a message typpe, and the fields of this message can be referred to in your code 
using the syntax `message.<field-name>` where `message` is a reserved word, and <field-name> is the name of a field defined 
within the message.

Additionally, if the message field is another message, then you can use `.` separators to traverse the hierarchy. If the message
field is an array or map, then you can index the elements of the array or map with `<field-name>[<index>]`. The index can be a 
numbr or a string for maps, and must be a number for arrays.

Inside the route scope block you can use the following reserved words. These are defined in sections below:

- `append` to add destinations to the end of the message's route.
- `prepend` to add destinations to the begining of the message's route.
- `clear` to delete all destinations from the message's route.
- `capture` to re-route messages that are emitted during the processing of this message.
- `remove` to delete specific destinations from the message's route.
- `clone` to replace the message with modified copy.
- `if`, `elseif` and `else` to add conditional routing logic. The conditional scope block is syntactically identical to the scope block of the `route`.
- `while` and `for` to repeat routing logic. The loop's scope block is syntactically identical to the scope block of the `route`.

## Expressions

There are various places throughout the syntex definition where you can put an expression. This section defines the syntax of 
those expressions.

Note that their are two types of expression, those that are evaluated each time the code is executed, and those that are
evaluated once only at program startup to initialize the configuration. Expressions that initialize configuration are referred
to as constant expressions. Both types have the same syntax, but constant expressions can only reference literal values or
other constant expressions.

Expression syntax in NPL is very similar to [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators) with the following exceptions:
- There are no functions, so function pointers and lambda expressions are not supported.
- Data structures are immutable, so pre/post increment and decrement operators only work with `var` identifiers.
- Object syntax is not supported. You can not write `{ x: 1, y: 2 }` type expressions.
- Since there are no objects in NPL, there is no `new`, `this`, or `super` operator.
- There is no object destructuring support in NPL, but you can use the destructuring operator `...` to initialize a message with fields from another message.
- NPL does not have a concept of `null`. Messages with optional fields can contain the value `undefined` as per JavaScript.

NPL has some additional reserved words that can be used in expressions as follows:

- `config.<field-name>` can be used to refer to a configured simple value.
- `config.<field-name>[<index>]` can be used to refer to a configured array element or map value.
- `message.<field-name>` can be used within a pipe route or process to access the fields of the message.
- `context.origin.<field-name>` can be used within a pipe route or process to access the the origin context for this message.
- `context.message.<field-name>` can be used within a pipe route or process to access the the message context.
- `context.network.<field-name>` can be used within a pipe route or process to access the the network context for this message.
- `<message-reference>.message.<field-name>` can be used to access the data fields associated with a message reference.
- `<message-reference>.context.origin.<field-name>` can be used to access the origin context associated with a message reference.
- `<message-reference>.context.message.<field-name>` can be used to access the message context associated with a message reference.
- `<message-reference>.context.network.<field-name>` can be used to access the network context associated with a message reference.

### Literal values

When you put a literal value into an expression, the following formats are accepted:

- **number** literals use the same format as most programming languages. Like JavaScript, NPL does not differentiate between
integer and floating point numbers in the source code, but does recognise the underlying type at runtime. All of the 
following are valid: `123`, `+123`, `-123`, `+123.45`, `-123e-3`.

- **strings** literals can be enclosed in single quotes, double quotes or back ticks. To embed a quote into a string
delimited with the same quote character, prefix the quotation mark with `\`. To add `\` to a string you need to put 
two `\\` characters. The `\` can also be used to add control characters in the usual way, so `"\n"` is a string 
containg a newline character. Similarly you can use `\r`, `\t` and `\f`.

- **date** literals are rare in code, but maybe useful in unit tests. For places where you need them, date variables
can be initialized with a string that conforms to ISO-8601.

- **boolean** literals must use the reserved words `true` and `false`.

- **arrays** can be initialized with a list of expressions enclosed in a scope block. Each expression must either
be on a separate line (recommended) or enclosed in parentheses (in our opinion less readable).

- **maps** can be initialized with a list of key/value pairs enclosed in a scope block. Each pair must be on
a separate line, and the key must be separated from the value by at least one space. If the key is an expression
then it must be enclosed in parentheses.

Note that strings delimited with single or double quotes must be closed before the end of the source line, but
strings delimited with back ticks can contain multiple lines of text. Strings with back ticks also support string
interpolation where `${<expression>}` is replaced by the result of the evaluating the expression.

For example:

```npl
namespace app { 
    network network1 {
        message Message1 {
            number aNumber
            string aString
            boolean aBoolean
            date aDate
            string[] anArray
            map<string, number> aMap
        }

        process process1 {
            accept * {
                emit Message1 {
                    aNumber 34.6
                    aBoolean true
                    aDate "2023-08-16T09:00Z"
                    anArray {
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
```

## Accept

Accept statements must be inside the scope block of a `process`, and define a message type that the process can accept
and process. The statement consists of the `accept` reserved word, and a message type separated by at least one space 
followed by a scope block that defines how to process these messages.

The message type can be the qualified identifier for a message type, the reserved word `empty` or `*`. The empty message
is a special message type that has no fields but does have context and routing. Putting a `*` for the message type
means that the process can accept messages of any type.

You cannot have two `accept` statement within a process for the same message type, each `accept` must be for a distinct
type of message. Within the scope block you can refer to the fields of this message with `message.<field-name>`

Note that the `empty` message has no fields, so any `message.<field-name>` expressions will produce compillation errors. Using
a `*` allows you to defining processing for all other message types (not captured by any other `accept` statement). In this case
`message.<field-name>` are not checked by the compiler, and accessing fields that don't exist on the message will return `undefined`.

Inside the accept scope block you can use the following reserved words. These are defined in other parts of this document:

- `var` to define a local mutable value to store intermediate results from expressions.
- `emit` to produce a new message and emit it from the process.
- `await` to suspend processing until a response to your `emit` is received.
- `clone` to emit a modified version of another message.
- `clear` to delete the route for the message being processed, so that it receives no further processing.
- `if`, `elseif` and `else` to add conditional processing logic. The conditional scope block is syntactically identical to the scope block of the `accept`.
- `while` and `for` to repeat processing logic. The loop's scope block is syntactically identical to the scope block of the `accept`.

The following is an example of a process that can process any kind of message:

```npl
process dateAppender {
    accept * {
        var dateText = message.text + ' ' + date().toString()
        emit Response { 
            message { text dateText }
        }
    }
}
```

## Emit

Emit statements start with the reserved word `emit` followed by at least one space, then a message type qualified 
identifer followed by a scope block. As usual in NPL, the opening `{` of the scope block must be on the same line 
as the `emit` keyword because you can omit the scope block to accept a message but do no processing on it.

Emit statements can only exist within the scope blocks of `accept` or `test` statements.

Inside the scope block you can have two further scope blocks. The `message` scope block defines the fields of
the message to emit, and the `context` scope block optionally adjusts the context of the new message.

Inside the `message` scope block should be a list of the fields of the message on separate lines. As usual in
NPL, if there is only one field it can be all on one line, otherwise the fields must be separated by line breaks.

Each field definition is in two parts separated by spaces. The first part can be either the identifier name of a 
field, or the `...` operator and a message reference. The second part is an expression that is evaluated to provide
the value for that field.

The message reference can be the reserved word `message` (to refer to the message that was captured by the
`accept` statement) an identifier associated with an `await` statement, a `var` or `const` that contains a message
reference, or a field within any message that is itself a message.

Inside the `context` scope block you can set the context of the new message. By default new messages will inherit
the origin and network context of the message that is being processed, i.e. the message type defined by the `accept` 
statement. In a lot of cases this is sufficient and no `context` block is needed.

The `context` scope block supports three further scope blocks inside of it `origin`, `network` and `message`. These
scope blocks behave like `map<string, string>` but have specific lifecycles.

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
        origin { process 'MyProcess' }
    }
}

emit MyMessage {
    message { field1 'New value' }
}

emit MyMessage {
    message {
        field1 10
        field2 20
    }
}

accept Message1 {
    await { Message3 message3 }

    emit Message2 {
        message {
            ...message // Copies all fields from accepted message
            taxPercent message3.taxRate * 100
            maxCount config.maxCount
        }
        context {
            message {
                dateEmitted date()
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

The `if` reserved word can be used within a `route` or `accept` scope block. Several syntax options are supported.

Syntax 1 is: `if` followed by at least 1 space, followed by an expression, then a line break, then a single statement.

Syntax 2 is: `if` followed by an expression enclosed in `()` followed by a single statement all on one line.

Syntax 3 is: `if` followed by an expression, followed by the open scope `{` symbol all on one line, then multiple statements on 
successive lines, and finally a closing `}`. In this syntax the expression can optionally be enclosed in `()`.

These syntax options are illustrated by these valid examples:

```npl
    if message.path.startsWith('/ux')
        append { process logger }

    if (message.path.startsWith('/ux')) append { process logger }

    if message.path.startsWith('/ux') {
        clear
        if message.verb == 'POST'
            append { process logger }
    }

    if (message.path.startsWith('/ux')) {
        clear
        if (message.verb == 'POST) append { process logger }
    }
```

## Else

An `else` statement must follow an `if` or an `elseif` statement within a `route` or `accept` scope block.

The `else` statement has a scope block containg instructions to execute if the preceeding `if` condition is `false`.

## Elseif

The `elseif` statement is a shorthand way of coding a seriese of conditional statements without excessive nesting.

These two code blocks are funtionally identical:

```npl
if a {

}
else {
    if b {
        // Do something
    }
}

```

```npl
if a {

}
elseif b {
    // Do something
}

```

## While

While statements are syntactially the same as `if` statements defined above, but instead of executing the code in the 
scope block just once if the expression is true, the `while` statement repeats the code inside the scope block until 
the expression evaluates to false.

This is an example of a valid `while` statement

```npl
var x 10
while x > 0 {
    emit MyMessage { message { index x-- } }
}
```

## For

The `for` statement will enumerate the elements of an array or map. There are two types of `for` statement, one that
enumerates the keys and another that enumerates the values. These are the same as the options in TypeScript, and use
the same `for <index-variable> in <collection> {}` to enumerate indexes, and `for <value-variable> of <collection> {}`
to enumerate the values.

This is an example of a valid `for` statement:

```npl
config {
    tenants ['tenant1, tenen2']
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

## Prepend

The `prepend` reserved word can be used within the scope block of a `route`, and adds new destinations to the beginning
of the route for the message that is being routed. This adds new destinations to send the message before anything
that is currently in the message's route.

You can only have `prepend` statements within the scope block of a `route` statement. They affect the message
that is currently being routed.

The keyword `prepend` should be followed by a scope block containing a list of routing destinations (see below).
If there are multiple destinations, then each one must be on a separate line. If you have only one destination
then the statement can be all on one line.

## Routing destinations

Routing destinations are defined within the scope block of a `prepend` or `append` statement, and define a place
to send the message to. Each destination starts with the keyword `process`, `pipe` or `network` followed by at least
one space, and an identifier. As expected, if you use the `process` reserved word, then the identifier must
refer to a `process` definition etc.

For a process, the identifier must ne the name of a process within the same network. You cannot route messages
directly to a process in another network.

For a pipe, the identifier must ne the name of a pipe within the same network. You cannot route messages
directly to a pipe in another network.

For a network, the identifier can reference a network or a network entry point. If the identifier is the name
of a network, then the `default` entry point is assumed. The compiler tries to resolve the network identifier
in the current namespace first, then searches nameapaces referenced in any `using` statements in reverse order,
then accends the namespace hierarchy to broader and broader scope until the network name is found.

For example:

```npl
using namespace1
using namespace2.namespace3

namespace4 {
    network myNetwork {
        route * {
            append { network anotherNetwork.entryPoint1 }
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

namespace4 {
    network myNetwork {
        route * {
            append { network namespace1.anotherNetwork.entryPoint1 }
        }
    }
}
```

In which case the `using` statements are not required.

## Clear

The reserved word `clear` can be used in the scope block of a `route` or `accept` statement, and clears the
routing table for the message that is being routed or processed.

You can also clear the routing table for a specific message by writing `<message-identifier>.clear`

## Capture

The `capture` keyword is used to add a capture instruction to a message routing table of the message that is
being routed. You can only use this statement within the scope block of a `route` statement. Capture 
instructions set up routing for messages that are emitted during the processing.

Every message has a route attached to it. The route comprises a list of destinations, a global capture list
and a capture list associated with each destination on the route. When a message is processed by a
destination, the capture lists are used to modify the routes of any messages that are emitted during processing.
Emitted messages are compared to the capture list associatd with the destination first, then the global capture list.

The capture lists are effectively a map of message type and route. If the message type in the capture list
matches the type of the emitted message, then the route from the capture list is merged with the route of
the message.

### Global capture

The global capture list is initialized with an entry that matches all message types, and routes the message
back to the originator of the message that is being processed. This means that if you don't use any `capture`
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
            prepend { network graphQl }
        }
    }
}
```

This code means that for all messages routed to this pipe, add an entry to the global capture
list of the message saying that any `GraphQlRequest` messages that are emitted during its
processing should be sent only to the `graphQl` network's default entry point.

To unpack this a little, `route * {}` sets up a routing rule in the pipe for all message types,
where the contents of the scope block defines how to modify the message's routing table.

The `capture GraphQlRequest {}` part means add a new entry in the global capture list for messages of
type `GraphQlRequest`, or replace the existing one, where the code inside the scope block defines 
how to modify the routing table of any `GraphQlRequest` messages that are emitted during processing.

Inside this scope block we have `clear` then `prepend { network graphQl }` which deletes the contents
of the routing table entirely, then adds just one destination `network graphQl`, routing all emitted
`GraphQlRequest` messages to `network graphQl`.

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
                    prepend { network graphQl }
                }
            }
        }
    }
}
```

This means for all messages routed to this pipe, append `myProcess` to the list of destinations, and
if `myProcess` emits a `GraphQlRequest` then route it to `network graphQl`.

Note that in this example if any other processes along the route emit a `GraphQlRequest` then they
will not be affected by this capture, because it is specific to the `process myProcess` destination.

You may heve noticed that append and prepend statements can have capture statements within them, and 
capture statements have append and prepend within them, so these can be nested to any depth. This is
true, but deeply nested capture statements can be very difficult to understand and debug, so this is
strongly discouraged.

If a message is emitted that matches a destination capture rule and a global capture rule, the destination
rule is executed first, and the global rule afterwards. For this reason you should be very careful about
adding global capture rules that `clear` the route.

## Clone

The `clone` keyword can be used in a few places, and always means that you want to make a changed copy
of a message. Messages are immutable, but you can make a new message that is mostly copied from an
existing message, and has some fields with new values.

You can also create a copy of another message with the `...` spread operator, but this only copies the
data fields, whereas `clone` also copies the context and route, and therefore is suitable for situations
where you might mutate an object in other languages.

These examples show some of the ways that you can use `clone` in a `process`:

```npl
process process1 {
    accept Message1 {
        emit clone {
            field3 96
        }
        clear
    }
}
```

This example accepts a `Message1` type message and emits a clone of this message with value of `field3`
changed to the value `96`. The `emit` is followed by a `clear` statement that deletes the routing information
from the original incomming `Message1` so that it is not routed any further.

```npl
process process1 {
    accept Message1 {
        await { Message2 message2 }
        emit clone message2 {
            field3 96
        }
    }
}
```

This example starts processing a `Message1`, then waits for a `Message2` to be recieved, then emits a copy
of `message2` with one of the fields changed.

You can also use a `clone` statement in a `pipe` `route` to duplicate the message being routed, and send the
clone on a different route.

```npl
pipe pipe1 {
    route Message1 {
        clone {
            message {
                field1 'new field 1 value'
                field2 'new field 2 value'
            }
            prepend {
                process process2
            }
        }
        clear
    }
}
```

This example defines a route for messages of type `Message1` by cloning the message with a couple of cganged
fields, adding `process2` to the front of the route, and clearing the route for the original message so that
is does not propagate any further through the network.

## Await

You can use an `await` statement in a process scope block to suspend processing until a particular combination
of messages have been received. You can only await messages that were received in response to messages that
were emitted by this process so that the processing context is preserved.

NPL applications are designed to process millions of messages concurrently. If you application emits a message
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
            accept Invoice {
                emit data.GraphQlRequest {
                    message { 
                        query "{ tenant(id: $tenantId)\n{ taxRate\n}\n}"
                        params { 
                            tenantId message.tenantId
                        }
                    }
                }
                await { 
                    data.GraphQlResponse response
                    Error error
                }
                if response {
                    clone {
                        taxRate response['tenant']['taxRate']
                    }
                    clear
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

The type of the variable is determined by the type of the expression. For the `var` keyword, the expression is
optional, and for the `const` keyword the expression is required.

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
namespace App {
    enum Operation { add subtract multiply divide }

    message MathQuestion {
        number a
        number b
        Operation operation
    }

    message MathAnswer {
        number answer
    }

    network math {
        ingress egress mathQuestions { process doMath }

        process doMath {
            accept MathQuestion {
                if message.operation == Operation.add {
                    emit MathAnswer { 
                        message { answer question.a + question.b }
                    }
                }
                elseif message.operation == Operation.subtract {
                    emit MathAnswer {
                        message { answer question.a - question.b }
                    }
                }
                else {
                    emit Exception { 
                        message { text `Unknown math operation ${message.operation}`}
                    }
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
