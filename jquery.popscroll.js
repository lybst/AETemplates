(function($) {

    $.fn.popscroll = function(options) {

		var opts = $.extend({
		            theme          : 'simple',
		            msg            : 'Your custom Text',
		            network        : 'facebook',
		            customcontent  : false,
		            customhtml	   : '',
		            position       : 'br',
		            animation  	   : '',
		            triggerpoint   : 300,
		            triggerelement : false,
		            channel 	   : 'https://www.facebook.com/envato',
		            bgcolor   	   : '#ffffff',
		            textcolor      : '#303030',
		            scrollback	   : false,
		            closecookie    : false,
		            cookiedays     : 60,
		            cookietext	   : "Don't show this again",
		            fb_hide_cover  : true,
		            fb_show_posts  : false,
		            twitter_size   : 'large',
		            hidemobile	   : true,
		            preview		   : false
		        }, options);



		function popscrollConstructor(opts, target){
			this.opts = opts;

			//Check transitions
			if (tw_supports_transitions()) {
				this.supports_transitions = true;
			}else{
				this.supports_transitions = false;
				// JavaScript Animate Fallback
				this.opts.animation = '';
			}
			
			this.target = target;
			this.ani = this.opts.position+this.opts.animation;
			this.boxtarget = ".tw_ani_handel_"+this.opts.theme;
			this.tw_asp = tw_get_animations();
			this.active = false;
			this.closed = false;

			//Check if Triggerelement is set
			if(opts.triggerelement){
				if(jQuery(opts.triggerelement).offset()){
					opts.triggerpoint = jQuery(document).height() - (jQuery(opts.triggerelement).offset().top + jQuery(opts.triggerelement).height());
				}else{
					console.log("PopscrollError: Can't find triggerlement. Write '.myclass' or '#myid' to select a vaild element");
				}
			}

			//Check cookie
	  		if(opts.closecookie){		  		
		  		if(tw_get_cookie("tw_popscroll") == "false"){
		  			this.dont_show_again_cookie = true;
		  		}else {
		  			this.dont_show_again_cookie = false;
		  		}
	  		}

	  		//Check mobile
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			    this.is_mobile = true;
			}else{
				this.is_mobile = false;
			}


			//Create Box
			this.box_setup = function(){
				tw_box_setup(opts, target);				
			}

			this.show = function(){	
				if(!this.active && !this.closed){
					//Position the Box
					jQuery( this.boxtarget ).css("left", this.tw_asp[this.ani]["ls"]);
					jQuery( this.boxtarget ).css("right", this.tw_asp[this.ani]["rs"]);	
					jQuery( this.boxtarget ).css("bottom", this.tw_asp[this.ani]["bs"]);	
					jQuery( this.boxtarget ).addClass("tw_ani_"+this.ani);

					if(this.tw_asp[this.ani]["cs"]){
						//Flip with CSS Transitions 
						jQuery( this.boxtarget ).addClass("tw_cs_start_"+this.ani);
						setTimeout(function(){ jQuery( popscroll.boxtarget ).addClass("tw_cs_trans_"+popscroll.ani); }, 10);
						setTimeout(function(){ jQuery( popscroll.boxtarget ).addClass("tw_cs_end_"+popscroll.ani); }, 10);
					}else {
						//Jquery Animate Slide
						jQuery( this.boxtarget ).animate({
							left: this.tw_asp[this.ani]["le"],
							right: this.tw_asp[this.ani]["re"],
							bottom:this.tw_asp[this.ani]["be"]
						}, 700 );
					}

					this.active = true;			
				}	
			}

			this.hide = function(){
				if(this.tw_asp[this.ani]["cs"]){
					jQuery( this.boxtarget ).removeClass("tw_cs_end_"+this.ani);
				}else{
					jQuery( this.boxtarget ).animate({
						left: this.tw_asp[this.ani]["ls"],
						right: this.tw_asp[this.ani]["rs"],
						bottom: this.tw_asp[this.ani]["bs"]
					}, 700 );	
				}

				this.active = false;	
			}
			
			this.close = function(){
				this.hide();
				this.closed = true;

			}

			this.dont_show_again = function(){
				if(!this.opts.preview){
					tw_set_cookie("tw_popscroll", "false", this.opts.cookiedays);
				}	
				
				this.close();

			}

			this.resetClasses = function(){
			       var tw_asp_arg=["bl","br","sl","sr","brs","bls","sls","srs"];
			         jQuery(tw_asp_arg).each(function( i ){
			                jQuery( ".tw_cs_start_"+this ).removeClass("tw_cs_start_"+this);
			                jQuery( ".tw_cs_trans_"+this ).removeClass("tw_cs_trans_"+this);
			                jQuery( ".tw_cs_end_"+this).removeClass("tw_cs_end_"+this);
			                jQuery( ".tw_ani_"+this).removeClass("tw_ani_"+this);
			            });
			}

			this.forceShow = function(){
				this.resetClasses();
				this.active = false;
				this.closed = false;
				this.show();
			}
			
		}

		//Create Popscroll object
		var popscroll = new popscrollConstructor(opts, this);
		//Cookie is set - dont setup 
		if (popscroll.dont_show_again_cookie && !popscroll.opts.preview){
			return popscroll;
		}

		//Is mobile and hide mobile is on - dont setup
		if(popscroll.is_mobile && popscroll.opts.hidemobile){
			return popscroll;
		}

		popscroll.box_setup();
		
		//Scroll Events 
		jQuery(window).scroll(function() { 
			if(jQuery(window).scrollTop() + jQuery(window).height() > jQuery(document).height() - popscroll.opts.triggerpoint) {
				popscroll.show();
			 }

			if (opts.scrollback && popscroll.active){
				if(jQuery(window).scrollTop() + jQuery(window).height() < jQuery(document).height() - opts.triggerpoint) {
					popscroll.hide();
				}
			}
		});

		return popscroll;

		function tw_set_cookie(cname, cvalue, exdays) {
		    var d = new Date();
		    d.setTime(d.getTime() + (exdays*24*60*60*1000));
		    var expires = "expires="+d.toUTCString();
		    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
		}		

		
		function tw_get_cookie(cname) {
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i=0; i<ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1);
		        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		    }
		    return "";
		}

		function tw_supports_transitions() {
		    var b = document.body || document.documentElement,
		        s = b.style,
		        p = 'transition';

		    if (typeof s[p] == 'string') { return true; }

		    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
		    p = p.charAt(0).toUpperCase() + p.substr(1);

		    for (var i=0; i<v.length; i++) {
		        if (typeof s[v[i] + p] == 'string') { return true; }
		    }

		    return false;
		}


		function tw_box_setup(opts,target){
			var close_img = tw_get_close_img();
			var channelsetup = tw_get_channelsetup(opts,target);
			if(opts.theme=='hbox'){
				var custompart=$('<div/>', {
				    'id':'tw_fanpageslider_hbox',
				    'class':'tw_fanpageslider_boxref tw_ani_handel_hbox'
				}).appendTo(target);

				$('<img/>', {
				    'class':'tw_fps_close tw_fps_close_btn',
				    'src':close_img
				}).on('click', function(){
	    			popscroll.close();
				}).appendTo("#tw_fanpageslider_hbox");

				if(opts.closecookie){
					$("<span/>", {
						'class': 'tw_cookie_btn',
						'text' : opts.cookietext
					}).on('click', function(){
		    			popscroll.dont_show_again();
					}).appendTo("#tw_fanpageslider_hbox");
				}

				$('<div/>', {
				    'class':'tw_fanpageslider_customtext',
				    'text': opts.msg 
				}).appendTo($("#tw_fanpageslider_hbox"));

				$("#tw_fanpageslider_hbox").append(channelsetup);
	  		}

			if(opts.theme=='ball'){
				var custompart=$('<div/>', {
				    'id':'tw_fanpageslider_ball',
				    'class':'tw_fanpageslider_boxref tw_ani_handel_ball'
				}).appendTo(target);

				$('<img/>', {
				    'class':'tw_fps_close tw_fps_close_btn',
				    'src':close_img
				}).on('click', function(){
	    			popscroll.close();
				}).appendTo("#tw_fanpageslider_ball");

				if(opts.closecookie){
					$("<span/>", {
						'class': 'tw_cookie_btn',
						'text' : opts.cookietext
					}).on('click', function(){
		    			popscroll.dont_show_again();
					}).appendTo("#tw_fanpageslider_ball");
				}

				$('<div/>', {
				    'class':'tw_fanpageslider_customtext',
				    'text': opts.msg 
				}).appendTo($("#tw_fanpageslider_ball"));

				$("#tw_fanpageslider_ball").append(channelsetup);
	  		}

			if(opts.theme=='ballcorn'){
				var custompart=$('<div/>', {
				    'id':'tw_fanpageslider_ball',
				    'class':'tw_fanpageslider_ballcorn tw_fanpageslider_boxref tw_ani_handel_ballcorn'
				}).appendTo(target);

				$('<img/>', {
				    'class':'tw_fps_close tw_fps_close_btn',
				    'src':close_img
				}).on('click', function(){
	    			popscroll.close();
				}).appendTo("#tw_fanpageslider_ball");

				if(opts.closecookie){
					$("<span/>", {
						'class': 'tw_cookie_btn',
						'text' : opts.cookietext
					}).on('click', function(){
		    			popscroll.dont_show_again();
					}).appendTo("#tw_fanpageslider_ball");
				}

				$('<div/>', {
				    'class':'tw_fanpageslider_customtext',
				    'text': opts.msg 
				}).appendTo($("#tw_fanpageslider_ball"));

				$("#tw_fanpageslider_ball").append(channelsetup);
	  		}


			if(opts.theme=='floatbar'){
				$('<div/>', {
				    'id':'tw_fanpageslider_floatbar',
				    'class':'tw_ani_handel_floatbar'
				}).appendTo(target);

				var custompart=$('<div/>', {
				    'class':'tw_csfps_floatbox_top tw_fanpageslider_boxref'
				}).appendTo("#tw_fanpageslider_floatbar");

				$('<img/>', {
				    'class':'tw_fps_close tw_fps_close_btn',
				    'src':close_img
				}).on('click', function(){
	    			popscroll.close();
				}).appendTo(".tw_csfps_floatbox_top");

				if(opts.closecookie){
					$("<span/>", {
						'class': 'tw_cookie_btn',
						'text' : opts.cookietext
					}).on('click', function(){
		    			popscroll.dont_show_again();
					}).appendTo(".tw_csfps_floatbox_top");
				}

				$('<div/>', {
				    'class':'tw_fanpageslider_customtext',
				    'text': opts.msg 
				}).appendTo($(".tw_csfps_floatbox_top"));

				$('<div/>', {
				    'class':'tw_csfps_floatbox_bottom'
				}).appendTo("#tw_fanpageslider_floatbar");


				$(".tw_csfps_floatbox_bottom").append(channelsetup);

			} 

			if(opts.theme=='simple'){
				var custompart=$('<div/>', {
				    'id':'tw_fanpageslider_box',
				    'class':'tw_fanpageslider_boxref tw_ani_handel_simple',
				    'style': 'border-radius:5px',
				}).appendTo(target);

				$('<div/>', {
					'id':'tw_fanpageslider_box_head'
				}).appendTo("#tw_fanpageslider_box");

				$('<img/>', {
				    'class':'tw_fps_close tw_fps_close_btn',
				    'src':close_img
				}).on('click', function(){
	    			popscroll.close();
				}).appendTo("#tw_fanpageslider_box_head");

				if(opts.closecookie){
					$("<span/>", {
						'class': 'tw_cookie_btn',
						'text' : opts.cookietext
					}).on('click', function(){
		    			popscroll.dont_show_again();
					}).appendTo("#tw_fanpageslider_box_head");
				}

				$('<div/>', {
					'id':'tw_fanpageslider_box_mid'
				}).appendTo("#tw_fanpageslider_box");

				$('<div/>', {
				    'class':'tw_fanpageslider_customtext',
				    'text': opts.msg 
				}).appendTo($("#tw_fanpageslider_box_mid"));

				$("#tw_fanpageslider_box_mid").append(channelsetup);

			}

			if(opts.theme=='sline'){
				var custom_color=$('<div/>', {
				    'id':'tw_fanpageslider_sline',
				    'class':'tw_ani_handel_sline',
				}).appendTo(target);

				custom_color.css("color", opts.textcolor);
				
				var custom_bg=$('<div/>', {
				    'id':'tw_fanpageslider_sline_top',
				    'class' : 'tw_fanpageslider_boxref'
				}).appendTo("#tw_fanpageslider_sline");

				

				$('<div/>', {
				    'id':'tw_fanpageslider_sline_head'
				}).appendTo("#tw_fanpageslider_sline");

				$('<img/>', {
				    'class':'tw_fps_close tw_fps_close_btn',
				    'src':close_img
				}).on('click', function(){
	    			popscroll.close();
				}).appendTo("#tw_fanpageslider_sline_head");


				if(opts.closecookie){
					$("<span/>", {
						'class': 'tw_cookie_btn',
						'text' : opts.cookietext
					}).on('click', function(){
		    			popscroll.dont_show_again();
					}).appendTo("#tw_fanpageslider_sline_head");
				}

				$('<div/>', {
					'id':'tw_fanpageslider_box_mid'
				}).appendTo("#tw_fanpageslider_sline");

				$('<div/>', {
				    'class':'tw_fanpageslider_customtext tw_fanpageslider_boxref',
				    'text': opts.msg 
				}).appendTo($("#tw_fanpageslider_box_mid"));


				var custompart=$('<div/>', {
					'id':'tw_fanpageslider_sline_bottom',
					'class' :'tw_fanpageslider_boxref'
				}).appendTo("#tw_fanpageslider_sline");

				$("#tw_fanpageslider_box_mid").append(channelsetup);

				custom_bg.css("background", opts.bgcolor);
			

			}

	  		custompart.css("background", opts.bgcolor);
	  		custompart.css("color", opts.textcolor);

		}



		function tw_get_channelsetup(opts, target){
			if(opts.network=='facebook'){
				$('<div/>', {
				    'id':'fb-root'
				}).appendTo(target);

				(function(d, s, id) {
	  				var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.5";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));

				var channelsetup=$('<div/>', {
				    'class':'fb-page',
				    'data-href':opts.channel,
				    'data-width':"280",
				    'data-small-header':"true",
				    'data-adapt-container-width':'ture',
				    'data-hide-cover':opts.fb_hide_cover,
				    'data-show-posts':opts.fb_show_posts
				});

			}



			if(opts.network=='twitter'){

				if(opts.twitter_size=='small'){
					var channelsetup=$('<a/>', {
					    'href':'https://twitter.com/'+opts.channel,
					    'class':'twitter-follow-button',
					    'data-show-count':true,
					    'data-size':'large',
					    'text':'Follow @'+opts.channel
					});
				}

				if(opts.twitter_size=='large'){
					var channelsetup=$('<a/>', {
					    'href':'https://twitter.com/'+opts.channel,
					    'class':'twitter-timeline',
					    'data-screen-name': opts.channel,
					    'data-show-count':true,
					    'data-size':'large',
					    'data-widget-id': '675117082648948736',
					    'text': opts.channel+ 'Tweets'
					});
				}

				!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
			}


			if(opts.network=='google'){
				$('<script/>', {
				    'src':'https://apis.google.com/js/platform.js'
				}).appendTo(target);
				
				var channelsetup=$('<div/>', {
				    'data-href':'https://plus.google.com/'+opts.channel,
				    'class':'g-page',
				    'data-width':'275',
				    'data-layout':'landscape'
				});
			}

			if(opts.network=='youtube'){
				$('<script/>', {
				    'src':'https://apis.google.com/js/platform.js'
				}).appendTo(target);
				
				var channelsetup=$('<div/>', {
				    'data-channel': opts.channel,
				    'class':'g-ytsubscribe',
				    'data-count':'default',
				    'data-layout':'full'
				});
			}

			if(opts.customcontent){
				return '<div class="tw_customhtml">'+opts.customhtml+'</div>';
			}

			return channelsetup;
		}


		function tw_get_animations(){
			var tw_asp=new Array;
				tw_asp['bl']=new Array;
				tw_asp['bl']['ls']="30px";
				tw_asp['bl']['rs']="auto";
				tw_asp['bl']['bs']="-500px";
				tw_asp['bl']['le']="30px";
				tw_asp['bl']['re']="auto";
				tw_asp['bl']['be']="-10px";

				tw_asp['bls']=new Array;
				tw_asp['bls']['cs']=true;
				tw_asp['bls']['ls']="30px";
				tw_asp['bls']['rs']="auto";
				tw_asp['bls']['bs']="-2px";

				tw_asp['br']=new Array;
				tw_asp['br']['rs']="30px";
				tw_asp['br']['ls']="auto";
				tw_asp['br']['bs']="-500px";
				tw_asp['br']['le']="auto";
				tw_asp['br']['re']="30px";
				tw_asp['br']['be']="-10px";

				tw_asp['brs']=new Array;
				tw_asp['brs']['cs']=true;
				tw_asp['brs']['rs']="30px";
				tw_asp['brs']['ls']="auto";
				tw_asp['brs']['bs']="-2px";

				tw_asp['sl']=new Array;
				tw_asp['sl']['ls']="-400px";
				tw_asp['sl']['rs']="auto";
				tw_asp['sl']['bs']="40px";
				tw_asp['sl']['le']="-2px";
				tw_asp['sl']['rs']="auto";
				tw_asp['sl']['bs']="40px";

				tw_asp['sls']=new Array;
				tw_asp['sls']['cs']=true;
				tw_asp['sls']['ls']="-2px";
				tw_asp['sls']['rs']="auto";
				tw_asp['sls']['bs']="40px";

				tw_asp['sr']=new Array;
				tw_asp['sr']['ls']="auto";
				tw_asp['sr']['rs']="-400px";
				tw_asp['sr']['bs']="40px";
				tw_asp['sr']['le']="auto";
				tw_asp['sr']['re']="-2px";
				tw_asp['sr']['bs']="40px";

				tw_asp['srs']=new Array;
				tw_asp['srs']['cs']=true;
				tw_asp['srs']['ls']="auto";
				tw_asp['srs']['rs']="-2px";
				tw_asp['srs']['bs']="40px";

			return tw_asp;
		}

		function tw_get_close_img(){
			var close_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADRUlEQVR4Xu2aOa4UMRCGvycIEBCwhCwCLsAqyIAABHeAe4BACIn9HsAlWAQiY3lcgTWHhCUAgf7RtDQaerrLdpX7PaY7nW67/s+/y2O7VljyZ2XJ9TMCGB2w5ATGKbDkBvjvkqAc/SdlUK1TYDNwFbgI7AI+AfeBO8DPlA4D3t0KXAMuTGP7DDwEbgLf+vqzAJD4Z8DxlsZeAueBr30dBf2+E3gCHGpp/y1wsg+CBcBt4EqHgDfA2QEgSPxT4GBHbHd7YjflgA/A3p4RrA3BIl4hK/Z9XbFbHPAL2GCwcC0IVvEK+TewsRTAuz6KMx1EQ0gRr7AU+4FSADemWdZggskrq8CZgJzQlfAWxabYr5cC2AQ8B05YCQRAyBH/CjgN/CgFoO+3TZebowNAyBFvnoqWJNhozoWgJfJLArjZV3dMl7q2dX5Rk2bxaiAFQIkTciCEi88BUAtCFfG5APTdduAxkJoTLE6oJr4EQC4E/T/XErkoJ1QVXwrAG4LEa2NzOCFhJiW8tnZTk2BbG5oOCvxIQuDzThhEvIcDGs0lEDQI1Ue+CdzDAaUQFENV28861RNAkxNSp0PCzKF4zs935g0gEoK7eM8cMA82J6l1OSFEfCQAte0FIUx8NAAPCKHiawAogRAufgSQsR1OWbJKRr/pJ9wFEctgE/xSJ0Ev8eFOiHCAt/hQCN4AosQ3ENyP3D0B5IhXktNzLCG7ukLwApArXkdkerSBSj1ec7l88QBQIr65Vh/iyH1CvhSAh/jG/YNAKAHgKX4wCLkAIsQ3ECKP3P/JtTkAIsWXQOg7cm9daFIB1BBfFUIKgJriZyGknjEmOcEKYAjxVSBYAGwBXiRefHhvY3PuHfSP8ZRHmdw94FLCX1Vv8SVOUCGnCjwXPhYHqCp0txFAlPhcCC5lctba22jxOQctLmVyH4E9PQ6oJT4Vwntgf+kUULnp5Y5GaotPgXCrr8TPkgO0CqhMrm3PrlK0cwE1gcaUM7l8ebRgK/16Wib3vdQB+l4QVDCtknQlRE0Llctrheisw7MqKXhP1exNbJqqStoPADm3U7zHdrgg7rXxqWUKrI1Ig6IYAQSBXTfNjg5YN0MVFOjogCCw66bZv1sI8UFM29qyAAAAAElFTkSuQmCC";

			return close_img;

		}



    }



}(jQuery));
