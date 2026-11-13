/* ALAMAT original, procedural instrumental soundtrack.
 * No third-party recordings, downloads, or music samples.
 * Web Audio starts only after a user gesture; never blocks gameplay.
 */
(()=>{
'use strict';
const AC=window.AudioContext||window.webkitAudioContext;
const $=id=>document.getElementById(id);
const STORE='alamat_music_prefs_v1';
const songs={
 title:{tempo:93,scale:[0,2,4,7,9],root:57,melody:[0,null,2,4,3,null,2,1,0,null,2,3,4,2,1,null],bass:[0,0,3,3,4,4,0,0],wave:'triangle'},
 V:{tempo:97,scale:[0,2,4,7,9],root:60,melody:[0,2,4,2,3,null,2,1,0,2,3,4,2,1,0,null],bass:[0,0,3,3,4,4,0,0],wave:'triangle'},
 F:{tempo:79,scale:[0,3,5,7,10],root:57,melody:[0,null,1,3,null,4,3,null,1,0,null,3,4,null,1,null],bass:[0,0,4,4,3,3,0,0],wave:'sine'},
 S:{tempo:65,scale:[0,2,3,7,8],root:55,melody:[0,null,null,2,3,null,null,1,4,null,3,null,2,null,0,null],bass:[0,0,2,2,3,3,0,0],wave:'sine'},
 battle:{tempo:153,scale:[0,2,3,5,7,8,10],root:57,melody:[0,2,3,4,5,4,3,2,0,3,5,6,5,4,3,1],bass:[0,0,4,4,5,5,3,3],wave:'square'}
};
let enabled=true,volume=.28,ctx=null,master=null,ambience=null,scene='title',step=0,next=0,timer=null,unlocked=false;
try{const p=JSON.parse(localStorage.getItem(STORE)||'{}');if(typeof p.enabled==='boolean')enabled=p.enabled;if(Number.isFinite(p.volume))volume=Math.max(0,Math.min(1,p.volume))}catch(e){}
const freq=m=>440*Math.pow(2,(m-69)/12);
const cfg=()=>songs[scene]||songs.title;
function save(){try{localStorage.setItem(STORE,JSON.stringify({enabled,volume}))}catch(e){}}
function ui(){
 const b=$('btn-music'),v=$('music-volume'),lab=$('music-volume-label');
 if(b){b.textContent=enabled?'♫ Music: On':'♫ Music: Off';b.setAttribute('aria-pressed',String(enabled));b.title='Toggle background music (M)'}
 if(v)v.value=String(Math.round(volume*100));
 if(lab)lab.textContent=Math.round(volume*100)+'%';
}
function setGain(){if(!ctx||!master)return;master.gain.setTargetAtTime(enabled?volume*.33:0,ctx.currentTime,.055)}
function unlock(){
 if(!AC||!enabled)return;
 try{
  if(!ctx){ctx=new AC();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination)}
  unlocked=true;ctx.resume().then(()=>{setGain();if(!timer){next=ctx.currentTime+.08;timer=setInterval(schedule,90)}}).catch(()=>{});
 }catch(err){console.warn('Audio unavailable',err)}
}
function tone(midi,when,duration,velocity,wave){
 if(!ctx||!master)return;
 const osc=ctx.createOscillator(),envelope=ctx.createGain();
 osc.type=wave;osc.frequency.setValueAtTime(freq(midi),when);
 envelope.gain.setValueAtTime(.0001,when);
 envelope.gain.exponentialRampToValueAtTime(Math.max(.001,velocity),when+.012);
 envelope.gain.exponentialRampToValueAtTime(.0001,when+duration);
 osc.connect(envelope);envelope.connect(master);
 osc.start(when);osc.stop(when+duration+.015);
}
function tick(i,when){
 const song=cfg(),beat=60/song.tempo,unit=beat/2,scale=song.scale;
 const melody=song.melody[i%song.melody.length];
 if(melody!==null)tone(song.root+scale[melody%scale.length]+12,when,unit*.82,scene==='battle'?.20:.15,song.wave);
 if(i%4===0){
  const degree=song.bass[Math.floor(i/4)%song.bass.length]%scale.length;
  tone(song.root+scale[degree]-12,when,unit*3.5,.22,'sine');
 }
 if(i%2===0&&scene!=='S'){
  // Breathier light overtone, not percussion made with external samples.
  const degree=song.bass[Math.floor(i/4)%song.bass.length]%scale.length;
  tone(song.root+scale[degree]+7,when,unit*.85,.025,'sine');
 }
}
function schedule(){
 if(!ctx||ctx.state!=='running'||!enabled)return;
 let runs=0;
 while(next<ctx.currentTime+.23&&runs++<8){
  const song=cfg(),dur=60/song.tempo/2;
  tick(step,next);step++;next+=dur;
 }
}
function setScene(newScene){
 if(!songs[newScene]||scene===newScene)return;
 scene=newScene;step=0;
 // Short scheduling horizon means the previous music ends within ~230 ms.
 if(ctx)next=ctx.currentTime+.26;
}
function setEnabled(on){enabled=!!on;save();ui();setGain();if(enabled)unlock()}
function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));save();ui();setGain()}
function init(){
 ui();
 $('btn-music')?.addEventListener('click',()=>setEnabled(!enabled));
 $('music-volume')?.addEventListener('input',e=>setVolume(Number(e.target.value)/100));
 document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='m'&&!e.repeat&&!e.altKey&&!e.ctrlKey&&!e.metaKey){
   e.preventDefault();setEnabled(!enabled);return;
  }
  if(enabled)unlock();
 });
 document.addEventListener('pointerdown',()=>{if(enabled)unlock()});
 document.addEventListener('visibilitychange',()=>{
  if(!ctx)return;
  if(document.hidden){ctx.suspend().catch(()=>{})}
  else if(unlocked&&enabled)ctx.resume().catch(()=>{});
 });
}
window.ALAMAT_MUSIC={init,unlock,setScene,setEnabled,setVolume,getState:()=>({enabled,volume,scene,unlocked})};
init();
})();
