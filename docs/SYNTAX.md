# NPL Syntax

This document defines what is valid for an NPL program.

Note that this document defines the syntax. It is possible for code to be syntactically correct but structurally invalid. For 
example having multiple application definitions within a source file is structurally invalid but syntactially correct.

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

Qualified identifiers are a list of identifers separated by the decimal character.

Examples of valid identifiers are: _count person1 person_record

Examples of valid qualified identifiers are: message.data.id npl.connections.emitter

## Scope blocks

A scope block is a section of code enclosed in `{}`. Scope blocks can be nested as deeply as required. When the
compiler needs to resolve an identifier, it searches the current scope first, then the outer scopes from inside to outside.

When the outermost scope has been searched, if the identifier has not been resolved, then namespaces defined by `using`
statements are searched.

Scope blocks are not only used to define an area of code to search when resolving identifiers, they are also used to 
define blocks of code that are executed only in certain contexts. For example `if` statements can be followed by a scope
block, and the code in that block is only executed if the `if` statement evaluates to `true`.

## Source code files

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
as an identifier, followed by an optional scope block. Messages must be defined within a `namespace`.

If you want to define some messages so that their identifiers will be resolvable, but you are not ready to define the
fields of the messages yet, you can omit the scope block, and the message type will exist with no fields. For example:

```npl
namespace app {
    message message1
    message message2
}
```

More typically, you will define messages with some fields, because they are not useful otherwise. In this case the
opening `{` for the scope block must be on the same line as the `message` keyword, and each field must be on a separate 
line. Line breaks are significant.

Each message field comprises a type name, followed by one or more spaces or tabs, followed by the field name identifier.

These are examples of valid `meessage` statements:

```npl
namespace app {
    enum record_type {
        person
        address
    }

    message message1 {
        record_type type
        string id
        string name
        date start_date
    }

    message message2 {
        message1 original_message
        string[] categories
        map<string, string> tags
    }
}
```

The type name can be:
- The qualified identifier for another message type
- The qualified identifier for an `enum` type
- One of the following reserved words: `string`, `number`, `boolean`, `date`
- Any of the above followed by `[]` to define a list of values
- `map<K, V>` where `K` can be any of `string`, `number`, or `date` and `V` can be any other type name.

Note that type restrictions exist because messages are transmitted between networks, and these networks
can be vertically scaled across clusters of compute instances.

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
`pipe` or `process`.

These are examples of valid `network` statements:

```npl
namespace app {
    network network1 {
        config {
            timeout_seconds 20
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
    enum enum1
    enum enum2
}
```

The scope block of the `enum` should contain a list of identifiers separated by whitespace. For example:

```npl
namespace app {
    enum enum1 { value1 value2 value3 }
    enum enum2 { 
        value1 
        value2 
        value3
    }
}
```

## Connection

Connection statements start with the reserved word `connection`, followed by at least 1 space, followed by
the qualified identifier of a connection type and a scope block. There are many connection types built into
the NPL runtime, and others can be added from shaed modules. You can not create new connection types within
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
by the qualified identifier of the network or network entry point. If the qualified identifier refers to a 
network, then the default entry point will be used.

To configure the messages outgoing from the application to the connection, use `egress network` followed 
by the qualified identifier of the network or network entry point. If the qualified identifier refers to a 
network, then the default entry point will be used.

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

## Process

## Pipe

## Route

## Expressions

## Accept

## Emit

## If

## Else

## Elseif

## While

## For

## Append

## Prepend

## Clear

## Capture

## Var

## Test

