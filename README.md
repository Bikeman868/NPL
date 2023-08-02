# Network Programming Language

This project aims to introduce a new programming language that provides a more modern way to build software.

# Feature Overview

The [Language Handbook](LANGUAGE.md) and [Architecture Guide](ARCHITECTURE.md) provide more depth on the capabilities and characteristics of NPL. To whet your appetite here are some feature highlights.

1. **Elicits good code.** In NPL the easiest way to solve programming problems is also the most flexible, robust and scalable way to write the code. NPL code is easy to write, easy to understand, and very easy to maintain.

1. **Modern.** There are many features of NPL that make it modern. For example it directly integrates with Kubernetes, and manages the network partitioning of your application with trivial configuration. It also builds on lessons of past programming languages that complicated code unnecessarily, and made maintenence expensive. NPL is simple, powerful, modular, scaleable and intuitive.

1. **Message oriented.** The original promise of OOP was described as passing messages to objects, but in reality, OOP is just functions with encapsulated data. Having state and logic rolled up together like this is now known to be a bad idea, as is polymorthism and inhertance. NPL is truly message oriented and functional by definition, and this is what allows it to scale vertically as well as horizontally.

1. **Flexible.** Because the NPL compiler can produce bytecode for the JVM, IL for the .Net Framework, or TypeScript for Node. This also makes the application operating system independant. We are planning to release cross-compilers for Go and Rust for those that don't like garbage collection.

1. **Scaleable** both in terms of runtime, and also in terms of the size of the engineering organization. Packaging, sharing and reusing code is similar to what you are used to in Go, but the separation of code by the roles it plays in the application is a unique feature that really helps multiple teams to work together seamlessly.

1. **Observable** because the messages that flow through the system can be observed and analysed to understand how the application works, and to identify subtle bugs in the code.

1. **Interoperable**. Supports all of the usual protocols like REST, http, Avro, Protobuf, TLS etc. Network pipes that are managed by NPL use an optimized binary protocol, but edge connections can be defined by the application to connect the internal messaging system to legacy microservices, front ends, data stores and other systems that are external to the application.

1. **Productive**. Because NPL makes the developer define the structure of their application, the sourounding ecosystem understands the structure of your application also, and can provide powerful tools for visualizing, monitoring, analysing and debugging your application.

# Core Concepts

This is the big picture of how NPL works.

## Messages

Messages contain data. In NPL they are the only things that can contain data, and they are not allowed to contain any logic. This enforces good separation of concerns, and promotes a different way of thinking about software that is more flexible, maintainable and testable. Since messages cannot contain any logic, they also do not need any unit tests, and because this is the only place where you can have state, logic is necessarily stateless and therefore infinitely testable.

Messages do not support encapsulation, or inheritance, but composisiton is a first class language feature.

## Process

This is not to be confused with an OS process. Processes in NPL are functional logic that has no state, accepts messages, and produces zero or more messages as a result.

The original message can not be mutated by the process. The process can emit zero or more messages as the result of its processing. These emitted messages are routed by the pipes that are connected to the process. The routing can direct some messages back to the sender, or forward them to other processes for further processing.

For example if a process performs some transformation task, it might take in a message and emit a transformed version of it. This process can be plugged into the network in a variety of ways without it being aware of how it is being used. In one instance a process might send a message to it and route the transformed message back to itself. In another scenario, a process might send a message to it, and attach routing information that sends the transformed message to another process.

## Pipe

Pipes provide routing and async decoupling between processes. They can queue messages and deliver them to a target process, then route any emitted messages according to a set of rules.

NPL contains a number of standard pipes with useful characteristics. As a developer you can also create custom pipes that implement your own routing and message prioritization logic.

Pipes durably store messages until they are successfully processed. Once a process sends a message down a pipe, it can assume that the message will be processed eventually. Pipes will deliver messages at least once. In certain failure modes messages could be delivered more than once, so processes should be idempotent.

Pipes have an underlying transport and persistence layer. Most pipes communicate between processes running on the same compute instance, and therfore store undelivered messages in memory. If you configure your application to run accross multiple compute instances, then pipes will communicate over the network. This partitioning can be configured without changing any of your code. It is usual to have a development environment where all of the processes execute in the same container, and a production environment which is partitioned to distribute the workload more effectively.

## Network

This is where the name Network Programming Language comes from. In NPL a network defines a partitioning boundary. All processes and pipes defined inside a network will run on the same compute instance. There can of course be multiple instances of the network on different compute nodes to balance a large workload. Balancing can be done dynamically and automatically with the help of Kubernetes.

Pipes that are internal to the network will be in-memory pipes. Pipes that connect networks together may be configured as in-memory pipes or network pipes, and this can be changed by configuration only (no code changes).

A network can be packaged and reused in other applications, shared with other teams, and shared with other organizations.

## Application

An NPL application is a collection of networks that are connected together to perform some task continuously. In a microservice atchitecture, NPL applications would be considered services, except that they can scale vertically as well as horizontally, and microservices written using traditional method only scale horizontally.

Applications can communicate with each other using Connections (see below) but if both applications are written in NPL, it is much more efficient to connect their pipes directly.


## Connection

NPL connections exchange information with other systems outside of the application. More specifically, other systems that are not written in NPL. A connection is either an ingress, an egress, or both. Connections are just a special case of processes, that live outside of any network. Regular processes must exist within a network.

Some examples of Connections are:

* An ingress/egress connection that accepts http requests, validates the JWT, posts a message into a pipe and routes the response message back to itself. When the response message is received, it uses the contents of the message to construct and send an http response back to the caller.

* An egress connection that accepts messages from a pipe and writes them to a log file.

* A ingress/egress connection that accepts commands from a pipe, submits queries to a data store, then returns a message containing the data from the database. Note that the process that originates the command message can route the data message back to itself, or route it to another process for further processing.

* An ingress connection that subscribes to a data stream (Kafka, Pulsar, Kinesis, Google PubSub, etc...) and posts the received messages into an NPL pipe for processing.

## Context

Every message in NPL carries context with it. The context contains information related to the message (for example JWT of the caller, configuration options, feature flags etc).

The message context is divided into various areas, and only certain areas of the message context are propaged with the message as it crosses certain bountaries.

Originator message context is populated by connections, and is propageted from every message to any other message emitted as a result of processing it. For example a connection adds a JWT to messages that it emits, all messages premitted as a result of processing this message will also contain the JWT. This is true even if messages cross network or application boundaries.

Application message context is attached to every message whilst it is being processed within the application, but is not propaged between applications.

The processing context is only propagted between processes, and provides things like message IDs that allow emitted messages to be associated with the message that was processed, so it can be routed back to the originator.