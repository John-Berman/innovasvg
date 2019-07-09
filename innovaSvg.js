const XMLNS = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

var cnX, cnY;
var thisX;
var thisY;

var zoomVal = 1;


var selected = undefined;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Adds an svg node to the dom.
// Checks if node with id already exists. If it does, removes the node.
// Creats a new svg node and decorates it with attributes in the params array.
// 	node: the id of the parent node in which to append the svg node.
// 	params: an object whose properties represent valid attribute name value pairs.
function addSvg(node, params) {
    var svg = undefined,
        elem = document.getElementById(node),
        svgNode;

    if (params.id !== undefined) {
        //If a node with params.id already exists, remove it.
        svgNode = document.getElementById(params.id);
        if (svgNode) {
            // Check node attributes.
            // var attrs = svgNode.attributes;
            // attrs.width = getRandomInt(1000,5000);
            elem.removeChild(svgNode);
            //document.getElementById(params.id).selectAll("*").remove();
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

function createNode(parentNode, id, type, args, innerHtml, namespace) {
    //parentNode: id of the parent node.
    //id: the id of the node
    //type: the type of the node, e.g. 'path', 'def' etc.
    //args: any attributes for the group.
    //innerHtml: anything to go inside the node.
    namespace = XMLNS;// namespace || null;
    var parent = document.getElementById(parentNode),//Parent node in which node will be created.
        child = document.getElementById(id),//See if we have a node already with the same id
        node = document.createElementNS(namespace, type);//Create the node
    //If we have an id parameter?
    if (id !== undefined) {
        if (child) {
            //Node with id already exists, so remove it.
            parent.removeChild(child);
        }
    }

    if (id !== undefined) {
        node.setAttributeNS(null, "id", id);
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
function drawCircle(x,y,r,id,fill,stroke,fo,node,so){
	createNode(node || CANVAS, 
			id || guid(), 
			'circle', 
			{ cx: x, cy: y, r:r||1, id: id || guid(), style: 'fill:' + (fill || 'none') + ';stroke:' + (stroke || 'black') + ';stroke-width:0.5px;fill-opacity:' + (fo||1) +';' + 'stroke-opacity:' + (so || 1) +';'}
	);
}
function drawRectangle(node,x,y,width,height,params){
	var d = 'M ' + x + ' ' + y + ' l ' + width + ' ' + 0 + ' l ' + 0 + ' ' + height + ' l ' + (-width) + ' ' + 0 + ' z';
	params.d = d;
	drawPath(node,params)
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
    element = document.getElementById(node);
    element.appendChild(ln);
    return ln;
}
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
function textElement(node, text, args) {
    var t = document.createElementNS(XMLNS, "text"),
        elem = document.getElementById(node);
    for (o in args) {
        if (args[o] !== undefined) t.setAttributeNS(null, o, args[o]);
    }
    t.textContent = text;

    elem.appendChild(t);
    return { parent: elem, node: t };
}
function vectorLength(x,y){
    return Math.sqrt((Math.pow(x,2)+(Math.pow(y,2))));
}