# NPL Handbook

This is not a formal definition of [the language syntax](SYNTAX.md), but a practical handbook that will get you writing code quickly.

# Hello World

Sorry, but it's tradition. This is a hello world console app written in NPL.

```npl
using npl.connection

namespace App {
    message Response {
        string text
    }

    network Hello {
        ingress egress default {
            process Responder
        }

        process Responder {
            accept * {
                emit Response { 
                    data { text 'Hello, world' }
                }
            }
        }
    }
}

namespace App {
    application HelloWorld {
        connection emitter {
            config { 
                count 1 
                interval 0
                message empty
            }
            ingress Hello
        }
        connection console {
            config { mode console.lines }
            egress Hello
        }
    }
}
```

Note that if you wanted to write a hello world web page instead, then you would only need to modify the application definition, all of the rest of the code could remain unchanged.

To try this code, save it so a file called `HelloWorld.npl`, install NPL on your computer, then type `npl HelloWorld`. Type Ctrl-C to signal the program to stop. In larger programs, you would break the code into multiple files, probably one per declaration, but the NPL compiler doesn't care how you arrange your declarations among source files, and you can rearrange them without affecting the behavior of your application.

Lets explain this step by step before we go any further.

## Syntax

A quick sidenote about syntax. In NPL the general pattern is to have one or more reserved words, then a name, then optional `{}`. The reserved words say what kind of thing we are declaring, then we give is a name, then the `{}` enclose the definition of the thing we just named.

For example in `message Response { string text }` the `message` is a reserved word that says we are defining a message, `Response` is the name of the message, and the part inside `{}` is the message definition.

The message definition follows the same pattern, where `string` is a reserved word and `text` is the name. In this case there is no further definition required, so the optional `{}` after `text` are not needed.

NPL minizes those annoying separatore. The question of whether I need a comma, semi-colon or colon next are annoying any mostly not needed. In general in NPL you use line breaks to separate statements, and if you have only one statement it can go all on one line. This makes the code clean and easy to read as well as easy for the compiler to parse.

NPL does use `.` to separate hierarchical names, and `{}` to denote scope, but otherwise tries to keep the syntax clean and simple.

## Namespace and using

The namespace declaration `namespace App` defines a namespace called `App`. Inside the namespace, code can reference other code elements simply by their name. If you want to reference something in another namespace, then you have to prefix the name with the namespace and a `.`. For example to reference the `Response` message above from another namespace, you can write `App.Response`.

When resolving names, NPL first looks in the local nested scopes, then searches the namespace, then searches the namespaces from any `using` statements in the order that thay appear in the code. This allows you to build huge codebases with minimal name conflict issues.

Like other programming languages, namespaces exist to avoid name clashes between code written by different teams. You can define as many namespaces as you like, and you can use as many `.` separators as you want to create deeply nested namespaces if you choose.

In this trivial example I coud have put eveything in one `namespace` declaration, but I split the code into two `namespace` declarations just to show that this is allowed. In typical large applications, the contents of a namespace will span many source files.

## Message

The message declaration:

```npl
message Response {
    string text
}
````

Defines a message called `Response` in the `App` namespace. Response messages have one piece of data called `text` which is a `string`.

Note that the message is defined directly in the namespace and is not part of a network, because messages can be passed between networks and are used in unit tests and integration tests.

## Process

The process declaration:

```npl
process Responder {
    accept * {
        emit Response { 
            data { text 'Hello, world' }
        }
    }
}
```

Defines a process that will accept messages, process them, and optionally emit other messages. `process` is a reserved word, and is followed by the name of the process. Note that processes must be defined inside of a `network`.

The process definition is enclosed in `{}` and comprises a number of clauses that define the behavior of the process. Note that processes can not have internal state, but messages have context. The state travels with the message, the message is immutable, but the message context can be mutated.

The `accept` reserved word is followed by the name of a message or `*` (which means that it will accept any type of message).

In this case `accept * {}` defines the processing steps to perform when a message of any type is received, and  `emit Response { text 'Hello, world' }` sends a `Response` type message with it's `text` property set to the string literal "Hello, world".

Note that the process does not know where the incomming message came from, or where the response that it emitted will be sent next. Processes are wired together by routing logic.

## Network

The network declaration:

```npl
network Hello {
    ingress egress default {
        process Responder
    }
}
```

Defines a network of processes and pipes that perform some higher level processing function. This is somewhat equivalent to a module, package or assembly in other programming systems, except that they are not separately compiled, and it is common to have a large number of networks, and in NPL higher level networks are composed of multiple lower level networks.

In this example, the network is very simple. The network has one entry point that sends ingress messages to the `Responder` process, and captures any emitted messages from the `Responder` process and sends them back down the pipe that delivered the original message.

Networks often have multiple entry points that are named. You can also have a default unnamed entry point as demonstrated by this example.

`network` is a reserved word, and is followed by the network name. This is followed by the network definition enclosed in `{}`.

The network definition comprises a list of named entry points into the network. Each entry point can be an `ingress`, an `egress` or both. Ingress and egress can be separated by defining the entry point twice with the `ingress` or `egress` qualifiers as appropriate. In this hello world example, there is one entry point with no name that is both ingress and egress.

In this example the default entry point is wired to the `Responder` process, which means that any messages received by the network will be forwarded to the `Responder` and any messages that `Responder` emits will be sent back to the message originator.

The network entry point can define multiple processes, in which case each message received will be delivered to each process, and the messages emitted by all of these processes will be send returned via the entry point.

Network entry points can also be wired to pipes and the entry points of other networks. Large networks can be comprised of many smaller networks to whatever depth makes sense for your application.

## Application

This is the only place where you can define connections. Connections define how your application connects to the rest of the system. You can have multiple applications that share the same networks, but have different connections to the world outside the application.

In this case:

```npl
application HelloWorld {
    connection emitter {
        config { 
                count 1 
                interval 0
                message empty
            }
        ingress Hello
    }
    connection console {
        config { mode console.lines }
        egress Hello
    }
}
```

Defines an application called `HelloWorld` that has two connections. Connections specify how your application communicates with things outside of your application.

The first connection is an `emitter`, which resolves to `npl.connection.emitter` via the `using` statement at the top of the source file. The emitter connection simply emits messages at regular intervals and it is built into the NPL runtime.

In this example the emitter is configured to emit a single empty message after no delay. This connection is defined as an ingress to the application, in other words the application receives messages from the emitter. 

Application ingress and egress connections are always attached to network entry points.

The statement `ingress Hello` sends recieved messages to the default (unnamed) entry point of the `Hello` network. 

Note that `empty` is a reserved word and is defined as `message empty {}`. Empty messages have context, can be routed like any other message, but they contain no information.

As previously discussed, the default entry point of the `Hello` network will forward this empty message from the emitter to the `Responder` process, which will then emit a `Response` message.

The second `connection` is to `console`, which is defined as an egress from the application. The name `console` will be resolved to `npl.connection.console` via the `using` statement.

Defining this as an `egress` means that the application sends messages to the console connection. The source of the egress messages is the default entry point of the `Hello` network. This will result in the phrase "Hello, world" being printed to the console window.

## Additional notes

From this example you can probably see that it's pretty easy to write integration tests, you simply define an application for each test that connects one or more networks within your codebase to real or dummy inputs and outputs.

Unit tests are also easy because only processes can contain logic, and these have no state.

# Pipes example

The hello world example above is too simple to need any pipe definitions, but pipes are really fundamental to the way you design solutions in NPL, beacuse they define how messages are routed within a network.

In our hello world example, because we did not define any pipes, pipes were being created for us with default settings. By defining pipes explicitly in our code, we can gain more control over how messages are routed.

Lets say for example you want to accept an http request, validate the request using the JWT, query a database for the requested data, then format an html page using a handlebars template, and return the page in response to the http request.

With what we have seen so far, this would be problematic, but that's because we didn't cover pipes yet!

## Application

For this example, the application needs one http listener `connection` that listens for http requests. The http listener connection emits messages that include the callers IP address, the domain name path and query string, JWT etc.

The application routes http request messages to a `network` that is set up to handle them. By default, the `pipe` connecting the application to the network will route any messages emitted by the network back to the sender of the original message. This means that messages emitted from the network will be routed back to the http listener connection, so that it can send an http response.

```npl
namespace App {
    application Website {
        connection httpListener {
            config { port 80 }
            ingress egress Http.Router
        }
    }

    network Http {
        ingress egress Router
    }
}
```

Note that we defined a `network` here with an ingress/egress entry point called `Router`, but we omitted its definition. In this case the messages routed here will not be processed, and if they have no more destinations on their route, then there will ne no further processing of the message.

As you work with NPL, you will find it very helpful that each application can only contain 1 `application` definition, that the only place you can define a `connection` is in the `application` definition, and only `connection` definitions can connect to anything outside of your application. This means that you can open any NPL application and see at a glance exactly how it plugs into the rest of the system.

To start an application you pass the name of the source file that contains a single `application` definition. You can have multiple applications based on the same codebase by putting each `application` definition in a separate file.

## Routing network

The previous section defined a `network` called `Http`. Lets now look at how we might define that network.

```npl
namespace App {
    network Http {
        ingress egress Router { pipe Router }

        pipe Router {
            route httpListener.HttpRequest {
                if (message.path.startsWith('/api')) {
                    route.append { process Logger }
                    route.prepend { network Api.Request }
                    route.capture ApiResponse { 
                        route.prepend { process Json }
                    }
                } else if (message.path.startsWith('/ux')) {
                    route.append { process Logger }
                    route.prepend { network Html.Request }
                    route.capture HtmlResponse { 
                        route.prepend { process Html }
                    }
                } else {
                    route.prepend { process NotFound }
                }
            }
        }

        process Logger
        process Html
        process Json
        process NotFound
    }

    network Html { ingress egress Request }
    network Api { ingress egress Request }
}
```

Note that we have not defined any behaviors for the processes yet, but this application will accept http requests and route messages for each request, but the processes are dead ends that emit no messages, so no response will be returned for the http requests.

There is a lot to unpack here. The `network Http` contains a pipe definition and some processes that we have not defined yet (we will get to those later). I also added some additional networks to the namespace called `Html` and `Api` that don't do anything yet either.

Lets look more closely at the pipe definition. A pipe definition starts with the reserved word `pipe` followed by the name of the pipe, then the pipe definition enclosed in `{}` as usual. In this example I called the pipe `Router` because its purpose is to route the request to the `Html` network, the `Api` network, or the `NotFound` process depending on the path of the http request.

Pipes are elastic, and can buffer messages, but they are also routers, so pipe definiitons are a collection of route statements. `route` is a reserved word, and in a pipe definition is followed by the type of message to route, followed by the route definition enclosed in `{}`. You can use `*` as the message type to route all other messages.

The route definition comprises routing logic to apply to this message type. The routing logic can use conditionals, loops, comparisons etc, and is similar to JavaScript, but it can also use the following reserved words:

* `context` to access the message contexts (for example `context.origin.jwt`). The message context can be mutated.
* `message` which functions a bit like `this` in other languages, and refers to the message being routed. The fields of the message can be read, but messages are immutable.
* `route` to alter the path that the message will take through the network.
* `clone` to make a copy of the message with a different route.

Routing is a big subject that is covered in detail elsewhere. In this example we are using `route.prepend` to add a new destination to the beginning of the route, changing where the message will go next.

This `pipe` segments requests into 3 categories.

If the http request path starts with `/api` then this is a REST JSON request. In this case the pipe will route the request to the `App.Api` network, then to the `App.Http.Logger` process. It will also capture any `App.HttpResponse` messages emitted from the `App.Api` network, and route them to the `App.Http.Json` process.

The intent here is that the `App.Api` network will perform some processing and emit an `App.RestResponse` message. This message is routed to the `App.Http.Json` process, which serializes the response and emits an `npl.connection.httpListener.HttpResponse` message. This will be routed back to the `npl.connection.httpListener` because it added this rule to the route attached to the original `npl.connection.httpListener.HttpRequest` message.

If the http request path starts with `/ux` then this is an html page request. This is handled in a similar way to the API case, except that the response is Html instead of JSON.

For all other paths, the message is routed to the `App.Http.NotFound` process which will emit the `App.Http.Json` process, which emits an `npl.connection.httpListener.HttpResponse` message containing a 404 status code.

# Configuration

Configuration is a first class feature of the NPL language. For software to be flexible enough to have a useful lifetime, it needs to be configurable, but it also needs sensible defaults that only need to be overriden in specific circumstances.

As a first class feature, `config` is a reserved word in the language, and is similar to the words `static` or `final` in other languages, but also quite a lot different from those languages.

In most other languages, configuration is very clumbsy and awkward. NPL aims to fix this by making config fun and easy. This is how.

Any named scope in NPL can include a `config` definition within it. For example I can define a network as:

```npl
napespace App {
    network RestApi {
        ingress egress Secure {
            config { 
                requiredRole roles.admin
                timeoutSeconds 10
            }
        }
    }
}
```

When you am defining something in NPL, the `config` definition specifies what can be configured, and what the default configuration values are. When you are referencing something in NPL, the `config` section overides the default configuration of the thing that you are referencing.

I can also override any configuration value anywhere in my application by creating a yaml file, and passing this to npm on the command line when running the application.

For example I can create the following yaml file that will change the `timeoutSeconds` configuration value in the code example above:

```yaml
App:
  network:
    RestApi:
      Secure:
        timeoutSeconds: 2
```

For sensitive configuration (such as database credentials) you can reference environment variables in your yaml file by sourounding them with the `%` symbol. You can also include multiple `%ENV_VAR%` references within strings.

For example: 

```yaml
App:
  network:
    MyNetwork:
      someServiceUrl: 'http://%HOST%:%PORT%/somepath'
```

The `config` reserved word can also be used to access configuration values, so in my code I can write `config.requiredRole` to reference the value of this config. For example I can write something like

```npl
if (context.origin.jwt.role == config.requiredRole)
  route.prepend { process DoIt }
else
  route.prepend { process AccessDenied }
```

Note that config is only mutable at runtime via a yaml configuration file. You cannot cheat and use config to hold mutable state.

# Multi-threading

Because processes cannot contain mutable state, and a message can only be processed by one process at a time, your application is automatically thread safe without you having to think about it. The threading model can be changed by overriding the application's `config` either in the application code, or via a yaml configuration file.

The NPL runtime can expand and contract the number of process instances that are running to accomodate the workload and prevent bottlenecks. You can observe these scaling events using the built-in NPL tools.

NPL can also partition your application across many compute instances without changing a single line of code, because your processes and pipes are inherently unaware of the runtime context of your application. This allows you to take any application not specifically built for scale, and deploy it at massive scale without modification.

# Routing

The concept of message routing is very fundamental to the core concepts of NPL. This is a network programming language, and its a network of processes that process messages. To make the applicatiob do different processing under different circumstances it is necessary to route messages to different processes under different circumstances.

In tranditional programming languages, developers write functions that call other functions, and hence the structure of the application is fixed by the code. Many of the features of other progeamming systems are designed to add some flexibility into this structure (polymorphism, interfaces, dependency injection) but they don't go rearly far enough, and as developers we spend far too much time reconfiguring this rigid structure to accomodate new features.

NPL goes one step further by completely decoupling processing logic from the rest of the application, and the structure of the application. In NPL all that a process knows is that is can process certain types of messages, and as a result can produce some more messages. Where these messages came from and where my emitted messages go to is not the concern of the process, which means this stuff can change without impacting the process logic.

In NPL the networks and pipes effectively define the structure of the program. Separating the structure from the logic allows a developer to restructure the program much more easily.

You can think of an NPL application as a hierarchy of graphs within graphs, where each graph is a `network`, each graph node is a `process` and each graph edge is a `pipe`, except it's more flexible than that, because the route a message takes is not defined by a rigid structure, but by the routing information that is carried by the message - it's as if the program structure is specific to each message that is processed by the application.

Most routing is performed by `pipe` definitions. A `process` is allowed to change a message's route, and define the initial route for messages it emits, but this is discouraged and should be used very sparingly.

## Message routes

Every message has a route associated with it. The route describes a path through the application that the message will take. The route can be adjsuted along the way, because the message originator should not have to know the full structure of the application to be able to fire off new messages (something that most processes need to do).

At every point along the route, the rules for handling emitted messages can be changed. In particular newly emitted messages also need a route, and this is initialized from the rules within the message that was being processed at the time.

For example we can create a message with a route that says go to Process A, then Process B, then Process C.

In this case the NPL runtime will pass the message to Process A and when it has finished processing it will pass it to Process B and then to Process C.

However when Process A is processing the mesaage, it could add Process D to the beginning or the end of the message's route. If it adds Process D to the beginning, then the order of processing steps will become A -> D -> B -> C. If it adds D to the end of the route, then the processing steps will become A -> B -> C -> D. Note that Process A knows nothing about B and C.

Although this is possible, it is considered bad practice to modify message routes within processes, this should be left to the pipes so that processes are more reusable, and the structure of the application is confined to the pipes, giving rise to a separation of concerns.

The message route also tells the NPL runtime how to route messages emitted by processes. These can be specific to the perticular destination on the route, or to the message as a whole.

To see how this works, lets take an example.

Imagine imagine an http listener `connection` creates an `HttpRequest` message (lets call it Message A) and it wants to get back an `HttpResponse` message, but it has no idea which process will emit this message. In this case it adds a rule to Message A saying that all emitted `HttpResponse` messages should be routed to the http listener connection. This rule stays with the message for its lifetime, and if any process in the application emits an `HttpResponse` message whilst processing Message A, then this message will be delivered back to the same instance of http listener, even if this is running on a different compute node.

In a similar way, other processes along the path can add routing rules to the message indicating how emitted messages should be routed. For example if a process adds a rule saying that all `Error` messages should be routed back to itself, then this would be similar to setting up a `try/catch` block in other programming languages.

When messages are emitted and there is no rule for this message type, then the default is to send the emitted message back to the process that emitted the message that is being processed. This means that in the http listener example above, there was no need to attach a routing rule for the `HttpResponse` message, because by default any messages emitted during the processing of Message A would be routed back to the process that emitted Message A, and that was the http listener.

## Pipes

Pipes are defined within a `network`, and define the routing of messages that are delivered to the network. Messages can be routed to other pipes, processes and network entry points (usually of another network).

The recommended best pracice is to only alter message routing in pipes. This provides a separation of concerns between the implementation logic of the processes and the structure of the application. It is much better if processes are unaware of the program structure, because this makes them much more fexible and reusable.

To compare this with a traditional language in which a function calls another function, which calls another function etc, in NPL the processes are like functions, except that they don't know which function to call next. It's the pipe that determines the order of execution, and this order of execution is specific to each message, and carried with the message as it is processed.

A `pipe` is defined in terms of the messages that it routes. If messages are delivered to a pipe and it has no routing rule that matches this message, then the message is not processed by the pipe (but the message will still be delivered to any other destinations in its route). The pipe can also use `*` in place of the message type as a catch all for any other type of message.

This is an example pipe definition:

```npl
pipe Pipe1 {
    route Message1 { route.prepend { process Process1 } }
    route Message2 { 
        route.prepend { 
            process Process1
            process Process2
            pipe Pipe2
        }
        route.append  { pipe Pipe2 }
    }
    route Message3 {
        clone {
            field1 'new field 1 value'
            field2 'new field 2 value'
        }
        route.clear
    }
    route * {
        route.clear
        route.prepend { process NotImplementedLogger }
    }
}
```

This illustrates a few patterns and techniques as follows:

* `Message1` routing simply adds a new destination to the front of the route. This is where the message will be sent next. Simple routing statements like this can be all on 1 line if you want.
* `Message2` routing makes multiple routing changes. These must be separated by line breaks. The `route.prepend` statement also routes to multiple destinations, in this case the destintions must be separated by line breaks.
* `Message3` routing makes a copy of the original message (including its route), where the copy has some modified field values. It also clears the route on the original message so that it will not be processed any further. This is as close as you can get to mutating a message.
* `*` routing applies to any other type of message. In this case we clear the route to prevent any further processing of this message, then send the message to the `NotImplementedLogger` process. Note that the `route.prepend` statement must come after `route.clear` or the prepend would also be cleared.

## The `route` reserved word

The `route` reserved word modifies the route associated with the message that is in context. For a `process`, this is the message that the process is currently processing. For a `pipe` this is the message that the pipe is routing.

There are also places where a new message context is created, for example when a process contains an `emit` statement. This statement creates a new message, and inside the message definition the `route` reserved word will modify the route of the newly created message.

Newly created messages by default, are routed to the originator of the message that is currently in context, so it is uncommon to modify the route here. If processes emit messages with a custom route set by the process, this makes the process tightly coupled to the program structure, which makes it less flexible and less reusable.

The `clone` reserved word makes a copy of the message in context, but modifies some of the fields. Inside the clone defintion, you can also use `route` to alter the route of the clone.

The `route` statement supports the following operations on the message route:

* `route.clear` deletes all routing information on the messaage. If no further manipulation of the route takes place, then the message will be dropped, and no further processing will take place.
* `route.prepend` adds a new destination to the front of the routing list, making it the next place that the message will be sent. The destination can be a `pipe`, `process` or `network` entry point.
* `route.append` adds a new destination to the end of the routing list, so that the message will be sent to this destination for processing after all of the destinations on this list have processed the message. The destination can be a `pipe`, `process` or `network` entry point.
* `route.capture` specifies how to route messages emitted by processes as they proces this message. The `route.capture` statement is followed by a message type, then a route definition enclosed ini `{}`. The route definiton uses the same `route` reserved word. This does allows you to create nested `route.capture` statements, but this is bad practice and other solutions should be saught.
* `route.remove` is followed by a list of destinations, and removes all of those destinations from the routing list. This is not often useful, but is provided for completeness.

As well as using `route.capture` to globally catch all emitted messages of a specific type, you can also add a scope block after a routing destination to capture messages emitted from that destination.

For example:

```npl
namespace App {
    network Network1 {
        pipe Pipe1 {
            route Message1 {
                route.prepend {
                    process Process1 {
                        capture Message2 {
                            route.prepend { process Process2 }
                        }
                    }
                }
                route.capture Message2 { 
                    route.prepend { process Process3 }
                }
            }
        }
    }
}
```

In this example, if `Pipe1` receives `Message1` then it will route it to `Process1` before anything that is already in the message's routing list. During the processing of this message, if `Process1` emits `Message2` then it will be routed to `Process2`, but if any other process emits `Message2` then it will be routed to `Process3`. This is as deep as you should go with your capture hierarchy, if you have a more complex scenario, the break up your routing into multiple pipes.

# Logic

A lot of programming language handbooks start by explaining how to write loops, variables and conditional statements, but I left this part for the end. This is because I am assuming that you already used at least 1 other programming language bfore, and already know how these things work. This is not a distinctive or unusual aspect of NPL.

The only other thing I need to tell you is that NPL is very similar to JavaScript, supports most of the JavaScript built-in functionallity, and can be used inside most sets of `{}`.

Things that are obviously declarative can not contain program logic. So for example I can not write a `for` loop that declares network entry points - the names of the entry points are identifies that are resolved at compile time. I also can not add program statements to a `config` definition, but I can use constant expressions - config is immutable by the application code.

In most other places in NPL I can use most of the JavaScript language. I say most of the language, because you cannot define classes and interfaces, and you can't do anything that would couple processes together - because that could be running on different compute instances. You can only exchange messages between processes, and you can only define how messages flow through the application in pipes.

# Messages

Messages are used to pass information between processes. Messages also have context that tells you something about the message, where it came from, the context in which is was created etc. The message context can be examined and mutated in your application code with the `context` reserved word.

Messages also contain routing information that tells the runtime system how to process the message, and what to do with any other messages that are emitted as a result of processing this one. The routing of a message can be modified with the `route` reserved word.

To define a new type of message, you use the `message` keyword directly inside a namespace. To construct a new message, you use the `message` keword in your application logic. Once messages are contucted, thay are immutable.

Because NPL applications can be scaled vertically as well as horizontally, messages must be serializable. For example if you were to put a pointer to a function into a message and ppass it to antother network, this might work on the same compute instance, but if the vertical scaling configuration moved that other network to a different compute instance, this function call could not be serialized across the network.

Messages can contain primitive types like strings and numbers. They can also be more structured using arrays, maps, and other messages. Arrays and maps inside of messages are also immutable.

NPL defines an `empty` reserved word that represents a message with no data inside of it. This empty message still has context and can be routed, and is typically used to trigger an action somewhere else in the code.

The NPL runtime includes a `connection` called `emitter` that can emit messages at approximately regular intervals. This can be used to trigger polling operations and such. The emitter can be configured to output any message type, but is frequently used to emit empty messages.

Because empty messages have context, and context must be mutable, this provides a back door into mutable messages. Please don't do this. I guess it's possible to write really bad code in almost any language, and this is one of the placed where that is possible in NPL.

# Context

Wherever a message is in context (for example in a `process`) you can use the `context` reserved word to read the message context, and in some cases modify it.

The context contains multiple scopes, where each scope has different rules for mutability and lifetime. The data associated with scope is a map, where the values in the map can be primitive types, arrays or further maps.

The context scopes are:
* `context.origin` can only be written when the message is created, and has the same lifetime as the message. Whenever a process creates a new message, it can set named values in the `context.origin` map. This scope is also copied to any new messages that are emmitted in the context of processing this message. For example if the message originator puts a JWT into the `context.origin` for the message, all other messages that are created during the processing of this message will also contain the same JWT without the developer having to explicitly make this so.
* `context.message` is a mutable context that has the same lifetime as the message, but is not automatically transferred to any other messages that are created during the processing of this message. Of course you can write code to copy values from the current message context to the new message context, but this requires explicit coding.
* `context.network` is a mutable context that stays attached to the message as long as the message remains in the same network. If the message is sent between networks then this context is stripped off the message first. The main reason for this context scope is that networks are the partitions for vertical scaling. In other words, two networks are not guaranteed to run on the same compute instance, and messages sent between networks might need to be serialized and transmitted over the wire. You can put large datasets in the network context, and these will not be transmitted over the wire. It also makes sense for information that is only relevant to the network not to persist after the message leaves that network and is no longer relevant.

# Sharing code

Like many programming systems, NPL has a package manager and public/private repositories of shared code that you can incorporate into your solution.

An NPL package it contains a number of networks. For most packages, one of these networks is designed to be used form other applications, and the rest are considered internal to the package

The recommended best practice it to put everything in the package into a namespace that includes your organization name, and is unique. Networks and message types intended for consumers of your package should be defined directly within this top level namespace.

Internal details of your package should be placed in additional namespaces, for example:

```npl
namespace myCompany.myPackage {
 network external {}
}

namespace myCompany.myPackage.functionalArea {
    network internal {}
}
```

When you publish a package, you should make the package name match the top level namespace.

To import a package into your application you can use the `import` reserved word followed by the package name and version. Each import statement should be on a separate line.

The package manager is covered in detail elsewhere.

# Code orgamization

When you run an PML program, you must pass the name of a source file containing an `application` definition. You can have as many of these files as you like. The file extension `.npl` is assumed by default.

All other files in the current directory, and all sub-directories with file extensions of `.npl` are potentially part of the application, and will be parsed, but only definitions that are actually reachable starting from the application definition will be compiled.

When processing source files, any other `application` definitions that are encountered will be ignored.

# Custom connections

NPL code is deliberately restricted in what is allowed, to promote clean, maintainable, flexible and scaleable code, and this works within the application, but is not possible at the edges.

For example your application might have a pool of socket connections, database connections or file handles to the local file system. This type of code is confined to `connection` definitions.

Connections are not written in NPL code, but they can or course emit and consume messages, because they drive the rest of the application from external impulses.

Connections should not contain any application specific logic. They should be stripped down to the bare minimum needed to get information in and out of the application. The NPL runtime already contains a number of common connection types including common internet protocols like http, file system access etc.

If you want to add connection types that are not already included in the NPL runtime, then you can write then in TypeScript, and compile them into the application.