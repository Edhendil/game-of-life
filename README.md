# Game of life

This is Conway's game of life implementation done using AngularJS together with full toolchain: npm, bower and gulp.

Demo is available here: https://edhendil.github.io/game-of-life

If you are interested in my other projects go here: https://edhendil.github.io

## Features

* Frames per second limit
* Step by step execution
* Game rules presets 
* Any set of rules can be specified
* Game state can be changed by using brushes directly on canvas

## Build process

To build this application locally you have to execute all these commands. It assumes you have already installed npm and bower globally.

* git clone https://github.com/Edhendil/game-of-life.git
* cd game-of-life
* npm install
* bower install
* gulp rebuild - build everything, including libraries
* gulp serve - start a server
* open browser and go to http://localhost:3000

There are also some additional gulp tasks defined.

* gulp lint - check scripts code style
* gulp formatJs - format code
* gulp compile - compiles app's code, does not touch libraries
* gulp watch - compile on code change
