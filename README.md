# FancyGrid

Build v1.6.0

FancyGrid - JavaScript grid library with charts integration and server communication.
  
## Install

#### *bower*
```
bower install fancygrid
```

#### *npm*
```
npm install fancygrid
```

#### *code.fancygrid.com*
```
http://code.fancygrid.com/fancy.min.js
http://code.fancygrid.com/fancy.min.css
```

## Quick Start
Include a reference to the FancyGrid library

```html
<link href="http://code.fancygrid.com/fancy.min.css" rel="stylesheet">
<script src="http://code.fancygrid.com/fancy.min.js"></script>
```
The `FancyGrid` object is now accessible. Happy griding!
```html
<div id="grid"></div>
<script>
window.onload = function() {

new FancyGrid({
  renderTo: 'grid',
  width: 300,
  height: 200,
  data: [
	{name: 'Nick', age: 30},
	{name: 'Fred', age: 25},
	{name: 'Mike', age: 35}
  ],  
  columns: [{
    index: 'name',
    title: 'Name',    
    type: 'string'
  },{
	type: 'number',
    index: 'age',
    title: 'Age'
  }]
});

};
</script>
```

## Component version
Include a reference to the FancyGrid library
```html
<script>
Fancy.enableCompo();
</script>
<fancy-grid id="myGrid" data-title="New Grid" data-width="400" data-height="300">
  <fancy-columns>
   [{
     index: 'name',
     title: 'Name',    
     type: 'string'
   },{
     type: 'number',
     index: 'age',
     title: 'Age'
   }]
  </fancy-columns>
  <fancy-data>
    [
      {name: 'Nick', age: 30},
      {name: 'Fred', age: 25},
      {name: 'Mike', age: 35}
    ]
  </fancy-data>
</fancy-grid>
```

## Package Directory
The package includes the following:
```
|   README.md
├── client
│   ├── fancy.full.min.js
│   ├── fancy.min.js
│   ├── fancy.min.css
│   ├── modules
├── src
│   ├── js
|   ├── |...
│   ├── less
|   ├── |...
|   ...
```

## Debug
In case you want to debug FancyGrid there are several approaches.  

### Debug files
Include css file ```/client/fancy.css```.
Include js file ```/src/js/load-all.js```.
After that set
```
Fancy.MODULESLOAD = false;
```

### Debug full build
Include css file ```/client/fancy.css```.
Include js file ```/src/js/fancy.full.js```.
After that set
```
Fancy.MODULESLOAD = false;
```

### Debug with auto-loading modules
Include css file ```/client/fancy.css```.
Include js file ```/src/js/fancy.js```.
Set modules path
```
Fancy.MODULESDIR = '/client/modules/';
Fancy.DEBUG = true;
```

## Custom build
### Debug build
```
grunt debug
```
### Release build
```
grunt release
```

## Support
If you need any assistance or would like to report any bugs found in FancyGrid, please contact us at support@fancygrid.com
