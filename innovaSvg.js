//Code taken from GitHub
//https://github.com/John-Berman/innovasvg/blob/master/innovaSvg.js
const XMLNS = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

// Constants for node types (nodeName).
const GROUP = 'g';
const CIRCLE = 'circle';
const ELLIPSE = 'ellipse';
const PATH = 'path';
const DEF = 'def';
const TSPAN = 'tspan';
const TEXT = 'text';
var cnX, cnY;
var thisX;
var thisY;

var zoomVal = 1;


var selected = undefined;

function getRandomInt(min, max) {
    // Returns a random integer between min and max.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function idStore (seed, step) {
    // Acts as a store for new id's;
    // Returns an integer and incements the store id for the next request.
    // Parameters:
    // seed: (int) optional - The seed (start) of numbers to increment from.
    //       The first id will be equal to the seed.
    //       Defaults to 0;
    // step: (int) optional - the size of step (increments) for each id.
    //       Defaults to 1;
    // Example:
    // var ids = new idStore(100);
    // let id = ids.newId();
    var id = seed || 0;
    var increment = step || 1;
    this.newId = function () {
        let nid = id;
        id += increment;
        return nid;
    }
}
function getNode(node){
    // Helper function to determine if node is a Dom object (node) or an id (string);
    // If node is a Dom object, simply returns the node.
    // Else uses the id to get the Dom object and returns it.
    var nodeType = typeof node;
    if(typeof node === 'object'){
        console.log('getNode', 'node is a dom oject, return node.', node.id);
        return node;
    } else if(nodeType === 'string'){
        console.log('getNode', 'node is a string. Get reference to node and return it.', node);
        return document.getElementById(node);
    }
 }
function addSvg(node, params) {
// Adds an svg node to the dom.
// Checks if node with id already exists. If it does, removes the node.
// Creats a new svg node and decorates it with attributes in the params array.
    // Parameters:
// 	node: the id of the parent node in which to append the svg node.
// 	params: an object whose properties represent valid attribute name value pairs.
    //          Must have an id property.
    var svg = undefined,
        elem = getNode(node),
        svgNode;

    if (params.id !== undefined) {
        //If a node with params.id already exists, remove it.
        svgNode = document.getElementById(params.id);
        if (svgNode) {
            // Check node attributes.
            // var attrs = svgNode.attributes;
            // attrs.width = getRandomInt(1000,5000);
            elem.removeChild(svgNode);
        }
    }
	//Creat the svg node.
    svg = document.createElementNS(XMLNS, "svg");
	//Loop over params and add attributes to svg node.
    for (o in params) {
        svg.setAttributeNS(null, o, params[o]);
    }
	//Add namespace attributes.
    svg.setAttribute("xmlns", XMLNS);
    svg.setAttribute('xmlns:xlink', XLINK);
    svg.setAttribute('display', 'block');
    
    //svg.setAttribute('viewBox', "966 555 350 1000");
	//Add the svg node to the parent node.
    elem.appendChild(svg);
	
    return svg;
}

function createNode(parentNode, id, type, args, innerHtml) {
    //parentNode: id (string) of the parent node, or the parent node itself (Dom object).
    //id: the id of the node to be created.
    //type: the type of the node, e.g. 'path', 'def' etc.
    //args: any attributes for the group.
    //innerHtml: anything to go inside the node.
    //Parent node in which node will be created.
    var parent = getNode(parentNode),
    //See if we have a node already with the same id
        child = document.getElementById(id),
        //Create the node
        node = document.createElementNS(XMLNS, type);
    //If we have an id parameter?
    if (id !== undefined) {
        if (child) {
            //Node with id already exists, so remove it.
            parent.removeChild(child);
        }
    }

    if (id !== undefined) {
        // Add id to args. It will be added to node with other args (below).
        args.id = id;
    }    
	if (args !== undefined) {
        for (o in args) {
            if (args[o] !== undefined) {
                node.setAttributeNS(null, o, args[o]);
            }
        }
    }
    if (innerHtml) {
        node.innerHTML = innerHtml;
    }
    parent.appendChild(node);
    return node;
}
function circle(parent,cx,cy,r,id,fill,strokeColor,strokeWidth,fillOpacity,strokeOpacity){
    strokeWidth = strokeWidth || 1;
    fillOpacity = fillOpacity || 1;
    strokeOpacity = strokeOpacity || 1;
    return createNode(parent, id, 'circle',
    {
        cx:cx,
        cy:cy,
        r:r,
        style: `fill: ${fill}; 
            stroke: ${strokeColor}; 
            stroke-width: ${strokeWidth}px; 
            fill-opacity: ${fillOpacity}; 
            stroke-opacity: ${strokeOpacity};`
    });
}
function drawCircle(cx,cy,r,id,fill,stroke,fo,node,so){
    // Depricated. Use circle.
    // Draws a circle on the svg canvas.
    // Parameters:
    //  cx: the center x coordinate.
    //  cy: the center y coordinate.
    //  r: the circle radius.
    //  id: the id to be given to the circle.
    //  fill: the fill color, either rgb, hex or constant value.
    //  stroke: the stroke color, , either rgb, hex or constant value.
    //  fo: fill opacity (float). Value between 0 and 1.
    //  node: the id or dom object of the parent node to which the circle is to be added.
    //  so: stroke opacity (float). Value between 0 and 1.
	return createNode(node, 
			id || guid(), 
			'circle', 
			{ cx: x, cy: y, r:r||1, id: id || guid(), style: 'fill:' + (fill || 'none') + ';stroke:' + (stroke || 'black') + ';stroke-width:0.5px;fill-opacity:' + (fo||1) +';' + 'stroke-opacity:' + (so || 1) +';'}
	);
}
function rectangle(parent,x,y,width,height,params){
    params = params || { style: 'fill: #ccc; stroke: #000; stroke-width: 1px; fill-opacity: 1; stroke-opacity: 1'};
    const d = `M ${x} ${y} l ${width} 0 l 0 ${height} l ${-width} 0 z`;
    params.d = d;
    return drawPath(parent,params)
}
function drawRectangle(node,x,y,width,height,params){
    // Depricated. Use rectangle
	var d = 'M ' + x + ' ' + y + ' l ' + width + ' ' + 0 + ' l ' + 0 + ' ' + height + ' l ' + (-width) + ' ' + 0 + ' z';
	params.d = d;
	return drawPath(node,params)
}
function drawPath(node, params) {
    /// <summary>
    /// Svg path function
    /// </summary>
    /// <param name="node">The id of the node to append the path to.</param>
    /// <param name="params">An array of name value pairs for attributes.</param>
    var element, i = 0, o = undefined;
    ln = document.createElementNS(XMLNS, "path");
    for (o in params) {
		//console.log(ln);
        ln.setAttributeNS(null, o, params[o]);
    }
    element = getNode(node);
    element.appendChild(ln);
    return ln;
}
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return `${s4()+s4()}-${s4()}-${s4()}-${s4()}-${s4()+s4()+s4()}`;
}
function measureText(node, text, args, mw) {
	args.x = -1000;
	args.y = -1000;
	var mt = textElement(node, text, args),
		c = mt.node.getcontainerBbox();
		//c = mt.node.getBoundingClientRect();
	var bb = mt.node.getcontainerBbox ();
	mt.parent.removeChild(mt.node);
	if(mw!==undefined) {
		c.maxWidth = mw;
		c.cw = mw / (c.width / text.length);
    }
    //console.log(bb);
	return c;	
}
function textElement(node, text, args, lines, spanStyle) {
    //  node: A dom object or id of dom object.
    //  text: A string value to be added to text node. Leave undefined if you want to use lines (see lines).
    //  args: An object containing attributes (name/value pairs) to be added to node.
    //  lines: An array of strings, each representing a seperate line to be added as a tspan element.
    //  spanStyle: An array of styles to be paired with each line in lines. 
    //             The ordinal position of the style must match the ordinal position of the line.
    var t = document.createElementNS(XMLNS, TEXT),
        elem = getNode(node);
    if(elem !== null){
    for (o in args) {
            if (args[o] !== undefined){
                t.setAttributeNS(null, o, args[o]);
    }
        }
    if(lines === undefined){
        t.textContent = text;
    } else {
            for(let i = 0; i<lines.length;i++){
                let ts = document.createElementNS(XMLNS, TSPAN);
                ts.textContent = lines[i];
            ts.setAttributeNS(null, 'x',args.x);
            ts.setAttributeNS(null, 'dy',15);
                if(spanStyle){
                    if(spanStyle[i]){
                        let style = spanStyle[i];
                        for(s in style){
                            ts.setAttributeNS(null, s, style[s]);  
                        }
                    }
                }
            t.appendChild(ts);
            }
            // lines.forEach(line => {
                //ToDo: JB
            // });
    }

    elem.appendChild(t);
    return { parent: elem, node: t };
    }
}
function vectorLength(x,y){
    return Math.sqrt((Math.pow(x,2)+(Math.pow(y,2))));
}
//New
function drawEllipse(cx,cy,rx, ry,id,fill,stroke,fo,node,so,sw){
    // Draws an ellipse on the svg canvas.
    // Parameters:
    //  cx: the center x coordinate.
    //  cy: the center y coordinate.
    //  r: the ellipse radius.
    //  id: the id to be given to the ellipse.
    //  fill: the fill color, either rgb, hex or constant value.
    //  stroke: the stroke color, , either rgb, hex or constant value.
    //  fo: fill opacity (float). Value between 0 and 1.
    //  node: the id or dom object of the parent node to which the ellipse is to be added.
    //  so: stroke opacity (float). Value between 0 and 1.
	return createNode(node, 
			id || guid(), 
			ELLIPSE, 
            { cx: cx, 
                cy: cy, 
                rx:rx, 
                ry: ry, 
                style: 'fill:' + (fill || 'none') + ';stroke:' + (stroke || 'black') + ';stroke-width:' + (sw !== undefined ? sw : 0.5) +'px;fill-opacity:' + (fo||1) +';' + 'stroke-opacity:' + (so || 1) +';'}
	);
}
