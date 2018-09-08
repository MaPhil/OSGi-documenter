# OSGi documenter
This little package is meant to build up a basic documentation for a java project that implements the OSGi plugin logic.
The documentation is done in respect to the relation or dependencies of the plugins (which plugins uses the capabilities of an other plugin). The result after running the command **node create.js** should be a starting point for a more in depth analysis of the code.
## Usage
To use the system you need to create folder source inside the package folder and drag and drop a copy of your projects sources inside. 
After this is done you need to run the command **node create.js**, this might take a wile to be completed.
## Export
The export at the moment is only a file that lists the plugins by there package name (in a JSON fashion). The next step for the development of the project would be to export the documentation in a markdown file format.