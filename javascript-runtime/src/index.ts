import { Engine } from "./Engine.js";

const engine = new Engine();

engine.registerMessageType();

engine.registerProcess();

engine.registerConnection();

engine.run();
