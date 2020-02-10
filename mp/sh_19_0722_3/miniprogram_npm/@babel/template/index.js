module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1581324618229, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.program = exports.expression = exports.statements = exports.statement = exports.smart = void 0;

var formatters = _interopRequireWildcard(require("./formatters"));

var _builder = _interopRequireDefault(require("./builder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const smart = (0, _builder.default)(formatters.smart);
exports.smart = smart;
const statement = (0, _builder.default)(formatters.statement);
exports.statement = statement;
const statements = (0, _builder.default)(formatters.statements);
exports.statements = statements;
const expression = (0, _builder.default)(formatters.expression);
exports.expression = expression;
const program = (0, _builder.default)(formatters.program);
exports.program = program;

var _default = Object.assign(smart.bind(undefined), {
  smart,
  statement,
  statements,
  expression,
  program,
  ast: smart.ast
});

exports.default = _default;
}, function(modId) {var map = {"./formatters":1581324618230,"./builder":1581324618231}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618230, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.program = exports.expression = exports.statement = exports.statements = exports.smart = void 0;

function makeStatementFormatter(fn) {
  return {
    code: str => `/* @babel/template */;\n${str}`,
    validate: () => {},
    unwrap: ast => {
      return fn(ast.program.body.slice(1));
    }
  };
}

const smart = makeStatementFormatter(body => {
  if (body.length > 1) {
    return body;
  } else {
    return body[0];
  }
});
exports.smart = smart;
const statements = makeStatementFormatter(body => body);
exports.statements = statements;
const statement = makeStatementFormatter(body => {
  if (body.length === 0) {
    throw new Error("Found nothing to return.");
  }

  if (body.length > 1) {
    throw new Error("Found multiple statements but wanted one");
  }

  return body[0];
});
exports.statement = statement;
const expression = {
  code: str => `(\n${str}\n)`,
  validate: ({
    program
  }) => {
    if (program.body.length > 1) {
      throw new Error("Found multiple statements but wanted one");
    }

    const expression = program.body[0].expression;

    if (expression.start === 0) {
      throw new Error("Parse result included parens.");
    }
  },
  unwrap: ast => ast.program.body[0].expression
};
exports.expression = expression;
const program = {
  code: str => str,
  validate: () => {},
  unwrap: ast => ast.program
};
exports.program = program;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618231, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTemplateBuilder;

var _options = require("./options");

var _string = _interopRequireDefault(require("./string"));

var _literal = _interopRequireDefault(require("./literal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NO_PLACEHOLDER = (0, _options.validate)({
  placeholderPattern: false
});

function createTemplateBuilder(formatter, defaultOpts) {
  const templateFnCache = new WeakMap();
  const templateAstCache = new WeakMap();
  const cachedOpts = defaultOpts || (0, _options.validate)(null);
  return Object.assign((tpl, ...args) => {
    if (typeof tpl === "string") {
      if (args.length > 1) throw new Error("Unexpected extra params.");
      return extendedTrace((0, _string.default)(formatter, tpl, (0, _options.merge)(cachedOpts, (0, _options.validate)(args[0]))));
    } else if (Array.isArray(tpl)) {
      let builder = templateFnCache.get(tpl);

      if (!builder) {
        builder = (0, _literal.default)(formatter, tpl, cachedOpts);
        templateFnCache.set(tpl, builder);
      }

      return extendedTrace(builder(args));
    } else if (typeof tpl === "object" && tpl) {
      if (args.length > 0) throw new Error("Unexpected extra params.");
      return createTemplateBuilder(formatter, (0, _options.merge)(cachedOpts, (0, _options.validate)(tpl)));
    }

    throw new Error(`Unexpected template param ${typeof tpl}`);
  }, {
    ast: (tpl, ...args) => {
      if (typeof tpl === "string") {
        if (args.length > 1) throw new Error("Unexpected extra params.");
        return (0, _string.default)(formatter, tpl, (0, _options.merge)((0, _options.merge)(cachedOpts, (0, _options.validate)(args[0])), NO_PLACEHOLDER))();
      } else if (Array.isArray(tpl)) {
        let builder = templateAstCache.get(tpl);

        if (!builder) {
          builder = (0, _literal.default)(formatter, tpl, (0, _options.merge)(cachedOpts, NO_PLACEHOLDER));
          templateAstCache.set(tpl, builder);
        }

        return builder(args)();
      }

      throw new Error(`Unexpected template param ${typeof tpl}`);
    }
  });
}

function extendedTrace(fn) {
  let rootStack = "";

  try {
    throw new Error();
  } catch (error) {
    if (error.stack) {
      rootStack = error.stack.split("\n").slice(3).join("\n");
    }
  }

  return arg => {
    try {
      return fn(arg);
    } catch (err) {
      err.stack += `\n    =============\n${rootStack}`;
      throw err;
    }
  };
}
}, function(modId) { var map = {"./options":1581324618232,"./string":1581324618233,"./literal":1581324618236}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618232, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;
exports.validate = validate;
exports.normalizeReplacements = normalizeReplacements;

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function merge(a, b) {
  const {
    placeholderWhitelist = a.placeholderWhitelist,
    placeholderPattern = a.placeholderPattern,
    preserveComments = a.preserveComments,
    syntacticPlaceholders = a.syntacticPlaceholders
  } = b;
  return {
    parser: Object.assign({}, a.parser, {}, b.parser),
    placeholderWhitelist,
    placeholderPattern,
    preserveComments,
    syntacticPlaceholders
  };
}

function validate(opts) {
  if (opts != null && typeof opts !== "object") {
    throw new Error("Unknown template options.");
  }

  const _ref = opts || {},
        {
    placeholderWhitelist,
    placeholderPattern,
    preserveComments,
    syntacticPlaceholders
  } = _ref,
        parser = _objectWithoutPropertiesLoose(_ref, ["placeholderWhitelist", "placeholderPattern", "preserveComments", "syntacticPlaceholders"]);

  if (placeholderWhitelist != null && !(placeholderWhitelist instanceof Set)) {
    throw new Error("'.placeholderWhitelist' must be a Set, null, or undefined");
  }

  if (placeholderPattern != null && !(placeholderPattern instanceof RegExp) && placeholderPattern !== false) {
    throw new Error("'.placeholderPattern' must be a RegExp, false, null, or undefined");
  }

  if (preserveComments != null && typeof preserveComments !== "boolean") {
    throw new Error("'.preserveComments' must be a boolean, null, or undefined");
  }

  if (syntacticPlaceholders != null && typeof syntacticPlaceholders !== "boolean") {
    throw new Error("'.syntacticPlaceholders' must be a boolean, null, or undefined");
  }

  if (syntacticPlaceholders === true && (placeholderWhitelist != null || placeholderPattern != null)) {
    throw new Error("'.placeholderWhitelist' and '.placeholderPattern' aren't compatible" + " with '.syntacticPlaceholders: true'");
  }

  return {
    parser,
    placeholderWhitelist: placeholderWhitelist || undefined,
    placeholderPattern: placeholderPattern == null ? undefined : placeholderPattern,
    preserveComments: preserveComments == null ? false : preserveComments,
    syntacticPlaceholders: syntacticPlaceholders == null ? undefined : syntacticPlaceholders
  };
}

function normalizeReplacements(replacements) {
  if (Array.isArray(replacements)) {
    return replacements.reduce((acc, replacement, i) => {
      acc["$" + i] = replacement;
      return acc;
    }, {});
  } else if (typeof replacements === "object" || replacements == null) {
    return replacements || undefined;
  }

  throw new Error("Template replacements must be an array, object, null, or undefined");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618233, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringTemplate;

var _options = require("./options");

var _parse = _interopRequireDefault(require("./parse"));

var _populate = _interopRequireDefault(require("./populate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringTemplate(formatter, code, opts) {
  code = formatter.code(code);
  let metadata;
  return arg => {
    const replacements = (0, _options.normalizeReplacements)(arg);
    if (!metadata) metadata = (0, _parse.default)(formatter, code, opts);
    return formatter.unwrap((0, _populate.default)(metadata, replacements));
  };
}
}, function(modId) { var map = {"./options":1581324618232,"./parse":1581324618234,"./populate":1581324618235}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618234, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseAndBuildMetadata;

var t = _interopRequireWildcard(require("@babel/types"));

var _parser = require("@babel/parser");

var _codeFrame = require("@babel/code-frame");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const PATTERN = /^[_$A-Z0-9]+$/;

function parseAndBuildMetadata(formatter, code, opts) {
  const ast = parseWithCodeFrame(code, opts.parser);
  const {
    placeholderWhitelist,
    placeholderPattern,
    preserveComments,
    syntacticPlaceholders
  } = opts;
  t.removePropertiesDeep(ast, {
    preserveComments
  });
  formatter.validate(ast);
  const syntactic = {
    placeholders: [],
    placeholderNames: new Set()
  };
  const legacy = {
    placeholders: [],
    placeholderNames: new Set()
  };
  const isLegacyRef = {
    value: undefined
  };
  t.traverse(ast, placeholderVisitorHandler, {
    syntactic,
    legacy,
    isLegacyRef,
    placeholderWhitelist,
    placeholderPattern,
    syntacticPlaceholders
  });
  return Object.assign({
    ast
  }, isLegacyRef.value ? legacy : syntactic);
}

function placeholderVisitorHandler(node, ancestors, state) {
  let name;

  if (t.isPlaceholder(node)) {
    if (state.syntacticPlaceholders === false) {
      throw new Error("%%foo%%-style placeholders can't be used when " + "'.syntacticPlaceholders' is false.");
    } else {
      name = node.name.name;
      state.isLegacyRef.value = false;
    }
  } else if (state.isLegacyRef.value === false || state.syntacticPlaceholders) {
    return;
  } else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
    name = node.name;
    state.isLegacyRef.value = true;
  } else if (t.isStringLiteral(node)) {
    name = node.value;
    state.isLegacyRef.value = true;
  } else {
    return;
  }

  if (!state.isLegacyRef.value && (state.placeholderPattern != null || state.placeholderWhitelist != null)) {
    throw new Error("'.placeholderWhitelist' and '.placeholderPattern' aren't compatible" + " with '.syntacticPlaceholders: true'");
  }

  if (state.isLegacyRef.value && (state.placeholderPattern === false || !(state.placeholderPattern || PATTERN).test(name)) && (!state.placeholderWhitelist || !state.placeholderWhitelist.has(name))) {
    return;
  }

  ancestors = ancestors.slice();
  const {
    node: parent,
    key
  } = ancestors[ancestors.length - 1];
  let type;

  if (t.isStringLiteral(node) || t.isPlaceholder(node, {
    expectedNode: "StringLiteral"
  })) {
    type = "string";
  } else if (t.isNewExpression(parent) && key === "arguments" || t.isCallExpression(parent) && key === "arguments" || t.isFunction(parent) && key === "params") {
    type = "param";
  } else if (t.isExpressionStatement(parent) && !t.isPlaceholder(node)) {
    type = "statement";
    ancestors = ancestors.slice(0, -1);
  } else if (t.isStatement(node) && t.isPlaceholder(node)) {
    type = "statement";
  } else {
    type = "other";
  }

  const {
    placeholders,
    placeholderNames
  } = state.isLegacyRef.value ? state.legacy : state.syntactic;
  placeholders.push({
    name,
    type,
    resolve: ast => resolveAncestors(ast, ancestors),
    isDuplicate: placeholderNames.has(name)
  });
  placeholderNames.add(name);
}

function resolveAncestors(ast, ancestors) {
  let parent = ast;

  for (let i = 0; i < ancestors.length - 1; i++) {
    const {
      key,
      index
    } = ancestors[i];

    if (index === undefined) {
      parent = parent[key];
    } else {
      parent = parent[key][index];
    }
  }

  const {
    key,
    index
  } = ancestors[ancestors.length - 1];
  return {
    parent,
    key,
    index
  };
}

function parseWithCodeFrame(code, parserOpts) {
  parserOpts = Object.assign({
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: "module"
  }, parserOpts, {
    plugins: (parserOpts.plugins || []).concat("placeholders")
  });

  try {
    return (0, _parser.parse)(code, parserOpts);
  } catch (err) {
    const loc = err.loc;

    if (loc) {
      err.message += "\n" + (0, _codeFrame.codeFrameColumns)(code, {
        start: loc
      });
      err.code = "BABEL_TEMPLATE_PARSE_ERROR";
    }

    throw err;
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618235, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = populatePlaceholders;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function populatePlaceholders(metadata, replacements) {
  const ast = t.cloneNode(metadata.ast);

  if (replacements) {
    metadata.placeholders.forEach(placeholder => {
      if (!Object.prototype.hasOwnProperty.call(replacements, placeholder.name)) {
        const placeholderName = placeholder.name;
        throw new Error(`Error: No substitution given for "${placeholderName}". If this is not meant to be a
            placeholder you may want to consider passing one of the following options to @babel/template:
            - { placeholderPattern: false, placeholderWhitelist: new Set(['${placeholderName}'])}
            - { placeholderPattern: /^${placeholderName}$/ }`);
      }
    });
    Object.keys(replacements).forEach(key => {
      if (!metadata.placeholderNames.has(key)) {
        throw new Error(`Unknown substitution "${key}" given`);
      }
    });
  }

  metadata.placeholders.slice().reverse().forEach(placeholder => {
    try {
      applyReplacement(placeholder, ast, replacements && replacements[placeholder.name] || null);
    } catch (e) {
      e.message = `@babel/template placeholder "${placeholder.name}": ${e.message}`;
      throw e;
    }
  });
  return ast;
}

function applyReplacement(placeholder, ast, replacement) {
  if (placeholder.isDuplicate) {
    if (Array.isArray(replacement)) {
      replacement = replacement.map(node => t.cloneNode(node));
    } else if (typeof replacement === "object") {
      replacement = t.cloneNode(replacement);
    }
  }

  const {
    parent,
    key,
    index
  } = placeholder.resolve(ast);

  if (placeholder.type === "string") {
    if (typeof replacement === "string") {
      replacement = t.stringLiteral(replacement);
    }

    if (!replacement || !t.isStringLiteral(replacement)) {
      throw new Error("Expected string substitution");
    }
  } else if (placeholder.type === "statement") {
    if (index === undefined) {
      if (!replacement) {
        replacement = t.emptyStatement();
      } else if (Array.isArray(replacement)) {
        replacement = t.blockStatement(replacement);
      } else if (typeof replacement === "string") {
        replacement = t.expressionStatement(t.identifier(replacement));
      } else if (!t.isStatement(replacement)) {
        replacement = t.expressionStatement(replacement);
      }
    } else {
      if (replacement && !Array.isArray(replacement)) {
        if (typeof replacement === "string") {
          replacement = t.identifier(replacement);
        }

        if (!t.isStatement(replacement)) {
          replacement = t.expressionStatement(replacement);
        }
      }
    }
  } else if (placeholder.type === "param") {
    if (typeof replacement === "string") {
      replacement = t.identifier(replacement);
    }

    if (index === undefined) throw new Error("Assertion failure.");
  } else {
    if (typeof replacement === "string") {
      replacement = t.identifier(replacement);
    }

    if (Array.isArray(replacement)) {
      throw new Error("Cannot replace single expression with an array.");
    }
  }

  if (index === undefined) {
    t.validate(parent, key, replacement);
    parent[key] = replacement;
  } else {
    const items = parent[key].slice();

    if (placeholder.type === "statement" || placeholder.type === "param") {
      if (replacement == null) {
        items.splice(index, 1);
      } else if (Array.isArray(replacement)) {
        items.splice(index, 1, ...replacement);
      } else {
        items[index] = replacement;
      }
    } else {
      items[index] = replacement;
    }

    t.validate(parent, key, items);
    parent[key] = items;
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618236, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = literalTemplate;

var _options = require("./options");

var _parse = _interopRequireDefault(require("./parse"));

var _populate = _interopRequireDefault(require("./populate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function literalTemplate(formatter, tpl, opts) {
  const {
    metadata,
    names
  } = buildLiteralData(formatter, tpl, opts);
  return arg => {
    const defaultReplacements = arg.reduce((acc, replacement, i) => {
      acc[names[i]] = replacement;
      return acc;
    }, {});
    return arg => {
      const replacements = (0, _options.normalizeReplacements)(arg);

      if (replacements) {
        Object.keys(replacements).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(defaultReplacements, key)) {
            throw new Error("Unexpected replacement overlap.");
          }
        });
      }

      return formatter.unwrap((0, _populate.default)(metadata, replacements ? Object.assign(replacements, defaultReplacements) : defaultReplacements));
    };
  };
}

function buildLiteralData(formatter, tpl, opts) {
  let names;
  let nameSet;
  let metadata;
  let prefix = "";

  do {
    prefix += "$";
    const result = buildTemplateCode(tpl, prefix);
    names = result.names;
    nameSet = new Set(names);
    metadata = (0, _parse.default)(formatter, formatter.code(result.code), {
      parser: opts.parser,
      placeholderWhitelist: new Set(result.names.concat(opts.placeholderWhitelist ? Array.from(opts.placeholderWhitelist) : [])),
      placeholderPattern: opts.placeholderPattern,
      preserveComments: opts.preserveComments,
      syntacticPlaceholders: opts.syntacticPlaceholders
    });
  } while (metadata.placeholders.some(placeholder => placeholder.isDuplicate && nameSet.has(placeholder.name)));

  return {
    metadata,
    names
  };
}

function buildTemplateCode(tpl, prefix) {
  const names = [];
  let code = tpl[0];

  for (let i = 1; i < tpl.length; i++) {
    const value = `${prefix}${i - 1}`;
    names.push(value);
    code += value + tpl[i];
  }

  return {
    names,
    code
  };
}
}, function(modId) { var map = {"./options":1581324618232,"./parse":1581324618234,"./populate":1581324618235}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1581324618229);
})()
//# sourceMappingURL=index.js.map