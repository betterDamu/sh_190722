module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1581324618475, function(require, module, exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var fs = require("fs");
var through = require("through");
var transform = require("./lib/visit").transform;
var utils = require("./lib/util");
var genOrAsyncFunExp = /\bfunction\s*\*|\basync\b/;

function exports(file, options) {
  var data = [];
  return through(write, end);

  function write(buf) {
    data.push(buf);
  }

  function end() {
    try {
      this.queue(compile(data.join(""), options).code);
      this.queue(null);
    } catch (e) { this.emit('error', e); }
  }
}

// To get a writable stream for use as a browserify transform, call
// require("regenerator")().
module.exports = exports;

// To include the runtime globally in the current node process, call
// require("regenerator").runtime().
function runtime() {
  regeneratorRuntime = require("regenerator-runtime");
}
exports.runtime = runtime;
runtime.path = require("regenerator-runtime/path.js").path;

var cachedRuntimeCode;
function getRuntimeCode() {
  return cachedRuntimeCode ||
    (cachedRuntimeCode = fs.readFileSync(runtime.path, "utf8"));
}

var transformOptions = {
  presets: [require("regenerator-preset")],
  parserOpts: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    strictMode: false,
    plugins: ["*", "jsx", "flow"]
  }
};

function compile(source, options) {
  var result;

  options = utils.defaults(options || {}, {
    includeRuntime: false
  });

  // Shortcut: Transform only if generators or async functions present.
  if (genOrAsyncFunExp.test(source)) {
    result = require("@babel/core").transformSync(source, transformOptions);
  } else {
    result = { code: source };
  }

  if (options.includeRuntime === true) {
    result.code = getRuntimeCode() + "\n" + result.code;
  }

  return result;
}

// Allow packages that depend on Regenerator to use the same copy of
// ast-types, in case multiple versions are installed by NPM.
exports.types = require("recast").types;

// Transforms a string of source code, returning a { code, map? } result.
exports.compile = compile;

// To modify an AST directly, call require("regenerator").transform(ast).
exports.transform = transform;

}, function(modId) {var map = {"./lib/visit":1581324618476,"./lib/util":1581324618477}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618476, function(require, module, exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var recast = require("recast");
var types = recast.types;
var n = types.namedTypes;
var util = require("./util.js");

exports.transform = function transform(node, options) {
  options = util.defaults(options || {}, {
    includeRuntime: false
  });

  var result = require("@babel/core").transformFromAstSync(node, null, {
    presets: [require("regenerator-preset")],
    code: false,
    ast: true
  });

  node = result.ast;

  if (options.includeRuntime === true) {
    injectRuntime(n.File.check(node) ? node.program : node);
  }

  return node;
};

function injectRuntime(program) {
  n.Program.assert(program);

  // Include the runtime by modifying the AST rather than by concatenating
  // strings. This technique will allow for more accurate source mapping.
  var runtimePath = require("..").runtime.path;
  var runtime = fs.readFileSync(runtimePath, "utf8");
  var runtimeBody = recast.parse(runtime, {
    sourceFileName: runtimePath
  }).program.body;

  var body = program.body;
  body.unshift.apply(body, runtimeBody);
}

}, function(modId) { var map = {"./util.js":1581324618477}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618477, function(require, module, exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var assert = require("assert");
var types = require("recast").types;
var n = types.namedTypes;
var b = types.builders;
var hasOwn = Object.prototype.hasOwnProperty;

exports.defaults = function(obj) {
  var len = arguments.length;
  var extension;

  for (var i = 1; i < len; ++i) {
    if ((extension = arguments[i])) {
      for (var key in extension) {
        if (hasOwn.call(extension, key) && !hasOwn.call(obj, key)) {
          obj[key] = extension[key];
        }
      }
    }
  }

  return obj;
};

exports.runtimeProperty = function(name) {
  return b.memberExpression(
    b.identifier("regeneratorRuntime"),
    b.identifier(name),
    false
  );
};

// Inspired by the isReference function from ast-util:
// https://github.com/eventualbuddha/ast-util/blob/9bf91c5ce8/lib/index.js#L466-L506
exports.isReference = function(path, name) {
  var node = path.value;

  if (!n.Identifier.check(node)) {
    return false;
  }

  if (name && node.name !== name) {
    return false;
  }

  var parent = path.parent.value;

  switch (parent.type) {
  case "VariableDeclarator":
    return path.name === "init";

  case "MemberExpression":
    return path.name === "object" || (
      parent.computed && path.name === "property"
    );

  case "FunctionExpression":
  case "FunctionDeclaration":
  case "ArrowFunctionExpression":
    if (path.name === "id") {
      return false;
    }

    if (path.parentPath.name === "params" &&
        parent.params === path.parentPath.value &&
        parent.params[path.name] === node) {
      return false;
    }

    return true;

  case "ClassDeclaration":
  case "ClassExpression":
    return path.name !== "id";

  case "CatchClause":
    return path.name !== "param";

  case "Property":
  case "MethodDefinition":
    return path.name !== "key";

  case "ImportSpecifier":
  case "ImportDefaultSpecifier":
  case "ImportNamespaceSpecifier":
  case "LabeledStatement":
    return false;

  default:
    return true;
  }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1581324618475);
})()
//# sourceMappingURL=index.js.map