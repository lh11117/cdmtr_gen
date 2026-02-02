var layer = layui.layer;
var util = layui.util;
var $ = layui.$;

var palette=[];
function getData(){
    $.ajax({
    url: "palette/chengdu.json",
    type: "GET",
    dataType: "json",
    success: function (response) {
        palette=response;
    },
    error: function (xhr, status, error) {
        console.error(error);
    },
    });
}
getData();

var lineChoose=document.getElementById('line-choose');
function getColor() {
  return new Promise((resolve, reject) => {
    if(palette){
        var index=layer.open({
            type: 1,
            area: [Math.min(window.innerWidth,600)+'px', Math.min(window.innerHeight,500)+'px'],
            content: $('#choose-color')
        });
        lineChoose.innerHTML='';
        var d=[];
        palette.forEach((e,i)=>{
            var option=document.createElement('option');
            option.innerText=`${e.name['zh-Hans'].split('/')[0]} ${e.name.en.split('/')[0]}`;
            if(i==0){
                option.selected='selected';
                d=e;
                var ele=document.getElementById('preview-color');
                ele.innerText=option.innerText;
                palette.forEach((e,i)=>{if(e.id==data.value){d=palette[i];}});
                if(d)ele.style.color=d.colour;
            }
            option.value=e.id;
            lineChoose.appendChild(option);
        });
        layui.form.render($('#line-choose'));
        layui.form.on('select(line-choose-filter)', function(data){
            var e=document.getElementById('preview-color');
            e.innerText=this.innerText;
            palette.forEach((e,i)=>{if(e.id==data.value){d=palette[i];}});
            if(d)e.style.color=d.colour;
        });
        document.querySelector('#choose-color>div>button.btn_ok').onclick=()=>{resolve(d);layer.close(index);};
        document.querySelector('#choose-color>div>button.btn_cancel').onclick=()=>{reject();layer.close(index);};
    }
    else{
        getData();
        layer.msg("加载失败, 请再试一遍");
        reject();
    }
  });
}

document.getElementsByName("btn-style").forEach(e=>{
    e.addEventListener("click",()=>{
        layer.open({
            type: 1,
            offset: 'r',
            anim: 'slideLeft',
            area: [Math.min(window.innerWidth,500)+'px', '100%'],
            maxWidth: "100%",
            shade: 0.1,
            shadeClose: true,
            move:false,
            content: $('#style1')
        });
    });
})

function new_file(){
    data = {
        name: ["2号线", "Line 2", "02"],
        color: "#EB5A35",
        stations: {},
        to_left: true,
        left_door: true,
        a_width: 600,
        height: 200,
        b_width: 600,
        a_top: 50,
        margin: 70,
        scale: 2,
        new: true,
        color_next: true
    };
    var rand1=Math.floor(Math.random()*114514);
    var rand2=Math.floor(Math.random()*114514);
    var rand3=Math.floor(Math.random()*114514);
    var s1=generate_randstr(),s2=generate_randstr(),s3=generate_randstr();
    data.start=s1;
    data.end=s3;
    data.stations[s1]={name:['新站点'+rand1,'New Station '+rand1],next:[s2],id:"01"};
    data.stations[s2]={name:['新站点'+rand2,'New Station '+rand2],back:[s1],next:[s3],id:"02"};
    data.stations[s3]={name:['新站点'+rand3,'New Station '+rand3],back:[s2],id:"03"};
    data.selected=s1;
    reset();
}

new_file();

document.getElementsByName("btn-new").forEach(e=>{
    e.addEventListener('click',()=>{
        
        layer.confirm("警告: 确定要新建项目吗? 如果您没有下载当前项目的JSON配置文件(并非图片), 当前项目可能会丢失",
            {
                btn: ['确定', '取消'],
                btn1: (index)=>{
                    new_file();
                    load(data);
                    layer.close(index);
                }
            });
    });
});

document.getElementsByName("btn-import").forEach(e=>{
    e.addEventListener('click',()=>{
        layer.confirm("警告: 确定要导入项目吗? 如果您没有下载当前项目的JSON配置文件(并非图片), 当前项目可能会丢失",
            {
                btn: ['确定', '取消'],
                btn1: (index)=>{
                    const input=document.createElement('input');
                    input.type='file';
                    input.accept='.json,application/json';
                    input.onchange=async()=>{
                        const file=input.files[0];
                        if(!file)return;
                        if(file.type!=='application/json'&&!file.name.toLowerCase().endsWith('.json')){layer.alert('请选择 JSON 文件');return;}
                        const text=await file.text();
                        data=JSON.parse(text);
                        update(data);
                        reset();
                    };
                    input.click();
                    layer.close(index);
                }
            });
    });
});

document.getElementById('choose-col-btn').addEventListener('click',()=>{
    getColor().then(e=>{
        document.getElementById('name0').value=e.name['zh-Hans'].split('/')[0];
        document.getElementById('name1').value=e.name.en.split('/')[0];
        document.getElementById('name2').value=((s)=>{return (s.length==1?'0':'')+s;})(e.name['zh-Hans'].split('/')[0].replace(/线+$/, '').replace(/号+$/, ''));
        document.getElementById('color').value=e.colour;
        UpdateInfo();
    });
});

var nindex=-1;
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
    var rand=Math.floor(Math.random()*114514);
    document.getElementById('new_zh_name').value='新站点'+rand;
    document.getElementById('new_en_name').value='New Station '+rand;
    layui.form.render($('#stas-choose'))
    if(nindex==-1){
        nindex=layer.open({
            type: 1,
            area: [Math.min(window.innerWidth,600)+'px', Math.min(window.innerHeight,500)+'px'],
            content: $('#new_sta_dialog'),
            end:()=>{nindex=-1;}
        });
    }
}

function generate_randstr(length=8) {
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
    var zh=document.getElementById('new_zh_name').value;
    var en=document.getElementById('new_en_name').value;
    if(v=='__start'){
        data.stations[data.start].back=[sname];
        data.stations[sname]={name:[zh,en],next:[data.start],id:"00"};
        data.start=sname;
    }else if(v=='__end'){
        data.stations[data.end].next=[sname];
        data.stations[sname]={name:[zh,en],back:[data.end],id:"00"};
        data.end=sname;
    }else{
        data.stations[data.stations[v].next].back=[sname];
        data.stations[sname]={name:[zh,en],back:[v],next:[data.stations[v].next],id:"00"};
        data.stations[v].next=[sname];
    }
    load(data);
}

function close_new_sta(){
    layer.close(nindex);
    nindex=-1;
}

function moveDown(arr,index) {
  if(index<0||index>=arr.length-1)return arr;
  [arr[index],arr[index+1]]=[arr[index + 1],arr[index]];
  return arr;
}

var dev=false;
if(location.href=='http://127.0.0.1:5500/index.html'){
    load(data);
    dev=true;
}else{
    layer.alert("本程序禁止商用！仅供车迷交流和娱乐，严禁用于商业用途！\n禁止生成违法内容！请用户对生成的内容负责！\n本程序生成的内容不代表官方，仅模仿官方风格。",
        {
            closeBtn:0,
            btn:['我已认真阅读并同意以上内容','我不同意以上内容'],
            btn1:(index)=>{layer.close(index);load(data);},
            btn2:()=>{dev=true;window.location.href = 'about:blank;'}
        })
}

var sindex=-1;

function load_sta(elem){
    if(sindex==-1){
        sindex=layer.open({
            type: 1,
            offset: 'r',
            anim: 'slideLeft',
            area: [Math.min(window.innerWidth,500)+'px', '100%'],
            shade: 0.1,
            shadeClose: true,
            move:false,
            end:()=>{sindex=-1;},
            content: $('#style2')
        });
    }
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
            if(c<=2&&e.srcElement.checked){e.srcElement.checked=!e.srcElement.checked;layer.alert("谁家地铁全线只开一个站啊?");return;}
            data.stations[elem.key].no_serve=e.srcElement.checked;
            update();
        }
    }
    document.getElementById("new_interchange").onclick=()=>{
        if(!data.stations[elem.key].interchange){data.stations[elem.key].interchange=[];}
        data.stations[elem.key].interchange.push(['1','#222a8c']);
        load_sta(elem);
        update();
    }
    document.getElementById("set_now").onclick=()=>{
        data.selected=elem.key;
        update();
        layer.msg('设置成功! ');
    }
    document.getElementById("dele").onclick=()=>{
    if(countB(data)<=2){layer.alert("无法删除车站!因为删除后启用的车站只会有一个,可能导致出现错误");return;}
    layer.confirm("是否要删除车站“"+elem.name[0]+"("+elem.name[1]+")”?这删除后无法撤销!", {
        btn: ['确定', '取消'],
        btn1:(index,_,__)=>{
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
            layer.close(index);
            layer.close(sindex);
            sindex=-1;
        }
    });
    }
    if(elem.interchange){
        var i=0;
        elem.interchange.forEach(e=>{
            const j=i++;
            var div=document.createElement('div');
            div.style.display='flex';
            div.style.alignItems='center';
            var inp=document.createElement('input');
            inp.classList.add('layui-input');
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
            col.classList.add('layui-input');
            col.type='color';
            col.value=e[1];
            var div1=document.createElement('button');
            div1.className='layui-btn layui-btn-primary layui-border-green layui-btn-sm';
            div1.innerHTML=`选择现有`;
            div1.onclick=()=>{
                getColor().then((e)=>{
                    data.stations[elem.key].interchange[j][0]=inp.value=e.name['zh-Hans'].split('/')[0].replace(/线+$/, '').replace(/号+$/, '');
                    data.stations[elem.key].interchange[j][1]=col.value=e.colour;
                    update();
                });
            }
            var div2=document.createElement('button');
            div2.className='layui-btn layui-btn-primary layui-border-green layui-btn-sm';
            div2.innerHTML=`删除`;
            div2.onclick=()=>{
                layer.confirm(`是否要删除车站“${elem.name[0]}(${elem.name[1]})”的<span style="color:${e[1]};">${e[0]}号线</span>换乘?`, {
                    btn: ['删除', '取消'],
                    btn1:function(index, layero, that){
                        data.stations[elem.key].interchange.splice(j,1);
                        if(data.stations[elem.key].interchange.length==0){
                            delete data.stations[elem.key].interchange;
                        }
                        load_sta(elem);
                        update();
                        layer.close(index);
                    }
                });
            }
            div.appendChild(inp);
            div.appendChild(col);
            div.appendChild(div1);
            div.appendChild(div2);
            if(j!=0){
                var div3=document.createElement('button');
                div3.onclick=()=>{
                    data.stations[elem.key].interchange=moveDown(data.stations[elem.key].interchange,j-1);
                    load_sta(elem);
                    update();
                }
                div3.innerHTML=`↑`;
                div3.className='layui-btn layui-btn-primary layui-border-green layui-btn-sm';
                div.appendChild(div3);
            }
            if(j!=elem.interchange.length-1){
                var div4=document.createElement('button');
                div4.onclick=()=>{
                    data.stations[elem.key].interchange=moveDown(data.stations[elem.key].interchange,j);
                    load_sta(elem);
                    update();
                }
                div4.innerHTML=`↓`;
                div4.className='layui-btn layui-btn-primary layui-border-green layui-btn-sm';
                div.appendChild(div4);
            }
            div.appendChild(document.createElement('br'));
            document.querySelector("#interchange").appendChild(div);
        });
    }
}

document.getElementsByName("btn-about").forEach(e=>{
    e.addEventListener("click",()=>{
        window.open('https://space.bilibili.com/3546630506678721');
    });
});



function load(data){
    var ele=document.getElementById('stations');
    ele.innerHTML='';
    var stations=loads(data);
    stations.forEach(e=>{
        const elem=e;
        var div=document.createElement('tr');
        div.classList.add('stas');
        var p1=document.createElement('td');
        p1.innerText=e.name[0]+(e.no_serve?' (未开通)':'');
        div.appendChild(p1);
        var p2=document.createElement('td');
        p2.innerText=e.name[1]+(e.no_serve?' (Not yet in service)':'');
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
    color_next.checked=data.color_next;
    new_style.checked=data.new;
    name0.value=data.name[0];
    name1.value=data.name[1];
    name2.value=data.name[2];
}


var timer=-1;
function update(){
    if(timer>0){clearTimeout(timer);}
    timer=setTimeout(()=>{var s=document.getElementsByTagName('html')[0].scrollTop;load(data);document.getElementsByTagName('html')[0].scrollTop=s;},300);
}

function UpdateInfo(){
        data.name=[name0.value,name1.value,name2.value];
        data.color=color.value;
        data.scale=parseFloat(scale.value);
        data.a_width=parseInt(a_width.value,10);
        data.b_width=parseInt(b_width.value,10);
        data.height=parseInt(height.value,10);
        data.margin=parseInt(margin.value,10);
        data.a_top=parseInt(a_top.value,10);
        data.left_door=left_door.checked;
        data.to_left=to_left.checked;
        data.color_next=color_next.checked;
        data.new=new_style.checked;
        update();
}
$("#style1 input").on("input",UpdateInfo);


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

document.getElementsByName('btn-download').forEach(e=>{
    e.addEventListener('click',()=>{
        downloadJSON(data,data.name[0]+'_导出.json');
    });
});

document.getElementsByName('btn-export').forEach(e=>{
    e.addEventListener('click',()=>{
        document.getElementById('file-name').value=data.name[0].replace(' ','_')+'_导出';
        const index=layer.open({type:1,content:$('#download-png')});
        document.querySelector('#download-png>div>button.btn_ok').onclick=()=>{layer.close(index);svg2png(document.querySelector("#draw").innerHTML,(data.a_width+data.b_width)*data.scale,data.height*data.scale,3,document.getElementById('file-name').value);};
        document.querySelector('#download-png>div>button.btn_cancel').onclick=()=>{layer.close(index);};
    });
});

window.addEventListener('beforeunload',(e)=>{if(!dev){e.preventDefault();e.returnValue='';}});
