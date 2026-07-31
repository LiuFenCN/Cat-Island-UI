const path = require('path');

/* Same flarum import transform plugin as chat extension */
function flarumImportPlugin({ types: t }) {
  const REMAP = { extend:'common/extend', app:'common/app', Application:'common/Application', Model:'common/Model', Component:'common/Component' };
  function normalize(p) { if (REMAP[p]) return REMAP[p]; for (const prefix of ['models/','utils/','helpers/','components/']) { if (p.startsWith(prefix)) return 'common/'+p; } return p; }
  function buildGetCall(modPath) { return t.callExpression(t.memberExpression(t.memberExpression(t.identifier('flarum'),t.identifier('reg')),t.identifier('get')),[t.stringLiteral('core'),t.stringLiteral(modPath)]); }
  return {
    visitor: {
      ImportDeclaration(path) {
        const src = path.node.source.value; if (!src.startsWith('flarum/')) return;
        const modPath = normalize(src.slice(7)); const nsId = path.scope.generateUidIdentifier('flmod');
        const nodes = [t.variableDeclaration('var',[t.variableDeclarator(nsId,buildGetCall(modPath))])];
        for (const spec of path.node.specifiers) {
          if (spec.type==='ImportDefaultSpecifier') nodes.push(t.variableDeclaration('var',[t.variableDeclarator(spec.local,t.conditionalExpression(t.logicalExpression('&&',nsId,t.memberExpression(nsId,t.identifier('__esModule'))),t.memberExpression(nsId,t.identifier('default')),nsId))]));
          else if (spec.type==='ImportSpecifier') nodes.push(t.variableDeclaration('var',[t.variableDeclarator(spec.local,t.logicalExpression('&&',nsId,t.memberExpression(nsId,t.identifier(spec.imported.name))))]));
          else if (spec.type==='ImportNamespaceSpecifier') nodes.push(t.variableDeclaration('var',[t.variableDeclarator(spec.local,nsId)]));
        }
        path.replaceWithMultiple(nodes);
      },
    },
  };
}

module.exports = {
  target: 'web',
  entry: { admin: './src/admin/index.js', forum: './src/forum/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: { extensions: ['.js'] },
  externals: [],
  module: {
    rules: [{
      test: /\.js$/, exclude: /node_modules/,
      use: { loader: 'babel-loader', options: { plugins: [ ['@babel/plugin-transform-react-jsx',{pragma:'m',pragmaFrag:'m.fragment',runtime:'classic'}], flarumImportPlugin ] } },
    }],
  },
};
