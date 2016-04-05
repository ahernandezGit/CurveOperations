//write a message in the bottom div tag of the webpage 
function writeMessage(message,string) {
		document.getElementById(string).innerHTML=message;
}
//random number between a and b
function randomAB(a,b) {
    return Math.round(Math.random()*(b-a)+parseInt(a));
}	
function clear (){
    opoints=[];
    points=[];
    dparr=[];
    carr={};
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    DPch.disabled=true;
    Cach.disabled=true;
    DPch.checked=false;
    Cach.checked=false;
    och.checked=true;
    deformation=false;
}
function draw(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if(och.checked){
        ctx.beginPath();
        ctx.strokeStyle = "#FF0000"  ;  
        ctx.arc(opoints[0].x,opoints[0].y,1,0,2*Math.PI,false);
        ctx.stroke();
        //ctx.strokeRect(points[0].x-1,points[0].y+1,2,2);
        //ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < opoints.length; i++) {
            ctx.beginPath();
            ctx.arc(opoints[i].x,opoints[i].y,1,0,2*Math.PI,false);
            ctx.stroke(); 
        }           
    }
    if(DPch.checked){
        ctx.beginPath();
        ctx.strokeStyle = "#08088A"  ;  
        ctx.arc(dparr[0].x,dparr[0].y,5,0,2*Math.PI);
        ctx.stroke();
        for (var i = 1; i < dparr.length; i++) {
                    ctx.beginPath();
                    ctx.arc(dparr[i].x,dparr[i].y,5,0,2*Math.PI);
                    ctx.stroke();
        } 
        ctx.beginPath();
        ctx.moveTo(dparr[0].x, dparr[0].y);
        for (var i = 1; i < dparr.length; i++) {
              ctx.lineTo(dparr[i].x, dparr[i].y);
        } 
        ctx.stroke();   
    }
    if(deformation){
        ctx.beginPath();
        ctx.strokeStyle = "#08088A"  ;  
        ctx.arc(dparr[0].x,dparr[0].y,5,0,2*Math.PI);
        ctx.stroke();
        for (var i = 1; i < dparr.length; i++) {
                    ctx.beginPath();
                    ctx.arc(dparr[i].x,dparr[i].y,5,0,2*Math.PI);
                    ctx.stroke();
        }    
    }
    if(Cach.checked){
        ctx.beginPath();
        ctx.strokeStyle = "#047315"  ;  
        ctx.lineWidth = 2;
        carr.draw();
         ctx.lineWidth = 1;
    }
    

}
function recomputeDP(){
    if(DPch.checked){
        dparr=[];
        dparr=DouglasPeucker(opoints,document.getElementById("ipsolon").value);
        dparr.push( opoints[opoints.length-1]);
        carr={};
        carr=new CatmullRomInterpolation(51,dparr,tension);
        draw();    
    }
}
function recomputeCatmullRom(){
    if(Cach.checked){
        carr={};
        tension=document.getElementById("tension").value;
        //sample=document.getElementById("sample").value;
        carr=new CatmullRomInterpolation(51,dparr,tension);
        draw();    
    }
}
function mousemoveStart(){ 
		var mousePos= d3.mouse(this); //Get position of the mouse relative to the canvas tag coordinates.
		//mousePos[1]=600-mousePos[1];
		var message = 'Mouse position: ' + mousePos[0] + ',' + mousePos[1];  
        writeMessage(message,'bottomBar');  //Show mouse position in the bottom bar of the webpage
        if (!isDrawing) return;
        if(och.checked){
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            points.push({ x: mousePos[0], y: mousePos[1] });
            ctx.beginPath();
            ctx.strokeStyle = "#FF0000"  ;  
            ctx.arc(points[0].x,points[0].y,1,0,2*Math.PI,false);
            ctx.stroke();
            //ctx.strokeRect(points[0].x-1,points[0].y+1,2,2);
            //ctx.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                ctx.beginPath();
                ctx.arc(points[i].x,points[i].y,1,0,2*Math.PI,false);
                ctx.stroke(); 
            }   
        } 
        
}
function mousedownStart(){ 
		var mousePos= d3.mouse(this); //Get position of the mouse relative to the canvas tag coordinates.
        isDrawing = true;
        points.push({x:mousePos[0],y:mousePos[1]});
        //ctx.moveTo(mousePos[0], mousePos[1]);
        
        if(!och.checked && !DPch.checked && !Cach.checked){
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
}
function mouseupStart(){ 
		 isDrawing = false;
         if(och.checked){
            DPch.disabled=false;
            Cach.disabled=false;     
         }
         //caculate DP algorithm
         dparr=DouglasPeucker(points,ipsilon);
         dparr.push( points[points.length-1] );
         carr=new CatmullRomInterpolation(51,dparr,tension);
         opoints=points;
         points = [];
        
}

function mousemoveDeformation() {
        var mousePos= d3.mouse(this); //Get position of the mouse relative to the canvas tag coordinates.
		//mousePos[1]=600-mousePos[1];
		var message = 'Mouse position: ' + mousePos[0] + ',' + mousePos[1];  
        writeMessage(message,'bottomBar');  //Show mouse position in the bottom bar of the webpage
        var domu=false;
        var index=-1;
        for(var i=0;i<dparr.length;i++){
            var dist=Math.pow(mousePos[0]-dparr[i].x,2)+Math.pow(mousePos[1]-dparr[i].y,2);
            if(dist<=25){
                domu=true;
                index=i;
                break;
            }
        }    
       
        if(domu){
            document.getElementById("canvastag").style.cursor="pointer";
        }
        else{
            document.getElementById("canvastag").style.cursor="default";    
        }
        if(isDrawing){
            if(domu){
              document.getElementById("canvastag").style.cursor="pointer";
              dparr[i].x=mousePos[0];
              dparr[i].y=mousePos[1];    
            }
            draw();
        }
        
        //if (!isDrawing) return;
}
function mousedownDeformation() {
   isDrawing = true;
    //document.getElementById("canvastag").style.cursor="pointer";
}
function mouseupDeformation() {
   isDrawing = false;
}

var ipsilon=document.getElementById("ipsolon").value;
var canvasd3 = d3.select("#canvastag");
var ctx = canvasd3.node().getContext("2d"); 
//var ctx = canvastag.getContext('2d');
var isDrawing=false;
var deformation=false;
var och=document.getElementById("oCheck");
var DPch=document.getElementById("DPCheck");
var Cach=document.getElementById("CaCheck");
var tension=document.getElementById("tension").value;
var points=[];
var dparr=[];
var opoints=[];
var carray={};

//Show the position of the mouse in the bottom of the window. 
canvasd3.on('mousemove',mousemoveStart);
canvasd3.on('mousedown',mousedownStart); 
canvasd3.on('mouseup', mouseupStart);

d3.select("#CaCheck").on("click",draw);
d3.select("#DPCheck").on("click",draw);
d3.select("#oCheck").on("click",draw);
d3.select("#clearButton").on("click",clear);
d3.select("#ipsolon").on("change",recomputeDP);
d3.select("#tension").on("change",recomputeCatmullRom);
d3.select("#sample").on("change",recomputeCatmullRom);
d3.select("#goButton").on("click",function(){
    if(dparr.length!=0){
       och.checked=false;
       Cach.checked=true;
       DPch.checked=false;
       deformation=true;     
       draw();
       //canvasd3.on('mousemove',null);
       canvasd3.on('mousedown',mousedownDeformation); 
       canvasd3.on('mouseup', mouseupDeformation);
       canvasd3.on('mousemove',mousemoveDeformation);    
    }
    else{
        console.log(dparr.length);
        alert("Nao tem desenho"); 
    }

});
d3.select("#restartButton").on("click",function(){
       och.checked=true;
       Cach.checked=false;
       DPch.checked=false;
       deformation=false;
       canvasd3.on('mousemove',mousemoveStart);
       canvasd3.on('mousedown',mousedownStart); 
       canvasd3.on('mouseup', mouseupStart); 
   
});