# nwjs-typescript-project
Native desktop GUI application base with NW.js & TypeScript

![GitHub](https://img.shields.io/github/license/Proclus/nwjs-typescript-project)
![Twitter Follow](https://img.shields.io/twitter/follow/Proclus?style=social)
## About
[NW.js](https://nwjs.io/) is a Chromium & Node.js based runtime for writing native desktop applications with cutting edge web technologies.
nwjs-typescript-project (will be referred as **NWP** throughout the documentation) provides the essentials for rapidly starting up a project
configured to use the latest TypeScript and Chrome features out of the box.
NW.js is regularly kept up-to-date with new Chrome versions so that we can test, use and get familiar with the latest web features. 

## Application Structure
**NWP** respects the [Pitchfork Layout (PFL)](https://api.csswg.org/bikeshed/?force=1&url=https://raw.githubusercontent.com/vector-of-bool/pitchfork/develop/data/spec.bs). 
Although mostly accepted by the C/C++ community, I find this directory convention also suitable for complex Node.js projects
especially implementing their own C/C++ module extensions.

Project utilizes _webpack_ for bundling the application and _npm_ for running tasks. For a more sophisticated task management solution,
you can incorporate [gulp](https://gulpjs.com/) into the project with ease. 

For running parallel (and sequential) npm scripts, _package.json_ also includes [npm-run-all](https://www.npmjs.com/package/npm-run-all).

## Webpack configuration
Two configuration files are provided - one for production mode and one for development mode. Both files inherit from the base configuration
files as [suggested](https://webpack.js.org/guides/production/) by webpack.
Files contain a templated approach to set up the entry point for the application:
*data/index.ejs*
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
<%= app.info %>
</body>
</html>
```

The template file is placed under the _data_ directory and processed by _html-webpack-plugin_ when the bundle is created. 
_html-webpack-plugin_ by default uses _lodash_ templates and it can be configured with a pack of options outlined [here](https://github.com/jantimon/html-webpack-plugin#options).

Within the config files, `customTemplateParameters()` function can be employed for providing extra data to the template. 
This way project’s main entry point can be dynamically rendered,  before startup, with custom data retrieved from the local filesystem or the network.

```typescript
const customTemplateParameters = () => {
    return {
        info: 'Some info',
        isProduction: 0
    }
}
```

All essential asset loaders are configured and ready for consumption:

* css loader
* TypeScript loader with src/main.ts as the entry point
* image loader
* font loader


## Installed packages
* [webpack 5](https://webpack.js.org/) with asset and TypeScript loaders
* [lodash](https://www.npmjs.com/package/lodash)
Every project needs a good data structure library!
* [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
provides Reflect built-in object support for  the application. Reflect complements the decorator API in many useful ways with its methods for interceptable JavaScript operations as 
[MDN explains](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect).

* [npm-run-all](https://github.com/mysticatea/npm-run-all)
helps running multiple tasks in parallel with a clean [CLI setup](https://github.com/mysticatea/npm-run-all/blob/master/docs/npm-run-all.md).

* [nw](https://www.npmjs.com/package/nw)
is the latest sdk version of the nw.js build which provides the developer console with the application.
To install a specific version of nw.js run npm with the @version specifier: npm install nw@0.63.0-sdk.

* [cmake-js](https://github.com/cmake-js/cmake-js)
For building native node C/C++ addon modules

* [eslint](https://eslint.org/) with default configuration rules

### Loading fonts

npm can be utilized to provide fonts for your native application. _package.json_ installs **source-sans-pro** 
by default [from this neat font provider](https://fontsource.org/docs/getting-started) with npm:
```bash
npm install @fontsource/source-sans-pro
```

After fonts are installed just import them in _main.ts_ and webpack will handle the rest:


```typescript
//main.ts
import "@fontsource/source-sans-pro";
```

and make them globally available in your styles:
```css
/*styles.css*/
:root {     
    --main-font: "Source Sans Pro";
}

body {	
    font-family: var(--main-font)
}
```

### Loading CSS

Project uses webpack’s [css-loader](https://webpack.js.org/loaders/css-loader) which is packed with options covering many deployment and exporting scenarios from [css modules](https://webpack.js.org/loaders/css-loader/#modules) to [constructible stylesheets](https://webpack.js.org/loaders/css-loader/#exporttype).
Update the _webpack.*_ files for your project’s needs. By default, webpack will bundle any imported css file from a ts file:

```typescript
//main.ts
import "./styles.css";
```
Project contains a *styles.css* file in the root *src* directory for defining application’s theme and global styles.

## TypeScript configuration
NWP uses a two step configuration scheme with a base json file and a project _tsconfig.json_ file which extends the base configuration. 
Base configuration resides in _data/tsconfig.base.json_, enabling support for TypeScript decorators and ESNext. 
It is advised not to change these settings and use the latest goodies TypeScript has to offer!

Project’s *tsconfig.json* respects the PFL layout and sets include to contain *src* and *test* directories along with any of their subdirectories.

```json
{
  "extends": "./data/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "build",
    "typeRoots": [
      "./node_modules/@types",
      "./extras/@types"
    ]
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

*tsconfig.json* also specifies **typeRoots** with the extra **@types** directory for manually providing typings when a suitable package is not available with npm. 
Since we are on the bleeding edge, some of the required typings for new CSS and custom element features (Ex. worklets and constructible stylesheets) are not provided by lib.dom.ts but made available in 
*extras/@types*. 

For your project feel free to place any additional typings into the extras directory. 
When tsc is run, it will detect and use the types automatically.

For more information about TypeScript configuration, please consult to the [TSConfig reference page](https://www.typescriptlang.org/tsconfig)
which provides the full list of available options with examples.

## Building the application

*package.json* fills the scripts section with a number of npm commands for building and starting the application.
You should make the relevant changes here to suit your application’s needs and the choice of your development platform may dictate
different syntax for command-line parameters involving quotes and glob selectors.

As detailed in the previous section, NWP comes with preconfigured build scripts utilizing webpack for building and bundling the app.

The following commands build the application by using the development and production profiles, respectively. 

`npm run build:dev`

`npm run build`

The generated files (bundles) are stored in the temporary _build_ directory which later _nw_ executable uses as its current working directory while running _index.html_.


`npm run clean` will remove the build directory. As the PFL Layout [demands](https://api.csswg.org/bikeshed/?force=1&url=https://raw.githubusercontent.com/vector-of-bool/pitchfork/develop/data/spec.bs#tld.build)
the build directory is not officially part of the project and should not be committed to any source control system.

##### Watch mode

`npm run build:watch`

When the developer friendly watch mode is run, webpack detects the changes made in *.ts, *.tsx and any other asset files and only rebuilds the relevant parts to considerably speed up 
compilation and the bundling process. 

**Caveat**: The number of allowed file watchers in your environment may be limited - and it usually is - by the operating system. 

For MacOS run `sysctl -A | grep kern.maxfiles` to find out the maximum limit set.

For Linux, try `cat /proc/sys/fs/inotify/max_user_watches`

When our projects grow in size, we reach this threshold pretty fast. To increase the limit, for MacOS, create a `limit.maxfiles.plist` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"  
        "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">  
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>524288</string>
      <string>524288</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist> 

```

and install it with

```bash
chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
launchctl load /Library/LaunchDaemons/limit.maxfiles.plist
```

For Linux, this should do the trick:
```bash
sudo sh -c "echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf"
sudo sysctl -p
```

For ArchLinux it seems that _/etc/sysctl.conf_ is deprecated. Try
```bash
sudo sh -c "echo fs.inotify.max_user_watches=524288 > /etc/sysctl.d/40-max-user-watches.conf"
sudo sysctl --system
```

For more information regarding the watch mode follow these links:
- https://webpack.js.org/configuration/watch/#troubleshooting
- https://github.com/guard/listen/blob/master/README.md#increasing-the-amount-of-inotify-watchers
- https://linux.die.net/man/7/inotify

## Running the application

After the application is built and all static files are bundled and stored in the _build_ directory, running `npm run start` should bring up the application window:

![Application window](/Users/oglasungutay/Documents/app.png  "Application window")

Context menu also has an option to reload the application including the node background context.

#### package.nw.json

Previous sections explained how *package.json* is configured to handle common tasks of building and running a node.js project.
When the bundled application is run, NW.js will also need its own [manifest file](https://nwjs.readthedocs.io/en/latest/References/Manifest) through which we  
can set up the window object, run startup scripts and specify the Chromium arguments:

```json
{
  "name": "nwjs-typescript-project",
  "version": "0.0.1-pre",
  "main": "index.html",
  "license": "MIT",
  "author": "Ogla Sungutay <ogla@lyciasoft.com> (oglas.blog)",
  "window": {
    "toolbar": true,
    "frame": true,
    "width": 1280,
    "height": 724
  },
  "chromium-args": "--enable-experimental-web-platform-features",
  "node-main": "startup.js"
}
```
_package.nw.json_ is stored in the _data/_ directory and is copied to the build directory when the application is run. There are several startup levels to 
handle this simple bootstrapping process outlined in _project's package.json_ - feel free to set up a more elaborate mechanism.

Please follow the link provided above for more information about NW.js package.json manifest format.

#### name & project data directory
By default, project name in the manifest file is used for specifying applications's data directory in the native platform:
* Windows: `%LOCALAPPDATA%/<name-in-manifest>/`
* Mac: `~/Library/Application Support/<name-in-manifest>/`
* Linux: `~/.config/<name-in-manifest>`

A custom path can be passed with **--user-data-dir** parameter to the _nw_ executable in _package.json_: 

`"_start:run": "./node_modules/.bin/nw --user-data-dir=/tmp ./build"`


#### node-main.ts
NWP provides a ready to use startup script which is executed in Node context before the first DOM window loads.
Functions and objects exported in node-main.ts can be accessed from `process.mainModule.exports` in the browser context. The functions
for example can accept nw.Window instances and store them in node-main.ts space. You can also use the Node API to access the file system
and even run a web application server such as express.
There are several rudimentary usage examples provided in the script that you can take a look at.

Following commands build node-main.ts and place it under the _build/_ directory.

```console
npm run build:node-main
npm run build:node-main:watch
```
These run modes are also part of the main build processes but watch mode is not provided. Depending on module's complexity,
you may choose to run `build:node-main:watch` in parallel as part of the build:watch command.

_data/_ directory contains a dedicated tsconfig.node-main.json targeting the Node v17 environment as instructed by Microsoft.
Take a close look at https://github.com/tsconfig/bases/ and choose the best module and target setting that suit your needs.

## Development process

The most confusing part of Node.js and TypeScript development process is perhaps the module import behavior. 
In addition, NW.js can mix Node and DOM contexts together. Luckily, 
Node.js v17 documentation covers ESM and CommonJS module behavior in detail:

- [ECMAScript Modules](https://nodejs.org/dist/latest-v17.x/docs/api/esm.html)
- [CommonJS modules](https://nodejs.org/dist/latest-v17.x/docs/api/modules.html) 

Microsoft also provides base configuration schemes that will suit the targeted environment.

- [TSConfig modules reference](https://www.typescriptlang.org/tsconfig#module)
- [TSConfig base configuration samples](https://github.com/tsconfig/bases/)

_tsconfig_ and _package.json_ setups provided with this skeleton application do their best to follow the modern guidelines
and expectations but the author is certainly not an expert on the subject and he misses his glory days with RequireJS.

##### Relative paths

- In browser context any relative path will resolve according to the _build/_ directory as it contains the _index.html_ file. (This includes the require() calls for
fetching node modules in the DOM context.)
- In Node context relative paths are resolved according to the module.


##### Working with browser and Node contexts in NW.js

Although it seems convenient to import modules and pass objects in between browser and Node contexts, we can face with subtle bugs due to 
the use of **instanceof** operator and target the wrong window object. For runtime type checking, instead of relying on instanceof,
I can recommend creating structures with tagged unions and compare the tag types when checking passed parameters. For communicating between
different window objects and iframes, [window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
method can gracefully be utilized.

Please refer to the NW.js [documentation](https://nwjs.readthedocs.io/en/latest/For%20Users/Advanced/JavaScript%20Contexts%20in%20NW.js/) and [wiki page](https://github.com/nwjs/nw.js/wiki/Differences-of-JavaScript-contexts)
and try to minimize the number of context switches.

### Compiling C/C++ Node addons

NWP contains a sample addon written in C by using the Node API (NAPI). More addons can be added in src/addons directory which also
includes a sample CMakeLists.txt file for building the shared node library module with [cmake-js](https://github.com/cmake-js/cmake-js). 
A typical compilation process is as follows:

```bash
# First make sure node api headers are install. CMake-js automatically installs the proper headers. 
npm run install:node-api-headers
```
```bash
# cmake-js compile -d src/addons
npm run build:addons
```


#### CMakeLists.txt
The infamous _cmake_ configuration file only includes a single addon, _gateway_, for the sake of simplicity. 
Cmake can be configured with submodules to generate more addon libraries and even executable targets in one compilation process.
For organizing larger C/C++ projects, take a look at this [presentation](https://db.in.tum.de/teaching/ss20/c++praktikum/slides/lecture-11.pdf?lang=en) by Professor Thomas Neumann of Technical University of Munich.

_package.json_ contains a **cmake-js** block for explicitly targeting the NW runtime:
```json
"cmake-js": {
    "runtime": "nw",
    "runtimeVersion": "0.63.0"
}
```
Node API headers are installed according to the runtime version.



#### Gateway Addon
The sample _gateway_ addon can be used as the gate opening to the outside world by linking with external C/C++ libraries. It follows a promise
based API to run time consuming tasks in a worker thread (provided by the Node API) and returning the result and potential errors back to the JS context. 
Projects can enhance or build upon the base _nwp_addon.h_ structs to define more complicated multithreaded tasks.

#### Loading & Using Addons

NWP includes a custom webpack loader module _extras/loaders/nwp-node-loader_ for loading *.node addons in the generated _bundle.js_.
webpack configuration employs the loader and targets all *.node libraries by default. When more addons are integrated into the project (_src/addons_),
update resolve.alias to map the module to its file path and import the module as ESM in TypeScript,

```typescript
import {runFoo} from 'nwp-gateway.node';
```

#### Typings for addon modules

Add custom type declarations (_notorious d.ts files_) to _extras/@types_ for node addons as well as other custom libraries included with the project.
This directory is configured as a type root in tsconfig.json. TypesScript d.ts schemes can be very confusing (at least for the author) but for node addons
**declare module** construct seems to be the most straightforward and error-free approach:

```typescript
declare module "nwp-gateway.node" {
    export function runFoo(arg: Record<string, number>): Promise<{mode: number}>;
}
```

#### Custom Elements & CSS Houdini
[TODO]

### Tests
[TODO]

### Building the platform executable
#### MacOS
* Create a directory named _app.nw_.
* Copy package.json and all your bundled build files, node addons, node-main.ts, etc... into this directory.
* Download your flavor of OSX from http://dl.nwjs.io/ 

  * `wget http://dl.nwjs.io/v0.63.0/nwjs-v0.63.0-osx-x64.zip`

* Unzip and rename nwjs to your liking. 
* Show package contents with the context menu option.  
* Place _app.nw_ folder into the _Resources_ folder.
* Edit _Info.plist_ for setting application properties such as icons, names and identifiers, associating file type extensions, etc...
  * Apple's documentation for bundle structure and property list configuration is here: https://developer.apple.com/documentation/bundleresources
  * A rudimentary _Info.plist_ file for NWP can be found under the _examples/bundle_ directory.

#### Windows
* Create a new zip file named _app.nw_.
* Copy package.json and all your bundled build files, node addons, node-main.ts, etc... into this directory.
* Download the windows package.
  * Ex: `http://dl.nwjs.io/v0.63.0/nwjs-v0.63.0-win-x64.zip`
* Rename the zip file with the Powershell.
  * `Rename-Item -Path "c:\...\app.nw.zip" -NewName "app.nw"`

* Open the cmd shell and merge _app.nw_ with _nw.exe_.
  * `copy /b nw.exe+app.nw app.exe`
* Create another folder for the final stage of your application package
  * Put app.exe into this folder
  * Copy all the files from the downloaded NW.js package except nw.exe and nwjc.
* Running app.exe inside the folder should open the application.

### Packaging
Packaging the application with setup installers is outside the scope of this project. I am considering creating another project in the future to exclusively cover
different scenarios for packaging and distributing both Electron and NW.js applications. Any such solution should be expected to be part of a scripted and automated
build process.

#### Node API documentation & examples 
- https://nodejs.org/dist/latest-v17.x/docs/api/n-api.html
- https://github.com/nodejs/node-addon-examples

## Troubleshooting

* If SDK version is not installed, NW.js can crash when developer consoles are opened with the JS API.
It is possible that npm can get confused and not install the SDK package contrary to package.json instructions. Delete
the node_modules directory and run `npm install `again.

* Some GPUs may not be supported by Chromium. If NW.js is not started try passing `--disable-gpu` to __chromium-args__ in _package.nw.json_
and restart with `npm run start`.


* Chromium is very chatty and can return errors such as
  
  ```text
  ERROR:iopm_power_source_sampling_event_source.cc(31)] IOPMPowerSource service not found
  Error: Value for flag --concurrent-sparkplug-max-threads= of type uint is out of bounds [0-4294967295]
  Try --help for options
  ```
  
  These are mostly harmless, but you should keep an eye on cpu/memory consumption.

## Sources

* [NW.js Wiki](https://github.com/nwjs/nw.js/wiki) 
* [NW.js Documentation](https://nwjs.readthedocs.io/en/latest/)
* [NW.js Essentials book](https://www.packtpub.com/product/nw-js-essentials/9781785280863)
  * Covers all mechanical aspects of developing desktop applications with NW.js
* [Chromium blog](https://blog.chromium.org/)
  * Chromium blog advertises new features that will be available with NW.js builds through [npm](https://www.npmjs.com/package/nw) 
  in a day or two after a new Chrome version is released by Google. 
* [Wonderful world of CSS Houdini](https://css-houdini.rocks/)
* [Custom elements spec](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
