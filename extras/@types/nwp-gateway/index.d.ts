declare module "nwp-gateway.node" {
    export function runFoo(arg: Record<string, number>): Promise<{mode: number}>;
}
