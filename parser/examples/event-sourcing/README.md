This sample program implements an event source.

For those less familiar, even sourcing is where you store input events as-is,
and materialize the state at any point in time by folding over the input events.
To make materialization more efficient when there are a large number of events, 
we keep snapshots of the state from time to time. If new events come in with
earlier timestamps, then snapshots later then this are deleted because they are
now invalid.

For this example, the state is defined by a state transition graph, where input
messages can cause transitions to a new state. Since the application uses event
sourcing, the input events can be sent in any order, and the computed final
state will always be correct.

Furthermore, if you redefine the state transition graph, and delete all of the
snapshots in the database, then query the state of any entity at any point in
time, the results will reflect the updated state transition graph.
