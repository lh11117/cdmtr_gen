// data={name:["30号线","Line 30","30"],color:"#F67599",stations:{"a":{name:["龙泉驿火车站南","Longquanyi Railway Station South"],next:["b"],id:"01"},"b":{name:["玉虹路","Yuhong Road"],next:["c"],back:['a'],no_serve:true,id:"02"},"c":{name:["分水","Fenshui"],back:['b'],next:["d"],no_serve:true,id:"03"},"d":{name:["玉石","Yushi"],back:['c'],next:["e"],id:"04"},"e":{name:["惠王陵","Huiwangling"],back:['d'],next:["f"],interchange:[["2","#EB5A35"]],id:"04"},"f":{name:["航天立交","Hangtian Flyover"],back:['e'],next:["g"],id:"05"},"g":{name:["海桐街","Haitong Street"],back:['f'],next:["h"],id:"06"},"h":{name:["娇子立交","Jiaozi Flyover"],back:['g'],next:["i"],interchange:[["13","#C5A900"]],id:"07"},"i":{name:["多线换乘测试","The Interchange Test"],back:['h'],next:["x"],interchange:[["1","#222A8C"],["14","#6F263D"]],id:"08"},"x":{name:["双流机场2号航站楼东","Terminal 2 Shuangliu\nInternational Airport East"],interchange:[["19","#89ABE3"]],back:['i'],id:"09"},},start:"a",selected:"f",to_left:false,left_door:true,a_width:650,height:200,b_width:650,a_top:60,margin:50,new:true};
var data = {
    name: ["18号线", "Line 18", "18"],
    color: "#006268",
    stations: {
        "a": {
            name: ["火车南站", "South Railway Station"],
            next: ["b"],
            interchange:[['1','#222A8C'],['7','#6DC6D6']],
            id: "05"
        },
        "b": {
            name: ["孵化园", "Incubation Park"],
            next: ["c"],
            back: ['a'],
            interchange:[['1','#222A8C'],['9','#F1AD17']],
            id: "06"
        },
        "c": {
            name: ["锦城广场东", "Jincheng Plaza East"],
            back: ['b'],
            next: ["d"],
            id: "07"
        },
        "d": {
            name: ["世纪城", "Century City"],
            back: ['c'],
            next: ["e"],
            interchange:[['1','#222A8C']],
            id: "08"
        },
        "e": {
            name: ["海昌路", "Haichang Road"],
            back: ['d'],
            next: ["f"],
            interchange:[['1','#222A8C']],
            id: "09"
        },
        "f": {
            name: ["西博城", "Western China Iat'l Expo City"],
            back: ['e'],
            next: ["g"],
            interchange:[['1','#222A8C'],['6','#BE7331']],
            id: "10"
        },
        "g": {
            name: ["兴隆", "Xinglong"],
            back: ['f'],
            next: ["h"],
            id: "11"
        },
        "h": {
            name: ["天府站", "Tianfu Station"],
            back: ['g'],
            next: ["i"],
            interchange: [["19", "#89ABE3"]],
            id: "12"
        },
        "i": {
            name: ["三岔", "Sancha"],
            back: ['h'],
            next: ["j"],
            interchange: [["19", "#89ABE3"]],
            id: "13"
        },
        "j": {
            name: ["福田", "Futian"],
            back: ['i'],
            next: ["k"],
            interchange: [["19", "#89ABE3"],['S3','#75787B']],
            no_serve:1,
            id: "14"
        },
        "k": {
            name: ["天府机场1号2号航站楼", "Terminal 1&2 of Tianfu International Airport"],
            interchange: [["19", "#89ABE3"]],
            back: ['i'],
            next: ['l'],
            id: "16"
        },
        "l": {
            name: ["天府机场北", "Tianfu International Airport North"],
            interchange: [["19", "#89ABE3"]],
            back: ['k'],
            id: "17"
        },
    },
    start: "a",
    end: "l",
    selected: "e",
    to_left: true,
    left_door: false,
    a_width: 600,
    height: 200,
    b_width: 600,
    a_top: 60,
    margin: 70,
    scale: 2,
    new: false
};


function textalign(text,x,y,way='left',ho="top"){return text.x(x-(way=="left"?0:text.bbox().width)).y(y-(ho=="top"?0:text.bbox().height));}
function next_station(id,to_left){var xid=id;do{xid=data.stations[xid][to_left?'next':'back'][0];}while(data.stations[xid].no_serve);return xid;}
function interchange2(draw,x,y,color,ali='middle'){
    var b1=draw.path('M4.56,15.44H4.17c-2.16,0-3.92-1.75-3.92-3.92V4.17C0.25,2,2,0.25,4.17,0.25h0.39c2.16,0,3.92,1.75,3.92,3.92v7.35C8.48,13.69,6.72,15.44,4.56,15.44z').stroke({width:0.75,color:color[0]}).fill("#fff");
    x-=b1.bbox().width*(ali=="right"?0:1)/(ali=='middle'?2:1);
    textalign(b1,x+3,y,'right');
    textalign(draw.path('M2.26,8.38V3.89C2.6,2.89,3.54,2.21,4.57,2.2c1.11-0.01,2.1,0.77,2.39,1.87'),x+1.25,y+2,'right').stroke({width:0.75,color:color[1]}).fill("#ffffff00");
    textalign(draw.polygon([[1.17,8.34],[3.36,8.34],[2.26,10.52]]),x-2.35,y+8,'right').fill(color[1]);
    textalign(draw.path('M6.78,7.15v4.14c-0.09,1.25-1.13,2.23-2.38,2.25c-1.24,0.02-2.31-0.93-2.44-2.17'),x+1.25,y+7,'right').stroke({width:0.75,color:color[0]}).fill("#ffffff00");
    textalign(draw.polygon([[7.87,7.15],[5.68,7.15],[6.78,4.96]]),x+2.35,y+5,'right').fill(color[0]);
    return b1.bbox().height;
}
function interchange3(draw,x,y,color,ali='middle'){
    var b1=draw.path('M4.56,15.44H4.17c-2.16,0-3.92-1.75-3.92-3.92V4.17C0.25,2,2,0.25,4.17,0.25h0.39c2.16,0,3.92,1.75,3.92,3.92v7.35C8.48,13.69,6.72,15.44,4.56,15.44z').stroke({width:0.75,color:color[0]}).fill("#fff");
    x-=b1.bbox().width*(ali=="right"?0:1)/(ali=='middle'?2:1);
    textalign(b1,x+3,y,'right');
    textalign(draw.path('M6.57,6.93c0-0.82,0.01-1.64,0.01-2.47c-0.01-0.2-0.07-0.67-0.41-1.11c-0.23-0.31-0.53-0.49-0.6-0.53C5.38,2.7,5.2,2.64,5.07,2.6'),x+1.25,y+2,'right').stroke({width:0.75,color:color[1]}).fill("#ffffff00");
    textalign(draw.polygon([[3.4,2.33],[5.56,1.6],[5.34,3.6]]),x-0.05,y+1,'right').fill(color[1]);
    textalign(draw.path('M2.76,2.57c-0.1,0.1-0.26,0.27-0.38,0.52C2.24,3.37,2.22,3.63,2.21,3.77v5.15'),x-2.85,y+2.5,'right').stroke({width:0.75,color:color[2]}).fill("#ffffff00");
    textalign(draw.polygon([[1.05,8.92],[3.38,8.92],[2.21,11.02]]),x-2.15,y+8.5,'right').fill(color[2]);
    textalign(draw.path('M2.15,11.7c0.06,1.23,1.11,2.19,2.3,2.14c1.15-0.04,2.09-1,2.13-2.18V9.92'),x+1,y+9.5,'right').stroke({width:0.75,color:color[0]}).fill("#ffffff00");
    textalign(draw.polygon([[5.28,9.92],[7.81,9.92],[6.55,7.54]]),x+2.25,y+7.5,'right').fill(color[0]);
    return b1.bbox().height;
}
function svg2png(svgText,w,h,s=1,name='export') {
    const img=new Image();
    img.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    img.onload=()=>{
        const canvas=document.createElement('canvas');
        const ctx=canvas.getContext('2d');
        const dpr=s;
        canvas.width=w*dpr;
        canvas.height=h*dpr;
        ctx.scale(dpr,dpr);
        ctx.drawImage(img,0,0);
        const url=canvas.toDataURL(`image/png`);
        const a=document.createElement('a');
        a.href=url;
        a.download=name+'.png';
        a.click();
        URL.revokeObjectURL(url);
    };
}
function loads(data){
    var stations=[];
    var next=data.start;
    var num=0;
    while(next){
        var _=data.stations[next];
        _['key']=next;
        stations.push(_);
        next=data.stations[next].next;
        if(next)next=next[0];
        else break;
        if(++num>=1145)break;//应该没有谁家地铁有1145个站吧，这里防止死循环
    }
    return stations;
}
function generate(data) {
    var scroll=document.querySelector("#draw").scrollLeft;
    var stations=loads(data);
    document.querySelector("#draw").innerHTML='';
    var x=data.a_width/2,y=data.a_top;
    const draw0=SVG().addTo('#draw');
    const draw=draw0.group();
    draw.scale(data.scale);
    var barY;
    var flt='Frutiger LT 55 Roman.ttf';
    {
        draw.rect(data.a_width, data.height).fill('#fff').stroke({width:1,color:'#000'});
        y+=draw.text(data.stations[data.selected].name[0]).font({family:'微软雅黑',size:24,anchor:'middle'}).center(x,y).bbox().height-10;
        data.stations[data.selected].name[1].split('\n').forEach(text=>{y+=draw.text(text).font({family:flt,size:13,anchor:'middle'}).center(x,y).bbox().height-5;});
        draw.rect(data.a_width-data.margin,8).center(x,y+10).fill(data.color).radius(4);
        barY=y+10;
        draw.rect(50, 20).center(x,y+10).fill('#fff').radius(10).stroke({width:1,color:data.color});
        draw.path([['M',x,y],['L',x,y+20]]).stroke({width:1,color:data.color});
        var t=draw.text(data.name[2]).font({family:flt,size:13,anchor:'middle',fill:data.color});
        t.center(x-t.bbox().width*0.8,y+8.5)
        t=draw.text(data.stations[data.selected].id).font({family:flt,size:13,anchor:'middle',fill:data.color});
        t.center(x+t.bbox().width*0.8,y+8.5);
        var end_sta = stations[0];
        if(data.to_left){end_sta=stations[stations.length-1];}
        var oy=y;
        x=data.left_door?data.margin/2+5:data.a_width-(data.margin/2+5);
        y-=12;
        var way=data.left_door?'left':'right';
        var u=data.left_door?1:-1;
        var y_l=y;
        var last_height;
        (data.stations[data.stations[data.selected][data.to_left?'next':'back']]?"To "+end_sta.name[1]:"The Terminal Station").split('\n').reverse().forEach(text=>{y-=(last_height=textalign(draw.text(text).font({family:flt,size:11,anchor:'left'}),x,y,way).bbox().height)-3;});
        y-=5;
        textalign(draw.text(data.stations[data.stations[data.selected][data.to_left?'next':'back']]?end_sta.name[0]+"方向":"终点站").font({family:'微软雅黑',size:16,anchor:'left'}),x,y,way).bbox().height;
        y=y_l-last_height-5;
        if(data.new){
            var margin=data.margin/2+10;
            var way2=data.left_door?'right':'left';
            var oy1=y;
            var r=draw.rect(150, 20).fill(data.color);
            var b1=textalign(draw.text(data.name[1]).font({family:flt,size:15,anchor:'left',fill:"#fff"}),data.left_door?data.a_width-margin:margin,y+5,way2);
            y-=b1.bbox().height+2;
            var b2=textalign(draw.text(data.name[0]).font({family:'微软雅黑',size:20,anchor:'left',fill:"#fff"}),data.left_door?data.a_width-margin:margin,y+5,way2)
            var t=Math.abs(b1.bbox().width-b2.bbox().width);
            if(b1.bbox().width>=b2.bbox().width){textalign(b2,data.left_door?data.a_width-margin-t/2:margin+t/2,y+5,way2);}
            else{textalign(b1,data.left_door?data.a_width-margin-t/2:margin+t/2,oy1+5,way2);}
            y-=b2.bbox().height;
            r.size(Math.max(b1.bbox().width,b2.bbox().width)+10,oy1-y);
            r.radius((oy1-y)*0.2);
            textalign(r,data.left_door?data.a_width-margin+5:margin-5,oy1-(oy1-y)/2+5,way2);
        }
        if(data.stations[data.stations[data.selected][data.to_left?'next':'back']]){
            y=oy+20;
            x+=u*(textalign(draw.polygon([[10.92*u,0],[17.96*u,0],[8.87*u,9.55],[28.43*u,9.55],[28.43*u,15.01],[9.78*u,15.01],[18.65*u,23.42],[11.14*u,23.42],[0,11.71]]),x,y,way).bbox().width + 5);
            y-=3;
            y+=textalign(draw.text("下一站："+data.stations[next_station(data.selected,data.to_left)].name[0]).font({family:'微软雅黑',size:14,anchor:'left'}),x,y,way).bbox().height;
            textalign(draw.text("Next Station: "+data.stations[next_station(data.selected,data.to_left)].name[1]).font({family:flt,size:9,anchor:'left'}),x,y,way);
        }
    }
    {
        draw.rect(data.b_width,data.height).fill('#fff').stroke({width:1,color:'#000'}).move(data.a_width,0);
        x=data.a_width+data.b_width/2,y=barY;
        draw.rect(data.b_width-data.margin,8).center(x,y).fill(data.color).radius(4);
        var interchange_color=null;
        if(data.to_left==data.left_door)stations=stations.reverse();
        stations.every(function(item){if(item.interchange){interchange_color=item.interchange[0][1]};return interchange_color==null;});
        if(interchange_color!=null){
            var _y=data.height-20;
            _y-=draw.text("Transfer Station").font({family:flt,size:4,anchor:'middle'}).move(data.a_width+data.margin/2+10,_y).bbox().height+3;
            draw.text("换乘站").font({family:'微软雅黑',size:7,anchor:'middle'}).move(data.a_width+data.margin/2+10,_y);
            interchange2(draw,data.a_width+data.margin/2+5,_y,[data.color,interchange_color],'right');
        }
        x=data.a_width+data.margin/2;
        var ww=0;
        var pass=false;
        var rect=draw.rect(0,8).fill('#a3a3a3');
        var rect2=draw.rect(8,8).radius(4).fill('#a3a3a3');
        stations.forEach(i=>{
            if(!data.left_door&&i.key!=data.selected)pass=!pass;
            if(pass)ww+=(data.b_width-data.margin-30)/(stations.length-1);
            var y_=y;
            // console.log(pass,i.name[0]);
            draw.rect(15, 6).center(x+15,y).fill('#fff').radius(3).stroke({width:0.5,color:data.color});
            draw.path([['M',x+15,y-3],['L',x+15,y+3]]).stroke({width:0.5,color:data.color});
            textalign(draw.text(data.name[2]).font({family:flt,size:4,anchor:'middle',fill:data.color}),x+13.5,y-3,'right');
            textalign(draw.text(i.id).font({family:flt,size:4,anchor:'middle',fill:data.color}),x+16.5,y-3,'left');
            var path,path2;
            if(i.key==data.selected&&data.new){
                path=draw.path();
                path2=draw.path("M4.75,0.5L4.75,0.5C2.4,0.5,0.5,2.4,0.5,4.75H9C9,2.4,7.1,0.5,4.75,0.5z").fill(data.color);
            }
            const group=draw.group();
            var b1=textalign(group.text(i.name[1]).font({family:flt,size:4,anchor:'left',fill:(pass?"#a5a5a5":(i.key==data.selected?(data.new?"#fff":data.color):"#3e3a39"))}),x+18,y-5,'left','bottom');
            var h=b1.bbox().height;
            var b2=textalign(group.text(i.name[0]).font({family:'微软雅黑',size:7,anchor:'left',fill:(pass?"#a5a5a5":(i.key==data.selected?(data.new?"#fff":data.color):"#3e3a39"))}),x+18,y-5-h,'left','bottom');
            if(i.no_serve){
                var w=Math.max(b1.bbox().w,b2.bbox().w);
                w+=textalign(group.text('(').font({family:'微软雅黑',size:10,anchor:'left',fill:(pass?"#a5a5a5":(i.key==data.selected?(data.new?"#fff":data.color):"#3e3a39"))}),x+18+1+w,y-5,'left','bottom').bbox().width+1;
                var b114=textalign(group.text('Not yet in service').font({family:flt,size:4,anchor:'left',fill:(pass?"#a5a5a5":(i.key==data.selected?(data.new?"#fff":data.color):"#3e3a39"))}),x+18+1+w,y-5,'left','bottom');
                var b1919=group.text('暂未开通').font({family:'微软雅黑',size:6,anchor:'left',fill:(pass?"#a5a5a5":(i.key==data.selected?(data.new?"#fff":data.color):"#3e3a39"))});
                textalign(b1919,x+18+1+w+(b114.bbox().width-b1919.bbox().width)/2,y-4-b114.bbox().height,'left','bottom');
                textalign(group.text(')').font({family:'微软雅黑',size:10,anchor:'left',fill:(pass?"#a5a5a5":(i.key==data.selected?(data.new?"#fff":data.color):"#3e3a39"))}),x+18+1+w+b114.bbox().width+1,y-5,'left','bottom');
            }
            if(i.key==data.selected&&data.new){
                var wi=group.bbox().width+10;
                textalign(path.plot([['M',10,0],['L',-15,0],['L',(wi*Math.sin(Math.PI/180*48)-25),-wi*Math.cos(Math.PI/180*48)],['L',wi*Math.sin(Math.PI/180*48),-wi*Math.cos(Math.PI/180*48)],['Z']]).fill(data.color).stroke({width:0.5,color:data.color}),x-6,y-4,'left','bottom');
                path2.move(x+wi*Math.sin(Math.PI/180*48)+1,y-4-wi*Math.cos(Math.PI/180*48)-11).scale(2.2).rotate(48);
            }
            group.rotate(-48,x+18,y-5);
            if(i.interchange){
                if(i.interchange.length==1)y_+=interchange2(draw,x+16.25,y+6,[data.color,i.interchange[0][1]],'right');
                else y_+=interchange3(draw,x+16.25,y+6,[data.color,i.interchange[0][1],i.interchange[1][1]],'right');
                i.interchange.forEach(j=>{
                    y_+=14;
                    draw.rect(12,12).center(x+15,y_).radius(6).fill(j[1]);
                    draw.text(j[0]).font({family:flt,size:7,anchor:'middle',fill:"#fff"}).center(x+15,y_-0.5);
                })
            }
            if(!data.left_door&&i.key!=data.selected)pass=!pass;
            if(pass==false)pass=i.key==data.selected;
            x+=(data.b_width-data.margin-30)/(stations.length-1);
        });
        ww+=15/4*3-0.5;
        rect.size(ww,8).move(data.left_door?data.a_width+data.b_width-ww-4-data.margin/2:data.a_width+data.margin/2+4,y-4);
        rect2.move(data.left_door?data.a_width+data.b_width-data.margin/2-8:data.a_width+data.margin/2,y-4);
    }
    document.querySelector("#draw>svg").style.width=(data.a_width+data.b_width)*data.scale+'px';
    document.querySelector("#draw>svg").style.height=(data.height)*data.scale+'px';
    document.querySelector("#draw").scrollLeft=scroll;
    // svg2png(document.querySelector("#draw").innerHTML,(data.a_width+data.b_width)*data.scale,data.height*data.scale,1,data.name[0].replace(' ','_')+'_导出');
}
