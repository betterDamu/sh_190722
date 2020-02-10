module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1581324618340, function(require, module, exports) {
module.exports = require('./fork')([
    // This core module of AST types captures ES5 as it is parsed today by
    // git://github.com/ariya/esprima.git#master.
    require("./def/core"),

    // Feel free to add to or remove from this list of extension modules to
    // configure the precise type hierarchy that you need.
    require("./def/es6"),
    require("./def/es7"),
    require("./def/mozilla"),
    require("./def/e4x"),
    require("./def/jsx"),
    require("./def/flow"),
    require("./def/esprima"),
    require("./def/babel"),
    require("./def/babel6")
]);

}, function(modId) {var map = {"./fork":1581324618341,"./def/core":1581324618348,"./def/es6":1581324618350,"./def/es7":1581324618351,"./def/mozilla":1581324618352,"./def/e4x":1581324618353,"./def/jsx":1581324618354,"./def/flow":1581324618355,"./def/esprima":1581324618356,"./def/babel":1581324618357,"./def/babel6":1581324618358}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618341, function(require, module, exports) {
module.exports = function (defs) {
    var used = [];
    var usedResult = [];
    var fork = {};

    function use(plugin) {
        var idx = used.indexOf(plugin);
        if (idx === -1) {
            idx = used.length;
            used.push(plugin);
            usedResult[idx] = plugin(fork);
        }
        return usedResult[idx];
    }

    fork.use = use;

    var types = use(require('./lib/types'));

    defs.forEach(use);

    types.finalize();

    var exports = {
        Type: types.Type,
        builtInTypes: types.builtInTypes,
        namedTypes: types.namedTypes,
        builders: types.builders,
        defineMethod: types.defineMethod,
        getFieldNames: types.getFieldNames,
        getFieldValue: types.getFieldValue,
        eachField: types.eachField,
        someField: types.someField,
        getSupertypeNames: types.getSupertypeNames,
        astNodesAreEquivalent: use(require("./lib/equiv")),
        finalize: types.finalize,
        Path: use(require('./lib/path')),
        NodePath: use(require("./lib/node-path")),
        PathVisitor: use(require("./lib/path-visitor")),
        use: use
    };

    exports.visit = exports.PathVisitor.visit;

    return exports;
};
}, function(modId) { var map = {"./lib/types":1581324618342,"./lib/equiv":1581324618343,"./lib/path":1581324618344,"./lib/node-path":1581324618345,"./lib/path-visitor":1581324618347}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618342, function(require, module, exports) {
var Ap = Array.prototype;
var slice = Ap.slice;
var map = Ap.map;
var each = Ap.forEach;
var Op = Object.prototype;
var objToStr = Op.toString;
var funObjStr = objToStr.call(function(){});
var strObjStr = objToStr.call("");
var hasOwn = Op.hasOwnProperty;

module.exports = function () {

    var exports = {};

    // A type is an object with a .check method that takes a value and returns
    // true or false according to whether the value matches the type.

    function Type(check, name) {
        var self = this;
        if (!(self instanceof Type)) {
            throw new Error("Type constructor cannot be invoked without 'new'");
        }

        // Unfortunately we can't elegantly reuse isFunction and isString,
        // here, because this code is executed while defining those types.
        if (objToStr.call(check) !== funObjStr) {
            throw new Error(check + " is not a function");
        }

        // The `name` parameter can be either a function or a string.
        var nameObjStr = objToStr.call(name);
        if (!(nameObjStr === funObjStr ||
          nameObjStr === strObjStr)) {
            throw new Error(name + " is neither a function nor a string");
        }

        Object.defineProperties(self, {
            name: {value: name},
            check: {
                value: function (value, deep) {
                    var result = check.call(self, value, deep);
                    if (!result && deep && objToStr.call(deep) === funObjStr)
                        deep(self, value);
                    return result;
                }
            }
        });
    }

    var Tp = Type.prototype;

    // Throughout this file we use Object.defineProperty to prevent
    // redefinition of exported properties.
    exports.Type = Type;

    // Like .check, except that failure triggers an AssertionError.
    Tp.assert = function (value, deep) {
        if (!this.check(value, deep)) {
            var str = shallowStringify(value);
            throw new Error(str + " does not match type " + this);
        }
        return true;
    };

    function shallowStringify(value) {
        if (isObject.check(value))
            return "{" + Object.keys(value).map(function (key) {
                  return key + ": " + value[key];
              }).join(", ") + "}";

        if (isArray.check(value))
            return "[" + value.map(shallowStringify).join(", ") + "]";

        return JSON.stringify(value);
    }

    Tp.toString = function () {
        var name = this.name;

        if (isString.check(name))
            return name;

        if (isFunction.check(name))
            return name.call(this) + "";

        return name + " type";
    };

    var builtInCtorFns = [];
    var builtInCtorTypes = [];
    var builtInTypes = {};
    exports.builtInTypes = builtInTypes;

    function defBuiltInType(example, name) {
        var objStr = objToStr.call(example);

        var type = new Type(function (value) {
            return objToStr.call(value) === objStr;
        }, name);

        builtInTypes[name] = type;

        if (example && typeof example.constructor === "function") {
            builtInCtorFns.push(example.constructor);
            builtInCtorTypes.push(type);
        }

        return type;
    }

    // These types check the underlying [[Class]] attribute of the given
    // value, rather than using the problematic typeof operator. Note however
    // that no subtyping is considered; so, for instance, isObject.check
    // returns false for [], /./, new Date, and null.
    var isString = defBuiltInType("truthy", "string");
    var isFunction = defBuiltInType(function () {}, "function");
    var isArray = defBuiltInType([], "array");
    var isObject = defBuiltInType({}, "object");
    var isRegExp = defBuiltInType(/./, "RegExp");
    var isDate = defBuiltInType(new Date, "Date");
    var isNumber = defBuiltInType(3, "number");
    var isBoolean = defBuiltInType(true, "boolean");
    var isNull = defBuiltInType(null, "null");
    var isUndefined = defBuiltInType(void 0, "undefined");

    // There are a number of idiomatic ways of expressing types, so this
    // function serves to coerce them all to actual Type objects. Note that
    // providing the name argument is not necessary in most cases.
    function toType(from, name) {
        // The toType function should of course be idempotent.
        if (from instanceof Type)
            return from;

        // The Def type is used as a helper for constructing compound
        // interface types for AST nodes.
        if (from instanceof Def)
            return from.type;

        // Support [ElemType] syntax.
        if (isArray.check(from))
            return Type.fromArray(from);

        // Support { someField: FieldType, ... } syntax.
        if (isObject.check(from))
            return Type.fromObject(from);

        if (isFunction.check(from)) {
            var bicfIndex = builtInCtorFns.indexOf(from);
            if (bicfIndex >= 0) {
                return builtInCtorTypes[bicfIndex];
            }

            // If isFunction.check(from), and from is not a built-in
            // constructor, assume from is a binary predicate function we can
            // use to define the type.
            return new Type(from, name);
        }

        // As a last resort, toType returns a type that matches any value that
        // is === from. This is primarily useful for literal values like
        // toType(null), but it has the additional advantage of allowing
        // toType to be a total function.
        return new Type(function (value) {
            return value === from;
        }, isUndefined.check(name) ? function () {
            return from + "";
        } : name);
    }

    // Returns a type that matches the given value iff any of type1, type2,
    // etc. match the value.
    Type.or = function (/* type1, type2, ... */) {
        var types = [];
        var len = arguments.length;
        for (var i = 0; i < len; ++i)
            types.push(toType(arguments[i]));

        return new Type(function (value, deep) {
            for (var i = 0; i < len; ++i)
                if (types[i].check(value, deep))
                    return true;
            return false;
        }, function () {
            return types.join(" | ");
        });
    };

    Type.fromArray = function (arr) {
        if (!isArray.check(arr)) {
            throw new Error("");
        }
        if (arr.length !== 1) {
            throw new Error("only one element type is permitted for typed arrays");
        }
        return toType(arr[0]).arrayOf();
    };

    Tp.arrayOf = function () {
        var elemType = this;
        return new Type(function (value, deep) {
            return isArray.check(value) && value.every(function (elem) {
                  return elemType.check(elem, deep);
              });
        }, function () {
            return "[" + elemType + "]";
        });
    };

    Type.fromObject = function (obj) {
        var fields = Object.keys(obj).map(function (name) {
            return new Field(name, obj[name]);
        });

        return new Type(function (value, deep) {
            return isObject.check(value) && fields.every(function (field) {
                  return field.type.check(value[field.name], deep);
              });
        }, function () {
            return "{ " + fields.join(", ") + " }";
        });
    };

    function Field(name, type, defaultFn, hidden) {
        var self = this;

        if (!(self instanceof Field)) {
            throw new Error("Field constructor cannot be invoked without 'new'");
        }
        isString.assert(name);

        type = toType(type);

        var properties = {
            name: {value: name},
            type: {value: type},
            hidden: {value: !!hidden}
        };

        if (isFunction.check(defaultFn)) {
            properties.defaultFn = {value: defaultFn};
        }

        Object.defineProperties(self, properties);
    }

    var Fp = Field.prototype;

    Fp.toString = function () {
        return JSON.stringify(this.name) + ": " + this.type;
    };

    Fp.getValue = function (obj) {
        var value = obj[this.name];

        if (!isUndefined.check(value))
            return value;

        if (this.defaultFn)
            value = this.defaultFn.call(obj);

        return value;
    };

    // Define a type whose name is registered in a namespace (the defCache) so
    // that future definitions will return the same type given the same name.
    // In particular, this system allows for circular and forward definitions.
    // The Def object d returned from Type.def may be used to configure the
    // type d.type by calling methods such as d.bases, d.build, and d.field.
    Type.def = function (typeName) {
        isString.assert(typeName);
        return hasOwn.call(defCache, typeName)
          ? defCache[typeName]
          : defCache[typeName] = new Def(typeName);
    };

    // In order to return the same Def instance every time Type.def is called
    // with a particular name, those instances need to be stored in a cache.
    var defCache = Object.create(null);

    function Def(typeName) {
        var self = this;
        if (!(self instanceof Def)) {
            throw new Error("Def constructor cannot be invoked without 'new'");
        }

        Object.defineProperties(self, {
            typeName: {value: typeName},
            baseNames: {value: []},
            ownFields: {value: Object.create(null)},

            // These two are populated during finalization.
            allSupertypes: {value: Object.create(null)}, // Includes own typeName.
            supertypeList: {value: []}, // Linear inheritance hierarchy.
            allFields: {value: Object.create(null)}, // Includes inherited fields.
            fieldNames: {value: []}, // Non-hidden keys of allFields.

            type: {
                value: new Type(function (value, deep) {
                    return self.check(value, deep);
                }, typeName)
            }
        });
    }

    Def.fromValue = function (value) {
        if (value && typeof value === "object") {
            var type = value.type;
            if (typeof type === "string" &&
              hasOwn.call(defCache, type)) {
                var d = defCache[type];
                if (d.finalized) {
                    return d;
                }
            }
        }

        return null;
    };

    var Dp = Def.prototype;

    Dp.isSupertypeOf = function (that) {
        if (that instanceof Def) {
            if (this.finalized !== true ||
              that.finalized !== true) {
                throw new Error("");
            }
            return hasOwn.call(that.allSupertypes, this.typeName);
        } else {
            throw new Error(that + " is not a Def");
        }
    };

    // Note that the list returned by this function is a copy of the internal
    // supertypeList, *without* the typeName itself as the first element.
    exports.getSupertypeNames = function (typeName) {
        if (!hasOwn.call(defCache, typeName)) {
            throw new Error("");
        }
        var d = defCache[typeName];
        if (d.finalized !== true) {
            throw new Error("");
        }
        return d.supertypeList.slice(1);
    };

    // Returns an object mapping from every known type in the defCache to the
    // most specific supertype whose name is an own property of the candidates
    // object.
    exports.computeSupertypeLookupTable = function (candidates) {
        var table = {};
        var typeNames = Object.keys(defCache);
        var typeNameCount = typeNames.length;

        for (var i = 0; i < typeNameCount; ++i) {
            var typeName = typeNames[i];
            var d = defCache[typeName];
            if (d.finalized !== true) {
                throw new Error("" + typeName);
            }
            for (var j = 0; j < d.supertypeList.length; ++j) {
                var superTypeName = d.supertypeList[j];
                if (hasOwn.call(candidates, superTypeName)) {
                    table[typeName] = superTypeName;
                    break;
                }
            }
        }

        return table;
    };

    Dp.checkAllFields = function (value, deep) {
        var allFields = this.allFields;
        if (this.finalized !== true) {
            throw new Error("" + this.typeName);
        }

        function checkFieldByName(name) {
            var field = allFields[name];
            var type = field.type;
            var child = field.getValue(value);
            return type.check(child, deep);
        }

        return isObject.check(value)
          && Object.keys(allFields).every(checkFieldByName);
    };

    Dp.check = function (value, deep) {
        if (this.finalized !== true) {
            throw new Error(
              "prematurely checking unfinalized type " + this.typeName
            );
        }

        // A Def type can only match an object value.
        if (!isObject.check(value))
            return false;

        var vDef = Def.fromValue(value);
        if (!vDef) {
            // If we couldn't infer the Def associated with the given value,
            // and we expected it to be a SourceLocation or a Position, it was
            // probably just missing a "type" field (because Esprima does not
            // assign a type property to such nodes). Be optimistic and let
            // this.checkAllFields make the final decision.
            if (this.typeName === "SourceLocation" ||
              this.typeName === "Position") {
                return this.checkAllFields(value, deep);
            }

            // Calling this.checkAllFields for any other type of node is both
            // bad for performance and way too forgiving.
            return false;
        }

        // If checking deeply and vDef === this, then we only need to call
        // checkAllFields once. Calling checkAllFields is too strict when deep
        // is false, because then we only care about this.isSupertypeOf(vDef).
        if (deep && vDef === this)
            return this.checkAllFields(value, deep);

        // In most cases we rely exclusively on isSupertypeOf to make O(1)
        // subtyping determinations. This suffices in most situations outside
        // of unit tests, since interface conformance is checked whenever new
        // instances are created using builder functions.
        if (!this.isSupertypeOf(vDef))
            return false;

        // The exception is when deep is true; then, we recursively check all
        // fields.
        if (!deep)
            return true;

        // Use the more specific Def (vDef) to perform the deep check, but
        // shallow-check fields defined by the less specific Def (this).
        return vDef.checkAllFields(value, deep)
          && this.checkAllFields(value, false);
    };

    Dp.bases = function () {
        var args = slice.call(arguments);
        var bases = this.baseNames;

        if (this.finalized) {
            if (args.length !== bases.length) {
                throw new Error("");
            }
            for (var i = 0; i < args.length; i++) {
                if (args[i] !== bases[i]) {
                    throw new Error("");
                }
            }
            return this;
        }

        args.forEach(function (baseName) {
            isString.assert(baseName);

            // This indexOf lookup may be O(n), but the typical number of base
            // names is very small, and indexOf is a native Array method.
            if (bases.indexOf(baseName) < 0)
                bases.push(baseName);
        });

        return this; // For chaining.
    };

    // False by default until .build(...) is called on an instance.
    Object.defineProperty(Dp, "buildable", {value: false});

    var builders = {};
    exports.builders = builders;

    // This object is used as prototype for any node created by a builder.
    var nodePrototype = {};

    // Call this function to define a new method to be shared by all AST
     // nodes. The replaced method (if any) is returned for easy wrapping.
    exports.defineMethod = function (name, func) {
        var old = nodePrototype[name];

        // Pass undefined as func to delete nodePrototype[name].
        if (isUndefined.check(func)) {
            delete nodePrototype[name];

        } else {
            isFunction.assert(func);

            Object.defineProperty(nodePrototype, name, {
                enumerable: true, // For discoverability.
                configurable: true, // For delete proto[name].
                value: func
            });
        }

        return old;
    };

    var isArrayOfString = isString.arrayOf();

    // Calling the .build method of a Def simultaneously marks the type as
    // buildable (by defining builders[getBuilderName(typeName)]) and
    // specifies the order of arguments that should be passed to the builder
    // function to create an instance of the type.
    Dp.build = function (/* param1, param2, ... */) {
        var self = this;

        var newBuildParams = slice.call(arguments);
        isArrayOfString.assert(newBuildParams);

        // Calling Def.prototype.build multiple times has the effect of merely
        // redefining this property.
        Object.defineProperty(self, "buildParams", {
            value: newBuildParams,
            writable: false,
            enumerable: false,
            configurable: true
        });

        if (self.buildable) {
            // If this Def is already buildable, update self.buildParams and
            // continue using the old builder function.
            return self;
        }

        // Every buildable type will have its "type" field filled in
        // automatically. This includes types that are not subtypes of Node,
        // like SourceLocation, but that seems harmless (TODO?).
        self.field("type", String, function () { return self.typeName });

        // Override Dp.buildable for this Def instance.
        Object.defineProperty(self, "buildable", {value: true});

        Object.defineProperty(builders, getBuilderName(self.typeName), {
            enumerable: true,

            value: function () {
                var args = arguments;
                var argc = args.length;
                var built = Object.create(nodePrototype);

                if (!self.finalized) {
                    throw new Error(
                      "attempting to instantiate unfinalized type " +
                      self.typeName
                    );
                }

                function add(param, i) {
                    if (hasOwn.call(built, param))
                        return;

                    var all = self.allFields;
                    if (!hasOwn.call(all, param)) {
                        throw new Error("" + param);
                    }

                    var field = all[param];
                    var type = field.type;
                    var value;

                    if (isNumber.check(i) && i < argc) {
                        value = args[i];
                    } else if (field.defaultFn) {
                        // Expose the partially-built object to the default
                        // function as its `this` object.
                        value = field.defaultFn.call(built);
                    } else {
                        var message = "no value or default function given for field " +
                          JSON.stringify(param) + " of " + self.typeName + "(" +
                          self.buildParams.map(function (name) {
                              return all[name];
                          }).join(", ") + ")";
                        throw new Error(message);
                    }

                    if (!type.check(value)) {
                        throw new Error(
                          shallowStringify(value) +
                          " does not match field " + field +
                          " of type " + self.typeName
                        );
                    }

                    // TODO Could attach getters and setters here to enforce
                    // dynamic type safety.
                    built[param] = value;
                }

                self.buildParams.forEach(function (param, i) {
                    add(param, i);
                });

                Object.keys(self.allFields).forEach(function (param) {
                    add(param); // Use the default value.
                });

                // Make sure that the "type" field was filled automatically.
                if (built.type !== self.typeName) {
                    throw new Error("");
                }

                return built;
            }
        });

        return self; // For chaining.
    };

    function getBuilderName(typeName) {
        return typeName.replace(/^[A-Z]+/, function (upperCasePrefix) {
            var len = upperCasePrefix.length;
            switch (len) {
                case 0: return "";
                // If there's only one initial capital letter, just lower-case it.
                case 1: return upperCasePrefix.toLowerCase();
                default:
                    // If there's more than one initial capital letter, lower-case
                    // all but the last one, so that XMLDefaultDeclaration (for
                    // example) becomes xmlDefaultDeclaration.
                    return upperCasePrefix.slice(
                        0, len - 1).toLowerCase() +
                      upperCasePrefix.charAt(len - 1);
            }
        });
    }
    exports.getBuilderName = getBuilderName;

    function getStatementBuilderName(typeName) {
        typeName = getBuilderName(typeName);
        return typeName.replace(/(Expression)?$/, "Statement");
    }
    exports.getStatementBuilderName = getStatementBuilderName;

    // The reason fields are specified using .field(...) instead of an object
    // literal syntax is somewhat subtle: the object literal syntax would
    // support only one key and one value, but with .field(...) we can pass
    // any number of arguments to specify the field.
    Dp.field = function (name, type, defaultFn, hidden) {
        if (this.finalized) {
            console.error("Ignoring attempt to redefine field " +
              JSON.stringify(name) + " of finalized type " +
              JSON.stringify(this.typeName));
            return this;
        }
        this.ownFields[name] = new Field(name, type, defaultFn, hidden);
        return this; // For chaining.
    };

    var namedTypes = {};
    exports.namedTypes = namedTypes;

    // Like Object.keys, but aware of what fields each AST type should have.
    function getFieldNames(object) {
        var d = Def.fromValue(object);
        if (d) {
            return d.fieldNames.slice(0);
        }

        if ("type" in object) {
            throw new Error(
              "did not recognize object of type " +
              JSON.stringify(object.type)
            );
        }

        return Object.keys(object);
    }
    exports.getFieldNames = getFieldNames;

    // Get the value of an object property, taking object.type and default
    // functions into account.
    function getFieldValue(object, fieldName) {
        var d = Def.fromValue(object);
        if (d) {
            var field = d.allFields[fieldName];
            if (field) {
                return field.getValue(object);
            }
        }

        return object && object[fieldName];
    }
    exports.getFieldValue = getFieldValue;

    // Iterate over all defined fields of an object, including those missing
    // or undefined, passing each field name and effective value (as returned
    // by getFieldValue) to the callback. If the object has no corresponding
    // Def, the callback will never be called.
    exports.eachField = function (object, callback, context) {
        getFieldNames(object).forEach(function (name) {
            callback.call(this, name, getFieldValue(object, name));
        }, context);
    };

    // Similar to eachField, except that iteration stops as soon as the
    // callback returns a truthy value. Like Array.prototype.some, the final
    // result is either true or false to indicates whether the callback
    // returned true for any element or not.
    exports.someField = function (object, callback, context) {
        return getFieldNames(object).some(function (name) {
            return callback.call(this, name, getFieldValue(object, name));
        }, context);
    };

    // This property will be overridden as true by individual Def instances
    // when they are finalized.
    Object.defineProperty(Dp, "finalized", {value: false});

    Dp.finalize = function () {
        var self = this;

        // It's not an error to finalize a type more than once, but only the
        // first call to .finalize does anything.
        if (!self.finalized) {
            var allFields = self.allFields;
            var allSupertypes = self.allSupertypes;

            self.baseNames.forEach(function (name) {
                var def = defCache[name];
                if (def instanceof Def) {
                    def.finalize();
                    extend(allFields, def.allFields);
                    extend(allSupertypes, def.allSupertypes);
                } else {
                    var message = "unknown supertype name " +
                      JSON.stringify(name) +
                      " for subtype " +
                      JSON.stringify(self.typeName);
                    throw new Error(message);
                }
            });

            // TODO Warn if fields are overridden with incompatible types.
            extend(allFields, self.ownFields);
            allSupertypes[self.typeName] = self;

            self.fieldNames.length = 0;
            for (var fieldName in allFields) {
                if (hasOwn.call(allFields, fieldName) &&
                    !allFields[fieldName].hidden) {
                        self.fieldNames.push(fieldName);
                }
            }

            // Types are exported only once they have been finalized.
            Object.defineProperty(namedTypes, self.typeName, {
                enumerable: true,
                value: self.type
            });

            Object.defineProperty(self, "finalized", {value: true});

            // A linearization of the inheritance hierarchy.
            populateSupertypeList(self.typeName, self.supertypeList);

            if (self.buildable && self.supertypeList.lastIndexOf("Expression") >= 0) {
                wrapExpressionBuilderWithStatement(self.typeName);
            }
        }
    };

    // Adds an additional builder for Expression subtypes
    // that wraps the built Expression in an ExpressionStatements.
    function wrapExpressionBuilderWithStatement(typeName) {
        var wrapperName = getStatementBuilderName(typeName);

        // skip if the builder already exists
        if (builders[wrapperName]) return;

        // the builder function to wrap with builders.ExpressionStatement
        var wrapped = builders[getBuilderName(typeName)];

        // skip if there is nothing to wrap
        if (!wrapped) return;

        builders[wrapperName] = function () {
            return builders.expressionStatement(wrapped.apply(builders, arguments));
        };
    }

    function populateSupertypeList(typeName, list) {
        list.length = 0;
        list.push(typeName);

        var lastSeen = Object.create(null);

        for (var pos = 0; pos < list.length; ++pos) {
            typeName = list[pos];
            var d = defCache[typeName];
            if (d.finalized !== true) {
                throw new Error("");
            }

            // If we saw typeName earlier in the breadth-first traversal,
            // delete the last-seen occurrence.
            if (hasOwn.call(lastSeen, typeName)) {
                delete list[lastSeen[typeName]];
            }

            // Record the new index of the last-seen occurrence of typeName.
            lastSeen[typeName] = pos;

            // Enqueue the base names of this type.
            list.push.apply(list, d.baseNames);
        }

        // Compaction loop to remove array holes.
        for (var to = 0, from = to, len = list.length; from < len; ++from) {
            if (hasOwn.call(list, from)) {
                list[to++] = list[from];
            }
        }

        list.length = to;
    }

    function extend(into, from) {
        Object.keys(from).forEach(function (name) {
            into[name] = from[name];
        });

        return into;
    };

    exports.finalize = function () {
        Object.keys(defCache).forEach(function (name) {
            defCache[name].finalize();
        });
    };

    return exports;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618343, function(require, module, exports) {
module.exports = function (fork) {
    var types = fork.use(require('../lib/types'));
    var getFieldNames = types.getFieldNames;
    var getFieldValue = types.getFieldValue;
    var isArray = types.builtInTypes.array;
    var isObject = types.builtInTypes.object;
    var isDate = types.builtInTypes.Date;
    var isRegExp = types.builtInTypes.RegExp;
    var hasOwn = Object.prototype.hasOwnProperty;

    function astNodesAreEquivalent(a, b, problemPath) {
        if (isArray.check(problemPath)) {
            problemPath.length = 0;
        } else {
            problemPath = null;
        }

        return areEquivalent(a, b, problemPath);
    }

    astNodesAreEquivalent.assert = function (a, b) {
        var problemPath = [];
        if (!astNodesAreEquivalent(a, b, problemPath)) {
            if (problemPath.length === 0) {
                if (a !== b) {
                    throw new Error("Nodes must be equal");
                }
            } else {
                throw new Error(
                  "Nodes differ in the following path: " +
                  problemPath.map(subscriptForProperty).join("")
                );
            }
        }
    };

    function subscriptForProperty(property) {
        if (/[_$a-z][_$a-z0-9]*/i.test(property)) {
            return "." + property;
        }
        return "[" + JSON.stringify(property) + "]";
    }

    function areEquivalent(a, b, problemPath) {
        if (a === b) {
            return true;
        }

        if (isArray.check(a)) {
            return arraysAreEquivalent(a, b, problemPath);
        }

        if (isObject.check(a)) {
            return objectsAreEquivalent(a, b, problemPath);
        }

        if (isDate.check(a)) {
            return isDate.check(b) && (+a === +b);
        }

        if (isRegExp.check(a)) {
            return isRegExp.check(b) && (
                a.source === b.source &&
                a.global === b.global &&
                a.multiline === b.multiline &&
                a.ignoreCase === b.ignoreCase
              );
        }

        return a == b;
    }

    function arraysAreEquivalent(a, b, problemPath) {
        isArray.assert(a);
        var aLength = a.length;

        if (!isArray.check(b) || b.length !== aLength) {
            if (problemPath) {
                problemPath.push("length");
            }
            return false;
        }

        for (var i = 0; i < aLength; ++i) {
            if (problemPath) {
                problemPath.push(i);
            }

            if (i in a !== i in b) {
                return false;
            }

            if (!areEquivalent(a[i], b[i], problemPath)) {
                return false;
            }

            if (problemPath) {
                var problemPathTail = problemPath.pop();
                if (problemPathTail !== i) {
                    throw new Error("" + problemPathTail);
                }
            }
        }

        return true;
    }

    function objectsAreEquivalent(a, b, problemPath) {
        isObject.assert(a);
        if (!isObject.check(b)) {
            return false;
        }

        // Fast path for a common property of AST nodes.
        if (a.type !== b.type) {
            if (problemPath) {
                problemPath.push("type");
            }
            return false;
        }

        var aNames = getFieldNames(a);
        var aNameCount = aNames.length;

        var bNames = getFieldNames(b);
        var bNameCount = bNames.length;

        if (aNameCount === bNameCount) {
            for (var i = 0; i < aNameCount; ++i) {
                var name = aNames[i];
                var aChild = getFieldValue(a, name);
                var bChild = getFieldValue(b, name);

                if (problemPath) {
                    problemPath.push(name);
                }

                if (!areEquivalent(aChild, bChild, problemPath)) {
                    return false;
                }

                if (problemPath) {
                    var problemPathTail = problemPath.pop();
                    if (problemPathTail !== name) {
                        throw new Error("" + problemPathTail);
                    }
                }
            }

            return true;
        }

        if (!problemPath) {
            return false;
        }

        // Since aNameCount !== bNameCount, we need to find some name that's
        // missing in aNames but present in bNames, or vice-versa.

        var seenNames = Object.create(null);

        for (i = 0; i < aNameCount; ++i) {
            seenNames[aNames[i]] = true;
        }

        for (i = 0; i < bNameCount; ++i) {
            name = bNames[i];

            if (!hasOwn.call(seenNames, name)) {
                problemPath.push(name);
                return false;
            }

            delete seenNames[name];
        }

        for (name in seenNames) {
            problemPath.push(name);
            break;
        }

        return false;
    }
    
    return astNodesAreEquivalent;
};

}, function(modId) { var map = {"../lib/types":1581324618342}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618344, function(require, module, exports) {
var Ap = Array.prototype;
var slice = Ap.slice;
var map = Ap.map;
var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;

module.exports = function (fork) {
    var types = fork.use(require("./types"));
    var isArray = types.builtInTypes.array;
    var isNumber = types.builtInTypes.number;

    function Path(value, parentPath, name) {
        if (!(this instanceof Path)) {
            throw new Error("Path constructor cannot be invoked without 'new'");
        }

        if (parentPath) {
            if (!(parentPath instanceof Path)) {
                throw new Error("");
            }
        } else {
            parentPath = null;
            name = null;
        }

        // The value encapsulated by this Path, generally equal to
        // parentPath.value[name] if we have a parentPath.
        this.value = value;

        // The immediate parent Path of this Path.
        this.parentPath = parentPath;

        // The name of the property of parentPath.value through which this
        // Path's value was reached.
        this.name = name;

        // Calling path.get("child") multiple times always returns the same
        // child Path object, for both performance and consistency reasons.
        this.__childCache = null;
    }

    var Pp = Path.prototype;

    function getChildCache(path) {
        // Lazily create the child cache. This also cheapens cache
        // invalidation, since you can just reset path.__childCache to null.
        return path.__childCache || (path.__childCache = Object.create(null));
    }

    function getChildPath(path, name) {
        var cache = getChildCache(path);
        var actualChildValue = path.getValueProperty(name);
        var childPath = cache[name];
        if (!hasOwn.call(cache, name) ||
          // Ensure consistency between cache and reality.
          childPath.value !== actualChildValue) {
            childPath = cache[name] = new path.constructor(
              actualChildValue, path, name
            );
        }
        return childPath;
    }

// This method is designed to be overridden by subclasses that need to
// handle missing properties, etc.
    Pp.getValueProperty = function getValueProperty(name) {
        return this.value[name];
    };

    Pp.get = function get(name) {
        var path = this;
        var names = arguments;
        var count = names.length;

        for (var i = 0; i < count; ++i) {
            path = getChildPath(path, names[i]);
        }

        return path;
    };

    Pp.each = function each(callback, context) {
        var childPaths = [];
        var len = this.value.length;
        var i = 0;

        // Collect all the original child paths before invoking the callback.
        for (var i = 0; i < len; ++i) {
            if (hasOwn.call(this.value, i)) {
                childPaths[i] = this.get(i);
            }
        }

        // Invoke the callback on just the original child paths, regardless of
        // any modifications made to the array by the callback. I chose these
        // semantics over cleverly invoking the callback on new elements because
        // this way is much easier to reason about.
        context = context || this;
        for (i = 0; i < len; ++i) {
            if (hasOwn.call(childPaths, i)) {
                callback.call(context, childPaths[i]);
            }
        }
    };

    Pp.map = function map(callback, context) {
        var result = [];

        this.each(function (childPath) {
            result.push(callback.call(this, childPath));
        }, context);

        return result;
    };

    Pp.filter = function filter(callback, context) {
        var result = [];

        this.each(function (childPath) {
            if (callback.call(this, childPath)) {
                result.push(childPath);
            }
        }, context);

        return result;
    };

    function emptyMoves() {}
    function getMoves(path, offset, start, end) {
        isArray.assert(path.value);

        if (offset === 0) {
            return emptyMoves;
        }

        var length = path.value.length;
        if (length < 1) {
            return emptyMoves;
        }

        var argc = arguments.length;
        if (argc === 2) {
            start = 0;
            end = length;
        } else if (argc === 3) {
            start = Math.max(start, 0);
            end = length;
        } else {
            start = Math.max(start, 0);
            end = Math.min(end, length);
        }

        isNumber.assert(start);
        isNumber.assert(end);

        var moves = Object.create(null);
        var cache = getChildCache(path);

        for (var i = start; i < end; ++i) {
            if (hasOwn.call(path.value, i)) {
                var childPath = path.get(i);
                if (childPath.name !== i) {
                    throw new Error("");
                }
                var newIndex = i + offset;
                childPath.name = newIndex;
                moves[newIndex] = childPath;
                delete cache[i];
            }
        }

        delete cache.length;

        return function () {
            for (var newIndex in moves) {
                var childPath = moves[newIndex];
                if (childPath.name !== +newIndex) {
                    throw new Error("");
                }
                cache[newIndex] = childPath;
                path.value[newIndex] = childPath.value;
            }
        };
    }

    Pp.shift = function shift() {
        var move = getMoves(this, -1);
        var result = this.value.shift();
        move();
        return result;
    };

    Pp.unshift = function unshift(node) {
        var move = getMoves(this, arguments.length);
        var result = this.value.unshift.apply(this.value, arguments);
        move();
        return result;
    };

    Pp.push = function push(node) {
        isArray.assert(this.value);
        delete getChildCache(this).length
        return this.value.push.apply(this.value, arguments);
    };

    Pp.pop = function pop() {
        isArray.assert(this.value);
        var cache = getChildCache(this);
        delete cache[this.value.length - 1];
        delete cache.length;
        return this.value.pop();
    };

    Pp.insertAt = function insertAt(index, node) {
        var argc = arguments.length;
        var move = getMoves(this, argc - 1, index);
        if (move === emptyMoves) {
            return this;
        }

        index = Math.max(index, 0);

        for (var i = 1; i < argc; ++i) {
            this.value[index + i - 1] = arguments[i];
        }

        move();

        return this;
    };

    Pp.insertBefore = function insertBefore(node) {
        var pp = this.parentPath;
        var argc = arguments.length;
        var insertAtArgs = [this.name];
        for (var i = 0; i < argc; ++i) {
            insertAtArgs.push(arguments[i]);
        }
        return pp.insertAt.apply(pp, insertAtArgs);
    };

    Pp.insertAfter = function insertAfter(node) {
        var pp = this.parentPath;
        var argc = arguments.length;
        var insertAtArgs = [this.name + 1];
        for (var i = 0; i < argc; ++i) {
            insertAtArgs.push(arguments[i]);
        }
        return pp.insertAt.apply(pp, insertAtArgs);
    };

    function repairRelationshipWithParent(path) {
        if (!(path instanceof Path)) {
            throw new Error("");
        }

        var pp = path.parentPath;
        if (!pp) {
            // Orphan paths have no relationship to repair.
            return path;
        }

        var parentValue = pp.value;
        var parentCache = getChildCache(pp);

        // Make sure parentCache[path.name] is populated.
        if (parentValue[path.name] === path.value) {
            parentCache[path.name] = path;
        } else if (isArray.check(parentValue)) {
            // Something caused path.name to become out of date, so attempt to
            // recover by searching for path.value in parentValue.
            var i = parentValue.indexOf(path.value);
            if (i >= 0) {
                parentCache[path.name = i] = path;
            }
        } else {
            // If path.value disagrees with parentValue[path.name], and
            // path.name is not an array index, let path.value become the new
            // parentValue[path.name] and update parentCache accordingly.
            parentValue[path.name] = path.value;
            parentCache[path.name] = path;
        }

        if (parentValue[path.name] !== path.value) {
            throw new Error("");
        }
        if (path.parentPath.get(path.name) !== path) {
            throw new Error("");
        }

        return path;
    }

    Pp.replace = function replace(replacement) {
        var results = [];
        var parentValue = this.parentPath.value;
        var parentCache = getChildCache(this.parentPath);
        var count = arguments.length;

        repairRelationshipWithParent(this);

        if (isArray.check(parentValue)) {
            var originalLength = parentValue.length;
            var move = getMoves(this.parentPath, count - 1, this.name + 1);

            var spliceArgs = [this.name, 1];
            for (var i = 0; i < count; ++i) {
                spliceArgs.push(arguments[i]);
            }

            var splicedOut = parentValue.splice.apply(parentValue, spliceArgs);

            if (splicedOut[0] !== this.value) {
                throw new Error("");
            }
            if (parentValue.length !== (originalLength - 1 + count)) {
                throw new Error("");
            }

            move();

            if (count === 0) {
                delete this.value;
                delete parentCache[this.name];
                this.__childCache = null;

            } else {
                if (parentValue[this.name] !== replacement) {
                    throw new Error("");
                }

                if (this.value !== replacement) {
                    this.value = replacement;
                    this.__childCache = null;
                }

                for (i = 0; i < count; ++i) {
                    results.push(this.parentPath.get(this.name + i));
                }

                if (results[0] !== this) {
                    throw new Error("");
                }
            }

        } else if (count === 1) {
            if (this.value !== replacement) {
                this.__childCache = null;
            }
            this.value = parentValue[this.name] = replacement;
            results.push(this);

        } else if (count === 0) {
            delete parentValue[this.name];
            delete this.value;
            this.__childCache = null;

            // Leave this path cached as parentCache[this.name], even though
            // it no longer has a value defined.

        } else {
            throw new Error("Could not replace path");
        }

        return results;
    };

    return Path;
};

}, function(modId) { var map = {"./types":1581324618342}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618345, function(require, module, exports) {
module.exports = function (fork) {
    var types = fork.use(require("./types"));
    var n = types.namedTypes;
    var b = types.builders;
    var isNumber = types.builtInTypes.number;
    var isArray = types.builtInTypes.array;
    var Path = fork.use(require("./path"));
    var Scope = fork.use(require("./scope"));

    function NodePath(value, parentPath, name) {
        if (!(this instanceof NodePath)) {
            throw new Error("NodePath constructor cannot be invoked without 'new'");
        }
        Path.call(this, value, parentPath, name);
    }

    var NPp = NodePath.prototype = Object.create(Path.prototype, {
        constructor: {
            value: NodePath,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    Object.defineProperties(NPp, {
        node: {
            get: function () {
                Object.defineProperty(this, "node", {
                    configurable: true, // Enable deletion.
                    value: this._computeNode()
                });

                return this.node;
            }
        },

        parent: {
            get: function () {
                Object.defineProperty(this, "parent", {
                    configurable: true, // Enable deletion.
                    value: this._computeParent()
                });

                return this.parent;
            }
        },

        scope: {
            get: function () {
                Object.defineProperty(this, "scope", {
                    configurable: true, // Enable deletion.
                    value: this._computeScope()
                });

                return this.scope;
            }
        }
    });

    NPp.replace = function () {
        delete this.node;
        delete this.parent;
        delete this.scope;
        return Path.prototype.replace.apply(this, arguments);
    };

    NPp.prune = function () {
        var remainingNodePath = this.parent;

        this.replace();

        return cleanUpNodesAfterPrune(remainingNodePath);
    };

    // The value of the first ancestor Path whose value is a Node.
    NPp._computeNode = function () {
        var value = this.value;
        if (n.Node.check(value)) {
            return value;
        }

        var pp = this.parentPath;
        return pp && pp.node || null;
    };

    // The first ancestor Path whose value is a Node distinct from this.node.
    NPp._computeParent = function () {
        var value = this.value;
        var pp = this.parentPath;

        if (!n.Node.check(value)) {
            while (pp && !n.Node.check(pp.value)) {
                pp = pp.parentPath;
            }

            if (pp) {
                pp = pp.parentPath;
            }
        }

        while (pp && !n.Node.check(pp.value)) {
            pp = pp.parentPath;
        }

        return pp || null;
    };

    // The closest enclosing scope that governs this node.
    NPp._computeScope = function () {
        var value = this.value;
        var pp = this.parentPath;
        var scope = pp && pp.scope;

        if (n.Node.check(value) &&
          Scope.isEstablishedBy(value)) {
            scope = new Scope(this, scope);
        }

        return scope || null;
    };

    NPp.getValueProperty = function (name) {
        return types.getFieldValue(this.value, name);
    };

    /**
     * Determine whether this.node needs to be wrapped in parentheses in order
     * for a parser to reproduce the same local AST structure.
     *
     * For instance, in the expression `(1 + 2) * 3`, the BinaryExpression
     * whose operator is "+" needs parentheses, because `1 + 2 * 3` would
     * parse differently.
     *
     * If assumeExpressionContext === true, we don't worry about edge cases
     * like an anonymous FunctionExpression appearing lexically first in its
     * enclosing statement and thus needing parentheses to avoid being parsed
     * as a FunctionDeclaration with a missing name.
     */
    NPp.needsParens = function (assumeExpressionContext) {
        var pp = this.parentPath;
        if (!pp) {
            return false;
        }

        var node = this.value;

        // Only expressions need parentheses.
        if (!n.Expression.check(node)) {
            return false;
        }

        // Identifiers never need parentheses.
        if (node.type === "Identifier") {
            return false;
        }

        while (!n.Node.check(pp.value)) {
            pp = pp.parentPath;
            if (!pp) {
                return false;
            }
        }

        var parent = pp.value;

        switch (node.type) {
            case "UnaryExpression":
            case "SpreadElement":
            case "SpreadProperty":
                return parent.type === "MemberExpression"
                  && this.name === "object"
                  && parent.object === node;

            case "BinaryExpression":
            case "LogicalExpression":
                switch (parent.type) {
                    case "CallExpression":
                        return this.name === "callee"
                          && parent.callee === node;

                    case "UnaryExpression":
                    case "SpreadElement":
                    case "SpreadProperty":
                        return true;

                    case "MemberExpression":
                        return this.name === "object"
                          && parent.object === node;

                    case "BinaryExpression":
                    case "LogicalExpression":
                        var po = parent.operator;
                        var pp = PRECEDENCE[po];
                        var no = node.operator;
                        var np = PRECEDENCE[no];

                        if (pp > np) {
                            return true;
                        }

                        if (pp === np && this.name === "right") {
                            if (parent.right !== node) {
                                throw new Error("Nodes must be equal");
                            }
                            return true;
                        }

                    default:
                        return false;
                }

            case "SequenceExpression":
                switch (parent.type) {
                    case "ForStatement":
                        // Although parentheses wouldn't hurt around sequence
                        // expressions in the head of for loops, traditional style
                        // dictates that e.g. i++, j++ should not be wrapped with
                        // parentheses.
                        return false;

                    case "ExpressionStatement":
                        return this.name !== "expression";

                    default:
                        // Otherwise err on the side of overparenthesization, adding
                        // explicit exceptions above if this proves overzealous.
                        return true;
                }

            case "YieldExpression":
                switch (parent.type) {
                    case "BinaryExpression":
                    case "LogicalExpression":
                    case "UnaryExpression":
                    case "SpreadElement":
                    case "SpreadProperty":
                    case "CallExpression":
                    case "MemberExpression":
                    case "NewExpression":
                    case "ConditionalExpression":
                    case "YieldExpression":
                        return true;

                    default:
                        return false;
                }

            case "Literal":
                return parent.type === "MemberExpression"
                  && isNumber.check(node.value)
                  && this.name === "object"
                  && parent.object === node;

            case "AssignmentExpression":
            case "ConditionalExpression":
                switch (parent.type) {
                    case "UnaryExpression":
                    case "SpreadElement":
                    case "SpreadProperty":
                    case "BinaryExpression":
                    case "LogicalExpression":
                        return true;

                    case "CallExpression":
                        return this.name === "callee"
                          && parent.callee === node;

                    case "ConditionalExpression":
                        return this.name === "test"
                          && parent.test === node;

                    case "MemberExpression":
                        return this.name === "object"
                          && parent.object === node;

                    default:
                        return false;
                }

            default:
                if (parent.type === "NewExpression" &&
                  this.name === "callee" &&
                  parent.callee === node) {
                    return containsCallExpression(node);
                }
        }

        if (assumeExpressionContext !== true &&
          !this.canBeFirstInStatement() &&
          this.firstInStatement())
            return true;

        return false;
    };

    function isBinary(node) {
        return n.BinaryExpression.check(node)
          || n.LogicalExpression.check(node);
    }

    function isUnaryLike(node) {
        return n.UnaryExpression.check(node)
          // I considered making SpreadElement and SpreadProperty subtypes
          // of UnaryExpression, but they're not really Expression nodes.
          || (n.SpreadElement && n.SpreadElement.check(node))
          || (n.SpreadProperty && n.SpreadProperty.check(node));
    }

    var PRECEDENCE = {};
    [["||"],
        ["&&"],
        ["|"],
        ["^"],
        ["&"],
        ["==", "===", "!=", "!=="],
        ["<", ">", "<=", ">=", "in", "instanceof"],
        [">>", "<<", ">>>"],
        ["+", "-"],
        ["*", "/", "%"]
    ].forEach(function (tier, i) {
        tier.forEach(function (op) {
            PRECEDENCE[op] = i;
        });
    });

    function containsCallExpression(node) {
        if (n.CallExpression.check(node)) {
            return true;
        }

        if (isArray.check(node)) {
            return node.some(containsCallExpression);
        }

        if (n.Node.check(node)) {
            return types.someField(node, function (name, child) {
                return containsCallExpression(child);
            });
        }

        return false;
    }

    NPp.canBeFirstInStatement = function () {
        var node = this.node;
        return !n.FunctionExpression.check(node)
          && !n.ObjectExpression.check(node);
    };

    NPp.firstInStatement = function () {
        return firstInStatement(this);
    };

    function firstInStatement(path) {
        for (var node, parent; path.parent; path = path.parent) {
            node = path.node;
            parent = path.parent.node;

            if (n.BlockStatement.check(parent) &&
              path.parent.name === "body" &&
              path.name === 0) {
                if (parent.body[0] !== node) {
                    throw new Error("Nodes must be equal");
                }
                return true;
            }

            if (n.ExpressionStatement.check(parent) &&
              path.name === "expression") {
                if (parent.expression !== node) {
                    throw new Error("Nodes must be equal");
                }
                return true;
            }

            if (n.SequenceExpression.check(parent) &&
              path.parent.name === "expressions" &&
              path.name === 0) {
                if (parent.expressions[0] !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }

            if (n.CallExpression.check(parent) &&
              path.name === "callee") {
                if (parent.callee !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }

            if (n.MemberExpression.check(parent) &&
              path.name === "object") {
                if (parent.object !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }

            if (n.ConditionalExpression.check(parent) &&
              path.name === "test") {
                if (parent.test !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }

            if (isBinary(parent) &&
              path.name === "left") {
                if (parent.left !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }

            if (n.UnaryExpression.check(parent) &&
              !parent.prefix &&
              path.name === "argument") {
                if (parent.argument !== node) {
                    throw new Error("Nodes must be equal");
                }
                continue;
            }

            return false;
        }

        return true;
    }

    /**
     * Pruning certain nodes will result in empty or incomplete nodes, here we clean those nodes up.
     */
    function cleanUpNodesAfterPrune(remainingNodePath) {
        if (n.VariableDeclaration.check(remainingNodePath.node)) {
            var declarations = remainingNodePath.get('declarations').value;
            if (!declarations || declarations.length === 0) {
                return remainingNodePath.prune();
            }
        } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
            if (!remainingNodePath.get('expression').value) {
                return remainingNodePath.prune();
            }
        } else if (n.IfStatement.check(remainingNodePath.node)) {
            cleanUpIfStatementAfterPrune(remainingNodePath);
        }

        return remainingNodePath;
    }

    function cleanUpIfStatementAfterPrune(ifStatement) {
        var testExpression = ifStatement.get('test').value;
        var alternate = ifStatement.get('alternate').value;
        var consequent = ifStatement.get('consequent').value;

        if (!consequent && !alternate) {
            var testExpressionStatement = b.expressionStatement(testExpression);

            ifStatement.replace(testExpressionStatement);
        } else if (!consequent && alternate) {
            var negatedTestExpression = b.unaryExpression('!', testExpression, true);

            if (n.UnaryExpression.check(testExpression) && testExpression.operator === '!') {
                negatedTestExpression = testExpression.argument;
            }

            ifStatement.get("test").replace(negatedTestExpression);
            ifStatement.get("consequent").replace(alternate);
            ifStatement.get("alternate").replace();
        }
    }

    return NodePath;
};

}, function(modId) { var map = {"./types":1581324618342,"./path":1581324618344,"./scope":1581324618346}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618346, function(require, module, exports) {
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function (fork) {
    var types = fork.use(require("./types"));
    var Type = types.Type;
    var namedTypes = types.namedTypes;
    var Node = namedTypes.Node;
    var Expression = namedTypes.Expression;
    var isArray = types.builtInTypes.array;
    var b = types.builders;

    function Scope(path, parentScope) {
        if (!(this instanceof Scope)) {
            throw new Error("Scope constructor cannot be invoked without 'new'");
        }
        if (!(path instanceof fork.use(require("./node-path")))) {
            throw new Error("");
        }
        ScopeType.assert(path.value);

        var depth;

        if (parentScope) {
            if (!(parentScope instanceof Scope)) {
                throw new Error("");
            }
            depth = parentScope.depth + 1;
        } else {
            parentScope = null;
            depth = 0;
        }

        Object.defineProperties(this, {
            path: { value: path },
            node: { value: path.value },
            isGlobal: { value: !parentScope, enumerable: true },
            depth: { value: depth },
            parent: { value: parentScope },
            bindings: { value: {} },
            types: { value: {} },
        });
    }

    var scopeTypes = [
        // Program nodes introduce global scopes.
        namedTypes.Program,

        // Function is the supertype of FunctionExpression,
        // FunctionDeclaration, ArrowExpression, etc.
        namedTypes.Function,

        // In case you didn't know, the caught parameter shadows any variable
        // of the same name in an outer scope.
        namedTypes.CatchClause
    ];

    var ScopeType = Type.or.apply(Type, scopeTypes);

    Scope.isEstablishedBy = function(node) {
        return ScopeType.check(node);
    };

    var Sp = Scope.prototype;

// Will be overridden after an instance lazily calls scanScope.
    Sp.didScan = false;

    Sp.declares = function(name) {
        this.scan();
        return hasOwn.call(this.bindings, name);
    };

    Sp.declaresType = function(name) {
        this.scan();
        return hasOwn.call(this.types, name);
    };

    Sp.declareTemporary = function(prefix) {
        if (prefix) {
            if (!/^[a-z$_]/i.test(prefix)) {
                throw new Error("");
            }
        } else {
            prefix = "t$";
        }

        // Include this.depth in the name to make sure the name does not
        // collide with any variables in nested/enclosing scopes.
        prefix += this.depth.toString(36) + "$";

        this.scan();

        var index = 0;
        while (this.declares(prefix + index)) {
            ++index;
        }

        var name = prefix + index;
        return this.bindings[name] = types.builders.identifier(name);
    };

    Sp.injectTemporary = function(identifier, init) {
        identifier || (identifier = this.declareTemporary());

        var bodyPath = this.path.get("body");
        if (namedTypes.BlockStatement.check(bodyPath.value)) {
            bodyPath = bodyPath.get("body");
        }

        bodyPath.unshift(
          b.variableDeclaration(
            "var",
            [b.variableDeclarator(identifier, init || null)]
          )
        );

        return identifier;
    };

    Sp.scan = function(force) {
        if (force || !this.didScan) {
            for (var name in this.bindings) {
                // Empty out this.bindings, just in cases.
                delete this.bindings[name];
            }
            scanScope(this.path, this.bindings, this.types);
            this.didScan = true;
        }
    };

    Sp.getBindings = function () {
        this.scan();
        return this.bindings;
    };

    Sp.getTypes = function () {
        this.scan();
        return this.types;
    };

    function scanScope(path, bindings, scopeTypes) {
        var node = path.value;
        ScopeType.assert(node);

        if (namedTypes.CatchClause.check(node)) {
            // A catch clause establishes a new scope but the only variable
            // bound in that scope is the catch parameter. Any other
            // declarations create bindings in the outer scope.
            addPattern(path.get("param"), bindings);

        } else {
            recursiveScanScope(path, bindings, scopeTypes);
        }
    }

    function recursiveScanScope(path, bindings, scopeTypes) {
        var node = path.value;

        if (path.parent &&
          namedTypes.FunctionExpression.check(path.parent.node) &&
          path.parent.node.id) {
            addPattern(path.parent.get("id"), bindings);
        }

        if (!node) {
            // None of the remaining cases matter if node is falsy.

        } else if (isArray.check(node)) {
            path.each(function(childPath) {
                recursiveScanChild(childPath, bindings, scopeTypes);
            });

        } else if (namedTypes.Function.check(node)) {
            path.get("params").each(function(paramPath) {
                addPattern(paramPath, bindings);
            });

            recursiveScanChild(path.get("body"), bindings, scopeTypes);

        } else if (namedTypes.TypeAlias && namedTypes.TypeAlias.check(node)) {
            addTypePattern(path.get("id"), scopeTypes);

        } else if (namedTypes.VariableDeclarator.check(node)) {
            addPattern(path.get("id"), bindings);
            recursiveScanChild(path.get("init"), bindings, scopeTypes);

        } else if (node.type === "ImportSpecifier" ||
          node.type === "ImportNamespaceSpecifier" ||
          node.type === "ImportDefaultSpecifier") {
            addPattern(
              // Esprima used to use the .name field to refer to the local
              // binding identifier for ImportSpecifier nodes, but .id for
              // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
              // ESTree/Acorn/ESpree use .local for all three node types.
              path.get(node.local ? "local" :
                node.name ? "name" : "id"),
              bindings
            );

        } else if (Node.check(node) && !Expression.check(node)) {
            types.eachField(node, function(name, child) {
                var childPath = path.get(name);
                if (!pathHasValue(childPath, child)) {
                    throw new Error("");
                }
                recursiveScanChild(childPath, bindings, scopeTypes);
            });
        }
    }

    function pathHasValue(path, value) {
        if (path.value === value) {
            return true;
        }

        // Empty arrays are probably produced by defaults.emptyArray, in which
        // case is makes sense to regard them as equivalent, if not ===.
        if (Array.isArray(path.value) &&
          path.value.length === 0 &&
          Array.isArray(value) &&
          value.length === 0) {
            return true;
        }

        return false;
    }

    function recursiveScanChild(path, bindings, scopeTypes) {
        var node = path.value;

        if (!node || Expression.check(node)) {
            // Ignore falsy values and Expressions.

        } else if (namedTypes.FunctionDeclaration.check(node) &&
                   node.id !== null) {
            addPattern(path.get("id"), bindings);

        } else if (namedTypes.ClassDeclaration &&
          namedTypes.ClassDeclaration.check(node)) {
            addPattern(path.get("id"), bindings);

        } else if (ScopeType.check(node)) {
            if (namedTypes.CatchClause.check(node)) {
                var catchParamName = node.param.name;
                var hadBinding = hasOwn.call(bindings, catchParamName);

                // Any declarations that occur inside the catch body that do
                // not have the same name as the catch parameter should count
                // as bindings in the outer scope.
                recursiveScanScope(path.get("body"), bindings, scopeTypes);

                // If a new binding matching the catch parameter name was
                // created while scanning the catch body, ignore it because it
                // actually refers to the catch parameter and not the outer
                // scope that we're currently scanning.
                if (!hadBinding) {
                    delete bindings[catchParamName];
                }
            }

        } else {
            recursiveScanScope(path, bindings, scopeTypes);
        }
    }

    function addPattern(patternPath, bindings) {
        var pattern = patternPath.value;
        namedTypes.Pattern.assert(pattern);

        if (namedTypes.Identifier.check(pattern)) {
            if (hasOwn.call(bindings, pattern.name)) {
                bindings[pattern.name].push(patternPath);
            } else {
                bindings[pattern.name] = [patternPath];
            }

        } else if (namedTypes.ObjectPattern &&
          namedTypes.ObjectPattern.check(pattern)) {
            patternPath.get('properties').each(function(propertyPath) {
                var property = propertyPath.value;
                if (namedTypes.Pattern.check(property)) {
                    addPattern(propertyPath, bindings);
                } else  if (namedTypes.Property.check(property)) {
                    addPattern(propertyPath.get('value'), bindings);
                } else if (namedTypes.SpreadProperty &&
                  namedTypes.SpreadProperty.check(property)) {
                    addPattern(propertyPath.get('argument'), bindings);
                }
            });

        } else if (namedTypes.ArrayPattern &&
          namedTypes.ArrayPattern.check(pattern)) {
            patternPath.get('elements').each(function(elementPath) {
                var element = elementPath.value;
                if (namedTypes.Pattern.check(element)) {
                    addPattern(elementPath, bindings);
                } else if (namedTypes.SpreadElement &&
                  namedTypes.SpreadElement.check(element)) {
                    addPattern(elementPath.get("argument"), bindings);
                }
            });

        } else if (namedTypes.PropertyPattern &&
          namedTypes.PropertyPattern.check(pattern)) {
            addPattern(patternPath.get('pattern'), bindings);

        } else if ((namedTypes.SpreadElementPattern &&
          namedTypes.SpreadElementPattern.check(pattern)) ||
          (namedTypes.SpreadPropertyPattern &&
          namedTypes.SpreadPropertyPattern.check(pattern))) {
            addPattern(patternPath.get('argument'), bindings);
        }
    }

    function addTypePattern(patternPath, types) {
        var pattern = patternPath.value;
        namedTypes.Pattern.assert(pattern);

        if (namedTypes.Identifier.check(pattern)) {
            if (hasOwn.call(types, pattern.name)) {
                types[pattern.name].push(patternPath);
            } else {
                types[pattern.name] = [patternPath];
            }

        }
    }

    Sp.lookup = function(name) {
        for (var scope = this; scope; scope = scope.parent)
            if (scope.declares(name))
                break;
        return scope;
    };

    Sp.lookupType = function(name) {
        for (var scope = this; scope; scope = scope.parent)
            if (scope.declaresType(name))
                break;
        return scope;
    };

    Sp.getGlobalScope = function() {
        var scope = this;
        while (!scope.isGlobal)
            scope = scope.parent;
        return scope;
    };

    return Scope;
};

}, function(modId) { var map = {"./types":1581324618342,"./node-path":1581324618345}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618347, function(require, module, exports) {
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function (fork) {
    var types = fork.use(require("./types"));
    var NodePath = fork.use(require("./node-path"));
    var Printable = types.namedTypes.Printable;
    var isArray = types.builtInTypes.array;
    var isObject = types.builtInTypes.object;
    var isFunction = types.builtInTypes.function;
    var undefined;

    function PathVisitor() {
        if (!(this instanceof PathVisitor)) {
            throw new Error(
              "PathVisitor constructor cannot be invoked without 'new'"
            );
        }

        // Permanent state.
        this._reusableContextStack = [];

        this._methodNameTable = computeMethodNameTable(this);
        this._shouldVisitComments =
          hasOwn.call(this._methodNameTable, "Block") ||
          hasOwn.call(this._methodNameTable, "Line");

        this.Context = makeContextConstructor(this);

        // State reset every time PathVisitor.prototype.visit is called.
        this._visiting = false;
        this._changeReported = false;
    }

    function computeMethodNameTable(visitor) {
        var typeNames = Object.create(null);

        for (var methodName in visitor) {
            if (/^visit[A-Z]/.test(methodName)) {
                typeNames[methodName.slice("visit".length)] = true;
            }
        }

        var supertypeTable = types.computeSupertypeLookupTable(typeNames);
        var methodNameTable = Object.create(null);

        var typeNames = Object.keys(supertypeTable);
        var typeNameCount = typeNames.length;
        for (var i = 0; i < typeNameCount; ++i) {
            var typeName = typeNames[i];
            methodName = "visit" + supertypeTable[typeName];
            if (isFunction.check(visitor[methodName])) {
                methodNameTable[typeName] = methodName;
            }
        }

        return methodNameTable;
    }

    PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
        if (methods instanceof PathVisitor) {
            return methods;
        }

        if (!isObject.check(methods)) {
            // An empty visitor?
            return new PathVisitor;
        }

        function Visitor() {
            if (!(this instanceof Visitor)) {
                throw new Error(
                  "Visitor constructor cannot be invoked without 'new'"
                );
            }
            PathVisitor.call(this);
        }

        var Vp = Visitor.prototype = Object.create(PVp);
        Vp.constructor = Visitor;

        extend(Vp, methods);
        extend(Visitor, PathVisitor);

        isFunction.assert(Visitor.fromMethodsObject);
        isFunction.assert(Visitor.visit);

        return new Visitor;
    };

    function extend(target, source) {
        for (var property in source) {
            if (hasOwn.call(source, property)) {
                target[property] = source[property];
            }
        }

        return target;
    }

    PathVisitor.visit = function visit(node, methods) {
        return PathVisitor.fromMethodsObject(methods).visit(node);
    };

    var PVp = PathVisitor.prototype;

    PVp.visit = function () {
        if (this._visiting) {
            throw new Error(
              "Recursively calling visitor.visit(path) resets visitor state. " +
              "Try this.visit(path) or this.traverse(path) instead."
            );
        }

        // Private state that needs to be reset before every traversal.
        this._visiting = true;
        this._changeReported = false;
        this._abortRequested = false;

        var argc = arguments.length;
        var args = new Array(argc)
        for (var i = 0; i < argc; ++i) {
            args[i] = arguments[i];
        }

        if (!(args[0] instanceof NodePath)) {
            args[0] = new NodePath({root: args[0]}).get("root");
        }

        // Called with the same arguments as .visit.
        this.reset.apply(this, args);

        try {
            var root = this.visitWithoutReset(args[0]);
            var didNotThrow = true;
        } finally {
            this._visiting = false;

            if (!didNotThrow && this._abortRequested) {
                // If this.visitWithoutReset threw an exception and
                // this._abortRequested was set to true, return the root of
                // the AST instead of letting the exception propagate, so that
                // client code does not have to provide a try-catch block to
                // intercept the AbortRequest exception.  Other kinds of
                // exceptions will propagate without being intercepted and
                // rethrown by a catch block, so their stacks will accurately
                // reflect the original throwing context.
                return args[0].value;
            }
        }

        return root;
    };

    PVp.AbortRequest = function AbortRequest() {};
    PVp.abort = function () {
        var visitor = this;
        visitor._abortRequested = true;
        var request = new visitor.AbortRequest();

        // If you decide to catch this exception and stop it from propagating,
        // make sure to call its cancel method to avoid silencing other
        // exceptions that might be thrown later in the traversal.
        request.cancel = function () {
            visitor._abortRequested = false;
        };

        throw request;
    };

    PVp.reset = function (path/*, additional arguments */) {
        // Empty stub; may be reassigned or overridden by subclasses.
    };

    PVp.visitWithoutReset = function (path) {
        if (this instanceof this.Context) {
            // Since this.Context.prototype === this, there's a chance we
            // might accidentally call context.visitWithoutReset. If that
            // happens, re-invoke the method against context.visitor.
            return this.visitor.visitWithoutReset(path);
        }

        if (!(path instanceof NodePath)) {
            throw new Error("");
        }

        var value = path.value;

        var methodName = value &&
          typeof value === "object" &&
          typeof value.type === "string" &&
          this._methodNameTable[value.type];

        if (methodName) {
            var context = this.acquireContext(path);
            try {
                return context.invokeVisitorMethod(methodName);
            } finally {
                this.releaseContext(context);
            }

        } else {
            // If there was no visitor method to call, visit the children of
            // this node generically.
            return visitChildren(path, this);
        }
    };

    function visitChildren(path, visitor) {
        if (!(path instanceof NodePath)) {
            throw new Error("");
        }
        if (!(visitor instanceof PathVisitor)) {
            throw new Error("");
        }

        var value = path.value;

        if (isArray.check(value)) {
            path.each(visitor.visitWithoutReset, visitor);
        } else if (!isObject.check(value)) {
            // No children to visit.
        } else {
            var childNames = types.getFieldNames(value);

            // The .comments field of the Node type is hidden, so we only
            // visit it if the visitor defines visitBlock or visitLine, and
            // value.comments is defined.
            if (visitor._shouldVisitComments &&
              value.comments &&
              childNames.indexOf("comments") < 0) {
                childNames.push("comments");
            }

            var childCount = childNames.length;
            var childPaths = [];

            for (var i = 0; i < childCount; ++i) {
                var childName = childNames[i];
                if (!hasOwn.call(value, childName)) {
                    value[childName] = types.getFieldValue(value, childName);
                }
                childPaths.push(path.get(childName));
            }

            for (var i = 0; i < childCount; ++i) {
                visitor.visitWithoutReset(childPaths[i]);
            }
        }

        return path.value;
    }

    PVp.acquireContext = function (path) {
        if (this._reusableContextStack.length === 0) {
            return new this.Context(path);
        }
        return this._reusableContextStack.pop().reset(path);
    };

    PVp.releaseContext = function (context) {
        if (!(context instanceof this.Context)) {
            throw new Error("");
        }
        this._reusableContextStack.push(context);
        context.currentPath = null;
    };

    PVp.reportChanged = function () {
        this._changeReported = true;
    };

    PVp.wasChangeReported = function () {
        return this._changeReported;
    };

    function makeContextConstructor(visitor) {
        function Context(path) {
            if (!(this instanceof Context)) {
                throw new Error("");
            }
            if (!(this instanceof PathVisitor)) {
                throw new Error("");
            }
            if (!(path instanceof NodePath)) {
                throw new Error("");
            }

            Object.defineProperty(this, "visitor", {
                value: visitor,
                writable: false,
                enumerable: true,
                configurable: false
            });

            this.currentPath = path;
            this.needToCallTraverse = true;

            Object.seal(this);
        }

        if (!(visitor instanceof PathVisitor)) {
            throw new Error("");
        }

        // Note that the visitor object is the prototype of Context.prototype,
        // so all visitor methods are inherited by context objects.
        var Cp = Context.prototype = Object.create(visitor);

        Cp.constructor = Context;
        extend(Cp, sharedContextProtoMethods);

        return Context;
    }

// Every PathVisitor has a different this.Context constructor and
// this.Context.prototype object, but those prototypes can all use the
// same reset, invokeVisitorMethod, and traverse function objects.
    var sharedContextProtoMethods = Object.create(null);

    sharedContextProtoMethods.reset =
      function reset(path) {
          if (!(this instanceof this.Context)) {
              throw new Error("");
          }
          if (!(path instanceof NodePath)) {
              throw new Error("");
          }

          this.currentPath = path;
          this.needToCallTraverse = true;

          return this;
      };

    sharedContextProtoMethods.invokeVisitorMethod =
      function invokeVisitorMethod(methodName) {
          if (!(this instanceof this.Context)) {
              throw new Error("");
          }
          if (!(this.currentPath instanceof NodePath)) {
              throw new Error("");
          }

          var result = this.visitor[methodName].call(this, this.currentPath);

          if (result === false) {
              // Visitor methods return false to indicate that they have handled
              // their own traversal needs, and we should not complain if
              // this.needToCallTraverse is still true.
              this.needToCallTraverse = false;

          } else if (result !== undefined) {
              // Any other non-undefined value returned from the visitor method
              // is interpreted as a replacement value.
              this.currentPath = this.currentPath.replace(result)[0];

              if (this.needToCallTraverse) {
                  // If this.traverse still hasn't been called, visit the
                  // children of the replacement node.
                  this.traverse(this.currentPath);
              }
          }

          if (this.needToCallTraverse !== false) {
              throw new Error(
                "Must either call this.traverse or return false in " + methodName
              );
          }

          var path = this.currentPath;
          return path && path.value;
      };

    sharedContextProtoMethods.traverse =
      function traverse(path, newVisitor) {
          if (!(this instanceof this.Context)) {
              throw new Error("");
          }
          if (!(path instanceof NodePath)) {
              throw new Error("");
          }
          if (!(this.currentPath instanceof NodePath)) {
              throw new Error("");
          }

          this.needToCallTraverse = false;

          return visitChildren(path, PathVisitor.fromMethodsObject(
            newVisitor || this.visitor
          ));
      };

    sharedContextProtoMethods.visit =
      function visit(path, newVisitor) {
          if (!(this instanceof this.Context)) {
              throw new Error("");
          }
          if (!(path instanceof NodePath)) {
              throw new Error("");
          }
          if (!(this.currentPath instanceof NodePath)) {
              throw new Error("");
          }

          this.needToCallTraverse = false;

          return PathVisitor.fromMethodsObject(
            newVisitor || this.visitor
          ).visitWithoutReset(path);
      };

    sharedContextProtoMethods.reportChanged = function reportChanged() {
        this.visitor.reportChanged();
    };

    sharedContextProtoMethods.abort = function abort() {
        this.needToCallTraverse = false;
        this.visitor.abort();
    };

    return PathVisitor;
};

}, function(modId) { var map = {"./types":1581324618342,"./node-path":1581324618345}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618348, function(require, module, exports) {
module.exports = function (fork) {
    var types = fork.use(require("../lib/types"));
    var Type = types.Type;
    var def = Type.def;
    var or = Type.or;
    var shared = fork.use(require("../lib/shared"));
    var defaults = shared.defaults;
    var geq = shared.geq;

    // Abstract supertype of all syntactic entities that are allowed to have a
    // .loc field.
    def("Printable")
        .field("loc", or(
            def("SourceLocation"),
            null
        ), defaults["null"], true);

    def("Node")
        .bases("Printable")
        .field("type", String)
        .field("comments", or(
            [def("Comment")],
            null
        ), defaults["null"], true);

    def("SourceLocation")
        .build("start", "end", "source")
        .field("start", def("Position"))
        .field("end", def("Position"))
        .field("source", or(String, null), defaults["null"]);

    def("Position")
        .build("line", "column")
        .field("line", geq(1))
        .field("column", geq(0));

    def("File")
        .bases("Node")
        .build("program", "name")
        .field("program", def("Program"))
        .field("name", or(String, null), defaults["null"]);

    def("Program")
        .bases("Node")
        .build("body")
        .field("body", [def("Statement")]);

    def("Function")
        .bases("Node")
        .field("id", or(def("Identifier"), null), defaults["null"])
        .field("params", [def("Pattern")])
        .field("body", def("BlockStatement"));

    def("Statement").bases("Node");

// The empty .build() here means that an EmptyStatement can be constructed
// (i.e. it's not abstract) but that it needs no arguments.
    def("EmptyStatement").bases("Statement").build();

    def("BlockStatement")
        .bases("Statement")
        .build("body")
        .field("body", [def("Statement")]);

    // TODO Figure out how to silently coerce Expressions to
    // ExpressionStatements where a Statement was expected.
    def("ExpressionStatement")
        .bases("Statement")
        .build("expression")
        .field("expression", def("Expression"));

    def("IfStatement")
        .bases("Statement")
        .build("test", "consequent", "alternate")
        .field("test", def("Expression"))
        .field("consequent", def("Statement"))
        .field("alternate", or(def("Statement"), null), defaults["null"]);

    def("LabeledStatement")
        .bases("Statement")
        .build("label", "body")
        .field("label", def("Identifier"))
        .field("body", def("Statement"));

    def("BreakStatement")
        .bases("Statement")
        .build("label")
        .field("label", or(def("Identifier"), null), defaults["null"]);

    def("ContinueStatement")
        .bases("Statement")
        .build("label")
        .field("label", or(def("Identifier"), null), defaults["null"]);

    def("WithStatement")
        .bases("Statement")
        .build("object", "body")
        .field("object", def("Expression"))
        .field("body", def("Statement"));

    def("SwitchStatement")
        .bases("Statement")
        .build("discriminant", "cases", "lexical")
        .field("discriminant", def("Expression"))
        .field("cases", [def("SwitchCase")])
        .field("lexical", Boolean, defaults["false"]);

    def("ReturnStatement")
        .bases("Statement")
        .build("argument")
        .field("argument", or(def("Expression"), null));

    def("ThrowStatement")
        .bases("Statement")
        .build("argument")
        .field("argument", def("Expression"));

    def("TryStatement")
        .bases("Statement")
        .build("block", "handler", "finalizer")
        .field("block", def("BlockStatement"))
        .field("handler", or(def("CatchClause"), null), function () {
            return this.handlers && this.handlers[0] || null;
        })
        .field("handlers", [def("CatchClause")], function () {
            return this.handler ? [this.handler] : [];
        }, true) // Indicates this field is hidden from eachField iteration.
        .field("guardedHandlers", [def("CatchClause")], defaults.emptyArray)
        .field("finalizer", or(def("BlockStatement"), null), defaults["null"]);

    def("CatchClause")
        .bases("Node")
        .build("param", "guard", "body")
        .field("param", def("Pattern"))
        .field("guard", or(def("Expression"), null), defaults["null"])
        .field("body", def("BlockStatement"));

    def("WhileStatement")
        .bases("Statement")
        .build("test", "body")
        .field("test", def("Expression"))
        .field("body", def("Statement"));

    def("DoWhileStatement")
        .bases("Statement")
        .build("body", "test")
        .field("body", def("Statement"))
        .field("test", def("Expression"));

    def("ForStatement")
        .bases("Statement")
        .build("init", "test", "update", "body")
        .field("init", or(
            def("VariableDeclaration"),
            def("Expression"),
            null))
        .field("test", or(def("Expression"), null))
        .field("update", or(def("Expression"), null))
        .field("body", def("Statement"));

    def("ForInStatement")
        .bases("Statement")
        .build("left", "right", "body")
        .field("left", or(
            def("VariableDeclaration"),
            def("Expression")))
        .field("right", def("Expression"))
        .field("body", def("Statement"));

    def("DebuggerStatement").bases("Statement").build();

    def("Declaration").bases("Statement");

    def("FunctionDeclaration")
        .bases("Function", "Declaration")
        .build("id", "params", "body")
        .field("id", def("Identifier"));

    def("FunctionExpression")
        .bases("Function", "Expression")
        .build("id", "params", "body");

    def("VariableDeclaration")
        .bases("Declaration")
        .build("kind", "declarations")
        .field("kind", or("var", "let", "const"))
        .field("declarations", [def("VariableDeclarator")]);

    def("VariableDeclarator")
        .bases("Node")
        .build("id", "init")
        .field("id", def("Pattern"))
        .field("init", or(def("Expression"), null));

    // TODO Are all Expressions really Patterns?
    def("Expression").bases("Node", "Pattern");

    def("ThisExpression").bases("Expression").build();

    def("ArrayExpression")
        .bases("Expression")
        .build("elements")
        .field("elements", [or(def("Expression"), null)]);

    def("ObjectExpression")
        .bases("Expression")
        .build("properties")
        .field("properties", [def("Property")]);

    // TODO Not in the Mozilla Parser API, but used by Esprima.
    def("Property")
        .bases("Node") // Want to be able to visit Property Nodes.
        .build("kind", "key", "value")
        .field("kind", or("init", "get", "set"))
        .field("key", or(def("Literal"), def("Identifier")))
        .field("value", def("Expression"));

    def("SequenceExpression")
        .bases("Expression")
        .build("expressions")
        .field("expressions", [def("Expression")]);

    var UnaryOperator = or(
        "-", "+", "!", "~",
        "typeof", "void", "delete");

    def("UnaryExpression")
        .bases("Expression")
        .build("operator", "argument", "prefix")
        .field("operator", UnaryOperator)
        .field("argument", def("Expression"))
        // Esprima doesn't bother with this field, presumably because it's
        // always true for unary operators.
        .field("prefix", Boolean, defaults["true"]);

    var BinaryOperator = or(
        "==", "!=", "===", "!==",
        "<", "<=", ">", ">=",
        "<<", ">>", ">>>",
        "+", "-", "*", "/", "%",
        "&", // TODO Missing from the Parser API.
        "|", "^", "in",
        "instanceof", "..");

    def("BinaryExpression")
        .bases("Expression")
        .build("operator", "left", "right")
        .field("operator", BinaryOperator)
        .field("left", def("Expression"))
        .field("right", def("Expression"));

    var AssignmentOperator = or(
        "=", "+=", "-=", "*=", "/=", "%=",
        "<<=", ">>=", ">>>=",
        "|=", "^=", "&=");

    def("AssignmentExpression")
        .bases("Expression")
        .build("operator", "left", "right")
        .field("operator", AssignmentOperator)
        .field("left", def("Pattern"))
        .field("right", def("Expression"));

    var UpdateOperator = or("++", "--");

    def("UpdateExpression")
        .bases("Expression")
        .build("operator", "argument", "prefix")
        .field("operator", UpdateOperator)
        .field("argument", def("Expression"))
        .field("prefix", Boolean);

    var LogicalOperator = or("||", "&&");

    def("LogicalExpression")
        .bases("Expression")
        .build("operator", "left", "right")
        .field("operator", LogicalOperator)
        .field("left", def("Expression"))
        .field("right", def("Expression"));

    def("ConditionalExpression")
        .bases("Expression")
        .build("test", "consequent", "alternate")
        .field("test", def("Expression"))
        .field("consequent", def("Expression"))
        .field("alternate", def("Expression"));

    def("NewExpression")
        .bases("Expression")
        .build("callee", "arguments")
        .field("callee", def("Expression"))
        // The Mozilla Parser API gives this type as [or(def("Expression"),
        // null)], but null values don't really make sense at the call site.
        // TODO Report this nonsense.
        .field("arguments", [def("Expression")]);

    def("CallExpression")
        .bases("Expression")
        .build("callee", "arguments")
        .field("callee", def("Expression"))
        // See comment for NewExpression above.
        .field("arguments", [def("Expression")]);

    def("MemberExpression")
        .bases("Expression")
        .build("object", "property", "computed")
        .field("object", def("Expression"))
        .field("property", or(def("Identifier"), def("Expression")))
        .field("computed", Boolean, function () {
            var type = this.property.type;
            if (type === 'Literal' ||
                type === 'MemberExpression' ||
                type === 'BinaryExpression') {
                return true;
            }
            return false;
        });

    def("Pattern").bases("Node");

    def("SwitchCase")
        .bases("Node")
        .build("test", "consequent")
        .field("test", or(def("Expression"), null))
        .field("consequent", [def("Statement")]);

    def("Identifier")
        // But aren't Expressions and Patterns already Nodes? TODO Report this.
        .bases("Node", "Expression", "Pattern")
        .build("name")
        .field("name", String);

    def("Literal")
        // But aren't Expressions already Nodes? TODO Report this.
        .bases("Node", "Expression")
        .build("value")
        .field("value", or(String, Boolean, null, Number, RegExp))
        .field("regex", or({
            pattern: String,
            flags: String
        }, null), function () {
            if (this.value instanceof RegExp) {
                var flags = "";

                if (this.value.ignoreCase) flags += "i";
                if (this.value.multiline) flags += "m";
                if (this.value.global) flags += "g";

                return {
                    pattern: this.value.source,
                    flags: flags
                };
            }

            return null;
        });

    // Abstract (non-buildable) comment supertype. Not a Node.
    def("Comment")
        .bases("Printable")
        .field("value", String)
        // A .leading comment comes before the node, whereas a .trailing
        // comment comes after it. These two fields should not both be true,
        // but they might both be false when the comment falls inside a node
        // and the node has no children for the comment to lead or trail,
        // e.g. { /*dangling*/ }.
        .field("leading", Boolean, defaults["true"])
        .field("trailing", Boolean, defaults["false"]);
};
}, function(modId) { var map = {"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618349, function(require, module, exports) {
module.exports = function (fork) {
    var exports = {};
    var types = fork.use(require("../lib/types"));
    var Type = types.Type;
    var builtin = types.builtInTypes;
    var isNumber = builtin.number;

    // An example of constructing a new type with arbitrary constraints from
    // an existing type.
    exports.geq = function (than) {
        return new Type(function (value) {
            return isNumber.check(value) && value >= than;
        }, isNumber + " >= " + than);
    };

    // Default value-returning functions that may optionally be passed as a
    // third argument to Def.prototype.field.
    exports.defaults = {
        // Functions were used because (among other reasons) that's the most
        // elegant way to allow for the emptyArray one always to give a new
        // array instance.
        "null": function () { return null },
        "emptyArray": function () { return [] },
        "false": function () { return false },
        "true": function () { return true },
        "undefined": function () {}
    };

    var naiveIsPrimitive = Type.or(
      builtin.string,
      builtin.number,
      builtin.boolean,
      builtin.null,
      builtin.undefined
    );

    exports.isPrimitive = new Type(function (value) {
        if (value === null)
            return true;
        var type = typeof value;
        return !(type === "object" ||
        type === "function");
    }, naiveIsPrimitive.toString());

    return exports;
};
}, function(modId) { var map = {"../lib/types":1581324618342}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618350, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./core"));
    var types = fork.use(require("../lib/types"));
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(require("../lib/shared")).defaults;

    def("Function")
      .field("generator", Boolean, defaults["false"])
      .field("expression", Boolean, defaults["false"])
      .field("defaults", [or(def("Expression"), null)], defaults.emptyArray)
      // TODO This could be represented as a RestElement in .params.
      .field("rest", or(def("Identifier"), null), defaults["null"]);

    // The ESTree way of representing a ...rest parameter.
    def("RestElement")
      .bases("Pattern")
      .build("argument")
      .field("argument", def("Pattern"));

    def("SpreadElementPattern")
      .bases("Pattern")
      .build("argument")
      .field("argument", def("Pattern"));

    def("FunctionDeclaration")
      .build("id", "params", "body", "generator", "expression");

    def("FunctionExpression")
      .build("id", "params", "body", "generator", "expression");

    // The Parser API calls this ArrowExpression, but Esprima and all other
    // actual parsers use ArrowFunctionExpression.
    def("ArrowFunctionExpression")
      .bases("Function", "Expression")
      .build("params", "body", "expression")
      // The forced null value here is compatible with the overridden
      // definition of the "id" field in the Function interface.
      .field("id", null, defaults["null"])
      // Arrow function bodies are allowed to be expressions.
      .field("body", or(def("BlockStatement"), def("Expression")))
      // The current spec forbids arrow generators, so I have taken the
      // liberty of enforcing that. TODO Report this.
      .field("generator", false, defaults["false"]);

    def("YieldExpression")
      .bases("Expression")
      .build("argument", "delegate")
      .field("argument", or(def("Expression"), null))
      .field("delegate", Boolean, defaults["false"]);

    def("GeneratorExpression")
      .bases("Expression")
      .build("body", "blocks", "filter")
      .field("body", def("Expression"))
      .field("blocks", [def("ComprehensionBlock")])
      .field("filter", or(def("Expression"), null));

    def("ComprehensionExpression")
      .bases("Expression")
      .build("body", "blocks", "filter")
      .field("body", def("Expression"))
      .field("blocks", [def("ComprehensionBlock")])
      .field("filter", or(def("Expression"), null));

    def("ComprehensionBlock")
      .bases("Node")
      .build("left", "right", "each")
      .field("left", def("Pattern"))
      .field("right", def("Expression"))
      .field("each", Boolean);

    def("Property")
      .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
      .field("value", or(def("Expression"), def("Pattern")))
      .field("method", Boolean, defaults["false"])
      .field("shorthand", Boolean, defaults["false"])
      .field("computed", Boolean, defaults["false"]);

    def("PropertyPattern")
      .bases("Pattern")
      .build("key", "pattern")
      .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
      .field("pattern", def("Pattern"))
      .field("computed", Boolean, defaults["false"]);

    def("ObjectPattern")
      .bases("Pattern")
      .build("properties")
      .field("properties", [or(def("PropertyPattern"), def("Property"))]);

    def("ArrayPattern")
      .bases("Pattern")
      .build("elements")
      .field("elements", [or(def("Pattern"), null)]);

    def("MethodDefinition")
      .bases("Declaration")
      .build("kind", "key", "value", "static")
      .field("kind", or("constructor", "method", "get", "set"))
      .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
      .field("value", def("Function"))
      .field("computed", Boolean, defaults["false"])
      .field("static", Boolean, defaults["false"]);

    def("SpreadElement")
      .bases("Node")
      .build("argument")
      .field("argument", def("Expression"));

    def("ArrayExpression")
      .field("elements", [or(
        def("Expression"),
        def("SpreadElement"),
        def("RestElement"),
        null
      )]);

    def("NewExpression")
      .field("arguments", [or(def("Expression"), def("SpreadElement"))]);

    def("CallExpression")
      .field("arguments", [or(def("Expression"), def("SpreadElement"))]);

    // Note: this node type is *not* an AssignmentExpression with a Pattern on
    // the left-hand side! The existing AssignmentExpression type already
    // supports destructuring assignments. AssignmentPattern nodes may appear
    // wherever a Pattern is allowed, and the right-hand side represents a
    // default value to be destructured against the left-hand side, if no
    // value is otherwise provided. For example: default parameter values.
    def("AssignmentPattern")
      .bases("Pattern")
      .build("left", "right")
      .field("left", def("Pattern"))
      .field("right", def("Expression"));

    var ClassBodyElement = or(
      def("MethodDefinition"),
      def("VariableDeclarator"),
      def("ClassPropertyDefinition"),
      def("ClassProperty")
    );

    def("ClassProperty")
      .bases("Declaration")
      .build("key")
      .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
      .field("computed", Boolean, defaults["false"]);

    def("ClassPropertyDefinition") // static property
      .bases("Declaration")
      .build("definition")
      // Yes, Virginia, circular definitions are permitted.
      .field("definition", ClassBodyElement);

    def("ClassBody")
      .bases("Declaration")
      .build("body")
      .field("body", [ClassBodyElement]);

    def("ClassDeclaration")
      .bases("Declaration")
      .build("id", "body", "superClass")
      .field("id", or(def("Identifier"), null))
      .field("body", def("ClassBody"))
      .field("superClass", or(def("Expression"), null), defaults["null"]);

    def("ClassExpression")
      .bases("Expression")
      .build("id", "body", "superClass")
      .field("id", or(def("Identifier"), null), defaults["null"])
      .field("body", def("ClassBody"))
      .field("superClass", or(def("Expression"), null), defaults["null"])
      .field("implements", [def("ClassImplements")], defaults.emptyArray);

    def("ClassImplements")
      .bases("Node")
      .build("id")
      .field("id", def("Identifier"))
      .field("superClass", or(def("Expression"), null), defaults["null"]);

    // Specifier and ModuleSpecifier are abstract non-standard types
    // introduced for definitional convenience.
    def("Specifier").bases("Node");

    // This supertype is shared/abused by both def/babel.js and
    // def/esprima.js. In the future, it will be possible to load only one set
    // of definitions appropriate for a given parser, but until then we must
    // rely on default functions to reconcile the conflicting AST formats.
    def("ModuleSpecifier")
      .bases("Specifier")
      // This local field is used by Babel/Acorn. It should not technically
      // be optional in the Babel/Acorn AST format, but it must be optional
      // in the Esprima AST format.
      .field("local", or(def("Identifier"), null), defaults["null"])
      // The id and name fields are used by Esprima. The id field should not
      // technically be optional in the Esprima AST format, but it must be
      // optional in the Babel/Acorn AST format.
      .field("id", or(def("Identifier"), null), defaults["null"])
      .field("name", or(def("Identifier"), null), defaults["null"]);

    def("TaggedTemplateExpression")
      .bases("Expression")
      .build("tag", "quasi")
      .field("tag", def("Expression"))
      .field("quasi", def("TemplateLiteral"));

    def("TemplateLiteral")
      .bases("Expression")
      .build("quasis", "expressions")
      .field("quasis", [def("TemplateElement")])
      .field("expressions", [def("Expression")]);

    def("TemplateElement")
      .bases("Node")
      .build("value", "tail")
      .field("value", {"cooked": String, "raw": String})
      .field("tail", Boolean);
};

}, function(modId) { var map = {"./core":1581324618348,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618351, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require('./es6'));

    var types = fork.use(require("../lib/types"));
    var def = types.Type.def;
    var or = types.Type.or;
    var builtin = types.builtInTypes;
    var defaults = fork.use(require("../lib/shared")).defaults;

    def("Function")
      .field("async", Boolean, defaults["false"]);

    def("SpreadProperty")
      .bases("Node")
      .build("argument")
      .field("argument", def("Expression"));

    def("ObjectExpression")
      .field("properties", [or(def("Property"), def("SpreadProperty"))]);

    def("SpreadPropertyPattern")
      .bases("Pattern")
      .build("argument")
      .field("argument", def("Pattern"));

    def("ObjectPattern")
      .field("properties", [or(
        def("Property"),
        def("PropertyPattern"),
        def("SpreadPropertyPattern")
      )]);

    def("AwaitExpression")
      .bases("Expression")
      .build("argument", "all")
      .field("argument", or(def("Expression"), null))
      .field("all", Boolean, defaults["false"]);
};
}, function(modId) { var map = {"./es6":1581324618350,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618352, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./core"));
    var types = fork.use(require("../lib/types"));
    var def = types.Type.def;
    var or = types.Type.or;
    var shared = fork.use(require("../lib/shared"));
    var geq = shared.geq;
    var defaults = shared.defaults;

    def("Function")
        // SpiderMonkey allows expression closures: function(x) x+1
        .field("body", or(def("BlockStatement"), def("Expression")));

    def("ForInStatement")
        .build("left", "right", "body", "each")
        .field("each", Boolean, defaults["false"]);

    def("ForOfStatement")
        .bases("Statement")
        .build("left", "right", "body")
        .field("left", or(
            def("VariableDeclaration"),
            def("Expression")))
        .field("right", def("Expression"))
        .field("body", def("Statement"));

    def("LetStatement")
        .bases("Statement")
        .build("head", "body")
        // TODO Deviating from the spec by reusing VariableDeclarator here.
        .field("head", [def("VariableDeclarator")])
        .field("body", def("Statement"));

    def("LetExpression")
        .bases("Expression")
        .build("head", "body")
        // TODO Deviating from the spec by reusing VariableDeclarator here.
        .field("head", [def("VariableDeclarator")])
        .field("body", def("Expression"));

    def("GraphExpression")
        .bases("Expression")
        .build("index", "expression")
        .field("index", geq(0))
        .field("expression", def("Literal"));

    def("GraphIndexExpression")
        .bases("Expression")
        .build("index")
        .field("index", geq(0));
};
}, function(modId) { var map = {"./core":1581324618348,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618353, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./core"));
    var types = fork.use(require("../lib/types"));
    var def = types.Type.def;
    var or = types.Type.or;

    // Note that none of these types are buildable because the Mozilla Parser
    // API doesn't specify any builder functions, and nobody uses E4X anymore.

    def("XMLDefaultDeclaration")
        .bases("Declaration")
        .field("namespace", def("Expression"));

    def("XMLAnyName").bases("Expression");

    def("XMLQualifiedIdentifier")
        .bases("Expression")
        .field("left", or(def("Identifier"), def("XMLAnyName")))
        .field("right", or(def("Identifier"), def("Expression")))
        .field("computed", Boolean);

    def("XMLFunctionQualifiedIdentifier")
        .bases("Expression")
        .field("right", or(def("Identifier"), def("Expression")))
        .field("computed", Boolean);

    def("XMLAttributeSelector")
        .bases("Expression")
        .field("attribute", def("Expression"));

    def("XMLFilterExpression")
        .bases("Expression")
        .field("left", def("Expression"))
        .field("right", def("Expression"));

    def("XMLElement")
        .bases("XML", "Expression")
        .field("contents", [def("XML")]);

    def("XMLList")
        .bases("XML", "Expression")
        .field("contents", [def("XML")]);

    def("XML").bases("Node");

    def("XMLEscape")
        .bases("XML")
        .field("expression", def("Expression"));

    def("XMLText")
        .bases("XML")
        .field("text", String);

    def("XMLStartTag")
        .bases("XML")
        .field("contents", [def("XML")]);

    def("XMLEndTag")
        .bases("XML")
        .field("contents", [def("XML")]);

    def("XMLPointTag")
        .bases("XML")
        .field("contents", [def("XML")]);

    def("XMLName")
        .bases("XML")
        .field("contents", or(String, [def("XML")]));

    def("XMLAttribute")
        .bases("XML")
        .field("value", String);

    def("XMLCdata")
        .bases("XML")
        .field("contents", String);

    def("XMLComment")
        .bases("XML")
        .field("contents", String);

    def("XMLProcessingInstruction")
        .bases("XML")
        .field("target", String)
        .field("contents", or(String, null));
};
}, function(modId) { var map = {"./core":1581324618348,"../lib/types":1581324618342}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618354, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./es7"));

    var types = fork.use(require("../lib/types"));
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(require("../lib/shared")).defaults;

    def("JSXAttribute")
      .bases("Node")
      .build("name", "value")
      .field("name", or(def("JSXIdentifier"), def("JSXNamespacedName")))
      .field("value", or(
        def("Literal"), // attr="value"
        def("JSXExpressionContainer"), // attr={value}
        null // attr= or just attr
      ), defaults["null"]);

    def("JSXIdentifier")
      .bases("Identifier")
      .build("name")
      .field("name", String);

    def("JSXNamespacedName")
      .bases("Node")
      .build("namespace", "name")
      .field("namespace", def("JSXIdentifier"))
      .field("name", def("JSXIdentifier"));

    def("JSXMemberExpression")
      .bases("MemberExpression")
      .build("object", "property")
      .field("object", or(def("JSXIdentifier"), def("JSXMemberExpression")))
      .field("property", def("JSXIdentifier"))
      .field("computed", Boolean, defaults.false);

    var JSXElementName = or(
      def("JSXIdentifier"),
      def("JSXNamespacedName"),
      def("JSXMemberExpression")
    );

    def("JSXSpreadAttribute")
      .bases("Node")
      .build("argument")
      .field("argument", def("Expression"));

    var JSXAttributes = [or(
      def("JSXAttribute"),
      def("JSXSpreadAttribute")
    )];

    def("JSXExpressionContainer")
      .bases("Expression")
      .build("expression")
      .field("expression", def("Expression"));

    def("JSXElement")
      .bases("Expression")
      .build("openingElement", "closingElement", "children")
      .field("openingElement", def("JSXOpeningElement"))
      .field("closingElement", or(def("JSXClosingElement"), null), defaults["null"])
      .field("children", [or(
        def("JSXElement"),
        def("JSXExpressionContainer"),
        def("JSXText"),
        def("Literal") // TODO Esprima should return JSXText instead.
      )], defaults.emptyArray)
      .field("name", JSXElementName, function () {
          // Little-known fact: the `this` object inside a default function
          // is none other than the partially-built object itself, and any
          // fields initialized directly from builder function arguments
          // (like openingElement, closingElement, and children) are
          // guaranteed to be available.
          return this.openingElement.name;
      }, true) // hidden from traversal
      .field("selfClosing", Boolean, function () {
          return this.openingElement.selfClosing;
      }, true) // hidden from traversal
      .field("attributes", JSXAttributes, function () {
          return this.openingElement.attributes;
      }, true); // hidden from traversal

    def("JSXOpeningElement")
      .bases("Node") // TODO Does this make sense? Can't really be an JSXElement.
      .build("name", "attributes", "selfClosing")
      .field("name", JSXElementName)
      .field("attributes", JSXAttributes, defaults.emptyArray)
      .field("selfClosing", Boolean, defaults["false"]);

    def("JSXClosingElement")
      .bases("Node") // TODO Same concern.
      .build("name")
      .field("name", JSXElementName);

    def("JSXText")
      .bases("Literal")
      .build("value")
      .field("value", String);

    def("JSXEmptyExpression").bases("Expression").build();

};
}, function(modId) { var map = {"./es7":1581324618351,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618355, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./es7"));

    var types = fork.use(require("../lib/types"));
    var def = types.Type.def;
    var or = types.Type.or;
    var defaults = fork.use(require("../lib/shared")).defaults;

    // Type Annotations
    def("Type").bases("Node");

    def("AnyTypeAnnotation")
      .bases("Type")
      .build();

    def("EmptyTypeAnnotation")
      .bases("Type")
      .build();

    def("MixedTypeAnnotation")
      .bases("Type")
      .build();

    def("VoidTypeAnnotation")
      .bases("Type")
      .build();

    def("NumberTypeAnnotation")
      .bases("Type")
      .build();

    def("NumberLiteralTypeAnnotation")
      .bases("Type")
      .build("value", "raw")
      .field("value", Number)
      .field("raw", String);

    // Babylon 6 differs in AST from Flow
    // same as NumberLiteralTypeAnnotation
    def("NumericLiteralTypeAnnotation")
      .bases("Type")
      .build("value", "raw")
      .field("value", Number)
      .field("raw", String);

    def("StringTypeAnnotation")
      .bases("Type")
      .build();

    def("StringLiteralTypeAnnotation")
      .bases("Type")
      .build("value", "raw")
      .field("value", String)
      .field("raw", String);

    def("BooleanTypeAnnotation")
      .bases("Type")
      .build();

    def("BooleanLiteralTypeAnnotation")
      .bases("Type")
      .build("value", "raw")
      .field("value", Boolean)
      .field("raw", String);

    def("TypeAnnotation")
      .bases("Node")
      .build("typeAnnotation")
      .field("typeAnnotation", def("Type"));

    def("NullableTypeAnnotation")
      .bases("Type")
      .build("typeAnnotation")
      .field("typeAnnotation", def("Type"));

    def("NullLiteralTypeAnnotation")
      .bases("Type")
      .build();

    def("NullTypeAnnotation")
      .bases("Type")
      .build();

    def("ThisTypeAnnotation")
      .bases("Type")
      .build();

    def("ExistsTypeAnnotation")
      .bases("Type")
      .build();

    def("ExistentialTypeParam")
      .bases("Type")
      .build();

    def("FunctionTypeAnnotation")
      .bases("Type")
      .build("params", "returnType", "rest", "typeParameters")
      .field("params", [def("FunctionTypeParam")])
      .field("returnType", def("Type"))
      .field("rest", or(def("FunctionTypeParam"), null))
      .field("typeParameters", or(def("TypeParameterDeclaration"), null));

    def("FunctionTypeParam")
      .bases("Node")
      .build("name", "typeAnnotation", "optional")
      .field("name", def("Identifier"))
      .field("typeAnnotation", def("Type"))
      .field("optional", Boolean);

    def("ArrayTypeAnnotation")
      .bases("Type")
      .build("elementType")
      .field("elementType", def("Type"));

    def("ObjectTypeAnnotation")
      .bases("Type")
      .build("properties", "indexers", "callProperties")
      .field("properties", [def("ObjectTypeProperty")])
      .field("indexers", [def("ObjectTypeIndexer")], defaults.emptyArray)
      .field("callProperties",
        [def("ObjectTypeCallProperty")],
        defaults.emptyArray)
      .field("exact", Boolean, defaults["false"]);

    def("ObjectTypeProperty")
      .bases("Node")
      .build("key", "value", "optional")
      .field("key", or(def("Literal"), def("Identifier")))
      .field("value", def("Type"))
      .field("optional", Boolean)
      .field("variance",
        or("plus", "minus", null),
        defaults["null"]);

    def("ObjectTypeIndexer")
      .bases("Node")
      .build("id", "key", "value")
      .field("id", def("Identifier"))
      .field("key", def("Type"))
      .field("value", def("Type"))
      .field("variance",
        or("plus", "minus", null),
        defaults["null"]);

    def("ObjectTypeCallProperty")
      .bases("Node")
      .build("value")
      .field("value", def("FunctionTypeAnnotation"))
      .field("static", Boolean, defaults["false"]);

    def("QualifiedTypeIdentifier")
      .bases("Node")
      .build("qualification", "id")
      .field("qualification",
        or(def("Identifier"),
          def("QualifiedTypeIdentifier")))
      .field("id", def("Identifier"));

    def("GenericTypeAnnotation")
      .bases("Type")
      .build("id", "typeParameters")
      .field("id", or(def("Identifier"), def("QualifiedTypeIdentifier")))
      .field("typeParameters", or(def("TypeParameterInstantiation"), null));

    def("MemberTypeAnnotation")
      .bases("Type")
      .build("object", "property")
      .field("object", def("Identifier"))
      .field("property",
        or(def("MemberTypeAnnotation"),
          def("GenericTypeAnnotation")));

    def("UnionTypeAnnotation")
      .bases("Type")
      .build("types")
      .field("types", [def("Type")]);

    def("IntersectionTypeAnnotation")
      .bases("Type")
      .build("types")
      .field("types", [def("Type")]);

    def("TypeofTypeAnnotation")
      .bases("Type")
      .build("argument")
      .field("argument", def("Type"));

    def("Identifier")
      .field("typeAnnotation", or(def("TypeAnnotation"), null), defaults["null"]);

    def("TypeParameterDeclaration")
      .bases("Node")
      .build("params")
      .field("params", [def("TypeParameter")]);

    def("TypeParameterInstantiation")
      .bases("Node")
      .build("params")
      .field("params", [def("Type")]);

    def("TypeParameter")
      .bases("Type")
      .build("name", "variance", "bound")
      .field("name", String)
      .field("variance",
        or("plus", "minus", null),
        defaults["null"])
      .field("bound",
        or(def("TypeAnnotation"), null),
        defaults["null"]);

    def("Function")
      .field("returnType",
        or(def("TypeAnnotation"), null),
        defaults["null"])
      .field("typeParameters",
        or(def("TypeParameterDeclaration"), null),
        defaults["null"]);

    def("ClassProperty")
      .build("key", "value", "typeAnnotation", "static")
      .field("value", or(def("Expression"), null))
      .field("typeAnnotation", or(def("TypeAnnotation"), null))
      .field("static", Boolean, defaults["false"])
      .field("variance",
        or("plus", "minus", null),
        defaults["null"]);

    def("ClassImplements")
      .field("typeParameters",
        or(def("TypeParameterInstantiation"), null),
        defaults["null"]);

    def("InterfaceDeclaration")
      .bases("Declaration")
      .build("id", "body", "extends")
      .field("id", def("Identifier"))
      .field("typeParameters",
        or(def("TypeParameterDeclaration"), null),
        defaults["null"])
      .field("body", def("ObjectTypeAnnotation"))
      .field("extends", [def("InterfaceExtends")]);

    def("DeclareInterface")
      .bases("InterfaceDeclaration")
      .build("id", "body", "extends");

    def("InterfaceExtends")
      .bases("Node")
      .build("id")
      .field("id", def("Identifier"))
      .field("typeParameters", or(def("TypeParameterInstantiation"), null));

    def("TypeAlias")
      .bases("Declaration")
      .build("id", "typeParameters", "right")
      .field("id", def("Identifier"))
      .field("typeParameters", or(def("TypeParameterDeclaration"), null))
      .field("right", def("Type"));

    def("DeclareTypeAlias")
      .bases("TypeAlias")
      .build("id", "typeParameters", "right");

    def("TypeCastExpression")
      .bases("Expression")
      .build("expression", "typeAnnotation")
      .field("expression", def("Expression"))
      .field("typeAnnotation", def("TypeAnnotation"));

    def("TupleTypeAnnotation")
      .bases("Type")
      .build("types")
      .field("types", [def("Type")]);

    def("DeclareVariable")
      .bases("Statement")
      .build("id")
      .field("id", def("Identifier"));

    def("DeclareFunction")
      .bases("Statement")
      .build("id")
      .field("id", def("Identifier"));

    def("DeclareClass")
      .bases("InterfaceDeclaration")
      .build("id");

    def("DeclareModule")
      .bases("Statement")
      .build("id", "body")
      .field("id", or(def("Identifier"), def("Literal")))
      .field("body", def("BlockStatement"));

    def("DeclareModuleExports")
      .bases("Statement")
      .build("typeAnnotation")
      .field("typeAnnotation", def("Type"));

    def("DeclareExportDeclaration")
      .bases("Declaration")
      .build("default", "declaration", "specifiers", "source")
      .field("default", Boolean)
      .field("declaration", or(
        def("DeclareVariable"),
        def("DeclareFunction"),
        def("DeclareClass"),
        def("Type"), // Implies default.
        null
      ))
      .field("specifiers", [or(
        def("ExportSpecifier"),
        def("ExportBatchSpecifier")
      )], defaults.emptyArray)
      .field("source", or(
        def("Literal"),
        null
      ), defaults["null"]);

    def("DeclareExportAllDeclaration")
      .bases("Declaration")
      .build("source")
      .field("source", or(
        def("Literal"),
        null
      ), defaults["null"]);
};

}, function(modId) { var map = {"./es7":1581324618351,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618356, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./es7"));

    var types = fork.use(require("../lib/types"));
    var defaults = fork.use(require("../lib/shared")).defaults;
    var def = types.Type.def;
    var or = types.Type.or;

    def("VariableDeclaration")
      .field("declarations", [or(
        def("VariableDeclarator"),
        def("Identifier") // Esprima deviation.
      )]);

    def("Property")
      .field("value", or(
        def("Expression"),
        def("Pattern") // Esprima deviation.
      ));

    def("ArrayPattern")
      .field("elements", [or(
        def("Pattern"),
        def("SpreadElement"),
        null
      )]);

    def("ObjectPattern")
      .field("properties", [or(
        def("Property"),
        def("PropertyPattern"),
        def("SpreadPropertyPattern"),
        def("SpreadProperty") // Used by Esprima.
      )]);

// Like ModuleSpecifier, except type:"ExportSpecifier" and buildable.
// export {<id [as name]>} [from ...];
    def("ExportSpecifier")
      .bases("ModuleSpecifier")
      .build("id", "name");

// export <*> from ...;
    def("ExportBatchSpecifier")
      .bases("Specifier")
      .build();

// Like ModuleSpecifier, except type:"ImportSpecifier" and buildable.
// import {<id [as name]>} from ...;
    def("ImportSpecifier")
      .bases("ModuleSpecifier")
      .build("id", "name");

// import <* as id> from ...;
    def("ImportNamespaceSpecifier")
      .bases("ModuleSpecifier")
      .build("id");

// import <id> from ...;
    def("ImportDefaultSpecifier")
      .bases("ModuleSpecifier")
      .build("id");

    def("ExportDeclaration")
      .bases("Declaration")
      .build("default", "declaration", "specifiers", "source")
      .field("default", Boolean)
      .field("declaration", or(
        def("Declaration"),
        def("Expression"), // Implies default.
        null
      ))
      .field("specifiers", [or(
        def("ExportSpecifier"),
        def("ExportBatchSpecifier")
      )], defaults.emptyArray)
      .field("source", or(
        def("Literal"),
        null
      ), defaults["null"]);

    def("ImportDeclaration")
      .bases("Declaration")
      .build("specifiers", "source", "importKind")
      .field("specifiers", [or(
        def("ImportSpecifier"),
        def("ImportNamespaceSpecifier"),
        def("ImportDefaultSpecifier")
      )], defaults.emptyArray)
      .field("source", def("Literal"))
      .field("importKind", or(
        "value",
        "type"
      ), function() {
        return "value";
      });

    def("Block")
      .bases("Comment")
      .build("value", /*optional:*/ "leading", "trailing");

    def("Line")
      .bases("Comment")
      .build("value", /*optional:*/ "leading", "trailing");
};
}, function(modId) { var map = {"./es7":1581324618351,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618357, function(require, module, exports) {
module.exports = function (fork) {
    fork.use(require("./es7"));

    var types = fork.use(require("../lib/types"));
    var defaults = fork.use(require("../lib/shared")).defaults;
    var def = types.Type.def;
    var or = types.Type.or;

    def("Noop")
        .bases("Node")
        .build();

    def("DoExpression")
        .bases("Expression")
        .build("body")
        .field("body", [def("Statement")]);

    def("Super")
        .bases("Expression")
        .build();

    def("BindExpression")
        .bases("Expression")
        .build("object", "callee")
        .field("object", or(def("Expression"), null))
        .field("callee", def("Expression"));

    def("Decorator")
        .bases("Node")
        .build("expression")
        .field("expression", def("Expression"));

    def("Property")
        .field("decorators",
            or([def("Decorator")], null),
            defaults["null"]);

    def("MethodDefinition")
        .field("decorators",
            or([def("Decorator")], null),
            defaults["null"]);

    def("MetaProperty")
        .bases("Expression")
        .build("meta", "property")
        .field("meta", def("Identifier"))
        .field("property", def("Identifier"));

    def("ParenthesizedExpression")
        .bases("Expression")
        .build("expression")
        .field("expression", def("Expression"));

    def("ImportSpecifier")
        .bases("ModuleSpecifier")
        .build("imported", "local")
        .field("imported", def("Identifier"));

    def("ImportDefaultSpecifier")
        .bases("ModuleSpecifier")
        .build("local");

    def("ImportNamespaceSpecifier")
        .bases("ModuleSpecifier")
        .build("local");

    def("ExportDefaultDeclaration")
        .bases("Declaration")
        .build("declaration")
        .field("declaration", or(def("Declaration"), def("Expression")));

    def("ExportNamedDeclaration")
        .bases("Declaration")
        .build("declaration", "specifiers", "source")
        .field("declaration", or(def("Declaration"), null))
        .field("specifiers", [def("ExportSpecifier")], defaults.emptyArray)
        .field("source", or(def("Literal"), null), defaults["null"]);

    def("ExportSpecifier")
        .bases("ModuleSpecifier")
        .build("local", "exported")
        .field("exported", def("Identifier"));

    def("ExportNamespaceSpecifier")
        .bases("Specifier")
        .build("exported")
        .field("exported", def("Identifier"));

    def("ExportDefaultSpecifier")
        .bases("Specifier")
        .build("exported")
        .field("exported", def("Identifier"));

    def("ExportAllDeclaration")
        .bases("Declaration")
        .build("exported", "source")
        .field("exported", or(def("Identifier"), null))
        .field("source", def("Literal"));

    def("CommentBlock")
        .bases("Comment")
        .build("value", /*optional:*/ "leading", "trailing");

    def("CommentLine")
        .bases("Comment")
        .build("value", /*optional:*/ "leading", "trailing");
};
}, function(modId) { var map = {"./es7":1581324618351,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618358, function(require, module, exports) {
module.exports = function (fork) {
  fork.use(require("./babel"));
  fork.use(require("./flow"));

  // var types = fork.types;
  var types = fork.use(require("../lib/types"));
  // var defaults = fork.shared.defaults;
  var defaults = fork.use(require("../lib/shared")).defaults;
  var def = types.Type.def;
  var or = types.Type.or;

  def("Directive")
    .bases("Node")
    .build("value")
    .field("value", def("DirectiveLiteral"));

  def("DirectiveLiteral")
    .bases("Node", "Expression")
    .build("value")
    .field("value", String, defaults["use strict"]);

  def("BlockStatement")
    .bases("Statement")
    .build("body")
    .field("body", [def("Statement")])
    .field("directives", [def("Directive")], defaults.emptyArray);

  def("Program")
    .bases("Node")
    .build("body")
    .field("body", [def("Statement")])
    .field("directives", [def("Directive")], defaults.emptyArray);

  // Split Literal
  def("StringLiteral")
    .bases("Literal")
    .build("value")
    .field("value", String);

  def("NumericLiteral")
    .bases("Literal")
    .build("value")
    .field("value", Number);

  def("NullLiteral")
    .bases("Literal")
    .build();

  def("BooleanLiteral")
    .bases("Literal")
    .build("value")
    .field("value", Boolean);

  def("RegExpLiteral")
    .bases("Literal")
    .build("pattern", "flags")
    .field("pattern", String)
    .field("flags", String);

  var ObjectExpressionProperty = or(
    def("Property"),
    def("ObjectMethod"),
    def("ObjectProperty"),
    def("SpreadProperty")
  );

  // Split Property -> ObjectProperty and ObjectMethod
  def("ObjectExpression")
    .bases("Expression")
    .build("properties")
    .field("properties", [ObjectExpressionProperty]);

  // ObjectMethod hoist .value properties to own properties
  def("ObjectMethod")
    .bases("Node", "Function")
    .build("kind", "key", "params", "body", "computed")
    .field("kind", or("method", "get", "set"))
    .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
    .field("params", [def("Pattern")])
    .field("body", def("BlockStatement"))
    .field("computed", Boolean, defaults["false"])
    .field("generator", Boolean, defaults["false"])
    .field("async", Boolean, defaults["false"])
    .field("decorators",
           or([def("Decorator")], null),
           defaults["null"]);

  def("ObjectProperty")
    .bases("Node")
    .build("key", "value")
    .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
    .field("value", or(def("Expression"), def("Pattern")))
    .field("computed", Boolean, defaults["false"]);

  var ClassBodyElement = or(
    def("MethodDefinition"),
    def("VariableDeclarator"),
    def("ClassPropertyDefinition"),
    def("ClassProperty"),
    def("ClassMethod")
  );

  // MethodDefinition -> ClassMethod
  def("ClassBody")
    .bases("Declaration")
    .build("body")
    .field("body", [ClassBodyElement]);

  def("ClassMethod")
    .bases("Declaration", "Function")
    .build("kind", "key", "params", "body", "computed", "static")
    .field("kind", or("get", "set", "method", "constructor"))
    .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
    .field("params", [def("Pattern")])
    .field("body", def("BlockStatement"))
    .field("computed", Boolean, defaults["false"])
    .field("static", Boolean, defaults["false"])
    .field("generator", Boolean, defaults["false"])
    .field("async", Boolean, defaults["false"])
    .field("decorators",
           or([def("Decorator")], null),
           defaults["null"]);

  var ObjectPatternProperty = or(
    def("Property"),
    def("PropertyPattern"),
    def("SpreadPropertyPattern"),
    def("SpreadProperty"), // Used by Esprima
    def("ObjectProperty"), // Babel 6
    def("RestProperty") // Babel 6
  );

  // Split into RestProperty and SpreadProperty
  def("ObjectPattern")
    .bases("Pattern")
    .build("properties")
    .field("properties", [ObjectPatternProperty])
    .field("decorators",
           or([def("Decorator")], null),
           defaults["null"]);

  def("SpreadProperty")
    .bases("Node")
    .build("argument")
    .field("argument", def("Expression"));

  def("RestProperty")
    .bases("Node")
    .build("argument")
    .field("argument", def("Expression"));

  def("ForAwaitStatement")
    .bases("Statement")
    .build("left", "right", "body")
    .field("left", or(
      def("VariableDeclaration"),
      def("Expression")))
    .field("right", def("Expression"))
    .field("body", def("Statement"));

  // The callee node of a dynamic import(...) expression.
  def("Import")
    .bases("Expression")
    .build();
};

}, function(modId) { var map = {"./babel":1581324618357,"./flow":1581324618355,"../lib/types":1581324618342,"../lib/shared":1581324618349}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1581324618340);
})()
//# sourceMappingURL=index.js.map