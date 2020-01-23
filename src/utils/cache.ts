import NodeCache from "node-cache";

export let cache: NodeCache | undefined;

export function createInstance() {
  cache = new NodeCache({ stdTTL: 30 });
}
