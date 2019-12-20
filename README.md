# Lab + TypeScript = 😍

> Take the [`@hapi/lab`](https://github.com/hapijs/lab) you know and love and add a sprinkling of built-in TypeScript support and out comes `ts-lab`, an opinionated spin on vanilla lab.

See [@hapi/lab](https://hapi.dev/family/lab/) on the official Hapi developer site for more information on Lab itself.

## Differences

`ts-lab` is not a fork of [`@hapi/lab`](https://github.com/hapijs/lab) but instead wraps it. At the time of writing, the justification for this decision isn't entirely clear but here we are. This repo exposes a binary `ts-lab` that forwards arguments to the `lab` binary exposed by [`@hapi/lab`](https://github.com/hapijs/lab) with the addition of arguments to add TypeScript support. The module also exposes an API that wraps [`@hapi/lab`'s API](https://hapi.dev/family/lab/?v=21.0.0#usage). The differences are outlined below:

1. Out-of-the-box support for tests authored in TypeScript.
2. Exposes an instance of [`@hapi/code`](https://github.com/hapijs/code)'s assertion library as the top-level `expect` export.
3. Changes the optional `flags` arguments passed into test functions such that:
   1. It no longer exports a mutable `.onCleanup` property.
   2. Exports a `.disposeOf(disposable: { dispose(): void }): void` function. This can be used to register multiple disposables for disposal during the test's clean-up phase.

## License

See [LICENSE.md](./LICENCE.md).