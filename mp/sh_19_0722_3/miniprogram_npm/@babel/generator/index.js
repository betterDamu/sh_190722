module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1581324618186, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.CodeGenerator = void 0;

var _sourceMap = _interopRequireDefault(require("./source-map"));

var _printer = _interopRequireDefault(require("./printer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Generator extends _printer.default {
  constructor(ast, opts = {}, code) {
    const format = normalizeOptions(code, opts);
    const map = opts.sourceMaps ? new _sourceMap.default(opts, code) : null;
    super(format, map);
    this.ast = ast;
  }

  generate() {
    return super.generate(this.ast);
  }

}

function normalizeOptions(code, opts) {
  const format = {
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    shouldPrintComment: opts.shouldPrintComment,
    retainLines: opts.retainLines,
    retainFunctionParens: opts.retainFunctionParens,
    comments: opts.comments == null || opts.comments,
    compact: opts.compact,
    minified: opts.minified,
    concise: opts.concise,
    jsonCompatibleStrings: opts.jsonCompatibleStrings,
    indent: {
      adjustMultilineComment: true,
      style: "  ",
      base: 0
    },
    decoratorsBeforeExport: !!opts.decoratorsBeforeExport,
    jsescOption: Object.assign({
      quotes: "double",
      wrap: true
    }, opts.jsescOption)
  };

  if (format.minified) {
    format.compact = true;

    format.shouldPrintComment = format.shouldPrintComment || (() => format.comments);
  } else {
    format.shouldPrintComment = format.shouldPrintComment || (value => format.comments || value.indexOf("@license") >= 0 || value.indexOf("@preserve") >= 0);
  }

  if (format.compact === "auto") {
    format.compact = code.length > 500000;

    if (format.compact) {
      console.error("[BABEL] Note: The code generator has deoptimised the styling of " + `${opts.filename} as it exceeds the max of ${"500KB"}.`);
    }
  }

  if (format.compact) {
    format.indent.adjustMultilineComment = false;
  }

  return format;
}

class CodeGenerator {
  constructor(ast, opts, code) {
    this._generator = new Generator(ast, opts, code);
  }

  generate() {
    return this._generator.generate();
  }

}

exports.CodeGenerator = CodeGenerator;

function _default(ast, opts, code) {
  const gen = new Generator(ast, opts, code);
  return gen.generate();
}
}, function(modId) {var map = {"./source-map":1581324618187,"./printer":1581324618188}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618187, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sourceMap = _interopRequireDefault(require("source-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SourceMap {
  constructor(opts, code) {
    this._cachedMap = null;
    this._code = code;
    this._opts = opts;
    this._rawMappings = [];
  }

  get() {
    if (!this._cachedMap) {
      const map = this._cachedMap = new _sourceMap.default.SourceMapGenerator({
        sourceRoot: this._opts.sourceRoot
      });
      const code = this._code;

      if (typeof code === "string") {
        map.setSourceContent(this._opts.sourceFileName.replace(/\\/g, "/"), code);
      } else if (typeof code === "object") {
        Object.keys(code).forEach(sourceFileName => {
          map.setSourceContent(sourceFileName.replace(/\\/g, "/"), code[sourceFileName]);
        });
      }

      this._rawMappings.forEach(mapping => map.addMapping(mapping), map);
    }

    return this._cachedMap.toJSON();
  }

  getRawMappings() {
    return this._rawMappings.slice();
  }

  mark(generatedLine, generatedColumn, line, column, identifierName, filename, force) {
    if (this._lastGenLine !== generatedLine && line === null) return;

    if (!force && this._lastGenLine === generatedLine && this._lastSourceLine === line && this._lastSourceColumn === column) {
      return;
    }

    this._cachedMap = null;
    this._lastGenLine = generatedLine;
    this._lastSourceLine = line;
    this._lastSourceColumn = column;

    this._rawMappings.push({
      name: identifierName || undefined,
      generated: {
        line: generatedLine,
        column: generatedColumn
      },
      source: line == null ? undefined : (filename || this._opts.sourceFileName).replace(/\\/g, "/"),
      original: line == null ? undefined : {
        line: line,
        column: column
      }
    });
  }

}

exports.default = SourceMap;
}, function(modId) { var map = {"source-map":1581324618187}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618188, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isInteger = _interopRequireDefault(require("lodash/isInteger"));

var _repeat = _interopRequireDefault(require("lodash/repeat"));

var _buffer = _interopRequireDefault(require("./buffer"));

var n = _interopRequireWildcard(require("./node"));

var t = _interopRequireWildcard(require("@babel/types"));

var generatorFunctions = _interopRequireWildcard(require("./generators"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SCIENTIFIC_NOTATION = /e/i;
const ZERO_DECIMAL_INTEGER = /\.0+$/;
const NON_DECIMAL_LITERAL = /^0[box]/;

class Printer {
  constructor(format, map) {
    this.inForStatementInitCounter = 0;
    this._printStack = [];
    this._indent = 0;
    this._insideAux = false;
    this._printedCommentStarts = {};
    this._parenPushNewlineState = null;
    this._noLineTerminator = false;
    this._printAuxAfterOnNextUserNode = false;
    this._printedComments = new WeakSet();
    this._endsWithInteger = false;
    this._endsWithWord = false;
    this.format = format || {};
    this._buf = new _buffer.default(map);
  }

  generate(ast) {
    this.print(ast);

    this._maybeAddAuxComment();

    return this._buf.get();
  }

  indent() {
    if (this.format.compact || this.format.concise) return;
    this._indent++;
  }

  dedent() {
    if (this.format.compact || this.format.concise) return;
    this._indent--;
  }

  semicolon(force = false) {
    this._maybeAddAuxComment();

    this._append(";", !force);
  }

  rightBrace() {
    if (this.format.minified) {
      this._buf.removeLastSemicolon();
    }

    this.token("}");
  }

  space(force = false) {
    if (this.format.compact) return;

    if (this._buf.hasContent() && !this.endsWith(" ") && !this.endsWith("\n") || force) {
      this._space();
    }
  }

  word(str) {
    if (this._endsWithWord || this.endsWith("/") && str.indexOf("/") === 0) {
      this._space();
    }

    this._maybeAddAuxComment();

    this._append(str);

    this._endsWithWord = true;
  }

  number(str) {
    this.word(str);
    this._endsWithInteger = (0, _isInteger.default)(+str) && !NON_DECIMAL_LITERAL.test(str) && !SCIENTIFIC_NOTATION.test(str) && !ZERO_DECIMAL_INTEGER.test(str) && str[str.length - 1] !== ".";
  }

  token(str) {
    if (str === "--" && this.endsWith("!") || str[0] === "+" && this.endsWith("+") || str[0] === "-" && this.endsWith("-") || str[0] === "." && this._endsWithInteger) {
      this._space();
    }

    this._maybeAddAuxComment();

    this._append(str);
  }

  newline(i) {
    if (this.format.retainLines || this.format.compact) return;

    if (this.format.concise) {
      this.space();
      return;
    }

    if (this.endsWith("\n\n")) return;
    if (typeof i !== "number") i = 1;
    i = Math.min(2, i);
    if (this.endsWith("{\n") || this.endsWith(":\n")) i--;
    if (i <= 0) return;

    for (let j = 0; j < i; j++) {
      this._newline();
    }
  }

  endsWith(str) {
    return this._buf.endsWith(str);
  }

  removeTrailingNewline() {
    this._buf.removeTrailingNewline();
  }

  exactSource(loc, cb) {
    this._catchUp("start", loc);

    this._buf.exactSource(loc, cb);
  }

  source(prop, loc) {
    this._catchUp(prop, loc);

    this._buf.source(prop, loc);
  }

  withSource(prop, loc, cb) {
    this._catchUp(prop, loc);

    this._buf.withSource(prop, loc, cb);
  }

  _space() {
    this._append(" ", true);
  }

  _newline() {
    this._append("\n", true);
  }

  _append(str, queue = false) {
    this._maybeAddParen(str);

    this._maybeIndent(str);

    if (queue) this._buf.queue(str);else this._buf.append(str);
    this._endsWithWord = false;
    this._endsWithInteger = false;
  }

  _maybeIndent(str) {
    if (this._indent && this.endsWith("\n") && str[0] !== "\n") {
      this._buf.queue(this._getIndent());
    }
  }

  _maybeAddParen(str) {
    const parenPushNewlineState = this._parenPushNewlineState;
    if (!parenPushNewlineState) return;
    this._parenPushNewlineState = null;
    let i;

    for (i = 0; i < str.length && str[i] === " "; i++) continue;

    if (i === str.length) return;
    const cha = str[i];

    if (cha !== "\n") {
      if (cha !== "/") return;
      if (i + 1 === str.length) return;
      const chaPost = str[i + 1];
      if (chaPost !== "/" && chaPost !== "*") return;
    }

    this.token("(");
    this.indent();
    parenPushNewlineState.printed = true;
  }

  _catchUp(prop, loc) {
    if (!this.format.retainLines) return;
    const pos = loc ? loc[prop] : null;

    if (pos && pos.line !== null) {
      const count = pos.line - this._buf.getCurrentLine();

      for (let i = 0; i < count; i++) {
        this._newline();
      }
    }
  }

  _getIndent() {
    return (0, _repeat.default)(this.format.indent.style, this._indent);
  }

  startTerminatorless(isLabel = false) {
    if (isLabel) {
      this._noLineTerminator = true;
      return null;
    } else {
      return this._parenPushNewlineState = {
        printed: false
      };
    }
  }

  endTerminatorless(state) {
    this._noLineTerminator = false;

    if (state && state.printed) {
      this.dedent();
      this.newline();
      this.token(")");
    }
  }

  print(node, parent) {
    if (!node) return;
    const oldConcise = this.format.concise;

    if (node._compact) {
      this.format.concise = true;
    }

    const printMethod = this[node.type];

    if (!printMethod) {
      throw new ReferenceError(`unknown node of type ${JSON.stringify(node.type)} with constructor ${JSON.stringify(node && node.constructor.name)}`);
    }

    this._printStack.push(node);

    const oldInAux = this._insideAux;
    this._insideAux = !node.loc;

    this._maybeAddAuxComment(this._insideAux && !oldInAux);

    let needsParens = n.needsParens(node, parent, this._printStack);

    if (this.format.retainFunctionParens && node.type === "FunctionExpression" && node.extra && node.extra.parenthesized) {
      needsParens = true;
    }

    if (needsParens) this.token("(");

    this._printLeadingComments(node);

    const loc = t.isProgram(node) || t.isFile(node) ? null : node.loc;
    this.withSource("start", loc, () => {
      printMethod.call(this, node, parent);
    });

    this._printTrailingComments(node);

    if (needsParens) this.token(")");

    this._printStack.pop();

    this.format.concise = oldConcise;
    this._insideAux = oldInAux;
  }

  _maybeAddAuxComment(enteredPositionlessNode) {
    if (enteredPositionlessNode) this._printAuxBeforeComment();
    if (!this._insideAux) this._printAuxAfterComment();
  }

  _printAuxBeforeComment() {
    if (this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = true;
    const comment = this.format.auxiliaryCommentBefore;

    if (comment) {
      this._printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  }

  _printAuxAfterComment() {
    if (!this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = false;
    const comment = this.format.auxiliaryCommentAfter;

    if (comment) {
      this._printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  }

  getPossibleRaw(node) {
    const extra = node.extra;

    if (extra && extra.raw != null && extra.rawValue != null && node.value === extra.rawValue) {
      return extra.raw;
    }
  }

  printJoin(nodes, parent, opts = {}) {
    if (!nodes || !nodes.length) return;
    if (opts.indent) this.indent();
    const newlineOpts = {
      addNewlines: opts.addNewlines
    };

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      if (opts.statement) this._printNewline(true, node, parent, newlineOpts);
      this.print(node, parent);

      if (opts.iterator) {
        opts.iterator(node, i);
      }

      if (opts.separator && i < nodes.length - 1) {
        opts.separator.call(this);
      }

      if (opts.statement) this._printNewline(false, node, parent, newlineOpts);
    }

    if (opts.indent) this.dedent();
  }

  printAndIndentOnComments(node, parent) {
    const indent = node.leadingComments && node.leadingComments.length > 0;
    if (indent) this.indent();
    this.print(node, parent);
    if (indent) this.dedent();
  }

  printBlock(parent) {
    const node = parent.body;

    if (!t.isEmptyStatement(node)) {
      this.space();
    }

    this.print(node, parent);
  }

  _printTrailingComments(node) {
    this._printComments(this._getComments(false, node));
  }

  _printLeadingComments(node) {
    this._printComments(this._getComments(true, node));
  }

  printInnerComments(node, indent = true) {
    if (!node.innerComments || !node.innerComments.length) return;
    if (indent) this.indent();

    this._printComments(node.innerComments);

    if (indent) this.dedent();
  }

  printSequence(nodes, parent, opts = {}) {
    opts.statement = true;
    return this.printJoin(nodes, parent, opts);
  }

  printList(items, parent, opts = {}) {
    if (opts.separator == null) {
      opts.separator = commaSeparator;
    }

    return this.printJoin(items, parent, opts);
  }

  _printNewline(leading, node, parent, opts) {
    if (this.format.retainLines || this.format.compact) return;

    if (this.format.concise) {
      this.space();
      return;
    }

    let lines = 0;

    if (this._buf.hasContent()) {
      if (!leading) lines++;
      if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;
      const needs = leading ? n.needsWhitespaceBefore : n.needsWhitespaceAfter;
      if (needs(node, parent)) lines++;
    }

    this.newline(lines);
  }

  _getComments(leading, node) {
    return node && (leading ? node.leadingComments : node.trailingComments) || [];
  }

  _printComment(comment) {
    if (!this.format.shouldPrintComment(comment.value)) return;
    if (comment.ignore) return;
    if (this._printedComments.has(comment)) return;

    this._printedComments.add(comment);

    if (comment.start != null) {
      if (this._printedCommentStarts[comment.start]) return;
      this._printedCommentStarts[comment.start] = true;
    }

    const isBlockComment = comment.type === "CommentBlock";
    this.newline(this._buf.hasContent() && !this._noLineTerminator && isBlockComment ? 1 : 0);
    if (!this.endsWith("[") && !this.endsWith("{")) this.space();
    let val = !isBlockComment && !this._noLineTerminator ? `//${comment.value}\n` : `/*${comment.value}*/`;

    if (isBlockComment && this.format.indent.adjustMultilineComment) {
      const offset = comment.loc && comment.loc.start.column;

      if (offset) {
        const newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
        val = val.replace(newlineRegex, "\n");
      }

      const indentSize = Math.max(this._getIndent().length, this._buf.getCurrentColumn());
      val = val.replace(/\n(?!$)/g, `\n${(0, _repeat.default)(" ", indentSize)}`);
    }

    if (this.endsWith("/")) this._space();
    this.withSource("start", comment.loc, () => {
      this._append(val);
    });
    this.newline(isBlockComment && !this._noLineTerminator ? 1 : 0);
  }

  _printComments(comments) {
    if (!comments || !comments.length) return;

    for (const comment of comments) {
      this._printComment(comment);
    }
  }

}

exports.default = Printer;
Object.assign(Printer.prototype, generatorFunctions);

function commaSeparator() {
  this.token(",");
  this.space();
}
}, function(modId) { var map = {"./buffer":1581324618189,"./node":1581324618190,"./generators":1581324618193}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618189, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const SPACES_RE = /^[ \t]+$/;

class Buffer {
  constructor(map) {
    this._map = null;
    this._buf = [];
    this._last = "";
    this._queue = [];
    this._position = {
      line: 1,
      column: 0
    };
    this._sourcePosition = {
      identifierName: null,
      line: null,
      column: null,
      filename: null
    };
    this._disallowedPop = null;
    this._map = map;
  }

  get() {
    this._flush();

    const map = this._map;
    const result = {
      code: this._buf.join("").trimRight(),
      map: null,
      rawMappings: map && map.getRawMappings()
    };

    if (map) {
      Object.defineProperty(result, "map", {
        configurable: true,
        enumerable: true,

        get() {
          return this.map = map.get();
        },

        set(value) {
          Object.defineProperty(this, "map", {
            value,
            writable: true
          });
        }

      });
    }

    return result;
  }

  append(str) {
    this._flush();

    const {
      line,
      column,
      filename,
      identifierName,
      force
    } = this._sourcePosition;

    this._append(str, line, column, identifierName, filename, force);
  }

  queue(str) {
    if (str === "\n") {
      while (this._queue.length > 0 && SPACES_RE.test(this._queue[0][0])) {
        this._queue.shift();
      }
    }

    const {
      line,
      column,
      filename,
      identifierName,
      force
    } = this._sourcePosition;

    this._queue.unshift([str, line, column, identifierName, filename, force]);
  }

  _flush() {
    let item;

    while (item = this._queue.pop()) this._append(...item);
  }

  _append(str, line, column, identifierName, filename, force) {
    if (this._map && str[0] !== "\n") {
      this._map.mark(this._position.line, this._position.column, line, column, identifierName, filename, force);
    }

    this._buf.push(str);

    this._last = str[str.length - 1];

    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        this._position.line++;
        this._position.column = 0;
      } else {
        this._position.column++;
      }
    }
  }

  removeTrailingNewline() {
    if (this._queue.length > 0 && this._queue[0][0] === "\n") {
      this._queue.shift();
    }
  }

  removeLastSemicolon() {
    if (this._queue.length > 0 && this._queue[0][0] === ";") {
      this._queue.shift();
    }
  }

  endsWith(suffix) {
    if (suffix.length === 1) {
      let last;

      if (this._queue.length > 0) {
        const str = this._queue[0][0];
        last = str[str.length - 1];
      } else {
        last = this._last;
      }

      return last === suffix;
    }

    const end = this._last + this._queue.reduce((acc, item) => item[0] + acc, "");

    if (suffix.length <= end.length) {
      return end.slice(-suffix.length) === suffix;
    }

    return false;
  }

  hasContent() {
    return this._queue.length > 0 || !!this._last;
  }

  exactSource(loc, cb) {
    this.source("start", loc, true);
    cb();
    this.source("end", loc);

    this._disallowPop("start", loc);
  }

  source(prop, loc, force) {
    if (prop && !loc) return;

    this._normalizePosition(prop, loc, this._sourcePosition, force);
  }

  withSource(prop, loc, cb) {
    if (!this._map) return cb();
    const originalLine = this._sourcePosition.line;
    const originalColumn = this._sourcePosition.column;
    const originalFilename = this._sourcePosition.filename;
    const originalIdentifierName = this._sourcePosition.identifierName;
    this.source(prop, loc);
    cb();

    if ((!this._sourcePosition.force || this._sourcePosition.line !== originalLine || this._sourcePosition.column !== originalColumn || this._sourcePosition.filename !== originalFilename) && (!this._disallowedPop || this._disallowedPop.line !== originalLine || this._disallowedPop.column !== originalColumn || this._disallowedPop.filename !== originalFilename)) {
      this._sourcePosition.line = originalLine;
      this._sourcePosition.column = originalColumn;
      this._sourcePosition.filename = originalFilename;
      this._sourcePosition.identifierName = originalIdentifierName;
      this._sourcePosition.force = false;
      this._disallowedPop = null;
    }
  }

  _disallowPop(prop, loc) {
    if (prop && !loc) return;
    this._disallowedPop = this._normalizePosition(prop, loc);
  }

  _normalizePosition(prop, loc, targetObj, force) {
    const pos = loc ? loc[prop] : null;

    if (targetObj === undefined) {
      targetObj = {
        identifierName: null,
        line: null,
        column: null,
        filename: null,
        force: false
      };
    }

    const origLine = targetObj.line;
    const origColumn = targetObj.column;
    const origFilename = targetObj.filename;
    targetObj.identifierName = prop === "start" && loc && loc.identifierName || null;
    targetObj.line = pos ? pos.line : null;
    targetObj.column = pos ? pos.column : null;
    targetObj.filename = loc && loc.filename || null;

    if (force || targetObj.line !== origLine || targetObj.column !== origColumn || targetObj.filename !== origFilename) {
      targetObj.force = force;
    }

    return targetObj;
  }

  getCurrentColumn() {
    const extra = this._queue.reduce((acc, item) => item[0] + acc, "");

    const lastIndex = extra.lastIndexOf("\n");
    return lastIndex === -1 ? this._position.column + extra.length : extra.length - 1 - lastIndex;
  }

  getCurrentLine() {
    const extra = this._queue.reduce((acc, item) => item[0] + acc, "");

    let count = 0;

    for (let i = 0; i < extra.length; i++) {
      if (extra[i] === "\n") count++;
    }

    return this._position.line + count;
  }

}

exports.default = Buffer;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618190, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.needsWhitespace = needsWhitespace;
exports.needsWhitespaceBefore = needsWhitespaceBefore;
exports.needsWhitespaceAfter = needsWhitespaceAfter;
exports.needsParens = needsParens;

var whitespace = _interopRequireWildcard(require("./whitespace"));

var parens = _interopRequireWildcard(require("./parentheses"));

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function expandAliases(obj) {
  const newObj = {};

  function add(type, func) {
    const fn = newObj[type];
    newObj[type] = fn ? function (node, parent, stack) {
      const result = fn(node, parent, stack);
      return result == null ? func(node, parent, stack) : result;
    } : func;
  }

  for (const type of Object.keys(obj)) {
    const aliases = t.FLIPPED_ALIAS_KEYS[type];

    if (aliases) {
      for (const alias of aliases) {
        add(alias, obj[type]);
      }
    } else {
      add(type, obj[type]);
    }
  }

  return newObj;
}

const expandedParens = expandAliases(parens);
const expandedWhitespaceNodes = expandAliases(whitespace.nodes);
const expandedWhitespaceList = expandAliases(whitespace.list);

function find(obj, node, parent, printStack) {
  const fn = obj[node.type];
  return fn ? fn(node, parent, printStack) : null;
}

function isOrHasCallExpression(node) {
  if (t.isCallExpression(node)) {
    return true;
  }

  if (t.isMemberExpression(node)) {
    return isOrHasCallExpression(node.object) || !node.computed && isOrHasCallExpression(node.property);
  } else {
    return false;
  }
}

function needsWhitespace(node, parent, type) {
  if (!node) return 0;

  if (t.isExpressionStatement(node)) {
    node = node.expression;
  }

  let linesInfo = find(expandedWhitespaceNodes, node, parent);

  if (!linesInfo) {
    const items = find(expandedWhitespaceList, node, parent);

    if (items) {
      for (let i = 0; i < items.length; i++) {
        linesInfo = needsWhitespace(items[i], node, type);
        if (linesInfo) break;
      }
    }
  }

  if (typeof linesInfo === "object" && linesInfo !== null) {
    return linesInfo[type] || 0;
  }

  return 0;
}

function needsWhitespaceBefore(node, parent) {
  return needsWhitespace(node, parent, "before");
}

function needsWhitespaceAfter(node, parent) {
  return needsWhitespace(node, parent, "after");
}

function needsParens(node, parent, printStack) {
  if (!parent) return false;

  if (t.isNewExpression(parent) && parent.callee === node) {
    if (isOrHasCallExpression(node)) return true;
  }

  if (t.isLogicalExpression(node) && parent.operator === "??") return true;
  return find(expandedParens, node, parent, printStack);
}
}, function(modId) { var map = {"./whitespace":1581324618191,"./parentheses":1581324618192}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618191, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = exports.nodes = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function crawl(node, state = {}) {
  if (t.isMemberExpression(node)) {
    crawl(node.object, state);
    if (node.computed) crawl(node.property, state);
  } else if (t.isBinary(node) || t.isAssignmentExpression(node)) {
    crawl(node.left, state);
    crawl(node.right, state);
  } else if (t.isCallExpression(node)) {
    state.hasCall = true;
    crawl(node.callee, state);
  } else if (t.isFunction(node)) {
    state.hasFunction = true;
  } else if (t.isIdentifier(node)) {
    state.hasHelper = state.hasHelper || isHelper(node.callee);
  }

  return state;
}

function isHelper(node) {
  if (t.isMemberExpression(node)) {
    return isHelper(node.object) || isHelper(node.property);
  } else if (t.isIdentifier(node)) {
    return node.name === "require" || node.name[0] === "_";
  } else if (t.isCallExpression(node)) {
    return isHelper(node.callee);
  } else if (t.isBinary(node) || t.isAssignmentExpression(node)) {
    return t.isIdentifier(node.left) && isHelper(node.left) || isHelper(node.right);
  } else {
    return false;
  }
}

function isType(node) {
  return t.isLiteral(node) || t.isObjectExpression(node) || t.isArrayExpression(node) || t.isIdentifier(node) || t.isMemberExpression(node);
}

const nodes = {
  AssignmentExpression(node) {
    const state = crawl(node.right);

    if (state.hasCall && state.hasHelper || state.hasFunction) {
      return {
        before: state.hasFunction,
        after: true
      };
    }
  },

  SwitchCase(node, parent) {
    return {
      before: node.consequent.length || parent.cases[0] === node,
      after: !node.consequent.length && parent.cases[parent.cases.length - 1] === node
    };
  },

  LogicalExpression(node) {
    if (t.isFunction(node.left) || t.isFunction(node.right)) {
      return {
        after: true
      };
    }
  },

  Literal(node) {
    if (node.value === "use strict") {
      return {
        after: true
      };
    }
  },

  CallExpression(node) {
    if (t.isFunction(node.callee) || isHelper(node)) {
      return {
        before: true,
        after: true
      };
    }
  },

  VariableDeclaration(node) {
    for (let i = 0; i < node.declarations.length; i++) {
      const declar = node.declarations[i];
      let enabled = isHelper(declar.id) && !isType(declar.init);

      if (!enabled) {
        const state = crawl(declar.init);
        enabled = isHelper(declar.init) && state.hasCall || state.hasFunction;
      }

      if (enabled) {
        return {
          before: true,
          after: true
        };
      }
    }
  },

  IfStatement(node) {
    if (t.isBlockStatement(node.consequent)) {
      return {
        before: true,
        after: true
      };
    }
  }

};
exports.nodes = nodes;

nodes.ObjectProperty = nodes.ObjectTypeProperty = nodes.ObjectMethod = function (node, parent) {
  if (parent.properties[0] === node) {
    return {
      before: true
    };
  }
};

nodes.ObjectTypeCallProperty = function (node, parent) {
  if (parent.callProperties[0] === node && (!parent.properties || !parent.properties.length)) {
    return {
      before: true
    };
  }
};

nodes.ObjectTypeIndexer = function (node, parent) {
  if (parent.indexers[0] === node && (!parent.properties || !parent.properties.length) && (!parent.callProperties || !parent.callProperties.length)) {
    return {
      before: true
    };
  }
};

nodes.ObjectTypeInternalSlot = function (node, parent) {
  if (parent.internalSlots[0] === node && (!parent.properties || !parent.properties.length) && (!parent.callProperties || !parent.callProperties.length) && (!parent.indexers || !parent.indexers.length)) {
    return {
      before: true
    };
  }
};

const list = {
  VariableDeclaration(node) {
    return node.declarations.map(decl => decl.init);
  },

  ArrayExpression(node) {
    return node.elements;
  },

  ObjectExpression(node) {
    return node.properties;
  }

};
exports.list = list;
[["Function", true], ["Class", true], ["Loop", true], ["LabeledStatement", true], ["SwitchStatement", true], ["TryStatement", true]].forEach(function ([type, amounts]) {
  if (typeof amounts === "boolean") {
    amounts = {
      after: amounts,
      before: amounts
    };
  }

  [type].concat(t.FLIPPED_ALIAS_KEYS[type] || []).forEach(function (type) {
    nodes[type] = function () {
      return amounts;
    };
  });
});
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618192, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NullableTypeAnnotation = NullableTypeAnnotation;
exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
exports.UpdateExpression = UpdateExpression;
exports.ObjectExpression = ObjectExpression;
exports.DoExpression = DoExpression;
exports.Binary = Binary;
exports.IntersectionTypeAnnotation = exports.UnionTypeAnnotation = UnionTypeAnnotation;
exports.TSAsExpression = TSAsExpression;
exports.TSTypeAssertion = TSTypeAssertion;
exports.TSIntersectionType = exports.TSUnionType = TSUnionType;
exports.BinaryExpression = BinaryExpression;
exports.SequenceExpression = SequenceExpression;
exports.AwaitExpression = exports.YieldExpression = YieldExpression;
exports.ClassExpression = ClassExpression;
exports.UnaryLike = UnaryLike;
exports.FunctionExpression = FunctionExpression;
exports.ArrowFunctionExpression = ArrowFunctionExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.OptionalMemberExpression = OptionalMemberExpression;
exports.AssignmentExpression = AssignmentExpression;
exports.NewExpression = NewExpression;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const PRECEDENCE = {
  "||": 0,
  "??": 0,
  "&&": 1,
  "|": 2,
  "^": 3,
  "&": 4,
  "==": 5,
  "===": 5,
  "!=": 5,
  "!==": 5,
  "<": 6,
  ">": 6,
  "<=": 6,
  ">=": 6,
  in: 6,
  instanceof: 6,
  ">>": 7,
  "<<": 7,
  ">>>": 7,
  "+": 8,
  "-": 8,
  "*": 9,
  "/": 9,
  "%": 9,
  "**": 10
};

const isClassExtendsClause = (node, parent) => (t.isClassDeclaration(parent) || t.isClassExpression(parent)) && parent.superClass === node;

function NullableTypeAnnotation(node, parent) {
  return t.isArrayTypeAnnotation(parent);
}

function FunctionTypeAnnotation(node, parent, printStack) {
  return t.isUnionTypeAnnotation(parent) || t.isIntersectionTypeAnnotation(parent) || t.isArrayTypeAnnotation(parent) || t.isTypeAnnotation(parent) && t.isArrowFunctionExpression(printStack[printStack.length - 3]);
}

function UpdateExpression(node, parent) {
  return t.isMemberExpression(parent, {
    object: node
  }) || t.isCallExpression(parent, {
    callee: node
  }) || t.isNewExpression(parent, {
    callee: node
  }) || isClassExtendsClause(node, parent);
}

function ObjectExpression(node, parent, printStack) {
  return isFirstInStatement(printStack, {
    considerArrow: true
  });
}

function DoExpression(node, parent, printStack) {
  return isFirstInStatement(printStack);
}

function Binary(node, parent) {
  if (node.operator === "**" && t.isBinaryExpression(parent, {
    operator: "**"
  })) {
    return parent.left === node;
  }

  if (isClassExtendsClause(node, parent)) {
    return true;
  }

  if ((t.isCallExpression(parent) || t.isNewExpression(parent)) && parent.callee === node || t.isUnaryLike(parent) || t.isMemberExpression(parent) && parent.object === node || t.isAwaitExpression(parent)) {
    return true;
  }

  if (t.isBinary(parent)) {
    const parentOp = parent.operator;
    const parentPos = PRECEDENCE[parentOp];
    const nodeOp = node.operator;
    const nodePos = PRECEDENCE[nodeOp];

    if (parentPos === nodePos && parent.right === node && !t.isLogicalExpression(parent) || parentPos > nodePos) {
      return true;
    }
  }

  return false;
}

function UnionTypeAnnotation(node, parent) {
  return t.isArrayTypeAnnotation(parent) || t.isNullableTypeAnnotation(parent) || t.isIntersectionTypeAnnotation(parent) || t.isUnionTypeAnnotation(parent);
}

function TSAsExpression() {
  return true;
}

function TSTypeAssertion() {
  return true;
}

function TSUnionType(node, parent) {
  return t.isTSArrayType(parent) || t.isTSOptionalType(parent) || t.isTSIntersectionType(parent) || t.isTSUnionType(parent) || t.isTSRestType(parent);
}

function BinaryExpression(node, parent) {
  return node.operator === "in" && (t.isVariableDeclarator(parent) || t.isFor(parent));
}

function SequenceExpression(node, parent) {
  if (t.isForStatement(parent) || t.isThrowStatement(parent) || t.isReturnStatement(parent) || t.isIfStatement(parent) && parent.test === node || t.isWhileStatement(parent) && parent.test === node || t.isForInStatement(parent) && parent.right === node || t.isSwitchStatement(parent) && parent.discriminant === node || t.isExpressionStatement(parent) && parent.expression === node) {
    return false;
  }

  return true;
}

function YieldExpression(node, parent) {
  return t.isBinary(parent) || t.isUnaryLike(parent) || t.isCallExpression(parent) || t.isMemberExpression(parent) || t.isNewExpression(parent) || t.isAwaitExpression(parent) && t.isYieldExpression(node) || t.isConditionalExpression(parent) && node === parent.test || isClassExtendsClause(node, parent);
}

function ClassExpression(node, parent, printStack) {
  return isFirstInStatement(printStack, {
    considerDefaultExports: true
  });
}

function UnaryLike(node, parent) {
  return t.isMemberExpression(parent, {
    object: node
  }) || t.isCallExpression(parent, {
    callee: node
  }) || t.isNewExpression(parent, {
    callee: node
  }) || t.isBinaryExpression(parent, {
    operator: "**",
    left: node
  }) || isClassExtendsClause(node, parent);
}

function FunctionExpression(node, parent, printStack) {
  return isFirstInStatement(printStack, {
    considerDefaultExports: true
  });
}

function ArrowFunctionExpression(node, parent) {
  return t.isExportDeclaration(parent) || ConditionalExpression(node, parent);
}

function ConditionalExpression(node, parent) {
  if (t.isUnaryLike(parent) || t.isBinary(parent) || t.isConditionalExpression(parent, {
    test: node
  }) || t.isAwaitExpression(parent) || t.isOptionalMemberExpression(parent) || t.isTaggedTemplateExpression(parent) || t.isTSTypeAssertion(parent) || t.isTSAsExpression(parent)) {
    return true;
  }

  return UnaryLike(node, parent);
}

function OptionalMemberExpression(node, parent) {
  return t.isCallExpression(parent) || t.isMemberExpression(parent);
}

function AssignmentExpression(node) {
  if (t.isObjectPattern(node.left)) {
    return true;
  } else {
    return ConditionalExpression(...arguments);
  }
}

function NewExpression(node, parent) {
  return isClassExtendsClause(node, parent);
}

function isFirstInStatement(printStack, {
  considerArrow = false,
  considerDefaultExports = false
} = {}) {
  let i = printStack.length - 1;
  let node = printStack[i];
  i--;
  let parent = printStack[i];

  while (i > 0) {
    if (t.isExpressionStatement(parent, {
      expression: node
    }) || t.isTaggedTemplateExpression(parent) || considerDefaultExports && t.isExportDefaultDeclaration(parent, {
      declaration: node
    }) || considerArrow && t.isArrowFunctionExpression(parent, {
      body: node
    })) {
      return true;
    }

    if (t.isCallExpression(parent, {
      callee: node
    }) || t.isSequenceExpression(parent) && parent.expressions[0] === node || t.isMemberExpression(parent, {
      object: node
    }) || t.isConditional(parent, {
      test: node
    }) || t.isBinary(parent, {
      left: node
    }) || t.isAssignmentExpression(parent, {
      left: node
    })) {
      node = parent;
      i--;
      parent = printStack[i];
    } else {
      return false;
    }
  }

  return false;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618193, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateLiterals = require("./template-literals");

Object.keys(_templateLiterals).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _templateLiterals[key];
    }
  });
});

var _expressions = require("./expressions");

Object.keys(_expressions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _expressions[key];
    }
  });
});

var _statements = require("./statements");

Object.keys(_statements).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _statements[key];
    }
  });
});

var _classes = require("./classes");

Object.keys(_classes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _classes[key];
    }
  });
});

var _methods = require("./methods");

Object.keys(_methods).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _methods[key];
    }
  });
});

var _modules = require("./modules");

Object.keys(_modules).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _modules[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _flow = require("./flow");

Object.keys(_flow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _flow[key];
    }
  });
});

var _base = require("./base");

Object.keys(_base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base[key];
    }
  });
});

var _jsx = require("./jsx");

Object.keys(_jsx).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jsx[key];
    }
  });
});

var _typescript = require("./typescript");

Object.keys(_typescript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _typescript[key];
    }
  });
});
}, function(modId) { var map = {"./template-literals":1581324618194,"./expressions":1581324618195,"./statements":1581324618196,"./classes":1581324618197,"./methods":1581324618198,"./modules":1581324618199,"./types":1581324618200,"./flow":1581324618201,"./base":1581324618202,"./jsx":1581324618203,"./typescript":1581324618204}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618194, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaggedTemplateExpression = TaggedTemplateExpression;
exports.TemplateElement = TemplateElement;
exports.TemplateLiteral = TemplateLiteral;

function TaggedTemplateExpression(node) {
  this.print(node.tag, node);
  this.print(node.typeParameters, node);
  this.print(node.quasi, node);
}

function TemplateElement(node, parent) {
  const isFirst = parent.quasis[0] === node;
  const isLast = parent.quasis[parent.quasis.length - 1] === node;
  const value = (isFirst ? "`" : "}") + node.value.raw + (isLast ? "`" : "${");
  this.token(value);
}

function TemplateLiteral(node) {
  const quasis = node.quasis;

  for (let i = 0; i < quasis.length; i++) {
    this.print(quasis[i], node);

    if (i + 1 < quasis.length) {
      this.print(node.expressions[i], node);
    }
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618195, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnaryExpression = UnaryExpression;
exports.DoExpression = DoExpression;
exports.ParenthesizedExpression = ParenthesizedExpression;
exports.UpdateExpression = UpdateExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.NewExpression = NewExpression;
exports.SequenceExpression = SequenceExpression;
exports.ThisExpression = ThisExpression;
exports.Super = Super;
exports.Decorator = Decorator;
exports.OptionalMemberExpression = OptionalMemberExpression;
exports.OptionalCallExpression = OptionalCallExpression;
exports.CallExpression = CallExpression;
exports.Import = Import;
exports.EmptyStatement = EmptyStatement;
exports.ExpressionStatement = ExpressionStatement;
exports.AssignmentPattern = AssignmentPattern;
exports.LogicalExpression = exports.BinaryExpression = exports.AssignmentExpression = AssignmentExpression;
exports.BindExpression = BindExpression;
exports.MemberExpression = MemberExpression;
exports.MetaProperty = MetaProperty;
exports.PrivateName = PrivateName;
exports.V8IntrinsicIdentifier = V8IntrinsicIdentifier;
exports.AwaitExpression = exports.YieldExpression = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var n = _interopRequireWildcard(require("../node"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function UnaryExpression(node) {
  if (node.operator === "void" || node.operator === "delete" || node.operator === "typeof" || node.operator === "throw") {
    this.word(node.operator);
    this.space();
  } else {
    this.token(node.operator);
  }

  this.print(node.argument, node);
}

function DoExpression(node) {
  this.word("do");
  this.space();
  this.print(node.body, node);
}

function ParenthesizedExpression(node) {
  this.token("(");
  this.print(node.expression, node);
  this.token(")");
}

function UpdateExpression(node) {
  if (node.prefix) {
    this.token(node.operator);
    this.print(node.argument, node);
  } else {
    this.startTerminatorless(true);
    this.print(node.argument, node);
    this.endTerminatorless();
    this.token(node.operator);
  }
}

function ConditionalExpression(node) {
  this.print(node.test, node);
  this.space();
  this.token("?");
  this.space();
  this.print(node.consequent, node);
  this.space();
  this.token(":");
  this.space();
  this.print(node.alternate, node);
}

function NewExpression(node, parent) {
  this.word("new");
  this.space();
  this.print(node.callee, node);

  if (this.format.minified && node.arguments.length === 0 && !node.optional && !t.isCallExpression(parent, {
    callee: node
  }) && !t.isMemberExpression(parent) && !t.isNewExpression(parent)) {
    return;
  }

  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);

  if (node.optional) {
    this.token("?.");
  }

  this.token("(");
  this.printList(node.arguments, node);
  this.token(")");
}

function SequenceExpression(node) {
  this.printList(node.expressions, node);
}

function ThisExpression() {
  this.word("this");
}

function Super() {
  this.word("super");
}

function Decorator(node) {
  this.token("@");
  this.print(node.expression, node);
  this.newline();
}

function OptionalMemberExpression(node) {
  this.print(node.object, node);

  if (!node.computed && t.isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  let computed = node.computed;

  if (t.isLiteral(node.property) && typeof node.property.value === "number") {
    computed = true;
  }

  if (node.optional) {
    this.token("?.");
  }

  if (computed) {
    this.token("[");
    this.print(node.property, node);
    this.token("]");
  } else {
    if (!node.optional) {
      this.token(".");
    }

    this.print(node.property, node);
  }
}

function OptionalCallExpression(node) {
  this.print(node.callee, node);
  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);

  if (node.optional) {
    this.token("?.");
  }

  this.token("(");
  this.printList(node.arguments, node);
  this.token(")");
}

function CallExpression(node) {
  this.print(node.callee, node);
  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);
  this.token("(");
  this.printList(node.arguments, node);
  this.token(")");
}

function Import() {
  this.word("import");
}

function buildYieldAwait(keyword) {
  return function (node) {
    this.word(keyword);

    if (node.delegate) {
      this.token("*");
    }

    if (node.argument) {
      this.space();
      const terminatorState = this.startTerminatorless();
      this.print(node.argument, node);
      this.endTerminatorless(terminatorState);
    }
  };
}

const YieldExpression = buildYieldAwait("yield");
exports.YieldExpression = YieldExpression;
const AwaitExpression = buildYieldAwait("await");
exports.AwaitExpression = AwaitExpression;

function EmptyStatement() {
  this.semicolon(true);
}

function ExpressionStatement(node) {
  this.print(node.expression, node);
  this.semicolon();
}

function AssignmentPattern(node) {
  this.print(node.left, node);
  if (node.left.optional) this.token("?");
  this.print(node.left.typeAnnotation, node);
  this.space();
  this.token("=");
  this.space();
  this.print(node.right, node);
}

function AssignmentExpression(node, parent) {
  const parens = this.inForStatementInitCounter && node.operator === "in" && !n.needsParens(node, parent);

  if (parens) {
    this.token("(");
  }

  this.print(node.left, node);
  this.space();

  if (node.operator === "in" || node.operator === "instanceof") {
    this.word(node.operator);
  } else {
    this.token(node.operator);
  }

  this.space();
  this.print(node.right, node);

  if (parens) {
    this.token(")");
  }
}

function BindExpression(node) {
  this.print(node.object, node);
  this.token("::");
  this.print(node.callee, node);
}

function MemberExpression(node) {
  this.print(node.object, node);

  if (!node.computed && t.isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  let computed = node.computed;

  if (t.isLiteral(node.property) && typeof node.property.value === "number") {
    computed = true;
  }

  if (computed) {
    this.token("[");
    this.print(node.property, node);
    this.token("]");
  } else {
    this.token(".");
    this.print(node.property, node);
  }
}

function MetaProperty(node) {
  this.print(node.meta, node);
  this.token(".");
  this.print(node.property, node);
}

function PrivateName(node) {
  this.token("#");
  this.print(node.id, node);
}

function V8IntrinsicIdentifier(node) {
  this.token("%");
  this.word(node.name);
}
}, function(modId) { var map = {"../node":1581324618190}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618196, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithStatement = WithStatement;
exports.IfStatement = IfStatement;
exports.ForStatement = ForStatement;
exports.WhileStatement = WhileStatement;
exports.DoWhileStatement = DoWhileStatement;
exports.LabeledStatement = LabeledStatement;
exports.TryStatement = TryStatement;
exports.CatchClause = CatchClause;
exports.SwitchStatement = SwitchStatement;
exports.SwitchCase = SwitchCase;
exports.DebuggerStatement = DebuggerStatement;
exports.VariableDeclaration = VariableDeclaration;
exports.VariableDeclarator = VariableDeclarator;
exports.ThrowStatement = exports.BreakStatement = exports.ReturnStatement = exports.ContinueStatement = exports.ForOfStatement = exports.ForInStatement = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function WithStatement(node) {
  this.word("with");
  this.space();
  this.token("(");
  this.print(node.object, node);
  this.token(")");
  this.printBlock(node);
}

function IfStatement(node) {
  this.word("if");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.space();
  const needsBlock = node.alternate && t.isIfStatement(getLastStatement(node.consequent));

  if (needsBlock) {
    this.token("{");
    this.newline();
    this.indent();
  }

  this.printAndIndentOnComments(node.consequent, node);

  if (needsBlock) {
    this.dedent();
    this.newline();
    this.token("}");
  }

  if (node.alternate) {
    if (this.endsWith("}")) this.space();
    this.word("else");
    this.space();
    this.printAndIndentOnComments(node.alternate, node);
  }
}

function getLastStatement(statement) {
  if (!t.isStatement(statement.body)) return statement;
  return getLastStatement(statement.body);
}

function ForStatement(node) {
  this.word("for");
  this.space();
  this.token("(");
  this.inForStatementInitCounter++;
  this.print(node.init, node);
  this.inForStatementInitCounter--;
  this.token(";");

  if (node.test) {
    this.space();
    this.print(node.test, node);
  }

  this.token(";");

  if (node.update) {
    this.space();
    this.print(node.update, node);
  }

  this.token(")");
  this.printBlock(node);
}

function WhileStatement(node) {
  this.word("while");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.printBlock(node);
}

const buildForXStatement = function (op) {
  return function (node) {
    this.word("for");
    this.space();

    if (op === "of" && node.await) {
      this.word("await");
      this.space();
    }

    this.token("(");
    this.print(node.left, node);
    this.space();
    this.word(op);
    this.space();
    this.print(node.right, node);
    this.token(")");
    this.printBlock(node);
  };
};

const ForInStatement = buildForXStatement("in");
exports.ForInStatement = ForInStatement;
const ForOfStatement = buildForXStatement("of");
exports.ForOfStatement = ForOfStatement;

function DoWhileStatement(node) {
  this.word("do");
  this.space();
  this.print(node.body, node);
  this.space();
  this.word("while");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.semicolon();
}

function buildLabelStatement(prefix, key = "label") {
  return function (node) {
    this.word(prefix);
    const label = node[key];

    if (label) {
      this.space();
      const isLabel = key == "label";
      const terminatorState = this.startTerminatorless(isLabel);
      this.print(label, node);
      this.endTerminatorless(terminatorState);
    }

    this.semicolon();
  };
}

const ContinueStatement = buildLabelStatement("continue");
exports.ContinueStatement = ContinueStatement;
const ReturnStatement = buildLabelStatement("return", "argument");
exports.ReturnStatement = ReturnStatement;
const BreakStatement = buildLabelStatement("break");
exports.BreakStatement = BreakStatement;
const ThrowStatement = buildLabelStatement("throw", "argument");
exports.ThrowStatement = ThrowStatement;

function LabeledStatement(node) {
  this.print(node.label, node);
  this.token(":");
  this.space();
  this.print(node.body, node);
}

function TryStatement(node) {
  this.word("try");
  this.space();
  this.print(node.block, node);
  this.space();

  if (node.handlers) {
    this.print(node.handlers[0], node);
  } else {
    this.print(node.handler, node);
  }

  if (node.finalizer) {
    this.space();
    this.word("finally");
    this.space();
    this.print(node.finalizer, node);
  }
}

function CatchClause(node) {
  this.word("catch");
  this.space();

  if (node.param) {
    this.token("(");
    this.print(node.param, node);
    this.token(")");
    this.space();
  }

  this.print(node.body, node);
}

function SwitchStatement(node) {
  this.word("switch");
  this.space();
  this.token("(");
  this.print(node.discriminant, node);
  this.token(")");
  this.space();
  this.token("{");
  this.printSequence(node.cases, node, {
    indent: true,

    addNewlines(leading, cas) {
      if (!leading && node.cases[node.cases.length - 1] === cas) return -1;
    }

  });
  this.token("}");
}

function SwitchCase(node) {
  if (node.test) {
    this.word("case");
    this.space();
    this.print(node.test, node);
    this.token(":");
  } else {
    this.word("default");
    this.token(":");
  }

  if (node.consequent.length) {
    this.newline();
    this.printSequence(node.consequent, node, {
      indent: true
    });
  }
}

function DebuggerStatement() {
  this.word("debugger");
  this.semicolon();
}

function variableDeclarationIndent() {
  this.token(",");
  this.newline();
  if (this.endsWith("\n")) for (let i = 0; i < 4; i++) this.space(true);
}

function constDeclarationIndent() {
  this.token(",");
  this.newline();
  if (this.endsWith("\n")) for (let i = 0; i < 6; i++) this.space(true);
}

function VariableDeclaration(node, parent) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }

  this.word(node.kind);
  this.space();
  let hasInits = false;

  if (!t.isFor(parent)) {
    for (const declar of node.declarations) {
      if (declar.init) {
        hasInits = true;
      }
    }
  }

  let separator;

  if (hasInits) {
    separator = node.kind === "const" ? constDeclarationIndent : variableDeclarationIndent;
  }

  this.printList(node.declarations, node, {
    separator
  });

  if (t.isFor(parent)) {
    if (parent.left === node || parent.init === node) return;
  }

  this.semicolon();
}

function VariableDeclarator(node) {
  this.print(node.id, node);
  if (node.definite) this.token("!");
  this.print(node.id.typeAnnotation, node);

  if (node.init) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.init, node);
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618197, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClassExpression = exports.ClassDeclaration = ClassDeclaration;
exports.ClassBody = ClassBody;
exports.ClassProperty = ClassProperty;
exports.ClassPrivateProperty = ClassPrivateProperty;
exports.ClassMethod = ClassMethod;
exports.ClassPrivateMethod = ClassPrivateMethod;
exports._classMethodHead = _classMethodHead;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ClassDeclaration(node, parent) {
  if (!this.format.decoratorsBeforeExport || !t.isExportDefaultDeclaration(parent) && !t.isExportNamedDeclaration(parent)) {
    this.printJoin(node.decorators, node);
  }

  if (node.declare) {
    this.word("declare");
    this.space();
  }

  if (node.abstract) {
    this.word("abstract");
    this.space();
  }

  this.word("class");

  if (node.id) {
    this.space();
    this.print(node.id, node);
  }

  this.print(node.typeParameters, node);

  if (node.superClass) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.superClass, node);
    this.print(node.superTypeParameters, node);
  }

  if (node.implements) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements, node);
  }

  this.space();
  this.print(node.body, node);
}

function ClassBody(node) {
  this.token("{");
  this.printInnerComments(node);

  if (node.body.length === 0) {
    this.token("}");
  } else {
    this.newline();
    this.indent();
    this.printSequence(node.body, node);
    this.dedent();
    if (!this.endsWith("\n")) this.newline();
    this.rightBrace();
  }
}

function ClassProperty(node) {
  this.printJoin(node.decorators, node);
  this.tsPrintClassMemberModifiers(node, true);

  if (node.computed) {
    this.token("[");
    this.print(node.key, node);
    this.token("]");
  } else {
    this._variance(node);

    this.print(node.key, node);
  }

  if (node.optional) {
    this.token("?");
  }

  if (node.definite) {
    this.token("!");
  }

  this.print(node.typeAnnotation, node);

  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value, node);
  }

  this.semicolon();
}

function ClassPrivateProperty(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this.print(node.key, node);
  this.print(node.typeAnnotation, node);

  if (node.value) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.value, node);
  }

  this.semicolon();
}

function ClassMethod(node) {
  this._classMethodHead(node);

  this.space();
  this.print(node.body, node);
}

function ClassPrivateMethod(node) {
  this._classMethodHead(node);

  this.space();
  this.print(node.body, node);
}

function _classMethodHead(node) {
  this.printJoin(node.decorators, node);
  this.tsPrintClassMemberModifiers(node, false);

  this._methodHead(node);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618198, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._params = _params;
exports._parameters = _parameters;
exports._param = _param;
exports._methodHead = _methodHead;
exports._predicate = _predicate;
exports._functionHead = _functionHead;
exports.FunctionDeclaration = exports.FunctionExpression = FunctionExpression;
exports.ArrowFunctionExpression = ArrowFunctionExpression;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _params(node) {
  this.print(node.typeParameters, node);
  this.token("(");

  this._parameters(node.params, node);

  this.token(")");
  this.print(node.returnType, node);
}

function _parameters(parameters, parent) {
  for (let i = 0; i < parameters.length; i++) {
    this._param(parameters[i], parent);

    if (i < parameters.length - 1) {
      this.token(",");
      this.space();
    }
  }
}

function _param(parameter, parent) {
  this.printJoin(parameter.decorators, parameter);
  this.print(parameter, parent);
  if (parameter.optional) this.token("?");
  this.print(parameter.typeAnnotation, parameter);
}

function _methodHead(node) {
  const kind = node.kind;
  const key = node.key;

  if (kind === "get" || kind === "set") {
    this.word(kind);
    this.space();
  }

  if (node.async) {
    this.word("async");
    this.space();
  }

  if (kind === "method" || kind === "init") {
    if (node.generator) {
      this.token("*");
    }
  }

  if (node.computed) {
    this.token("[");
    this.print(key, node);
    this.token("]");
  } else {
    this.print(key, node);
  }

  if (node.optional) {
    this.token("?");
  }

  this._params(node);
}

function _predicate(node) {
  if (node.predicate) {
    if (!node.returnType) {
      this.token(":");
    }

    this.space();
    this.print(node.predicate, node);
  }
}

function _functionHead(node) {
  if (node.async) {
    this.word("async");
    this.space();
  }

  this.word("function");
  if (node.generator) this.token("*");
  this.space();

  if (node.id) {
    this.print(node.id, node);
  }

  this._params(node);

  this._predicate(node);
}

function FunctionExpression(node) {
  this._functionHead(node);

  this.space();
  this.print(node.body, node);
}

function ArrowFunctionExpression(node) {
  if (node.async) {
    this.word("async");
    this.space();
  }

  const firstParam = node.params[0];

  if (node.params.length === 1 && t.isIdentifier(firstParam) && !hasTypes(node, firstParam)) {
    if (this.format.retainLines && node.loc && node.body.loc && node.loc.start.line < node.body.loc.start.line) {
      this.token("(");

      if (firstParam.loc && firstParam.loc.start.line > node.loc.start.line) {
        this.indent();
        this.print(firstParam, node);
        this.dedent();

        this._catchUp("start", node.body.loc);
      } else {
        this.print(firstParam, node);
      }

      this.token(")");
    } else {
      this.print(firstParam, node);
    }
  } else {
    this._params(node);
  }

  this._predicate(node);

  this.space();
  this.token("=>");
  this.space();
  this.print(node.body, node);
}

function hasTypes(node, param) {
  return node.typeParameters || node.returnType || param.typeAnnotation || param.optional || param.trailingComments;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618199, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportSpecifier = ImportSpecifier;
exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
exports.ExportDefaultSpecifier = ExportDefaultSpecifier;
exports.ExportSpecifier = ExportSpecifier;
exports.ExportNamespaceSpecifier = ExportNamespaceSpecifier;
exports.ExportAllDeclaration = ExportAllDeclaration;
exports.ExportNamedDeclaration = ExportNamedDeclaration;
exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
exports.ImportDeclaration = ImportDeclaration;
exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;

var t = _interopRequireWildcard(require("@babel/types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ImportSpecifier(node) {
  if (node.importKind === "type" || node.importKind === "typeof") {
    this.word(node.importKind);
    this.space();
  }

  this.print(node.imported, node);

  if (node.local && node.local.name !== node.imported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.local, node);
  }
}

function ImportDefaultSpecifier(node) {
  this.print(node.local, node);
}

function ExportDefaultSpecifier(node) {
  this.print(node.exported, node);
}

function ExportSpecifier(node) {
  this.print(node.local, node);

  if (node.exported && node.local.name !== node.exported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.exported, node);
  }
}

function ExportNamespaceSpecifier(node) {
  this.token("*");
  this.space();
  this.word("as");
  this.space();
  this.print(node.exported, node);
}

function ExportAllDeclaration(node) {
  this.word("export");
  this.space();

  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }

  this.token("*");
  this.space();
  this.word("from");
  this.space();
  this.print(node.source, node);
  this.semicolon();
}

function ExportNamedDeclaration(node) {
  if (this.format.decoratorsBeforeExport && t.isClassDeclaration(node.declaration)) {
    this.printJoin(node.declaration.decorators, node);
  }

  this.word("export");
  this.space();
  ExportDeclaration.apply(this, arguments);
}

function ExportDefaultDeclaration(node) {
  if (this.format.decoratorsBeforeExport && t.isClassDeclaration(node.declaration)) {
    this.printJoin(node.declaration.decorators, node);
  }

  this.word("export");
  this.space();
  this.word("default");
  this.space();
  ExportDeclaration.apply(this, arguments);
}

function ExportDeclaration(node) {
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar, node);
    if (!t.isStatement(declar)) this.semicolon();
  } else {
    if (node.exportKind === "type") {
      this.word("type");
      this.space();
    }

    const specifiers = node.specifiers.slice(0);
    let hasSpecial = false;

    while (true) {
      const first = specifiers[0];

      if (t.isExportDefaultSpecifier(first) || t.isExportNamespaceSpecifier(first)) {
        hasSpecial = true;
        this.print(specifiers.shift(), node);

        if (specifiers.length) {
          this.token(",");
          this.space();
        }
      } else {
        break;
      }
    }

    if (specifiers.length || !specifiers.length && !hasSpecial) {
      this.token("{");

      if (specifiers.length) {
        this.space();
        this.printList(specifiers, node);
        this.space();
      }

      this.token("}");
    }

    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      this.print(node.source, node);
    }

    this.semicolon();
  }
}

function ImportDeclaration(node) {
  this.word("import");
  this.space();

  if (node.importKind === "type" || node.importKind === "typeof") {
    this.word(node.importKind);
    this.space();
  }

  const specifiers = node.specifiers.slice(0);

  if (specifiers && specifiers.length) {
    while (true) {
      const first = specifiers[0];

      if (t.isImportDefaultSpecifier(first) || t.isImportNamespaceSpecifier(first)) {
        this.print(specifiers.shift(), node);

        if (specifiers.length) {
          this.token(",");
          this.space();
        }
      } else {
        break;
      }
    }

    if (specifiers.length) {
      this.token("{");
      this.space();
      this.printList(specifiers, node);
      this.space();
      this.token("}");
    }

    this.space();
    this.word("from");
    this.space();
  }

  this.print(node.source, node);
  this.semicolon();
}

function ImportNamespaceSpecifier(node) {
  this.token("*");
  this.space();
  this.word("as");
  this.space();
  this.print(node.local, node);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618200, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Identifier = Identifier;
exports.ArgumentPlaceholder = ArgumentPlaceholder;
exports.SpreadElement = exports.RestElement = RestElement;
exports.ObjectPattern = exports.ObjectExpression = ObjectExpression;
exports.ObjectMethod = ObjectMethod;
exports.ObjectProperty = ObjectProperty;
exports.ArrayPattern = exports.ArrayExpression = ArrayExpression;
exports.RegExpLiteral = RegExpLiteral;
exports.BooleanLiteral = BooleanLiteral;
exports.NullLiteral = NullLiteral;
exports.NumericLiteral = NumericLiteral;
exports.StringLiteral = StringLiteral;
exports.BigIntLiteral = BigIntLiteral;
exports.PipelineTopicExpression = PipelineTopicExpression;
exports.PipelineBareFunction = PipelineBareFunction;
exports.PipelinePrimaryTopicReference = PipelinePrimaryTopicReference;

var t = _interopRequireWildcard(require("@babel/types"));

var _jsesc = _interopRequireDefault(require("jsesc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Identifier(node) {
  this.exactSource(node.loc, () => {
    this.word(node.name);
  });
}

function ArgumentPlaceholder() {
  this.token("?");
}

function RestElement(node) {
  this.token("...");
  this.print(node.argument, node);
}

function ObjectExpression(node) {
  const props = node.properties;
  this.token("{");
  this.printInnerComments(node);

  if (props.length) {
    this.space();
    this.printList(props, node, {
      indent: true,
      statement: true
    });
    this.space();
  }

  this.token("}");
}

function ObjectMethod(node) {
  this.printJoin(node.decorators, node);

  this._methodHead(node);

  this.space();
  this.print(node.body, node);
}

function ObjectProperty(node) {
  this.printJoin(node.decorators, node);

  if (node.computed) {
    this.token("[");
    this.print(node.key, node);
    this.token("]");
  } else {
    if (t.isAssignmentPattern(node.value) && t.isIdentifier(node.key) && node.key.name === node.value.left.name) {
      this.print(node.value, node);
      return;
    }

    this.print(node.key, node);

    if (node.shorthand && t.isIdentifier(node.key) && t.isIdentifier(node.value) && node.key.name === node.value.name) {
      return;
    }
  }

  this.token(":");
  this.space();
  this.print(node.value, node);
}

function ArrayExpression(node) {
  const elems = node.elements;
  const len = elems.length;
  this.token("[");
  this.printInnerComments(node);

  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];

    if (elem) {
      if (i > 0) this.space();
      this.print(elem, node);
      if (i < len - 1) this.token(",");
    } else {
      this.token(",");
    }
  }

  this.token("]");
}

function RegExpLiteral(node) {
  this.word(`/${node.pattern}/${node.flags}`);
}

function BooleanLiteral(node) {
  this.word(node.value ? "true" : "false");
}

function NullLiteral() {
  this.word("null");
}

function NumericLiteral(node) {
  const raw = this.getPossibleRaw(node);
  const value = node.value + "";

  if (raw == null) {
    this.number(value);
  } else if (this.format.minified) {
    this.number(raw.length < value.length ? raw : value);
  } else {
    this.number(raw);
  }
}

function StringLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (!this.format.minified && raw != null) {
    this.token(raw);
    return;
  }

  const opts = this.format.jsescOption;

  if (this.format.jsonCompatibleStrings) {
    opts.json = true;
  }

  const val = (0, _jsesc.default)(node.value, opts);
  return this.token(val);
}

function BigIntLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (!this.format.minified && raw != null) {
    this.token(raw);
    return;
  }

  this.token(node.value);
}

function PipelineTopicExpression(node) {
  this.print(node.expression, node);
}

function PipelineBareFunction(node) {
  this.print(node.callee, node);
}

function PipelinePrimaryTopicReference() {
  this.token("#");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618201, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnyTypeAnnotation = AnyTypeAnnotation;
exports.ArrayTypeAnnotation = ArrayTypeAnnotation;
exports.BooleanTypeAnnotation = BooleanTypeAnnotation;
exports.BooleanLiteralTypeAnnotation = BooleanLiteralTypeAnnotation;
exports.NullLiteralTypeAnnotation = NullLiteralTypeAnnotation;
exports.DeclareClass = DeclareClass;
exports.DeclareFunction = DeclareFunction;
exports.InferredPredicate = InferredPredicate;
exports.DeclaredPredicate = DeclaredPredicate;
exports.DeclareInterface = DeclareInterface;
exports.DeclareModule = DeclareModule;
exports.DeclareModuleExports = DeclareModuleExports;
exports.DeclareTypeAlias = DeclareTypeAlias;
exports.DeclareOpaqueType = DeclareOpaqueType;
exports.DeclareVariable = DeclareVariable;
exports.DeclareExportDeclaration = DeclareExportDeclaration;
exports.DeclareExportAllDeclaration = DeclareExportAllDeclaration;
exports.EnumDeclaration = EnumDeclaration;
exports.EnumBooleanBody = EnumBooleanBody;
exports.EnumNumberBody = EnumNumberBody;
exports.EnumStringBody = EnumStringBody;
exports.EnumSymbolBody = EnumSymbolBody;
exports.EnumDefaultedMember = EnumDefaultedMember;
exports.EnumBooleanMember = EnumBooleanMember;
exports.EnumNumberMember = EnumNumberMember;
exports.EnumStringMember = EnumStringMember;
exports.ExistsTypeAnnotation = ExistsTypeAnnotation;
exports.FunctionTypeAnnotation = FunctionTypeAnnotation;
exports.FunctionTypeParam = FunctionTypeParam;
exports.GenericTypeAnnotation = exports.ClassImplements = exports.InterfaceExtends = InterfaceExtends;
exports._interfaceish = _interfaceish;
exports._variance = _variance;
exports.InterfaceDeclaration = InterfaceDeclaration;
exports.InterfaceTypeAnnotation = InterfaceTypeAnnotation;
exports.IntersectionTypeAnnotation = IntersectionTypeAnnotation;
exports.MixedTypeAnnotation = MixedTypeAnnotation;
exports.EmptyTypeAnnotation = EmptyTypeAnnotation;
exports.NullableTypeAnnotation = NullableTypeAnnotation;
exports.NumberTypeAnnotation = NumberTypeAnnotation;
exports.StringTypeAnnotation = StringTypeAnnotation;
exports.ThisTypeAnnotation = ThisTypeAnnotation;
exports.TupleTypeAnnotation = TupleTypeAnnotation;
exports.TypeofTypeAnnotation = TypeofTypeAnnotation;
exports.TypeAlias = TypeAlias;
exports.TypeAnnotation = TypeAnnotation;
exports.TypeParameterDeclaration = exports.TypeParameterInstantiation = TypeParameterInstantiation;
exports.TypeParameter = TypeParameter;
exports.OpaqueType = OpaqueType;
exports.ObjectTypeAnnotation = ObjectTypeAnnotation;
exports.ObjectTypeInternalSlot = ObjectTypeInternalSlot;
exports.ObjectTypeCallProperty = ObjectTypeCallProperty;
exports.ObjectTypeIndexer = ObjectTypeIndexer;
exports.ObjectTypeProperty = ObjectTypeProperty;
exports.ObjectTypeSpreadProperty = ObjectTypeSpreadProperty;
exports.QualifiedTypeIdentifier = QualifiedTypeIdentifier;
exports.UnionTypeAnnotation = UnionTypeAnnotation;
exports.TypeCastExpression = TypeCastExpression;
exports.Variance = Variance;
exports.VoidTypeAnnotation = VoidTypeAnnotation;
Object.defineProperty(exports, "NumberLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return _types2.NumericLiteral;
  }
});
Object.defineProperty(exports, "StringLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return _types2.StringLiteral;
  }
});

var t = _interopRequireWildcard(require("@babel/types"));

var _modules = require("./modules");

var _types2 = require("./types");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function AnyTypeAnnotation() {
  this.word("any");
}

function ArrayTypeAnnotation(node) {
  this.print(node.elementType, node);
  this.token("[");
  this.token("]");
}

function BooleanTypeAnnotation() {
  this.word("boolean");
}

function BooleanLiteralTypeAnnotation(node) {
  this.word(node.value ? "true" : "false");
}

function NullLiteralTypeAnnotation() {
  this.word("null");
}

function DeclareClass(node, parent) {
  if (!t.isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.word("class");
  this.space();

  this._interfaceish(node);
}

function DeclareFunction(node, parent) {
  if (!t.isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.word("function");
  this.space();
  this.print(node.id, node);
  this.print(node.id.typeAnnotation.typeAnnotation, node);

  if (node.predicate) {
    this.space();
    this.print(node.predicate, node);
  }

  this.semicolon();
}

function InferredPredicate() {
  this.token("%");
  this.word("checks");
}

function DeclaredPredicate(node) {
  this.token("%");
  this.word("checks");
  this.token("(");
  this.print(node.value, node);
  this.token(")");
}

function DeclareInterface(node) {
  this.word("declare");
  this.space();
  this.InterfaceDeclaration(node);
}

function DeclareModule(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.space();
  this.print(node.id, node);
  this.space();
  this.print(node.body, node);
}

function DeclareModuleExports(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.token(".");
  this.word("exports");
  this.print(node.typeAnnotation, node);
}

function DeclareTypeAlias(node) {
  this.word("declare");
  this.space();
  this.TypeAlias(node);
}

function DeclareOpaqueType(node, parent) {
  if (!t.isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.OpaqueType(node);
}

function DeclareVariable(node, parent) {
  if (!t.isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }

  this.word("var");
  this.space();
  this.print(node.id, node);
  this.print(node.id.typeAnnotation, node);
  this.semicolon();
}

function DeclareExportDeclaration(node) {
  this.word("declare");
  this.space();
  this.word("export");
  this.space();

  if (node.default) {
    this.word("default");
    this.space();
  }

  FlowExportDeclaration.apply(this, arguments);
}

function DeclareExportAllDeclaration() {
  this.word("declare");
  this.space();

  _modules.ExportAllDeclaration.apply(this, arguments);
}

function EnumDeclaration(node) {
  const {
    id,
    body
  } = node;
  this.word("enum");
  this.space();
  this.print(id, node);
  this.print(body, node);
}

function enumExplicitType(context, name, hasExplicitType) {
  if (hasExplicitType) {
    context.space();
    context.word("of");
    context.space();
    context.word(name);
  }

  context.space();
}

function enumBody(context, node) {
  const {
    members
  } = node;
  context.token("{");
  context.indent();
  context.newline();

  for (const member of members) {
    context.print(member, node);
    context.newline();
  }

  context.dedent();
  context.token("}");
}

function EnumBooleanBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "boolean", explicitType);
  enumBody(this, node);
}

function EnumNumberBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "number", explicitType);
  enumBody(this, node);
}

function EnumStringBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "string", explicitType);
  enumBody(this, node);
}

function EnumSymbolBody(node) {
  enumExplicitType(this, "symbol", true);
  enumBody(this, node);
}

function EnumDefaultedMember(node) {
  const {
    id
  } = node;
  this.print(id, node);
  this.token(",");
}

function enumInitializedMember(context, node) {
  const {
    id,
    init
  } = node;
  context.print(id, node);
  context.space();
  context.token("=");
  context.space();
  context.print(init, node);
  context.token(",");
}

function EnumBooleanMember(node) {
  enumInitializedMember(this, node);
}

function EnumNumberMember(node) {
  enumInitializedMember(this, node);
}

function EnumStringMember(node) {
  enumInitializedMember(this, node);
}

function FlowExportDeclaration(node) {
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar, node);
    if (!t.isStatement(declar)) this.semicolon();
  } else {
    this.token("{");

    if (node.specifiers.length) {
      this.space();
      this.printList(node.specifiers, node);
      this.space();
    }

    this.token("}");

    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      this.print(node.source, node);
    }

    this.semicolon();
  }
}

function ExistsTypeAnnotation() {
  this.token("*");
}

function FunctionTypeAnnotation(node, parent) {
  this.print(node.typeParameters, node);
  this.token("(");
  this.printList(node.params, node);

  if (node.rest) {
    if (node.params.length) {
      this.token(",");
      this.space();
    }

    this.token("...");
    this.print(node.rest, node);
  }

  this.token(")");

  if (parent.type === "ObjectTypeCallProperty" || parent.type === "DeclareFunction" || parent.type === "ObjectTypeProperty" && parent.method) {
    this.token(":");
  } else {
    this.space();
    this.token("=>");
  }

  this.space();
  this.print(node.returnType, node);
}

function FunctionTypeParam(node) {
  this.print(node.name, node);
  if (node.optional) this.token("?");

  if (node.name) {
    this.token(":");
    this.space();
  }

  this.print(node.typeAnnotation, node);
}

function InterfaceExtends(node) {
  this.print(node.id, node);
  this.print(node.typeParameters, node);
}

function _interfaceish(node) {
  this.print(node.id, node);
  this.print(node.typeParameters, node);

  if (node.extends.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends, node);
  }

  if (node.mixins && node.mixins.length) {
    this.space();
    this.word("mixins");
    this.space();
    this.printList(node.mixins, node);
  }

  if (node.implements && node.implements.length) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements, node);
  }

  this.space();
  this.print(node.body, node);
}

function _variance(node) {
  if (node.variance) {
    if (node.variance.kind === "plus") {
      this.token("+");
    } else if (node.variance.kind === "minus") {
      this.token("-");
    }
  }
}

function InterfaceDeclaration(node) {
  this.word("interface");
  this.space();

  this._interfaceish(node);
}

function andSeparator() {
  this.space();
  this.token("&");
  this.space();
}

function InterfaceTypeAnnotation(node) {
  this.word("interface");

  if (node.extends && node.extends.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends, node);
  }

  this.space();
  this.print(node.body, node);
}

function IntersectionTypeAnnotation(node) {
  this.printJoin(node.types, node, {
    separator: andSeparator
  });
}

function MixedTypeAnnotation() {
  this.word("mixed");
}

function EmptyTypeAnnotation() {
  this.word("empty");
}

function NullableTypeAnnotation(node) {
  this.token("?");
  this.print(node.typeAnnotation, node);
}

function NumberTypeAnnotation() {
  this.word("number");
}

function StringTypeAnnotation() {
  this.word("string");
}

function ThisTypeAnnotation() {
  this.word("this");
}

function TupleTypeAnnotation(node) {
  this.token("[");
  this.printList(node.types, node);
  this.token("]");
}

function TypeofTypeAnnotation(node) {
  this.word("typeof");
  this.space();
  this.print(node.argument, node);
}

function TypeAlias(node) {
  this.word("type");
  this.space();
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  this.space();
  this.token("=");
  this.space();
  this.print(node.right, node);
  this.semicolon();
}

function TypeAnnotation(node) {
  this.token(":");
  this.space();
  if (node.optional) this.token("?");
  this.print(node.typeAnnotation, node);
}

function TypeParameterInstantiation(node) {
  this.token("<");
  this.printList(node.params, node, {});
  this.token(">");
}

function TypeParameter(node) {
  this._variance(node);

  this.word(node.name);

  if (node.bound) {
    this.print(node.bound, node);
  }

  if (node.default) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.default, node);
  }
}

function OpaqueType(node) {
  this.word("opaque");
  this.space();
  this.word("type");
  this.space();
  this.print(node.id, node);
  this.print(node.typeParameters, node);

  if (node.supertype) {
    this.token(":");
    this.space();
    this.print(node.supertype, node);
  }

  if (node.impltype) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.impltype, node);
  }

  this.semicolon();
}

function ObjectTypeAnnotation(node) {
  if (node.exact) {
    this.token("{|");
  } else {
    this.token("{");
  }

  const props = node.properties.concat(node.callProperties || [], node.indexers || [], node.internalSlots || []);

  if (props.length) {
    this.space();
    this.printJoin(props, node, {
      addNewlines(leading) {
        if (leading && !props[0]) return 1;
      },

      indent: true,
      statement: true,
      iterator: () => {
        if (props.length !== 1 || node.inexact) {
          this.token(",");
          this.space();
        }
      }
    });
    this.space();
  }

  if (node.inexact) {
    this.indent();
    this.token("...");

    if (props.length) {
      this.newline();
    }

    this.dedent();
  }

  if (node.exact) {
    this.token("|}");
  } else {
    this.token("}");
  }
}

function ObjectTypeInternalSlot(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this.token("[");
  this.token("[");
  this.print(node.id, node);
  this.token("]");
  this.token("]");
  if (node.optional) this.token("?");

  if (!node.method) {
    this.token(":");
    this.space();
  }

  this.print(node.value, node);
}

function ObjectTypeCallProperty(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this.print(node.value, node);
}

function ObjectTypeIndexer(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }

  this._variance(node);

  this.token("[");

  if (node.id) {
    this.print(node.id, node);
    this.token(":");
    this.space();
  }

  this.print(node.key, node);
  this.token("]");
  this.token(":");
  this.space();
  this.print(node.value, node);
}

function ObjectTypeProperty(node) {
  if (node.proto) {
    this.word("proto");
    this.space();
  }

  if (node.static) {
    this.word("static");
    this.space();
  }

  this._variance(node);

  this.print(node.key, node);
  if (node.optional) this.token("?");

  if (!node.method) {
    this.token(":");
    this.space();
  }

  this.print(node.value, node);
}

function ObjectTypeSpreadProperty(node) {
  this.token("...");
  this.print(node.argument, node);
}

function QualifiedTypeIdentifier(node) {
  this.print(node.qualification, node);
  this.token(".");
  this.print(node.id, node);
}

function orSeparator() {
  this.space();
  this.token("|");
  this.space();
}

function UnionTypeAnnotation(node) {
  this.printJoin(node.types, node, {
    separator: orSeparator
  });
}

function TypeCastExpression(node) {
  this.token("(");
  this.print(node.expression, node);
  this.print(node.typeAnnotation, node);
  this.token(")");
}

function Variance(node) {
  if (node.kind === "plus") {
    this.token("+");
  } else {
    this.token("-");
  }
}

function VoidTypeAnnotation() {
  this.word("void");
}
}, function(modId) { var map = {"./modules":1581324618199,"./types":1581324618200}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618202, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = File;
exports.Program = Program;
exports.BlockStatement = BlockStatement;
exports.Noop = Noop;
exports.Directive = Directive;
exports.DirectiveLiteral = DirectiveLiteral;
exports.InterpreterDirective = InterpreterDirective;
exports.Placeholder = Placeholder;

function File(node) {
  if (node.program) {
    this.print(node.program.interpreter, node);
  }

  this.print(node.program, node);
}

function Program(node) {
  this.printInnerComments(node, false);
  this.printSequence(node.directives, node);
  if (node.directives && node.directives.length) this.newline();
  this.printSequence(node.body, node);
}

function BlockStatement(node) {
  this.token("{");
  this.printInnerComments(node);
  const hasDirectives = node.directives && node.directives.length;

  if (node.body.length || hasDirectives) {
    this.newline();
    this.printSequence(node.directives, node, {
      indent: true
    });
    if (hasDirectives) this.newline();
    this.printSequence(node.body, node, {
      indent: true
    });
    this.removeTrailingNewline();
    this.source("end", node.loc);
    if (!this.endsWith("\n")) this.newline();
    this.rightBrace();
  } else {
    this.source("end", node.loc);
    this.token("}");
  }
}

function Noop() {}

function Directive(node) {
  this.print(node.value, node);
  this.semicolon();
}

const unescapedSingleQuoteRE = /(?:^|[^\\])(?:\\\\)*'/;
const unescapedDoubleQuoteRE = /(?:^|[^\\])(?:\\\\)*"/;

function DirectiveLiteral(node) {
  const raw = this.getPossibleRaw(node);

  if (raw != null) {
    this.token(raw);
    return;
  }

  const {
    value
  } = node;

  if (!unescapedDoubleQuoteRE.test(value)) {
    this.token(`"${value}"`);
  } else if (!unescapedSingleQuoteRE.test(value)) {
    this.token(`'${value}'`);
  } else {
    throw new Error("Malformed AST: it is not possible to print a directive containing" + " both unescaped single and double quotes.");
  }
}

function InterpreterDirective(node) {
  this.token(`#!${node.value}\n`);
}

function Placeholder(node) {
  this.token("%%");
  this.print(node.name);
  this.token("%%");

  if (node.expectedNode === "Statement") {
    this.semicolon();
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618203, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSXAttribute = JSXAttribute;
exports.JSXIdentifier = JSXIdentifier;
exports.JSXNamespacedName = JSXNamespacedName;
exports.JSXMemberExpression = JSXMemberExpression;
exports.JSXSpreadAttribute = JSXSpreadAttribute;
exports.JSXExpressionContainer = JSXExpressionContainer;
exports.JSXSpreadChild = JSXSpreadChild;
exports.JSXText = JSXText;
exports.JSXElement = JSXElement;
exports.JSXOpeningElement = JSXOpeningElement;
exports.JSXClosingElement = JSXClosingElement;
exports.JSXEmptyExpression = JSXEmptyExpression;
exports.JSXFragment = JSXFragment;
exports.JSXOpeningFragment = JSXOpeningFragment;
exports.JSXClosingFragment = JSXClosingFragment;

function JSXAttribute(node) {
  this.print(node.name, node);

  if (node.value) {
    this.token("=");
    this.print(node.value, node);
  }
}

function JSXIdentifier(node) {
  this.word(node.name);
}

function JSXNamespacedName(node) {
  this.print(node.namespace, node);
  this.token(":");
  this.print(node.name, node);
}

function JSXMemberExpression(node) {
  this.print(node.object, node);
  this.token(".");
  this.print(node.property, node);
}

function JSXSpreadAttribute(node) {
  this.token("{");
  this.token("...");
  this.print(node.argument, node);
  this.token("}");
}

function JSXExpressionContainer(node) {
  this.token("{");
  this.print(node.expression, node);
  this.token("}");
}

function JSXSpreadChild(node) {
  this.token("{");
  this.token("...");
  this.print(node.expression, node);
  this.token("}");
}

function JSXText(node) {
  const raw = this.getPossibleRaw(node);

  if (raw != null) {
    this.token(raw);
  } else {
    this.token(node.value);
  }
}

function JSXElement(node) {
  const open = node.openingElement;
  this.print(open, node);
  if (open.selfClosing) return;
  this.indent();

  for (const child of node.children) {
    this.print(child, node);
  }

  this.dedent();
  this.print(node.closingElement, node);
}

function spaceSeparator() {
  this.space();
}

function JSXOpeningElement(node) {
  this.token("<");
  this.print(node.name, node);
  this.print(node.typeParameters, node);

  if (node.attributes.length > 0) {
    this.space();
    this.printJoin(node.attributes, node, {
      separator: spaceSeparator
    });
  }

  if (node.selfClosing) {
    this.space();
    this.token("/>");
  } else {
    this.token(">");
  }
}

function JSXClosingElement(node) {
  this.token("</");
  this.print(node.name, node);
  this.token(">");
}

function JSXEmptyExpression(node) {
  this.printInnerComments(node);
}

function JSXFragment(node) {
  this.print(node.openingFragment, node);
  this.indent();

  for (const child of node.children) {
    this.print(child, node);
  }

  this.dedent();
  this.print(node.closingFragment, node);
}

function JSXOpeningFragment() {
  this.token("<");
  this.token(">");
}

function JSXClosingFragment() {
  this.token("</");
  this.token(">");
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618204, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TSTypeAnnotation = TSTypeAnnotation;
exports.TSTypeParameterDeclaration = exports.TSTypeParameterInstantiation = TSTypeParameterInstantiation;
exports.TSTypeParameter = TSTypeParameter;
exports.TSParameterProperty = TSParameterProperty;
exports.TSDeclareFunction = TSDeclareFunction;
exports.TSDeclareMethod = TSDeclareMethod;
exports.TSQualifiedName = TSQualifiedName;
exports.TSCallSignatureDeclaration = TSCallSignatureDeclaration;
exports.TSConstructSignatureDeclaration = TSConstructSignatureDeclaration;
exports.TSPropertySignature = TSPropertySignature;
exports.tsPrintPropertyOrMethodName = tsPrintPropertyOrMethodName;
exports.TSMethodSignature = TSMethodSignature;
exports.TSIndexSignature = TSIndexSignature;
exports.TSAnyKeyword = TSAnyKeyword;
exports.TSBigIntKeyword = TSBigIntKeyword;
exports.TSUnknownKeyword = TSUnknownKeyword;
exports.TSNumberKeyword = TSNumberKeyword;
exports.TSObjectKeyword = TSObjectKeyword;
exports.TSBooleanKeyword = TSBooleanKeyword;
exports.TSStringKeyword = TSStringKeyword;
exports.TSSymbolKeyword = TSSymbolKeyword;
exports.TSVoidKeyword = TSVoidKeyword;
exports.TSUndefinedKeyword = TSUndefinedKeyword;
exports.TSNullKeyword = TSNullKeyword;
exports.TSNeverKeyword = TSNeverKeyword;
exports.TSThisType = TSThisType;
exports.TSFunctionType = TSFunctionType;
exports.TSConstructorType = TSConstructorType;
exports.tsPrintFunctionOrConstructorType = tsPrintFunctionOrConstructorType;
exports.TSTypeReference = TSTypeReference;
exports.TSTypePredicate = TSTypePredicate;
exports.TSTypeQuery = TSTypeQuery;
exports.TSTypeLiteral = TSTypeLiteral;
exports.tsPrintTypeLiteralOrInterfaceBody = tsPrintTypeLiteralOrInterfaceBody;
exports.tsPrintBraced = tsPrintBraced;
exports.TSArrayType = TSArrayType;
exports.TSTupleType = TSTupleType;
exports.TSOptionalType = TSOptionalType;
exports.TSRestType = TSRestType;
exports.TSUnionType = TSUnionType;
exports.TSIntersectionType = TSIntersectionType;
exports.tsPrintUnionOrIntersectionType = tsPrintUnionOrIntersectionType;
exports.TSConditionalType = TSConditionalType;
exports.TSInferType = TSInferType;
exports.TSParenthesizedType = TSParenthesizedType;
exports.TSTypeOperator = TSTypeOperator;
exports.TSIndexedAccessType = TSIndexedAccessType;
exports.TSMappedType = TSMappedType;
exports.TSLiteralType = TSLiteralType;
exports.TSExpressionWithTypeArguments = TSExpressionWithTypeArguments;
exports.TSInterfaceDeclaration = TSInterfaceDeclaration;
exports.TSInterfaceBody = TSInterfaceBody;
exports.TSTypeAliasDeclaration = TSTypeAliasDeclaration;
exports.TSAsExpression = TSAsExpression;
exports.TSTypeAssertion = TSTypeAssertion;
exports.TSEnumDeclaration = TSEnumDeclaration;
exports.TSEnumMember = TSEnumMember;
exports.TSModuleDeclaration = TSModuleDeclaration;
exports.TSModuleBlock = TSModuleBlock;
exports.TSImportType = TSImportType;
exports.TSImportEqualsDeclaration = TSImportEqualsDeclaration;
exports.TSExternalModuleReference = TSExternalModuleReference;
exports.TSNonNullExpression = TSNonNullExpression;
exports.TSExportAssignment = TSExportAssignment;
exports.TSNamespaceExportDeclaration = TSNamespaceExportDeclaration;
exports.tsPrintSignatureDeclarationBase = tsPrintSignatureDeclarationBase;
exports.tsPrintClassMemberModifiers = tsPrintClassMemberModifiers;

function TSTypeAnnotation(node) {
  this.token(":");
  this.space();
  if (node.optional) this.token("?");
  this.print(node.typeAnnotation, node);
}

function TSTypeParameterInstantiation(node) {
  this.token("<");
  this.printList(node.params, node, {});
  this.token(">");
}

function TSTypeParameter(node) {
  this.word(node.name);

  if (node.constraint) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.constraint, node);
  }

  if (node.default) {
    this.space();
    this.token("=");
    this.space();
    this.print(node.default, node);
  }
}

function TSParameterProperty(node) {
  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }

  if (node.readonly) {
    this.word("readonly");
    this.space();
  }

  this._param(node.parameter);
}

function TSDeclareFunction(node) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }

  this._functionHead(node);

  this.token(";");
}

function TSDeclareMethod(node) {
  this._classMethodHead(node);

  this.token(";");
}

function TSQualifiedName(node) {
  this.print(node.left, node);
  this.token(".");
  this.print(node.right, node);
}

function TSCallSignatureDeclaration(node) {
  this.tsPrintSignatureDeclarationBase(node);
  this.token(";");
}

function TSConstructSignatureDeclaration(node) {
  this.word("new");
  this.space();
  this.tsPrintSignatureDeclarationBase(node);
  this.token(";");
}

function TSPropertySignature(node) {
  const {
    readonly,
    initializer
  } = node;

  if (readonly) {
    this.word("readonly");
    this.space();
  }

  this.tsPrintPropertyOrMethodName(node);
  this.print(node.typeAnnotation, node);

  if (initializer) {
    this.space();
    this.token("=");
    this.space();
    this.print(initializer, node);
  }

  this.token(";");
}

function tsPrintPropertyOrMethodName(node) {
  if (node.computed) {
    this.token("[");
  }

  this.print(node.key, node);

  if (node.computed) {
    this.token("]");
  }

  if (node.optional) {
    this.token("?");
  }
}

function TSMethodSignature(node) {
  this.tsPrintPropertyOrMethodName(node);
  this.tsPrintSignatureDeclarationBase(node);
  this.token(";");
}

function TSIndexSignature(node) {
  const {
    readonly
  } = node;

  if (readonly) {
    this.word("readonly");
    this.space();
  }

  this.token("[");

  this._parameters(node.parameters, node);

  this.token("]");
  this.print(node.typeAnnotation, node);
  this.token(";");
}

function TSAnyKeyword() {
  this.word("any");
}

function TSBigIntKeyword() {
  this.word("bigint");
}

function TSUnknownKeyword() {
  this.word("unknown");
}

function TSNumberKeyword() {
  this.word("number");
}

function TSObjectKeyword() {
  this.word("object");
}

function TSBooleanKeyword() {
  this.word("boolean");
}

function TSStringKeyword() {
  this.word("string");
}

function TSSymbolKeyword() {
  this.word("symbol");
}

function TSVoidKeyword() {
  this.word("void");
}

function TSUndefinedKeyword() {
  this.word("undefined");
}

function TSNullKeyword() {
  this.word("null");
}

function TSNeverKeyword() {
  this.word("never");
}

function TSThisType() {
  this.word("this");
}

function TSFunctionType(node) {
  this.tsPrintFunctionOrConstructorType(node);
}

function TSConstructorType(node) {
  this.word("new");
  this.space();
  this.tsPrintFunctionOrConstructorType(node);
}

function tsPrintFunctionOrConstructorType(node) {
  const {
    typeParameters,
    parameters
  } = node;
  this.print(typeParameters, node);
  this.token("(");

  this._parameters(parameters, node);

  this.token(")");
  this.space();
  this.token("=>");
  this.space();
  this.print(node.typeAnnotation.typeAnnotation, node);
}

function TSTypeReference(node) {
  this.print(node.typeName, node);
  this.print(node.typeParameters, node);
}

function TSTypePredicate(node) {
  if (node.asserts) {
    this.word("asserts");
    this.space();
  }

  this.print(node.parameterName);

  if (node.typeAnnotation) {
    this.space();
    this.word("is");
    this.space();
    this.print(node.typeAnnotation.typeAnnotation);
  }
}

function TSTypeQuery(node) {
  this.word("typeof");
  this.space();
  this.print(node.exprName);
}

function TSTypeLiteral(node) {
  this.tsPrintTypeLiteralOrInterfaceBody(node.members, node);
}

function tsPrintTypeLiteralOrInterfaceBody(members, node) {
  this.tsPrintBraced(members, node);
}

function tsPrintBraced(members, node) {
  this.token("{");

  if (members.length) {
    this.indent();
    this.newline();

    for (const member of members) {
      this.print(member, node);
      this.newline();
    }

    this.dedent();
    this.rightBrace();
  } else {
    this.token("}");
  }
}

function TSArrayType(node) {
  this.print(node.elementType, node);
  this.token("[]");
}

function TSTupleType(node) {
  this.token("[");
  this.printList(node.elementTypes, node);
  this.token("]");
}

function TSOptionalType(node) {
  this.print(node.typeAnnotation, node);
  this.token("?");
}

function TSRestType(node) {
  this.token("...");
  this.print(node.typeAnnotation, node);
}

function TSUnionType(node) {
  this.tsPrintUnionOrIntersectionType(node, "|");
}

function TSIntersectionType(node) {
  this.tsPrintUnionOrIntersectionType(node, "&");
}

function tsPrintUnionOrIntersectionType(node, sep) {
  this.printJoin(node.types, node, {
    separator() {
      this.space();
      this.token(sep);
      this.space();
    }

  });
}

function TSConditionalType(node) {
  this.print(node.checkType);
  this.space();
  this.word("extends");
  this.space();
  this.print(node.extendsType);
  this.space();
  this.token("?");
  this.space();
  this.print(node.trueType);
  this.space();
  this.token(":");
  this.space();
  this.print(node.falseType);
}

function TSInferType(node) {
  this.token("infer");
  this.space();
  this.print(node.typeParameter);
}

function TSParenthesizedType(node) {
  this.token("(");
  this.print(node.typeAnnotation, node);
  this.token(")");
}

function TSTypeOperator(node) {
  this.token(node.operator);
  this.space();
  this.print(node.typeAnnotation, node);
}

function TSIndexedAccessType(node) {
  this.print(node.objectType, node);
  this.token("[");
  this.print(node.indexType, node);
  this.token("]");
}

function TSMappedType(node) {
  const {
    readonly,
    typeParameter,
    optional
  } = node;
  this.token("{");
  this.space();

  if (readonly) {
    tokenIfPlusMinus(this, readonly);
    this.word("readonly");
    this.space();
  }

  this.token("[");
  this.word(typeParameter.name);
  this.space();
  this.word("in");
  this.space();
  this.print(typeParameter.constraint, typeParameter);
  this.token("]");

  if (optional) {
    tokenIfPlusMinus(this, optional);
    this.token("?");
  }

  this.token(":");
  this.space();
  this.print(node.typeAnnotation, node);
  this.space();
  this.token("}");
}

function tokenIfPlusMinus(self, tok) {
  if (tok !== true) {
    self.token(tok);
  }
}

function TSLiteralType(node) {
  this.print(node.literal, node);
}

function TSExpressionWithTypeArguments(node) {
  this.print(node.expression, node);
  this.print(node.typeParameters, node);
}

function TSInterfaceDeclaration(node) {
  const {
    declare,
    id,
    typeParameters,
    extends: extendz,
    body
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  this.word("interface");
  this.space();
  this.print(id, node);
  this.print(typeParameters, node);

  if (extendz) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(extendz, node);
  }

  this.space();
  this.print(body, node);
}

function TSInterfaceBody(node) {
  this.tsPrintTypeLiteralOrInterfaceBody(node.body, node);
}

function TSTypeAliasDeclaration(node) {
  const {
    declare,
    id,
    typeParameters,
    typeAnnotation
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  this.word("type");
  this.space();
  this.print(id, node);
  this.print(typeParameters, node);
  this.space();
  this.token("=");
  this.space();
  this.print(typeAnnotation, node);
  this.token(";");
}

function TSAsExpression(node) {
  const {
    expression,
    typeAnnotation
  } = node;
  this.print(expression, node);
  this.space();
  this.word("as");
  this.space();
  this.print(typeAnnotation, node);
}

function TSTypeAssertion(node) {
  const {
    typeAnnotation,
    expression
  } = node;
  this.token("<");
  this.print(typeAnnotation, node);
  this.token(">");
  this.space();
  this.print(expression, node);
}

function TSEnumDeclaration(node) {
  const {
    declare,
    const: isConst,
    id,
    members
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  if (isConst) {
    this.word("const");
    this.space();
  }

  this.word("enum");
  this.space();
  this.print(id, node);
  this.space();
  this.tsPrintBraced(members, node);
}

function TSEnumMember(node) {
  const {
    id,
    initializer
  } = node;
  this.print(id, node);

  if (initializer) {
    this.space();
    this.token("=");
    this.space();
    this.print(initializer, node);
  }

  this.token(",");
}

function TSModuleDeclaration(node) {
  const {
    declare,
    id
  } = node;

  if (declare) {
    this.word("declare");
    this.space();
  }

  if (!node.global) {
    this.word(id.type === "Identifier" ? "namespace" : "module");
    this.space();
  }

  this.print(id, node);

  if (!node.body) {
    this.token(";");
    return;
  }

  let body = node.body;

  while (body.type === "TSModuleDeclaration") {
    this.token(".");
    this.print(body.id, body);
    body = body.body;
  }

  this.space();
  this.print(body, node);
}

function TSModuleBlock(node) {
  this.tsPrintBraced(node.body, node);
}

function TSImportType(node) {
  const {
    argument,
    qualifier,
    typeParameters
  } = node;
  this.word("import");
  this.token("(");
  this.print(argument, node);
  this.token(")");

  if (qualifier) {
    this.token(".");
    this.print(qualifier, node);
  }

  if (typeParameters) {
    this.print(typeParameters, node);
  }
}

function TSImportEqualsDeclaration(node) {
  const {
    isExport,
    id,
    moduleReference
  } = node;

  if (isExport) {
    this.word("export");
    this.space();
  }

  this.word("import");
  this.space();
  this.print(id, node);
  this.space();
  this.token("=");
  this.space();
  this.print(moduleReference, node);
  this.token(";");
}

function TSExternalModuleReference(node) {
  this.token("require(");
  this.print(node.expression, node);
  this.token(")");
}

function TSNonNullExpression(node) {
  this.print(node.expression, node);
  this.token("!");
}

function TSExportAssignment(node) {
  this.word("export");
  this.space();
  this.token("=");
  this.space();
  this.print(node.expression, node);
  this.token(";");
}

function TSNamespaceExportDeclaration(node) {
  this.word("export");
  this.space();
  this.word("as");
  this.space();
  this.word("namespace");
  this.space();
  this.print(node.id, node);
}

function tsPrintSignatureDeclarationBase(node) {
  const {
    typeParameters,
    parameters
  } = node;
  this.print(typeParameters, node);
  this.token("(");

  this._parameters(parameters, node);

  this.token(")");
  this.print(node.typeAnnotation, node);
}

function tsPrintClassMemberModifiers(node, isField) {
  if (isField && node.declare) {
    this.word("declare");
    this.space();
  }

  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }

  if (node.static) {
    this.word("static");
    this.space();
  }

  if (node.abstract) {
    this.word("abstract");
    this.space();
  }

  if (isField && node.readonly) {
    this.word("readonly");
    this.space();
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1581324618186);
})()
//# sourceMappingURL=index.js.map