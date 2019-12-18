import * as Path from 'path';

import * as Typescript from 'typescript';

function transform(source: string, filename: string) {
  const searchPath = process.cwd();
  const configFileName = Typescript.findConfigFile(searchPath, Typescript.sys.fileExists);
  const { config, error } = Typescript.readConfigFile(configFileName!, Typescript.sys.readFile);

  if (error) {
    throw new Error(`TS config error in ${configFileName}: ${error.messageText}`);
  }

  const { options: compilerOptions } = Typescript.parseJsonConfigFileContent(
    config,
    Typescript.sys,
    searchPath,
    {},
    configFileName
  );

  compilerOptions.inlineSourceMap = true;
  compilerOptions.inlineSources = false;
  compilerOptions.sourceMap = false;

  const result = Typescript.transpileModule(source, {
    fileName: Path.resolve(process.cwd(), filename),
    compilerOptions,
    reportDiagnostics: true,
  });

  if (result.diagnostics && result.diagnostics.length) {
    result.diagnostics.forEach(diagnostic => {
      console.warn(Typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    });
  }

  return result.outputText;
}

export default [
  {
    ext: '.ts',
    transform,
  },
];
