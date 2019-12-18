import { expect, script } from '../';

export const lab = script();

const { describe, it } = lab;

describe('@ggoodman/ts-lab', () => {
  it('will successfully run a test written in TypeScript', async () => {});

  it('will call multiple dispose callbacks via flags.disposeOf', async (flags: script.Flags) => {
    const dispose1 = flags.mustCall(() => undefined, 1);
    const dispose2 = flags.mustCall(() => undefined, 1);

    flags.disposeOf({
      dispose: dispose1,
    });

    flags.disposeOf({
      dispose: dispose2,
    });
  });
});
