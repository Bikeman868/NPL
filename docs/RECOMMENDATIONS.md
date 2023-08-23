# Recommended best practice guide

## Naming conventions

NPL does not impose any naming conventions, but the following are recommended for naming identifers.

Note that all reserved words are all lowercase letters. Your identifers can consist of
upper and lower case letters, digits and underscores. Identifers may not have a digit as
the first character.

We recommend three formats for identifiers:
- Camel case in which the first character is lower case and other words within the identifier are capitalized. For example `thisIsCamelCase`
- Pascal case in which the first character of every word is upper case. For example `ThisIsPascalCase`.
- Camel case prefixed with underscore. For example `_myInternalThing`.

In all three formats acronyms should not be capitalized. So for example you should use `Html` and not use `HTML`. You should use `Dto` and not use `DTO`.

Our general recommendation is to use Pascal case for the names of types and camel case
for the names of instances. For example if I define a message type I might call it `HtmlRequest`. This defines the fields that messages of this type have. If I have a
field or variable that contains a reference to a message of this type, then I could name
it `htmlRequest`. This helps to avoid name collisions and general confusion over what
it a type and what is a value.

Namespaces are neither types nor values, and we recommend using camel case for them.

The fields of a message are values, so they should use camel case.

This is some sample code that follows this convention

```npl
namespace app.dto {
    message Message1 {
        string customerId
        number invoiceTotal
    }
}

namespace app {
    message Message2 {
        string customerId
        number invoiceTotal
        number taxPercent
        number? itemCount
    }

    message Message3 {
        string tenantName
        number taxRate
        map<string, string> tenantConfig
    }

    network Main {
        process InvoiceProcessor {
            accept dto.Message1 {
                await { Message3 message3 }
                
                emit Message2 {
                    message {
                        ...message
                        taxPercent message3.taxRate * 100
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
        }
    }
}
```

## Patterns

There are a few recommended ways of organizing the flow of message processing within your
application. Bear in mind that messages are immutable, so you cannot route a message
through a sequence of processes, and have each process modify the message along the route.
This is not a viable pattern, but there are many other patterns that are very useful in
building real-world applications.

### Boomerang pattern

In this pattern a process emits a message that has a very specific response, and waits for
that response befor continuing to process. This pattern is useful for situations like
fetching data from a database. The process emits a message describing the data that it
needs and receives a response with the data without knowing anything about where the
data came from.

Below is an example of emitting a message containing a GraphQL query and waiting for
the response. The example is not a complete working program, but illustrates:
- Separating areas of functionality using namespaces
- Dividing the code up into networks. Each network can run ona  different compute instance at runtime
- The large scale program structure is defined by the networks.
- Structure within a network is defined by the pipes.
- Processes are independant of program structure.
- You to easily restructure the program to accomodate new requirements.
- You can A/B test a new structure by having pipes examine feature flags.

```npl
// The data namespace contains networks for reading and writing persistent stores
// Start by defining messages and networks, the interface to the data subsystem
namespace data {
    message GraphQlRequest {
        string graphQl
    }

    message GraphQlResponse {
        map<string, string> data
    }

    network GraphQl {
        ingress egress default { process GraphQlQuery } 
    }
}

// Define the processes within the data namespace
// In this sample code the process does nothing
namespace data {
    network GraphQl {
        process GraphQlQuery {
            accept GraphQlRequest {
                // TODO: Execute the GraphQL query
                emit GraphQlResponse
            }
        }
    }
}

// Define messages, networks and routing for the main application
namespace app {
    // This message is not defined yet and will be empty for now
    message Invoice

    network InvoiceLogic {
        ingress egress default { pipe Main }

        // This pipe modifies the message route to capture GraphQL requests and route
        // them to the GraphQl network in the data namespace
        pipe DataAccess {
            route * {
                capture data.GraphQlRequest {
                    prepend { network data.GraphQl }
                }
            }
        }

        pipe Main {
            route Invoice {
                prepend { 
                    // Process invoices with the TaxCalculator process
                    process TaxCalculator

                    // Before calling TaxCalculator modify the message route to capture
                    // GraphQlRequest messages and route them to the GraphQl network
                    pipe DataAccess
                }
            }
        }
    }
}

// Define processes for the main application
namespace app {
    network InvoiceLogic {
        process TaxCalculator {
            accept Invoice {
                emit data.GraphQlRequest {
                    message { graphQl "some GraphQL query" }
                }
                await { data.GraphQlResponse requestedData }
                // Do something with requestedData
            }
        }
    }
}
```

## Relay pattern

This is like the relay race competitor passing the batton to their next team member. We need this
pattern because messages are immutable. If you want to accept a message and forward a modified
version of it, then you need to clone the original message, send the clone on its way, and
squash the route for the original incomming message so that it is not processed any further.

```npl
process Test {
    accept Message1 {
        clone {
            message {
                field1 message.field1 + "_suffix"
            }
            context {
                message {
                    ...message.context.message
                    isClone true
                }
            }
        }
        clear
    }
}
```

In this example the process accepts messages of type `Message1`, clones the message (including 
the message's route and context) but modified `field1` appending `"_suffix"` to it. After making
the clone, the route of the original incomming message is cleared so that is will undergo no more
processing.

Note that this code explicitly copies the message context of the message to demonstrate how you
would do this if you wanted a modified context for the cloned message. If you do not include this
code, then the cloned message will be an exact copy the original message. The reserved word `clone`
on a line by itself with no scope block will simply emit another message that is completely identical
to the incomming message.

Note that if we placed rhw `clear` before `clone` then we would have cleared the route on the
incomming message before copying it, and the cloned message would also have no route going forward.

This `clone` and `clear` syntax works in `accept` statements and `route` statements.
