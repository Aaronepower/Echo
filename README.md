# Echo
Video/Audio calling through [WebRTC](http://en.wikipedia.org/wiki/WebRTC)
## Requirements

1. [Node.JS](http://nodejs.org/)

2. [MongoDB](http://www.mongodb.org/downloads)

## Install Instructions

In project root directory.

1. npm install -g bower

2. npm install -g gulp

3. npm install

4. bower install

## Build

Run command **gulp**

## Gulp Options

Add options as shown:

`gulp --debug=Echo`

+ `--debug=Echo`

  _Provides detailed API request and response information_ 
  
+ `--serverPath=true`
  
  _Lints Server code over client code_

+ `--dbPath=_your path here_`
  
  If your mongod.exe is located somewhere other than the default (_C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe_)
