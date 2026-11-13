/* ALAMAT recorded soundtrack player.
 * Source audio: user's supplied CLAIM.BEATS Village Soundtrack Compilation.
 * MP3 installed separately to avoid publishing an audio file in the source repo.
 * HTMLAudioElement playback starts on user gesture for browser compatibility.
 */
(()=>{
'use strict';
const $=id=>document.getElementById(id),STORE='alamat_music_prefs_v1';
const SCRIPT_URL=document.currentScript?.src||location.href;
const SOURCE=new URL('assets/audio/village_compilation.mp3',SCRIPT_URL).href;
const audio=new Audio(SOURCE);
audio.loop=true;
audio.preload='auto';
let enabled=true,volume=.28,scene='title',started=false,failed=false,gestureSeen=false;
try{
 const p=JSON.parse(localStorage.getItem(STORE)||'{}');
 if(typeof p.enabled==='boolean')enabled=p.enabled;
 if(Number.isFinite(p.volume))volume=Math.max(0,Math.min(1,p.volume));
}catch(e){}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify({enabled,volume}))}catch(e){}};
function ui(){
 const b=$('btn-music'),v=$('music-volume'),lab=$('music-volume-label');
 if(b){
  b.textContent=failed?'♫ Audio file missing':enabled?'♫ Music: On':'♫ Music: Off';
  b.setAttribute('aria-pressed',String(enabled&&!failed));
  b.title=failed?'Extract the music ZIP into the project root': 'Toggle background music (M)';
 }
 if(v)v.value=String(Math.round(volume*100));
 if(lab)lab.textContent=Math.round(volume*100)+'%';
}
function syncVolume(){audio.volume=enabled?volume:0}
function start(){
 gestureSeen=true;
 if(!enabled||failed||document.hidden)return;
 syncVolume();
 const request=audio.play();
 if(request&&typeof request.then==='function')
  request.then(()=>{started=true}).catch(err=>{
   // NotAllowedError is fixed by the next click/key; missing MP3 is handled by 'error'.
   if(err?.name!=='NotAllowedError')console.warn('Music playback:',err);
  });
}
function setEnabled(value){
 enabled=!!value;save();syncVolume();ui();
 if(enabled)start();
 else audio.pause();
}
function setVolume(value){
 volume=Math.max(0,Math.min(1,Number(value)||0));
 save();syncVolume();ui();
}
function setScene(id){
 // The supplied audio is a single 96-second compilation: keep playing it
 // continuously across zones/battles until dedicated tracks are added.
 if(['title','V','F','S','battle'].includes(id))scene=id;
}
audio.addEventListener('error',()=>{
 failed=true;ui();
 const status=$('status');
 if(status)status.textContent='Music file missing: extract Alamat_Village_Background_Music.zip into the game folder.';
});
function init(){
 ui();syncVolume();
 $('btn-music')?.addEventListener('click',()=>setEnabled(!enabled));
 $('music-volume')?.addEventListener('input',e=>setVolume(Number(e.target.value)/100));
 document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='m'&&!e.repeat&&!e.altKey&&!e.ctrlKey&&!e.metaKey){
   e.preventDefault();setEnabled(!enabled);
  }else if(enabled&&!e.repeat)start();
 });
 document.addEventListener('pointerdown',e=>{
  // Clicking Music while it is OFF lets its click handler enable playback.
  if(enabled)start();
 });
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)audio.pause();
  else if(gestureSeen&&enabled)start();
 });
}
window.ALAMAT_MUSIC={
 init,unlock:start,setScene,setEnabled,setVolume,
 getState:()=>({enabled,volume,scene,started,failed,source:SOURCE})
};
init();
})();
