# Architecture

This document describes how NPL works for those that like to get under the hood. If you want to read about what it does, instead of how it does it, then take a look at the [language guide](LANGUAGE.md).

# Concept

## Applications

An NPL application comprises:
- A number of Networks defined by the application code. Each Network can be made up of other Networks etc to whatever depth is needed to implement the features of the application.
- A number of Networks imported from shared Packages. These Networks can contain a hierarchy of other Networks, and can reference Networks defined in other shared Packages.
- References to build-in Connections, or Connections that are defined in shared Packages.
- An Application definition that configures Connections, and routes Messages between the Connections and the Networks.

This is depicted below:

![Networks](conceptual-application.jpg "Application Concept")

In this depiction, the Application definition is a red rounded rectangle. It is the only thing that exchanges Messages directly with Connections. Connections are the only thing that can connect to anything outside of the application. This includes databases, file systems, data streaming platforms, REST services, SaaS APIs etc.

Connections contain no application specific functionallity, and can be shared by many applications. Connections contain definitions of Messages that they emit, and Messages that they can process. Connections can be configured by the application.

To run the software in different environments, you can create multiple Application definitions, one for each environment. You can also build integration tests as Application definitions. To run an NPL program, you provide the name of a source file that contains an Application definition.

The blue rounded rectangles are Networks. Networks are interconnected by Pipes. Pipes route Messages and are elastic and asyncrhronous.

Vertical scaling can be confgiured at the network level. Pipes that route messages between Networks will be in-memory for Networks running on the same Kubernetes Pod, and will use system networking between Networks that are running on different Kubernetes Pods.

## Networks

At the larger scale, an NPL Application consists of a hierarchical organization of interconnected Networks. Within each Network there are:

- Processes that perform computational logic. Processes know how to handle specific types of Message, and emit other Messages as the result of their processing. Processes can also emit Messages and wait for responses before continuing their processing.
- Pipes are elastic, asyncronous, and implement Message routing logic. Pipes are also durable, and guarantee to process each message at least once by each destintion on the message's Route.
- A Message is not considered successfully processed until the Process positively acknowledges successful processing of the Message. If a Process negatively acknowledges processing of the message, then the message will be scheduled for re-processing.
- Pipes defined within a Network are always in-memory, and very high performance.

This can be depicted as follows:

![Networks](conceptual-network.jpg "Application Concept")

Networks must have entry/exit points to be useful. Messages are received from other Networks over these Entry Points, and messages emitted by the Processes within the Network can be sent to other Networks via these Entry Points.

It is important for flexibility, single responsibiluty and reusability, that processes are completely self-contained, with no knowledge of any other Processes within the system. Processes only have knowledge of the Messages that they can process, and the Messages that they emit.

Note that processes are supposed to be very simple, performing just one relatively simple task. For example a process might accept a Message describing an update, and translate it into a SQL statement. In this case the Pipes will route update request Messages to this Process for translation into SQL statement messages, and the Application definition will route the SQL messages to the database Connection. Any response Messages emitted from the database Connection will automatically be routed back to the originator, but Pipes involved in the routing could dynamically inject additional Processes into the route to perform additional transformations.

## Messages

Messages contain:
- Immutable data. The data is defined by the application code. Message data can not be modified, but Messages can be cloned, data from one Message can be copied to another Message, and a Message can contain other Messages.
- Scoped contexts. These are collections of name/value pairs. Some scopes are mutable and some are immutable. Some scopes are automatically copied to Messages that are emitted in response to Message processing, and other scopes are specific to the Message.
- A Route that defines the path that the message will take through the Networks and Processes. The Route is dynamic, and is modified by Pipes to define local processing sequences to complete before continuing with the higher level Route.

Comparing this to the OOP techniques that are very familiar to most programmers:
- Processes are similar to classes. Where classes contain multiple public methods, Processes know how to process multiple types of message.
- In OOP, classes are instantiated to create objects. These objects contain data and the methods of the class mutate this data. In NPL, Processes contain the processing instructions ony, and contain no data. The data is passed between Processes in Messages.
- In OOP you could simulate some aspects of NPL by having two types of class, where one type of class only defines properties, and the other type of class only contains static methods and can not be instantiated. In this case the property only classes (sometimes referred to as DTOs) are like NPL Messages and, and the static classes are like NPL processes. In this simulation there is no equivalent to the NPL Pipes and Nttworks.
- In OOP the data and the operations on that data are bound together into a class. In NPL the data and operations to perform on the data are deliberately separated into Messages and Processes where many Processes act on the same data.
- In OOP, class methods call methods of other obejcts. This means that each class must be aware of the overall structure of the application, and restructuring the application is complex and risky. In NPL Processes have no idea of the application structure, or which Process will be called next, this is the responsibiliity of the Pipes. This is like Dependency Injection taken to the next level.
- In OOP the calling sequence is defined by a method's processing logic making an explicit call to another method. In NPL the calling sequence is bound to the data, and represented by a Route within the Message.

# Runtime environment

For the initial PoC the plan is to translate NPL code into TypeScript, and write the NPL runtime in TypeScript. The process of compiling and running an NPL program in this case would be:
 
 1. Take the NPL application code and translate into TypeScript.

 1. Pass the NPL runtime and the translated NPL code to the TypeScript compiler.

 1. Run the resulting JavaScript in Node.js.

 In future iterations of NPL we plan to compile it into other formats to provide more runtime options.

 For local development, you can run the entire application as a single Node.js application, and use the Node.js debugger to set breakpoints and step through the code in a similar way to how it works with TypeScript.

 For production environments, we plan to provide tooling that will split your application into multiple docker containers and orchestrate them using Kubernetes based on a simple configuration file that defines which networks should run in each vertical slice.
