(function (window){
	//判断正则
	var rHTML = /^</;
	var rnative = /\{\s*\[native/;
	var rselector = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\w+)|(\*))$/;
	//判断条件
	var isHTML = function(html){
		if(rHTML.test(html)){
			return true;
		}
		return false ;
	};

	var isLENobj = function (arg){
		if(arg.length){
			return true;
		}
		return false ; 
	};
	var isString = function(str){
		if(typeof str == 'string'){
			return true;
		}
		return false;
	};

	// 浏览器能力检查
	//判断浏览器是否自带原生的方法

	var support = {};
	support.getElementsByClassName = (function(){
		if(rnative.test(document.getElementsByClassName+'') > -1){
			return true
		}
		return false ; 
	})();
	support.trim = (function(){
		if(rnative.test(' 132 '.trim) > -1){
			return true
		}
		return false ; 
	})();
	support.indexOf = (function(){
		if(rnative.test([].indexOf) > -1){
			return true
		}
		return false ; 
	})();
	support.forEach = (function(){
		if(rnative.test([].forEach) > -1){
			return true
		}
		return false ; 
	})();
	support.querySelectorAll = (function(){
		if(rnative.test(document.querySelectorAll) > -1){
			return true
		}
		return false ; 
	})();





	//通用方法
	var push = [].push;
	var slide = [].slide; // 截取并返回新数组，对原数组无改动。 slide(n) ==>[n,length-1]  slide(n,m)  ==>[n,m)  
	// commonFn  自定义的存在兼容性问题的方法
	function forEach(arr , fn){
		if(support.forEach){
			[].forEach.call(arr,function(v,i){
				fn(v,i);
			});
		} else {
			for (var i = 0; i < arr.length; i++) {
				fn(arr[i],i);
			}
		}
	};

	function indexOf(arr , fillter ,startPoint) {
		startPoint = startPoint || 0 ;
		if(support.indexOf){
			return arr.indexOf(fillter , startPoint);
		} else {
			for(var i = startPoint ; i<arr.length ; i++){
				if(arr[i] === fillter){
					return i;
				} 
			}
			return -1;
		}
	};

	function trim(str){
		if(support.trim){
			return str.trim();
		} else {
			while(true){
				var flag = 0;
				var results = '';
				if(str.charAt(0) ===' '){
					results = str.slice(1);
				}else{
					flag ++ ; 
					results = str ; 
				}
				if(results.charAt(results.length -1) ===' ' ){
					str = results.slice(0 , -1);
				}else{
					flag ++ ;  
					str = results;
				}
				if(flag == 2){
					break;
				}
			}
			return str;
		}
	};
	function getStyle(dom , style){
		if(dom.currentStyle){
			return dom.currentStyle(style);
		} else {
			return window.getComputedStyle(dom)[style];
		}
	}
	

	//主体
	function LEN (html){
		return new LEN.fn.init(html);
	}
	LEN.fn = LEN.prototype = {
		constructor:LEN,
		selector:'',
		type:'LEN',
		length:0,
		init:function(html){
			if(html == null || html ==''){
				return;
			}
			if(typeof html == 'function'){
				if(typeof window.onload == 'function'){
					var oldFunc = window.onload ;
					window.onload = function(){
						oldFunc();
						html();
					};
				} else {
					window.onload = html;
				}
				return ;
			}
			if(typeof html == 'string'){
				if(isHTML(html)){//$('<div>123</div>').appendTo(document.body);
					push.apply(this , LEN.fn.parseHTML(html));
				}else{//是选择器
					this.select =  html;
					return push.apply(this , LEN.select(html));

				}
			}
			if(html && html.type == 'LEN'){
				push.apply(this , html);
				this.selector = html.selector;
			}
			if(html.nodeType){ //html是dom 对象
				push.call(this , html);
			}
		},
		toArray:function (LENobj){
			var res = [];
			if(isLENobj(LENobj) ){
				for (var i = 0; i < LENobj.length; i++) {
					res.push(LENobj[i]);
				}
			}			
			return res ; 
		},
		get:function(index){
			if(index === undefined){
				return this.toArray();
			}
			return this[index];
		},
		eq:function (index){
			if(index === undefined){
				return 
			}
			if(index>=0){
				return this[index];
			}
			if(index < 0){
				return this[this.length + index];
			}
		},
		each:function(callback){
			forEach(this,function(v,i){
				callback(v,i);
			});
		},
		map:function(){},
		prependChild:function (parent , element){
			parent.insertBefore(element ,parent.firstChild);
		},
		unique:function(arr){  // 数组去重
			var res = [];
			forEach(arr,function(v,i){
				if(indexOf(res , v) == -1){
					res.push(v);
				}
			});
			return res ;
		}
	};

	//将init的原型关联至LEN的原型上，使其可调用LEN原型中的方法
	LEN.fn.init.prototype = LEN.fn;
	LEN.extend = LEN.fn.extend = function(obj){
		for(var k in obj){
			this[k] = obj[k];
		}
	};


	//工具
	LEN.extend({
		isString : isString
	});

//选择器
var select = (function(){

	var myClassName = function (selector , node , results){
		results = results || [] ; 
		node = node || document;
		if(/*support.getElementsByClassName*/ false){
			return node.getElementsByClassName(selector);
		} else {
			var tags = node.getElementsByTagName('*');
			for(var i = 0 ; i<tags.length ; i++){
				if(indexOf(' '+tags[i].className+' ' , ' '+selector+' ' ) >-1 ){
					results.push(tags[i]);
				}
			}
			return results;
		}
	};


	//基础选择器  #  .  ()  *
	var baseSelector = function(selector , node ){
		node = node || document;
		var m = rselector.exec(trim(selector));
		//		var rselector = /^(?:\#([\w\-]+)|\.([\w\-]+)|(\w+)|(\*))$/;
		var res = [];
		if(m){
			if(m[1]){
				res.push(document.getElementById(m[1]));
			}else if (m[2]){
				res.push.apply(res,myClassName(m[2] , node)) ;
			}else if (m[3] || m[4]){
				res.push.apply(res,node.getElementsByTagName(selector));
			}
		}
		return res ; 
	};

	/*//后代选择器1.0
	var selectChild = function(selector , node){
		var tempArr1 = [] ;
		var tempArr2 = [] ;
		var tempArr3 = [] ;
		var  res = [] ;
		node = node || document;
		tempArr2 = [node];
		selector = trim(selector);
		tempArr1 = selector.split(' ');


		// push.apply(tempArr2,mixSelector(tempArr1[0] , node));


		for(var i = 0 ; i<tempArr2.length; i++){
			push.apply(res,mixSelector(tempArr1[0],tempArr2[i]));
		}
		tempArr2 = res ; 
		res = [];

		for(var i = 0 ; i<tempArr2.length; i++){
			push.apply(res,mixSelector(tempArr1[1],tempArr2[i]))
		}
		tempArr2 = res ; 
		res = [];
		
		for(var i = 0 ; i < tempArr2.length ; i++){
			push.apply(res,mixSelector(tempArr1[2],tempArr2[i]));
		}
		tempArr2 = res ; 
		res = [];
	};*/
	//后代选择器2.0
	var selectChild = function(selector , node){
		var tempArr1 = [] ;
		var tempArr2 = [] ;
		var  res = [] ;
		node = node || document;
		tempArr2 = [node];
		selector = trim(selector);
		tempArr1 = selector.split(' ');
		for(var j = 0 ; j<tempArr1.length ; j++){
			for(var i = 0 ; i<tempArr2.length; i++){
				push.apply(res,baseSelector(tempArr1[j],tempArr2[i]));
			}
			tempArr2 = res ; 
			res = [];
		}
		return tempArr2;
	};

	//并集选择器 1.0
	// var mixSelector = function (selector , node ){
	// 	node = node || document; 
	// 	var arr  = selector.split(',');
	// 	var m = [];
	// 	var res = [];
	// 	forEach(arr,function(v,i){
	// 		m[i] = rselector.exec(trim(v));
	// 		if(m[i]){
	// 			if(m[i][1]){
	// 				res.push(document.getElementById(m[i][1])) ;
	// 			}else if (m[i][2]){
	// 				res.push.apply(res,myClassName(m[i][2] , node)) ;
	// 			}else if (m[i][3] || m[i][4]){
	// 				res.push.apply(res,node.getElementsByTagName(selector)) ;
	// 			}
	// 		}
	// 	});
	// 	return res;
	// };

	//并集选择器2.0
	var mixSelector = function (selector , node ){
		node = node || document; 
		var arr  = selector.split(','); //分割
		var str = '';
		var res = [];
		forEach(arr,function(v,i){  // 分别调用子代选择器
			res = res.concat(selectChild(v));
		});
		return LEN.fn.unique(res); // 去除结果中的重复项
	};
	return mixSelector ;
})();			
LEN.select = select ;  //扩展选项




//DOM操作
LEN.fn.extend({
	parseHTML:(function(){
		var div = document.createElement('div');
		function parseHTML (html){
			var res = [];
			div.innerHTML = html;
			for (var i = 0; i < div.childNodes.length; i++) {
				res.push(div.childNodes[i]);
			}
			div.innerHTML = '';
			return res;
		}
		return parseHTML;
	})(),
	appendTo:function(dom){
		var LENobj = this.constructor(dom);
		var newObj = LEN(); //函数内的this仅指向单一对象，若需要为多个dom添加子元素，需要对this进行克隆，为满足链式编程，需改变return的内容，包含所有克隆出来的对象
		this.each(function(v,i){
			for(var j = 0 ; j < LENobj.length ; j++){ //若appendTo后面的LEN对象包含多个对象，则需要为每一个内部对象都添加对应的HTML
				var temp =  j == LENobj.length-1 ? v : v.cloneNode(true);  //判断是否是循环的最后一次，若是最后一次则不用克隆，使用最开始的元素即可
				push.call(newObj , temp);
				LENobj[j].appendChild(temp);
			}
		});
		return newObj;
	},
	append:function(selector){//LEN(".c").append("<div>div</div></p>p</p>")
		this.constructor(selector).appendTo(this);
		return this;
	},
	prependTo:function(dom){
		var LENobj = this.constructor(dom);
		var newObj = this.constructor(); //函数内的this仅指向单一对象，若需要为多个dom添加子元素，需要对this进行克隆，为满足链式编程，需改变return的内容，包含所有克隆出来的对象
		this.each(function(v,i){
			for(var j = 0 ; j < LENobj.length ; j++){ //若appendTo后面的LEN对象包含多个对象，则需要为每一个内部对象都添加对应的HTML
				var temp =  j == LENobj.length-1 ? v : v.cloneNode(true);  //判断是否是循环的最后一次，若是最后一次则不用克隆，使用最开始的元素即可
				push.call(newObj , temp);
				LEN.fn.prependChild( LENobj[j],temp);
			}
		});
		return newObj;
	},
	prepend:function(selector){
		this.constructor(selector).prependTo(this);
		return this ; 
	}
});


	//事件


	
	//事件  1.0
	// LEN.fn.extend({
	// 	click:function(fn){
	// 		this.each(function(v,i){
	// 			v.addEventListener('click',function(e){
	// 				fn(e);
	// 			}) 
	// 		});
	// 	}
	// });
	// var div = LEN('#dv');
	// div.click(function(e){
	// 	console.log(e);
	// });

	//事件  2.0

	// LEN.fn.extend({
	// 	click:function(fn){
	// 		var oldEvent = function (){};
	// 		this.each(function(v,i){
	// 			if(v.onclick){
	// 				oldEvent = v.onclick;
	// 			}
	// 			v.onclick = function (e){
	// 				oldEvent(e);
	// 				fn(e);
	// 			};
	// 		});
	// 	}
	// });

	//on 3.0  //如何移除特定事件的指定函数？？？
	LEN.fn.extend({
		on:function( type , fn ){
			var oldEvent = function (){};
			this.each(function(v,i){
				if(v['on'+type]){
					oldEvent = v['on'+type];
				}
				v['on'+type] = function (e){
					oldEvent(e);
					fn(e);
				};
			});
			return this ;
		},
		off:function(type){
			this.each(function(v,i){
				if(v['on'+type]){
					v['on'+type] = null;
				}
			});
			return this ;
		},
		hover:function(fn1,fn2){
			this.on("mouseover" , fn1);
			this.on("mouseout", fn2);
			return this ;
		},

		toggle:function(){   //轮流执行，传入的各函数
			var arg = arguments ; 
			var i = 0 ;
			this.on('click' , function(){
				arg[i]();
				i++;
				i = i % arg.length ;
			});
			return this ;
		}
	});



//样式
	LEN.fn.extend({
		css:function(obj){
			var arg = arguments; 
			var len = arguments.length;
			var o = {};
			if(len === 1){
				if(LEN.isString(obj)){
					return this[0].style[obj] || getStyle(this[0],obj);
				}
				if(typeof obj == 'object'){
					for(var k in obj){
						this.each(function(v,i){
							v.style[k] = obj[k];
						});
					}
				}
			} else if(len === 2){
				if(LEN.isString(arg[0]) && LEN.isString(arg[1])) {
					this.each(function(v,i){
						v.style[arg[0]] = arg[1];
					});
				}
			}
			return this;
		},
		addClass: function( name ){
			// var that = this;
			this.each(function(v,i){
				var className = v.className;
				if(className){
					if(indexOf(' '+ className + ' ' , ' '+ name +' ') == -1){
						v.className += (' '+name);
					}
				} else {
					v.className = name;
				}
			});
			return this ;
		},
		removeClass:function(name){
			this.each(function(v,i){
				if(v.className){
					while(indexOf(' '+ v.className + ' ' , ' '+ name +' ') != -1){
						v.className = trim((' '+ v.className + ' ').replace(' '+ name +' ' , ''));
					}
				}
			});
			return this;
		},
		hasClass:function( name ){
			var flag = false ;
			this.each(function(v,i){
				if(indexOf(' '+ v.className + ' ' , ' '+ name +' ') != -1){
					flag = true ; 
					return;
				}
			});
			return flag ;
		},


		// removeClass:function(name){
		// 	var rclassName = new RegExp(' ' + name + ' ' , 'g');
		// 	this.each(function(v,i){
		// 		if(v.className){
		//			v.className = v.className.replace( /\s/ , '  ' );  //重点注意，单个空壳会导致连续出现的相同类名，无法全部移除.  
		// 			v.className = (' '+ v.className + ' ').replace(rclassName , ' ');
		// 		}
		// 	});
		// 	return this;
		// }

		toggleClass:function(name){
			if(this.hasClass(name)){
				this.removeClass(name);
			} else {
				this.addClass(name);
			}
		}
	});



	//属性
	LEN.fn.extend({
		attr:function( name , val){  //自定义属性
			if(val){
				if(isString(name) && isString(val)){
					this.each(function(v,i){
						v.setAttribute(name , val);
					});
					return this;
				} 
			} else {
				if(isString(name)){
					return this[0].getAttribute(name);
				}
			}
			return this ;
		},
		prop:function(name , val ){  //原生自带属性
			if(val){
				if(isString(name) && isString(val)){
					this.each(function(v,i){
						v[name] =val;
					});
					return this;
				} 
			} else {
				if(isString(name)){
					return this[0][name];
				}
			}
			return this ;
		},
		val:function(val){
			this.attr('value',val);
			return this;
		},
		html:function(html){
			this.prop('innerHTML' , html);
		},
		text:function(text){
			if(text){
				this.each(function(v){
					v.innerHTML = '';
					v.appendChild(document.createTextNode(text+''));

				});
				return this ;

			} else {
				var res = '';
				var list = [];
				this.each(function(v){
					res+=getText(v).join(' ');
				});
				return res;
			}
		
			
			function getText (node){
				for (var i = 0; i < node.childNodes.length; i++) {
					if(node.childNodes[i].nodeType == 3 ){
						list.push(node.childNodes[i].nodeValue);
					} else if(node.childNodes[i].nodeType == 1 ){
						getText(node.childNodes[i]);
					}
				}
				return list ;
			}



		}



	});










	window.LEN = LEN ;
})(window);