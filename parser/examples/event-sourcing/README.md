# Event sourcing sample application

This sample program implements an event sourced state machine.

## Event sourcing

For those less familiar, even sourcing is where you store input events as-is,
and materialize the state at any point in time by folding over the input events.
To make materialization more efficient when there are a large number of events,
we keep snapshots of the state from time to time. If new events come in with
earlier timestamps, then snapshots later then this are deleted because they are
now invalid.

## State machine

For this example, the state is defined by a state transition graph, where input
messages can cause transitions to a new state. Since the application uses event
sourcing, the input events can be sent in any order, and the computed final
state will always be correct.

Furthermore, if you redefine the state transition graph, and delete all of the
snapshots in the database, then query the state of any entity at any point in
time, the results will reflect the updated state transition graph.

## Running the application locally

To get this running locally, you need to:

1. Install npl
2. Install MySQL
3. Run a SQL script to create the database tables
4. Check that the credentials in ./examples/event-sourcing/application.npl
5. From a command prompt, execute the command 'npl ./examples/event-sourcing/application.npl'
6. Use curl commands to verify the application is working as expected

Notes:

-   Insteal of using MySQL, it's easy to change the database to postgres, SQL Server, Oracle, Google BigTable or whatever, just by changing the application.yaml file.
-   Instead of updating the credentials in application.npl, you can put credentials in environment variables, and reference those in the `config` sections by enclosing the environment variable name in `%` symbols within a string.

## Installing npl

TBD

## Creating the MySQL database.

Note that :

-   You might need to adjust this script if you are using another database. The
    following script is designed for MySQL, but as close to Ansi SQL as possible.
-   I defined a trivial state transition graph for illustration purposes, but
    you can make this graph as complicates as you like. Since the application
    periodically reloads the state transition graph into memory, any changes you
    make whilst the application is running will take a little while to be in effect.

```sql
create table snapshots (
    entityKey varchar(255) not null,
    timestamp timestamp not null,
    stateCode varchar(50) not null,
    primary key (entityKey, timestamp)
);

create table events (
    entityKey varchar(255) not null,
    timestamp timestamp not null,
    eventCode varchar(50) not null
);

create index events_by_timestamp on events (entityKey, timestamp);

create table graphStates (
    stateCode varchar(50) not null,
    stateName varchar(50) not null,
    startingStateCode varchar(50),
    transitions text not null
);

create table graph (
    startingStateCode varchar(50) not null
)


insert into graphStates
    (stateCode, stateName, transitions)
values
    ("A", "State A", '[{"eventCode":"1", "nextStateCode":"B"}, {"eventCode":"2", "nextStateCode":"C"}]');

insert into graphStates
    (stateCode, stateName, transitions)
values
    ("B", "State B", '[{"eventCode":"1", "nextStateCode":"A"}, {"eventCode":"2", "nextStateCode":"C"}]');

insert into graphStates
    (stateCode, stateName, transitions)
values
    ("C", "State C", '[{"eventCode":"3", "nextStateCode":"A"}]');

insert into graph
    (startingStateCode)
values
    ("A");
```

## Testing with curl

TBD
