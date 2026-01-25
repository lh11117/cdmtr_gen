document.querySelector("#style>.topbar>.b").addEventListener("click",()=>{
    document.querySelector("#style").classList.remove("show");
});

document.querySelector(".style.btn").addEventListener("click",()=>{
    document.querySelector("#style").classList.add("show");
    document.querySelector("#inner").classList.add("show");
    document.querySelector("#inner2").classList.remove("show");
});

function new_file(){
    data = {
        name: ["2号线", "Line 2", "02"],
        color: "#EB5A35",
        stations: {},
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
    var s1=generate_randstr(),s2=generate_randstr();
    data.start=s1;
    data.end=s2;
    data.stations[s1]={name:[s1,s1],next:[s2],id:"01"};
    data.stations[s2]={name:[s2,s2],back:[s1],id:"02"};
    data.selected=s1;
    reset();
}

new_file();

document.querySelector('.btn.new').addEventListener('click',()=>{
    if(confirm("警告: 确定要新建项目吗? 如果您没有下载当前项目的JSON配置文件(并非图片), 当前项目可能会丢失")){
        new_file();
        load(data);
    }
});

document.querySelector('.btn.import').addEventListener('click',()=>{
    if(confirm("警告: 确定要导入项目吗? 如果您没有下载当前项目的JSON配置文件(并非图片), 当前项目可能会丢失")){
        const input=document.createElement('input');
        input.type='file';
        input.accept='.json,application/json';
        input.onchange=async()=>{
            const file=input.files[0];
            if(!file)return;
            if(file.type!=='application/json'&&!file.name.toLowerCase().endsWith('.json')){alert('请选择 JSON 文件');return;}
            const text=await file.text();
            data=JSON.parse(text);
            update(data);
            reset();
        };
        input.click();
    }
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

function moveDown(arr,index) {
  if(index<0||index>=arr.length-1)return arr;
  [arr[index],arr[index+1]]=[arr[index + 1],arr[index]];
  return arr;
}

function load_sta(elem){
    document.querySelector("#style").classList.add("show");
    document.querySelector("#inner2").classList.add("show");
    document.querySelector("#inner").classList.remove("show");
    document.querySelector("#key").innerText=elem.key;
    document.querySelector("#zh_name").value=elem.name[0];
    document.querySelector("#en_name").value=elem.name[1];
    document.querySelector("#number").value=elem.id;
    document.querySelector("#serve").checked=elem.no_serve?true:false;
    document.querySelector("#interchange").innerHTML='';
    {
        document.querySelector("#zh_name").oninput=(e)=>{
            data.stations[elem.key].name[0]=e.srcElement.value;
            update();
        }
        document.querySelector("#en_name").oninput=(e)=>{
            data.stations[elem.key].name[1]=e.srcElement.value;
            update();
        }
        document.querySelector("#number").oninput=(e)=>{
            data.stations[elem.key].id=e.srcElement.value;
            update();
        }
        document.querySelector("#serve").oninput=(e)=>{
            var c=countB(data);
            console.log(c);
            if(c<=2&&e.srcElement.checked){e.srcElement.checked=!e.srcElement.checked;return alert("谁家地铁全线只开一个站啊?");}
            data.stations[elem.key].no_serve=e.srcElement.checked;
            update();
        }
    }
    document.getElementById("new_interchange").onclick=()=>{
        if(!data.stations[elem.key].interchange){data.stations[elem.key].interchange=[];}
        data.stations[elem.key].interchange.push(['1','#000']);
        load_sta(elem);
        update();
    }
    document.getElementById("set_now").onclick=()=>{
        data.selected=elem.key;
        update();
    }
    document.getElementById("dele").onclick=()=>{
        if(countB(data)<=2){alert("无法删除车站!因为删除后启用的车站只会有一个,可能导致出现错误");return;}
        if(confirm("是否要删除车站“"+elem.name[0]+"("+elem.name[1]+")”?这删除后无法撤销!")){
            if(elem.key==data.start){
                data.start=data.stations[elem.key].next;
                delete data.stations[data.stations[elem.key].next].back;
            }else if(elem.key==data.end){
                data.end=data.stations[elem.key].back;
                delete data.stations[data.stations[elem.key].back].next;
            }else{
                data.stations[data.stations[elem.key].back].next=data.stations[elem.key].next;
                data.stations[data.stations[elem.key].next].back=data.stations[elem.key].back;
            }
            if(data.selected==elem.key){data.selected=data.start;}
            update();
        }
    }
    if(elem.interchange){
        var i=0;
        elem.interchange.forEach(e=>{
            const j=i++;
            var div=document.createElement('div');
            div.style.display='flex';
            div.style.alignItems='center';
            var inp=document.createElement('input');
            inp.oninput=(e)=>{
                data.stations[elem.key].interchange[j][0]=e.srcElement.value;
                update();
            }
            inp.value=e[0];
            var col=document.createElement('input');
            col.oninput=(e)=>{
                data.stations[elem.key].interchange[j][1]=e.srcElement.value;
                update();
            }
            col.type='color';
            col.value=e[1];
            var div2=document.createElement('div');
            div2.classList.add('btn');
            div2.innerText='删除换乘';
            div2.onclick=()=>{
                console.log(data.stations[elem.key].interchange);
                if(confirm("是否要删除车站“"+elem.name[0]+"("+elem.name[1]+")”的"+e[0]+"号线换乘?")){data.stations[elem.key].interchange.splice(j,1);if(data.stations[elem.key].interchange.length==0){delete data.stations[elem.key].interchange;}load_sta(elem);update();}
            }
            div.appendChild(inp);
            div.appendChild(col);
            div.appendChild(div2);
            if(j!=0){
                var div3=document.createElement('div');
                div3.onclick=()=>{
                    data.stations[elem.key].interchange=moveDown(data.stations[elem.key].interchange,j-1);
                    load_sta(elem);
                    update();
                }
                div3.classList.add('btn');
                div3.innerText='↑';
                div.appendChild(div3);
            }
            if(j!=elem.interchange.length-1){
                var div4=document.createElement('div');
                div4.onclick=()=>{
                    data.stations[elem.key].interchange=moveDown(data.stations[elem.key].interchange,j);
                    load_sta(elem);
                    update();
                }
                div4.classList.add('btn');
                div4.innerText='↓';
                div.appendChild(div4);
            }
            div.appendChild(document.createElement('br'));
            document.querySelector("#interchange").appendChild(div);
        });
    }
}

function load(data){
    var ele=document.getElementById('stations');
    ele.innerHTML='';
    var stations=loads(data);
    stations.forEach(e=>{
        const elem=e;
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
        div.style.cursor='pointer';
        div.addEventListener("click",()=>{
            load_sta(elem);
        });
    });
    generate(data);
}
load(data);
function reset(){
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
    if(e.tagName!='INPUT')return;
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