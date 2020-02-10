module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1581324618368, function(require, module, exports) {
var path = require("path");
var Commoner = require("./lib/commoner").Commoner;
exports.Commoner = Commoner;

function defCallback(name) {
    exports[name] = function() {
        var commoner = new Commoner;
        commoner[name].apply(commoner, arguments);
        commoner.cliBuildP();
        return commoner;
    };
}

defCallback("version");
defCallback("resolve");
defCallback("process");

}, function(modId) {var map = {"./lib/commoner":1581324618369}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618369, function(require, module, exports) {
var assert = require("assert");
var path = require("path");
var fs = require("fs");
var Q = require("q");
var iconv = require("iconv-lite");
var ReadFileCache = require("./cache").ReadFileCache;
var Watcher = require("./watcher").Watcher;
var contextModule = require("./context");
var BuildContext = contextModule.BuildContext;
var PreferredFileExtension = contextModule.PreferredFileExtension;
var ModuleReader = require("./reader").ModuleReader;
var output = require("./output");
var DirOutput = output.DirOutput;
var StdOutput = output.StdOutput;
var util = require("./util");
var log = util.log;
var Ap = Array.prototype;
var each = Ap.forEach;

// Better stack traces for promises.
Q.longStackSupport = true;

function Commoner() {
    var self = this;
    assert.ok(self instanceof Commoner);

    Object.defineProperties(self, {
        customVersion: { value: null, writable: true },
        customOptions: { value: [] },
        resolvers: { value: [] },
        processors: { value: [] }
    });
}

var Cp = Commoner.prototype;

Cp.version = function(version) {
    this.customVersion = version;
    return this; // For chaining.
};

// Add custom command line options
Cp.option = function() {
    this.customOptions.push(Ap.slice.call(arguments));
    return this; // For chaining.
};

// A resolver is a function that takes a module identifier and returns
// the unmodified source of the corresponding module, either as a string
// or as a promise for a string.
Cp.resolve = function() {
    each.call(arguments, function(resolver) {
        assert.strictEqual(typeof resolver, "function");
        this.resolvers.push(resolver);
    }, this);

    return this; // For chaining.
};

// A processor is a function that takes a module identifier and a string
// representing the source of the module and returns a modified version of
// the source, either as a string or as a promise for a string.
Cp.process = function(processor) {
    each.call(arguments, function(processor) {
        assert.strictEqual(typeof processor, "function");
        this.processors.push(processor);
    }, this);

    return this; // For chaining.
};

Cp.buildP = function(options, roots) {
    var self = this;
    var sourceDir = options.sourceDir;
    var outputDir = options.outputDir;
    var readFileCache = new ReadFileCache(sourceDir, options.sourceCharset);
    var waiting = 0;
    var output = outputDir
        ? new DirOutput(outputDir)
        : new StdOutput;

    if (self.watch) {
        new Watcher(readFileCache).on("changed", function(file) {
            log.err(file + " changed; rebuilding...", "yellow");
            rebuild();
        });
    }

    function outputModules(modules) {
        // Note that output.outputModules comes pre-bound.
        modules.forEach(output.outputModule);
        return modules;
    }

    function finish(result) {
        rebuild.ing = false;

        if (waiting > 0) {
            waiting = 0;
            process.nextTick(rebuild);
        }

        return result;
    }

    function rebuild() {
        if (rebuild.ing) {
            waiting += 1;
            return;
        }

        rebuild.ing = true;

        var context = new BuildContext(options, readFileCache);

        if (self.preferredFileExtension)
            context.setPreferredFileExtension(
                self.preferredFileExtension);

        context.setCacheDirectory(self.cacheDir);

        context.setIgnoreDependencies(self.ignoreDependencies);

        context.setRelativize(self.relativize);

        context.setUseProvidesModule(self.useProvidesModule);

        return new ModuleReader(
            context,
            self.resolvers,
            self.processors
        ).readMultiP(context.expandIdsOrGlobsP(roots))
            .then(context.ignoreDependencies ? pass : collectDepsP)
            .then(outputModules)
            .then(outputDir ? printModuleIds : pass)
            .then(finish, function(err) {
                log.err(err.stack);

                if (!self.watch) {
                    // If we're not building with --watch, throw the error
                    // so that cliBuildP can call process.exit(-1).
                    throw err;
                }

                finish();
            });
    }

    return (
      // If outputDir is falsy, we can't (and don't need to) mkdirP it.
      outputDir ? util.mkdirP : Q
    )(outputDir).then(rebuild);
};

function pass(modules) {
    return modules;
}

function collectDepsP(rootModules) {
    var modules = [];
    var seenIds = {};

    function traverse(module) {
        if (seenIds.hasOwnProperty(module.id))
            return Q(modules);
        seenIds[module.id] = true;

        return module.getRequiredP().then(function(reqs) {
            return Q.all(reqs.map(traverse));
        }).then(function() {
            modules.push(module);
            return modules;
        });
    }

    return Q.all(rootModules.map(traverse)).then(
        function() { return modules });
}

function printModuleIds(modules) {
    log.out(JSON.stringify(modules.map(function(module) {
        return module.id;
    })));

    return modules;
}

Cp.forceResolve = function(forceId, source) {
    this.resolvers.unshift(function(id) {
        if (id === forceId)
            return source;
    });
};

Cp.cliBuildP = function() {
    var version = this.customVersion || require("../package.json").version;
    return Q.spread([this, version], cliBuildP);
};

function cliBuildP(commoner, version) {
    var options = require("commander");
    var workingDir = process.cwd();
    var sourceDir = workingDir;
    var outputDir = null;
    var roots;

    options.version(version)
        .usage("[options] <source directory> <output directory> [<module ID> [<module ID> ...]]")
        .option("-c, --config [file]", "JSON configuration file (no file or - means STDIN)")
        .option("-w, --watch", "Continually rebuild")
        .option("-x, --extension <js | coffee | ...>",
                "File extension to assume when resolving module identifiers")
        .option("--relativize", "Rewrite all module identifiers to be relative")
        .option("--follow-requires", "Scan modules for required dependencies")
        .option("--use-provides-module", "Respect @providesModules pragma in files")
        .option("--cache-dir <directory>", "Alternate directory to use for disk cache")
        .option("--no-cache-dir", "Disable the disk cache")
        .option("--source-charset <utf8 | win1252 | ...>",
                "Charset of source (default: utf8)")
        .option("--output-charset <utf8 | win1252 | ...>",
                "Charset of output (default: utf8)");

    commoner.customOptions.forEach(function(customOption) {
        options.option.apply(options, customOption);
    });

    options.parse(process.argv.slice(0));

    var pfe = new PreferredFileExtension(options.extension || "js");

    // TODO Decide whether passing options to buildP via instance
    // variables is preferable to passing them as arguments.
    commoner.preferredFileExtension = pfe;
    commoner.watch = options.watch;
    commoner.ignoreDependencies = !options.followRequires;
    commoner.relativize = options.relativize;
    commoner.useProvidesModule = options.useProvidesModule;
    commoner.sourceCharset = normalizeCharset(options.sourceCharset);
    commoner.outputCharset = normalizeCharset(options.outputCharset);

    function fileToId(file) {
        file = absolutePath(workingDir, file);
        assert.ok(fs.statSync(file).isFile(), file);
        return pfe.trim(path.relative(sourceDir, file));
    }

    var args = options.args.slice(0);
    var argc = args.length;
    if (argc === 0) {
        if (options.config === true) {
            log.err("Cannot read --config from STDIN when reading " +
                    "source from STDIN");
            process.exit(-1);
        }

        sourceDir = workingDir;
        outputDir = null;
        roots = ["<stdin>"];
        commoner.forceResolve("<stdin>", util.readFromStdinP());

        // Ignore dependencies because we wouldn't know how to find them.
        commoner.ignoreDependencies = true;

    } else {
        var first = absolutePath(workingDir, args[0]);
        var stats = fs.statSync(first);

        if (argc === 1) {
            var firstId = fileToId(first);
            sourceDir = workingDir;
            outputDir = null;
            roots = [firstId];
            commoner.forceResolve(
                firstId,
                util.readFileP(first, commoner.sourceCharset)
            );

            // Ignore dependencies because we wouldn't know how to find them.
            commoner.ignoreDependencies = true;

        } else if (stats.isDirectory(first)) {
            sourceDir = first;
            outputDir = absolutePath(workingDir, args[1]);
            roots = args.slice(2);
            if (roots.length === 0)
                roots.push(commoner.preferredFileExtension.glob());

        } else {
            options.help();
            process.exit(-1);
        }
    }

    commoner.cacheDir = null;
    if (options.cacheDir === false) {
        // Received the --no-cache-dir option, so disable the disk cache.
    } else if (typeof options.cacheDir === "string") {
        commoner.cacheDir = absolutePath(workingDir, options.cacheDir);
    } else if (outputDir) {
        // The default cache directory lives inside the output directory.
        commoner.cacheDir = path.join(outputDir, ".module-cache");
    }

    var promise = getConfigP(
        workingDir,
        options.config
    ).then(function(config) {
        var cleanOptions = {};

        options.options.forEach(function(option) {
            var name = util.camelize(option.name());
            if (options.hasOwnProperty(name)) {
                cleanOptions[name] = options[name];
            }
        });

        cleanOptions.version = version;
        cleanOptions.config = config;
        cleanOptions.sourceDir = sourceDir;
        cleanOptions.outputDir = outputDir;
        cleanOptions.sourceCharset = commoner.sourceCharset;
        cleanOptions.outputCharset = commoner.outputCharset;

        return commoner.buildP(cleanOptions, roots);
    });

    if (!commoner.watch) {
        // If we're building from the command line without --watch, any
        // build errors should immediately terminate the process with a
        // non-zero error code.
        promise = promise.catch(function(err) {
            log.err(err.stack);
            process.exit(-1);
        });
    }

    return promise;
}

function normalizeCharset(charset) {
    charset = charset
        && charset.replace(/[- ]/g, "").toLowerCase()
        || "utf8";

    assert.ok(
        iconv.encodingExists(charset),
        "Unrecognized charset: " + charset
    );

    return charset;
}

function absolutePath(workingDir, pathToJoin) {
    if (pathToJoin) {
        workingDir = path.normalize(workingDir);
        pathToJoin = path.normalize(pathToJoin);
        // TODO: use path.isAbsolute when Node < 0.10 is unsupported
        if (path.resolve(pathToJoin) !== pathToJoin) {
            pathToJoin = path.join(workingDir, pathToJoin);
        }
    }
    return pathToJoin;
}

function getConfigP(workingDir, configFile) {
    if (typeof configFile === "undefined")
        return Q({}); // Empty config.

    if (configFile === true || // --config is present but has no argument
        configFile === "<stdin>" ||
        configFile === "-" ||
        configFile === path.sep + path.join("dev", "stdin")) {
        return util.readJsonFromStdinP(
            1000, // Time limit in milliseconds before warning displayed.
            "Expecting configuration from STDIN (pass --config <file> " +
                "if stuck here)...",
            "yellow"
        );
    }

    return util.readJsonFileP(absolutePath(workingDir, configFile));
}

exports.Commoner = Commoner;

}, function(modId) { var map = {"./cache":1581324618370,"./watcher":1581324618372,"./context":1581324618374,"./reader":1581324618378,"./output":1581324618382,"../package.json":1581324618385}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618370, function(require, module, exports) {
var assert = require("assert");
var Q = require("q");
var fs = require("fs");
var path = require("path");
var util = require("./util");
var EventEmitter = require("events").EventEmitter;
var hasOwn = Object.prototype.hasOwnProperty;

/**
 * ReadFileCache is an EventEmitter subclass that caches file contents in
 * memory so that subsequent calls to readFileP return the same contents,
 * regardless of any changes in the underlying file.
 */
function ReadFileCache(sourceDir, charset) {
    assert.ok(this instanceof ReadFileCache);
    assert.strictEqual(typeof sourceDir, "string");

    this.charset = charset;

    EventEmitter.call(this);

    Object.defineProperties(this, {
        sourceDir: { value: sourceDir },
        sourceCache: { value: {} }
    });
}

util.inherits(ReadFileCache, EventEmitter);
var RFCp = ReadFileCache.prototype;

/**
 * Read a file from the cache if possible, else from disk.
 */
RFCp.readFileP = function(relativePath) {
    var cache = this.sourceCache;

    relativePath = path.normalize(relativePath);

    return hasOwn.call(cache, relativePath)
        ? cache[relativePath]
        : this.noCacheReadFileP(relativePath);
};

/**
 * Read (or re-read) a file without using the cache.
 *
 * The new contents are stored in the cache for any future calls to
 * readFileP.
 */
RFCp.noCacheReadFileP = function(relativePath) {
    relativePath = path.normalize(relativePath);

    var added = !hasOwn.call(this.sourceCache, relativePath);
    var promise = this.sourceCache[relativePath] = util.readFileP(
        path.join(this.sourceDir, relativePath), this.charset);

    if (added) {
        this.emit("added", relativePath);
    }

    return promise;
};

/**
 * If you have reason to believe the contents of a file have changed, call
 * this method to re-read the file and compare the new contents to the
 * cached contents.  If the new contents differ from the contents of the
 * cache, the "changed" event will be emitted.
 */
RFCp.reportPossiblyChanged = function(relativePath) {
    var self = this;
    var cached = self.readFileP(relativePath);
    var fresh = self.noCacheReadFileP(relativePath);

    Q.spread([
        cached.catch(orNull),
        fresh.catch(orNull)
    ], function(oldData, newData) {
        if (oldData !== newData) {
            self.emit("changed", relativePath);
        }
    }).done();
};

/**
 * Invoke the given callback for all files currently known to the
 * ReadFileCache, and invoke it in the future when any new files become
 * known to the cache.
 */
RFCp.subscribe = function(callback, context) {
    for (var relativePath in this.sourceCache) {
        if (hasOwn.call(this.sourceCache, relativePath)) {
            callback.call(context || null, relativePath);
        }
    }

    this.on("added", function(relativePath) {
        callback.call(context || null, relativePath);
    });
};

/**
 * Avoid memory leaks by removing listeners and emptying the cache.
 */
RFCp.clear = function() {
    this.removeAllListeners();

    for (var relativePath in this.sourceCache) {
        delete this.sourceCache[relativePath];
    }
};

function orNull(err) {
    return null;
}

exports.ReadFileCache = ReadFileCache;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618372, function(require, module, exports) {
var assert = require("assert");
var path = require("path");
var fs = require("graceful-fs");
var spawn = require("child_process").spawn;
var Q = require("q");
var EventEmitter = require("events").EventEmitter;
var ReadFileCache = require("./cache").ReadFileCache;
var util = require("./util");
var hasOwn = Object.prototype.hasOwnProperty;

function Watcher(readFileCache, persistent) {
    assert.ok(this instanceof Watcher);
    assert.ok(this instanceof EventEmitter);
    assert.ok(readFileCache instanceof ReadFileCache);

    // During tests (and only during tests), persistent === false so that
    // the test suite can actually finish and exit.
    if (typeof persistent === "undefined") {
        persistent = true;
    }

    EventEmitter.call(this);

    var self = this;
    var sourceDir = readFileCache.sourceDir;
    var dirWatcher = new DirWatcher(sourceDir, persistent);

    Object.defineProperties(self, {
        sourceDir: { value: sourceDir },
        readFileCache: { value: readFileCache },
        dirWatcher: { value: dirWatcher }
    });

    // Watch everything the readFileCache already knows about, and any new
    // files added in the future.
    readFileCache.subscribe(function(relativePath) {
        self.watch(relativePath);
    });

    readFileCache.on("changed", function(relativePath) {
        self.emit("changed", relativePath);
    });

    function handleDirEvent(event, relativePath) {
        if (self.dirWatcher.ready) {
            self.getFileHandler(relativePath)(event);
        }
    }

    dirWatcher.on("added", function(relativePath) {
        handleDirEvent("added", relativePath);
    }).on("deleted", function(relativePath) {
        handleDirEvent("deleted", relativePath);
    }).on("changed", function(relativePath) {
        handleDirEvent("changed", relativePath);
    });
}

util.inherits(Watcher, EventEmitter);
var Wp = Watcher.prototype;

Wp.watch = function(relativePath) {
    this.dirWatcher.add(path.dirname(path.join(
        this.sourceDir, relativePath)));
};

Wp.readFileP = function(relativePath) {
    return this.readFileCache.readFileP(relativePath);
};

Wp.noCacheReadFileP = function(relativePath) {
    return this.readFileCache.noCacheReadFileP(relativePath);
};

Wp.getFileHandler = util.cachedMethod(function(relativePath) {
    var self = this;
    return function handler(event) {
        self.readFileCache.reportPossiblyChanged(relativePath);
    };
});

function orNull(err) {
    return null;
}

Wp.close = function() {
    this.dirWatcher.close();
};

/**
 * DirWatcher code adapted from Jeffrey Lin's original implementation:
 * https://github.com/jeffreylin/jsx_transformer_fun/blob/master/dirWatcher.js
 *
 * Invariant: this only watches the dir inode, not the actual path.
 * That means the dir can't be renamed and swapped with another dir.
 */
function DirWatcher(inputPath, persistent) {
    assert.ok(this instanceof DirWatcher);

    var self = this;
    var absPath = path.resolve(inputPath);

    if (!fs.statSync(absPath).isDirectory()) {
        throw new Error(inputPath + "is not a directory!");
    }

    EventEmitter.call(self);

    self.ready = false;
    self.on("ready", function(){
        self.ready = true;
    });

    Object.defineProperties(self, {
        // Map of absDirPaths to fs.FSWatcher objects from fs.watch().
        watchers: { value: {} },
        dirContents: { value: {} },
        rootPath: { value: absPath },
        persistent: { value: !!persistent }
    });

    process.nextTick(function() {
        self.add(absPath);
        self.emit("ready");
    });
}

util.inherits(DirWatcher, EventEmitter);
var DWp = DirWatcher.prototype;

DWp.add = function(absDirPath) {
    var self = this;
    if (hasOwn.call(self.watchers, absDirPath)) {
        return;
    }

    self.watchers[absDirPath] = fs.watch(absDirPath, {
        persistent: this.persistent
    }).on("change", function(event, filename) {
        self.updateDirContents(absDirPath, event, filename);
    });

    // Update internal dir contents.
    self.updateDirContents(absDirPath);

    // Since we've never seen this path before, recursively add child
    // directories of this path.  TODO: Don't do fs.readdirSync on the
    // same dir twice in a row.  We already do an fs.statSync in
    // this.updateDirContents() and we're just going to do another one
    // here...
    fs.readdirSync(absDirPath).forEach(function(filename) {
        var filepath = path.join(absDirPath, filename);

        // Look for directories.
        if (fs.statSync(filepath).isDirectory()) {
            self.add(filepath);
        }
    });
};

DWp.updateDirContents = function(absDirPath, event, fsWatchReportedFilename) {
    var self = this;

    if (!hasOwn.call(self.dirContents, absDirPath)) {
        self.dirContents[absDirPath] = [];
    }

    var oldContents = self.dirContents[absDirPath];
    var newContents = fs.readdirSync(absDirPath);

    var deleted = {};
    var added = {};

    oldContents.forEach(function(filename) {
        deleted[filename] = true;
    });

    newContents.forEach(function(filename) {
        if (hasOwn.call(deleted, filename)) {
            delete deleted[filename];
        } else {
            added[filename] = true;
        }
    });

    var deletedNames = Object.keys(deleted);
    deletedNames.forEach(function(filename) {
        self.emit(
            "deleted",
            path.relative(
                self.rootPath,
                path.join(absDirPath, filename)
            )
        );
    });

    var addedNames = Object.keys(added);
    addedNames.forEach(function(filename) {
        self.emit(
            "added",
            path.relative(
                self.rootPath,
                path.join(absDirPath, filename)
            )
        );
    });

    // So changed is not deleted or added?
    if (fsWatchReportedFilename &&
        !hasOwn.call(deleted, fsWatchReportedFilename) &&
        !hasOwn.call(added, fsWatchReportedFilename))
    {
        self.emit(
            "changed",
            path.relative(
                self.rootPath,
                path.join(absDirPath, fsWatchReportedFilename)
            )
        );
    }

    // If any of the things removed were directories, remove their watchers.
    // If a dir was moved, hopefully two changed events fired?
    //  1) event in dir where it was removed
    //  2) event in dir where it was moved to (added)
    deletedNames.forEach(function(filename) {
        var filepath = path.join(absDirPath, filename);
        delete self.dirContents[filepath];
        delete self.watchers[filepath];
    });

    // if any of the things added were directories, recursively deal with them
    addedNames.forEach(function(filename) {
        var filepath = path.join(absDirPath, filename);
        if (fs.existsSync(filepath) &&
            fs.statSync(filepath).isDirectory())
        {
            self.add(filepath);
            // mighttttttt need a self.updateDirContents() here in case
            // we're somehow adding a path that replaces another one...?
        }
    });

    // Update state of internal dir contents.
    self.dirContents[absDirPath] = newContents;
};

DWp.close = function() {
    var watchers = this.watchers;
    Object.keys(watchers).forEach(function(filename) {
        watchers[filename].close();
    });
};

exports.Watcher = Watcher;

}, function(modId) { var map = {"./cache":1581324618370}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618374, function(require, module, exports) {
var assert = require("assert");
var path = require("path");
var Q = require("q");
var util = require("./util");
var spawn = require("child_process").spawn;
var ReadFileCache = require("./cache").ReadFileCache;
var grepP = require("./grep");
var glob = require("glob");
var env = process.env;

function BuildContext(options, readFileCache) {
    var self = this;
    assert.ok(self instanceof BuildContext);
    assert.ok(readFileCache instanceof ReadFileCache);

    if (options) {
        assert.strictEqual(typeof options, "object");
    } else {
        options = {};
    }

    Object.freeze(options);

    Object.defineProperties(self, {
        readFileCache: { value: readFileCache },
        config: { value: options.config },
        options: { value: options },
        optionsHash: { value: util.deepHash(options) }
    });
}

var BCp = BuildContext.prototype;

BCp.makePromise = function(callback, context) {
    return util.makePromise(callback, context);
};

BCp.spawnP = function(command, args, kwargs) {
    args = args || [];
    kwargs = kwargs || {};

    var deferred = Q.defer();

    var outs = [];
    var errs = [];

    var options = {
        stdio: "pipe",
        env: env
    };

    if (kwargs.cwd) {
        options.cwd = kwargs.cwd;
    }

    var child = spawn(command, args, options);

    child.stdout.on("data", function(data) {
        outs.push(data);
    });

    child.stderr.on("data", function(data) {
        errs.push(data);
    });

    child.on("close", function(code) {
        if (errs.length > 0 || code !== 0) {
            var err = {
                code: code,
                text: errs.join("")
            };
        }

        deferred.resolve([err, outs.join("")]);
    });

    var stdin = kwargs && kwargs.stdin;
    if (stdin) {
        child.stdin.end(stdin);
    }

    return deferred.promise;
};

BCp.setIgnoreDependencies = function(value) {
    Object.defineProperty(this, "ignoreDependencies", {
        value: !!value
    });
};

// This default can be overridden by individual BuildContext instances.
BCp.setIgnoreDependencies(false);

BCp.setRelativize = function(value) {
    Object.defineProperty(this, "relativize", {
        value: !!value
    });
};

// This default can be overridden by individual BuildContext instances.
BCp.setRelativize(false);

BCp.setUseProvidesModule = function(value) {
    Object.defineProperty(this, "useProvidesModule", {
        value: !!value
    });
};

// This default can be overridden by individual BuildContext instances.
BCp.setUseProvidesModule(false);

BCp.setCacheDirectory = function(dir) {
    if (!dir) {
        // Disable the cache directory.
    } else {
        assert.strictEqual(typeof dir, "string");
    }

    Object.defineProperty(this, "cacheDir", {
        value: dir || null
    });
};

// This default can be overridden by individual BuildContext instances.
BCp.setCacheDirectory(null);

function PreferredFileExtension(ext) {
    assert.strictEqual(typeof ext, "string");
    assert.ok(this instanceof PreferredFileExtension);
    Object.defineProperty(this, "extension", {
        value: ext.toLowerCase()
    });
}

var PFEp = PreferredFileExtension.prototype;

PFEp.check = function(file) {
    return file.split(".").pop().toLowerCase() === this.extension;
};

PFEp.trim = function(file) {
    if (this.check(file)) {
        var len = file.length;
        var extLen = 1 + this.extension.length;
        file = file.slice(0, len - extLen);
    }
    return file;
};

PFEp.glob = function() {
    return "**/*." + this.extension;
};

exports.PreferredFileExtension = PreferredFileExtension;

BCp.setPreferredFileExtension = function(pfe) {
    assert.ok(pfe instanceof PreferredFileExtension);
    Object.defineProperty(this, "preferredFileExtension", { value: pfe });
};

BCp.setPreferredFileExtension(new PreferredFileExtension("js"));

BCp.expandIdsOrGlobsP = function(idsOrGlobs) {
    var context = this;

    return Q.all(
        idsOrGlobs.map(this.expandSingleIdOrGlobP, this)
    ).then(function(listOfListsOfIDs) {
        var result = [];
        var seen = {};

        util.flatten(listOfListsOfIDs).forEach(function(id) {
            if (!seen.hasOwnProperty(id)) {
                seen[id] = true;
                if (util.isValidModuleId(id))
                    result.push(id);
            }
        });

        return result;
    });
};

BCp.expandSingleIdOrGlobP = function(idOrGlob) {
    var context = this;

    return util.makePromise(function(callback) {
        // If idOrGlob already looks like an acceptable identifier, don't
        // try to expand it.
        if (util.isValidModuleId(idOrGlob)) {
            callback(null, [idOrGlob]);
            return;
        }

        glob(idOrGlob, {
            cwd: context.readFileCache.sourceDir
        }, function(err, files) {
            if (err) {
                callback(err);
            } else {
                callback(null, files.filter(function(file) {
                    return !context.isHiddenFile(file);
                }).map(function(file) {
                    return context.preferredFileExtension.trim(file);
                }));
            }
        });
    });
};

BCp.readModuleP = function(id) {
    return this.readFileCache.readFileP(
        id + "." + this.preferredFileExtension.extension
    );
};

BCp.readFileP = function(file) {
    return this.readFileCache.readFileP(file);
};

// Text editors such as VIM and Emacs often create temporary swap files
// that should be ignored.
var hiddenExp = /^\.|~$/;
BCp.isHiddenFile = function(file) {
    return hiddenExp.test(path.basename(file));
};

BCp.getProvidedP = util.cachedMethod(function() {
    var context = this;
    var pattern = "@providesModule\\s+\\S+";

    return grepP(
        pattern,
        context.readFileCache.sourceDir
    ).then(function(pathToMatch) {
        var idToPath = {};

        Object.keys(pathToMatch).sort().forEach(function(path) {
            if (context.isHiddenFile(path))
                return;

            var id = pathToMatch[path].split(/\s+/).pop();

            // If we're about to overwrite an existing module identifier,
            // make sure the corresponding path ends with the preferred
            // file extension. This allows @providesModule directives in
            // .coffee files, for example, but prevents .js~ temporary
            // files from taking precedence over actual .js files.
            if (!idToPath.hasOwnProperty(id) ||
                context.preferredFileExtension.check(path))
                idToPath[id] = path;
        });

        return idToPath;
    });
});

var providesExp = /@providesModule[ ]+(\S+)/;

BCp.getProvidedId = function(source) {
    var match = providesExp.exec(source);
    return match && match[1];
};

exports.BuildContext = BuildContext;

}, function(modId) { var map = {"./cache":1581324618370,"./grep":1581324618376}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618376, function(require, module, exports) {
var assert = require("assert");
var path = require("path");
var Q = require("q");
var fs = require("graceful-fs");
var util = require("./util");
var readdir = Q.denodeify(fs.readdir);
var lstat = Q.denodeify(fs.lstat);

function processDirP(pattern, dir) {
    return readdir(dir).then(function(files) {
        return Q.all(files.map(function(file) {
            file = path.join(dir, file);
            return lstat(file).then(function(stat) {
                return stat.isDirectory()
                    ? processDirP(pattern, file)
                    : processFileP(pattern, file);
            });
        })).then(function(results) {
            return util.flatten(results);
        });
    });
}

function processFileP(pattern, file) {
    return util.readFileP(file).then(function(contents) {
        var result = new RegExp(pattern, 'g').exec(contents);
        return result ? [{
            path: file,
            match: result[0]
        }] : [];
    });
}

module.exports = function(pattern, sourceDir) {
    assert.strictEqual(typeof pattern, "string");

    return processDirP(pattern, sourceDir).then(function(results) {
        var pathToMatch = {};

        results.forEach(function(result) {
            pathToMatch[path.relative(
                sourceDir,
                result.path
            ).split("\\").join("/")] = result.match;
        });
        
        return pathToMatch;
    });
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618378, function(require, module, exports) {
var assert = require("assert");
var path = require("path");
var fs = require("fs");
var Q = require("q");
var iconv = require("iconv-lite");
var createHash = require("crypto").createHash;
var detective = require("detective");
var util = require("./util");
var BuildContext = require("./context").BuildContext;
var slice = Array.prototype.slice;

function getRequiredIDs(id, source) {
    var ids = {};
    detective(source).forEach(function (dep) {
        ids[path.normalize(path.join(id, "..", dep))] = true;
    });
    return Object.keys(ids);
}

function ModuleReader(context, resolvers, processors) {
    var self = this;
    assert.ok(self instanceof ModuleReader);
    assert.ok(context instanceof BuildContext);
    assert.ok(resolvers instanceof Array);
    assert.ok(processors instanceof Array);

    var hash = createHash("sha1").update(context.optionsHash + "\0");

    function hashCallbacks(salt) {
        hash.update(salt + "\0");

        var cbs = util.flatten(slice.call(arguments, 1));

        cbs.forEach(function(cb) {
            assert.strictEqual(typeof cb, "function");
            hash.update(cb + "\0");
        });

        return cbs;
    }

    resolvers = hashCallbacks("resolvers", resolvers, warnMissingModule);

    var procArgs = [processors];
    if (context.relativize && !context.ignoreDependencies)
        procArgs.push(require("./relative").getProcessor(self));
    processors = hashCallbacks("processors", procArgs);

    Object.defineProperties(self, {
        context: { value: context },
        idToHash: { value: {} },
        resolvers: { value: resolvers },
        processors: { value: processors },
        salt: { value: hash.digest("hex") }
    });
}

ModuleReader.prototype = {
    getSourceP: util.cachedMethod(function(id) {
        var context = this.context;
        var copy = this.resolvers.slice(0).reverse();
        assert.ok(copy.length > 0, "no source resolvers registered");

        function tryNextResolverP() {
            var resolve = copy.pop();

            try {
                var promise = Q(resolve && resolve.call(context, id));
            } catch (e) {
                promise = Q.reject(e);
            }

            return resolve ? promise.then(function(result) {
                if (typeof result === "string")
                    return result;
                return tryNextResolverP();
            }, tryNextResolverP) : promise;
        }

        return tryNextResolverP();
    }),

    getCanonicalIdP: util.cachedMethod(function(id) {
        var reader = this;
        if (reader.context.useProvidesModule) {
            return reader.getSourceP(id).then(function(source) {
                return reader.context.getProvidedId(source) || id;
            });
        } else {
          return Q(id);
        }
    }),

    readModuleP: util.cachedMethod(function(id) {
        var reader = this;

        return reader.getSourceP(id).then(function(source) {
            if (reader.context.useProvidesModule) {
                // If the source contains a @providesModule declaration, treat
                // that declaration as canonical. Note that the Module object
                // returned by readModuleP might have an .id property whose
                // value differs from the original id parameter.
                id = reader.context.getProvidedId(source) || id;
            }

            assert.strictEqual(typeof source, "string");

            var hash = createHash("sha1")
                .update("module\0")
                .update(id + "\0")
                .update(reader.salt + "\0")
                .update(source.length + "\0" + source)
                .digest("hex");

            if (reader.idToHash.hasOwnProperty(id)) {
                // Ensure that the same module identifier is not
                // provided by distinct modules.
                assert.strictEqual(
                    reader.idToHash[id], hash,
                    "more than one module named " +
                        JSON.stringify(id));
            } else {
                reader.idToHash[id] = hash;
            }

            return reader.buildModuleP(id, hash, source);
        });
    }),

    buildModuleP: util.cachedMethod(function(id, hash, source) {
        var reader = this;
        return reader.processOutputP(
            id, hash, source
        ).then(function(output) {
            return new Module(reader, id, hash, output);
        });
    }, function(id, hash, source) {
        return hash;
    }),

    processOutputP: function(id, hash, source) {
        var reader = this;
        var cacheDir = reader.context.cacheDir;
        var manifestDir = cacheDir && path.join(cacheDir, "manifest");
        var charset = reader.context.options.outputCharset;

        function buildP() {
            var promise = Q(source);

            reader.processors.forEach(function(build) {
                promise = promise.then(function(input) {
                    return util.waitForValuesP(
                        build.call(reader.context, id, input)
                    );
                });
            });

            return promise.then(function(output) {
                if (typeof output === "string") {
                    output = { ".js": output };
                } else {
                    assert.strictEqual(typeof output, "object");
                }

                return util.waitForValuesP(output);

            }).then(function(output) {
                util.log.err(
                    "built Module(" + JSON.stringify(id) + ")",
                    "cyan"
                );

                return output;

            }).catch(function(err) {
                // Provide additional context for uncaught build errors.
                util.log.err("Error while reading module " + id + ":");
                throw err;
            });
        }

        if (manifestDir) {
            return util.mkdirP(manifestDir).then(function(manifestDir) {
                var manifestFile = path.join(manifestDir, hash + ".json");

                return util.readJsonFileP(manifestFile).then(function(manifest) {
                    Object.keys(manifest).forEach(function(key) {
                        var cacheFile = path.join(cacheDir, manifest[key]);
                        manifest[key] = util.readFileP(cacheFile);
                    });

                    return util.waitForValuesP(manifest, true);

                }).catch(function(err) {
                    return buildP().then(function(output) {
                        var manifest = {};

                        Object.keys(output).forEach(function(key) {
                            var cacheFile = manifest[key] = hash + key;
                            var fullPath = path.join(cacheDir, cacheFile);

                            if (charset) {
                                fs.writeFileSync(fullPath, iconv.encode(output[key], charset))
                            } else {
                                fs.writeFileSync(fullPath, output[key], "utf8");
                            }
                        });

                        fs.writeFileSync(
                            manifestFile,
                            JSON.stringify(manifest),
                            "utf8"
                        );

                        return output;
                    });
                });
            });
        }

        return buildP();
    },

    readMultiP: function(ids) {
        var reader = this;

        return Q(ids).all().then(function(ids) {
            if (ids.length === 0)
                return ids; // Shortcut.

            var modulePs = ids.map(reader.readModuleP, reader);
            return Q(modulePs).all().then(function(modules) {
                var seen = {};
                var result = [];

                modules.forEach(function(module) {
                    if (!seen.hasOwnProperty(module.id)) {
                        seen[module.id] = true;
                        result.push(module);
                    }
                });

                return result;
            });
        });
    }
};

exports.ModuleReader = ModuleReader;

function warnMissingModule(id) {
    // A missing module may be a false positive and therefore does not warrant
    // a fatal error, but a warning is certainly in order.
    util.log.err(
        "unable to resolve module " + JSON.stringify(id) + "; false positive?",
        "yellow");

    // Missing modules are installed as if they existed, but it's a run-time
    // error if one is ever actually required.
    var message = "nonexistent module required: " + id;
    return "throw new Error(" + JSON.stringify(message) + ");";
}

function Module(reader, id, hash, output) {
    assert.ok(this instanceof Module);
    assert.ok(reader instanceof ModuleReader);
    assert.strictEqual(typeof output, "object");

    var source = output[".js"];
    assert.strictEqual(typeof source, "string");

    Object.defineProperties(this, {
        reader: { value: reader },
        id: { value: id },
        hash: { value: hash }, // TODO Remove?
        deps: { value: getRequiredIDs(id, source) },
        source: { value: source },
        output: { value: output }
    });
}

Module.prototype = {
    getRequiredP: function() {
        return this.reader.readMultiP(this.deps);
    },

    writeVersionP: function(outputDir) {
        var id = this.id;
        var hash = this.hash;
        var output = this.output;
        var cacheDir = this.reader.context.cacheDir;
        var charset = this.reader.context.options.outputCharset;

        return Q.all(Object.keys(output).map(function(key) {
            var outputFile = path.join(outputDir, id + key);

            function writeCopy() {
                if (charset) {
                    fs.writeFileSync(outputFile, iconv.encode(output[key], charset));
                } else {
                    fs.writeFileSync(outputFile, output[key], "utf8");
                }
                return outputFile;
            }

            if (cacheDir) {
                var cacheFile = path.join(cacheDir, hash + key);
                return util.linkP(cacheFile, outputFile)
                    // If the hard linking fails, the cache directory
                    // might be on a different device, so fall back to
                    // writing a copy of the file (slightly slower).
                    .catch(writeCopy);
            }

            return util.mkdirP(path.dirname(outputFile)).then(writeCopy);
        }));
    },

    toString: function() {
        return "Module(" + JSON.stringify(this.id) + ")";
    },

    resolveId: function(id) {
        return util.absolutize(this.id, id);
    }
};

}, function(modId) { var map = {"./context":1581324618374,"./relative":1581324618380}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618380, function(require, module, exports) {
var assert = require("assert");
var Q = require("q");
var path = require("path");
var util = require("./util");
var recast = require("recast");
var n = recast.types.namedTypes;

function Relativizer(reader) {
    assert.ok(this instanceof Relativizer);
    assert.ok(reader === null ||
              reader instanceof require("./reader").ModuleReader);

    Object.defineProperties(this, {
        reader: { value: reader }
    });
}

var Rp = Relativizer.prototype;

exports.getProcessor = function(reader) {
    var relativizer = new Relativizer(reader);
    return function(id, input) {
        return relativizer.processSourceP(id, input);
    };
};

Rp.processSourceP = function(id, input) {
    var relativizer = this;
    var output = typeof input === "string" ? {
        ".js": input
    } : input;

    return Q(output[".js"]).then(function(source) {
        var promises = [];
        var ast = recast.parse(source);

        function fixRequireP(literal) {
            promises.push(relativizer.relativizeP(
                id, literal.value
            ).then(function(newValue) {
                return literal.value = newValue;
            }));
        }

        recast.visit(ast, {
            visitCallExpression: function(path) {
                var args = path.value.arguments;
                var callee = path.value.callee;

                if (n.Identifier.check(callee) &&
                    callee.name === "require" &&
                    args.length === 1) {
                    var arg = args[0];
                    if (n.Literal.check(arg) &&
                        typeof arg.value === "string") {
                        fixRequireP(arg);
                    }
                }

                this.traverse(path);
            }
        });

        return Q.all(promises).then(function() {
            output[".js"] = recast.print(ast).code;
            return output;
        });
    });
};

Rp.absolutizeP = function(moduleId, requiredId) {
    requiredId = util.absolutize(moduleId, requiredId);

    if (this.reader)
        return this.reader.getCanonicalIdP(requiredId);

    return Q(requiredId);
};

Rp.relativizeP = function(moduleId, requiredId) {
    return this.absolutizeP(
        moduleId,
        requiredId
    ).then(function(absoluteId) {
        return util.relativize(moduleId, absoluteId);
    });
};

}, function(modId) { var map = {"./reader":1581324618378}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618382, function(require, module, exports) {
var assert = require("assert");
var util = require("./util");
var log = util.log;

function AbstractOutput() {
    assert.ok(this instanceof AbstractOutput);
    Object.defineProperties(this, {
        outputModule: { value: this.outputModule.bind(this) }
    });
}

var AOp = AbstractOutput.prototype;
exports.AbstractOutput = AbstractOutput;

AOp.outputModule = function(module) {
    throw new Error("not implemented");
};

function StdOutput() {
    assert.ok(this instanceof StdOutput);
    AbstractOutput.call(this);
}

var SOp = util.inherits(StdOutput, AbstractOutput);
exports.StdOutput = StdOutput;

SOp.outputModule = function(module) {
    log.out(module.source);
};

function DirOutput(outputDir) {
    assert.ok(this instanceof DirOutput);
    assert.strictEqual(typeof outputDir, "string");
    AbstractOutput.call(this);

    Object.defineProperties(this, {
        outputDir: { value: outputDir }
    });
}

var DOp = util.inherits(DirOutput, AbstractOutput);
exports.DirOutput = DirOutput;

DOp.outputModule = function(module) {
    return module.writeVersionP(this.outputDir);
};

function TestOutput() {
    assert.ok(this instanceof TestOutput);
    AbstractOutput.call(this);
}

var TOp = util.inherits(TestOutput, AbstractOutput);
exports.TestOutput = TestOutput;

TOp.outputModule = function(module) {
    // Swallow any output.
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1581324618385, function(require, module, exports) {
module.exports = {
  "_from": "commoner@^0.10.8",
  "_id": "commoner@0.10.8",
  "_inBundle": false,
  "_integrity": "sha1-NPw2cs0kOT6LtH5wyqApOBH08sU=",
  "_location": "/commoner",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "commoner@^0.10.8",
    "name": "commoner",
    "escapedName": "commoner",
    "rawSpec": "^0.10.8",
    "saveSpec": null,
    "fetchSpec": "^0.10.8"
  },
  "_requiredBy": [
    "/regenerator"
  ],
  "_resolved": "https://registry.npmjs.org/commoner/-/commoner-0.10.8.tgz",
  "_shasum": "34fc3672cd24393e8bb47e70caa0293811f4f2c5",
  "_spec": "commoner@^0.10.8",
  "_where": "D:\\code\\WeChatCode\\sh_19_0722_3\\node_modules\\regenerator",
  "author": {
    "name": "Ben Newman",
    "email": "ben@benjamn.com"
  },
  "bin": {
    "commonize": "./bin/commonize"
  },
  "bugs": {
    "url": "https://github.com/benjamn/commoner/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "commander": "^2.5.0",
    "detective": "^4.3.1",
    "glob": "^5.0.15",
    "graceful-fs": "^4.1.2",
    "iconv-lite": "^0.4.5",
    "mkdirp": "^0.5.0",
    "private": "^0.1.6",
    "q": "^1.1.2",
    "recast": "^0.11.17"
  },
  "deprecated": false,
  "description": "Flexible tool for translating any dialect of JavaScript into Node-readable CommonJS modules",
  "devDependencies": {
    "mocha": "^2.3.3"
  },
  "engines": {
    "node": ">= 0.8"
  },
  "files": [
    "bin",
    "lib",
    "main.js"
  ],
  "homepage": "http://github.com/benjamn/commoner",
  "keywords": [
    "modules",
    "require",
    "commonjs",
    "exports",
    "commoner",
    "browserify",
    "stitch"
  ],
  "license": "MIT",
  "main": "main.js",
  "name": "commoner",
  "repository": {
    "type": "git",
    "url": "git://github.com/benjamn/commoner.git"
  },
  "scripts": {
    "test": "rm -rf test/output ; node ./node_modules/mocha/bin/mocha --reporter spec test/run.js"
  },
  "version": "0.10.8"
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1581324618368);
})()
//# sourceMappingURL=index.js.map