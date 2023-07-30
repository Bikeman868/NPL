# Architecture

This document describes how NPL works for those that like to get under the hood. If you want to read about what it does, instead of how it does it, then take a look at the [language guide](LANGUAGE.md).

# Runtime environment

For the initial PoC the plan is to translate NPL code into TypeScript, and write the NPL runtime in TypeScript. The process of compiling and running an NPL program in this case would be:
 
 1. Take the NPL application code and translate into TypeScript.

 1. Pass the NPL runtime and the translated NPL code to the TypeScript compiler.

 1. Run the resulting JavaScript in Node.js.

 In future iterations of NPL we plan to compile it into other formats to provide more runtime options.

 For local development, you can run the entire application as a single Node.js application, and use the Node.js debugger to set breakpoints and step through the code in a similar way to how it works with TypeScript.

 For production environments, we plan to provide tooling that will split your application into multiple docker containers and orchestrate them using Kubernetes based on a simple configuration file that defines which networks should run in each vertical slice.
