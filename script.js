document.querySelector("#style>.topbar>.b").addEventListener("click",()=>{
    document.querySelector("#style").classList.remove("show");
});

document.querySelector(".style.btn").addEventListener("click",()=>{
    document.querySelector("#style").classList.add("show");
});

function new_sta(){
    document.getElementById('stas-choose').innerHTML='<option value="__start">开头</option><option value="__end" selected>末尾</option>';
    var stations=loads(data);
    stations.forEach(e=>{
        var op=document.createElement('option');
        op.value=e.key;
        op.innerText="在“"+e.name[0]+"”后面";
        document.getElementById('stas-choose').appendChild(op);
    });
    document.getElementById('stas-choose').lastElementChild.value='__end';
    document.getElementById('new_sta').classList.remove('hide');
}

function generate_randstr(length=16) {
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
  let result='';
  for(let i=0;i<length;i++){
    result+=chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return result;
}

function add_sta(){
    var sel=document.getElementById('stas-choose');
    var v=sel.options[sel.selectedIndex].value;
    var sname;
    do{sname=generate_randstr();}while(data.stations.sname);
    if(v=='__start'){
        data.stations[data.start].back=[sname];
        data.stations[sname]={name:[sname,sname],next:[data.start],id:"00"};
        data.start=sname;
    }else if(v=='__end'){
        data.stations[data.end].next=[sname];
        data.stations[sname]={name:[sname,sname],back:[data.end],id:"00"};
        data.end=sname;
    }else{
        data.stations[data.stations[v].next].back=[sname];
        data.stations[sname]={name:[sname,sname],back:[v],next:[data.stations[v].next],id:"00"};
        data.stations[v].next=[sname];
    }
    load(data);
}

function close_new_sta(){
    document.getElementById('new_sta').classList.add('hide');
}

function load(data){
    var ele=document.getElementById('stations');
    ele.innerHTML='';
    var stations=loads(data);
    stations.forEach(e=>{
        var div=document.createElement('tr');
        div.classList.add('stas');
        var p1=document.createElement('td');
        p1.innerText=e.name[0];
        div.appendChild(p1);
        var p2=document.createElement('td');
        p2.innerText=e.name[1];
        div.appendChild(p2);
        var p3=document.createElement('td');
        p3.innerText=data.name[2]+'|'+e.id;
        p3.style.color=data.color;
        div.appendChild(p3);
        var p4=document.createElement('td');
        if(e.interchange){
            p4.innerText='换乘:';
            e.interchange.forEach(e2=>{
                var sp=document.createElement('span');
                sp.innerText=e2[0]+' ';
                sp.style.color=e2[1];
                p4.appendChild(sp);
            });
        }
        div.appendChild(p4);
        ele.appendChild(div);
    });
    generate(data);
}
load(data);
{
    color.value=data.color;
    scale.value=data.scale;
    a_width.value=data.a_width;
    b_width.value=data.b_width;
    height.value=data.height;
    margin.value=data.margin;
    a_top.value=data.a_top;
    left_door.checked=data.left_door;
    to_left.checked=data.to_left;
    name0.value=data.name[0];
    name1.value=data.name[1];
    name2.value=data.name[2];
}


var timer=-1;
function update(){
    if(timer>0){clearTimeout(timer);}
    timer=setTimeout(()=>{load(data);},300);
}

document.getElementById('inner').children.forEach(e=>{
    e.addEventListener("input",()=>{
        data.name=[name0.value,name1.value,name2.value];
        data.color=color.value;
        data.scale=parseInt(scale.value,10);
        data.a_width=parseInt(a_width.value,10);
        data.b_width=parseInt(b_width.value,10);
        data.height=parseInt(height.value,10);
        data.margin=parseInt(margin.value,10);
        data.a_top=parseInt(a_top.value,10);
        data.left_door=left_door.checked;
        data.to_left=to_left.checked;
        update();
    });
});

function downloadJSON(data,filename='data.json') {
  const jsonStr=JSON.stringify(data);
  const blob=new Blob([jsonStr],{ type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=filename;
  a.click();
  URL.revokeObjectURL(url);
}

document.querySelector('.btn.download').addEventListener('click',()=>{
    downloadJSON(data,data.name[0]+'_导出.json');
});


document.querySelector('.btn.export').addEventListener('click',()=>{
    svg2png(document.querySelector("#draw").innerHTML,(data.a_width+data.b_width)*data.scale,data.height*data.scale,1,data.name[0].replace(' ','_')+'_导出');
});