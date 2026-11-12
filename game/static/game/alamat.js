(()=>{'use strict';
const T=32,W=640,H=480,$=i=>document.getElementById(i),cv=$('g'),c=cv.getContext('2d');cv.width=W;cv.height=H;c.imageSmoothingEnabled=false;
const P={navy:'#142638',forest:'#397A57',fern:'#83B66A',teal:'#317F91',sand:'#D7B779',gold:'#F1C66A',cyan:'#76D8D2',violet:'#75538C',off:'#F5F0E7',wood:'#8A5A34',dk:'#5A3A22',roof:'#B5573A',bamb:'#B98A4E'};
let sd=7;const rnd=()=>{sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const mk=(w,h)=>{const e=document.createElement('canvas');e.width=w;e.height=h;const x=e.getContext('2d');x.imageSmoothingEnabled=false;return[e,x]};
const R=(x,a,b,w,h,f)=>{x.fillStyle=f;x.fillRect(a|0,b|0,w,h)};
const E=(x,cx,cy,rx,ry,f)=>{x.fillStyle=f;for(let j=-ry;j<=ry;j++)for(let i=-rx;i<=rx;i++)if(i*i*ry*ry+j*j*rx*rx<=rx*rx*ry*ry)x.fillRect(Math.round(cx+i),Math.round(cy+j),1,1)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let waiter=null;const nextKey=()=>new Promise(r=>{waiter=r});
const pause=ms=>new Promise(r=>{const t=setTimeout(()=>{waiter=null;r()},ms);waiter=()=>{clearTimeout(t);r()}});

/* ---------- optional image assets ----------
   Drop PNGs into game/static/game/assets; failed/missing images keep procedural art.
   The browser loads assets relative to this script, including Django's STATIC_URL. */
const ASSET_BASE=new URL('assets/',document.currentScript?.src||location.href);
const images=new Map();
function asset(path,fallback){
 if(!images.has(path)){
  const img=new Image();images.set(path,{img,ready:false});
  img.onload=()=>{
   const entry=images.get(path);
   if(path==='characters/player'){
    // The source pack uses pale cyan eye pixels that look white at game scale.
    // Darken only that exact eye-pixel palette color; keep the rest of the art.
    const [sprite,ctx]=mk(img.width,img.height);
    ctx.drawImage(img,0,0);
    const pixels=ctx.getImageData(0,0,img.width,img.height);
    for(let i=0;i<pixels.data.length;i+=4){
     if(pixels.data[i]===187&&pixels.data[i+1]===245&&pixels.data[i+2]===245&&pixels.data[i+3]===255){
      pixels.data[i]=63;pixels.data[i+1]=47;pixels.data[i+2]=44;
     }
    }
    ctx.putImageData(pixels,0,0);entry.img=sprite;
   }
   entry.ready=true;
   // Map backgrounds were baked before the image arrived; regenerate their tiles.
   if(path.startsWith('tiles/')&&typeof MAPS!=='undefined')Object.values(MAPS).forEach(bake);
  };
  img.onerror=()=>{images.get(path).missing=true};
  img.src=new URL(path+'.png',ASSET_BASE).href;
 }
 const item=images.get(path);
 return item.ready&&item.img.width>0&&item.img.height>0?item.img:fallback;
}
const TILE_NAMES=['grass','forest_grass','dirt','sand','water','tall_grass','dark_grass'];
function drawActor(ctx,pal,dir,frame,x,y){
 const key=pal.id==='pl'?'characters/player':'characters/'+pal.id;
 const fallback=charSprite(pal,dir,frame),img=asset(key,fallback);
 if(img===fallback){ctx.drawImage(fallback,x,y);return}
 // Sprite sheet: four columns (frames), four rows (down/up/left/right), 64x64 cells.
 // Legacy Szadi player sheets were exported in side/back/front/mirrored-side order.
 // The game's movement direction order is down/up/left/right.
 const sourceDir=pal.id==='pl'?[2,1,0,0][dir]:dir;
 if(img.width===128&&img.height===192){
  // Source row 0 faces left; flip that row horizontally to face right.
  if(pal.id==='pl'&&dir===3){
   ctx.save();ctx.translate(x+48,y+15);ctx.scale(-1,1);
   ctx.drawImage(img,(frame%4)*32,0,32,48,0,0,32,48);
   ctx.restore();
  }else ctx.drawImage(img,(frame%4)*32,sourceDir*48,32,48,x+16,y+15,32,48);
 }
 else if(img.width>=256&&img.height>=256)ctx.drawImage(img,(frame%4)*64,sourceDir*64,64,64,x,y,64,64);
 else ctx.drawImage(img,x,y,64,64); // single-frame portraits are also supported
}
function drawObject(ctx,o,x,y){
 // Forest assets are 4x4 atlases of 128x128 trees (last cell intentionally blank).
 // Keep collisions on the single trunk tile; draw the canopy above neighboring tiles.
 // The scene's existing Y-depth sorting puts characters in front of/behind trunks.
 if(o.tree&&(o.spr===S_.tree||o.spr===S_.btree)){
  const sheet=asset('environment/forest/'+(o.spr===S_.btree?'bare':'green'),null);
  if(sheet&&sheet.width>=512&&sheet.height>=512){
   const variant=((Math.imul(o.x+1,73856093)^Math.imul(o.y+1,19349663))>>>0)%15;
   const size=112,srcX=(variant%4)*128,srcY=Math.floor(variant/4)*128;
   ctx.drawImage(sheet,srcX,srcY,128,128,
    Math.round(x+o.spr.width/2-size/2),Math.round(y+o.spr.height-size),size,size);
   return;
  }
 }
 // Fully assembled building PNGs avoid transparent atlas seams and duplicate doors.
 // Explicit asset IDs support new buildings independently of their map coordinates.
 if(o.buildingAsset){
  const picture=asset('environment/buildings/finished/'+o.buildingAsset,null);
  if(picture){ctx.drawImage(picture,x,y,o.spr.width,o.spr.height);return}
 }
 // Legacy buildings still resolve by map position until migrated to explicit asset IDs.
 if(o.spr.assetKey==='buildings/house'){
  const houseName={
   '6,6':'home',
   '26,4':'research',
   '5,18':'healing',
   '12,6':'neighbor_a',
   '33,19':'neighbor_b'
  }[o.x+','+o.y];
  if(houseName){
   const picture=asset('environment/buildings/finished/'+houseName,null);
   if(picture){
    ctx.drawImage(picture,x,y,o.spr.width,o.spr.height);
    return;
   }
  }
 }
 const key=o.spr.assetKey;
 const img=key?asset('environment/'+key,o.spr):o.spr;
 ctx.drawImage(img,x,y,o.spr.width,o.spr.height);
}

/* ---------- tiles ---------- */
const TC=[['#83B66A','#97C67C','#74A85F'],['#5E9A5C','#4D8A4F','#6BA866'],['#C9A56B','#B8935A','#D9B97F'],['#D7B779','#E3C98F','#C8A767'],['#317F91','#4A9BAE','#296B7C'],['#4E9A55','#2F7A3F','#6DB060'],['#3B6B4A','#2E5A3E','#4B7B52']];
const TL=TC.map((q,id)=>{const[e,x]=mk(T,T);R(x,0,0,T,T,q[0]);for(let i=0;i<26;i++)R(x,rnd()*T,rnd()*T,2,2,q[1+(i&1)]);
 if(id===5)for(let i=0;i<9;i++){const a=rnd()*28|0,b=10+rnd()*18|0;R(x,a,b,2,8,q[1]);R(x,a+2,b-3,2,7,q[2])}
 if(id===4)for(let i=0;i<3;i++)R(x,rnd()*22,rnd()*30,9,2,P.cyan);return e});
const[WA,wax]=mk(T,T);wax.drawImage(TL[4],8,0);wax.drawImage(TL[4],-24,0);

/* ---------- sprites ---------- */
const SC={};
function charSprite(p,dir,f){const k=p.id+dir+f;if(SC[k])return SC[k];const[e,x]=mk(64,64),cx=32,by=61,sk='#E0A878',st=f===1?2:f===3?-2:0,side=dir>1;
 E(x,cx,by-1,12,4,'rgba(20,38,56,.35)');
 const leg=(ox,dy)=>{R(x,cx+ox,by-17+dy,6,11,p.pants);R(x,cx+ox-1,by-7+dy,8,7,p.boots)};
 if(side){leg(-6+st,0);leg(0-st,0)}else{leg(-8,st>0?-2:0);leg(2,st<0?-2:0)}
 R(x,cx-10,by-35,20,19,p.top);R(x,cx-10,by-19,20,3,p.trim);
 if(!side){R(x,cx-13,by-34,4,14,p.top);R(x,cx+9,by-34,4,14,p.top);R(x,cx-13,by-21,4,3,sk);R(x,cx+9,by-21,4,3,sk)}
 else R(x,cx-2+st,by-33,5,14,p.top);
 if(dir===0){for(let i=0;i<16;i++)R(x,cx-8+i,by-34+i,3,2,P.dk);R(x,cx+6,by-24,9,9,P.wood)}
 else if(dir===1)R(x,cx-5,by-31,10,11,P.wood);
 else R(x,cx+(dir===2?4:-12),by-27,8,9,P.wood);
 E(x,cx,by-43,9,9,sk);
 if(dir===0){R(x,cx-9,by-53,18,7,p.hair);R(x,cx-10,by-48,3,6,p.hair);R(x,cx+7,by-48,3,6,p.hair);R(x,cx-5,by-43,2,3,P.navy);R(x,cx+3,by-43,2,3,P.navy)}
 else if(dir===1)E(x,cx,by-44,9,9,p.hair);
 else{E(x,cx+(dir===2?3:-3),by-45,8,8,p.hair);R(x,cx+(dir===2?-6:4),by-43,2,3,P.navy)}
 return SC[k]=e}
const PL={id:'pl',top:'#2C6E72',trim:P.sand,pants:'#8A7355',boots:P.dk,hair:'#1B1B24'};
function house(w,h,roof,wall){const WW=w*T,HH=(h+1)*T,[e,x]=mk(WW,HH),dt=w>>1,rh=Math.round(HH*.5),wy=rh-6;
 R(x,2,HH-8,WW-4,8,'rgba(20,38,56,.3)');for(let i=0;i<w;i++)R(x,i*T+5,HH-12,5,12,P.dk);
 R(x,6,wy,WW-12,HH-wy-12,wall);for(let i=10;i<WW-8;i+=7)R(x,i,wy,1,HH-wy-12,'rgba(60,40,20,.25)');R(x,6,HH-16,WW-12,4,P.wood);
 for(let r=0;r<rh;r++){const ins=Math.round((1-r/rh)*WW*.3);R(x,ins,4+r,WW-2*ins,1,roof);if(r%6<2)R(x,ins,4+r,WW-2*ins,1,'rgba(255,255,255,.14)')}
 R(x,2,rh+4,WW-4,4,roof);R(x,2,rh+8,WW-4,2,'rgba(0,0,0,.3)');
 R(x,dt*T+3,HH-44,26,32,P.dk);R(x,dt*T+23,HH-30,3,3,P.gold);R(x,dt*T,HH-12,T,4,P.sand);
 if(w>=5){for(const wx of[16,WW-34]){R(x,wx,wy+14,18,16,'#2A4A52');R(x,wx+2,wy+16,14,12,P.cyan)}}e.assetKey='buildings/house';return e}
function palm(){const[e,x]=mk(64,96);E(x,32,92,12,3,'rgba(20,38,56,.3)');
 for(let y=94;y>34;y--){const o=Math.round(Math.sin((94-y)/20)*4);R(x,30+o,y,6,1,y%7===0?P.dk:P.wood)}
 const cx=34,cy=34;[-170,-130,-95,-60,-20,15].forEach((a,i)=>{const r=a*Math.PI/180;for(let t=0;t<26;t++)E(x,cx+Math.cos(r)*t,cy+Math.sin(r)*t*.6+t*t/45,2,2,i%2?P.forest:'#2F7A4A')});
 E(x,cx-3,cy+3,3,3,P.dk);E(x,cx+3,cy+4,3,3,P.dk);return e}
function tree(dk){const[e,x]=mk(64,96);E(x,32,92,14,3,'rgba(20,38,56,.3)');R(x,27,56,10,38,P.wood);R(x,27,56,3,38,P.dk);if(dk){R(x,22,88,6,6,P.wood);R(x,36,88,6,6,P.wood)}
 const a=dk?['#24543D','#1E4632','#3B7A55']:[P.forest,'#2F6B49',P.fern];E(x,32,36,24,22,a[1]);E(x,20,44,15,13,a[0]);E(x,44,44,15,13,a[0]);E(x,32,30,19,17,a[0]);E(x,26,26,9,8,a[2]);return e}
const S_={};
S_.lantern=(()=>{const[e,x]=mk(32,64);E(x,16,60,8,2,'rgba(20,38,56,.3)');R(x,15,22,3,38,P.dk);R(x,10,10,12,14,P.gold);R(x,12,12,8,10,'#FFF3B0');R(x,9,8,14,3,P.dk);E(x,16,17,15,15,'rgba(241,198,106,.18)');return e})();
S_.well=(()=>{const[e,x]=mk(32,48);E(x,16,42,14,4,'rgba(20,38,56,.3)');R(x,4,26,24,16,'#9AA0A8');R(x,6,28,20,10,'#6B7078');R(x,4,10,3,18,P.wood);R(x,25,10,3,18,P.wood);R(x,2,6,28,6,P.roof);return e})();
S_.fence=(()=>{const[e,x]=mk(32,32);R(x,2,12,4,18,P.wood);R(x,26,12,4,18,P.wood);R(x,0,16,32,3,P.bamb);R(x,0,23,32,3,P.bamb);return e})();
S_.sign=(()=>{const[e,x]=mk(32,48);R(x,14,20,4,26,P.dk);R(x,4,8,24,16,P.bamb);R(x,4,8,24,3,P.wood);R(x,8,14,16,2,P.dk);R(x,8,18,12,2,P.dk);return e})();
S_.stall=(()=>{const[e,x]=mk(128,96);R(x,0,52,128,40,P.bamb);R(x,0,52,128,4,P.wood);for(let i=0;i<8;i++)R(x,i*16,8,16,30,i%2?P.off:P.teal);R(x,0,38,128,4,'rgba(0,0,0,.25)');[[20,P.gold],[44,P.roof],[70,P.fern],[96,P.cyan]].forEach(([a,f])=>E(x,a,50,7,5,f));return e})();
S_.palm=palm();S_.tree=tree(0);S_.btree=tree(1);
S_.shrine=(()=>{const[e,x]=mk(96,96);E(x,48,90,28,4,'rgba(20,38,56,.35)');R(x,20,50,56,40,P.wood);R(x,24,54,48,32,'#C9B48A');R(x,42,70,12,20,P.dk);R(x,10,40,76,14,P.roof);R(x,18,30,60,12,P.roof);R(x,28,20,40,12,P.roof);R(x,38,10,20,12,P.gold);E(x,48,16,6,6,P.cyan);return e})();

// Fixed filenames for environmental objects; generated art remains the fallback.
for(const key of Object.keys(S_))S_[key].assetKey='objects/'+key;

/* ---------- creatures ---------- */
/* Species / moves / type chart are served by Django (game/data/game_data.json) */
const DATA=JSON.parse(document.getElementById('alamat-data').textContent),SP=DATA.species,MV=DATA.moves,TYPE_EFF=DATA.type_chart,LIM=DATA.limits;
const DEX_ORDER=DATA.dex_order||Object.keys(SP),ATTRIBUTE_NAMES=DATA.attribute_names||{};
const typeName=t=>ATTRIBUTE_NAMES[t]||t;
const winsAgainst=t=>Object.keys(TYPE_EFF[t]||{}).filter(x=>TYPE_EFF[t][x]>1);
const weakTo=t=>Object.keys(TYPE_EFF).filter(x=>TYPE_EFF[x]?.[t]>1);

const statsFor=(id,lv)=>{const s=SP[id],k=1+(lv-5)*0.08;return{max:Math.round(s.hp*k),atk:Math.round(s.atk*k),def:Math.round(s.def*k),spd:Math.round(s.spd*k)}};
const movesFor=(id,lv)=>{const s=SP[id];return[s.a,s.up&&lv>=s.up_lv?s.up:'Tackle','Soothe']};
const mkC=(id,lv=5)=>{const s=SP[id],st=statsFor(id,lv);
 return{id,n:s.n,t:s.t,lv,xp:0,next:lv*LIM.xp_per_level,hp:st.max,dh:st.max,max:st.max,atk:st.atk,def:st.def,spd:st.spd,mv:movesFor(id,lv)}};
const CR={
tarsilaw(x){E(x,16,21,9,8,'#8B6B4A');E(x,16,23,5,5,'#C9A27A');E(x,16,12,9,7,'#8B6B4A');R(x,8,4,4,5,'#8B6B4A');R(x,20,4,4,5,'#8B6B4A');E(x,11,12,4,4,P.gold);E(x,21,12,4,4,P.gold);R(x,10,11,2,4,P.navy);R(x,20,11,2,4,P.navy);R(x,15,15,2,1,P.dk);R(x,6,26,4,2,P.dk);R(x,22,26,4,2,P.dk);R(x,25,18,5,2,'#8B6B4A');R(x,28,14,2,5,'#8B6B4A')},
agilunos(x){E(x,8,19,4,7,'#4B3320');E(x,24,19,4,7,'#4B3320');E(x,16,19,7,8,'#6B4A2B');E(x,16,22,4,5,'#D9C3A0');E(x,16,9,6,6,P.off);R(x,13,2,6,3,P.off);R(x,14,10,4,2,P.gold);R(x,15,12,2,2,P.gold);R(x,12,8,2,2,P.navy);R(x,18,8,2,2,P.navy);R(x,12,27,3,3,P.gold);R(x,18,27,3,3,P.gold)},
bagaon(x){E(x,16,20,10,8,'#3A3442');E(x,16,25,6,3,'#FF7A2E');E(x,16,11,6,5,'#4A4252');R(x,9,5,3,5,'#4A4252');R(x,20,5,3,5,'#4A4252');R(x,12,10,2,2,'#FF7A2E');R(x,18,10,2,2,'#FF7A2E');R(x,10,17,2,6,'#FF7A2E');R(x,21,15,2,5,'#FF7A2E');R(x,15,18,2,4,'#FF7A2E');R(x,6,26,6,3,'#3A3442');R(x,20,26,6,3,'#3A3442')},
alitaptap(x){E(x,10,11,5,3,P.cyan);E(x,22,11,5,3,P.cyan);E(x,16,17,6,5,'#2F4A3A');E(x,16,24,5,4,P.gold);E(x,16,24,3,2,'#FFF3B0');E(x,16,11,4,4,'#2F4A3A');R(x,13,10,2,2,P.off);R(x,18,10,2,2,P.off)},
lumot(x){E(x,16,21,11,8,'#4B7B52');E(x,16,16,8,5,'#6DB060');R(x,11,20,3,3,P.navy);R(x,19,20,3,3,P.navy);R(x,12,13,2,2,P.gold);R(x,19,14,2,2,P.off);R(x,15,24,3,1,P.navy)},
pakpak(x){E(x,7,16,7,4,P.violet);E(x,25,16,7,4,P.violet);E(x,16,18,5,7,'#5A4A5E');E(x,16,11,5,5,'#5A4A5E');R(x,11,4,3,5,'#5A4A5E');R(x,18,4,3,5,'#5A4A5E');R(x,13,10,2,2,P.cyan);R(x,17,10,2,2,P.cyan);R(x,15,13,2,1,P.off)},
bato(x){E(x,16,20,11,9,'#7A6B5A');E(x,16,22,7,6,'#9A8B7A');R(x,8,12,4,6,'#7A6B5A');R(x,20,12,4,6,'#7A6B5A');R(x,11,16,2,2,P.navy);R(x,19,16,2,2,P.navy);R(x,14,24,4,2,P.dk);R(x,6,28,6,2,'#5A4A3A');R(x,20,28,6,2,'#5A4A3A')},
dagat(x){E(x,16,20,10,8,'#2A6A8A');E(x,16,22,6,5,'#4A9ABA');E(x,10,12,5,5,'#2A6A8A');E(x,22,12,5,5,'#2A6A8A');R(x,12,14,2,2,P.off);R(x,18,14,2,2,P.off);R(x,14,18,4,2,P.cyan);R(x,8,26,5,3,'#1A4A6A');R(x,19,26,5,3,'#1A4A6A')}
};
function genericCreature(x,id){
 const t=SP[id]?.t||'Nature',a={Spark:'#e5ce56',Shadow:'#544570',Light:'#e8d09b',Earth:'#9b7757',Wind:'#92c9bb',Nature:'#6b9d53',Water:'#5e9cca',Fire:'#db734e'}[t]||'#8f9a78';
 E(x,16,20,11,9,a);E(x,16,11,8,7,a);E(x,9,5,4,5,a);E(x,23,5,4,5,a);
 R(x,11,11,3,3,P.navy);R(x,19,11,3,3,P.navy);
 E(x,12,27,4,3,P.dk);E(x,22,27,4,3,P.dk);
 const h=Array.from(id).reduce((n,c)=>n+c.charCodeAt(0),0);
 if(h%2)R(x,25,18,6,3,a);if(h%3)E(x,16,20,5,4,P.off);
}
const CS={};const crSpr=id=>asset('creatures/'+id,CS[id]||(()=>{const[e,x]=mk(32,32);(CR[id]||((ctx)=>genericCreature(ctx,id)))(x);return CS[id]=e})());
// Optional battle-specific artwork: enemy front / allied back.
// Missing files retain the existing 32x32 procedural creature sprite.
// Dedicated art locations (new names first; legacy names remain supported).
function battleSprite(id,view){
 return asset('creatures/'+id+'/battle/'+view,
   asset('creatures/'+id+'/battle_'+view,crSpr(id)));
}
function uiSprite(id){
 return asset('creatures/'+id+'/menu',
   battleSprite(id,'front'));
}
function drawUiCreature(id,x,y,w,h){
 const img=uiSprite(id);
 c.drawImage(img,0,0,img.width,img.height,x,y,w,h);
}
function paintBattleCreature(ctx,id,view,x,y,size){
 const img=battleSprite(id,view);
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(img,0,0,img.width,img.height,x,y,size,size);
}


/* ---------- maps ---------- */
const DIRV=[[0,1],[0,-1],[-1,0],[1,0]],tileAt=(m,x,y)=>x<0||y<0||x>=m.w||y>=m.h?4:m.g[y*m.w+x];
const newMap=(name,w,h,b)=>({name,w,h,g:new Uint8Array(w*h).fill(b),sol:new Uint8Array(w*h),objs:[],npcs:[],exits:[],enc:null,dark:0});
const fill=(m,id,x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&j>=0&&i<m.w&&j<m.h)m.g[j*m.w+i]=id};
function place(m,spr,x,y,w,h,ex){const o=Object.assign({x,y,w,h,spr,px:x*T+w*T/2-spr.width/2,py:(y+h)*T-spr.height,sy:(y+h)*T},ex||{});
 for(let j=0;j<h;j++)for(let i=0;i<w;i++)m.sol[(y+j)*m.w+x+i]=1;m.objs.push(o);return o}
// Pocket Atlas Essentials, 8 columns of 32px cells. Optional local asset:
 // game/static/game/assets/tiles/pocket_atlas.png (256x192)
const TERRAIN_BASE={0:0,1:0,2:5,3:6,4:7,5:0,6:0};
const TERRAIN_EDGE_START={2:9,3:21,4:33};
function tileHash(x,y){return (Math.imul(x+1,73856093)^Math.imul(y+1,19349663))>>>0}
function terrainCell(ctx,atlas,index,x,y){
 ctx.drawImage(atlas,(index%8)*T,Math.floor(index/8)*T,T,T,x,y,T,T);
}
function terrainIndex(m,i,j,id){
 if(![0,1,5,6].includes(id))return TERRAIN_BASE[id];
 // Cardinal neighbors of foreign terrain: edges, then external corners.
 // Each transition is a full 32x32 tile, never a transparent overlay.
 for(const other of [2,3,4]){
  const n=tileAt(m,i,j-1)===other,e=tileAt(m,i+1,j)===other;
  const so=tileAt(m,i,j+1)===other,w=tileAt(m,i-1,j)===other;
  const count=Number(n)+Number(e)+Number(so)+Number(w);
  const start=TERRAIN_EDGE_START[other];
  if(count===1)return start+(n?0:e?1:so?2:3);
  if(count===2){
   if(n&&e)return start+4; if(e&&so)return start+5;
   if(so&&w)return start+6; if(w&&n)return start+7;
  }
 }
 const h=tileHash(i,j)%16;
 return id===0?(h===0?1:h===1?2:h===2?3:h===3?4:0):
        id===5?(h%3===0?4:0):0;
}
function bake(m){
 const[e,x]=mk(m.w*T,m.h*T);
 const atlas=asset('tiles/pocket_atlas',null);
 const hasAtlas=!!(atlas&&atlas.width===256&&atlas.height===192);
 for(let j=0;j<m.h;j++)for(let i=0;i<m.w;i++){
  const id=m.g[j*m.w+i],px=i*T,py=j*T;
  if(hasAtlas){
   terrainCell(x,atlas,terrainIndex(m,i,j,id),px,py);
   // Forest and encounter terrain remain distinct. Darkening never changes collision.
   if(id===1||id===6){
    x.fillStyle=id===6?'rgba(18,52,37,.35)':'rgba(25,70,43,.15)';
    x.fillRect(px,py,T,T);
   }
   if(id===5){
    for(let k=0;k<7;k++){
     const ox=(tileHash(i+k,j+k*3)%27)+2,oy=10+(tileHash(j+k,i+k*7)%18);
     R(x,px+ox,py+oy,2,7,'#386d34');
     R(x,px+ox+2,py+oy+2,1,4,'#63973a');
    }
   }
  }else{
   x.drawImage(asset('tiles/'+TILE_NAMES[id],TL[id]),px,py,T,T);
   if(id===0&&rnd()<.06)R(x,px+rnd()*28,py+rnd()*28,3,3,[P.gold,P.off,'#E58BA5',P.violet][rnd()*4|0]);
   if(id===4&&tileAt(m,i,j-1)===3)R(x,px,py,T,3,'rgba(245,240,231,.7)');
  }
 }
 m.gl=e;
}
const npcAt=(m,x,y)=>m.npcs.find(n=>n.x===x&&n.y===y);
const canWalk=(m,x,y)=>x>=0&&y>=0&&x<m.w&&y<m.h&&!m.sol[y*m.w+x]&&tileAt(m,x,y)!==4&&!npcAt(m,x,y);
function scatter(m,spr,n,ok,ex){for(let i=0;i<n;i++){const x=1+rnd()*(m.w-2)|0,y=1+rnd()*(m.h-4)|0;if(ok(x,y)&&!m.sol[y*m.w+x])place(m,spr,x,y,1,1,Object.assign({tree:1},ex))}}
function buildVillage(){const m=newMap('Lumina Village',40,30,0);
 for(let i=0;i<220;i++)fill(m,1,rnd()*38|0,rnd()*22|0,2+(rnd()*3|0),1+(rnd()*2|0));
 for(let x=0;x<40;x++){const s=Math.round(22.5+Math.sin(x/3)*1.2);fill(m,3,x,s,1,2);fill(m,4,x,s+2,1,30-s-2)}
 fill(m,2,3,15,35,2);fill(m,2,19,0,2,23);fill(m,2,16,12,8,7);
 m.exits.push({x:19,y:0,to:'F',tx:14,ty:22,dir:1},{x:20,y:0,to:'F',tx:15,ty:22,dir:1});
 place(m,house(5,4,P.roof,P.bamb),6,6,5,4,{say:['Your modest coastal home. Rest here to fully heal your party.'],at:[8,9],heal:1});
 place(m,house(8,6,P.teal,'#C9B48A'),26,4,8,6,{nm:'Research Center',say:['Lumina Research Center. Guardians study the Lilim here. (Interior coming later.)'],at:[30,9]});
 place(m,house(6,5,'#2F7A5A','#D9C7A0'),5,18,6,5,{nm:'Healing House',say:['Herbs and rest. Speak with Nanay Dina outside.'],at:[8,22]});
 // Potion Shop: reuse the former market area; 192x160 art on a 6x4 footprint.
 // Entrance at (28,20) is accessible from the south, (28,21).
 place(m,house(6,4,P.roof,'#B98A74'),25,17,6,4,{
  buildingAsset:'potion_shop',nm:'Herb & Potion Shop',
  say:['Welcome to the Herb & Potion Shop! Healing remedies and supplies will be available in a future update.'],
  at:[28,20]
 });
place(m,S_.well,18,13,1,1,{say:['A cool, clear well. The water glimmers faintly.']});
 place(m,S_.lantern,17,12,1,1);place(m,S_.lantern,22,12,1,1);
 place(m,S_.sign,18,2,1,1,{nm:'Sign',say:['Balete Forest ↑ North. Wild creatures roam the tall grass.']});
 place(m,S_.sign,21,19,1,1,{nm:'Sign',say:['Lumina Village. Mind the tide.']});
 for(const x of[3,4,5,34,35,36])place(m,S_.fence,x,14,1,1);
 const ok=(x,y)=>[0,1].includes(tileAt(m,x,y))&&!(x>=15&&x<=24&&y>=11&&y<=19)&&!(y>=14&&y<=17)&&!(x>=18&&x<=21);
 for(let x=3;x<38;x+=4)if(canWalk(m,x,21)&&tileAt(m,x,21)<4&&!(x>=18&&x<=21))place(m,S_.palm,x,21,1,1,{tree:1});
 scatter(m,S_.tree,40,ok);scatter(m,S_.palm,14,ok);
 for(let y=1;y<22;y+=3){if(ok(0,y)&&!m.sol[y*40])place(m,S_.tree,0,y,1,1,{tree:1});if(ok(39,y)&&!m.sol[y*40+39])place(m,S_.tree,39,y,1,1,{tree:1})}
 m.npcs.push({id:'luz',name:'Ate Luz',x:21,y:14,dir:2,pal:{id:'luz',top:P.off,trim:P.teal,pants:'#3B4A6B',boots:P.dk,hair:'#3A2A20'}},
  {id:'dina',name:'Nanay Dina',x:12,y:16,dir:0,pal:{id:'dina',top:'#B5573A',trim:P.gold,pants:'#6B5A4A',boots:P.dk,hair:'#9AA0A8'}},
  {id:'tonyo',name:'Mang Tonyo',x:30,y:16,dir:1,pal:{id:'tonyo',top:P.gold,trim:P.roof,pants:'#4A5A3A',boots:P.dk,hair:'#1B1B24'}});
 m.exits.forEach(e=>{m.sol[e.y*m.w+e.x]=0});
 bake(m);return m}
function buildForest(){const m=newMap('Balete Forest',30,24,6);
 for(let i=0;i<120;i++)fill(m,1,rnd()*30|0,rnd()*24|0,1+(rnd()*3|0),1);
 fill(m,5,6,12,8,7);fill(m,5,17,5,7,8);fill(m,5,4,3,6,6);fill(m,2,14,0,2,24);
 /* deeper grass near shrine path */
 fill(m,5,12,8,6,5);
 m.exits.push({x:14,y:23,to:'V',tx:19,ty:1,dir:0},{x:15,y:23,to:'V',tx:20,ty:1,dir:0},
  {x:14,y:0,to:'S',tx:7,ty:10,dir:1},{x:15,y:0,to:'S',tx:8,ty:10,dir:1});
 m.enc=DATA.encounters?.F||['alitaptap','lumot','pakpak','bato'];m.dark=1;
 place(m,S_.sign,13,3,1,1,{nm:'Sign',say:['The Ancient Shrine lies beyond the northern path.']});
 const ok=(x,y)=>[1,6].includes(tileAt(m,x,y))&&y<21&&!(x>=13&&x<=16);
 for(let x=0;x<30;x+=2){if(ok(x,0)&&x!==14&&x!==15)place(m,S_.tree,x,0,1,1,{tree:1})}
 for(let y=1;y<22;y+=2){if(ok(0,y))place(m,S_.tree,0,y,1,1,{tree:1});if(ok(29,y))place(m,S_.tree,29,y,1,1,{tree:1})}
 scatter(m,S_.tree,55,ok);
 m.exits.forEach(e=>{m.sol[e.y*m.w+e.x]=0});
 bake(m);return m}
function buildShrine(){const m=newMap('Ancient Shrine',16,12,6);
 fill(m,2,6,0,4,12);fill(m,5,2,4,4,4);fill(m,5,10,4,4,4);
 m.exits.push({x:7,y:11,to:'F',tx:14,ty:1,dir:0},{x:8,y:11,to:'F',tx:15,ty:1,dir:0});
 m.enc=DATA.encounters?.S||['alitaptap','dagat','bato','pakpak'];m.dark=1;
 place(m,S_.shrine,5,2,3,3,{nm:'Ancient Shrine',say:['Weathered stone. Faint light pulses from the altar. The Lilim’s influence is strong here… (Full shrine quest later.)'],at:[7,4]});
 place(m,S_.btree,1,1,1,1,{tree:1});place(m,S_.btree,14,1,1,1,{tree:1});
 place(m,S_.btree,1,8,1,1,{tree:1});place(m,S_.btree,14,8,1,1,{tree:1});
 m.exits.forEach(e=>{m.sol[e.y*m.w+e.x]=0});
 bake(m);return m}
const V=buildVillage(),F=buildForest(),SH=buildShrine(),FF=Array.from({length:30},()=>({x:rnd()*960,y:rnd()*768,o:rnd()*6}));
const MAPS={V,F,S:SH};
sd=(Date.now()^Math.floor(Math.random()*4294967296))|0; /* world generation stays deterministic; encounters/battles do not */

/* ---------- state ---------- */
const S={mode:'title',map:V,mapId:'V',p:{x:19,y:17,px:19*T,py:17*T,tx:0,ty:0,dir:0,mv:0,f:0,ft:0},
 party:[],storage:[],dex:[],selyo:3,herbs:2,f:{},busy:false,fade:0,t:0,insp:false,msg:null};
let DG=null,U=null,B=null,PARTY=null,DEX=null,STORAGE=null;const held={up:0,down:0,left:0,right:0};
const TALK={};
const tx=(s,x,y,col,sz,al)=>{c.font='bold '+(sz||18)+'px "Trebuchet MS",system-ui,sans-serif';c.fillStyle=col||P.navy;c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y)};
const box=(x,y,w,h)=>{c.fillStyle='rgba(245,240,231,.97)';c.fillRect(x,y,w,h);c.strokeStyle=P.navy;c.lineWidth=3;c.strokeRect(x+1.5,y+1.5,w-3,h-3);c.strokeStyle=P.teal;c.lineWidth=2;c.strokeRect(x+6,y+6,w-12,h-12)};
const wrap=(s,w)=>{const o=[];let l='';for(const t of s.split(' ')){const q=l?l+' '+t:t;if(c.measureText(q).width>w&&l){o.push(l);l=t}else l=q}o.push(l);return o};
const bar=(x,y,w,v)=>{c.fillStyle=P.navy;c.fillRect(x,y,w,10);c.fillStyle=v>.5?'#4E9A55':v>.2?P.gold:'#C8452B';c.fillRect(x+2,y+2,Math.max(0,(w-4)*v),6)};
// Small pixel-art attribute emblems and heart. Text labels stay visible for accessibility.
const ATTR_STYLE={
 Fire:['#bc4b2e','#ffdc90'],Water:['#277da5','#b4ecff'],Earth:['#83664a','#e2c18c'],
 Nature:['#4d8c57','#d4f2a6'],Wind:['#4c92a2','#d5f8ff'],Spark:['#a37b22','#fff4a0'],
 Light:['#d2a53a','#fffbe0'],Shadow:['#67528b','#e7d2ff']
};
const attrGlyph={Fire:'♨',Water:'◆',Earth:'▲',Nature:'✿',Wind:'≋',Spark:'ϟ',Light:'✦',Shadow:'☾'};
const badgeType=(t,x,y,size=19)=>{
 const [bg,fg]=ATTR_STYLE[t]||['#667482','#ffffff'];
 c.fillStyle=P.navy;c.fillRect(Math.round(x),Math.round(y),size,size);
 c.fillStyle=bg;c.fillRect(Math.round(x)+2,Math.round(y)+2,size-4,size-4);
 c.font='bold '+Math.round(size*.8)+'px sans-serif';
 c.textAlign='center';c.textBaseline='middle';c.fillStyle=fg;
 c.fillText(attrGlyph[t]||'?',x+size/2,y+size/2+1);
 c.textBaseline='alphabetic';
};
function hpHeart(x,y,size=13){
 const u=Math.max(1,Math.round(size/7));
 const rows=['0110110','1111111','1111111','0111110','0011100','0001000'];
 c.fillStyle='#c74342';
 rows.forEach((row,j)=>{for(let i=0;i<7;i++)if(row[i]==='1')c.fillRect(Math.round(x)+i*u,Math.round(y)+j*u,u,u)});
}
function healthBar(x,y,w,hp,max,icon=true){
 const start=x+(icon?23:0);
 if(icon)hpHeart(x,y-1,14);
 bar(start,y,w-(icon?23:0),Math.max(0,Math.min(1,hp/Math.max(1,max))));
}
const xpBar=(x,y,w,v)=>{c.fillStyle=P.navy;c.fillRect(x,y,w,6);c.fillStyle=P.teal;c.fillRect(x+1,y+1,Math.max(0,(w-2)*v),4)};

/* ---------- save / load: Django is the source of truth ---------- */
const CFG=JSON.parse(document.getElementById('alamat-config').textContent);
const LOCAL_KEY='alamat_backup_v3_'+CFG.username;           /* offline fallback only */
const cloud={state:'loading',has:false,rev:0,conflict:false};
const statusEl=$('status');
function notify(t,ttl){S.msg={t,ttl:ttl||120};statusEl.textContent=t}
const getCookie=n=>{const m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):''};
const toLogin=()=>{notify('Session expired. Redirecting to sign in…',300);setTimeout(()=>{location.href=CFG.loginUrl+'?next='+encodeURIComponent(location.pathname)},1500)};
async function api(method,body){
 const r=await fetch(CFG.saveUrl,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json','X-CSRFToken':getCookie('csrftoken')},body:body?JSON.stringify(body):undefined});
 let j=null;try{j=await r.json()}catch(e){}
 if(r.status===401||r.status===403){const e=new Error('auth');e.auth=true;throw e}
 if(r.status===409){const e=new Error('conflict');e.conflict=true;e.body=j;throw e}
 if(!r.ok){const e=new Error((j&&j.detail)||('HTTP '+r.status));e.body=j;throw e}
 return j}
const snapshot=()=>JSON.parse(JSON.stringify({party:S.party,storage:S.storage,dex:S.dex,selyo:S.selyo,herbs:S.herbs,f:S.f,mapId:S.mapId,x:S.p.x,y:S.p.y,dir:S.p.dir}));
const hasLocal=()=>{try{return !!localStorage.getItem(LOCAL_KEY)}catch(e){return false}};
const canContinue=()=>cloud.has||(cloud.state==='offline'&&hasLocal());
function applySave(d){S.party=d.party||[];S.storage=d.storage||[];S.dex=DEX_ORDER.filter(id=>(d.dex||[]).includes(id)||S.party.some(c=>c.id===id)||S.storage.some(c=>c.id===id));DEX=null;STORAGE=null;S.selyo=d.selyo??3;S.herbs=d.herbs??2;S.f=d.f||{};
 const mid=MAPS[d.mapId]?d.mapId:'V';S.mapId=mid;S.map=MAPS[mid];S.p.x=d.x??19;S.p.y=d.y??17;S.p.dir=d.dir??0;
 S.p.px=S.p.x*T;S.p.py=S.p.y*T;S.p.mv=0;S.mode='world';S.fade=0;fadeTarget=null;S.loading=null;S.safe=4}
function startNew(){applySave({});S.msg=null}
async function saveGame(manual){
 if(cloud.conflict){if(manual)notify('Another session saved first. Press F9 to load the latest save.',240);return false}
 const snap=snapshot();try{localStorage.setItem(LOCAL_KEY,JSON.stringify(snap))}catch(e){}
 try{const j=await api('PUT',{data:snap,revision:cloud.rev});cloud.rev=j.revision;cloud.has=true;cloud.state='ready';
  if(manual)notify('Game saved to your account.');return true}
 catch(e){
  if(e.auth){toLogin();return false}
  if(e.conflict){cloud.conflict=true;notify('Another session saved first. Press F9 to load the latest save.',300);return false}
  const first=cloud.state!=='offline';cloud.state='offline';
  if(manual||first)notify(manual?'Server unreachable: saved on this device only.':'Offline: progress is kept on this device.',160);
  return false}}
async function loadGame(silent){
 try{const j=await api('GET');cloud.rev=j.revision;cloud.conflict=false;cloud.state='ready';cloud.has=!!j.exists;
  if(!j.exists){if(!silent)notify('No save found.');return false}
  applySave(j.data);if(!silent)notify('Game loaded.');return true}
 catch(e){
  if(e.auth){toLogin();return false}
  cloud.state='offline';
  try{const raw=localStorage.getItem(LOCAL_KEY);if(raw){applySave(JSON.parse(raw));notify('Offline: loaded the backup stored on this device.',200);return true}}catch(e2){}
  notify('Could not reach the server.',160);return false}}
let autoT=null;
function queueAutosave(){if(!S.f.starter)return;clearTimeout(autoT);autoT=setTimeout(()=>saveGame(false),1500)}
/* look up the account's save as soon as the page opens (title screen waits for it) */
api('GET').then(j=>{cloud.rev=j.revision;cloud.has=!!j.exists;cloud.state='ready'}).catch(e=>{if(e.auth)toLogin();else cloud.state='offline'});

/* ---------- dialogue / menus ---------- */
async function talk(name,lines){for(const l of lines){DG={n:name,t:l,i:0};for(;;){await nextKey();if(DG.i<DG.t.length)DG.i=DG.t.length;else break}}DG=null}
async function chooseUI(u,n,back){for(;;){const a=await nextKey();if(a==='left'||a==='up')u.sel=(u.sel+n-1)%n;else if(a==='right'||a==='down')u.sel=(u.sel+1)%n;else if(a==='ok')return u.sel;else if(a==='back'&&back)return -1}}
async function pickStarter(){U={ids:['tarsilaw','agilunos','bagaon'],sel:0};const i=await chooseUI(U,3);const id=U.ids[i];U=null;return id}
const objective=()=>!S.f.starter?'Speak with Ate Luz on the plaza':!S.f.bonded?'Go north into Balete Forest and bond with a wild creature':!S.f.shrine?'Visit the Ancient Shrine north of the forest':!S.f.done?'Return to Ate Luz':'Chapter complete. Explore freely!';
TALK.luz=async()=>{const f=S.f;
 if(!f.starter){await talk('Ate Luz',['Welcome to Lumina Village, traveler! I’m Luz, a guardian-researcher on Isla Maharlika.','Strange disturbances — the Lilim — are spreading through Balete Forest. You shouldn’t go alone.','Choose a partner creature to travel with.']);
  const id=await pickStarter();S.party.push(mkC(id,5));S.dex=DEX_ORDER.filter(x=>x===id||S.dex.includes(x));f.starter=true;
  await talk('Ate Luz',[SP[id].n+' it is! Look after each other.','Head north to Balete Forest. Wild creatures hide in the tall grass.','Lower their HP, use Soothe to build Trust, then offer a Selyo to bond.','Press P anytime to check your party. F5 saves your progress.'])}
 else if(f.bonded&&f.shrine&&!f.done){f.done=true;await talk('Ate Luz',['You formed a bond and reached the shrine! That’s how we’ll restore habitats the Lilim has disturbed.','Chapter complete. Thank you for testing the prototype! Explore freely or start a new journey.'])}
 else if(f.bonded&&!f.shrine)await talk('Ate Luz',['Good work bonding. The Ancient Shrine is north of the forest — see what you can learn there.']);
 else if(f.done)await talk('Ate Luz',['The deeper source of the Lilim still waits. Next chapter!']);
 else await talk('Ate Luz',['The forest is north of the plaza. Remember: Soothe first, then bond with a Selyo.'])};
TALK.dina=async()=>{S.party.forEach(q=>{q.hp=q.max;q.dh=q.max});await talk('Nanay Dina',['You look tired. Rest a moment…','There. Your companions are fully healed!'])};
TALK.tonyo=async()=>{if(!S.f.gift){S.f.gift=1;S.selyo+=3;S.herbs+=2;await talk('Mang Tonyo',['Fresh Selyo, handmade! Here, 3 on the house — and a couple of healing herbs.','Use herbs from the Party menu (P) if you’re hurt far from home.'])}
 else if(S.selyo<5){S.selyo+=2;await talk('Mang Tonyo',['Still short on Selyo? Take two more. Use them wisely!'])}
 else await talk('Mang Tonyo',['Selyo are precious. Use them wisely! The forest grows denser near the shrine.'])};

/* ---------- leveling ---------- */
function gainXP(cr,amount){cr.xp+=amount;let leveled=false;
 while(cr.xp>=cr.next&&cr.lv<LIM.max_level){cr.xp-=cr.next;cr.lv++;cr.next=cr.lv*LIM.xp_per_level;
  const st=statsFor(cr.id,cr.lv);cr.max=st.max;cr.atk=st.atk;cr.def=st.def;cr.spd=st.spd;cr.hp=cr.max;cr.dh=cr.max;leveled=true;
  const s=SP[cr.id];if(s.up&&cr.lv>=s.up_lv&&!cr.mv.includes(s.up))cr.mv[1]=s.up}
 if(cr.lv>=LIM.max_level)cr.xp=Math.min(cr.xp,cr.next-1);
 return leveled}

/* ---------- battle ---------- */
const say=t=>{B.msg=t;return pause(900)};
const menu=async o=>{B.ui={opts:o,sel:0};const i=await chooseUI(B.ui,o.length,1);B.ui=null;return i};
function typeMult(atkType,defType){const t=TYPE_EFF[atkType];return t&&t[defType]!=null?t[defType]:1}
async function act(a,d,mv,pl){const m=MV[mv];
 if(m.k){if(pl){B.trust=Math.min(5,B.trust+1);await say(a.n+' soothes '+d.n+'… Trust '+B.trust+'/5')}else await say(a.n+' watches warily.');return}
 if(m.def){a.dmod=Math.min(1.69,(a.dmod||1)*1.3);await say(a.n+' hardens its stance! Defense up.');return}
 const mult=typeMult(m.t||'Normal',d.t);const dmg=Math.max(1,Math.round(m.p*a.atk/(d.def*(d.dmod||1)+2)*(.85+rnd()*.3)*mult));
 await say(a.n+' used '+mv+'!'+(mult>1?' Super effective!':mult<1?' Not very effective…':''));
 B.hit=pl?'foe':'me';d.hp=Math.max(0,d.hp-dmg);await pause(400);B.hit=''}
async function faint(){await say(B.me.n+' fainted!');const nx=S.party.find(q=>q.hp>0);if(!nx)return false;B.me=nx;await say('Go, '+nx.n+'!');return true}
async function battle(fid){S.busy=true;await fade(1);S.mode='battle';
 const wildLv=5+Math.floor(rnd()*3)+(S.mapId==='S'?2:0);const foe=mkC(fid,wildLv);
 B={foe,me:S.party.find(q=>q.hp>0)||S.party[0],msg:'',ui:null,trust:0,hit:''};
 await fade(0);await say('A wild '+foe.n+' (Lv'+foe.lv+') appeared!');let res='';
 const foeAtk=async()=>{const mi=foe.hp/foe.max<.35&&rnd()<.4?1:0;await act(foe,B.me,foe.mv[mi]||foe.mv[0],false);return B.me.hp>0?true:await faint()};
 while(!res){B.msg='What will '+B.me.n+' do?';const a=await menu(['Fight','Bond','Items','Switch','Run']);
  if(a===0){const mi=await menu(B.me.mv);if(mi<0)continue;const mv=B.me.mv[mi];
   const lead=B.me;
   const playerTurn=async()=>{await act(B.me,foe,mv,true);if(foe.hp<=0){await say(foe.n+' was defeated!');
     const base=SP[fid].xp||30;const gained=Math.round(base*(foe.lv/B.me.lv));const up=gainXP(B.me,gained);
     await say(B.me.n+' gained '+gained+' XP!'+(up?' Level up! Now Lv'+B.me.lv+'!':''));res='win'}};
   const foeTurn=async()=>{if(!await foeAtk())res='lose'};
   /* faster foe goes first; if it KOs your lead, the forced swap uses up your turn (no move from the wrong creature) */
   if(foe.spd>B.me.spd){await foeTurn();if(!res&&B.me===lead)await playerTurn()}
   else{await playerTurn();if(!res)await foeTurn()}}
  else if(a===1){if(S.party.length>=LIM.max_party&&S.storage.length>=LIM.max_storage){await say('Your Party and Storage are full! Make room first.');continue}if(S.selyo<=0){await say('You have no Selyo left!');continue}
   S.selyo--;await say('You offer a Selyo to '+foe.n+'…');
   const hpFactor=(1-foe.hp/foe.max)*0.55;const trustFactor=B.trust*0.09;const ch=Math.min(.92,Math.max(.06,.18+hpFactor+trustFactor));
   if(rnd()<ch){await say('Bond formed! '+foe.n+' trusts you now.');S.f.bonded=true;
    const recruit=mkC(fid,foe.lv);recruit.hp=Math.max(1,Math.floor(foe.hp));recruit.dh=recruit.hp;
    if(S.party.length<LIM.max_party){S.party.push(recruit);await say(foe.n+' joined your party!')}
    else if(S.storage.length<LIM.max_storage){S.storage.push(recruit);await say(foe.n+' was sent to Storage! ('+S.storage.length+'/'+LIM.max_storage+')')}
    S.dex=DEX_ORDER.filter(x=>x===fid||S.dex.includes(x));
    res='bond';break}
   await say('The bond slipped away…');if(!await foeAtk())res='lose'}
  else if(a===2){/* items */const opts=[];if(S.herbs>0)opts.push('Herb (heal)');opts.push('Cancel');
   const ii=await menu(opts);if(ii<0||opts[ii]==='Cancel')continue;
   if(opts[ii].startsWith('Herb')){S.herbs--;const heal=Math.round(B.me.max*0.4);B.me.hp=Math.min(B.me.max,B.me.hp+heal);B.me.dh=B.me.hp;
    await say('Used a Herb! '+B.me.n+' recovered '+heal+' HP.');if(!await foeAtk())res='lose'}}
  else if(a===3){const al=S.party.filter(q=>q.hp>0&&q!==B.me);if(!al.length){await say('No other creature can fight!');continue}
   const i=await menu(al.map(q=>q.n+' Lv'+q.lv));if(i<0)continue;B.me=al[i];await say('Go, '+B.me.n+'!');if(!await foeAtk())res='lose'}
  else if(a===4){const runCh=Math.min(.9,0.4+(B.me.spd-foe.spd)*0.04+rnd()*0.2);if(rnd()<runCh){await say('You slipped away safely!');res='run'}
   else{await say('Couldn’t escape!');if(!await foeAtk())res='lose'}}}
 if(res==='lose'){await say('You blacked out…');S.party.forEach(q=>{q.hp=q.max;q.dh=q.max})}
 await fade(1);if(res==='lose')loadMap(V,19,17,0);S.mode='world';B=null;S.party.forEach(q=>{delete q.dmod});S.safe=4;await fade(0);S.busy=false;queueAutosave()}
let fadeTarget=null;
async function fade(to){
  fadeTarget=to;
  // Drive fade via the game loop (more reliable than a tight async while)
  while(fadeTarget!==null&&Math.abs(S.fade-fadeTarget)>.02){
    await sleep(16);
  }
  if(fadeTarget!==null){S.fade=fadeTarget;fadeTarget=null}
}
function tickFade(){
  if(fadeTarget===null)return;
  const d=fadeTarget-S.fade;
  if(Math.abs(d)<=.12){S.fade=fadeTarget;fadeTarget=null;return} /* snap within one step; the old <.03 test let 0.12 steps oscillate forever (0.96 <-> 1.08) */
  S.fade+=Math.sign(d)*.12;
}

/* ---------- party menu ---------- */
async function openParty(){if(!S.party.length){S.msg={t:'No party yet. Talk to Ate Luz.',ttl:100};return}
 S.busy=true;PARTY={sel:0,mode:'list'};
 for(;;){const a=await nextKey();
  if(a==='menu-switch'||!PARTY)return;
  if(PARTY.mode==='list'){if(a==='up'||a==='left')PARTY.sel=(PARTY.sel+S.party.length-1)%S.party.length;
   else if(a==='down'||a==='right')PARTY.sel=(PARTY.sel+1)%S.party.length;
   else if(a==='ok'){PARTY.mode='act';PARTY.actSel=0}
   else if(a==='back'){PARTY=null;S.busy=false;return}}
  else if(PARTY.mode==='act'){const acts=['Summary','Use Herb','Close'];
   if(a==='up'||a==='left')PARTY.actSel=(PARTY.actSel+acts.length-1)%acts.length;
   else if(a==='down'||a==='right')PARTY.actSel=(PARTY.actSel+1)%acts.length;
   else if(a==='back')PARTY.mode='list';
   else if(a==='ok'){const act=acts[PARTY.actSel];
    if(act==='Close'){PARTY=null;S.busy=false;return}
    if(act==='Summary'){PARTY.mode='summary'}
    if(act==='Use Herb'){if(S.herbs<=0){S.msg={t:'No herbs left.',ttl:80};PARTY.mode='list';continue}
     const cr=S.party[PARTY.sel];if(cr.hp>=cr.max){S.msg={t:cr.n+' is already full HP.',ttl:80};PARTY.mode='list';continue}
     S.herbs--;const heal=Math.round(cr.max*0.45);cr.hp=Math.min(cr.max,cr.hp+heal);cr.dh=cr.hp;
     S.msg={t:cr.n+' recovered '+heal+' HP. Herbs left: '+S.herbs,ttl:100};PARTY.mode='list'}}}
  else if(PARTY.mode==='summary'){if(a==='ok'||a==='back')PARTY.mode='list'}}}

/* ---------- world ---------- */
function loadMap(m,x,y,d){const p=S.p;S.map=m;S.mapId=m===V?'V':m===F?'F':'S';p.x=x;p.y=y;p.px=x*T;p.py=y*T;p.dir=d;p.mv=0;p.f=0;S.fade=0;fadeTarget=null;S.safe=4}
async function warp(e){if(S._warping)return;S._warping=true;S.busy=true;const p=S.p;
 try{
  if(e.to==='F'&&!S.f.starter){await talk('',['You should speak with Ate Luz first. She’s on the plaza.']);p.y=1;p.py=T;p.dir=0;S.fade=0;fadeTarget=null;S.busy=false;S._warping=false;return}
  if(e.to==='S'&&!S.f.bonded){await talk('',['The path feels sealed… Bond with a creature first.']);p.y=1;p.py=T;p.dir=0;S.fade=0;fadeTarget=null;S.busy=false;S._warping=false;return}
  const dest=MAPS[e.to]||V;
  const placeName=(dest&&dest.name)||'somewhere new';
  S.loading={name:placeName,phase:'out'};
  await fade(1);
  if(!dest||!dest.gl){S.loading=null;S.fade=0;fadeTarget=null;S.busy=false;S._warping=false;S.msg={t:'Map failed to load.',ttl:120};return}
  loadMap(dest,e.tx,e.ty,e.dir);
  S.loading={name:placeName,phase:'in'};
  await sleep(280);
  await fade(0);
  S.loading=null;
 }catch(err){console.error('warp error',err);S.fade=0;fadeTarget=null;S.loading=null;S.mode='world'}
 S.busy=false;S._warping=false;queueAutosave()}
function arrive(){const p=S.p,m=S.map;if(!m)return;
 const e=m.exits.find(q=>q.x===p.x&&q.y===p.y);if(e){warp(e);return}
 if(m.name==='Ancient Shrine'&&!S.f.shrine){S.f.shrine=true;queueAutosave()}
 if(S.safe>0){S.safe--;return}
 if(m.enc&&tileAt(m,p.x,p.y)===5&&S.party.length&&rnd()<.18)battle(m.enc[rnd()*m.enc.length|0])}
function tryMove(d){const p=S.p,i={down:0,up:1,left:2,right:3}[d];p.dir=i;const nx=p.x+DIRV[i][0],ny=p.y+DIRV[i][1];if(canWalk(S.map,nx,ny)){p.tx=nx;p.ty=ny;p.mv=.0001}}
async function interact(){const m=S.map,p=S.p,x=p.x+DIRV[p.dir][0],y=p.y+DIRV[p.dir][1],n=npcAt(m,x,y);
 if(n){S.busy=true;n.dir=p.dir^1;await TALK[n.id]();S.busy=false;return}
 const o=m.objs.find(o=>o.say&&x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h&&(!o.at||(o.at[0]===x&&o.at[1]===y)));
 if(o){S.busy=true;if(o.heal){S.party.forEach(q=>{q.hp=q.max;q.dh=q.max});await talk('',['You rest at home. Your party is fully healed.']);}
  else await talk(o.nm||'',o.say);S.busy=false}}
function update(dt){S.t+=dt;if(DG)DG.i=Math.min(DG.t.length,DG.i+dt/25);if(S.msg){S.msg.ttl-=dt/16;if(S.msg.ttl<=0)S.msg=null}
 if(S.mode!=='world'||PARTY||DEX||STORAGE)return;const p=S.p;
 if(p.mv){p.mv+=dt/170;if(p.mv>=1){p.mv=0;p.x=p.tx;p.y=p.ty;p.px=p.x*T;p.py=p.y*T;arrive()}else{p.px=(p.x+(p.tx-p.x)*p.mv)*T;p.py=(p.y+(p.ty-p.y)*p.mv)*T;p.ft+=dt;p.f=((p.ft/110)|0)%4}return}
 p.f=0;if(S.busy)return;for(const d of['up','down','left','right'])if(held[d]){tryMove(d);break}}

/* ---------- draw ---------- */
function drawWorld(){const m=S.map,p=S.p,cx=Math.max(0,Math.min(m.w*T-W,Math.round(p.px+16-W/2))),cy=Math.max(0,Math.min(m.h*T-H,Math.round(p.py+16-H/2)));
 c.drawImage(m.gl,cx,cy,W,H,0,0,W,H);
 if(!images.get('tiles/pocket_atlas')?.ready&&(S.t/600|0)%2)for(let j=cy/T|0;j<=(cy+H)/T;j++)for(let i=cx/T|0;i<=(cx+W)/T;i++)if(tileAt(m,i,j)===4&&i<m.w&&j<m.h)c.drawImage(asset('tiles/water',WA),i*T-cx,j*T-cy,T,T);
 const L=m.objs.map(o=>({sy:o.sy,fn:()=>drawObject(c,o,o.px-cx,o.py-cy)}));
 m.npcs.forEach(n=>L.push({sy:n.y*T+T,fn:()=>drawActor(c,n.pal,n.dir,0,n.x*T+16-32-cx,n.y*T+T-63-cy)}));
 L.push({sy:p.py+T,fn:()=>drawActor(c,PL,p.dir,p.f,Math.round(p.px+16-32-cx),Math.round(p.py+T-63-cy))});
 L.sort((a,b)=>a.sy-b.sy).forEach(q=>q.fn());
 if(m.dark){c.fillStyle='rgba(8,20,32,.28)';c.fillRect(0,0,W,H);for(const f of FF){const x=f.x+Math.sin(S.t/700+f.o)*20-cx,y=f.y+Math.cos(S.t/900+f.o)*14-cy;if(x>-8&&x<W+8&&y>-8&&y<H+8){c.fillStyle='rgba(118,216,210,.25)';c.fillRect(x-3,y-3,7,7);c.fillStyle=P.cyan;c.fillRect(x-1,y-1,3,3)}}}
 if(S.insp){c.fillStyle='rgba(220,50,50,.35)';for(let j=cy/T|0;j<=(cy+H)/T;j++)for(let i=cx/T|0;i<=(cx+W)/T;i++)if(i<m.w&&j<m.h&&(m.sol[j*m.w+i]||tileAt(m,i,j)===4))c.fillRect(i*T-cx,j*T-cy,T,T);
  c.fillStyle='rgba(241,198,106,.5)';m.exits.forEach(e=>c.fillRect(e.x*T-cx,e.y*T-cy,T,T));tx('tile '+S.p.x+','+S.p.y+' · '+m.name,8,H-8,'#fff',14)}
 c.fillStyle='rgba(20,38,56,.78)';c.fillRect(8,8,W-16,30);tx(m.name+' · '+objective(),18,29,P.off,14);tx('Selyo ×'+S.selyo+'  Herb ×'+S.herbs,W-18,29,P.gold,14,'right')}
function drawPick(){if(!U)return;c.fillStyle='rgba(20,38,56,.82)';c.fillRect(0,0,W,H);tx('Choose your partner',W/2,52,P.gold,28,'center');
 U.ids.forEach((id,i)=>{const s=SP[id],x=26+i*204,sel=U.sel===i;c.fillStyle=sel?P.gold:P.off;c.fillRect(x-4,76-4,188,308);c.fillStyle=P.off;c.fillRect(x,76,180,300);c.fillStyle=P.navy;c.fillRect(x,76,180,28);tx(s.n,x+90,97,P.off,18,'center');
  c.fillStyle='rgba(118,216,210,.25)';c.fillRect(x+8,112,164,150);drawUiCreature(id,x+26,118+(sel?Math.sin(S.t/200)*3:0),128,128);
  badgeType(s.t,x+39,269,21);tx(typeName(s.t),x+100,286,P.teal,16,'center');hpHeart(x+25,301,14);tx('HP '+s.hp+'  ATK '+s.atk,x+46,312,P.navy,14);tx('DEF '+s.def+'  SPD '+s.spd,x+90,334,P.navy,14,'center');tx(sel?'Press Enter':'',x+90,362,P.roof,14,'center')});
 tx('◀ ▶ to look · Enter to choose (original species)',W/2,430,P.off,15,'center')}
function drawDlg(){if(!DG)return;box(16,372,608,96);if(DG.n){c.fillStyle=P.teal;c.fillRect(30,354,160,26);tx(DG.n,40,373,P.off,16)}
 c.font='bold 18px "Trebuchet MS",system-ui,sans-serif';let n=DG.i|0;wrap(DG.t,556).forEach((l,i)=>{tx(l.slice(0,Math.max(0,n)),32,408+i*26,P.navy,18);n-=l.length+1});
 if((DG.i|0)>=DG.t.length&&((S.t/400)|0)%2)tx('▼',598,456,P.teal,16)}
function drawBattle(){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#142638');g.addColorStop(.52,'#317F91');g.addColorStop(.53,'#3B6B4A');g.addColorStop(1,'#2E5A3E');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle='rgba(20,38,56,.35)';for(const[x,y,w]of[[470,240,110],[160,360,130]]){c.beginPath();c.ellipse(x,y,w,16,0,0,7);c.fill()}
 for(const q of[B.foe,B.me])q.dh+=(q.hp-q.dh)*.15;
 const bob=Math.sin(S.t/300)*3,sh=B.hit==='foe'&&((S.t/60|0)%2)?8:0,sm=B.hit==='me'&&((S.t/60|0)%2)?8:0;
 paintBattleCreature(c,B.foe.id,'front',390+sh,70+bob,160);paintBattleCreature(c,B.me.id,'back',70+sm,176-bob,192);
 // Badge sits immediately after the name, never floating at the far edge of the panel.
 box(24,24,270,64);
 tx(B.foe.n,40,52,P.navy,18);
 badgeType(B.foe.t,Math.min(219,40+c.measureText(B.foe.n).width+10),35,18);
 tx('Lv'+B.foe.lv,270,52,P.teal,14,'right');
 healthBar(40,62,236,B.foe.dh,B.foe.max);
 box(346,236,270,78);
 tx(B.me.n,362,260,P.navy,18);
 badgeType(B.me.t,Math.min(541,362+c.measureText(B.me.n).width+10),244,18);
 tx('Lv'+B.me.lv,600,260,P.teal,14,'right');
 healthBar(362,270,236,B.me.dh,B.me.max);
 // HP and Trust are the only battle status indicators here.
 // XP remains available in Party; the old unlabeled XP bar resembled a loading bar
 // and touched the bottom border of the status card.
 tx('HP '+Math.ceil(B.me.dh)+'/'+B.me.max+'  ·  '+typeName(B.me.t)+'  ·  Trust '+B.trust+'/5',362,297,P.navy,13);
 // Three properly spaced action rows, including Run, stay inside the battle panel.
 box(16,356,608,112);
 c.save();c.beginPath();c.rect(28,369,586,87);c.clip();
 c.font='bold 17px "Trebuchet MS",system-ui,sans-serif';
 wrap(B.msg,B.ui?273:558).slice(0,3).forEach((l,i)=>tx(l,32,390+i*25,P.navy,17));
 if(B.ui)B.ui.opts.forEach((o,i)=>{
  const x=340+(i%2)*136,y=371+Math.floor(i/2)*30;
  if(B.ui.sel===i){c.fillStyle=P.gold;c.fillRect(x-3,y-1,128,27)}
  c.font='bold 15px "Trebuchet MS",system-ui,sans-serif';
  c.fillStyle=P.navy;c.textAlign='left';c.textBaseline='alphabetic';
  c.fillText(o,x+7,y+19,112);
 });
 c.restore();}
function drawParty(){if(!PARTY)return;c.fillStyle='rgba(20,38,56,.88)';c.fillRect(0,0,W,H);
 box(40,30,560,400);tx('Party',W/2,62,P.navy,24,'center');
 S.party.forEach((cr,i)=>{const y=90+i*90,sel=PARTY.sel===i&&PARTY.mode!=='summary';
  if(sel){c.fillStyle='rgba(241,198,106,.35)';c.fillRect(60,y-8,520,82)}
  drawUiCreature(cr.id,70,y,64,64);
  tx(cr.n+'  Lv'+cr.lv,150,y+22,P.navy,18);badgeType(cr.t,447,y+4,19);tx(typeName(cr.t),473,y+21,P.teal,14);healthBar(150,y+32,280,cr.hp,cr.max);
  tx('HP '+cr.hp+'/'+cr.max+'   ATK '+cr.atk+' DEF '+cr.def+' SPD '+cr.spd,150,y+58,P.navy,13);
  xpBar(150,y+66,200,cr.xp/cr.next)});
 if(PARTY.mode==='act'){const acts=['Summary','Use Herb','Close'];box(380,300,200,110);
  acts.forEach((a,i)=>{if(PARTY.actSel===i){c.fillStyle=P.gold;c.fillRect(396,318+i*28,168,26)}tx(a,410,338+i*28,P.navy,16)})}
 if(PARTY.mode==='summary'){const cr=S.party[PARTY.sel];box(120,80,400,300);tx(cr.n+' — Summary',W/2,112,P.navy,20,'center');
  drawUiCreature(cr.id,W/2-48,130,96,96);
  badgeType(cr.t,237,233,20);tx('Level '+cr.lv+'  ·  '+typeName(cr.t),W/2+10,250,P.teal,16,'center');
  hpHeart(182,264,14);tx('HP '+cr.hp+'/'+cr.max+'   XP '+cr.xp+'/'+cr.next,W/2+10,280,P.navy,15,'center');
  tx('ATK '+cr.atk+'  DEF '+cr.def+'  SPD '+cr.spd,W/2,308,P.navy,15,'center');
  tx('Moves: '+cr.mv.join(', '),W/2,340,P.navy,14,'center');tx('Enter / Esc to close',W/2,370,P.roof,13,'center')}
 tx('Selyo ×'+S.selyo+'   Herbs ×'+S.herbs+'   ·  Esc to close',W/2,450,P.off,14,'center')}
/* ---------- reserve storage: three active creatures + thirty reserves ---------- */
function openStorage(){
 if(S.mode!=='world'||S.busy||S.p.mv||DEX||PARTY)return;
 STORAGE={tab:'reserve',sel:0,swap:false};
}
function storageInput(a){
 if(a==='back'||a==='storage'){
  if(STORAGE.swap){STORAGE.swap=false;return}
  STORAGE=null;return
 }
 if(a==='left'||a==='right'){
  STORAGE.tab=STORAGE.tab==='reserve'?'party':'reserve';STORAGE.sel=0;STORAGE.swap=false;return
 }
 const list=STORAGE.swap?S.party:STORAGE.tab==='reserve'?S.storage:S.party;
 if(a==='up')STORAGE.sel=Math.max(0,STORAGE.sel-1);
 if(a==='down')STORAGE.sel=Math.min(Math.max(0,list.length-1),STORAGE.sel+1);
 if(a!=='ok'||!list.length)return;
 if(STORAGE.swap){
  const target=STORAGE.sel,reserve=STORAGE.pending;
  if(reserve>=0&&reserve<S.storage.length&&target<S.party.length){
   const old=S.party[target];S.party[target]=S.storage[reserve];S.storage[reserve]=old;
   notify('Swapped '+S.party[target].n+' into Party.');
   queueAutosave();
  }
  STORAGE.swap=false;STORAGE.tab='reserve';STORAGE.sel=Math.min(reserve,Math.max(0,S.storage.length-1));return;
 }
 if(STORAGE.tab==='reserve'){
  const i=STORAGE.sel;
  if(S.party.length<LIM.max_party){
   const cr=S.storage.splice(i,1)[0];S.party.push(cr);
   STORAGE.sel=Math.min(i,Math.max(0,S.storage.length-1));
   notify(cr.n+' moved to Party.');queueAutosave();
  }else{STORAGE.pending=i;STORAGE.swap=true;STORAGE.sel=0}
 }else if(S.party.length>1&&S.storage.length<LIM.max_storage){
  const i=STORAGE.sel,cr=S.party.splice(i,1)[0];S.storage.push(cr);
  STORAGE.sel=Math.min(i,S.party.length-1);
  notify(cr.n+' moved to Storage.');queueAutosave();
 }else notify('Keep at least one active creature and check Storage capacity.');
}
function drawStorage(){
 c.fillStyle='rgba(11,23,32,.96)';c.fillRect(0,0,W,H);
 const swap=STORAGE.swap,tab=swap?'party':STORAGE.tab;
 const list=tab==='reserve'?S.storage:S.party;
 tx('CREATURE STORAGE',W/2,41,P.gold,27,'center');
 tx('Party '+S.party.length+'/'+LIM.max_party+'   ·   Storage '+S.storage.length+'/'+LIM.max_storage,W/2,70,P.off,16,'center');
 tx(swap?'Select party member to swap with':'◀ ▶ Switch Party / Storage',W/2,99,P.cyan,15,'center');
 const pagesize=7,sel=Math.min(STORAGE.sel,Math.max(0,list.length-1)),page=Math.floor(sel/pagesize),start=page*pagesize;
 tx((tab==='party'?'ACTIVE PARTY':'STORED CREATURES')+'   Page '+(page+1)+'/'+Math.max(1,Math.ceil(list.length/pagesize)),42,133,P.gold,16);
 if(!list.length)tx('No creatures stored yet. Bond with wild creatures!',W/2,250,P.off,17,'center');
 list.slice(start,start+pagesize).forEach((cr,i)=>{
  const idx=start+i,y=144+i*39;
  c.fillStyle=idx===sel?'#f1c66a':'#31515e';c.fillRect(36,y,568,36);
  drawUiCreature(cr.id,44,y+2,32,32);
  tx(cr.n+'  Lv'+cr.lv,89,y+23,idx===sel?P.navy:P.off,17);
  badgeType(cr.t,352,y+8,18);hpHeart(388,y+11,11);tx(cr.hp+'/'+cr.max,415,y+23,idx===sel?P.navy:P.off,13);healthBar(500,y+13,92,cr.hp,cr.max,false);
 });
 tx(swap?'Enter: Swap  ·  Esc: Cancel':tab==='party'?'Enter: Store selected creature':'Enter: Move to Party or choose a swap',W/2,441,P.off,14,'center');
 tx('Up/Down: Select   ·   Esc: Close',W/2,464,P.off,13,'center');
}
/* ---------- Creature Dex and matchup guide ---------- */
function openDex(tab='dex'){
 if(S.mode!=='world'||S.busy||S.p.mv||PARTY||STORAGE)return;
 DEX={tab,sel:0};
}
function dexInput(a){
 if(a==='back'||a==='dex'||a==='guide'){DEX=null;return}
 if(a==='party'){DEX.tab=DEX.tab==='dex'?'guide':'dex';return}
 if(a==='ok'){DEX.tab=DEX.tab==='dex'?'guide':'dex';return}
 if(DEX.tab==='dex'){
  const cols=5,len=DEX_ORDER.length;
  if(a==='left')DEX.sel=(DEX.sel+len-1)%len;
  if(a==='right')DEX.sel=(DEX.sel+1)%len;
  if(a==='up')DEX.sel=(DEX.sel+len-cols)%len;
  if(a==='down')DEX.sel=(DEX.sel+cols)%len;
 }
}
function drawDex(){
 if(!DEX)return;
 c.fillStyle='rgba(11,23,32,.95)';c.fillRect(0,0,W,H);
 if(DEX.tab==='guide'){
  tx('ATTRIBUTE COUNTER GUIDE',W/2,38,P.gold,23,'center');
  tx('Use a strong attacking attribute against the enemy.',W/2,65,P.off,13,'center');
  const names=['Fire','Water','Earth','Nature','Wind','Spark','Light','Shadow'];
  names.forEach((t,i)=>{
   const y=92+i*37;
   if(i%2===0){c.fillStyle='rgba(245,240,231,.09)';c.fillRect(22,y-18,596,35)}
   badgeType(t,35,y-15,19);tx(typeName(t),66,y+3,P.gold,16);
   tx('Counter: '+weakTo(t).map(typeName).join(' / '),205,y+3,P.off,14);
  });
  tx('Strength is based on the move attribute, not only the creature.',W/2,417,P.cyan,13,'center');
  tx('Enter: Dex  ·  Esc: Close',W/2,453,P.off,13,'center');return;
 }
 const n=S.dex.length;
 tx('CREATURE DEX',W/2,35,P.gold,26,'center');
 tx('Registered '+n+' / '+DEX_ORDER.length,W/2,60,P.off,15,'center');
 DEX_ORDER.forEach((id,i)=>{
  const col=i%5,row=Math.floor(i/5),x=20+col*122,y=77+row*91,known=S.dex.includes(id);
  c.fillStyle=i===DEX.sel?'#f1c66a':'#d7e2d4';c.fillRect(x,y,112,83);
  c.fillStyle='#263d42';c.fillRect(x+4,y+4,104,75);
  const img=uiSprite(id);
  c.save();if(!known)c.filter='brightness(0)';
  c.drawImage(img,0,0,img.width,img.height,x+32,y+3,48,48);c.restore();
  tx('#'+String(i+1).padStart(3,'0'),x+7,y+15,P.gold,10);
  tx(known?SP[id].n:'???',x+56,y+67,P.off,12,'center');if(known)badgeType(SP[id].t,x+90,y+6,16);
 });
 const id=DEX_ORDER[DEX.sel],known=S.dex.includes(id),type=SP[id].t;
 c.fillStyle='#f5f0e7';c.fillRect(20,358,600,82);
 tx(known?SP[id].n+' — '+typeName(type):'Unknown creature',32,382,P.navy,18);if(known)badgeType(type,575,364,22);
 if(known){
  tx('Strong vs '+winsAgainst(type).map(typeName).join(', '),32,402,P.teal,13);
  tx('Weak to '+weakTo(type).map(typeName).join(', '),32,419,P.roof,13);
  tx((SP[id].lore||'An inhabitant of the forgotten isles.').slice(0,82),320,419,P.navy,11);
 }else tx('Bond with this creature to reveal its name, attributes and story.',32,415,P.navy,13);
 tx('Arrows: Select  ·  Enter: Guide  ·  Esc: Close',W/2,462,P.off,13,'center');
}
function drawTitle(){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#142638');g.addColorStop(.45,P.violet);g.addColorStop(.72,P.gold);g.addColorStop(.73,P.teal);g.addColorStop(1,P.navy);c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle=P.off;c.beginPath();c.arc(520,96,30,0,7);c.fill();for(let i=0;i<40;i++){c.fillStyle='rgba(245,240,231,.7)';c.fillRect((i*97)%W,(i*53)%150,2,2)}
 c.fillStyle='rgba(245,240,231,.25)';for(let i=0;i<14;i++)c.fillRect(((i*61+S.t/40)%W),360+(i*13)%110,36,3);
 ['tarsilaw','agilunos','bagaon'].forEach((id,i)=>drawUiCreature(id,86+i*190,258+Math.sin(S.t/350+i)*4,128,128));
 tx('ALAMAT',W/2+4,184,P.navy,78,'center');tx('ALAMAT',W/2,180,P.gold,78,'center');tx('ISLES OF THE FORGOTTEN',W/2,224,P.off,24,'center');
 if(cloud.state==='loading')tx('Loading your save…',W/2,430,P.off,20,'center');
 else if((S.t/500|0)%2)tx(canContinue()?'Press Enter or tap to continue':'Press Enter or tap to begin',W/2,430,P.off,20,'center');
 tx(CFG.username+(canContinue()?'  ·  N = new game':'')+'  ·  F9 = load  ·  placeholder art',W/2,460,'rgba(245,240,231,.7)',13,'center')}
function drawMsg(){if(!S.msg)return;c.fillStyle='rgba(20,38,56,.85)';c.fillRect(W/2-140,H/2-24,280,48);tx(S.msg.t,W/2,H/2+6,P.off,16,'center')}
function drawLoading(){
  if(!S.loading)return;
  c.fillStyle='rgba(13,24,35,.92)';c.fillRect(0,0,W,H);
  const name=S.loading.name||'…';
  tx('Traveling…',W/2,H/2-36,P.gold,22,'center');
  tx(name,W/2,H/2+4,P.off,28,'center');
  const dots='.'.repeat(1+((S.t/400)|0)%3);
  tx('Please wait'+dots,W/2,H/2+40,'rgba(245,240,231,.7)',16,'center');
  // simple progress bar
  const bw=220,bh=8,bx=W/2-bw/2,by=H/2+64;
  c.fillStyle=P.navy;c.fillRect(bx,by,bw,bh);
  const prog=S.loading.phase==='out'?Math.min(1,S.fade):Math.max(0,1-S.fade);
  c.fillStyle=P.teal;c.fillRect(bx,by,bw*prog,bh);
}
function frame(ts){const dt=Math.min(50,ts-(frame.l||ts));frame.l=ts;
 try{tickFade();update(dt)}catch(err){console.error('update',err)}
 c.clearRect(0,0,W,H);
 if(S.mode!=='title'){c.fillStyle='#1a3a4a';c.fillRect(0,0,W,H)}
 try{
  if(S.mode==='title')drawTitle();
  else if(S.mode==='battle'&&B)drawBattle();
  else if(S.mode==='world'||S.mode==='battle'){if(S.mode==='battle'&&!B){S.mode='world'}
   if(S.map&&S.map.gl){drawWorld();drawDlg();drawPick();if(PARTY)drawParty()}
   else{c.fillStyle=P.navy;c.fillRect(0,0,W,H);tx('Loading map…',W/2,H/2,P.off,20,'center')}}
  else{S.mode='world'}
  drawMsg();
  if(DEX)drawDex();
  if(STORAGE)drawStorage();
  if(S.fade>0.01){c.fillStyle='rgba(20,38,56,'+Math.min(1,S.fade)+')';c.fillRect(0,0,W,H)}
  drawLoading();
 }catch(err){console.error('draw',err);c.fillStyle=P.navy;c.fillRect(0,0,W,H);tx('Draw error — use Reset view',W/2,H/2,P.off,16,'center');S.fade=0;fadeTarget=null}
 requestAnimationFrame(frame)}

/* ---------- input ---------- */
function unstick(){S.fade=0;fadeTarget=null;S.loading=null;
 if(B){notify('In a battle: use the menu (Run to flee).',100);return}
 S.busy=false;S._warping=false;const w=PARTY&&waiter;waiter=null;PARTY=null;DEX=null;STORAGE=null;if(w)w('menu-switch');DG=null;U=null;if(S.mode==='battle')S.mode='world';notify('View reset',90)}
// A single menu controller prevents multiple overlays from remaining active.
// Never steal a key from battle/dialogue waiters: only the Party waiter is cancelled.
function switchMenu(kind){
 if(S.mode!=='world'||S.p.mv)return;
 if(S.busy&&!PARTY)return;
 const current=STORAGE?'storage':DEX?(DEX.tab==='guide'?'guide':'dex'):PARTY?'party':null;
 if(current===kind){if(PARTY){const w=waiter;PARTY=null;S.busy=false;if(w){waiter=null;w('menu-switch')}}else{DEX=null;STORAGE=null}return}
 if(PARTY){
  const w=waiter;PARTY=null;S.busy=false;
  if(w){waiter=null;w('menu-switch')}
 }
 DEX=null;STORAGE=null;
 if(kind==='party')openParty();
 else if(kind==='storage')openStorage();
 else if(kind==='dex'||kind==='guide')openDex(kind);
}
function dispatch(a){
 if(['party','storage','dex','guide'].includes(a)&&
    S.mode==='world'&&(STORAGE||DEX||PARTY||(!S.busy&&!waiter))){
  switchMenu(a);return
 }
 if(STORAGE){storageInput(a);return}
 if(DEX){dexInput(a);return}
 if(waiter){const w=waiter;waiter=null;w(a);return}
 if(S.mode==='title'){if(cloud.state==='loading')return;
  if(a==='ok'){if(canContinue())loadGame(true).then(ok=>{if(!ok)startNew()});else startNew();return}
  if(a==='new'&&canContinue()&&confirm('Start a new game? Your saved progress is replaced the next time the game saves.'))startNew();
  return}
 if(S.mode==='world'&&!S.busy&&!S.p.mv){if(a==='ok')interact();if(a==='party')openParty();if(a==='dex')openDex('dex');if(a==='guide')openDex('guide');if(a==='storage')openStorage()}}
const KM={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',
 Enter:'ok',' ':'ok',e:'ok',z:'ok',n:'new',Escape:'back',x:'back',Backspace:'back',p:'party',P:'party',k:'dex',g:'guide',b:'storage'};
const kd=a=>{if(a in held)held[a]=1;dispatch(a)},ku=a=>{if(a in held)held[a]=0};
addEventListener('keydown',e=>{
 if(e.key==='F2'){S.insp=!S.insp;e.preventDefault();return}
 if(e.key==='F3'){e.preventDefault();unstick();return}
 if(e.key==='F5'){e.preventDefault();if(S.mode==='world'&&!S.busy)saveGame(true);return}
 if(e.key==='F9'){e.preventDefault();if(S.mode==='title'||(S.mode==='world'&&!S.busy))loadGame(false);return}
 const a=KM[e.key.length>1?e.key:e.key.toLowerCase()];if(a){e.preventDefault();if(!e.repeat||a in held||a==='up'||a==='down')kd(a)}});
addEventListener('keyup',e=>{const a=KM[e.key.length>1?e.key:e.key.toLowerCase()];if(a)ku(a)});
document.querySelectorAll('#pad button').forEach(b=>{const a=b.dataset.a;b.addEventListener('pointerdown',e=>{e.preventDefault();kd(a)});for(const ev of['pointerup','pointerleave','pointercancel'])b.addEventListener(ev,()=>ku(a))});
cv.addEventListener('pointerdown',()=>{if(S.mode==='title')dispatch('ok')});
$('btn-reset').addEventListener('click',()=>unstick());
$('btn-party').addEventListener('click',()=>switchMenu('party'));
$('btn-dex').addEventListener('click',()=>switchMenu('dex'));
$('btn-storage').addEventListener('click',()=>switchMenu('storage'));
$('btn-guide').addEventListener('click',()=>switchMenu('guide'));
$('btn-save').addEventListener('click',()=>{if(S.mode==='world'&&!S.busy)saveGame(true)});
$('btn-load').addEventListener('click',()=>{if(S.mode==='title'||(S.mode==='world'&&!S.busy))loadGame(false)});
$('btn-new').addEventListener('click',()=>{if((S.mode==='title'||(S.mode==='world'&&!S.busy&&!S.p.mv))&&confirm('Start a new game? Your saved progress is replaced the next time the game saves.')){startNew();notify('New game started.')}});

async function seedAdminRoster(){
 if(!CFG.canTestRoster||S.mode!=='world'||S.busy||DEX||STORAGE||PARTY)return;
 if(!confirm('Fill this admin account with all 15 creatures? This replaces its active party and storage but keeps your map progress.'))return;
 try{
  const j=await fetch(CFG.seedRosterUrl,{method:'POST',credentials:'same-origin',
   headers:{'Content-Type':'application/json','Accept':'application/json','X-CSRFToken':getCookie('csrftoken')},
   body:JSON.stringify({revision:cloud.rev})});
  const data=await j.json();
  if(!j.ok){notify(data.detail||'Could not load test creatures.',200);return}
  cloud.rev=data.revision;cloud.has=true;cloud.conflict=false;applySave(data.data);
  try{localStorage.setItem(LOCAL_KEY,JSON.stringify(snapshot()))}catch(e){}
  notify('Admin test collection ready: 3 active, 12 stored; all Dex entries unlocked.',240)
 }catch(err){notify('Could not contact the development server.',200)}
}
if(CFG.canTestRoster)$('btn-admin-roster').addEventListener('click',seedAdminRoster);

/* ---------- self-tests ---------- */
const TESTS=[
 ['Reserve capacity and starting state',()=>LIM.max_storage===30&&Array.isArray(S.storage)],
 ['Menu switching uses one controller',()=>typeof switchMenu==='function'&&typeof storageInput==='function'&&typeof dexInput==='function'],
 ['Attribute badges and heart indicators exist',()=>Object.keys(ATTR_STYLE).length===8&&typeof badgeType==='function'&&typeof hpHeart==='function'],
 ['Village map is 40×30 tiles',()=>V.w===40&&V.h===30],
 ['Potion Shop has artwork key, collision and reachable entrance',()=>{
  const shop=V.objs.find(o=>o.buildingAsset==='potion_shop');
  return !!shop&&shop.w===6&&shop.h===4&&shop.at[0]===28&&shop.at[1]===20
   &&V.sol[20*V.w+28]===1&&canWalk(V,28,21);
 }],
 ['Houses and water block movement',()=>!canWalk(V,8,7)&&!canWalk(V,5,28)],
 ['Plaza path is walkable',()=>canWalk(V,19,17)],
 ['NPC found on facing tile',()=>!!npcAt(V,21,14)],
 ['Forest has encounter grass and exits',()=>F.g.includes(5)&&F.exits.length>=2],
 ['Shrine map exists and links',()=>SH.w===16&&SH.exits.length>=1],
 ['Creatures have required stats',()=>['tarsilaw','bato','dagat'].every(id=>SP[id]&&SP[id].hp>0)],
 ['mkC produces valid party member',()=>{const c=mkC('tarsilaw',5);return c.hp===c.max&&c.mv.length>=3&&c.lv===5}],
 ['Type chart returns multipliers',()=>typeMult('Fire','Nature')>1&&typeMult('Water','Fire')>1],
 ['Dex includes 15 slots and two attribute counters',()=>DEX_ORDER.length===15&&weakTo('Fire').includes('Water')&&weakTo('Water').includes('Spark')],
 ['Seven new species have usable sprites and moves',()=>['kidlatin','silong','arawan','ugbok','bulakna','habagat','liyaban'].every(id=>SP[id]&&MV[SP[id].a]&&crSpr(id))],
 ['Species data is served by Django',()=>Object.keys(SP).length===15&&LIM.max_party===3],
 ['Stats formula matches server rules.py',()=>{const s=statsFor('tarsilaw',10);return s.max===48&&s.atk===13&&s.def===8&&s.spd===11}],
 ['Second move unlocks at level 7',()=>movesFor('lumot',6)[1]==='Tackle'&&movesFor('lumot',7)[1]==='Root Guard'],
 ['Level cap is enforced',()=>{const c=mkC('bato',29);gainXP(c,99999);return c.lv===LIM.max_level&&c.xp<c.next}],
 ['XP level-up increases stats',()=>{const c=mkC('agilunos',5);const a0=c.atk;gainXP(c,200);return c.lv>5&&c.atk>a0}]
];
const res=TESTS.map(([n,f])=>{let ok=false;try{ok=!!f()}catch(e){}return[n,ok]});
console.table(res);$('foot').textContent='Arrows/WASD · E interact · P party · F5 save · F9 load · Self-test '+res.filter(r=>r[1]).length+'/'+res.length+' passed';
window.ALAMAT={S,V,F,SH,tests:res,saveGame,loadGame,battle,dispatch,mkC,gainXP,statsFor,movesFor,cloud,startNew,getB:()=>B,rng:()=>rnd};requestAnimationFrame(frame);
})();
