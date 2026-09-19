// Garden Gnome Software - Skin
// Pano2VR 8.0.5/22607
// Filename: TourSkin.ggsk
// Generated 2026-09-19T13:44:41Z

function pano2vrSkin(player,base) {
	var me=this;
	var skin=this;
	var flag=false;
	var hotspotTemplates={};
	var skinKeyPressedKey = 0;
	var skinKeyPressedText = '';
	this.player=player;
	var pano=player;
	player.setApiVersion(7);
	this.rasterizeHTML = player.getRasterizeHTML();
	this.player.skinObj=this;
	this.divSkin=player.divSkin;
	this.ggUserdata=player.userdata;
	player.addListener('changenode', function() { me.ggUserdata=player.userdata; });
	this.lastSize={ w: -1,h: -1 };
	var basePath="";
	var cssPrefix="";
	me.fontsLoaded=0;
	// auto detect base path
	if (base=='?') {
		var scripts = document.getElementsByTagName('script');
		for(var i=0;i<scripts.length;i++) {
			var src=scripts[i].src;
			if (src.indexOf('skin.js')>=0) {
				var p=src.lastIndexOf('/');
				if (p>=0) {
					basePath=src.substr(0,p+1);
				}
			}
		}
	} else
	if (base) {
		basePath=base;
	}
	this.elementMouseDown={};
	this.elementMouseOver={};
	var i,hs,el,els,elo,ela,geometry,material;
	var prefixes='Webkit,Moz,O,ms,Ms'.split(',');
	for(var i=0;i<prefixes.length;i++) {
		if (typeof document.body.style[prefixes[i] + 'Transform'] !== 'undefined') {
			cssPrefix='-' + prefixes[i].toLowerCase() + '-';
		}
	}
	
	var parameterToTransform=function(p) {
		return p.def + 'translate(' + p.rx + 'px,' + p.ry + 'px) rotate(' + p.a + 'deg) scale(' + p.sx + ',' + p.sy + ')';
	}
	this._=function(text, params) {
		return player._(text, params);
	}
	
	player.setMargins({'left': {'value': 0, 'unit': 'px'}, 'top': {'value': 0, 'unit': 'px'}, 'right': {'value': 0, 'unit': 'px'}, 'bottom': {'value': 0, 'unit': 'px'}});
	
	this.updateSize=function(startElement) {
		var stack=[];
		stack.push(startElement);
		while(stack.length>0) {
			var e=stack.pop();
			if (e.ggUpdatePosition) {
				e.ggUpdatePosition();
			}
			if (e.hasChildNodes()) {
				for(var i=0;i<e.childNodes.length;i++) {
					stack.push(e.childNodes[i]);
				}
			}
		}
		if (player.is3dModel()) {
			let hg = player.get3dHotspotGroup();
			if (hg) {
				let startObject = null;
				if (startElement !== undefined && startElement != me.divSkin) {
					if (startElement.ggId) {
						hg.traverse(function(el) {
							if (el.userData && el.userData.ggId === startElement.ggId) {
								startObject = el;
							}
						});
					}
				} else {
					startObject = hg;
				}
				if (startObject) {
					startObject.traverse(function(el) {
						if (el.userData && el.userData.ggUpdatePosition) {
							el.userData.ggUpdatePosition();
						}
					});
				}
			}
		}
	}
	player.addListener('sizechanged', function () { me.updateSize(me.divSkin);});
	
	this.findElements=function(id,regex) {
		var r=[];
		var stack=[];
		var pat=new RegExp(id,'');
		stack.push(me.divSkin);
		while(stack.length>0) {
			var e=stack.pop();
			if (regex) {
				if (pat.test(e.ggId)) r.push(e);
			} else {
				if (e.ggId==id) r.push(e);
			}
			if (e.hasChildNodes()) {
				for(var i=0;i<e.childNodes.length;i++) {
					stack.push(e.childNodes[i]);
				}
			}
		}
		return r;
	}
	
	this.languageChanged=function() {
		var stack=[];
		stack.push(me.divSkin);
		while(stack.length>0) {
			var e=stack.pop();
			if (e.ggUpdateText) {
				e.ggUpdateText();
			}
			if (e.ggUpdateAria) {
				e.ggUpdateAria();
			}
			if (e.hasChildNodes()) {
				for(var i=0;i<e.childNodes.length;i++) {
					stack.push(e.childNodes[i]);
				}
			}
		}
	}
	player.addListener('languagechanged', this.languageChanged);
	
	this.getClassStyles = function(className) {
		className = '.' + className;
		for (let sheet of document.styleSheets) {
			try {
				for (let rule of sheet.cssRules || sheet.rules) {
					if (rule.selectorText === className) {
						return rule.style;
					}
				}
			} catch (e) {
				console.warn("Cannot access stylesheet: ", e);
			}
		}
		return null;
	};
	this.paintTextDivToCanvas = function(el, stylesString, textureHeightFromEl, autoSize, scrollbar, measureOnly) {
		if (measureOnly === undefined) measureOnly = false;
		const skinStyles = skin.getClassStyles('ggskin');
		const skinTextStyles = skin.getClassStyles('ggskin_text');
		const skinStylesString = skinStyles ? skinStyles.cssText : '';
		const skinTextStylesString = skinTextStyles ? skinTextStyles.cssText : '';
		let elementStylesString = '';
		if (Array.isArray(el.userData.cssClasses)) {
			el.userData.cssClasses.forEach(function(className) {
				const classStyles = skin.getClassStyles(className);
				if (classStyles) {
					elementStylesString += classStyles.cssText;
				}
			});
		}
		const outerDiv = document.createElement('div');
		const textDiv = document.createElement('div');
		textDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
		textDiv.style = skinStylesString + skinTextStylesString + elementStylesString + stylesString;
		textDiv.innerHTML = el.userData.ggText;
		textDiv.style.position = 'absolute';
		textDiv.style.left = '0px';
		textDiv.style.top = '0px';
		outerDiv.appendChild(textDiv);
		document.body.appendChild(outerDiv);
		el.userData.boxWidthCanv = textDiv.clientWidth;
		el.userData.totalHeightCanv = textDiv.clientHeight;
		elStyle = window.getComputedStyle(textDiv);
		const lineHeight = elStyle.lineHeight;
		if (lineHeight !== 'normal') {
			el.userData.lineHeight = parseFloat(lineHeight);
		} else {
			el.userData.lineHeight = parseFloat(elStyle.fontSize) * 1.2;
		}
		if (measureOnly) {
			document.body.removeChild(outerDiv);
			return;
		}
		var canv = el.userData.tmpCanvas;
		var ctx = el.userData.tmpCanvasContext;
		canv.width = textDiv.clientWidth * 2;
		canv.height = textDiv.clientHeight * 2;
		ctx.clearRect(0, 0, canv.width, canv.height);
		if (autoSize) {
			el.userData.boxHeightCanv = el.userData.totalHeightCanv;
		} else {
			el.userData.boxHeightCanv = el.userData.height;
		}
		if (scrollbar && textDiv.clientHeight > el.userData.height) {
			el.userData.textCanvas.width = el.userData.width * 2;
		} else {
			el.userData.textCanvas.width = el.userData.boxWidthCanv * 2;
		}
		el.userData.textCanvas.height = el.userData.boxHeightCanv * 2;
		this.rasterizeHTML.drawHTML(outerDiv.innerHTML, canv, {zoom: 2, baseUrl: player.getBasePath() }).then((renderResult) => {
			el.userData.ggTextureFromCanvas();
		}, (err) => {
			console.error('Error rendering HTML to canvas:', err);
		});
		document.body.removeChild(outerDiv);
	};
	this.rectMaxRadius = function(el) {
		return Math.min(el.userData.width / 2.0 + (el.userData.borderWidth.left + el.userData.borderWidth.right) / 2.0, el.userData.height / 2.0 + (el.userData.borderWidth.top + el.userData.borderWidth.bottom) / 2.0);
	}
	this.rectCalcBorderRadiiInnerShape = function(el) {
		let maxRad = skin.rectMaxRadius(el);
		let bwTopLeft = (el.userData.borderWidth.top + el.userData.borderWidth.left) / 2.0;
		let brTopLeft = Math.max(el.userData.borderRadius.topLeft - bwTopLeft, 0.0);
		brTopLeft = Math.min(brTopLeft, maxRad - bwTopLeft);
		let bwTopRight = (el.userData.borderWidth.top + el.userData.borderWidth.right) / 2.0;
		let brTopRight = Math.max(el.userData.borderRadius.topRight - bwTopRight, 0.0);
		brTopRight = Math.min(brTopRight, maxRad - bwTopRight);
		let bwBottomRight = (el.userData.borderWidth.bottom + el.userData.borderWidth.right) / 2.0;
		let brBottomRight = Math.max(el.userData.borderRadius.bottomRight - bwBottomRight, 0.0);
		brBottomRight = Math.min(brBottomRight, maxRad - bwBottomRight);
		let bwBottomLeft = (el.userData.borderWidth.bottom + el.userData.borderWidth.left) / 2.0;
		let brBottomLeft = Math.max(el.userData.borderRadius.bottomLeft - bwBottomLeft, 0.0);
		brBottomLeft = Math.min(brBottomLeft, maxRad - bwBottomLeft);
		el.userData.borderRadiusInnerShape = {
			topLeft: brTopLeft,
			topRight: brTopRight,
			bottomRight: brBottomRight,
			bottomLeft: brBottomLeft
		};
	}
	this.rectHasRoundedCorners = function(el) {
		return (el.userData.borderRadius.topLeft > 0 || el.userData.borderRadius.topRight > 0 || el.userData.borderRadius.bottomRight > 0 || el.userData.borderRadius.bottomLeft > 0);
	}
	this.disposeGeometryAndMaterial = function(el) {
		if (el.geometry) el.geometry.dispose();
		el.geometry = null;
		if (el.material) el.material.dispose();
	}
	this.removeChildren = function(el, filter) {
		if (filter === undefined) filter ='^.*$';
		const pattern = new RegExp(filter);
		for (let i = el.children.length - 1; i >= 0; i--) {
			let child = el.children[i];
			if (pattern.test(child.name)) {
				if (child.isMesh) {
					skin.disposeGeometryAndMaterial(child);
				}
				el.remove(child);
			}
		}
	};
	this.getDepthFrom = function(root, object) {
		let depth = 0;
		let current = object;
		while (current && current !== root) {
			if (current.userData && current.userData.hasOwnProperty('ggId')) depth++;
			current = current.parent;
		}
		return current === root ? depth : -1;
	};
	this.getElementVrPosition = function(el, x, y) {
		var vrPos = {};
		var renderableEl = el.parent && (el.parent.type == 'Mesh' || el.parent.type == 'Group');
		switch (el.userData.hanchor) {
			case 0:
			vrPos.x = (0) - ((renderableEl ? el.parent.userData.width : 800) / 200.0) + (x / 100.0) + (el.userData.width / 200.0);
			break;
			case 1:
			vrPos.x = (0) + (x / 100.0);
			break;
			case 2:
			vrPos.x = (0) + ((renderableEl ? el.parent.userData.width : 800) / 200.0) - (x / 100.0) - (el.userData.width / 200.0);
			break;
		}
		switch (el.userData.vanchor) {
			case 0:
			vrPos.y = (0) + ((renderableEl ? el.parent.userData.height : 600) / 200.0) - (y / 100.0) - (el.userData.height / 200.0);
			break;
			case 1:
			vrPos.y = (0) - (y / 100.0);
			break;
			case 2:
			vrPos.y = (0) - ((renderableEl ? el.parent.userData.height : 600) / 200.0) + (y / 100.0) + (el.userData.height / 200.0);
			break;
		}
		vrPos.x += el.userData.curScaleOffX;
		vrPos.y += el.userData.curScaleOffY;
		return vrPos;
	}
	this.addSkin=function() {
		var hs='';
		var el,els,elo,ela,elHorScrollFg,elHorScrollBg,elVertScrollFg,elVertScrollBg,elCornerBg;
		this.ggCurrentTime=new Date().getTime();
		el=me._image_1=document.createElement('div');
		els=me._image_1__img=document.createElement('img');
		els.className='ggskin ggskin_image';
		hs=basePath + 'images/image_1.png';
		els.setAttribute('src',hs);
		els.ggNormalSrc=hs;
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.className='ggskin ggskin_image';
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Image 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_image ";
		el.ggType='image';
		el.userData=el;
		hs ='';
		hs+='height : 70px;';
		hs+='left : 8px;';
		hs+='position : absolute;';
		hs+='top : 10px;';
		hs+='visibility : inherit;';
		hs+='width : 150px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._image_1.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._image_1.ggUpdatePosition=function (useTransition) {
		}
		me.divSkin.appendChild(me._image_1);
		el=me._rectangle_2=document.createElement('div');
		el.ggId="Rectangle 2";
		el.ggDy=-14;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='background : #024895;';
		hs+='border : 3px solid #fdc605;';
		hs+='border-radius : 40px;';
		hs+='height : 61px;';
		hs+='position : absolute;';
		hs+='right : -69px;';
		hs+='top : calc(50% - ((61px + 6px) / 2) - 14px);';
		hs+='visibility : inherit;';
		hs+='width : 122px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._rectangle_2.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._rectangle_2.ggUpdatePosition=function (useTransition) {
		}
		el=me._lottie_2=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_2.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggId="Lottie 2";
		el.ggDy=9;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 52px;';
		hs+='position : absolute;';
		hs+='right : 65px;';
		hs+='top : calc(50% - ((52px + 0px) / 2) + 9px);';
		hs+='visibility : inherit;';
		hs+='width : 48px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_2.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._lottie_2.onclick=function (e) {
			player.openNext("{"+player.getStartNode()+"}","");
		}
		me._lottie_2.ggUpdatePosition=function (useTransition) {
		}
		me._rectangle_2.appendChild(me._lottie_2);
		me.divSkin.appendChild(me._rectangle_2);
		el=me._container_1=document.createElement('div');
		el.ggId="Container 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_container ";
		el.ggType='container';
		el.userData=el;
		hs ='';
		hs+='height : 32px;';
		hs+='position : absolute;';
		hs+='right : 1px;';
		hs+='top : 2px;';
		hs+='visibility : inherit;';
		hs+='width : 161px;';
		hs+='pointer-events:none;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._container_1.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._container_1.ggUpdatePosition=function (useTransition) {
		}
		el=me._svg_2=document.createElement('div');
		els=me._svg_2__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxwYXRoIGQ9Ik03IDl2Nmg0bDUgNVY0bC01IDVIN3oiLz4KPC9zdmc+Cg==';
		me._svg_2__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 2";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 31px;';
		hs+='left : 79px;';
		hs+='position : absolute;';
		hs+='top : 1px;';
		hs+='visibility : hidden;';
		hs+='width : 37px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_2.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_2.onclick=function (e) {
			player.unmute("_main");
			me._svg_2.style.transition='none';
			me._svg_2.style.visibility='hidden';
			me._svg_2.ggVisible=false;
			me._svg_4.style.transition='none';
			me._svg_4.style.visibility=(Number(me._svg_4.style.opacity)>0||!me._svg_4.style.opacity)?'inherit':'hidden';
			me._svg_4.ggVisible=true;
		}
		me._svg_2.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_2);
		el=me._svg_4=document.createElement('div');
		els=me._svg_4__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXZvbHVtZS0yIiBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cG9seWdvbiBwb2ludHM9IjExIDUgNiA5IDIgOSAyIDE1IDYgMTUgMTEgMTkgMTEgNSIvPgogPHBhdGggZD0iTTE5LjA3IDQuOTNhMTAgMTAgMCAwIDEgMCAxNC4xNE0xNS41NCA4LjQ2YTUgNSAwIDAgMSAwID'+
			'cuMDciLz4KPC9zdmc+Cg==';
		me._svg_4__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 4";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 30px;';
		hs+='left : 88px;';
		hs+='position : absolute;';
		hs+='top : 2px;';
		hs+='visibility : inherit;';
		hs+='width : 32px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_4.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_4.onclick=function (e) {
			player.mute("_main");
			me._svg_2.style.transition='none';
			me._svg_2.style.visibility=(Number(me._svg_2.style.opacity)>0||!me._svg_2.style.opacity)?'inherit':'hidden';
			me._svg_2.ggVisible=true;
			me._svg_4.style.transition='none';
			me._svg_4.style.visibility='hidden';
			me._svg_4.ggVisible=false;
		}
		me._svg_4.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_4);
		el=me._svg_3=document.createElement('div');
		els=me._svg_3__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXNoYXJlLTIiIGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxjaXJjbGUgY3g9IjE4IiBjeT0iNSIgcj0iMyIvPgogPGNpcmNsZSBjeD0iNiIgY3k9IjEyIiByPSIzIi8+CiA8Y2lyY2xlIGN4PSIxOCIgY3k9IjE5IiByPSIzIi8+CiA8bGluZSB4MT0iOC41OSIgeDI9IjE1Lj'+
			'QyIiB5MT0iMTMuNTEiIHkyPSIxNy40OSIvPgogPGxpbmUgeDE9IjE1LjQxIiB4Mj0iOC41OSIgeTE9IjYuNTEiIHkyPSIxMC40OSIvPgo8L3N2Zz4K';
		me._svg_3__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 3";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 27px;';
		hs+='left : 8px;';
		hs+='position : absolute;';
		hs+='top : 2px;';
		hs+='visibility : inherit;';
		hs+='width : 28px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_3.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_3.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_3);
		el=me._svg_7=document.createElement('div');
		els=me._svg_7__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXgiIGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxsaW5lIHgxPSIxOCIgeDI9IjYiIHkxPSI2IiB5Mj0iMTgiLz4KIDxsaW5lIHgxPSI2IiB4Mj0iMTgiIHkxPSI2IiB5Mj0iMTgiLz4KPC9zdmc+Cg==';
		me._svg_7__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 7";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 41px;';
		hs+='left : 45px;';
		hs+='position : absolute;';
		hs+='top : -5px;';
		hs+='visibility : hidden;';
		hs+='width : 34px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_7.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_7.onclick=function (e) {
			me._svg_7.style.transition='none';
			me._svg_7.style.visibility='hidden';
			me._svg_7.ggVisible=false;
			me._svg_5.style.transition='none';
			me._svg_5.style.visibility=(Number(me._svg_5.style.opacity)>0||!me._svg_5.style.opacity)?'inherit':'hidden';
			me._svg_5.ggVisible=true;
		}
		me._svg_7.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_7);
		el=me._svg_5=document.createElement('div');
		els=me._svg_5__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWdyaWQiIGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxyZWN0IGhlaWdodD0iNyIgd2lkdGg9IjciIHg9IjMiIHk9IjMiLz4KIDxyZWN0IGhlaWdodD0iNyIgd2lkdGg9IjciIHg9IjE0IiB5PSIzIi8+CiA8cmVjdCBoZWlnaHQ9IjciIHdpZHRoPSI3IiB4PSIxNCIgeT0iMT'+
			'QiLz4KIDxyZWN0IGhlaWdodD0iNyIgd2lkdGg9IjciIHg9IjMiIHk9IjE0Ii8+Cjwvc3ZnPgo=';
		me._svg_5__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 5";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 29px;';
		hs+='left : 45px;';
		hs+='position : absolute;';
		hs+='top : 1px;';
		hs+='visibility : inherit;';
		hs+='width : 33px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_5.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_5.onclick=function (e) {
			me._svg_5.style.transition='none';
			me._svg_5.style.visibility='hidden';
			me._svg_5.ggVisible=false;
			me._svg_7.style.transition='none';
			me._svg_7.style.visibility=(Number(me._svg_7.style.opacity)>0||!me._svg_7.style.opacity)?'inherit':'hidden';
			me._svg_7.ggVisible=true;
			me._container_3.style.transition='none';
			me._container_3.style.visibility=(Number(me._container_3.style.opacity)>0||!me._container_3.style.opacity)?'inherit':'hidden';
			me._container_3.ggVisible=true;
		}
		me._svg_5.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_5);
		el=me._svg_1=document.createElement('div');
		els=me._svg_1__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLW1heGltaXplLTIiIGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxwb2x5bGluZSBwb2ludHM9IjE1IDMgMjEgMyAyMSA5Ii8+CiA8cG9seWxpbmUgcG9pbnRzPSI5IDIxIDMgMjEgMyAxNSIvPgogPGxpbmUgeDE9IjIxIiB4Mj0iMTQiIHkxPSIzIiB5Mj0iMTAiLz4KIDxsaW'+
			'5lIHgxPSIzIiB4Mj0iMTAiIHkxPSIyMSIgeTI9IjE0Ii8+Cjwvc3ZnPgo=';
		me._svg_1__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 26px;';
		hs+='left : 128px;';
		hs+='position : absolute;';
		hs+='top : 3px;';
		hs+='visibility : inherit;';
		hs+='width : 30px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_1.onclick=function (e) {
			player.toggleFullscreen();
			me._svg_1.style.transition='none';
			me._svg_1.style.visibility='hidden';
			me._svg_1.ggVisible=false;
			me._svg_6.style.transition='none';
			me._svg_6.style.visibility=(Number(me._svg_6.style.opacity)>0||!me._svg_6.style.opacity)?'inherit':'hidden';
			me._svg_6.ggVisible=true;
		}
		me._svg_1.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_1);
		el=me._svg_6=document.createElement('div');
		els=me._svg_6__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLW1pbmltaXplLTIiIGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxwb2x5bGluZSBwb2ludHM9IjQgMTQgMTAgMTQgMTAgMjAiLz4KIDxwb2x5bGluZSBwb2ludHM9IjIwIDEwIDE0IDEwIDE0IDQiLz4KIDxsaW5lIHgxPSIxNCIgeDI9IjIxIiB5MT0iMTAiIHkyPSIzIi8+Ci'+
			'A8bGluZSB4MT0iMyIgeDI9IjEwIiB5MT0iMjEiIHkyPSIxNCIvPgo8L3N2Zz4K';
		me._svg_6__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 6";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 25px;';
		hs+='left : 131px;';
		hs+='position : absolute;';
		hs+='top : 3px;';
		hs+='visibility : hidden;';
		hs+='width : 25px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_6.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_6.onclick=function (e) {
			player.exitFullscreen();
			me._svg_6.style.transition='none';
			me._svg_6.style.visibility='hidden';
			me._svg_6.ggVisible=false;
			me._svg_1.style.transition='none';
			me._svg_1.style.visibility=(Number(me._svg_1.style.opacity)>0||!me._svg_1.style.opacity)?'inherit':'hidden';
			me._svg_1.ggVisible=true;
		}
		me._svg_6.ggUpdatePosition=function (useTransition) {
		}
		me._container_1.appendChild(me._svg_6);
		me.divSkin.appendChild(me._container_1);
		el=me._container_2=document.createElement('div');
		el.ggId="Container 2";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_container ";
		el.ggType='container';
		el.userData=el;
		hs ='';
		hs+='height : 134px;';
		hs+='position : absolute;';
		hs+='right : 3px;';
		hs+='top : 2px;';
		hs+='visibility : inherit;';
		hs+='width : 40px;';
		hs+='pointer-events:none;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._container_2.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._container_2.ggUpdatePosition=function (useTransition) {
		}
		el=me._image_4=document.createElement('div');
		els=me._image_4__img=document.createElement('img');
		els.className='ggskin ggskin_image';
		hs=basePath + 'images/image_4.png';
		els.setAttribute('src',hs);
		els.ggNormalSrc=hs;
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.className='ggskin ggskin_image';
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Image 4";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_image ";
		el.ggType='image';
		el.userData=el;
		hs ='';
		hs+='height : 27px;';
		hs+='left : 8px;';
		hs+='position : absolute;';
		hs+='top : 39px;';
		hs+='visibility : hidden;';
		hs+='width : 27px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._image_4.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._image_4.onclick=function (e) {
			player.toggleAutorotate();
			me._image_4.style.transition='none';
			me._image_4.style.visibility='hidden';
			me._image_4.ggVisible=false;
			me._image_2.style.transition='none';
			me._image_2.style.visibility=(Number(me._image_2.style.opacity)>0||!me._image_2.style.opacity)?'inherit':'hidden';
			me._image_2.ggVisible=true;
		}
		me._image_4.ggUpdatePosition=function (useTransition) {
		}
		me._container_2.appendChild(me._image_4);
		el=me._image_2=document.createElement('div');
		els=me._image_2__img=document.createElement('img');
		els.className='ggskin ggskin_image';
		hs=basePath + 'images/image_2.png';
		els.setAttribute('src',hs);
		els.ggNormalSrc=hs;
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.className='ggskin ggskin_image';
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Image 2";
		el.ggDx=1;
		el.ggDy=-13;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_image ";
		el.ggType='image';
		el.userData=el;
		hs ='';
		hs+='height : 27px;';
		hs+='left : calc(50% - ((27px + 0px) / 2) + 1px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((27px + 0px) / 2) - 13px);';
		hs+='visibility : inherit;';
		hs+='width : 27px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._image_2.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._image_2.onclick=function (e) {
			player.toggleAutorotate();
			me._image_2.style.transition='none';
			me._image_2.style.visibility='hidden';
			me._image_2.ggVisible=false;
			me._image_4.style.transition='none';
			me._image_4.style.visibility=(Number(me._image_4.style.opacity)>0||!me._image_4.style.opacity)?'inherit':'hidden';
			me._image_4.ggVisible=true;
		}
		me._image_2.ggUpdatePosition=function (useTransition) {
		}
		me._container_2.appendChild(me._image_2);
		el=me._image_3=document.createElement('div');
		els=me._image_3__img=document.createElement('img');
		els.className='ggskin ggskin_image';
		hs=basePath + 'images/image_3.png';
		els.setAttribute('src',hs);
		els.ggNormalSrc=hs;
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.className='ggskin ggskin_image';
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Image 3";
		el.ggDx=0;
		el.ggDy=24;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_image ";
		el.ggType='image';
		el.userData=el;
		hs ='';
		hs+='height : 30px;';
		hs+='left : calc(50% - ((30px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((30px + 0px) / 2) + 24px);';
		hs+='visibility : inherit;';
		hs+='width : 30px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._image_3.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._image_3.onclick=function (e) {
			player.toggleVR();
		}
		me._image_3.ggUpdatePosition=function (useTransition) {
		}
		me._container_2.appendChild(me._image_3);
		me.divSkin.appendChild(me._container_2);
		el=me._container_3=document.createElement('div');
		el.ggId="Container 3";
		el.ggDx=-12;
		el.ggDy=37;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_container ";
		el.ggType='container';
		el.userData=el;
		hs ='';
		hs+='height : 367px;';
		hs+='left : calc(50% - ((543px + 0px) / 2) - 12px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((367px + 0px) / 2) + 37px);';
		hs+='visibility : hidden;';
		hs+='width : 543px;';
		hs+='pointer-events:none;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._container_3.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._container_3.ggUpdatePosition=function (useTransition) {
		}
		el=me._cloner_1=document.createElement('div');
		el.ggNumRepeat = 3;
		el.ggNumRows = 0;
		el.ggNumCols = 0;
		el.ggCloneOffset = 0;
		el.ggCloneOffsetChanged = false;
		el.ggWidth = 114;
		el.ggHeight = 104;
		el.ggSizeChanged = false;
		el.ggUpdating = false;
		el.ggFilter = [];
		el.ggFilterHsSkinId = '';
		el.ggInstances = [];
		el.ggNumFilterPassed = 0;
		el.ggAutoPosition = function(init) {
			var currXPos = 0;
			var numElements = me._cloner_1.ggInstances.length;
			var currElement = 0;
			for (var i=0; i<me._cloner_1.ggNumCols; i++) {
				var colMaxWidth = 0;
				for (var j=0; j<me._cloner_1.ggNumRows; j++) {
					if (numElements>currElement) {
						if (!init) {
							if (me._cloner_1.childNodes[currElement].clientWidth < me._cloner_1.childNodes[currElement].scrollWidth && currElement < (numElements - 1)) {
								me._cloner_1.childNodes[currElement].style.transition = 'left ' + 1 + 's, width ' + 1 + 's';
							} else {
								me._cloner_1.childNodes[currElement].style.transition = 'left ' + 1 + 's';
							}
						}
						me._cloner_1.childNodes[currElement].style.overflow = 'hidden';
						me._cloner_1.childNodes[currElement].style['left'] = currXPos + 'px';
						me._cloner_1.childNodes[currElement].style['width'] ='0px';
						colMaxWidth = Math.max(colMaxWidth, me._cloner_1.childNodes[currElement].scrollWidth);
						me._cloner_1.childNodes[currElement].style['width'] = colMaxWidth + 'px';
					}
					currElement++;
				}
				currXPos += colMaxWidth;
			}
			setTimeout(function() {
				var p = me._cloner_1.parentElement;
				while (p != null && p !== me.divSkin) {
					if (p.ggType && p.ggType == 'scrollarea') {
						if (p.ggUpdatePosition) {
							p.ggUpdatePosition();
						}
					}
					p = p.parentElement;
				}
			}, 1000);
		}
		el.getFilteredNodes = function(tourNodes, filter) {
			var filteredNodes = [];
			for (var i = 0; i < tourNodes.length; i++) {
				var nodeId = tourNodes[i];
				var passed = true;
				var nodeData = player.getNodeUserdata(nodeId);
				if (filter.length > 0) {
					for (var j=0; j < filter.length; j++) {
						if (!nodeData['tags'] || nodeData['tags'].indexOf(filter[j].trim()) == -1) passed = false;
					}
				}
				if (passed) {
					filteredNodes.push(nodeId);
				}
			}
			return filteredNodes;
		}
		el.ggUpdate = function(filter) {
			if(me._cloner_1.ggUpdating == true) return;
			me._cloner_1.ggUpdating = true;
			var el=me._cloner_1;
			var curNumRows = 0;
			curNumRows = me._cloner_1.ggNumRepeat;
			if (curNumRows < 1) curNumRows = 1;
			if (typeof filter=='object') {
				el.ggFilter = filter;
			} else {
				filter = el.ggFilter;
			};
			if (me.ggTag) filter.push(me.ggTag);
			filter=filter.sort();
			if ((el.ggNumRows == curNumRows) && !el.ggSizeChanged && (el.ggInstances.length > 0) && (filter.length === el.ggCurrentFilter.length) && (filter.every(function(value, index) { return value === el.ggCurrentFilter[index] }) )) {
				me._cloner_1.ggUpdating = false;
				return;
			} else {
				el.ggSizeChanged = false;
				el.ggNumCols = 1;
				el.ggNumRows = curNumRows;
			var centerOffsetHor = 0;
			var centerOffsetVert = 0;
				me._cloner_1.ggCloneOffsetChanged = false;
			}
			el.ggCurrentFilter = filter;
			el.ggInstances = [];
			if (el.hasChildNodes() == true) {
				while (el.firstChild) {
					el.removeChild(el.firstChild);
				}
			}
			var tourNodes = player.getNodeIds();
			if (tourNodes.length == 0) {
				me._cloner_1.ggUpdating = false;
				return;
			}
			var row = 0;
			var column = 0;
			var currentIndex = 0;
			var keepCloning = true;
			tourNodes = me._cloner_1.getFilteredNodes(tourNodes, filter);
			me._cloner_1.ggNumFilterPassed = tourNodes.length;
			for (var i = 0; i < tourNodes.length; i++) {
				var nodeId = tourNodes[i];
				var nodeData = player.getNodeUserdata(nodeId);
				if (!keepCloning || i < me._cloner_1.ggCloneOffset) continue;
				var parameter={};
				parameter.top = centerOffsetVert + (row * me._cloner_1.ggHeight) + 'px';
				parameter.left = centerOffsetHor + (column * me._cloner_1.ggWidth) + 'px';
				parameter.width=me._cloner_1.ggWidth + 'px';
				parameter.height=me._cloner_1.ggHeight + 'px';
				parameter.index=currentIndex;
				parameter.title=nodeData['title'];
				var inst = new SkinCloner_cloner_1_Class(nodeId, me, el, parameter);
				currentIndex++;
				inst.__div.style['width'] = '0px';
				el.ggInstances.push(inst);
				el.appendChild(inst.__div);
				inst.__div.ggObj=inst;
				skin.updateSize(inst.__div);
				row++;
				if (row >= el.ggNumRows) {
					row = 0;
					column++;
					el.ggNumCols++;
				}
			}
			me._cloner_1.ggNodeCount = me._cloner_1.ggNumFilterPassed;
			me._cloner_1.ggAutoPosition(true);
			me._cloner_1.ggUpdating = false;
			player.triggerEvent('clonerchanged');
			if (me._cloner_1.parentNode && me._cloner_1.parentNode.classList.contains('ggskin_subelement') && me._cloner_1.parentNode.parentNode.classList.contains('ggskin_scrollarea')) me._cloner_1.parentNode.parentNode.ggUpdatePosition();
		}
		el.ggFilter = [];
		el.ggFilter[0] = "Pnaoramas";
		el.ggId="Cloner 1";
		el.ggDy=-112;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_cloner ";
		el.ggType='cloner';
		el.userData=el;
		hs ='';
		hs+='height : 104px;';
		hs+='left : 99px;';
		hs+='overflow : visible;';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((104px + 0px) / 2) - 112px);';
		hs+='visibility : inherit;';
		hs+='width : 114px;';
		hs+='pointer-events:none;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._cloner_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._cloner_1.ggUpdateConditionNodeChange=function () {
			var cnode=player.getCurrentNode();
			for(var i=0; i<me._cloner_1.childNodes.length; i++) {
				var child=me._cloner_1.childNodes[i];
				if (child.ggObj && child.ggObj.ggNodeId==cnode) {
			        var childOffX = child.offsetLeft;
			        var childOffY = child.offsetTop;
					var p = child.parentElement;
			        while (p != null && p!==this.divSkin) {
						if (p.ggType && p.ggType == 'scrollarea') {
							p.ggScrollIntoView(childOffX, childOffY, child.clientWidth, child.clientHeight);
						}
						childOffX += p.offsetLeft;
						childOffY += p.offsetTop;
						p = p.parentElement;
					}
				}
			}
		}
		me._cloner_1.ggUpdatePosition=function (useTransition) {
			me._cloner_1.ggUpdate();
		}
		me._container_3.appendChild(me._cloner_1);
		me.divSkin.appendChild(me._container_3);
		el=me._seekbar=document.createElement('div');
		el.ggId="seekbar";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+=cssPrefix + 'background-clip : padding-box;';
		hs+='background-clip : padding-box;';
		hs+='background : #ffffff;';
		hs+='border : 1px solid rgba(0,0,0,0.784314);';
		hs+='border-radius : 20px;';
		hs+='cursor : default;';
		hs+='height : 36px;';
		hs+='left : 212px;';
		hs+='position : absolute;';
		hs+='top : 416px;';
		hs+='visibility : hidden;';
		hs+='width : 226px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._seekbar.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._seekbar.ggUpdatePosition=function (useTransition) {
		}
		el=me._seekbar_1=document.createElement('div');
		me._seekbar_1__playhead=document.createElement('div');
		me._seekbar_1.mediaEl = null;
		me._seekbar_1.fromBufferSource = false;
		me._seekbar_1.ggMediaId = '_videopanorama';
		el.ggId="Seekbar 1";
		el.ggDx=14;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_seekbar ";
		el.ggType='seekbar';
		el.userData=el;
		hs ='';
		hs+='cursor : pointer;';
		hs+='height : 10px;';
		hs+='left : calc(50% - ((180px + 2px) / 2) + 14px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((10px + 2px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 180px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._seekbar_1.mouseTouchHandling = function(e) {
			if (e.buttons == 1 || (e.buttons == null && e.which == 1) || e.type=='touchstart') {
				if (me._seekbar_1.mediaEl != null) {
					if (e.target == me._seekbar_1) {
						let mouseX;
						if (e.type=='touchstart') {
							let rect = e.target.getBoundingClientRect();
							mouseX = e.targetTouches[0].pageX - rect.left;
						} else {
							mouseX = e.offsetX;
						}
						if (me._seekbar_1.fromBufferSource) {
							let seekpos = (mouseX / me._seekbar_1.clientWidth) * me._seekbar_1.mediaEl.bufferSoundDuration();
							me._seekbar_1.mediaEl.bufferSoundSetDragTime(seekpos);
						} else {
							let seekpos = (mouseX / me._seekbar_1.clientWidth) * me._seekbar_1.mediaEl.duration;
							if(!isNaN(seekpos)) me._seekbar_1.mediaEl.currentTime = seekpos;
						}
					}
					if (e.target == me._seekbar_1 || e.target == me._seekbar_1__playhead) {
						document.onmousemove = document.ontouchmove = function(e) {
							let mouseX = e.pageX - me._seekbar_1.getBoundingClientRect().x;
							if (me._seekbar_1.fromBufferSource) {
								let seekpos = (mouseX / me._seekbar_1.clientWidth) * me._seekbar_1.mediaEl.bufferSoundDuration();
								me._seekbar_1.mediaEl.bufferSoundSetDragTime(seekpos);
							} else {
								let seekpos = (mouseX / me._seekbar_1.clientWidth) * me._seekbar_1.mediaEl.duration;
								if(!isNaN(seekpos)) me._seekbar_1.mediaEl.currentTime = seekpos;
							}
						}
						document.onmouseup = document.ontouchend = function(e) {
							let mouseX = e.pageX - me._seekbar_1.getBoundingClientRect().x;
							if (me._seekbar_1.fromBufferSource) {
								let seekpos = (mouseX / me._seekbar_1.clientWidth) * me._seekbar_1.mediaEl.bufferSoundDuration();
								me._seekbar_1.mediaEl.bufferSoundSetTime(seekpos);
							} else {
								let seekpos = (mouseX / me._seekbar_1.clientWidth) * me._seekbar_1.mediaEl.duration;
								if(!isNaN(seekpos)) me._seekbar_1.mediaEl.currentTime = seekpos;
							}
							document.onmousemove = document.ontouchmove = null;
							document.onmouseup = document.ontouchend = null;
						}
					}
				}
			}
		}
		me._seekbar_1.onmousedown = me._seekbar_1.ontouchstart = me._seekbar_1.mouseTouchHandling;
		me._seekbar_1.ggConnectToMediaEl = function() {
			var disableSeekbar = function() {
				me._seekbar_1__playhead.style.visibility = 'hidden';
				me._seekbar_1.style.background = '#ffffff';
				me._seekbar_1.ggConnected = false;
			}
			if (me._seekbar_1.mediaEl != null) {
				if (me._seekbar_1.fromBufferSource) {
					player.removeEventListener('bufferSoundTimeupdate', me._seekbar_1.updatePlayback);
					if (me._seekbar_1.ggActivate) {
						player.removeEventListener('bufferSoundPlay', me._seekbar_1.bufferSoundActivate);
					}
					if (me._seekbar_1.ggDeactivate) {
						player.removeEventListener('bufferSoundPause', me._seekbar_1.bufferSoundDeactivate);
						player.removeEventListener('bufferSoundStop', me._seekbar_1.bufferSoundDeactivate);
						player.removeEventListener('bufferSoundEnded', me._seekbar_1.bufferSoundDeactivate);
					}
					if (me._seekbar_1.ggMediaEnded) {
						player.removeEventListener('bufferSoundEnded', me._seekbar_1.bufferSoundMediaEnded);
					}
				} else {
					me._seekbar_1.mediaEl.removeEventListener('progress', me._seekbar_1.updatePlayback);
					me._seekbar_1.mediaEl.removeEventListener('canplay', me._seekbar_1.updatePlayback);
					me._seekbar_1.mediaEl.removeEventListener('timeupdate', me._seekbar_1.updatePlayback);
					if (me._seekbar_1.ggActivate) {
						me._seekbar_1.mediaEl.removeEventListener('play', me._seekbar_1.ggActivate);
					}
					if (me._seekbar_1.ggDeactivate) {
						me._seekbar_1.mediaEl.removeEventListener('ended', me._seekbar_1.ggDeactivate);
						me._seekbar_1.mediaEl.removeEventListener('pause', me._seekbar_1.ggDeactivate);
					}
					if (me._seekbar_1.ggMediaEnded) {
						me._seekbar_1.mediaEl.removeEventListener('ended', me._seekbar_1.ggMediaEnded);
					}
				}
			}
			me._seekbar_1.mediaEl = player.getMediaObject(me._seekbar_1.ggMediaId);
			if (me._seekbar_1.mediaEl) {
				me._seekbar_1.fromBufferSource = false;
			} else {
				me._seekbar_1.mediaEl = player.getMediaBufferSourceObject('_videopanorama');
				me._seekbar_1.fromBufferSource = true;
			}
			if (me._seekbar_1.mediaEl != null) {
				me._seekbar_1__playhead.style.visibility = 'inherit';
				me._seekbar_1__playhead.style.left = '-2px';
				if (me._seekbar_1.fromBufferSource) {
					player.addListener('bufferSoundTimeupdate', me._seekbar_1.updatePlayback);
					if (me._seekbar_1.ggActivate) {
						me._seekbar_1.bufferSoundActivate = function(args) { if (args['id'] == me._seekbar_1.mediaEl.id) me._seekbar_1.ggActivate(); };
						player.addListener('bufferSoundPlay', me._seekbar_1.bufferSoundActivate);
					}
					if (me._seekbar_1.ggDeactivate) {
						me._seekbar_1.bufferSoundDeactivate = function(args) { if (args['id'] == me._seekbar_1.mediaEl.id) me._seekbar_1.ggDeactivate(); };
						player.addListener('bufferSoundPause', me._seekbar_1.bufferSoundDeactivate);
						player.addListener('bufferSoundStop', me._seekbar_1.bufferSoundDeactivate);
						player.addListener('bufferSoundEnded', me._seekbar_1.bufferSoundDeactivate);
					}
					if (me._seekbar_1.ggMediaEnded) {
						me._seekbar_1.bufferSoundMediaEnded = function(args) { if (args['id'] == me._seekbar_1.mediaEl.id) me._seekbar_1.ggMediaEnded(); };
						player.addListener('bufferSoundEnded', me._seekbar_1.bufferSoundMediaEnded);
					}
				} else {
					me._seekbar_1.mediaEl.addEventListener('progress', me._seekbar_1.updatePlayback);
					me._seekbar_1.mediaEl.addEventListener('canplay', me._seekbar_1.updatePlayback);
					me._seekbar_1.mediaEl.addEventListener('timeupdate', me._seekbar_1.updatePlayback);
					if (me._seekbar_1.ggActivate) {
						me._seekbar_1.mediaEl.addEventListener('play', me._seekbar_1.ggActivate);
					}
					if (me._seekbar_1.ggDeactivate) {
						me._seekbar_1.mediaEl.addEventListener('ended', me._seekbar_1.ggDeactivate);
						me._seekbar_1.mediaEl.addEventListener('pause', me._seekbar_1.ggDeactivate);
					}
					if (me._seekbar_1.ggMediaEnded) {
						me._seekbar_1.mediaEl.addEventListener('ended', me._seekbar_1.ggMediaEnded);
					}
				}
				me._seekbar_1.ggConnected = true;
			} else {
				disableSeekbar();
			}
			var videoEl = me.findElements(me._seekbar_1.ggMediaId);
			if (videoEl.length > 0 && !videoEl[0].hasChildNodes()) {
				disableSeekbar();
			}
		}
		me._seekbar_1.updatePlayback = function(args) {
			if (!me._seekbar_1.ggConnected) return;
			if (me._seekbar_1.mediaEl != null) {
				if (me._seekbar_1.mediaEl.readyState || (me._seekbar_1.fromBufferSource && args && args['id'] == me._seekbar_1.mediaEl.id)) {
					if (me._seekbar_1.fromBufferSource) {
						var percent = me._seekbar_1.mediaEl.bufferSoundCurrentTime() / me._seekbar_1.mediaEl.bufferSoundDuration();
					} else {
						var percent = me._seekbar_1.mediaEl.currentTime / me._seekbar_1.mediaEl.duration;
					}
					percent = Math.min(percent, 1.0);
					var playheadpos = Math.round((me._seekbar_1.clientWidth - 2 * 3 + 1) * percent);
					playheadpos += -2;
					me._seekbar_1__playhead.style.left = playheadpos.toString() + 'px';
					var offsetPercent = Math.round(100.0 * (3 / me._seekbar_1.clientWidth));
					var currPos = offsetPercent + Math.round(percent * (100 - 2 * offsetPercent));
					var gradientString ='linear-gradient(90deg, rgba(128,128,128,1) 0%, rgba(128,128,128,1) ' + currPos + '%';
					if (me._seekbar_1.fromBufferSource) {
						gradientString += ', rgba(192,192,192,1) ' + currPos +'%, rgba(192,192,192,1) 100%';
					} else {
						for (var i = 0; i < me._seekbar_1.mediaEl.buffered.length; i++) {
							var rangeStart = Math.round((me._seekbar_1.mediaEl.buffered.start(i) / me._seekbar_1.mediaEl.duration) * 100.0);
							var rangeEnd = Math.ceil((me._seekbar_1.mediaEl.buffered.end(i) / me._seekbar_1.mediaEl.duration) * 100.0);
							if (rangeEnd > currPos) {
								if (rangeStart < currPos) {
									gradientString += ', rgba(192,192,192,1) ' + currPos + '%';
								} else {
									gradientString += ', rgba(255,255,255,1) ' + currPos + '%, rgba(255,255,255,1) ' + rangeStart + '%';
									gradientString += ', rgba(192,192,192,1) ' + rangeStart + '%';
								}
									gradientString += ', rgba(192,192,192,1) ' + rangeEnd + '%';
								currPos = rangeEnd;
							}
						}
						if (currPos < 100) {
							gradientString += ', rgba(255,255,255,1) ' + currPos + '%';
						}
					}
					gradientString += ')';
					me._seekbar_1.style.background = gradientString;
				}
			}
		}
		me._seekbar_1.appendChild(me._seekbar_1__playhead);
		hs+='background : #ffffff;';
		hs+='border : 1px solid #000000;';
		hs+='border-radius : 3px;';
		var hs_playhead = 'height: 10px;';
		hs_playhead += 'width: 10px;';
		hs_playhead += 'border: 0px;';
		hs_playhead += 'position: absolute;';
		hs_playhead += 'left: -2px;';
		hs_playhead += 'top: 0px;';
		hs_playhead += 'border-radius: 5px;';
		hs_playhead += cssPrefix + 'border-radius: 5px;';
		hs_playhead += 'background-color: rgba(255,0,0,1);';
		me._seekbar_1.setAttribute('style', hs);
		me._seekbar_1__playhead.setAttribute('style', hs_playhead);
		me._seekbar_1.ggIsActive=function() {
			if (me._seekbar_1.mediaEl != null) {
				return (me._seekbar_1.mediaEl.paused == false && me._seekbar_1.mediaEl.ended == false);
			} else {
				return false;
			}
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._seekbar_1.ggUpdatePosition=function (useTransition) {
			me._seekbar_1.updatePlayback();
		}
		me._seekbar.appendChild(me._seekbar_1);
		el=me._svg_9=document.createElement('div');
		els=me._svg_9__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXBhdXNlLWNpcmNsZSIgZmlsbD0ibm9uZSIgaGVpZ2h0PSIyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz4KIDxsaW5lIHgxPSIxMCIgeDI9IjEwIiB5MT0iMTUiIHkyPSI5Ii8+CiA8bGluZSB4MT0iMTQiIHgyPSIxNCIgeTE9IjE1IiB5Mj0iOSIvPgo8L3'+
			'N2Zz4K';
		me._svg_9__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 9";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 24px;';
		hs+='left : 6px;';
		hs+='position : absolute;';
		hs+='top : 5px;';
		hs+='visibility : inherit;';
		hs+='width : 24px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_9.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_9.onclick=function (e) {
				player.pauseSound("");
			me._svg_9.style.transition='none';
			me._svg_9.style.visibility='hidden';
			me._svg_9.ggVisible=false;
			me._svg_8.style.transition='none';
			me._svg_8.style.visibility=(Number(me._svg_8.style.opacity)>0||!me._svg_8.style.opacity)?'inherit':'hidden';
			me._svg_8.ggVisible=true;
		}
		me._svg_9.ggUpdatePosition=function (useTransition) {
		}
		me._seekbar.appendChild(me._svg_9);
		el=me._svg_8=document.createElement('div');
		els=me._svg_8__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXBsYXktY2lyY2xlIiBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPgogPHBvbHlnb24gcG9pbnRzPSIxMCA4IDE2IDEyIDEwIDE2IDEwIDgiLz4KPC9zdmc+Cg==';
		me._svg_8__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 8";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 24px;';
		hs+='left : 6px;';
		hs+='position : absolute;';
		hs+='top : 5px;';
		hs+='visibility : hidden;';
		hs+='width : 24px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_8.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_8.onclick=function (e) {
			me._svg_8.style.transition='none';
			me._svg_8.style.visibility='hidden';
			me._svg_8.ggVisible=false;
			me._svg_9.style.transition='none';
			me._svg_9.style.visibility=(Number(me._svg_9.style.opacity)>0||!me._svg_9.style.opacity)?'inherit':'hidden';
			me._svg_9.ggVisible=true;
				player.playSound("_videopanorama","0");
		}
		me._svg_8.ggUpdatePosition=function (useTransition) {
		}
		me._seekbar.appendChild(me._svg_8);
		me.divSkin.appendChild(me._seekbar);
		player.addListener('changenode', function(event) {
			me._cloner_1.ggUpdateConditionNodeChange();
			me._seekbar_1.ggConnectToMediaEl();
		});
		player.addListener('viewerinit', function(event) {
			me._cloner_1.ggUpdate();
		});
	};
	function SkinCloner_cloner_1_Class(nodeId, parentScope, ggParent, parameter) {
		var me=this;
		var hs='';
		me.parentScope=parentScope;
		me.ggParent=ggParent;
		me.findElements=skin.findElements;
		me.ggIndex=parameter.index;
		me.ggNodeId=nodeId;
		me.ggTitle=parameter.title;
		me.ggUserdata=skin.player.getNodeUserdata(me.ggNodeId);
		me.ggUserdata.nodeid=me.ggNodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
			me.__div=document.createElement('div');
			me.__div.setAttribute('style','visibility: inherit; overflow: visible;');
			me.__div.style.position='absolute';
			me.__div.style.left=parameter.left;
			me.__div.style.top=parameter.top;
			me.__div.style.width='';
			me.__div.style.height='';
			me.__div.style.width=parameter.width;
			me.__div.style.height=parameter.height;
			me.__div.ggIsActive = function() {
				return player.getCurrentNode()==me.ggNodeId;
			}
			me.__div.ggElementNodeId=function() {
				return me.ggNodeId;
			}
	};
	function SkinHotspotClass_ht_node1__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_node1.visible = (v>0 && me._ht_node1.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_node-1';
		el.userData.x = 0.81;
		el.userData.y = 0.12;
		el.translateZ(0.000);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.000;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 0;
		el.userData.renderOrder = 0;
		el.userData.isVisible = function() {
			let vis = me._ht_node1.visible
			let parentEl = me._ht_node1.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node1.userData.opacity = v;
			v = v * me._ht_node1.userData.parentOpacity;
			if (me._ht_node1.userData.setOpacityInternal) me._ht_node1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node1.children.length; i++) {
				let child = me._ht_node1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node1.userData.parentOpacity = v;
			v = v * me._ht_node1.userData.opacity
			if (me._ht_node1.userData.setOpacityInternal) me._ht_node1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node1.children.length; i++) {
				let child = me._ht_node1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node1 = el;
		el.userData.ggId="ht_node-1";
		me._ht_node1.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_node1.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node1.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node1.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_node1']=true;
			me._rectangle_1.logicBlock_alpha();
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node1.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_node1']=false;
			me._rectangle_1.logicBlock_alpha();
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_node1.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._lottie_1.visible = (v>0 && me._lottie_1.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0.095);
		el.translateY(0.02);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 29;
		el.userData.height = 32;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Lottie 1';
		el.userData.x = 0.095;
		el.userData.y = 0.02;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._lottie_1.material) me._lottie_1.material.opacity = v;
			me._lottie_1.visible = (v>0 && me._lottie_1.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._lottie_1.visible
			let parentEl = me._lottie_1.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._lottie_1.userData.opacity = v;
			v = v * me._lottie_1.userData.parentOpacity;
			if (me._lottie_1.userData.setOpacityInternal) me._lottie_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_1.children.length; i++) {
				let child = me._lottie_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._lottie_1.userData.parentOpacity = v;
			v = v * me._lottie_1.userData.opacity
			if (me._lottie_1.userData.setOpacityInternal) me._lottie_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_1.children.length; i++) {
				let child = me._lottie_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._lottie_1 = el;
		el.userData.ggId="Lottie 1";
		me._lottie_1.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_1.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node1.add(me._lottie_1);
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._lottie_4.visible = (v>0 && me._lottie_4.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0.055);
		el.translateY(0.005);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 59;
		el.userData.height = 59;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Lottie 4';
		el.userData.x = 0.055;
		el.userData.y = 0.005;
		el.translateZ(0.060);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.060;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.setOpacityInternal = function(v) {
			if (me._lottie_4.material) me._lottie_4.material.opacity = v;
			me._lottie_4.visible = (v>0 && me._lottie_4.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._lottie_4.visible
			let parentEl = me._lottie_4.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._lottie_4.userData.opacity = v;
			v = v * me._lottie_4.userData.parentOpacity;
			if (me._lottie_4.userData.setOpacityInternal) me._lottie_4.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_4.children.length; i++) {
				let child = me._lottie_4.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._lottie_4.userData.parentOpacity = v;
			v = v * me._lottie_4.userData.opacity
			if (me._lottie_4.userData.setOpacityInternal) me._lottie_4.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_4.children.length; i++) {
				let child = me._lottie_4.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._lottie_4 = el;
		el.userData.ggId="Lottie 4";
		me._lottie_4.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_4.userData.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
		}
		me._lottie_4.userData.hasOwnClickAction = true;
		me._lottie_4.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node1.add(me._lottie_4);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#c2c2c2'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'Rectangle 1_material';
			el.material = material;
		el.translateX(0.045);
		el.translateY(0.7);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 101;
		el.userData.height = 68;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Rectangle 1';
		el.userData.x = 0.045;
		el.userData.y = 0.7;
		el.translateZ(0.090);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.090;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._rectangle_1.visible
			let parentEl = me._rectangle_1.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._rectangle_1.userData.opacity = v;
			v = v * me._rectangle_1.userData.parentOpacity;
			if (me._rectangle_1.userData.setOpacityInternal) me._rectangle_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._rectangle_1.children.length; i++) {
				let child = me._rectangle_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._rectangle_1.userData.parentOpacity = v;
			v = v * me._rectangle_1.userData.opacity
			if (me._rectangle_1.userData.setOpacityInternal) me._rectangle_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._rectangle_1.children.length; i++) {
				let child = me._rectangle_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._rectangle_1 = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 4;
		el.userData.borderWidth.default.right = 4;
		el.userData.borderWidth.default.bottom = 4;
		el.userData.borderWidth.default.left = 4;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 5;
		el.userData.borderRadius.default.topRight = 5;
		el.userData.borderRadius.default.bottomRight = 5;
		el.userData.borderRadius.default.bottomLeft = 5;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._rectangle_1;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._rectangle_1);
			if (skin.rectHasRoundedCorners(me._rectangle_1)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._rectangle_1.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._rectangle_1.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._rectangle_1.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._rectangle_1.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'Rectangle 1_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'Rectangle 1_geometry';
			}
			el.geometry = geometry;
			el.userData.borderRadiusInnerShape = {};
		let bWidthLeft = me._rectangle_1.userData.borderWidth.left / 100.0;
		let bWidthTop = me._rectangle_1.userData.borderWidth.top / 100.0;
		let bWidthRight = me._rectangle_1.userData.borderWidth.right / 100.0;
		let bWidthBottom = me._rectangle_1.userData.borderWidth.bottom / 100.0;
		let maxRad = skin.rectMaxRadius(me._rectangle_1);
		let bRadiusTL = Math.min(me._rectangle_1.userData.borderRadius.topLeft / 100.0, maxRad / 100.0);
		let bRadiusTR = Math.min(me._rectangle_1.userData.borderRadius.topRight / 100.0, maxRad / 100.0);
		let bRadiusBR = Math.min(me._rectangle_1.userData.borderRadius.bottomRight / 100.0, maxRad / 100.0);
		let bRadiusBL = Math.min(me._rectangle_1.userData.borderRadius.bottomLeft / 100.0, maxRad / 100.0);
		borderShape = new THREE.Shape();
		borderShape.moveTo((-width / 2.0) - bWidthLeft + bRadiusTL, (height / 2.0) + bWidthTop);
		borderShape.lineTo((width / 2.0) + bWidthRight - bRadiusTR, (height / 2.0) + bWidthTop);
		if (bRadiusTR > 0) {
			borderShape.arc(0, -bRadiusTR, bRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		borderShape.lineTo((width / 2.0) + bWidthRight, (-height / 2.0) - bWidthBottom + bRadiusBR);
		if (bRadiusBR > 0) {
			borderShape.arc(-bRadiusBR, 0, bRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft + bRadiusBL, (-height / 2.0) - bWidthBottom);
		if (bRadiusBL > 0) {
			borderShape.arc(0, bRadiusBL, bRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft, (height / 2.0) + bWidthTop - bRadiusTL);
		if (bRadiusTL > 0) {
			borderShape.arc(bRadiusTL, 0, bRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		innerShape = new THREE.Path();
		if (skin.rectHasRoundedCorners(me._rectangle_1)) {
			let borderRadiusTL = bRadiusTL - ((bWidthTop + bWidthLeft) / 2.0);
			let borderRadiusTR = bRadiusTR - ((bWidthTop + bWidthRight) / 2.0);
			let borderRadiusBR = bRadiusBR - ((bWidthBottom + bWidthRight) / 2.0);
			let borderRadiusBL = bRadiusBL - ((bWidthBottom + bWidthLeft) / 2.0);
		innerShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		innerShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		innerShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		innerShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		innerShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		innerShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		innerShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		innerShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		innerShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		} else {
			innerShape.moveTo((-width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (-height / 2.0));
			innerShape.lineTo((-width / 2.0), (-height / 2.0));
		}
		borderShape.holes.push(innerShape);
		borderGeometry = new THREE.ShapeGeometry(borderShape);
		borderGeometry.name = 'Rectangle 1_subElement_borderGeometry';
		borderMaterial = new THREE.MeshBasicMaterial( {color: player.getTHREESkinColor('#fdfdfd'), side: THREE.DoubleSide, transparent: (player.get3dModelType() != 2 || true) } );
		borderMaterial.name = 'Rectangle 1_subElement_borderMaterial';
		me._rectangle_1.userData.border = new THREE.Mesh( borderGeometry, borderMaterial );
		me._rectangle_1.userData.border.name = 'Rectangle 1_subElement_borderMesh';
		me._rectangle_1.add(me._rectangle_1.userData.border);
		}
		me._rectangle_1.userData.backgroundColorAlpha = 1;
		me._rectangle_1.userData.borderColorAlpha = 1;
		me._rectangle_1.userData.setOpacityInternal = function(v) {
			me._rectangle_1.material.opacity = v * me._rectangle_1.userData.backgroundColorAlpha;
			me._rectangle_1.userData.border.material.opacity = v * me._rectangle_1.userData.borderColorAlpha;
			if (me._rectangle_1.userData.ggSubElement) {
				me._rectangle_1.userData.ggSubElement.material.opacity = v
				me._rectangle_1.userData.ggSubElement.visible = (v>0 && me._rectangle_1.userData.visible);
			}
			me._rectangle_1.visible = (v>0 && me._rectangle_1.userData.visible);
		}
		me._rectangle_1.userData.setBackgroundColor = function(v) {
			me._rectangle_1.material.color = v;
		}
		me._rectangle_1.userData.setBackgroundColorAlpha = function(v) {
			me._rectangle_1.userData.backgroundColorAlpha = v;
			me._rectangle_1.userData.setOpacity(me._rectangle_1.userData.opacity);
		}
		me._rectangle_1.userData.setBorderColor = function(v) {
			me._rectangle_1.userData.border.material.color = v;
		}
		me._rectangle_1.userData.setBorderColorAlpha = function(v) {
			me._rectangle_1.userData.borderColorAlpha = v;
			me._rectangle_1.userData.setOpacity(me._rectangle_1.userData.opacity);
		}
		el.userData.createGeometry(4, 4, 4, 4, 5, 5, 5, 5);
		el.userData.ggId="Rectangle 1";
		me._rectangle_1.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._rectangle_1.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_node1'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._rectangle_1.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._rectangle_1.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._rectangle_1.ggCurrentLogicStateAlpha == 0) {
					me._rectangle_1.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._rectangle_1.userData.transitions.length; i++) {
						if (me._rectangle_1.userData.transitions[i].property == 'alpha') {
							clearInterval(me._rectangle_1.userData.transitions[i].interval);
							me._rectangle_1.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._rectangle_1.material ? me._rectangle_1.material.opacity : me._rectangle_1.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._rectangle_1.userData.setOpacity(transition_alpha.startAlpha + (me._rectangle_1.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._rectangle_1.userData.transitions.splice(me._rectangle_1.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._rectangle_1.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._rectangle_1.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._rectangle_1.userData.transitions.length; i++) {
						if (me._rectangle_1.userData.transitions[i].property == 'alpha') {
							clearInterval(me._rectangle_1.userData.transitions[i].interval);
							me._rectangle_1.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._rectangle_1.material ? me._rectangle_1.material.opacity : me._rectangle_1.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._rectangle_1.userData.setOpacity(transition_alpha.startAlpha + (me._rectangle_1.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._rectangle_1.userData.transitions.splice(me._rectangle_1.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._rectangle_1.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._rectangle_1.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
		el.translateX(0);
		el.translateY(0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 92;
		el.userData.height = 59;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'NodeImage 1';
		el.userData.x = 0;
		el.userData.y = 0.01;
		el.translateZ(0.120);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.120;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.setOpacityInternal = function(v) {
			if (me._nodeimage_1.material) me._nodeimage_1.material.opacity = v;
			me._nodeimage_1.visible = (v>0 && me._nodeimage_1.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._nodeimage_1.visible
			let parentEl = me._nodeimage_1.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._nodeimage_1.userData.opacity = v;
			v = v * me._nodeimage_1.userData.parentOpacity;
			if (me._nodeimage_1.userData.setOpacityInternal) me._nodeimage_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._nodeimage_1.children.length; i++) {
				let child = me._nodeimage_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._nodeimage_1.userData.parentOpacity = v;
			v = v * me._nodeimage_1.userData.opacity
			if (me._nodeimage_1.userData.setOpacityInternal) me._nodeimage_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._nodeimage_1.children.length; i++) {
				let child = me._nodeimage_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._nodeimage_1 = el;
		loader = new THREE.TextureLoader();
		el.userData.ggNodeId=nodeId;
		texture = loader.load(basePath + 'images/nodeimage_1_' + nodeId + '.png');
		texture.colorSpace = player.getTextureColorSpace();
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'NodeImage 1_material';
		el.material = material;
		el.userData.createGeometry = function(brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._nodeimage_1;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			let minDim = Math.min(el.userData.width, el.userData.height) / 2;
			el.userData.borderRadiusInnerShape.topLeft = Math.min(brTopLeft, minDim);
			el.userData.borderRadiusInnerShape.topRight = Math.min(brTopRight, minDim);
			el.userData.borderRadiusInnerShape.bottomRight = Math.min(brBottomRight, minDim);
			el.userData.borderRadiusInnerShape.bottomLeft = Math.min(brBottomLeft, minDim);
		geometry = new THREE.PlaneGeometry(me._nodeimage_1.userData.width / 100.0, me._nodeimage_1.userData.height / 100.0, 5, 5 );
		geometry.name = 'NodeImage 1_geometry';
		el.geometry = geometry;
		}
		el.userData.createGeometry(0, 0, 0, 0);
		el.userData.ggId="NodeImage 1";
		me._nodeimage_1.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.userData.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			return this.userData.ggNodeId;
		}
		me._nodeimage_1.userData.ggUpdatePosition=function (useTransition) {
		}
		me._rectangle_1.add(me._nodeimage_1);
		me._ht_node1.add(me._rectangle_1);
		me._ht_node1.userData.setOpacity(1.00);
		me.elementMouseOver['ht_node1']=false;
		me._rectangle_1.userData.setOpacity(0.00);
		me._rectangle_1.logicBlock_alpha();
		me._nodeimage_1.userData.setOpacity(1.00);
			me.__obj = me._ht_node1;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_node1(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggNodeId=nodeId;
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el=me._ht_node1=document.createElement('div');
		el.ggId="ht_node-1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_hotspot ";
		el.ggType='hotspot';
		el.userData=el;
		hs ='';
		hs+='height : 0px;';
		hs+='left : 401px;';
		hs+='position : absolute;';
		hs+='top : 228px;';
		hs+='visibility : inherit;';
		hs+='width : 0px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._ht_node1.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.ggElementNodeId)) {
					return this.parentNode.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_node1.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node1.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node1.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_node1']=true;
			me._rectangle_1.logicBlock_alpha();
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node1.onmouseleave=function (e) {
			me.elementMouseOver['ht_node1']=false;
			me._rectangle_1.logicBlock_alpha();
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_node1.ggUpdatePosition=function (useTransition) {
		}
		el=me._lottie_1=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_1.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggLottie.setSpeed(1.2);
		el.ggId="Lottie 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 32px;';
		hs+='left : -5px;';
		hs+='position : absolute;';
		hs+='top : -18px;';
		hs+='visibility : inherit;';
		hs+='width : 29px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_1.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node1.appendChild(me._lottie_1);
		el=me._lottie_4=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_4.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggLottie.setSpeed(2.3);
		el.ggLottie.setDirection(-1);
		el.ggLottie.addEventListener('data_ready', function() {
			me._lottie_4.ggLottie.goToAndStop(me._lottie_4.ggLottie.getDuration(true), true);
		});
		el.ggId="Lottie 4";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 59px;';
		hs+='left : -24px;';
		hs+='position : absolute;';
		hs+='top : -30px;';
		hs+='visibility : inherit;';
		hs+='width : 59px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_4.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_4.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
		}
		me._lottie_4.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node1.appendChild(me._lottie_4);
		el=me._rectangle_1=document.createElement('div');
		el.ggId="Rectangle 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='background : #c2c2c2;';
		hs+='border : 4px solid #fdfdfd;';
		hs+='border-radius : 5px;';
		hs+='height : 68px;';
		hs+='left : -50px;';
		hs+='opacity : 0;';
		hs+='position : absolute;';
		hs+='top : -108px;';
		hs+='visibility : hidden;';
		hs+='width : 101px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._rectangle_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._rectangle_1.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_node1'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._rectangle_1.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._rectangle_1.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				me._rectangle_1.style.transition='opacity 300ms ease 0ms';
				if (me._rectangle_1.ggCurrentLogicStateAlpha == 0) {
					me._rectangle_1.style.visibility=me._rectangle_1.ggVisible?'inherit':'hidden';
					me._rectangle_1.style.opacity=1;
				}
				else {
					setTimeout(function() { if (me._rectangle_1.style.opacity == 0.0) { me._rectangle_1.style.visibility="hidden"; } }, 305);
					me._rectangle_1.style.opacity=0;
				}
			}
		}
		me._rectangle_1.ggUpdatePosition=function (useTransition) {
		}
		el=me._nodeimage_1=document.createElement('div');
		els=me._nodeimage_1__img=document.createElement('img');
		els.className='ggskin ggskin_nodeimage';
		if (nodeId) els.setAttribute('src',basePath + "images/nodeimage_1_" + nodeId + ".png");
		el.ggNodeId=nodeId;
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.className='ggskin ggskin_nodeimage';
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="NodeImage 1";
		el.ggDx=0;
		el.ggDy=-1;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_nodeimage ";
		el.ggType='nodeimage';
		el.userData=el;
		hs ='';
		hs+='height : 59px;';
		hs+='left : calc(50% - ((92px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((59px + 0px) / 2) - 1px);';
		hs+='visibility : inherit;';
		hs+='width : 92px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._nodeimage_1.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			return this.ggNodeId;
		}
		me._nodeimage_1.ggUpdatePosition=function (useTransition) {
		}
		me._rectangle_1.appendChild(me._nodeimage_1);
		me._ht_node1.appendChild(me._rectangle_1);
		me.elementMouseOver['ht_node1']=false;
		me._rectangle_1.logicBlock_alpha();
			me.__div = me._ht_node1;
	};
	me.addSkinHotspot=function(hotspot) {
		var hsinst = null;
		{
			hotspot.skinid = 'ht_node-1';
			hsinst = new SkinHotspotClass_ht_node1(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node1')) {
				hotspotTemplates['SkinHotspotClass_ht_node1'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_node1'].push(hsinst);
		}
		return hsinst;
	}
	me.removeSkinHotspots=function() {
		hotspotTemplates = {};
	}
	player.addListener('hotspotsremoved',function() {
			me.removeSkinHotspots();
	});
	me.addSkinHotspot3d=function(hotspot) {
		var hsinst = null;
		{
			hotspot.skinid = 'ht_node-1';
			hsinst = new SkinHotspotClass_ht_node1__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node1__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_node1__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_node1__3d'].push(hsinst);
		}
		return (hsinst ? hsinst.__obj : null);
	}
	me.removeSkinHotspots=function() {
		hotspotTemplates = {};
	}
	player.addListener('hotspotsremoved',function() {
			me.removeSkinHotspots();
	});
	player.addListener('changenode', function() {
		me.ggUserdata=player.userdata;
	});
	me.skinTimerEvent=function() {
		if (player.isInVR()) return;
		me.ggCurrentTime=new Date().getTime();
		for (const id in hotspotTemplates) {
			const tmpl=hotspotTemplates[id];
			tmpl.forEach(function(hotspot) {
				if (hotspot.hotspotTimerEvent) {
					hotspot.hotspotTimerEvent();
				}
			});
		};
	};
	player.addListener('timer', me.skinTimerEvent);
	me.addSkin();
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode('.ggskin { font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 14px; line-height: normal; box-sizing: content-box; } .ggmarkdown p,.ggmarkdown h1,.ggmarkdown h2,.ggmarkdown h3,.ggmarkdown h4 { margin-top: 0px } .ggmarkdown { white-space:normal }'));
	document.head.appendChild(style);
	document.addEventListener('keyup', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			let activeElement = document.activeElement;
			if (activeElement.classList.contains('ggskin') && activeElement.onclick) activeElement.onclick();
		}
	});
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			let activeElement = document.activeElement;
			if (activeElement.classList.contains('ggskin') && activeElement.onmousedown) activeElement.onmousedown();
		}
	});
	document.addEventListener('keyup', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			let activeElement = document.activeElement;
			if (activeElement.classList.contains('ggskin') && activeElement.onmouseup) activeElement.onmouseup();
		}
	});
	me.skinTimerEvent();
};