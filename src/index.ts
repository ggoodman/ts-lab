export { expect } from '@hapi/code';
import * as Lab from '@hapi/lab';
import { DisposableStore, IDisposable } from 'ts-primitives';

export function script(options?: script.Options): script.Script {
  const script = Lab.script(options);
  const originalIt = script.it;

  const createItFunction = (optionsOverrides: { skip?: boolean; only?: boolean } = {}) => {
    return function itWrapper(
      title: String,
      testOrOptions: script.Action | script.TestOptions,
      maybeTest?: script.Action
    ): void {
      const options = typeof testOrOptions === 'function' ? {} : testOrOptions;
      const test =
        typeof testOrOptions === 'function' ? testOrOptions : (maybeTest as script.Action);

      const testWrapper: Lab.script.Action = (flags: Lab.script.Flags) => {
        const disposer = new DisposableStore();
        const flagsWrapper: script.Flags = {
          ...flags,
          mustCall<T extends (...args: any[]) => any>(func: T, times: number): T {
            //@ts-ignore
            return flags.mustCall(func, times);
          },
          disposeOf: (disposable: IDisposable) => disposer.add(disposable),
        };

        flags.onCleanup = () => disposer.dispose();

        return test(flagsWrapper);
      };

      return originalIt.call(script, title, { ...options, ...optionsOverrides }, testWrapper);
    };
  };

  const it: script.Test = Object.assign(createItFunction(), {
    only: createItFunction({ only: true }),
    skip: createItFunction({ skip: true }),
  });

  return Object.assign(script, { it });
}

export namespace script {
  export interface Action {
    <T>(flags: Flags): Promise<T> | void;
    (flags: Flags): void;
  }
  export interface Flags extends Omit<Lab.script.Flags, 'mustCall' | 'onCleanup'> {
    /**
     * Register a disposable to be disposed of after the test execution.
     *
     * @param disposable - an object having a dispose method
     */
    disposeOf(disposable: IDisposable): void;

    /**
     * Sets a requirement that a function must be called a certain number of times.
     *
     * @param func - the function to be called.
     * @param count - the number of required invocations.
     *
     * @returns a wrapped function.
     */
    mustCall<T extends (...args: any[]) => any>(func: T, count: number): T;
  }
  export interface Options extends Lab.script.Options {}
  interface TestFn {
    (title: String, test: Action): void;
    (title: String, options: TestOptions, test: Action): void;
  }
  export interface Script extends Lab.script.Script {
    it: Test;
  }
  export interface Test extends TestFn {
    only: TestFn;
    skip: TestFn;
  }
  export interface TestOptions extends Lab.script.TestOptions {}
}
