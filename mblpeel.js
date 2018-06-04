jQuery(document).ready(function($) {  
    
    var expanded = false;
    var pagePeelContainer = $('<div target='_blanc' id="PagePeel"></div>');    

    //Get colours from front end
    var peelColorStart = PagePeelProParams.peelColorStart == undefined || PagePeelProParams.peelColorStart == '' ? '#333' : PagePeelProParams.peelColorStart;
    var peelColorEnd = PagePeelProParams.peelColorEnd == undefined || PagePeelProParams.peelColorEnd == '' ? '#fff' : PagePeelProParams.peelColorEnd;
    
    $('body').append(pagePeelContainer);  
	
    var paper = new Raphael(document.getElementById('PagePeel'), 500, 500);
   
    //Advert images
    //=======================
    var backgroundFill = paper.path("M 400,0 L 500,100 L 500,0 Z").attr({fill: "url('" + PagePeelProParams.smallImageUrl + "')",'stroke-width':0});
    var backgroundFillBig = paper.path("M 0,0 L 500,500 L 500,0 Z").attr({fill: "url('" + PagePeelProParams.largeImageUrl + "')",'stroke-width':0,'id':'BigAdvert'});
    //Make cursor point on hover
    backgroundFillBig.node.setAttribute("class","pointCursor");
    backgroundFillBig.animate({path: "M 400,0 L 500,100 L 500,0 Z"}, 1, 'linear');
    backgroundFillBig.hide();

    //Page curl
    //============================
    //Shadow first so it's underneath

    var pageLeafShadow = paper.path("M 0,0 C 0,0 15,15 0,90 C 20,95 75,75 100,100 Z");   
    pageLeafShadow.attr({fill: '#333','opacity': 0.6,'stroke-width':0,});
    pageLeafShadow.transform('T403,4');
    //pageLeafShadow.blur(2);
    
    //Shaped page curl
    var pageLeaf = paper.path("M 0,0 C 0,0 15,15 0,90 C 20,95 75,75 100,100 Z");   
    pageLeaf.attr({gradient: '235-' + peelColorStart + '-' + peelColorEnd,'stroke-width':0, 'opacity': 1});
    pageLeaf.transform('T400,0');
	
    //Make cursor point on hover
    pageLeaf.node.setAttribute("class","pointCursor");

    //Group the peel and shadow
    var peelSet = paper.set();

    peelSet.push(
            pageLeafShadow,
            pageLeaf
    );
	
    //Initial little shimmy to make people look
								   //M 0,0 C 0,0 15,15 0,100 C 20,95 75,75 100,100 Z
            pageLeaf.animate({path: "M 0,0 C 0,0 15,15 0,102 C 20,102 75,75 100,100 Z"}, 5000, 'elastic'); 
        pageLeafShadow.animate({path: "M 0,0 C 0,0 15,15 0,100 C 20,100 75,75 100,100 Z"}, 5000, 'elastic'); 
       
    //If hover mode on
    if(PagePeelProParams.pagePeelActivateEvent == 'hover'){        
        //On hover expand
        $(pageLeaf.node).mouseenter(function(){
            leafClickedActions();
        });
        
        $(backgroundFillBig.node).mouseleave(function(){
            shrinkLeaf();
        });
    }
    
	
	//Leave active no matter what for mobile
	//Peel expand on click
	pageLeaf.click(function(){
		leafClickedActions();
	});        
    
     
       
    //Leaf click stuff
    function leafClickedActions(){
        if(expanded == false){
            expandLeaf();
        }
        else{
            expanded = false;			
            shrinkLeaf();
        }                  
    }

    //Make the ad grow
    function expandLeaf(){
        expanded = true;

        //Show big image
        backgroundFillBig.show();

        //Show big image and animate it bigger so it doesn't show through
        backgroundFillBig.show().stop().animate({path:'M 148,0 L 505,355 L 505,0 Z'},5000,'elastic');	

        //Make container grow big enough
        pagePeelContainer.css({'width':500,'height':500});

        //Make peel and shadow bigger
        peelSet.stop().animate({path:"M-250,0 C-250,0 -180,100 -255,370 C-255,370 -100,300 100,350 Z"},5000,'elastic');

        //Hide small image
        backgroundFill.hide();            
    }

    //Shrink it back
    function shrinkLeaf(){
        //Shrink peel and shadow			
        peelSet.stop().animate({path:"M 0,0 C 0,0 15,15 0,100 C 20,95 75,75 100,100 Z"},2000,'elastic');

        //Hide big image and make it small again ready for animation
        backgroundFillBig.stop().animate({path: "M 400,0 L 500,100 L 500,0 Z"}, 2000, 'elastic',function(){
            //Show small advert again
            backgroundFill.show();	

            //Fade big out
            backgroundFillBig.hide();

            //Make container shrink back
            pagePeelContainer.css({'width':120,'height':120});				
        });	        
    }

    //Big advert click
    //TODO: Add button only option?
    backgroundFillBig.click(function(){
            window.location.href = PagePeelProParams.pagePeelTargetUrl;
    });

});
