# Architecture

This document describes how NPL works for those that like to get under the hood. If you want to read about what it does, instead of how it does it, then take a look at the [Language Handbook](LANGUAGE.md).

# Concept

## Applications

An NPL application comprises:
- An Application definition that defines how your application connects to the outside world. You can have multiple application definitions for the same program if you have different scenarios in which these connections vary, for example development, staging and production environments. Note that as well as having multiple application definitions, each application can also be configured at run-time through a configuration file and/or environment variables.
- A number of Networks defined by the application code. Each Network can be made up of other Networks etc to whatever depth is needed to implement the features of the application. Networks are functional areas of the code. Processing within a network occurs on the same machine. Networks within an application may run on different machines depending on the runtime configuration.
- A number of Networks imported from shared Packages.
- References to the NPL runtime system. The runtime contains many generic and reusable components, and also defines mechanisms for connecting your application to the outside world that can be configured in your application definition.

Terminology:
- **Program** is a directory and sub-directorty structure that contains NPL source code files and configuration files.
- **Application** is a definition of how to wire up the **Program** to the outside world (persistent storage, data streaming, service APIs etc) by configuring **Connections**.
- **Connection** provides a way for the **Program** to communicate with other systems. NPL provides **Connection** implementations for all popular databases, streaming platforms, file system, network protocols and the console.
- **Node** a machine that can execute instructions using data in memory. Nodes are typically virtual machines hosted in the cloud or local development computers.
- **Network** defines a region within your **Program** where processing must be performed on the same **Node**. Processing that crosses **Network** boundaries may or may not execute on the same **Node** depending on your vertical scaling configuration.
- **Message** defines a shape for data that is communicated between components of the **Program**. Programs typically define many **Messages** that are specific to the **Program** functionallity. The NPL **Runtime** also defines some generic **Messages**.
- **Process** pure functional logic that accepts **Messages** as input and emits new **Messages** as output.
- **Pipe** routing logic that defines how **Messages** flow between **Networks** and **Processes** within the **Program**.

This is depicted below:

![Application](conceptual-application.jpg "Application Concept")

In this depiction, the Application definition is a red rounded rectangle. It is the only thing that exchanges Messages directly with Connections. Connections are the only thing that can connect to anything outside of the application. This includes databases, file systems, data streaming platforms, REST services, SaaS APIs etc.

Connections contain no application specific functionallity, and can be shared by many applications. Connections contain definitions of Messages that they emit, and Messages that they can process. Connections can be configured by the application.

To run an NPL program, you provide the name of an Application definition within your program. You can have many application definitions for the same program, for example to run with different configurations in different environments. You can also build integration tests as Application definitions, where the Connections provide a sandbox for the integration test. NPL is purely functional, making integration testing very straightforward.

The blue rounded rectangles are Networks. Networks are interconnected by Pipes. Pipes route Messages and are resillient, elastic and asyncrhronous.

Vertical scaling can be confgiured at the network level. Pipes that route messages between Networks will be in-memory for Networks running on the same Node, and will use system networking between Networks that are running on different Nodes. When networks span compute clusters, standard message streaming solutions can be configured including Pulsar and Kafka.

## Networks

At the larger scale, an NPL Application consists of a hierarchical organization of interconnected Networks. Within each Network there are:
- Processes that perform computational logic. Processes know how to handle specific types of Message, and emit other Messages as the result of their processing. Processes can also emit Messages and wait for responses before continuing their processing.
- Pipes are resilient, elastic, asyncronous, and implement Message routing logic. Pipes are also durable, and guarantee to process each message at least once by each destintion on the message's Route.
- A Message is not considered successfully processed until the Process positively acknowledges successful processing of the Message. If a Process negatively acknowledges processing of the message, then the message will be scheduled for re-processing.
- Pipes defined within a Network are always in-memory, and very high performance.

This can be depicted as follows:

![Network](conceptual-network.jpg "Network Concept")

Networks must have entry/exit points to be useful. Messages are received from other Networks over these Entry Points, and messages emitted by the Processes within the Network can be sent to other Networks via these Exit Points.

It is important for flexibility, single responsibiluty and reusability, that processes are completely self-contained, with no knowledge of any other Processes within the system. Processes only have knowledge of the Messages that they can process, and the Messages that they emit.

Note that processes are supposed to be very simple, performing just one relatively simple task. For example a process might accept a Message describing an update, and translate it into a SQL statement. In this case the Pipes will route update request Messages to this Process for translation into SQL statement messages, and the Application definition will route the SQL messages to the database Connection. Any response Messages emitted from the database Connection will automatically be routed back to the originator, but Pipes involved in the routing could dynamically inject additional Processes into the route to perform additional transformations.

In this example, if you wanted to log the SQL statements that are being executed, you can just add a logging process, and configure the message pipe to duplicate the message to the logging process. In this case none of the existing processes require any changes. This is an important aspect of the design of NPL. Each process solves just one straightforward problem and solves that problem completely without any awareness of any other process in the program. If we have new problems to solve (such as logging SQL queries) this requires a new process, but does not change how we are solving any other problem, therefore no existing processes need any modification. In an NPL application, you only need to change process code when you want to change how the problem solved by this process is being solved. In most other programming languages a small change somewhere in the code frequently cascades into requiring changes in dozens of other places throughout the code. NPL is designed to avoid this problem.

## Messages

Messages contain:
- Immutable data. The data is defined by the program code. Message data can not be modified, but Messages can be cloned, data from one Message can be used to initialize a new Message, and a Message can contain other Messages.
- Scoped contexts. Each scope is a collections of name/value pairs. Some scopes are mutable and some are immutable. Some scopes are automatically copied to Messages that are emitted in response to Message processing, and other scopes are specific to the Message. Some scopes are transported across Network boundaries and others are not. This is discussed in greater detail elsewhere.
- A Route that defines the path that the message will take through the Networks and Processes. The Route is dynamic, and can be modified by Pipes. Pipes can't contain application logic, but do contain all of the message routing logic.

Comparing this to the OOP techniques that are very familiar to most programmers:
- Processes are similar to classes. Where classes contain multiple public methods, Processes know how to process multiple types of message.
- In OOP, classes are instantiated to create objects. These objects contain data and the methods of the class mutate this data. In NPL, Processes contain the processing instructions ony, and contain no data. The data is passed between Processes in Messages, making processes completely stateless.
- In OOP you could simulate some aspects of NPL by having two types of class, where one type of class only defines properties, and the other type of class only contains static methods and can not be instantiated. In this case the property only classes (sometimes referred to as DTOs) are like NPL Messages and, and the static classes are like NPL processes. In this simulation there is no equivalent to the NPL Pipes, Networks and message routing.
- In OOP the data and the operations on that data are bound together into a class. In NPL the data and operations to perform on the data are deliberately separated into Messages and Processes where many Processes can act on the same data.
- In OOP, methods of an object call methods of other obejcts. This means that each class must be aware of the overall structure of the application, and restructuring the application is complex and risky. In NPL Processes have no idea of the application structure, or which Process will be called next, this is the responsibiliity of the Pipes. This is like Dependency Injection taken to the next level.
- In OOP the calling sequence is defined by a method's processing logic making an explicit call to another method. In NPL the calling sequence is bound to the data, and represented by a Route within the Message.

There is a [comparison with OOP](OOP_COMPARISON.md) document if you want to explore this in more depth.

# Runtime environment

For the initial PoC the plan is to transpile NPL code into JavaScript, and write the NPL runtime in TypeScript. The process of compiling and running an NPL program in this case would be:
 
 1. Take the NPL application code and transpile into JavaScript.

 1. Distribute the compiled NPL runtime as a Node package.

 1. Run the resulting JavaScript in Node.js.

 In future iterations of NPL we plan to compile it into other formats to provide more runtime options.

 For local development, you can run the entire application as a single Node.js application, and use the Node.js debugger to set breakpoints and step through the code in a similar way to how it works with TypeScript. The NPL transpiler emits a source map that the JavaScript debugger can use to relate the JavaScript code back to the original NPL source lines, just like it does for TypeScript.

 For production environments, we plan to provide tooling that will split your application into multiple docker containers and orchestrate them using the Kubernetes API Service. A simple configuration file can defines which networks should run in each vertical slice, so that the vertical scaling of the application can be changed without recompiling the code. Horizontal scaling will be achieved using the Kubernetes Horizontal Pod Autoscaler.
