(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();function y(i,t,e){const n=document.createElement(i),s=e===void 0?[]:Array.isArray(e)?e:[e];for(const[r,a]of Object.entries(t??{}))a!=null&&(r==="dataset"?Object.assign(n.dataset,a):r==="style"&&typeof a=="string"?n.setAttribute("style",a):r.startsWith("on")&&typeof a=="function"?n.addEventListener(r.slice(2).toLowerCase(),a):r==="class"?n.className=a:n[r]=a);for(const r of s)r==null||r===!1||n.append(r instanceof Node?r:document.createTextNode(String(r)));return n}function ei(i){i.replaceChildren()}function Pr(i,t,e="text/plain"){const n=t instanceof Blob?t:new Blob([t],{type:e}),s=URL.createObjectURL(n),r=document.createElement("a");r.href=s,r.download=i,r.click(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function zo(i){return i.text()}const Es={sampleRate:240,thresholds:{tuckKneeDeg:75,tuckHipDeg:95,pikeHipDeg:120,entryVerticalDeg:15,boardFlexMm:200},boneMaps:{},activeBoneMap:"mixamo",waterLevelY:0,comTrailStep:12,ghostAlpha:.35},oh={spring:{length:4.8,width:.5,thickness:.05}},sn={poolWidth:12,poolLength:16,poolDepth:5,judgeDistance:4.5,judgeHeight:2.2};function Ni(i){const t=/^([1-6])(\d)(\d)(\d)?([ABCD])$/.exec(i.trim());if(!t)return null;const e=Number(t[1]),n=Number(t[2]),s=Number(t[3]),r=t[4]===void 0?void 0:Number(t[4]),a=t[5];return e===5?r===void 0?null:{group:e,flying:!1,direction:n,halfSomersault:s,halfTwist:r,position:a}:e===6?r===void 0?{group:e,flying:n===1,halfSomersault:s,halfTwist:0,position:a}:{group:e,flying:n===1,halfSomersault:s,halfTwist:r,position:a}:{group:e,flying:n===1,halfSomersault:s,halfTwist:0,position:a}}function ch(i){const t=Ni(i);return t?t.halfSomersault/2:0}function lh(i){const t=Ni(i);return t?t.halfTwist/2:0}function sl(i){return{A:"直体",B:"屈体",C:"抱膝",D:"任意"}[i]}function pa(i,t){return i===5?`转体(${["","向前","向后","反身","向内"][t??0]})`:["","向前","向后","反身","向内","转体","倒立"][i]??"未知"}const uo=[Xe("107B",1,"向前翻腾三周半屈体",3.5,0,"B",3,"both"),Xe("105B",1,"向前翻腾两周半屈体",2.5,0,"B",2.6,"both"),Xe("105C",1,"向前翻腾两周半抱膝",2.5,0,"C",2.4,"both"),Xe("205C",2,"向后翻腾两周半抱膝",2.5,0,"C",2.8,"both"),Xe("205B",2,"向后翻腾两周半屈体",2.5,0,"B",3,"both"),Xe("305C",3,"反身翻腾两周半抱膝",2.5,0,"C",2.8,"both"),Xe("405C",4,"向内翻腾两周半抱膝",2.5,0,"C",2.7,"both"),Xe("5253B",5,"向后翻腾两周半转体一周半屈体",2.5,1.5,"B",3.2,"both"),Xe("5152B",5,"向前翻腾两周半转体一周屈体",2.5,1,"B",3,"both"),Xe("5337D",5,"反身翻腾一周半转体三周半",1.5,3.5,"D",3.4,"platform"),Xe("626C",6,"臂立翻腾三周抱膝",3,0,"C",3.5,"platform")];function Xe(i,t,e,n,s,r,a,o){return{code:i,group:t,name:e,somersaults:n,twists:s,position:r,dd:a,platform:o}}function hh(i){const t=Ni(i);if(!t)return null;const e=uo.find(s=>s.code===i);if(e)return e;const n=`${pa(t.group,t.direction)}翻腾${Ho(t.halfSomersault/2)}周`+(t.halfTwist?`转体${Ho(t.halfTwist/2)}周`:"")+sl(t.position);return{code:i,group:t.group,name:n,somersaults:t.halfSomersault/2,twists:t.halfTwist/2,position:t.position,dd:0,platform:"both"}}function Ho(i){return Number.isInteger(i),String(i)}const uh="dive-analyzer-db",dh=1,je="records",en=(i,t)=>`${i}:${t}`;function Tr(){return new Promise((i,t)=>{const e=indexedDB.open(uh,dh);e.onupgradeneeded=()=>{const n=e.result;n.objectStoreNames.contains(je)||n.createObjectStore(je)},e.onsuccess=()=>i(e.result),e.onerror=()=>t(e.error)})}async function Yi(i,t){const e=await Tr();return new Promise((n,s)=>{const r=e.transaction(je,"readwrite");r.objectStore(je).put(t,i),r.oncomplete=()=>{e.close(),n()},r.onerror=()=>{e.close(),s(r.error)}})}async function fh(i){const t=await Tr();return new Promise((e,n)=>{const r=t.transaction(je,"readonly").objectStore(je).get(i);r.onsuccess=()=>{t.close(),e(r.result)},r.onerror=()=>{t.close(),n(r.error)}})}async function $i(i){const t=await Tr();return new Promise((e,n)=>{const s=t.transaction(je,"readonly"),r=s.objectStore(je).getAllKeys();r.onsuccess=()=>{if(r.result.filter(c=>c.startsWith(`${i}:`)).length===0){t.close(),e([]);return}const o=s.objectStore(je).getAll();o.onsuccess=()=>{const c=o.result,h=r.result,l=c.filter((u,p)=>h[p]?.startsWith(`${i}:`));t.close(),e(l)},o.onerror=()=>{t.close(),n(o.error)}},r.onerror=()=>{t.close(),n(r.error)}})}async function bs(i){const t=await Tr();return new Promise((e,n)=>{const s=t.transaction(je,"readwrite");s.objectStore(je).delete(i),s.oncomplete=()=>{t.close(),e()},s.onerror=()=>{t.close(),n(s.error)}})}const Le={async saveClip(i){return Yi(en("clip",i.id),i)},async getClip(i){return fh(en("clip",i))},async allClips(){return $i("clip")},async deleteClip(i){return bs(en("clip",i))},async saveAthlete(i){return Yi(en("athlete",i.id),i)},async allAthletes(){return $i("athlete")},async deleteAthlete(i){return bs(en("athlete",i))},async saveSession(i){return Yi(en("session",i.id),i)},async allSessions(){return $i("session")},async deleteSession(i){return bs(en("session",i))},async saveAnnotation(i){return Yi(en("annotation",i.id),i)},async allAnnotations(){return $i("annotation")},async deleteAnnotation(i){return bs(en("annotation",i))},async saveDive(i){return Yi(en("dive",i.code),i)},async allDives(){const i=await $i("dive"),t=new Set(i.map(e=>e.code));return[...i,...uo.filter(e=>!t.has(e.code))]}},rl="dive-analyzer-settings";function ph(){try{const i=localStorage.getItem(rl);if(!i)return structuredClone(Es);const t=JSON.parse(i);return{...structuredClone(Es),...t,thresholds:{...Es.thresholds,...t.thresholds}}}catch{return structuredClone(Es)}}function ma(i){localStorage.setItem(rl,JSON.stringify(i))}function Ii(i="id"){return`${i}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`}var b=(i=>(i[i.Hips=0]="Hips",i[i.Spine=1]="Spine",i[i.Spine1=2]="Spine1",i[i.Neck=3]="Neck",i[i.Head=4]="Head",i[i.LeftShoulder=5]="LeftShoulder",i[i.LeftArm=6]="LeftArm",i[i.LeftForeArm=7]="LeftForeArm",i[i.LeftHand=8]="LeftHand",i[i.RightShoulder=9]="RightShoulder",i[i.RightArm=10]="RightArm",i[i.RightForeArm=11]="RightForeArm",i[i.RightHand=12]="RightHand",i[i.LeftUpLeg=13]="LeftUpLeg",i[i.LeftLeg=14]="LeftLeg",i[i.LeftFoot=15]="LeftFoot",i[i.RightUpLeg=16]="RightUpLeg",i[i.RightLeg=17]="RightLeg",i[i.RightFoot=18]="RightFoot",i[i.Pelvis=19]="Pelvis",i[i.Chest=20]="Chest",i))(b||{});const zt=21,hr=(()=>{const i=new Array(zt).fill(-1);return i[b.Hips]=-1,i[b.Pelvis]=b.Hips,i[b.Spine]=b.Hips,i[b.Spine1]=b.Spine,i[b.Chest]=b.Spine1,i[b.Neck]=b.Spine1,i[b.Head]=b.Neck,i[b.LeftShoulder]=b.Spine1,i[b.LeftArm]=b.LeftShoulder,i[b.LeftForeArm]=b.LeftArm,i[b.LeftHand]=b.LeftForeArm,i[b.RightShoulder]=b.Spine1,i[b.RightArm]=b.RightShoulder,i[b.RightForeArm]=b.RightArm,i[b.RightHand]=b.RightForeArm,i[b.LeftUpLeg]=b.Hips,i[b.LeftLeg]=b.LeftUpLeg,i[b.LeftFoot]=b.LeftLeg,i[b.RightUpLeg]=b.Hips,i[b.RightLeg]=b.RightUpLeg,i[b.RightFoot]=b.RightLeg,i})(),In=["Hips","Spine","Spine1","Neck","Head","LeftShoulder","LeftArm","LeftForeArm","LeftHand","RightShoulder","RightArm","RightForeArm","RightHand","LeftUpLeg","LeftLeg","LeftFoot","RightUpLeg","RightLeg","RightFoot","Pelvis","Chest"],mh=(()=>{const i=new Array(zt).fill(0);i[b.Hips]=.1,i[b.Spine]=.1,i[b.Spine1]=.22,i[b.Head]=.08,i[b.LeftArm]=.028,i[b.RightArm]=.028,i[b.LeftForeArm]=.016,i[b.RightForeArm]=.016,i[b.LeftHand]=.006,i[b.RightHand]=.006,i[b.LeftUpLeg]=.1,i[b.RightUpLeg]=.1,i[b.LeftLeg]=.045,i[b.RightLeg]=.045,i[b.LeftFoot]=.015,i[b.RightFoot]=.015;const t=i.reduce((e,n)=>e+n,0);return i.map(e=>e/t)})();function fo(i){const t=i.height,e=i.armSpan,n=e*.118,s=e*.185,r=e*.165,a=e*.105*.5,o=t*.062,c=t*.245,h=t*.246,l=new Array(zt);for(let u=0;u<zt;u++)l[u]=[0,0,0];return l[b.Hips]=[0,t*.521,0],l[b.Pelvis]=[0,-t*.035,0],l[b.Spine]=[0,t*.118,0],l[b.Spine1]=[0,t*.118,0],l[b.Chest]=[0,t*.05,0],l[b.Neck]=[0,t*.079,0],l[b.Head]=[0,t*.094,0],l[b.LeftShoulder]=[n*.55,t*.03,0],l[b.LeftArm]=[n*.55,0,0],l[b.LeftForeArm]=[s,0,0],l[b.LeftHand]=[r,0,0],l[b.LeftHand]=[r+a*0,0,0],l[b.RightShoulder]=[-n*.55,t*.03,0],l[b.RightArm]=[-n*.55,0,0],l[b.RightForeArm]=[-s,0,0],l[b.RightHand]=[-r,0,0],l[b.LeftUpLeg]=[o,-t*.02,0],l[b.LeftLeg]=[0,-c,0],l[b.LeftFoot]=[0,-h,0],l[b.RightUpLeg]=[-o,-t*.02,0],l[b.RightLeg]=[0,-c,0],l[b.RightFoot]=[0,-h,0],l}function gh(i){const t=i.height,e=i.armSpan;return{[b.Head]:t*.094,[b.LeftHand]:e*.105,[b.RightHand]:e*.105,[b.LeftFoot]:t*.083,[b.RightFoot]:t*.083}}const ga={mixamo:{Hips:b.Hips,Spine:b.Spine,Spine1:b.Spine1,Spine2:b.Spine1,Neck:b.Neck,Head:b.Head,LeftShoulder:b.LeftShoulder,LeftArm:b.LeftArm,LeftForeArm:b.LeftForeArm,LeftHand:b.LeftHand,RightShoulder:b.RightShoulder,RightArm:b.RightArm,RightForeArm:b.RightForeArm,RightHand:b.RightHand,LeftUpLeg:b.LeftUpLeg,LeftLeg:b.LeftLeg,LeftFoot:b.LeftFoot,RightUpLeg:b.RightUpLeg,RightLeg:b.RightLeg,RightFoot:b.RightFoot},generic:{"mixamorig:Hips":b.Hips,"mixamorig:Spine":b.Spine,"mixamorig:Spine1":b.Spine1,"mixamorig:Neck":b.Neck,"mixamorig:Head":b.Head,"mixamorig:LeftShoulder":b.LeftShoulder,"mixamorig:LeftArm":b.LeftArm,"mixamorig:LeftForeArm":b.LeftForeArm,"mixamorig:LeftHand":b.LeftHand,"mixamorig:RightShoulder":b.RightShoulder,"mixamorig:RightArm":b.RightArm,"mixamorig:RightForeArm":b.RightForeArm,"mixamorig:RightHand":b.RightHand,"mixamorig:LeftUpLeg":b.LeftUpLeg,"mixamorig:LeftLeg":b.LeftLeg,"mixamorig:LeftFoot":b.LeftFoot,"mixamorig:RightUpLeg":b.RightUpLeg,"mixamorig:RightLeg":b.RightLeg,"mixamorig:RightFoot":b.RightFoot}};b.LeftArm,b.LeftForeArm,b.LeftForeArm,b.LeftHand,b.RightArm,b.RightForeArm,b.RightForeArm,b.RightHand,b.LeftUpLeg,b.LeftLeg,b.LeftLeg,b.LeftFoot,b.RightUpLeg,b.RightLeg,b.RightLeg,b.RightFoot,b.Spine1,b.Neck;const wi=()=>[0,0,0,1];function _h(i,t){return[i[0]+t[0],i[1]+t[1],i[2]+t[2]]}function ur(i,t){return[i[0]-t[0],i[1]-t[1],i[2]-t[2]]}function vh(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function _a(i){return Math.hypot(i[0],i[1],i[2])}function Jn(i){const t=_a(i)||1;return[i[0]/t,i[1]/t,i[2]/t]}function xh(i,t,e){return[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e]}function dr(i,t){const e=Math.max(-1,Math.min(1,vh(i,t)/((_a(i)||1)*(_a(t)||1))));return Math.acos(e)*180/Math.PI}function po(i){const t=Math.hypot(i[0],i[1],i[2],i[3])||1;return[i[0]/t,i[1]/t,i[2]/t,i[3]/t]}function Ee(i,t){const[e,n,s,r]=i,[a,o,c,h]=t;return[r*a+e*h+n*c-s*o,r*o-e*c+n*h+s*a,r*c+e*o-n*a+s*h,r*h-e*a-n*o-s*c]}function fr(i){return[-i[0],-i[1],-i[2],i[3]]}function Je(i,t){const e=Jn(i),n=t/2,s=Math.sin(n);return[e[0]*s,e[1]*s,e[2]*s,Math.cos(n)]}function ss(i,t){const e=[t[0],t[1],t[2],0],n=Ee(Ee(i,e),fr(i));return[n[0],n[1],n[2]]}function mo(i,t,e){let[n,s,r,a]=t,o=i[0]*n+i[1]*s+i[2]*r+i[3]*a;if(o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o),o>.9995)return po([i[0]+(n-i[0])*e,i[1]+(s-i[1])*e,i[2]+(r-i[2])*e,i[3]+(a-i[3])*e]);const c=Math.acos(Math.min(1,o)),h=Math.sin(c),l=Math.sin((1-e)*c)/h,u=Math.sin(e*c)/h;return[i[0]*l+n*u,i[1]*l+s*u,i[2]*l+r*u,i[3]*l+a*u]}function va(i){return Je([0,1,0],i)}function Mh(i,t){const e=Jn(t),n=[e[0]*(i[0]*e[0]+i[1]*e[1]+i[2]*e[2]),e[1]*(i[0]*e[0]+i[1]*e[1]+i[2]*e[2]),e[2]*(i[0]*e[0]+i[1]*e[1]+i[2]*e[2])];let s=po([n[0],n[1],n[2],i[3]]);Math.hypot(n[0],n[1],n[2])<1e-8&&(s=wi());const r=Ee(i,fr(s));return{twist:s,swing:r}}function ko(i,t){let e=t-i;for(;e>Math.PI;)e-=2*Math.PI;for(;e<-Math.PI;)e+=2*Math.PI;return i+e}function Ri(i,t,e){return Math.max(t,Math.min(e,i))}function Ki(i,t,e){const n=Ri((e-i)/(t-i),0,1);return n*n*(3-2*n)}function ir(i){return i*Math.PI/180}function Ts(i){return i*180/Math.PI}function yh(i,t,e){const n=(t*zt+e)*4;return[i.localRotations[n],i.localRotations[n+1],i.localRotations[n+2],i.localRotations[n+3]]}function os(i,t,e){const n=fo({height:e.height,armSpan:e.armSpan}),s=new Array(zt),r=new Array(zt);for(let a=0;a<zt;a++){const o=hr[a],c=yh(i,Ri(t,0,i.frameCount-1),a);o<0?(i.takeoffFrame>=0,s[a]=[i.rootPositions[t*3],i.rootPositions[t*3+1],i.rootPositions[t*3+2]],r[a]=c):(r[a]=Ee(r[o],c),s[a]=_h(s[o],ss(r[o],n[a])))}return{positions:s,rotations:r}}const As=[0,1,0];function Sh(i,t,e){const n={height:t.heightCm/100,armSpan:t.armSpanCm/100},s=[],r=1/i.sampleRate,a=Ri(i.takeoffFrame>0?i.takeoffFrame-2:0,0,i.frameCount-1),o=os(i,a,n).rotations[b.Hips];let c=0,h=0,l=0,u=0;for(let I=0;I<i.frameCount;I++){const S=os(i,I,n),x=S.rotations[b.Hips],D=ss(x,As),H=ss(x,[0,0,1]),k=Ee(fr(o),x),q=ss(k,As),K=Math.atan2(q[2],q[1]),U=ko(c,K),G=Je([1,0,0],U),z=Ee(fr(G),k),nt=2*Math.atan2(z[1],z[3]),st=ko(h,nt);l=U,u=st,c=U,h=st;const Mt=[0,0,0];for(let Et=0;Et<zt;Et++){const mt=mh[Et];Mt[0]+=S.positions[Et][0]*mt,Mt[1]+=S.positions[Et][1]*mt,Mt[2]+=S.positions[Et][2]*mt}const Pt=Vo(S,b.LeftUpLeg,b.LeftLeg,b.LeftFoot),Xt=Vo(S,b.RightUpLeg,b.RightLeg,b.RightFoot),$=Go(S,b.Spine1,b.Hips,b.LeftUpLeg,b.LeftLeg),tt=Go(S,b.Spine1,b.Hips,b.RightUpLeg,b.RightLeg),pt=i.diveCode.endsWith("C")||i.diveCode.endsWith("D")?Pt<e.thresholds.tuckKneeDeg&&Xt<e.thresholds.tuckKneeDeg&&$<e.thresholds.tuckHipDeg&&tt<e.thresholds.tuckHipDeg:$<e.thresholds.pikeHipDeg&&tt<e.thresholds.pikeHipDeg,rt=s[I-1],St=rt?(Math.abs(Ts(l)-rt.somersaultCumDeg)+Math.abs(Ts(u)-rt.twistCumDeg))*Math.PI/180/r:0;s.push({com:Mt,pelvisUp:D,pelvisForward:H,somersaultCumDeg:Ts(l),twistCumDeg:Ts(u),kneeAngles:[Pt,Xt],hipAngles:[$,tt],isTight:pt,angularVelocity:St})}const p=i.entryFrame>=0?i.entryFrame:i.frameCount-1,d=os(i,p,n),g=Jn(ss(d.rotations[b.Hips],As)),_=Math.min(dr(g,As),dr(g,[0,-1,0])),m=[d.positions[b.LeftHand],d.positions[b.RightHand]],f=m[0][1]<m[1][1]?m[0]:m[1],A=d.positions[b.Hips],T=[f[0]-A[0],0,f[2]-A[2]],E=fs(i,s),C=i.apexFrame>=0?i.apexFrame:ps(i),R=(E-C)/i.sampleRate*1e3,L=s.reduce((I,S)=>Math.max(I,S.angularVelocity),0);return{metrics:s,entryAngleDeg:_,handEntryOffset:T,somersaultTurns:s[p].somersaultCumDeg/360,twistTurns:s[p].twistCumDeg/360,apexToOpenMs:R,maxAngularVelocity:L}}function Vo(i,t,e,n){const s=Jn(ur(i.positions[t],i.positions[e])),r=Jn(ur(i.positions[n],i.positions[e]));return dr(s,r)}function Go(i,t,e,n,s){const r=Jn(ur(i.positions[t],i.positions[e])),a=Jn(ur(i.positions[s],i.positions[e]));return dr(r,a)}function fs(i,t,e){const n=i.takeoffFrame>=0?i.takeoffFrame:0,s=i.entryFrame>=0?i.entryFrame:i.frameCount-1;let r=-1;for(let o=n;o<=s;o++)t[o]?.isTight&&(r=o);if(r<0)return n+Math.floor((s-n)*.8);let a=r;for(;a<s&&t[a].isTight;)a++;return a}function ps(i){let t=0,e=-1/0;for(let n=0;n<i.frameCount;n++){const s=i.rootPositions[n*3+1];Number.isNaN(s)||s>e&&(e=s,t=n)}return t}function al(i,t,e,n,s=n){const r=i.frameCount;let a=-1,o=-1;const c=u=>i.rootPositions[u*3+1],h=u=>(c(u+1)-c(u-1))*.5*i.sampleRate,l=e+n;{let u=-1/0;for(let p=2;p<r-2;p++){if(Number.isNaN(c(p))||Number.isNaN(c(p-1))||Number.isNaN(c(p+1))||Math.abs(c(p)-l)>.3)continue;const d=h(p);d>u&&(u=d,a=p)}}if(a<0){let u=-1/0;for(let p=2;p<r*.4;p++){if(Number.isNaN(c(p)))continue;const d=h(p);d>u&&(u=d,a=p)}}for(let u=Math.max(0,a)+1;u<r;u++)if(!Number.isNaN(c(u))&&c(u)<=t+s+.08){o=u;break}return o<0&&(o=r-1),{takeoffFrame:a,entryFrame:o}}class Eh{state={page:"athletes",athletes:[],dives:[],sessions:[],clips:[],annotations:[],settings:ph(),activeClipId:null,compareA:null,compareB:null,analysisCache:new Map};listeners=new Set;subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(){this.listeners.forEach(t=>t(this.state))}update(t){t(this.state),this.emit()}async init(){const[t,e,n,s,r]=await Promise.all([Le.allAthletes(),Le.allDives(),Le.allSessions(),Le.allClips(),Le.allAnnotations()]);this.update(a=>{a.athletes=t,a.dives=e,a.sessions=n,a.clips=s,a.annotations=r})}async saveAthlete(t){await Le.saveAthlete(t),this.update(e=>{const n=e.athletes.findIndex(s=>s.id===t.id);n>=0?e.athletes[n]=t:e.athletes.push(t)})}async deleteAthlete(t){await Le.deleteAthlete(t),this.update(e=>{e.athletes=e.athletes.filter(n=>n.id!==t)})}async saveDive(t){await Le.saveDive(t),this.update(e=>{const n=e.dives.findIndex(s=>s.code===t.code);n>=0?e.dives[n]=t:e.dives.push(t)})}async saveSession(t){await Le.saveSession(t),this.update(e=>{const n=e.sessions.findIndex(s=>s.id===t.id);n>=0?e.sessions[n]=t:e.sessions.push(t)})}async deleteSession(t){await Le.deleteSession(t),this.update(e=>{e.sessions=e.sessions.filter(n=>n.id!==t)})}async saveClip(t){await Le.saveClip(t),this.state.analysisCache.delete(t.id),this.update(e=>{const n=e.clips.findIndex(s=>s.id===t.id);n>=0?e.clips[n]=t:e.clips.push(t)})}async deleteClip(t){await Le.deleteClip(t),this.state.analysisCache.delete(t),this.update(e=>{e.clips=e.clips.filter(n=>n.id!==t);for(const n of e.sessions)n.clipIds=n.clipIds.filter(s=>s!==t);e.activeClipId===t&&(e.activeClipId=null)})}getClip(t){if(t)return this.state.clips.find(e=>e.id===t)}athleteOf(t){return this.state.athletes.find(e=>e.id===t.athleteId)}analysis(t){const e=this.state.analysisCache.get(t.id);if(e)return e;const n=this.athleteOf(t);if(!n)throw new Error("片段对应的队员档案不存在,无法分析");const s=Sh(t,n,this.state.settings);return this.state.analysisCache.set(t.id,s),s}invalidateAnalysis(t){this.state.analysisCache.delete(t)}async saveAnnotation(t){await Le.saveAnnotation(t),this.update(e=>{const n=e.annotations.findIndex(s=>s.id===t.id);n>=0?e.annotations[n]=t:e.annotations.push(t)})}async deleteAnnotation(t){await Le.deleteAnnotation(t),this.update(e=>{e.annotations=e.annotations.filter(n=>n.id!==t)})}annotationsOf(t){return this.state.annotations.filter(e=>e.clipId===t).sort((e,n)=>e.frame-n.frame)}updateSettings(t){t(this.state.settings),ma(this.state.settings),this.state.analysisCache.clear(),this.emit()}navigate(t,e){this.update(n=>{n.page=t,e!==void 0&&(n.activeClipId=e)})}setCompare(t,e){this.update(n=>{n.compareA=t,n.compareB=e})}}const ot=new Eh;function xa(i){ei(i);const t=ot.state,e=s=>{const r=s?{...s}:{id:Ii("ath"),name:"",gender:"male",birthYear:2008,heightCm:165,armSpanCm:168,weightKg:55,team:"省队跳水组",createdAt:Date.now()},a=y("div",{className:"modal-backdrop"},[y("div",{className:"modal"},[y("h3",{},s?"编辑队员档案":"新建队员档案"),y("div",{className:"form-grid"},[zn("姓名",si("text",r.name,o=>r.name=o)),zn("队伍",si("text",r.team,o=>r.team=o)),zn("性别",bh(r.gender,[["male","男"],["female","女"]],o=>r.gender=o)),zn("出生年份",si("number",String(r.birthYear),o=>r.birthYear=Number(o))),zn("身高 (cm)",si("number",String(r.heightCm),o=>r.heightCm=Number(o))),zn("臂展 (cm)",si("number",String(r.armSpanCm),o=>r.armSpanCm=Number(o))),zn("体重 (kg)",si("number",String(r.weightKg),o=>r.weightKg=Number(o)))]),y("div",{className:"row",style:"margin-top:16px;justify-content:flex-end"},[y("button",{onclick:()=>a.remove()},"取消"),y("button",{className:"primary",onclick:async()=>{if(!r.name.trim()){alert("请填写姓名");return}await ot.saveAthlete(r),a.remove(),xa(i)}},"保存")])])]);document.body.appendChild(a)};if(i.append(y("div",{className:"toolbar"},[y("h2",{className:"page-title",style:"margin:0"},"队员档案"),y("div",{className:"spacer"}),y("button",{className:"primary",onclick:()=>e()},"+ 新建队员")])),t.athletes.length===0){i.append(y("div",{className:"empty"},"暂无队员,点击右上角新建"));return}const n=y("div",{className:"grid cols-3"});for(const s of t.athletes){const r=t.clips.filter(a=>a.athleteId===s.id).length;n.appendChild(y("div",{className:"card"},[y("div",{className:"row"},[y("h3",{style:"margin:0"},s.name),y("div",{className:"spacer"}),y("span",{className:`tag ${s.gender==="male"?"blue":"purple"}`},s.gender==="male"?"男":"女")]),y("div",{className:"kv",style:"margin-top:12px"},[y("span",{className:"k"},"出生年份"),y("span",{},String(s.birthYear)),y("span",{className:"k"},"身高"),y("span",{},`${s.heightCm} cm`),y("span",{className:"k"},"臂展"),y("span",{},`${s.armSpanCm} cm`),y("span",{className:"k"},"体重"),y("span",{},`${s.weightKg} kg`),y("span",{className:"k"},"队伍"),y("span",{},s.team),y("span",{className:"k"},"累计动作"),y("span",{},`${r} 跳`)]),y("div",{className:"row",style:"margin-top:14px"},[y("button",{onclick:()=>e(s)},"编辑"),y("button",{className:"danger",onclick:async()=>{confirm(`删除队员 ${s.name}?其历史动作片段不会被删除`)&&(await ot.deleteAthlete(s.id),xa(i))}},"删除")])]))}i.append(n)}function zn(i,t){return y("div",{},[y("label",{},i),t])}function si(i,t,e){return y("input",{type:i,value:t,oninput:n=>e(n.target.value)})}function bh(i,t,e){const n=y("select",{},t.map(([s,r])=>y("option",{value:s,selected:s===i},r)));return n.addEventListener("change",()=>e(n.value)),n}function ol(i){ei(i);const t=ot.state,e=r=>{const a=r?{...r}:{code:"",group:1,name:"",somersaults:0,twists:0,position:"B",dd:0,platform:"both"},o=y("div",{className:"modal-backdrop"},[y("div",{className:"modal"},[y("h3",{},r?"编辑动作":"新增动作代码"),y("div",{className:"form-grid"},[ri("动作代码(如 107B)",y("input",{value:a.code,placeholder:"107B / 5253B",oninput:c=>{const h=c.target.value.trim().toUpperCase();a.code=h;const l=Ni(h);l&&(a.group=l.group,a.somersaults=l.halfSomersault/2,a.twists=l.halfTwist/2,a.position=l.position,a.name||(a.name=`${pa(l.group,l.direction)}动作`))}})),ri("动作名称",y("input",{value:a.name,oninput:c=>a.name=c.target.value})),ri("难度系数 DD",y("input",{type:"number",step:"0.1",value:String(a.dd),oninput:c=>a.dd=Number(c.target.value)})),ri("翻腾周数(自动解析,可手改)",y("input",{type:"number",step:"0.5",value:String(a.somersaults),oninput:c=>a.somersaults=Number(c.target.value)})),ri("转体周数",y("input",{type:"number",step:"0.5",value:String(a.twists),oninput:c=>a.twists=Number(c.target.value)})),ri("适用场地",Th(a.platform,[["both","板台通用"],["spring","仅跳板"],["platform","仅跳台"]],c=>a.platform=c))]),y("div",{className:"row",style:"margin-top:16px;justify-content:flex-end"},[y("button",{onclick:()=>o.remove()},"取消"),y("button",{className:"primary",onclick:async()=>{if(!Ni(a.code)){alert("动作代码格式不合法");return}await ot.saveDive(a),o.remove(),ol(i)}},"保存")])])]);document.body.appendChild(o)};i.append(y("div",{className:"toolbar"},[y("h2",{className:"page-title",style:"margin:0"},"动作库"),y("span",{className:"muted"},`共 ${t.dives.length} 个动作,按 FINA 代码归档`),y("div",{className:"spacer"}),y("button",{className:"primary",onclick:()=>e()},"+ 新增动作代码")]));const n=y("div",{className:"card scroll-x"},[y("table",{},[y("thead",{},y("tr",{},[y("th",{},"代码"),y("th",{},"名称"),y("th",{},"组别"),y("th",{},"翻腾"),y("th",{},"转体"),y("th",{},"姿态"),y("th",{},"难度系数"),y("th",{},"场地"),y("th",{},"本队已跳"),y("th",{},"操作")])),y("tbody",{},t.dives.map(r=>{const a=t.clips.filter(o=>o.diveCode===r.code).length;return y("tr",{},[y("td",{},y("b",{style:"color:var(--accent)"},r.code)),y("td",{},r.name),y("td",{},pa(r.group)),y("td",{},`${Wo(r.somersaults)} 周`),y("td",{},r.twists?`${Wo(r.twists)} 周`:"—"),y("td",{},sl(r.position)),y("td",{},y("span",{className:"tag yellow"},r.dd?r.dd.toFixed(1):"待填")),y("td",{},r.platform==="both"?"板/台":r.platform==="spring"?"跳板":"跳台"),y("td",{},`${a} 跳`),y("td",{},y("button",{onclick:()=>e(r)},"编辑"))])}))])]);i.append(n);const s=hh("5253B");i.append(y("div",{className:"card",style:"margin-top:16px"},[y("h3",{},"代码规则(录入时自动解析)"),y("div",{className:"muted"},[y("div",{},"第1位 组别:1 向前 / 2 向后 / 3 反身 / 4 向内 / 5 转体 / 6 倒立"),y("div",{},"第3位 半翻腾数:7 = 三周半;转体动作第4位为半转体数:3 = 一周半"),y("div",{},`末位姿态:A 直体 / B 屈体 / C 抱膝 / D 任意。示例 5253B → 翻腾 ${s?.somersaults} 周 + 转体 ${s?.twists} 周`),y("div",{style:"margin-top:6px"},`校验:107B 解析为翻腾 ${ch("107B")} 周、转体 ${lh("107B")} 周`)])]))}function Wo(i){return Number.isInteger(i),String(i)}function ri(i,t){return y("div",{},[y("label",{},i),t])}function Th(i,t,e){const n=y("select",{},t.map(([s,r])=>y("option",{value:s,selected:s===i},r)));return n.addEventListener("change",()=>e(n.value)),n}function Ah(i,t,e){const n=i.split(/[\r\n]+/).flatMap(C=>C.trim().split(/\s+/)).filter(Boolean);let s=0;const r=C=>{if(n[s++]!==C)throw new Error(`BVH 解析失败:期望 ${C},实际 ${n[s-1]??"EOF"}`)};r("HIERARCHY");const a=[];function o(C){const R=n[s++];if(R!=="ROOT"&&R!=="JOINT")throw new Error(`BVH 解析失败:非法节点关键字 ${R}`);const L=n[s++],I=a.push({name:L,offset:[0,0,0],children:[],parent:C,channels:[],channelOffset:-1,isEndSite:!1})-1;if(C>=0&&a[C].children.push(I),r("{"),r("OFFSET"),a[I].offset=[Number(n[s++]),Number(n[s++]),Number(n[s++])],n[s]==="CHANNELS"){s++;const S=Number(n[s++]);a[I].channels=n.slice(s,s+S),s+=S}for(;n[s]==="JOINT"||n[s]==="End"&&n[s+1]==="Site";)n[s]==="End"?(s+=2,r("{"),r("OFFSET"),s+=3,r("}")):o(I);return r("}"),I}o(-1),r("MOTION"),r("Frames:");const c=Number(n[s++]);r("Frame"),r("Time:");const h=Number(n[s++]),l=Math.round(1/h),u=e??wh(a),p=[],d=new Map;a.forEach((C,R)=>{if(R===0){d.set(0,b.Hips);return}const L=u[C.name]??u[cl(C.name)];if(L===void 0){p.push(C.name);return}d.set(R,L)});let g=0;for(const C of a)C.channelOffset=g,g+=C.channels.length;const _=g,m=[];for(let C=0;C<c;C++){const R=[];for(let L=0;L<_;L++)R.push(Number(n[s++]));m.push(R)}const f=new Float32Array(c*3),A=new Float32Array(c*zt*4),T=a[0];for(let C=0;C<c;C++){const R=m[C];let L=0,I=0,S=0;T.channels.forEach((x,D)=>{const H=R[T.channelOffset+D]/100;x==="Xposition"&&(L=H),x==="Yposition"&&(I=H),x==="Zposition"&&(S=H)}),f[C*3]=L,f[C*3+1]=I,f[C*3+2]=S;for(const[x,D]of d){const H=a[x],k=H.channels.filter(K=>K.startsWith("Q")),q=(C*zt+D)*4;if(k.length===4){const K=U=>H.channelOffset+H.channels.indexOf(U);A[q]=R[K("Qx")],A[q+1]=R[K("Qy")],A[q+2]=R[K("Qz")],A[q+3]=R[K("Qw")]}else{const K=H.channelOffset+H.channels.findIndex(z=>z.endsWith("rotation")),U={};H.channels.forEach((z,nt)=>{z.endsWith("rotation")&&(U[z[0]]=R[K+nt])});let G=[0,0,0,1];for(const z of H.channels){if(!z.endsWith("rotation"))continue;const nt=z[0]==="X"?[1,0,0]:z[0]==="Y"?[0,1,0]:[0,0,1];G=Ee(G,Je([...nt],ir(U[z[0]])))}A[q]=G[0],A[q+1]=G[1],A[q+2]=G[2],A[q+3]=G[3]}}}return{clip:{id:t.id,athleteId:t.athleteId,diveCode:t.diveCode,sessionId:t.sessionId,sampleRate:l,frameCount:c,rootPositions:f,localRotations:A,takeoffFrame:-1,entryFrame:-1,apexFrame:-1,openFrame:-1,defects:[],repaired:[],createdAt:Date.now()},unresolvedBones:p,frameTime:h}}function cl(i){const t=i.lastIndexOf(":");return t>=0?i.slice(t+1):i}function wh(i){const t={},e=new Map;In.forEach((s,r)=>e.set(s.toLowerCase(),r));const n={...ga.mixamo,...ga.generic};for(const s of i){if(s.isEndSite)continue;const r=e.get(s.name.toLowerCase())??e.get(cl(s.name).toLowerCase());r!==void 0?t[s.name]=r:n[s.name]!==void 0&&(t[s.name]=n[s.name])}return t}function Rh(i,t){const e=fo({height:t.height,armSpan:t.armSpan}),n=[],s=o=>"	".repeat(o);function r(o,c,h){const l=In[o],u=e[o].map(d=>(d*100).toFixed(3));h?n.push(`${s(c)}ROOT ${l}`):n.push(`${s(c)}JOINT ${l}`),n.push(`${s(c)}{`),n.push(`${s(c+1)}OFFSET ${u.join(" ")}`),h?n.push(`${s(c+1)}CHANNELS 7 Xposition Yposition Zposition Qx Qy Qz Qw`):n.push(`${s(c+1)}CHANNELS 4 Qx Qy Qz Qw`);const p=a(o);if(p.length===0){n.push(`${s(c+1)}End Site`),n.push(`${s(c+1)}{`);const d=o===b.Head?10:-5;n.push(`${s(c+2)}OFFSET 0.000 ${d.toFixed(3)} 0.000`),n.push(`${s(c+1)}}`)}else p.forEach(d=>r(d,c+1,!1));n.push(`${s(c)}}`)}function a(o){const c=[];for(let h=0;h<zt;h++)hr[h]===o&&c.push(h);return c}n.push("HIERARCHY"),r(b.Hips,0,!0),n.push("MOTION"),n.push(`Frames: ${i.frameCount}`),n.push(`Frame Time: ${(1/i.sampleRate).toFixed(6)}`);for(let o=0;o<i.frameCount;o++){const c=[i.rootPositions[o*3]*100,i.rootPositions[o*3+1]*100,i.rootPositions[o*3+2]*100];for(let h=0;h<zt;h++){const l=(o*zt+h)*4;c.push(i.localRotations[l],i.localRotations[l+1],i.localRotations[l+2],i.localRotations[l+3])}n.push(c.map(h=>h.toFixed(6)).join(" "))}return n.join(`
`)}function Ch(i){const t=["frame","time","root_x","root_y","root_z"];for(const n of In)t.push(`${n}_qx`,`${n}_qy`,`${n}_qz`,`${n}_qw`);const e=[t.join(",")];for(let n=0;n<i.frameCount;n++){const s=[String(n),(n/i.sampleRate).toFixed(5),i.rootPositions[n*3].toFixed(5),i.rootPositions[n*3+1].toFixed(5),i.rootPositions[n*3+2].toFixed(5)];for(let r=0;r<zt;r++){const a=(n*zt+r)*4;s.push(i.localRotations[a].toFixed(6),i.localRotations[a+1].toFixed(6),i.localRotations[a+2].toFixed(6),i.localRotations[a+3].toFixed(6))}e.push(s.join(","))}return e.join(`
`)}function Lh(i,t){const e=[],n=i.split(/\r?\n/).filter(f=>f.trim().length>0),s=n[0].split(",").map(f=>f.trim()),r=f=>s.findIndex(A=>A.toLowerCase()===f.toLowerCase()),a=n.length-1,o=new Float32Array(a*3),c=new Float32Array(a*zt*4);for(let f=0;f<a;f++)for(let A=0;A<zt;A++){const T=wi(),E=(f*zt+A)*4;c[E]=T[0],c[E+1]=T[1],c[E+2]=T[2],c[E+3]=T[3]}const h=r("root_x"),l=r("root_y"),u=r("root_z"),p=r("time");let d=t.sampleRate??240;const g=In.map(f=>({joint:In.indexOf(f),qx:r(`${f}_qx`),qy:r(`${f}_qy`),qz:r(`${f}_qz`),qw:r(`${f}_qw`)}));g.some(f=>f.qw>=0)||e.push("未检测到旋转四元数列,已按静止 T-pose 填充旋转(仅有位置数据)");for(let f=0;f<a;f++){const A=n[f+1].split(",").map(E=>E.trim()),T=E=>E>=0?Number(A[E]):NaN;o[f*3]=T(h),o[f*3+1]=T(l),o[f*3+2]=T(u);for(const E of g){if(E.qw<0)continue;const C=(f*zt+E.joint)*4;c[C]=T(E.qx),c[C+1]=T(E.qy),c[C+2]=T(E.qz),c[C+3]=T(E.qw)}if(f===1&&p>=0){const E=Number(A[p]);E>0&&(d=Math.round(1/E))}}return{clip:{id:t.id,athleteId:t.athleteId,diveCode:t.diveCode,sessionId:t.sessionId,sampleRate:d,frameCount:a,rootPositions:o,localRotations:c,takeoffFrame:-1,entryFrame:-1,apexFrame:-1,openFrame:-1,defects:[],repaired:[],createdAt:Date.now()},warnings:e}}function ll(i){const t=[],e=i.frameCount;let n=-1;const s=(c,h)=>{t.some(l=>l.type==="drop"&&l.startFrame===c)||t.push({type:"drop",jointId:-1,startFrame:c,endFrame:h})};for(let c=0;c<e;c++){const h=Number.isNaN(i.rootPositions[c*3+1])||Number.isNaN(i.localRotations[c*zt*4+3]);h&&n<0&&(n=c),!h&&n>=0&&(s(n,c-1),n=-1)}n>=0&&s(n,e-1);const r=t.filter(c=>c.type==="drop"),a=c=>r.some(h=>c>=h.startFrame&&c<=h.endFrame);for(let c=0;c<zt;c++){const h=[];for(let p=1;p<e;p++){if(a(p)||a(p-1))continue;const d=Ln(i,p-1,c),g=Ln(i,p,c);if(!mr(d)||!mr(g))continue;d[0]*g[0]+d[1]*g[1]+d[2]*g[2]+d[3]*g[3]<0&&h.push(p)}let l=[];const u=()=>{if(l.length){const p=Math.max(0,l[0]-1),d=l[l.length-1];t.push({type:"flip",jointId:c,startFrame:p,endFrame:d}),l=[]}};for(const p of h)l.length&&p-l[l.length-1]>12&&u(),l.push(p);u()}const o=[];for(const c of t.filter(h=>h.type==="drop"))Dh(i,c),o.push({...c});for(const c of t.filter(h=>h.type==="flip"))Ph(i,c),o.push({...c});return i.defects=t,i.repaired=o,{detected:t,repaired:o}}function Ph(i,t){const e=pr(i,t.startFrame-1,-1);if(e<0)return;const n=pr(i,t.endFrame+1,1);for(let s=t.startFrame;s<=t.endFrame;s++){const r=Ln(i,s,t.jointId);if(!mr(r))continue;const a=Ln(i,s-1,t.jointId);mr(a)&&a[0]*r[0]+a[1]*r[1]+a[2]*r[2]+a[3]*r[3]<0&&Ma(i,s,t.jointId,po([-r[0],-r[1],-r[2],-r[3]]))}if(n>t.endFrame){const s=n-e;for(let r=e+1;r<n;r++){const a=(r-e)/s;Ma(i,r,t.jointId,mo(Ln(i,e,t.jointId),Ln(i,n,t.jointId),a))}}}function Dh(i,t){const e=pr(i,t.startFrame-1,-1),n=pr(i,t.endFrame+1,1);if(e<0||n<0)return;const s=n-e;for(let r=e+1;r<n;r++){const a=(r-e)/s,o=Xo(i,e),c=Xo(i,n),h=xh(o,c,a);i.rootPositions[r*3]=h[0],i.rootPositions[r*3+1]=h[1],i.rootPositions[r*3+2]=h[2];for(let l=0;l<zt;l++)Ma(i,r,l,mo(Ln(i,e,l),Ln(i,n,l),a))}}function pr(i,t,e){for(let n=t;n>=0&&n<i.frameCount;n+=e)if(!Number.isNaN(i.rootPositions[n*3+1])&&!Number.isNaN(i.localRotations[n*zt*4+3]))return n;return-1}function Ln(i,t,e){const n=(t*zt+e)*4;return[i.localRotations[n],i.localRotations[n+1],i.localRotations[n+2],i.localRotations[n+3]]}function Ma(i,t,e,n){const s=(t*zt+e)*4;i.localRotations[s]=n[0],i.localRotations[s+1]=n[1],i.localRotations[s+2]=n[2],i.localRotations[s+3]=n[3]}function Xo(i,t){return[i.rootPositions[t*3],i.rootPositions[t*3+1],i.rootPositions[t*3+2]]}function mr(i){return Number.isFinite(i[0])&&Number.isFinite(i[3])}function go(i){return i.repaired.map(t=>({start:t.startFrame,end:t.endFrame,label:t.type==="drop"?`丢帧 ${t.endFrame-t.startFrame+1}帧(已插值)`:"关节翻转(已校正)",kind:t.type}))}function rs(i){ei(i);const t=ot.state,e=s=>{const r=s?{...s,clipIds:[...s.clipIds]}:{id:Ii("sess"),date:new Date().toISOString().slice(0,10),venue:"",platformHeight:3,boardType:"spring",note:"",clipIds:[],createdAt:Date.now()},a=y("div",{className:"modal-backdrop"},[y("div",{className:"modal"},[y("h3",{},s?"编辑训练课":"新建训练课"),y("div",{className:"form-grid"},[ws("日期",y("input",{type:"date",value:r.date,oninput:o=>r.date=o.target.value})),ws("场馆",y("input",{value:r.venue,placeholder:"省跳水馆 3米板",oninput:o=>r.venue=o.target.value})),ws("高度(米)",Nh(String(r.platformHeight),[["1","1 米板"],["3","3 米板"],["5","5 米台"],["7.5","7.5 米台"],["10","10 米台"]],o=>{r.platformHeight=Number(o),r.boardType=Number(o)<=3?"spring":"platform"})),ws("备注",y("textarea",{rows:2,oninput:o=>r.note=o.target.value},r.note))]),y("div",{className:"row",style:"margin-top:16px;justify-content:flex-end"},[y("button",{onclick:()=>a.remove()},"取消"),y("button",{className:"primary",onclick:async()=>{await ot.saveSession(r),a.remove(),rs(i)}},"保存")])])]);document.body.appendChild(a)};if(i.append(y("div",{className:"toolbar"},[y("h2",{className:"page-title",style:"margin:0"},"训练课"),y("div",{className:"spacer"}),y("button",{className:"primary",onclick:()=>e()},"+ 新建训练课")])),t.sessions.length===0){i.append(y("div",{className:"empty"},"暂无训练课"));return}for(const s of[...t.sessions].sort((r,a)=>a.date.localeCompare(r.date))){const r=s.clipIds.map(h=>t.clips.find(l=>l.id===h)).filter(h=>!!h),a=y("div",{className:"card",style:"margin-bottom:16px"},[y("div",{className:"row"},[y("h3",{style:"margin:0"},`${s.date} · ${s.venue||"未命名场馆"}`),y("span",{className:"tag"},`${s.platformHeight}米${s.boardType==="spring"?"跳板":"跳台"}`),y("div",{className:"spacer"}),y("button",{onclick:()=>e(s)},"编辑"),y("button",{className:"danger",onclick:async()=>{confirm("删除该训练课?片段数据保留在库中")&&(await ot.deleteSession(s.id),rs(i))}},"删除")]),s.note?y("p",{className:"muted",style:"margin:8px 0"},s.note):null]),o=y("div",{style:"margin-top:10px;display:flex;flex-direction:column;gap:8px"});r.forEach((h,l)=>{const u=t.athletes.find(d=>d.id===h.athleteId),p=go(h);o.appendChild(y("div",{className:"row card",style:"padding:10px 14px;margin:0"},[y("b",{style:"color:var(--accent);min-width:64px"},`#${l+1} ${h.diveCode}`),y("span",{className:"muted"},u?.name??"未知队员"),y("span",{className:"tag"},`${h.frameCount} 帧 @${h.sampleRate}Hz`),p.length?y("span",{className:"tag yellow"},`${p.length} 段缺陷已修复`):y("span",{className:"tag green"},"数据完整"),y("div",{className:"spacer"}),y("button",{onclick:()=>ot.navigate("playback",h.id)},"回放分析"),y("button",{className:"danger",onclick:async()=>{confirm("删除这一跳?")&&(s.clipIds=s.clipIds.filter(d=>d!==h.id),await ot.saveSession(s),await ot.deleteClip(h.id),rs(i))}},"删除")]))}),a.appendChild(o);const c=y("div",{className:"row",style:"margin-top:12px"},[qo(s,"导入 BVH",".bvh",async h=>{const l=await zo(h);await n(l,"bvh",s,h.name)}),qo(s,"导入 CSV",".csv",async h=>{const l=await zo(h);await n(l,"csv",s,h.name)}),y("span",{className:"muted",style:"font-size:12px"},"导入后自动识别离板/入水,丢帧与关节翻转自动标黄并补插值")]);a.appendChild(c),i.append(a)}async function n(s,r,a,o){if(t.athletes.length===0){alert("请先建立队员档案");return}const c=t.athletes[0],l=/[1-6]\d{2,3}[ABCD]/.exec(o.toUpperCase())?.[0]??"107B",u=Ii("clip");let p,d=[];if(r==="bvh"){const f=Ah(s,{athleteId:c.id,diveCode:l,sessionId:a.id,id:u},t.settings.boneMaps[t.settings.activeBoneMap]);p=f.clip,d=f.unresolvedBones}else p=Lh(s,{athleteId:c.id,diveCode:l,sessionId:a.id,id:u,sampleRate:t.settings.sampleRate}).clip;ll(p);const g=c.heightCm/100*.521,_=al(p,t.settings.waterLevelY,a.platformHeight,g,c.heightCm/100*.9);p.takeoffFrame=_.takeoffFrame,p.entryFrame=_.entryFrame,p.apexFrame=ps(p),await ot.saveClip(p);const m=ot.analysis(p);p.openFrame=fs(p,m.metrics,t.settings),await ot.saveClip(p),a.clipIds.push(p.id),await ot.saveSession(a),d.length&&alert(`导入成功,但有 ${d.length} 块骨骼未映射,请到「设置」页手动对一次骨骼名`),rs(i)}}function qo(i,t,e,n){const s=y("input",{type:"file",accept:e,style:"display:none",onchange:async r=>{const a=r.target.files?.[0];a&&await n(a),r.target.value=""}});return y("span",{},[y("button",{onclick:()=>s.click()},t),s])}function ws(i,t){return y("div",{},[y("label",{},i),t])}function Nh(i,t,e){const n=y("select",{},t.map(([s,r])=>y("option",{value:s,selected:s===i},r)));return n.addEventListener("change",()=>e(n.value)),n}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const _o="171",Ih=0,Yo=1,Uh=2,hl=1,Fh=2,_n=3,Un=0,Pe=1,an=2,Pn=0,Ci=1,$o=2,Ko=3,Zo=4,Oh=5,$n=100,Bh=101,zh=102,Hh=103,kh=104,Vh=200,Gh=201,Wh=202,Xh=203,ya=204,Sa=205,qh=206,Yh=207,$h=208,Kh=209,Zh=210,jh=211,Jh=212,Qh=213,tu=214,Ea=0,ba=1,Ta=2,Ui=3,Aa=4,wa=5,Ra=6,Ca=7,ul=0,eu=1,nu=2,Dn=0,iu=1,su=2,ru=3,au=4,ou=5,cu=6,lu=7,dl=300,Fi=301,Oi=302,La=303,Pa=304,Ar=306,Da=1e3,Zn=1001,Na=1002,Qe=1003,hu=1004,Rs=1005,on=1006,Dr=1007,jn=1008,Sn=1009,fl=1010,pl=1011,ms=1012,vo=1013,Qn=1014,vn=1015,vs=1016,xo=1017,Mo=1018,Bi=1020,ml=35902,gl=1021,_l=1022,Ze=1023,vl=1024,xl=1025,Li=1026,zi=1027,Ml=1028,yo=1029,yl=1030,So=1031,Eo=1033,sr=33776,rr=33777,ar=33778,or=33779,Ia=35840,Ua=35841,Fa=35842,Oa=35843,Ba=36196,za=37492,Ha=37496,ka=37808,Va=37809,Ga=37810,Wa=37811,Xa=37812,qa=37813,Ya=37814,$a=37815,Ka=37816,Za=37817,ja=37818,Ja=37819,Qa=37820,to=37821,cr=36492,eo=36494,no=36495,Sl=36283,io=36284,so=36285,ro=36286,uu=3200,du=3201,El=0,fu=1,Cn="",ze="srgb",Hi="srgb-linear",gr="linear",ee="srgb",ai=7680,jo=519,pu=512,mu=513,gu=514,bl=515,_u=516,vu=517,xu=518,Mu=519,ao=35044,Jo="300 es",xn=2e3,_r=2001;class Gi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Qo=1234567;const cs=Math.PI/180,gs=180/Math.PI;function Mn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[i&255]+ye[i>>8&255]+ye[i>>16&255]+ye[i>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Vt(i,t,e){return Math.max(t,Math.min(e,i))}function bo(i,t){return(i%t+t)%t}function yu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Su(i,t,e){return i!==t?(e-i)/(t-i):0}function ls(i,t,e){return(1-e)*i+e*t}function Eu(i,t,e,n){return ls(i,t,1-Math.exp(-e*n))}function bu(i,t=1){return t-Math.abs(bo(i,t*2)-t)}function Tu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Au(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function wu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ru(i,t){return i+Math.random()*(t-i)}function Cu(i){return i*(.5-Math.random())}function Lu(i){i!==void 0&&(Qo=i);let t=Qo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pu(i){return i*cs}function Du(i){return i*gs}function Nu(i){return(i&i-1)===0&&i!==0}function Iu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Uu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Fu(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),h=r((t+n)/2),l=a((t+n)/2),u=r((t-n)/2),p=a((t-n)/2),d=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*l,c*u,c*p,o*h);break;case"YZY":i.set(c*p,o*l,c*u,o*h);break;case"ZXZ":i.set(c*u,c*p,o*l,o*h);break;case"XZX":i.set(o*l,c*g,c*d,o*h);break;case"YXY":i.set(c*d,o*l,c*g,o*h);break;case"ZYZ":i.set(c*g,c*d,o*l,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ke(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function te(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const He={DEG2RAD:cs,RAD2DEG:gs,generateUUID:Mn,clamp:Vt,euclideanModulo:bo,mapLinear:yu,inverseLerp:Su,lerp:ls,damp:Eu,pingpong:bu,smoothstep:Tu,smootherstep:Au,randInt:wu,randFloat:Ru,randFloatSpread:Cu,seededRandom:Lu,degToRad:Pu,radToDeg:Du,isPowerOfTwo:Nu,ceilPowerOfTwo:Iu,floorPowerOfTwo:Uu,setQuaternionFromProperEuler:Fu,normalize:te,denormalize:Ke};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Bt{constructor(t,e,n,s,r,a,o,c,h){Bt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h)}set(t,e,n,s,r,a,o,c,h){const l=this.elements;return l[0]=t,l[1]=s,l[2]=o,l[3]=e,l[4]=r,l[5]=c,l[6]=n,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],l=n[4],u=n[7],p=n[2],d=n[5],g=n[8],_=s[0],m=s[3],f=s[6],A=s[1],T=s[4],E=s[7],C=s[2],R=s[5],L=s[8];return r[0]=a*_+o*A+c*C,r[3]=a*m+o*T+c*R,r[6]=a*f+o*E+c*L,r[1]=h*_+l*A+u*C,r[4]=h*m+l*T+u*R,r[7]=h*f+l*E+u*L,r[2]=p*_+d*A+g*C,r[5]=p*m+d*T+g*R,r[8]=p*f+d*E+g*L,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8];return e*a*l-e*o*h-n*r*l+n*o*c+s*r*h-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=l*a-o*h,p=o*c-l*r,d=h*r-a*c,g=e*u+n*p+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*h-l*n)*_,t[2]=(o*n-s*a)*_,t[3]=p*_,t[4]=(l*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=d*_,t[7]=(n*c-h*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*o)+a+t,-s*h,s*c,-s*(-h*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Nr.makeScale(t,e)),this}rotate(t){return this.premultiply(Nr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Nr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Nr=new Bt;function Tl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function vr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ou(){const i=vr("canvas");return i.style.display="block",i}const tc={};function bi(i){i in tc||(tc[i]=!0,console.warn(i))}function Bu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function zu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Hu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ec=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nc=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ku(){const i={enabled:!0,workingColorSpace:Hi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ee&&(s.r=yn(s.r),s.g=yn(s.g),s.b=yn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ee&&(s.r=Pi(s.r),s.g=Pi(s.g),s.b=Pi(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Cn?gr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hi]:{primaries:t,whitePoint:n,transfer:gr,toXYZ:ec,fromXYZ:nc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ze},outputColorSpaceConfig:{drawingBufferColorSpace:ze}},[ze]:{primaries:t,whitePoint:n,transfer:ee,toXYZ:ec,fromXYZ:nc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ze}}}),i}const Zt=ku();function yn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Pi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let oi;class Vu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{oi===void 0&&(oi=vr("canvas")),oi.width=t.width,oi.height=t.height;const n=oi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=oi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=vr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=yn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(yn(e[n]/255)*255):e[n]=yn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Gu=0;class Al{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=Mn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ir(s[a].image)):r.push(Ir(s[a]))}else r=Ir(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ir(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wu=0;class we extends Gi{constructor(t=we.DEFAULT_IMAGE,e=we.DEFAULT_MAPPING,n=Zn,s=Zn,r=on,a=jn,o=Ze,c=Sn,h=we.DEFAULT_ANISOTROPY,l=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=Mn(),this.name="",this.source=new Al(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Da:t.x=t.x-Math.floor(t.x);break;case Zn:t.x=t.x<0?0:1;break;case Na:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Da:t.y=t.y-Math.floor(t.y);break;case Zn:t.y=t.y<0?0:1;break;case Na:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}we.DEFAULT_IMAGE=null;we.DEFAULT_MAPPING=dl;we.DEFAULT_ANISOTROPY=1;class ue{constructor(t=0,e=0,n=0,s=1){ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],l=c[4],u=c[8],p=c[1],d=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(l-p)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+p)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+d+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(h+1)/2,E=(d+1)/2,C=(f+1)/2,R=(l+p)/4,L=(u+_)/4,I=(g+m)/4;return T>E&&T>C?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=R/n,r=L/n):E>C?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=R/s,r=I/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=L/r,s=I/r),this.set(n,s,r,e),this}let A=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(p-l)*(p-l));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(u-_)/A,this.z=(p-l)/A,this.w=Math.acos((h+d+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this.w=Vt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this.w=Vt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xu extends Gi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new we(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Al(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ti extends Xu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class wl extends we{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class qu extends we{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],h=n[s+1],l=n[s+2],u=n[s+3];const p=r[a+0],d=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(o===1){t[e+0]=p,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==p||h!==d||l!==g){let m=1-o;const f=c*p+h*d+l*g+u*_,A=f>=0?1:-1,T=1-f*f;if(T>Number.EPSILON){const C=Math.sqrt(T),R=Math.atan2(C,f*A);m=Math.sin(m*R)/C,o=Math.sin(o*R)/C}const E=o*A;if(c=c*m+p*E,h=h*m+d*E,l=l*m+g*E,u=u*m+_*E,m===1-o){const C=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=C,h*=C,l*=C,u*=C}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],h=n[s+2],l=n[s+3],u=r[a],p=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+l*u+c*d-h*p,t[e+1]=c*g+l*p+h*u-o*d,t[e+2]=h*g+l*d+o*p-c*u,t[e+3]=l*g-o*u-c*p-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,h=o(n/2),l=o(s/2),u=o(r/2),p=c(n/2),d=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=p*l*u+h*d*g,this._y=h*d*u-p*l*g,this._z=h*l*g+p*d*u,this._w=h*l*u-p*d*g;break;case"YXZ":this._x=p*l*u+h*d*g,this._y=h*d*u-p*l*g,this._z=h*l*g-p*d*u,this._w=h*l*u+p*d*g;break;case"ZXY":this._x=p*l*u-h*d*g,this._y=h*d*u+p*l*g,this._z=h*l*g+p*d*u,this._w=h*l*u-p*d*g;break;case"ZYX":this._x=p*l*u-h*d*g,this._y=h*d*u+p*l*g,this._z=h*l*g-p*d*u,this._w=h*l*u+p*d*g;break;case"YZX":this._x=p*l*u+h*d*g,this._y=h*d*u+p*l*g,this._z=h*l*g-p*d*u,this._w=h*l*u-p*d*g;break;case"XZY":this._x=p*l*u-h*d*g,this._y=h*d*u-p*l*g,this._z=h*l*g+p*d*u,this._w=h*l*u+p*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],h=e[2],l=e[6],u=e[10],p=n+o+u;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(l-c)*d,this._y=(r-h)*d,this._z=(a-s)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(l-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+h)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(r-h)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+l)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+h)/d,this._y=(c+l)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Vt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,h=e._z,l=e._w;return this._x=n*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-n*h,this._z=r*l+a*h+n*c-s*o,this._w=a*l-n*o-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-e)*l)/h,p=Math.sin(e*l)/h;return this._w=a*u+this._w*p,this._x=n*u+this._x*p,this._y=s*u+this._y*p,this._z=r*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ic.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ic.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,h=2*(a*s-o*n),l=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*h+a*u-o*l,this.y=n+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ur.copy(this).projectOnVector(t),this.sub(Ur)}reflect(t){return this.sub(Ur.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ur=new P,ic=new Wi;class xs{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,qe):qe.fromBufferAttribute(r,a),qe.applyMatrix4(t.matrixWorld),this.expandByPoint(qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Cs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cs.copy(n.boundingBox)),Cs.applyMatrix4(t.matrixWorld),this.union(Cs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,qe),qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Zi),Ls.subVectors(this.max,Zi),ci.subVectors(t.a,Zi),li.subVectors(t.b,Zi),hi.subVectors(t.c,Zi),En.subVectors(li,ci),bn.subVectors(hi,li),Hn.subVectors(ci,hi);let e=[0,-En.z,En.y,0,-bn.z,bn.y,0,-Hn.z,Hn.y,En.z,0,-En.x,bn.z,0,-bn.x,Hn.z,0,-Hn.x,-En.y,En.x,0,-bn.y,bn.x,0,-Hn.y,Hn.x,0];return!Fr(e,ci,li,hi,Ls)||(e=[1,0,0,0,1,0,0,0,1],!Fr(e,ci,li,hi,Ls))?!1:(Ps.crossVectors(En,bn),e=[Ps.x,Ps.y,Ps.z],Fr(e,ci,li,hi,Ls))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(un),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const un=[new P,new P,new P,new P,new P,new P,new P,new P],qe=new P,Cs=new xs,ci=new P,li=new P,hi=new P,En=new P,bn=new P,Hn=new P,Zi=new P,Ls=new P,Ps=new P,kn=new P;function Fr(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){kn.fromArray(i,r);const o=s.x*Math.abs(kn.x)+s.y*Math.abs(kn.y)+s.z*Math.abs(kn.z),c=t.dot(kn),h=e.dot(kn),l=n.dot(kn);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}const Yu=new xs,ji=new P,Or=new P;class wr{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Yu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ji.subVectors(t,this.center);const e=ji.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ji,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Or.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ji.copy(t.center).add(Or)),this.expandByPoint(ji.copy(t.center).sub(Or))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new P,Br=new P,Ds=new P,Tn=new P,zr=new P,Ns=new P,Hr=new P;class Rl{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(dn.copy(this.origin).addScaledVector(this.direction,e),dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Br.copy(t).add(e).multiplyScalar(.5),Ds.copy(e).sub(t).normalize(),Tn.copy(this.origin).sub(Br);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ds),o=Tn.dot(this.direction),c=-Tn.dot(Ds),h=Tn.lengthSq(),l=Math.abs(1-a*a);let u,p,d,g;if(l>0)if(u=a*c-o,p=a*o-c,g=r*l,u>=0)if(p>=-g)if(p<=g){const _=1/l;u*=_,p*=_,d=u*(u+a*p+2*o)+p*(a*u+p+2*c)+h}else p=r,u=Math.max(0,-(a*p+o)),d=-u*u+p*(p+2*c)+h;else p=-r,u=Math.max(0,-(a*p+o)),d=-u*u+p*(p+2*c)+h;else p<=-g?(u=Math.max(0,-(-a*r+o)),p=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+p*(p+2*c)+h):p<=g?(u=0,p=Math.min(Math.max(-r,-c),r),d=p*(p+2*c)+h):(u=Math.max(0,-(a*r+o)),p=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+p*(p+2*c)+h);else p=a>0?-r:r,u=Math.max(0,-(a*p+o)),d=-u*u+p*(p+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Br).addScaledVector(Ds,p),d}intersectSphere(t,e){dn.subVectors(t.center,this.origin);const n=dn.dot(this.direction),s=dn.dot(dn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,p=this.origin;return h>=0?(n=(t.min.x-p.x)*h,s=(t.max.x-p.x)*h):(n=(t.max.x-p.x)*h,s=(t.min.x-p.x)*h),l>=0?(r=(t.min.y-p.y)*l,a=(t.max.y-p.y)*l):(r=(t.max.y-p.y)*l,a=(t.min.y-p.y)*l),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-p.z)*u,c=(t.max.z-p.z)*u):(o=(t.max.z-p.z)*u,c=(t.min.z-p.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,dn)!==null}intersectTriangle(t,e,n,s,r){zr.subVectors(e,t),Ns.subVectors(n,t),Hr.crossVectors(zr,Ns);let a=this.direction.dot(Hr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Tn.subVectors(this.origin,t);const c=o*this.direction.dot(Ns.crossVectors(Tn,Ns));if(c<0)return null;const h=o*this.direction.dot(zr.cross(Tn));if(h<0||c+h>a)return null;const l=-o*Tn.dot(Hr);return l<0?null:this.at(l/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,s,r,a,o,c,h,l,u,p,d,g,_,m){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h,l,u,p,d,g,_,m)}set(t,e,n,s,r,a,o,c,h,l,u,p,d,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=h,f[6]=l,f[10]=u,f[14]=p,f[3]=d,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ui.setFromMatrixColumn(t,0).length(),r=1/ui.setFromMatrixColumn(t,1).length(),a=1/ui.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const p=a*l,d=a*u,g=o*l,_=o*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=d+g*h,e[5]=p-_*h,e[9]=-o*c,e[2]=_-p*h,e[6]=g+d*h,e[10]=a*c}else if(t.order==="YXZ"){const p=c*l,d=c*u,g=h*l,_=h*u;e[0]=p+_*o,e[4]=g*o-d,e[8]=a*h,e[1]=a*u,e[5]=a*l,e[9]=-o,e[2]=d*o-g,e[6]=_+p*o,e[10]=a*c}else if(t.order==="ZXY"){const p=c*l,d=c*u,g=h*l,_=h*u;e[0]=p-_*o,e[4]=-a*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*l,e[9]=_-p*o,e[2]=-a*h,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const p=a*l,d=a*u,g=o*l,_=o*u;e[0]=c*l,e[4]=g*h-d,e[8]=p*h+_,e[1]=c*u,e[5]=_*h+p,e[9]=d*h-g,e[2]=-h,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const p=a*c,d=a*h,g=o*c,_=o*h;e[0]=c*l,e[4]=_-p*u,e[8]=g*u+d,e[1]=u,e[5]=a*l,e[9]=-o*l,e[2]=-h*l,e[6]=d*u+g,e[10]=p-_*u}else if(t.order==="XZY"){const p=a*c,d=a*h,g=o*c,_=o*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=p*u+_,e[5]=a*l,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*l,e[10]=_*u+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose($u,t,Ku)}lookAt(t,e,n){const s=this.elements;return Ne.subVectors(t,e),Ne.lengthSq()===0&&(Ne.z=1),Ne.normalize(),An.crossVectors(n,Ne),An.lengthSq()===0&&(Math.abs(n.z)===1?Ne.x+=1e-4:Ne.z+=1e-4,Ne.normalize(),An.crossVectors(n,Ne)),An.normalize(),Is.crossVectors(Ne,An),s[0]=An.x,s[4]=Is.x,s[8]=Ne.x,s[1]=An.y,s[5]=Is.y,s[9]=Ne.y,s[2]=An.z,s[6]=Is.z,s[10]=Ne.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],l=n[1],u=n[5],p=n[9],d=n[13],g=n[2],_=n[6],m=n[10],f=n[14],A=n[3],T=n[7],E=n[11],C=n[15],R=s[0],L=s[4],I=s[8],S=s[12],x=s[1],D=s[5],H=s[9],k=s[13],q=s[2],K=s[6],U=s[10],G=s[14],z=s[3],nt=s[7],st=s[11],Mt=s[15];return r[0]=a*R+o*x+c*q+h*z,r[4]=a*L+o*D+c*K+h*nt,r[8]=a*I+o*H+c*U+h*st,r[12]=a*S+o*k+c*G+h*Mt,r[1]=l*R+u*x+p*q+d*z,r[5]=l*L+u*D+p*K+d*nt,r[9]=l*I+u*H+p*U+d*st,r[13]=l*S+u*k+p*G+d*Mt,r[2]=g*R+_*x+m*q+f*z,r[6]=g*L+_*D+m*K+f*nt,r[10]=g*I+_*H+m*U+f*st,r[14]=g*S+_*k+m*G+f*Mt,r[3]=A*R+T*x+E*q+C*z,r[7]=A*L+T*D+E*K+C*nt,r[11]=A*I+T*H+E*U+C*st,r[15]=A*S+T*k+E*G+C*Mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],h=t[13],l=t[2],u=t[6],p=t[10],d=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*c*u-s*h*u-r*o*p+n*h*p+s*o*d-n*c*d)+_*(+e*c*d-e*h*p+r*a*p-s*a*d+s*h*l-r*c*l)+m*(+e*h*u-e*o*d-r*a*u+n*a*d+r*o*l-n*h*l)+f*(-s*o*l-e*c*u+e*o*p+s*a*u-n*a*p+n*c*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=t[9],p=t[10],d=t[11],g=t[12],_=t[13],m=t[14],f=t[15],A=u*m*h-_*p*h+_*c*d-o*m*d-u*c*f+o*p*f,T=g*p*h-l*m*h-g*c*d+a*m*d+l*c*f-a*p*f,E=l*_*h-g*u*h+g*o*d-a*_*d-l*o*f+a*u*f,C=g*u*c-l*_*c-g*o*p+a*_*p+l*o*m-a*u*m,R=e*A+n*T+s*E+r*C;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/R;return t[0]=A*L,t[1]=(_*p*r-u*m*r-_*s*d+n*m*d+u*s*f-n*p*f)*L,t[2]=(o*m*r-_*c*r+_*s*h-n*m*h-o*s*f+n*c*f)*L,t[3]=(u*c*r-o*p*r-u*s*h+n*p*h+o*s*d-n*c*d)*L,t[4]=T*L,t[5]=(l*m*r-g*p*r+g*s*d-e*m*d-l*s*f+e*p*f)*L,t[6]=(g*c*r-a*m*r-g*s*h+e*m*h+a*s*f-e*c*f)*L,t[7]=(a*p*r-l*c*r+l*s*h-e*p*h-a*s*d+e*c*d)*L,t[8]=E*L,t[9]=(g*u*r-l*_*r-g*n*d+e*_*d+l*n*f-e*u*f)*L,t[10]=(a*_*r-g*o*r+g*n*h-e*_*h-a*n*f+e*o*f)*L,t[11]=(l*o*r-a*u*r-l*n*h+e*u*h+a*n*d-e*o*d)*L,t[12]=C*L,t[13]=(l*_*s-g*u*s+g*n*p-e*_*p-l*n*m+e*u*m)*L,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*L,t[15]=(a*u*s-l*o*s+l*n*c-e*u*c-a*n*p+e*o*p)*L,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,h=r*a,l=r*o;return this.set(h*a+n,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+n,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,h=r+r,l=a+a,u=o+o,p=r*h,d=r*l,g=r*u,_=a*l,m=a*u,f=o*u,A=c*h,T=c*l,E=c*u,C=n.x,R=n.y,L=n.z;return s[0]=(1-(_+f))*C,s[1]=(d+E)*C,s[2]=(g-T)*C,s[3]=0,s[4]=(d-E)*R,s[5]=(1-(p+f))*R,s[6]=(m+A)*R,s[7]=0,s[8]=(g+T)*L,s[9]=(m-A)*L,s[10]=(1-(p+_))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ui.set(s[0],s[1],s[2]).length();const a=ui.set(s[4],s[5],s[6]).length(),o=ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ye.copy(this);const h=1/r,l=1/a,u=1/o;return Ye.elements[0]*=h,Ye.elements[1]*=h,Ye.elements[2]*=h,Ye.elements[4]*=l,Ye.elements[5]*=l,Ye.elements[6]*=l,Ye.elements[8]*=u,Ye.elements[9]*=u,Ye.elements[10]*=u,e.setFromRotationMatrix(Ye),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=xn){const c=this.elements,h=2*r/(e-t),l=2*r/(n-s),u=(e+t)/(e-t),p=(n+s)/(n-s);let d,g;if(o===xn)d=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===_r)d=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=xn){const c=this.elements,h=1/(e-t),l=1/(n-s),u=1/(a-r),p=(e+t)*h,d=(n+s)*l;let g,_;if(o===xn)g=(a+r)*u,_=-2*u;else if(o===_r)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ui=new P,Ye=new re,$u=new P(0,0,0),Ku=new P(1,1,1),An=new P,Is=new P,Ne=new P,sc=new re,rc=new Wi;class cn{constructor(t=0,e=0,n=0,s=cn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Vt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Vt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Vt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return sc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(sc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return rc.setFromEuler(this),this.setFromQuaternion(rc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}cn.DEFAULT_ORDER="XYZ";class Cl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zu=0;const ac=new P,di=new Wi,fn=new re,Us=new P,Ji=new P,ju=new P,Ju=new Wi,oc=new P(1,0,0),cc=new P(0,1,0),lc=new P(0,0,1),hc={type:"added"},Qu={type:"removed"},fi={type:"childadded",child:null},kr={type:"childremoved",child:null};class pe extends Gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=Mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pe.DEFAULT_UP.clone();const t=new P,e=new cn,n=new Wi,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new re},normalMatrix:{value:new Bt}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.multiply(di),this}rotateOnWorldAxis(t,e){return di.setFromAxisAngle(t,e),this.quaternion.premultiply(di),this}rotateX(t){return this.rotateOnAxis(oc,t)}rotateY(t){return this.rotateOnAxis(cc,t)}rotateZ(t){return this.rotateOnAxis(lc,t)}translateOnAxis(t,e){return ac.copy(t).applyQuaternion(this.quaternion),this.position.add(ac.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(oc,t)}translateY(t){return this.translateOnAxis(cc,t)}translateZ(t){return this.translateOnAxis(lc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Us.copy(t):Us.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(Ji,Us,this.up):fn.lookAt(Us,Ji,this.up),this.quaternion.setFromRotationMatrix(fn),s&&(fn.extractRotation(s.matrixWorld),di.setFromRotationMatrix(fn),this.quaternion.premultiply(di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(hc),fi.child=t,this.dispatchEvent(fi),fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Qu),kr.child=t,this.dispatchEvent(kr),kr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(hc),fi.child=t,this.dispatchEvent(fi),fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,t,ju),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,Ju,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),h=a(t.textures),l=a(t.images),u=a(t.shapes),p=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const h in o){const l=o[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}pe.DEFAULT_UP=new P(0,1,0);pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $e=new P,pn=new P,Vr=new P,mn=new P,pi=new P,mi=new P,uc=new P,Gr=new P,Wr=new P,Xr=new P,qr=new ue,Yr=new ue,$r=new ue;class ke{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$e.subVectors(t,e),s.cross($e);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){$e.subVectors(s,e),pn.subVectors(n,e),Vr.subVectors(t,e);const a=$e.dot($e),o=$e.dot(pn),c=$e.dot(Vr),h=pn.dot(pn),l=pn.dot(Vr),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const p=1/u,d=(h*c-o*l)*p,g=(a*l-o*c)*p;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,mn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,mn.x),c.addScaledVector(a,mn.y),c.addScaledVector(o,mn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return qr.setScalar(0),Yr.setScalar(0),$r.setScalar(0),qr.fromBufferAttribute(t,e),Yr.fromBufferAttribute(t,n),$r.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(qr,r.x),a.addScaledVector(Yr,r.y),a.addScaledVector($r,r.z),a}static isFrontFacing(t,e,n,s){return $e.subVectors(n,e),pn.subVectors(t,e),$e.cross(pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $e.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),$e.cross(pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ke.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ke.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return ke.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return ke.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ke.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;pi.subVectors(s,n),mi.subVectors(r,n),Gr.subVectors(t,n);const c=pi.dot(Gr),h=mi.dot(Gr);if(c<=0&&h<=0)return e.copy(n);Wr.subVectors(t,s);const l=pi.dot(Wr),u=mi.dot(Wr);if(l>=0&&u<=l)return e.copy(s);const p=c*u-l*h;if(p<=0&&c>=0&&l<=0)return a=c/(c-l),e.copy(n).addScaledVector(pi,a);Xr.subVectors(t,r);const d=pi.dot(Xr),g=mi.dot(Xr);if(g>=0&&d<=g)return e.copy(r);const _=d*h-c*g;if(_<=0&&h>=0&&g<=0)return o=h/(h-g),e.copy(n).addScaledVector(mi,o);const m=l*g-d*u;if(m<=0&&u-l>=0&&d-g>=0)return uc.subVectors(r,s),o=(u-l)/(u-l+(d-g)),e.copy(s).addScaledVector(uc,o);const f=1/(m+_+p);return a=_*f,o=p*f,e.copy(n).addScaledVector(pi,a).addScaledVector(mi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ll={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wn={h:0,s:0,l:0},Fs={h:0,s:0,l:0};function Kr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ut{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=bo(t,1),e=Vt(e,0,1),n=Vt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Kr(a,r,t+1/3),this.g=Kr(a,r,t),this.b=Kr(a,r,t-1/3)}return Zt.toWorkingColorSpace(this,s),this}setStyle(t,e=ze){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ze){const n=Ll[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=yn(t.r),this.g=yn(t.g),this.b=yn(t.b),this}copyLinearToSRGB(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ze){return Zt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Vt(Se.r*255,0,255))*65536+Math.round(Vt(Se.g*255,0,255))*256+Math.round(Vt(Se.b*255,0,255))}getHexString(t=ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,s=Se.g,r=Se.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,h;const l=(o+a)/2;if(o===a)c=0,h=0;else{const u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=ze){Zt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,s=Se.b;return t!==ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(wn),this.setHSL(wn.h+t,wn.s+e,wn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(wn),t.getHSL(Fs);const n=ls(wn.h,Fs.h,e),s=ls(wn.s,Fs.s,e),r=ls(wn.l,Fs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Ut;Ut.NAMES=Ll;let td=0;class ni extends Gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=Mn(),this.name="",this.type="Material",this.blending=Ci,this.side=Un,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ya,this.blendDst=Sa,this.blendEquation=$n,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ut(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ci&&(n.blending=this.blending),this.side!==Un&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ya&&(n.blendSrc=this.blendSrc),this.blendDst!==Sa&&(n.blendDst=this.blendDst),this.blendEquation!==$n&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Di extends ni{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new cn,this.combine=ul,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fe=new P,Os=new ft;class tn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ao,this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Os.fromBufferAttribute(this,e),Os.applyMatrix3(t),this.setXY(e,Os.x,Os.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ke(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=te(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ke(e,this.array)),e}setX(t,e){return this.normalized&&(e=te(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ke(e,this.array)),e}setY(t,e){return this.normalized&&(e=te(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ke(e,this.array)),e}setZ(t,e){return this.normalized&&(e=te(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ke(e,this.array)),e}setW(t,e){return this.normalized&&(e=te(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=te(e,this.array),n=te(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=te(e,this.array),n=te(n,this.array),s=te(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=te(e,this.array),n=te(n,this.array),s=te(s,this.array),r=te(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ao&&(t.usage=this.usage),t}}class Pl extends tn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Dl extends tn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends tn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let ed=0;const Be=new re,Zr=new pe,gi=new P,Ie=new xs,Qi=new xs,_e=new P;class ve extends Gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=Mn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Tl(t)?Dl:Pl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Bt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Be.makeRotationFromQuaternion(t),this.applyMatrix4(Be),this}rotateX(t){return Be.makeRotationX(t),this.applyMatrix4(Be),this}rotateY(t){return Be.makeRotationY(t),this.applyMatrix4(Be),this}rotateZ(t){return Be.makeRotationZ(t),this.applyMatrix4(Be),this}translate(t,e,n){return Be.makeTranslation(t,e,n),this.applyMatrix4(Be),this}scale(t,e,n){return Be.makeScale(t,e,n),this.applyMatrix4(Be),this}lookAt(t){return Zr.lookAt(t),Zr.updateMatrix(),this.applyMatrix4(Zr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ie.setFromBufferAttribute(r),this.morphTargetsRelative?(_e.addVectors(this.boundingBox.min,Ie.min),this.boundingBox.expandByPoint(_e),_e.addVectors(this.boundingBox.max,Ie.max),this.boundingBox.expandByPoint(_e)):(this.boundingBox.expandByPoint(Ie.min),this.boundingBox.expandByPoint(Ie.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(Ie.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(_e.addVectors(Ie.min,Qi.min),Ie.expandByPoint(_e),_e.addVectors(Ie.max,Qi.max),Ie.expandByPoint(_e)):(Ie.expandByPoint(Qi.min),Ie.expandByPoint(Qi.max))}Ie.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)_e.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(_e));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)_e.fromBufferAttribute(o,h),c&&(gi.fromBufferAttribute(t,h),_e.add(gi)),s=Math.max(s,n.distanceToSquared(_e))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let I=0;I<n.count;I++)o[I]=new P,c[I]=new P;const h=new P,l=new P,u=new P,p=new ft,d=new ft,g=new ft,_=new P,m=new P;function f(I,S,x){h.fromBufferAttribute(n,I),l.fromBufferAttribute(n,S),u.fromBufferAttribute(n,x),p.fromBufferAttribute(r,I),d.fromBufferAttribute(r,S),g.fromBufferAttribute(r,x),l.sub(h),u.sub(h),d.sub(p),g.sub(p);const D=1/(d.x*g.y-g.x*d.y);isFinite(D)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(D),m.copy(u).multiplyScalar(d.x).addScaledVector(l,-g.x).multiplyScalar(D),o[I].add(_),o[S].add(_),o[x].add(_),c[I].add(m),c[S].add(m),c[x].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let I=0,S=A.length;I<S;++I){const x=A[I],D=x.start,H=x.count;for(let k=D,q=D+H;k<q;k+=3)f(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const T=new P,E=new P,C=new P,R=new P;function L(I){C.fromBufferAttribute(s,I),R.copy(C);const S=o[I];T.copy(S),T.sub(C.multiplyScalar(C.dot(S))).normalize(),E.crossVectors(R,S);const D=E.dot(c[I])<0?-1:1;a.setXYZW(I,T.x,T.y,T.z,D)}for(let I=0,S=A.length;I<S;++I){const x=A[I],D=x.start,H=x.count;for(let k=D,q=D+H;k<q;k+=3)L(t.getX(k+0)),L(t.getX(k+1)),L(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new tn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const s=new P,r=new P,a=new P,o=new P,c=new P,h=new P,l=new P,u=new P;if(t)for(let p=0,d=t.count;p<d;p+=3){const g=t.getX(p+0),_=t.getX(p+1),m=t.getX(p+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,m),o.add(l),c.add(l),h.add(l),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),a.fromBufferAttribute(e,p+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),n.setXYZ(p+0,l.x,l.y,l.z),n.setXYZ(p+1,l.x,l.y,l.z),n.setXYZ(p+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)_e.fromBufferAttribute(t,e),_e.normalize(),t.setXYZ(e,_e.x,_e.y,_e.z)}toNonIndexed(){function t(o,c){const h=o.array,l=o.itemSize,u=o.normalized,p=new h.constructor(c.length*l);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*l;for(let f=0;f<l;f++)p[g++]=h[d++]}return new tn(p,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ve,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=t(c,n);e.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){const p=h[l],d=t(p,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let u=0,p=h.length;u<p;u++){const d=h[u];l.push(d.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(e))}const r=t.morphAttributes;for(const h in r){const l=[],u=r[h];for(let p=0,d=u.length;p<d;p++)l.push(u[p].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,l=a.length;h<l;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const dc=new re,Vn=new Rl,Bs=new wr,fc=new P,zs=new P,Hs=new P,ks=new P,jr=new P,Vs=new P,pc=new P,Gs=new P;class ce extends pe{constructor(t=new ve,e=new Di){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Vs.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=o[c],u=r[c];l!==0&&(jr.fromBufferAttribute(u,t),a?Vs.addScaledVector(jr,l):Vs.addScaledVector(jr.sub(e),l))}e.add(Vs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(r),Vn.copy(t.ray).recast(t.near),!(Bs.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(Bs,fc)===null||Vn.origin.distanceToSquared(fc)>(t.far-t.near)**2))&&(dc.copy(r).invert(),Vn.copy(t.ray).applyMatrix4(dc),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Vn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,p=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const m=p[g],f=a[m.materialIndex],A=Math.max(m.start,d.start),T=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let E=A,C=T;E<C;E+=3){const R=o.getX(E),L=o.getX(E+1),I=o.getX(E+2);s=Ws(this,f,t,n,h,l,u,R,L,I),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,f=_;m<f;m+=3){const A=o.getX(m),T=o.getX(m+1),E=o.getX(m+2);s=Ws(this,a,t,n,h,l,u,A,T,E),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const m=p[g],f=a[m.materialIndex],A=Math.max(m.start,d.start),T=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let E=A,C=T;E<C;E+=3){const R=E,L=E+1,I=E+2;s=Ws(this,f,t,n,h,l,u,R,L,I),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,f=_;m<f;m+=3){const A=m,T=m+1,E=m+2;s=Ws(this,a,t,n,h,l,u,A,T,E),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function nd(i,t,e,n,s,r,a,o){let c;if(t.side===Pe?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===Un,o),c===null)return null;Gs.copy(o),Gs.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Gs);return h<e.near||h>e.far?null:{distance:h,point:Gs.clone(),object:i}}function Ws(i,t,e,n,s,r,a,o,c,h){i.getVertexPosition(o,zs),i.getVertexPosition(c,Hs),i.getVertexPosition(h,ks);const l=nd(i,t,e,n,zs,Hs,ks,pc);if(l){const u=new P;ke.getBarycoord(pc,zs,Hs,ks,u),s&&(l.uv=ke.getInterpolatedAttribute(s,o,c,h,u,new ft)),r&&(l.uv1=ke.getInterpolatedAttribute(r,o,c,h,u,new ft)),a&&(l.normal=ke.getInterpolatedAttribute(a,o,c,h,u,new P),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new P,materialIndex:0};ke.getNormal(zs,Hs,ks,p.normal),l.face=p,l.barycoord=u}return l}class Nn extends ve{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],l=[],u=[];let p=0,d=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new oe(h,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(u,2));function g(_,m,f,A,T,E,C,R,L,I,S){const x=E/L,D=C/I,H=E/2,k=C/2,q=R/2,K=L+1,U=I+1;let G=0,z=0;const nt=new P;for(let st=0;st<U;st++){const Mt=st*D-k;for(let Pt=0;Pt<K;Pt++){const Xt=Pt*x-H;nt[_]=Xt*A,nt[m]=Mt*T,nt[f]=q,h.push(nt.x,nt.y,nt.z),nt[_]=0,nt[m]=0,nt[f]=R>0?1:-1,l.push(nt.x,nt.y,nt.z),u.push(Pt/L),u.push(1-st/I),G+=1}}for(let st=0;st<I;st++)for(let Mt=0;Mt<L;Mt++){const Pt=p+Mt+K*st,Xt=p+Mt+K*(st+1),$=p+(Mt+1)+K*(st+1),tt=p+(Mt+1)+K*st;c.push(Pt,Xt,tt),c.push(Xt,$,tt),z+=6}o.addGroup(d,z,S),d+=z,p+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Nn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ae(i){const t={};for(let e=0;e<i.length;e++){const n=ki(i[e]);for(const s in n)t[s]=n[s]}return t}function id(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Nl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const sd={clone:ki,merge:Ae};var rd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ad=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends ni{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rd,this.fragmentShader=ad,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=id(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Il extends pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Rn=new P,mc=new ft,gc=new ft;class Ue extends Il{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=gs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(cs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Rn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Rn.x,Rn.y).multiplyScalar(-t/Rn.z),Rn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Rn.x,Rn.y).multiplyScalar(-t/Rn.z)}getViewSize(t,e){return this.getViewBounds(t,mc,gc),e.subVectors(gc,mc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(cs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const _i=-90,vi=1;class od extends pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ue(_i,vi,t,e);s.layers=this.layers,this.add(s);const r=new Ue(_i,vi,t,e);r.layers=this.layers,this.add(r);const a=new Ue(_i,vi,t,e);a.layers=this.layers,this.add(a);const o=new Ue(_i,vi,t,e);o.layers=this.layers,this.add(o);const c=new Ue(_i,vi,t,e);c.layers=this.layers,this.add(c);const h=new Ue(_i,vi,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const h of e)this.remove(h);if(t===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===_r)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,h,l]=this.children,u=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,l),t.setRenderTarget(u,p,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ul extends we{constructor(t,e,n,s,r,a,o,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:Fi,super(t,e,n,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class cd extends ti{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ul(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:on}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Nn(5,5,5),r=new Fn({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pe,blending:Pn});r.uniforms.tEquirect.value=e;const a=new ce(s,r),o=e.minFilter;return e.minFilter===jn&&(e.minFilter=on),new od(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class Fl extends pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new cn,this.environmentIntensity=1,this.environmentRotation=new cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ld{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ao,this.updateRanges=[],this.version=0,this.uuid=Mn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Te=new P;class xr{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Ke(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=te(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=te(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=te(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=te(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=te(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Ke(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Ke(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Ke(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Ke(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=te(e,this.array),n=te(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=te(e,this.array),n=te(n,this.array),s=te(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=te(e,this.array),n=te(n,this.array),s=te(s,this.array),r=te(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new tn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new xr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ol extends ni{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ut(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let xi;const ts=new P,Mi=new P,yi=new P,Si=new ft,es=new ft,Bl=new re,Xs=new P,ns=new P,qs=new P,_c=new ft,Jr=new ft,vc=new ft;class hd extends pe{constructor(t=new Ol){if(super(),this.isSprite=!0,this.type="Sprite",xi===void 0){xi=new ve;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ld(e,5);xi.setIndex([0,1,2,0,2,3]),xi.setAttribute("position",new xr(n,3,0,!1)),xi.setAttribute("uv",new xr(n,2,3,!1))}this.geometry=xi,this.material=t,this.center=new ft(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Mi.setFromMatrixScale(this.matrixWorld),Bl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),yi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Mi.multiplyScalar(-yi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Ys(Xs.set(-.5,-.5,0),yi,a,Mi,s,r),Ys(ns.set(.5,-.5,0),yi,a,Mi,s,r),Ys(qs.set(.5,.5,0),yi,a,Mi,s,r),_c.set(0,0),Jr.set(1,0),vc.set(1,1);let o=t.ray.intersectTriangle(Xs,ns,qs,!1,ts);if(o===null&&(Ys(ns.set(-.5,.5,0),yi,a,Mi,s,r),Jr.set(0,1),o=t.ray.intersectTriangle(Xs,qs,ns,!1,ts),o===null))return;const c=t.ray.origin.distanceTo(ts);c<t.near||c>t.far||e.push({distance:c,point:ts.clone(),uv:ke.getInterpolation(ts,Xs,ns,qs,_c,Jr,vc,new ft),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ys(i,t,e,n,s,r){Si.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(es.x=r*Si.x-s*Si.y,es.y=s*Si.x+r*Si.y):es.copy(Si),i.copy(t),i.x+=es.x,i.y+=es.y,i.applyMatrix4(Bl)}class ud extends pe{constructor(){super(),this.isBone=!0,this.type="Bone"}}const Qr=new P,dd=new P,fd=new Bt;class qn{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Qr.subVectors(n,e).cross(dd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Qr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||fd.getNormalMatrix(t),s=this.coplanarPoint(Qr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gn=new wr,$s=new P;class To{constructor(t=new qn,e=new qn,n=new qn,s=new qn,r=new qn,a=new qn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=xn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],p=s[7],d=s[8],g=s[9],_=s[10],m=s[11],f=s[12],A=s[13],T=s[14],E=s[15];if(n[0].setComponents(c-r,p-h,m-d,E-f).normalize(),n[1].setComponents(c+r,p+h,m+d,E+f).normalize(),n[2].setComponents(c+a,p+l,m+g,E+A).normalize(),n[3].setComponents(c-a,p-l,m-g,E-A).normalize(),n[4].setComponents(c-o,p-u,m-_,E-T).normalize(),e===xn)n[5].setComponents(c+o,p+u,m+_,E+T).normalize();else if(e===_r)n[5].setComponents(o,u,_,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Gn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Gn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Gn)}intersectsSprite(t){return Gn.center.set(0,0,0),Gn.radius=.7071067811865476,Gn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Gn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if($s.x=s.normal.x>0?t.max.x:t.min.x,$s.y=s.normal.y>0?t.max.y:t.min.y,$s.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint($s)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ms extends ni{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ut(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Mr=new P,yr=new P,xc=new re,is=new Rl,Ks=new wr,ta=new P,Mc=new P;class hs extends pe{constructor(t=new ve,e=new Ms){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Mr.fromBufferAttribute(e,s-1),yr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Mr.distanceTo(yr);t.setAttribute("lineDistance",new oe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(s),Ks.radius+=r,t.ray.intersectsSphere(Ks)===!1)return;xc.copy(s).invert(),is.copy(t.ray).applyMatrix4(xc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,l=n.index,p=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let _=d,m=g-1;_<m;_+=h){const f=l.getX(_),A=l.getX(_+1),T=Zs(this,t,is,c,f,A);T&&e.push(T)}if(this.isLineLoop){const _=l.getX(g-1),m=l.getX(d),f=Zs(this,t,is,c,_,m);f&&e.push(f)}}else{const d=Math.max(0,a.start),g=Math.min(p.count,a.start+a.count);for(let _=d,m=g-1;_<m;_+=h){const f=Zs(this,t,is,c,_,_+1);f&&e.push(f)}if(this.isLineLoop){const _=Zs(this,t,is,c,g-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Zs(i,t,e,n,s,r){const a=i.geometry.attributes.position;if(Mr.fromBufferAttribute(a,s),yr.fromBufferAttribute(a,r),e.distanceSqToSegment(Mr,yr,ta,Mc)>n)return;ta.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(ta);if(!(c<t.near||c>t.far))return{distance:c,point:Mc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const yc=new P,Sc=new P;class pd extends hs{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)yc.fromBufferAttribute(e,s),Sc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+yc.distanceTo(Sc);t.setAttribute("lineDistance",new oe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ve extends pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}class md extends we{constructor(t,e,n,s,r,a,o,c,h){super(t,e,n,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class zl extends we{constructor(t,e,n,s,r,a,o,c,h,l=Li){if(l!==Li&&l!==zi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Li&&(n=Qn),n===void 0&&l===zi&&(n=Bi),super(null,s,r,a,o,c,l,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Qe,this.minFilter=c!==void 0?c:Qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ln{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const l=n[s],p=n[s+1]-l,d=(a-l)/p;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ft:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,s=[],r=[],a=[],o=new P,c=new re;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let h=Number.MAX_VALUE;const l=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),p<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Vt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Vt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ao extends ln{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new ft){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=c-this.aX,d=h-this.aY;c=p*l-d*u+this.aX,h=p*u+d*l+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class gd extends Ao{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function wo(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let p=(a-r)/h-(o-r)/(h+l)+(o-a)/l,d=(o-a)/l-(c-a)/(l+u)+(c-o)/u;p*=l,d*=l,s(a,o,p,d)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const js=new P,ea=new wo,na=new wo,ia=new wo;class _d extends ln{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(js.subVectors(s[0],s[1]).add(s[0]),h=js);const u=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(js.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=js),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(h.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(p),d),m=Math.pow(p.distanceToSquared(l),d);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ea.initNonuniformCatmullRom(h.x,u.x,p.x,l.x,g,_,m),na.initNonuniformCatmullRom(h.y,u.y,p.y,l.y,g,_,m),ia.initNonuniformCatmullRom(h.z,u.z,p.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(ea.initCatmullRom(h.x,u.x,p.x,l.x,this.tension),na.initCatmullRom(h.y,u.y,p.y,l.y,this.tension),ia.initCatmullRom(h.z,u.z,p.z,l.z,this.tension));return n.set(ea.calc(c),na.calc(c),ia.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Ec(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function vd(i,t){const e=1-i;return e*e*t}function xd(i,t){return 2*(1-i)*i*t}function Md(i,t){return i*i*t}function us(i,t,e,n){return vd(i,t)+xd(i,e)+Md(i,n)}function yd(i,t){const e=1-i;return e*e*e*t}function Sd(i,t){const e=1-i;return 3*e*e*i*t}function Ed(i,t){return 3*(1-i)*i*i*t}function bd(i,t){return i*i*i*t}function ds(i,t,e,n,s){return yd(i,t)+Sd(i,e)+Ed(i,n)+bd(i,s)}class Hl extends ln{constructor(t=new ft,e=new ft,n=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ds(t,s.x,r.x,a.x,o.x),ds(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Td extends ln{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ds(t,s.x,r.x,a.x,o.x),ds(t,s.y,r.y,a.y,o.y),ds(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kl extends ln{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ad extends ln{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Vl extends ln{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(us(t,s.x,r.x,a.x),us(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wd extends ln{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(us(t,s.x,r.x,a.x),us(t,s.y,r.y,a.y),us(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gl extends ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],l=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Ec(o,c.x,h.x,l.x,u.x),Ec(o,c.y,h.y,l.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ft().fromArray(s))}return this}}var bc=Object.freeze({__proto__:null,ArcCurve:gd,CatmullRomCurve3:_d,CubicBezierCurve:Hl,CubicBezierCurve3:Td,EllipseCurve:Ao,LineCurve:kl,LineCurve3:Ad,QuadraticBezierCurve:Vl,QuadraticBezierCurve3:wd,SplineCurve:Gl});class Rd extends ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let h=0;h<c.length;h++){const l=c[h];n&&n.equals(l)||(e.push(l),n=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new bc[s.type]().fromJSON(s))}return this}}class Cd extends Rd{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new kl(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Vl(this.currentPoint.clone(),new ft(t,e),new ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Hl(this.currentPoint.clone(),new ft(t,e),new ft(n,s),new ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Gl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){const h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){const h=new Ao(t,e,n,s,r,a,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ro extends ve{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Vt(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],h=[],l=1/e,u=new P,p=new ft,d=new P,g=new P,_=new P;let m=0,f=0;for(let A=0;A<=t.length-1;A++)switch(A){case 0:m=t[A+1].x-t[A].x,f=t[A+1].y-t[A].y,d.x=f*1,d.y=-m,d.z=f*0,_.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[A+1].x-t[A].x,f=t[A+1].y-t[A].y,d.x=f*1,d.y=-m,d.z=f*0,g.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),c.push(d.x,d.y,d.z),_.copy(g)}for(let A=0;A<=e;A++){const T=n+A*l*s,E=Math.sin(T),C=Math.cos(T);for(let R=0;R<=t.length-1;R++){u.x=t[R].x*E,u.y=t[R].y,u.z=t[R].x*C,a.push(u.x,u.y,u.z),p.x=A/e,p.y=R/(t.length-1),o.push(p.x,p.y);const L=c[3*R+0]*E,I=c[3*R+1],S=c[3*R+0]*C;h.push(L,I,S)}}for(let A=0;A<e;A++)for(let T=0;T<t.length-1;T++){const E=T+A*t.length,C=E,R=E+t.length,L=E+t.length+1,I=E+1;r.push(C,R,I),r.push(L,I,R)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ro(t.points,t.segments,t.phiStart,t.phiLength)}}class Sr extends Ro{constructor(t=1,e=1,n=4,s=8){const r=new Cd;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Sr(t.radius,t.length,t.capSegments,t.radialSegments)}}class Co extends ve{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],u=[],p=[],d=[];let g=0;const _=[],m=n/2;let f=0;A(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(l),this.setAttribute("position",new oe(u,3)),this.setAttribute("normal",new oe(p,3)),this.setAttribute("uv",new oe(d,2));function A(){const E=new P,C=new P;let R=0;const L=(e-t)/n;for(let I=0;I<=r;I++){const S=[],x=I/r,D=x*(e-t)+t;for(let H=0;H<=s;H++){const k=H/s,q=k*c+o,K=Math.sin(q),U=Math.cos(q);C.x=D*K,C.y=-x*n+m,C.z=D*U,u.push(C.x,C.y,C.z),E.set(K,L,U).normalize(),p.push(E.x,E.y,E.z),d.push(k,1-x),S.push(g++)}_.push(S)}for(let I=0;I<s;I++)for(let S=0;S<r;S++){const x=_[S][I],D=_[S+1][I],H=_[S+1][I+1],k=_[S][I+1];(t>0||S!==0)&&(l.push(x,D,k),R+=3),(e>0||S!==r-1)&&(l.push(D,H,k),R+=3)}h.addGroup(f,R,0),f+=R}function T(E){const C=g,R=new ft,L=new P;let I=0;const S=E===!0?t:e,x=E===!0?1:-1;for(let H=1;H<=s;H++)u.push(0,m*x,0),p.push(0,x,0),d.push(.5,.5),g++;const D=g;for(let H=0;H<=s;H++){const q=H/s*c+o,K=Math.cos(q),U=Math.sin(q);L.x=S*U,L.y=m*x,L.z=S*K,u.push(L.x,L.y,L.z),p.push(0,x,0),R.x=K*.5+.5,R.y=U*.5*x+.5,d.push(R.x,R.y),g++}for(let H=0;H<s;H++){const k=C+H,q=D+H;E===!0?l.push(q,q+1,k):l.push(q+1,q,k),I+=3}h.addGroup(f,I,E===!0?1:2),f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Co(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Vi extends ve{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),h=o+1,l=c+1,u=t/o,p=e/c,d=[],g=[],_=[],m=[];for(let f=0;f<l;f++){const A=f*p-a;for(let T=0;T<h;T++){const E=T*u-r;g.push(E,-A,0),_.push(0,0,1),m.push(T/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let A=0;A<o;A++){const T=A+h*f,E=A+h*(f+1),C=A+1+h*(f+1),R=A+1+h*f;d.push(T,E,R),d.push(E,C,R)}this.setIndex(d),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vi(t.width,t.height,t.widthSegments,t.heightSegments)}}class _s extends ve{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let h=0;const l=[],u=new P,p=new P,d=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const A=[],T=f/n;let E=0;f===0&&a===0?E=.5/e:f===n&&c===Math.PI&&(E=-.5/e);for(let C=0;C<=e;C++){const R=C/e;u.x=-t*Math.cos(s+R*r)*Math.sin(a+T*o),u.y=t*Math.cos(a+T*o),u.z=t*Math.sin(s+R*r)*Math.sin(a+T*o),g.push(u.x,u.y,u.z),p.copy(u).normalize(),_.push(p.x,p.y,p.z),m.push(R+E,1-T),A.push(h++)}l.push(A)}for(let f=0;f<n;f++)for(let A=0;A<e;A++){const T=l[f][A+1],E=l[f][A],C=l[f+1][A],R=l[f+1][A+1];(f!==0||a>0)&&d.push(T,E,R),(f!==n-1||c<Math.PI)&&d.push(E,C,R)}this.setIndex(d),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Lo extends ve{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],h=[],l=new P,u=new P,p=new P;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const _=g/s*r,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),l.x=t*Math.cos(_),l.y=t*Math.sin(_),p.subVectors(u,l).normalize(),c.push(p.x,p.y,p.z),h.push(g/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const _=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,f=(s+1)*(d-1)+g,A=(s+1)*d+g;a.push(_,m,A),a.push(m,f,A)}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(c,3)),this.setAttribute("uv",new oe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lo(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ti extends ni{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ut(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=El,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ld extends Ti{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ft(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Vt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ut(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ut(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ut(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Pd extends ni{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Dd extends ni{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Tc extends Ms{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class Wl extends pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ut(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const sa=new re,Ac=new P,wc=new P;class Nd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new To,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ac.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ac),wc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(wc),e.updateMatrixWorld(),sa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(sa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Xl extends Il{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Id extends Nd{constructor(){super(new Xl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class oo extends Wl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.shadow=new Id}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ql extends Wl{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ud extends Ue{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Fd extends pd{constructor(t=10,e=10,n=4473924,s=8947848){n=new Ut(n),s=new Ut(s);const r=e/2,a=t/e,o=t/2,c=[],h=[];for(let p=0,d=0,g=-o;p<=e;p++,g+=a){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=p===r?n:s;_.toArray(h,d),d+=3,_.toArray(h,d),d+=3,_.toArray(h,d),d+=3,_.toArray(h,d),d+=3}const l=new ve;l.setAttribute("position",new oe(c,3)),l.setAttribute("color",new oe(h,3));const u=new Ms({vertexColors:!0,toneMapped:!1});super(l,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Rc=new P;let Js,ra;class aa extends pe{constructor(t=new P(0,0,1),e=new P(0,0,0),n=1,s=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",Js===void 0&&(Js=new ve,Js.setAttribute("position",new oe([0,0,0,0,1,0],3)),ra=new Co(0,.5,1,5,1),ra.translate(0,-.5,0)),this.position.copy(e),this.line=new hs(Js,new Ms({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new ce(ra,new Di({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,r,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{Rc.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(Rc,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}function Cc(i,t,e,n){const s=Od(n);switch(e){case gl:return i*t;case vl:return i*t;case xl:return i*t*2;case Ml:return i*t/s.components*s.byteLength;case yo:return i*t/s.components*s.byteLength;case yl:return i*t*2/s.components*s.byteLength;case So:return i*t*2/s.components*s.byteLength;case _l:return i*t*3/s.components*s.byteLength;case Ze:return i*t*4/s.components*s.byteLength;case Eo:return i*t*4/s.components*s.byteLength;case sr:case rr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ar:case or:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ua:case Oa:return Math.max(i,16)*Math.max(t,8)/4;case Ia:case Fa:return Math.max(i,8)*Math.max(t,8)/2;case Ba:case za:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Va:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ga:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Xa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case qa:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Za:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ja:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Qa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case to:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case cr:case eo:case no:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Sl:case io:return Math.ceil(i/4)*Math.ceil(t/4)*8;case so:case ro:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Od(i){switch(i){case Sn:case fl:return{byteLength:1,components:1};case ms:case pl:case vs:return{byteLength:2,components:1};case xo:case Mo:return{byteLength:2,components:4};case Qn:case vo:case vn:return{byteLength:4,components:1};case ml:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_o}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_o);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Yl(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Bd(i){const t=new WeakMap;function e(o,c){const h=o.array,l=o.usage,u=h.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,h,l),o.onUploadCallback();let d;if(h instanceof Float32Array)d=i.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)d=i.SHORT;else if(h instanceof Uint32Array)d=i.UNSIGNED_INT;else if(h instanceof Int32Array)d=i.INT;else if(h instanceof Int8Array)d=i.BYTE;else if(h instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:d,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,h){const l=c.array,u=c.updateRanges;if(i.bindBuffer(h,o),u.length===0)i.bufferSubData(h,0,l);else{u.sort((d,g)=>d.start-g.start);let p=0;for(let d=1;d<u.length;d++){const g=u[p],_=u[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,u[p]=_)}u.length=p+1;for(let d=0,g=u.length;d<g;d++){const _=u[d];i.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const l=t.get(o);(!l||l.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=t.get(o);if(h===void 0)t.set(o,e(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var zd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,kd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Vd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$d=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Kd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Jd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Qd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,tf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,af=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,of=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,cf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,lf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,uf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,df=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ff=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,pf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,mf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gf="gl_FragColor = linearToOutputTexel( gl_FragColor );",_f=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Mf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ef=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Af=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Rf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Df=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,If=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Uf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ff=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Of=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Bf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,zf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Hf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,kf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$f=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Kf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,tp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ep=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,np=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ip=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,op=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,cp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,lp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,up=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,mp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_p=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Sp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ep=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Tp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ap=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Rp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Cp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Dp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Np=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ip=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Bp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,qp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Yp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$p=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,tm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,em=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,im=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,am=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,om=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,hm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,pm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_m=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kt={alphahash_fragment:zd,alphahash_pars_fragment:Hd,alphamap_fragment:kd,alphamap_pars_fragment:Vd,alphatest_fragment:Gd,alphatest_pars_fragment:Wd,aomap_fragment:Xd,aomap_pars_fragment:qd,batching_pars_vertex:Yd,batching_vertex:$d,begin_vertex:Kd,beginnormal_vertex:Zd,bsdfs:jd,iridescence_fragment:Jd,bumpmap_pars_fragment:Qd,clipping_planes_fragment:tf,clipping_planes_pars_fragment:ef,clipping_planes_pars_vertex:nf,clipping_planes_vertex:sf,color_fragment:rf,color_pars_fragment:af,color_pars_vertex:of,color_vertex:cf,common:lf,cube_uv_reflection_fragment:hf,defaultnormal_vertex:uf,displacementmap_pars_vertex:df,displacementmap_vertex:ff,emissivemap_fragment:pf,emissivemap_pars_fragment:mf,colorspace_fragment:gf,colorspace_pars_fragment:_f,envmap_fragment:vf,envmap_common_pars_fragment:xf,envmap_pars_fragment:Mf,envmap_pars_vertex:yf,envmap_physical_pars_fragment:Df,envmap_vertex:Sf,fog_vertex:Ef,fog_pars_vertex:bf,fog_fragment:Tf,fog_pars_fragment:Af,gradientmap_pars_fragment:wf,lightmap_pars_fragment:Rf,lights_lambert_fragment:Cf,lights_lambert_pars_fragment:Lf,lights_pars_begin:Pf,lights_toon_fragment:Nf,lights_toon_pars_fragment:If,lights_phong_fragment:Uf,lights_phong_pars_fragment:Ff,lights_physical_fragment:Of,lights_physical_pars_fragment:Bf,lights_fragment_begin:zf,lights_fragment_maps:Hf,lights_fragment_end:kf,logdepthbuf_fragment:Vf,logdepthbuf_pars_fragment:Gf,logdepthbuf_pars_vertex:Wf,logdepthbuf_vertex:Xf,map_fragment:qf,map_pars_fragment:Yf,map_particle_fragment:$f,map_particle_pars_fragment:Kf,metalnessmap_fragment:Zf,metalnessmap_pars_fragment:jf,morphinstance_vertex:Jf,morphcolor_vertex:Qf,morphnormal_vertex:tp,morphtarget_pars_vertex:ep,morphtarget_vertex:np,normal_fragment_begin:ip,normal_fragment_maps:sp,normal_pars_fragment:rp,normal_pars_vertex:ap,normal_vertex:op,normalmap_pars_fragment:cp,clearcoat_normal_fragment_begin:lp,clearcoat_normal_fragment_maps:hp,clearcoat_pars_fragment:up,iridescence_pars_fragment:dp,opaque_fragment:fp,packing:pp,premultiplied_alpha_fragment:mp,project_vertex:gp,dithering_fragment:_p,dithering_pars_fragment:vp,roughnessmap_fragment:xp,roughnessmap_pars_fragment:Mp,shadowmap_pars_fragment:yp,shadowmap_pars_vertex:Sp,shadowmap_vertex:Ep,shadowmask_pars_fragment:bp,skinbase_vertex:Tp,skinning_pars_vertex:Ap,skinning_vertex:wp,skinnormal_vertex:Rp,specularmap_fragment:Cp,specularmap_pars_fragment:Lp,tonemapping_fragment:Pp,tonemapping_pars_fragment:Dp,transmission_fragment:Np,transmission_pars_fragment:Ip,uv_pars_fragment:Up,uv_pars_vertex:Fp,uv_vertex:Op,worldpos_vertex:Bp,background_vert:zp,background_frag:Hp,backgroundCube_vert:kp,backgroundCube_frag:Vp,cube_vert:Gp,cube_frag:Wp,depth_vert:Xp,depth_frag:qp,distanceRGBA_vert:Yp,distanceRGBA_frag:$p,equirect_vert:Kp,equirect_frag:Zp,linedashed_vert:jp,linedashed_frag:Jp,meshbasic_vert:Qp,meshbasic_frag:tm,meshlambert_vert:em,meshlambert_frag:nm,meshmatcap_vert:im,meshmatcap_frag:sm,meshnormal_vert:rm,meshnormal_frag:am,meshphong_vert:om,meshphong_frag:cm,meshphysical_vert:lm,meshphysical_frag:hm,meshtoon_vert:um,meshtoon_frag:dm,points_vert:fm,points_frag:pm,shadow_vert:mm,shadow_frag:gm,sprite_vert:_m,sprite_frag:vm},at={common:{diffuse:{value:new Ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new Ut(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},rn={basic:{uniforms:Ae([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:kt.meshbasic_vert,fragmentShader:kt.meshbasic_frag},lambert:{uniforms:Ae([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Ut(0)}}]),vertexShader:kt.meshlambert_vert,fragmentShader:kt.meshlambert_frag},phong:{uniforms:Ae([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Ut(0)},specular:{value:new Ut(1118481)},shininess:{value:30}}]),vertexShader:kt.meshphong_vert,fragmentShader:kt.meshphong_frag},standard:{uniforms:Ae([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag},toon:{uniforms:Ae([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Ut(0)}}]),vertexShader:kt.meshtoon_vert,fragmentShader:kt.meshtoon_frag},matcap:{uniforms:Ae([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:kt.meshmatcap_vert,fragmentShader:kt.meshmatcap_frag},points:{uniforms:Ae([at.points,at.fog]),vertexShader:kt.points_vert,fragmentShader:kt.points_frag},dashed:{uniforms:Ae([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:kt.linedashed_vert,fragmentShader:kt.linedashed_frag},depth:{uniforms:Ae([at.common,at.displacementmap]),vertexShader:kt.depth_vert,fragmentShader:kt.depth_frag},normal:{uniforms:Ae([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:kt.meshnormal_vert,fragmentShader:kt.meshnormal_frag},sprite:{uniforms:Ae([at.sprite,at.fog]),vertexShader:kt.sprite_vert,fragmentShader:kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:kt.background_vert,fragmentShader:kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:kt.backgroundCube_vert,fragmentShader:kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:kt.cube_vert,fragmentShader:kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:kt.equirect_vert,fragmentShader:kt.equirect_frag},distanceRGBA:{uniforms:Ae([at.common,at.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:kt.distanceRGBA_vert,fragmentShader:kt.distanceRGBA_frag},shadow:{uniforms:Ae([at.lights,at.fog,{color:{value:new Ut(0)},opacity:{value:1}}]),vertexShader:kt.shadow_vert,fragmentShader:kt.shadow_frag}};rn.physical={uniforms:Ae([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new Ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new Ut(0)},specularColor:{value:new Ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:kt.meshphysical_vert,fragmentShader:kt.meshphysical_frag};const Qs={r:0,b:0,g:0},Wn=new cn,xm=new re;function Mm(i,t,e,n,s,r,a){const o=new Ut(0);let c=r===!0?0:1,h,l,u=null,p=0,d=null;function g(T){let E=T.isScene===!0?T.background:null;return E&&E.isTexture&&(E=(T.backgroundBlurriness>0?e:t).get(E)),E}function _(T){let E=!1;const C=g(T);C===null?f(o,c):C&&C.isColor&&(f(C,1),E=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||E)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(T,E){const C=g(E);C&&(C.isCubeTexture||C.mapping===Ar)?(l===void 0&&(l=new ce(new Nn(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:ki(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Pe,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(R,L,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),Wn.copy(E.backgroundRotation),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),l.material.uniforms.envMap.value=C,l.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(xm.makeRotationFromEuler(Wn)),l.material.toneMapped=Zt.getTransfer(C.colorSpace)!==ee,(u!==C||p!==C.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=C,p=C.version,d=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null)):C&&C.isTexture&&(h===void 0&&(h=new ce(new Vi(2,2),new Fn({name:"BackgroundMaterial",uniforms:ki(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=C,h.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,h.material.toneMapped=Zt.getTransfer(C.colorSpace)!==ee,C.matrixAutoUpdate===!0&&C.updateMatrix(),h.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||p!==C.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=C,p=C.version,d=i.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null))}function f(T,E){T.getRGB(Qs,Nl(i)),n.buffers.color.setClear(Qs.r,Qs.g,Qs.b,E,a)}function A(){l!==void 0&&(l.geometry.dispose(),l.material.dispose()),h!==void 0&&(h.geometry.dispose(),h.material.dispose())}return{getClearColor:function(){return o},setClearColor:function(T,E=1){o.set(T),c=E,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,f(o,c)},render:_,addToRenderList:m,dispose:A}}function ym(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(x,D,H,k,q){let K=!1;const U=u(k,H,D);r!==U&&(r=U,h(r.object)),K=d(x,k,H,q),K&&g(x,k,H,q),q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,E(x,D,H,k),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function c(){return i.createVertexArray()}function h(x){return i.bindVertexArray(x)}function l(x){return i.deleteVertexArray(x)}function u(x,D,H){const k=H.wireframe===!0;let q=n[x.id];q===void 0&&(q={},n[x.id]=q);let K=q[D.id];K===void 0&&(K={},q[D.id]=K);let U=K[k];return U===void 0&&(U=p(c()),K[k]=U),U}function p(x){const D=[],H=[],k=[];for(let q=0;q<e;q++)D[q]=0,H[q]=0,k[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:k,object:x,attributes:{},index:null}}function d(x,D,H,k){const q=r.attributes,K=D.attributes;let U=0;const G=H.getAttributes();for(const z in G)if(G[z].location>=0){const st=q[z];let Mt=K[z];if(Mt===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(Mt=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(Mt=x.instanceColor)),st===void 0||st.attribute!==Mt||Mt&&st.data!==Mt.data)return!0;U++}return r.attributesNum!==U||r.index!==k}function g(x,D,H,k){const q={},K=D.attributes;let U=0;const G=H.getAttributes();for(const z in G)if(G[z].location>=0){let st=K[z];st===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(st=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(st=x.instanceColor));const Mt={};Mt.attribute=st,st&&st.data&&(Mt.data=st.data),q[z]=Mt,U++}r.attributes=q,r.attributesNum=U,r.index=k}function _(){const x=r.newAttributes;for(let D=0,H=x.length;D<H;D++)x[D]=0}function m(x){f(x,0)}function f(x,D){const H=r.newAttributes,k=r.enabledAttributes,q=r.attributeDivisors;H[x]=1,k[x]===0&&(i.enableVertexAttribArray(x),k[x]=1),q[x]!==D&&(i.vertexAttribDivisor(x,D),q[x]=D)}function A(){const x=r.newAttributes,D=r.enabledAttributes;for(let H=0,k=D.length;H<k;H++)D[H]!==x[H]&&(i.disableVertexAttribArray(H),D[H]=0)}function T(x,D,H,k,q,K,U){U===!0?i.vertexAttribIPointer(x,D,H,q,K):i.vertexAttribPointer(x,D,H,k,q,K)}function E(x,D,H,k){_();const q=k.attributes,K=H.getAttributes(),U=D.defaultAttributeValues;for(const G in K){const z=K[G];if(z.location>=0){let nt=q[G];if(nt===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(nt=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(nt=x.instanceColor)),nt!==void 0){const st=nt.normalized,Mt=nt.itemSize,Pt=t.get(nt);if(Pt===void 0)continue;const Xt=Pt.buffer,$=Pt.type,tt=Pt.bytesPerElement,pt=$===i.INT||$===i.UNSIGNED_INT||nt.gpuType===vo;if(nt.isInterleavedBufferAttribute){const rt=nt.data,St=rt.stride,Et=nt.offset;if(rt.isInstancedInterleavedBuffer){for(let mt=0;mt<z.locationSize;mt++)f(z.location+mt,rt.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let mt=0;mt<z.locationSize;mt++)m(z.location+mt);i.bindBuffer(i.ARRAY_BUFFER,Xt);for(let mt=0;mt<z.locationSize;mt++)T(z.location+mt,Mt/z.locationSize,$,st,St*tt,(Et+Mt/z.locationSize*mt)*tt,pt)}else{if(nt.isInstancedBufferAttribute){for(let rt=0;rt<z.locationSize;rt++)f(z.location+rt,nt.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let rt=0;rt<z.locationSize;rt++)m(z.location+rt);i.bindBuffer(i.ARRAY_BUFFER,Xt);for(let rt=0;rt<z.locationSize;rt++)T(z.location+rt,Mt/z.locationSize,$,st,Mt*tt,Mt/z.locationSize*rt*tt,pt)}}else if(U!==void 0){const st=U[G];if(st!==void 0)switch(st.length){case 2:i.vertexAttrib2fv(z.location,st);break;case 3:i.vertexAttrib3fv(z.location,st);break;case 4:i.vertexAttrib4fv(z.location,st);break;default:i.vertexAttrib1fv(z.location,st)}}}}A()}function C(){I();for(const x in n){const D=n[x];for(const H in D){const k=D[H];for(const q in k)l(k[q].object),delete k[q];delete D[H]}delete n[x]}}function R(x){if(n[x.id]===void 0)return;const D=n[x.id];for(const H in D){const k=D[H];for(const q in k)l(k[q].object),delete k[q];delete D[H]}delete n[x.id]}function L(x){for(const D in n){const H=n[D];if(H[x.id]===void 0)continue;const k=H[x.id];for(const q in k)l(k[q].object),delete k[q];delete H[x.id]}}function I(){S(),a=!0,r!==s&&(r=s,h(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:S,dispose:C,releaseStatesOfGeometry:R,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function Sm(i,t,e){let n;function s(h){n=h}function r(h,l){i.drawArrays(n,h,l),e.update(l,n,1)}function a(h,l,u){u!==0&&(i.drawArraysInstanced(n,h,l,u),e.update(l,n,u))}function o(h,l,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,l,0,u);let d=0;for(let g=0;g<u;g++)d+=l[g];e.update(d,n,1)}function c(h,l,u,p){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<h.length;g++)a(h[g],l[g],p[g]);else{d.multiDrawArraysInstancedWEBGL(n,h,0,l,0,p,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_]*p[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Em(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const L=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(L){return!(L!==Ze&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){const I=L===vs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==Sn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==vn&&!I)}function c(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);const u=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:p,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:A,maxVaryings:T,maxFragmentUniforms:E,vertexTextures:C,maxSamples:R}}function bm(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new qn,o=new Bt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const d=u.length!==0||p||n!==0||s;return s=p,n=u.length,d},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){e=l(u,p,0)},this.setState=function(u,p,d){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{const A=r?0:n,T=A*4;let E=f.clippingState||null;c.value=E,E=l(g,p,T,d);for(let C=0;C!==T;++C)E[C]=e[C];f.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function l(u,p,d,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const f=d+_*4,A=p.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<f)&&(m=new Float32Array(f));for(let T=0,E=d;T!==_;++T,E+=4)a.copy(u[T]).applyMatrix4(A,o),a.normal.toArray(m,E),m[E+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Tm(i){let t=new WeakMap;function e(a,o){return o===La?a.mapping=Fi:o===Pa&&(a.mapping=Oi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===La||o===Pa)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new cd(c.height);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Ai=4,Lc=[.125,.215,.35,.446,.526,.582],Kn=20,oa=new Xl,Pc=new Ut;let ca=null,la=0,ha=0,ua=!1;const Yn=(1+Math.sqrt(5))/2,Ei=1/Yn,Dc=[new P(-Yn,Ei,0),new P(Yn,Ei,0),new P(-Ei,0,Yn),new P(Ei,0,Yn),new P(0,Yn,-Ei),new P(0,Yn,Ei),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class Nc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ca=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ca,la,ha),this._renderer.xr.enabled=ua,t.scissorTest=!1,tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fi||t.mapping===Oi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ca=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:vs,format:Ze,colorSpace:Hi,depthBuffer:!1},s=Ic(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ic(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Am(r)),this._blurMaterial=wm(r,t,e)}return s}_compileMaterial(t){const e=new ce(this._lodPlanes[0],t);this._renderer.compile(e,oa)}_sceneToCubeUV(t,e,n,s){const o=new Ue(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,p=l.toneMapping;l.getClearColor(Pc),l.toneMapping=Dn,l.autoClear=!1;const d=new Di({name:"PMREM.Background",side:Pe,depthWrite:!1,depthTest:!1}),g=new ce(new Nn,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(Pc),_=!0);for(let f=0;f<6;f++){const A=f%3;A===0?(o.up.set(0,c[f],0),o.lookAt(h[f],0,0)):A===1?(o.up.set(0,0,c[f]),o.lookAt(0,h[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,h[f]));const T=this._cubeSize;tr(s,A*T,f>2?T:0,T,T),l.setRenderTarget(s),_&&l.render(g,o),l.render(t,o)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=p,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Fi||t.mapping===Oi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ce(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;tr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,oa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Dc[(s-r-1)%Dc.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new ce(this._lodPlanes[s],h),p=h.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Kn-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):Kn;m>Kn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Kn}`);const f=[];let A=0;for(let L=0;L<Kn;++L){const I=L/_,S=Math.exp(-I*I/2);f.push(S),L===0?A+=S:L<m&&(A+=2*S)}for(let L=0;L<f.length;L++)f[L]=f[L]/A;p.envMap.value=t.texture,p.samples.value=m,p.weights.value=f,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:T}=this;p.dTheta.value=g,p.mipInt.value=T-n;const E=this._sizeLods[s],C=3*E*(s>T-Ai?s-T+Ai:0),R=4*(this._cubeSize-E);tr(e,C,R,3*E,2*E),c.setRenderTarget(e),c.render(u,oa)}}function Am(i){const t=[],e=[],n=[];let s=i;const r=i-Ai+1+Lc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Ai?c=Lc[a-i+Ai-1]:a===0&&(c=0),n.push(c);const h=1/(o-2),l=-h,u=1+h,p=[l,l,u,l,u,u,l,l,u,u,l,u],d=6,g=6,_=3,m=2,f=1,A=new Float32Array(_*g*d),T=new Float32Array(m*g*d),E=new Float32Array(f*g*d);for(let R=0;R<d;R++){const L=R%3*2/3-1,I=R>2?0:-1,S=[L,I,0,L+2/3,I,0,L+2/3,I+1,0,L,I,0,L+2/3,I+1,0,L,I+1,0];A.set(S,_*g*R),T.set(p,m*g*R);const x=[R,R,R,R,R,R];E.set(x,f*g*R)}const C=new ve;C.setAttribute("position",new tn(A,_)),C.setAttribute("uv",new tn(T,m)),C.setAttribute("faceIndex",new tn(E,f)),t.push(C),s>Ai&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ic(i,t,e){const n=new ti(i,t,e);return n.texture.mapping=Ar,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function wm(i,t,e){const n=new Float32Array(Kn),s=new P(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:Kn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Po(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Uc(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Po(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Fc(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Po(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Po(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Rm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,h=c===La||c===Pa,l=c===Fi||c===Oi;if(h||l){let u=t.get(o);const p=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new Nc(i)),u=h?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return h&&d&&d.height>0||l&&d&&s(d)?(e===null&&(e=new Nc(i)),u=h?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){const c=o.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Cm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&bi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Lm(i,t,e,n){const s={},r=new WeakMap;function a(u){const p=u.target;p.index!==null&&t.remove(p.index);for(const g in p.attributes)t.remove(p.attributes[g]);p.removeEventListener("dispose",a),delete s[p.id];const d=r.get(p);d&&(t.remove(d),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(u,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,e.memory.geometries++),p}function c(u){const p=u.attributes;for(const d in p)t.update(p[d],i.ARRAY_BUFFER)}function h(u){const p=[],d=u.index,g=u.attributes.position;let _=0;if(d!==null){const A=d.array;_=d.version;for(let T=0,E=A.length;T<E;T+=3){const C=A[T+0],R=A[T+1],L=A[T+2];p.push(C,R,R,L,L,C)}}else if(g!==void 0){const A=g.array;_=g.version;for(let T=0,E=A.length/3-1;T<E;T+=3){const C=T+0,R=T+1,L=T+2;p.push(C,R,R,L,L,C)}}else return;const m=new(Tl(p)?Dl:Pl)(p,1);m.version=_;const f=r.get(u);f&&t.remove(f),r.set(u,m)}function l(u){const p=r.get(u);if(p){const d=u.index;d!==null&&p.version<d.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function Pm(i,t,e){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function c(p,d){i.drawElements(n,d,r,p*a),e.update(d,n,1)}function h(p,d,g){g!==0&&(i.drawElementsInstanced(n,d,r,p*a,g),e.update(d,n,g))}function l(p,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,p,0,g);let m=0;for(let f=0;f<g;f++)m+=d[f];e.update(m,n,1)}function u(p,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<p.length;f++)h(p[f]/a,d[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,p,0,_,0,g);let f=0;for(let A=0;A<g;A++)f+=d[A]*_[A];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function Dm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Nm(i,t,e){const n=new WeakMap,s=new ue;function r(a,o,c){const h=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l!==void 0?l.length:0;let p=n.get(o);if(p===void 0||p.count!==u){let x=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var d=x;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],A=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let E=0;g===!0&&(E=1),_===!0&&(E=2),m===!0&&(E=3);let C=o.attributes.position.count*E,R=1;C>t.maxTextureSize&&(R=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const L=new Float32Array(C*R*4*u),I=new wl(L,C,R,u);I.type=vn,I.needsUpdate=!0;const S=E*4;for(let D=0;D<u;D++){const H=f[D],k=A[D],q=T[D],K=C*R*4*D;for(let U=0;U<H.count;U++){const G=U*S;g===!0&&(s.fromBufferAttribute(H,U),L[K+G+0]=s.x,L[K+G+1]=s.y,L[K+G+2]=s.z,L[K+G+3]=0),_===!0&&(s.fromBufferAttribute(k,U),L[K+G+4]=s.x,L[K+G+5]=s.y,L[K+G+6]=s.z,L[K+G+7]=0),m===!0&&(s.fromBufferAttribute(q,U),L[K+G+8]=s.x,L[K+G+9]=s.y,L[K+G+10]=s.z,L[K+G+11]=q.itemSize===4?s.w:1)}}p={count:u,texture:I,size:new ft(C,R)},n.set(o,p),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<h.length;m++)g+=h[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function Im(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return u}function a(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}const $l=new we,Oc=new zl(1,1),Kl=new wl,Zl=new qu,jl=new Ul,Bc=[],zc=[],Hc=new Float32Array(16),kc=new Float32Array(9),Vc=new Float32Array(4);function Xi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Bc[s];if(r===void 0&&(r=new Float32Array(s),Bc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Rr(i,t){let e=zc[t];e===void 0&&(e=new Int32Array(t),zc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Um(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2fv(this.addr,t),ge(e,t)}}function Om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;i.uniform3fv(this.addr,t),ge(e,t)}}function Bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4fv(this.addr,t),ge(e,t)}}function zm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Vc.set(n),i.uniformMatrix2fv(this.addr,!1,Vc),ge(e,n)}}function Hm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;kc.set(n),i.uniformMatrix3fv(this.addr,!1,kc),ge(e,n)}}function km(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Hc.set(n),i.uniformMatrix4fv(this.addr,!1,Hc),ge(e,n)}}function Vm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2iv(this.addr,t),ge(e,t)}}function Wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3iv(this.addr,t),ge(e,t)}}function Xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4iv(this.addr,t),ge(e,t)}}function qm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ym(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2uiv(this.addr,t),ge(e,t)}}function $m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3uiv(this.addr,t),ge(e,t)}}function Km(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4uiv(this.addr,t),ge(e,t)}}function Zm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Oc.compareFunction=bl,r=Oc):r=$l,e.setTexture2D(t||r,s)}function jm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Zl,s)}function Jm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||jl,s)}function Qm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Kl,s)}function tg(i){switch(i){case 5126:return Um;case 35664:return Fm;case 35665:return Om;case 35666:return Bm;case 35674:return zm;case 35675:return Hm;case 35676:return km;case 5124:case 35670:return Vm;case 35667:case 35671:return Gm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return qm;case 36294:return Ym;case 36295:return $m;case 36296:return Km;case 35678:case 36198:case 36298:case 36306:case 35682:return Zm;case 35679:case 36299:case 36307:return jm;case 35680:case 36300:case 36308:case 36293:return Jm;case 36289:case 36303:case 36311:case 36292:return Qm}}function eg(i,t){i.uniform1fv(this.addr,t)}function ng(i,t){const e=Xi(t,this.size,2);i.uniform2fv(this.addr,e)}function ig(i,t){const e=Xi(t,this.size,3);i.uniform3fv(this.addr,e)}function sg(i,t){const e=Xi(t,this.size,4);i.uniform4fv(this.addr,e)}function rg(i,t){const e=Xi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ag(i,t){const e=Xi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function og(i,t){const e=Xi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function cg(i,t){i.uniform1iv(this.addr,t)}function lg(i,t){i.uniform2iv(this.addr,t)}function hg(i,t){i.uniform3iv(this.addr,t)}function ug(i,t){i.uniform4iv(this.addr,t)}function dg(i,t){i.uniform1uiv(this.addr,t)}function fg(i,t){i.uniform2uiv(this.addr,t)}function pg(i,t){i.uniform3uiv(this.addr,t)}function mg(i,t){i.uniform4uiv(this.addr,t)}function gg(i,t,e){const n=this.cache,s=t.length,r=Rr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||$l,r[a])}function _g(i,t,e){const n=this.cache,s=t.length,r=Rr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Zl,r[a])}function vg(i,t,e){const n=this.cache,s=t.length,r=Rr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||jl,r[a])}function xg(i,t,e){const n=this.cache,s=t.length,r=Rr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Kl,r[a])}function Mg(i){switch(i){case 5126:return eg;case 35664:return ng;case 35665:return ig;case 35666:return sg;case 35674:return rg;case 35675:return ag;case 35676:return og;case 5124:case 35670:return cg;case 35667:case 35671:return lg;case 35668:case 35672:return hg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return _g;case 35680:case 36300:case 36308:case 36293:return vg;case 36289:case 36303:case 36311:case 36292:return xg}}class yg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=tg(e.type)}}class Sg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Mg(e.type)}}class Eg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function Gc(i,t){i.seq.push(t),i.map[t.id]=t}function bg(i,t,e){const n=i.name,s=n.length;for(da.lastIndex=0;;){const r=da.exec(n),a=da.lastIndex;let o=r[1];const c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){Gc(e,h===void 0?new yg(o,i,t):new Sg(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Eg(o),Gc(e,u)),e=u}}}class lr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);bg(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Wc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Tg=37297;let Ag=0;function wg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Xc=new Bt;function Rg(i){Zt._getMatrix(Xc,Zt.workingColorSpace,i);const t=`mat3( ${Xc.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case gr:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function qc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+wg(i.getShaderSource(t),a)}else return s}function Cg(i,t){const e=Rg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Lg(i,t){let e;switch(t){case iu:e="Linear";break;case su:e="Reinhard";break;case ru:e="Cineon";break;case au:e="ACESFilmic";break;case cu:e="AgX";break;case lu:e="Neutral";break;case ou:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const er=new P;function Pg(){Zt.getLuminanceCoefficients(er);const i=er.x.toFixed(4),t=er.y.toFixed(4),e=er.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(as).join(`
`)}function Ng(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ig(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function as(i){return i!==""}function Yc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $c(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ug=/^[ \t]*#include +<([\w\d./]+)>/gm;function co(i){return i.replace(Ug,Og)}const Fg=new Map;function Og(i,t){let e=kt[t];if(e===void 0){const n=Fg.get(t);if(n!==void 0)e=kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return co(e)}const Bg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kc(i){return i.replace(Bg,zg)}function zg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Hg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===hl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Fh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_n&&(t="SHADOWMAP_TYPE_VSM"),t}function kg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Fi:case Oi:t="ENVMAP_TYPE_CUBE";break;case Ar:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Vg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Oi:t="ENVMAP_MODE_REFRACTION";break}return t}function Gg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ul:t="ENVMAP_BLENDING_MULTIPLY";break;case eu:t="ENVMAP_BLENDING_MIX";break;case nu:t="ENVMAP_BLENDING_ADD";break}return t}function Wg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Xg(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Hg(e),h=kg(e),l=Vg(e),u=Gg(e),p=Wg(e),d=Dg(e),g=Ng(r),_=s.createProgram();let m,f,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(as).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(as).join(`
`),f.length>0&&(f+=`
`)):(m=[Zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(as).join(`
`),f=[Zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?kt.tonemapping_pars_fragment:"",e.toneMapping!==Dn?Lg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",kt.colorspace_pars_fragment,Cg("linearToOutputTexel",e.outputColorSpace),Pg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(as).join(`
`)),a=co(a),a=Yc(a,e),a=$c(a,e),o=co(o),o=Yc(o,e),o=$c(o,e),a=Kc(a),o=Kc(o),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Jo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Jo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const T=A+m+a,E=A+f+o,C=Wc(s,s.VERTEX_SHADER,T),R=Wc(s,s.FRAGMENT_SHADER,E);s.attachShader(_,C),s.attachShader(_,R),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function L(D){if(i.debug.checkShaderErrors){const H=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(C).trim(),q=s.getShaderInfoLog(R).trim();let K=!0,U=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,C,R);else{const G=qc(s,C,"vertex"),z=qc(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+G+`
`+z)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(k===""||q==="")&&(U=!1);U&&(D.diagnostics={runnable:K,programLog:H,vertexShader:{log:k,prefix:m},fragmentShader:{log:q,prefix:f}})}s.deleteShader(C),s.deleteShader(R),I=new lr(s,_),S=Ig(s,_)}let I;this.getUniforms=function(){return I===void 0&&L(this),I};let S;this.getAttributes=function(){return S===void 0&&L(this),S};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,Tg)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ag++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=R,this}let qg=0;class Yg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new $g(t),e.set(t,n)),n}}class $g{constructor(t){this.id=qg++,this.code=t,this.usedTimes=0}}function Kg(i,t,e,n,s,r,a){const o=new Cl,c=new Yg,h=new Set,l=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return h.add(S),S===0?"uv":`uv${S}`}function m(S,x,D,H,k){const q=H.fog,K=k.geometry,U=S.isMeshStandardMaterial?H.environment:null,G=(S.isMeshStandardMaterial?e:t).get(S.envMap||U),z=G&&G.mapping===Ar?G.image.height:null,nt=g[S.type];S.precision!==null&&(d=s.getMaxPrecision(S.precision),d!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const st=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Mt=st!==void 0?st.length:0;let Pt=0;K.morphAttributes.position!==void 0&&(Pt=1),K.morphAttributes.normal!==void 0&&(Pt=2),K.morphAttributes.color!==void 0&&(Pt=3);let Xt,$,tt,pt;if(nt){const Qt=rn[nt];Xt=Qt.vertexShader,$=Qt.fragmentShader}else Xt=S.vertexShader,$=S.fragmentShader,c.update(S),tt=c.getVertexShaderID(S),pt=c.getFragmentShaderID(S);const rt=i.getRenderTarget(),St=i.state.buffers.depth.getReversed(),Et=k.isInstancedMesh===!0,mt=k.isBatchedMesh===!0,Lt=!!S.map,Ft=!!S.matcap,ne=!!G,N=!!S.aoMap,Re=!!S.lightMap,Wt=!!S.bumpMap,Gt=!!S.normalMap,Tt=!!S.displacementMap,se=!!S.emissiveMap,At=!!S.metalnessMap,w=!!S.roughnessMap,v=S.anisotropy>0,V=S.clearcoat>0,j=S.dispersion>0,Q=S.iridescence>0,Z=S.sheen>0,bt=S.transmission>0,ht=v&&!!S.anisotropyMap,_t=V&&!!S.clearcoatMap,Yt=V&&!!S.clearcoatNormalMap,it=V&&!!S.clearcoatRoughnessMap,vt=Q&&!!S.iridescenceMap,Ct=Q&&!!S.iridescenceThicknessMap,Dt=Z&&!!S.sheenColorMap,xt=Z&&!!S.sheenRoughnessMap,qt=!!S.specularMap,Ht=!!S.specularColorMap,ie=!!S.specularIntensityMap,F=bt&&!!S.transmissionMap,ct=bt&&!!S.thicknessMap,Y=!!S.gradientMap,J=!!S.alphaMap,dt=S.alphaTest>0,ut=!!S.alphaHash,Ot=!!S.extensions;let le=Dn;S.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(le=i.toneMapping);const Me={shaderID:nt,shaderType:S.type,shaderName:S.name,vertexShader:Xt,fragmentShader:$,defines:S.defines,customVertexShaderID:tt,customFragmentShaderID:pt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:mt,batchingColor:mt&&k._colorsTexture!==null,instancing:Et,instancingColor:Et&&k.instanceColor!==null,instancingMorph:Et&&k.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Hi,alphaToCoverage:!!S.alphaToCoverage,map:Lt,matcap:Ft,envMap:ne,envMapMode:ne&&G.mapping,envMapCubeUVHeight:z,aoMap:N,lightMap:Re,bumpMap:Wt,normalMap:Gt,displacementMap:p&&Tt,emissiveMap:se,normalMapObjectSpace:Gt&&S.normalMapType===fu,normalMapTangentSpace:Gt&&S.normalMapType===El,metalnessMap:At,roughnessMap:w,anisotropy:v,anisotropyMap:ht,clearcoat:V,clearcoatMap:_t,clearcoatNormalMap:Yt,clearcoatRoughnessMap:it,dispersion:j,iridescence:Q,iridescenceMap:vt,iridescenceThicknessMap:Ct,sheen:Z,sheenColorMap:Dt,sheenRoughnessMap:xt,specularMap:qt,specularColorMap:Ht,specularIntensityMap:ie,transmission:bt,transmissionMap:F,thicknessMap:ct,gradientMap:Y,opaque:S.transparent===!1&&S.blending===Ci&&S.alphaToCoverage===!1,alphaMap:J,alphaTest:dt,alphaHash:ut,combine:S.combine,mapUv:Lt&&_(S.map.channel),aoMapUv:N&&_(S.aoMap.channel),lightMapUv:Re&&_(S.lightMap.channel),bumpMapUv:Wt&&_(S.bumpMap.channel),normalMapUv:Gt&&_(S.normalMap.channel),displacementMapUv:Tt&&_(S.displacementMap.channel),emissiveMapUv:se&&_(S.emissiveMap.channel),metalnessMapUv:At&&_(S.metalnessMap.channel),roughnessMapUv:w&&_(S.roughnessMap.channel),anisotropyMapUv:ht&&_(S.anisotropyMap.channel),clearcoatMapUv:_t&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Yt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Dt&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:xt&&_(S.sheenRoughnessMap.channel),specularMapUv:qt&&_(S.specularMap.channel),specularColorMapUv:Ht&&_(S.specularColorMap.channel),specularIntensityMapUv:ie&&_(S.specularIntensityMap.channel),transmissionMapUv:F&&_(S.transmissionMap.channel),thicknessMapUv:ct&&_(S.thicknessMap.channel),alphaMapUv:J&&_(S.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Gt||v),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!K.attributes.uv&&(Lt||J),fog:!!q,useFog:S.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:St,skinning:k.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:Pt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:le,decodeVideoTexture:Lt&&S.map.isVideoTexture===!0&&Zt.getTransfer(S.map.colorSpace)===ee,decodeVideoTextureEmissive:se&&S.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(S.emissiveMap.colorSpace)===ee,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===an,flipSided:S.side===Pe,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ot&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ot&&S.extensions.multiDraw===!0||mt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Me.vertexUv1s=h.has(1),Me.vertexUv2s=h.has(2),Me.vertexUv3s=h.has(3),h.clear(),Me}function f(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const D in S.defines)x.push(D),x.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(A(x,S),T(x,S),x.push(i.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function A(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function T(S,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),S.push(o.mask)}function E(S){const x=g[S.type];let D;if(x){const H=rn[x];D=sd.clone(H.uniforms)}else D=S.uniforms;return D}function C(S,x){let D;for(let H=0,k=l.length;H<k;H++){const q=l[H];if(q.cacheKey===x){D=q,++D.usedTimes;break}}return D===void 0&&(D=new Xg(i,x,S,r),l.push(D)),D}function R(S){if(--S.usedTimes===0){const x=l.indexOf(S);l[x]=l[l.length-1],l.pop(),S.destroy()}}function L(S){c.remove(S)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:E,acquireProgram:C,releaseProgram:R,releaseShaderCache:L,programs:l,dispose:I}}function Zg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function jg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function jc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Jc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,p,d,g,_,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:p,material:d,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=p,f.material=d,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,p,d,g,_,m){const f=a(u,p,d,g,_,m);d.transmission>0?n.push(f):d.transparent===!0?s.push(f):e.push(f)}function c(u,p,d,g,_,m){const f=a(u,p,d,g,_,m);d.transmission>0?n.unshift(f):d.transparent===!0?s.unshift(f):e.unshift(f)}function h(u,p){e.length>1&&e.sort(u||jg),n.length>1&&n.sort(p||jc),s.length>1&&s.sort(p||jc)}function l(){for(let u=t,p=i.length;u<p;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Jg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Jc,i.set(n,[a])):s>=r.length?(a=new Jc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Qg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Ut};break;case"SpotLight":e={position:new P,direction:new P,color:new Ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Ut,groundColor:new Ut};break;case"RectAreaLight":e={color:new Ut,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function t0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let e0=0;function n0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function i0(i){const t=new Qg,e=t0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new P);const s=new P,r=new re,a=new re;function o(h){let l=0,u=0,p=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let d=0,g=0,_=0,m=0,f=0,A=0,T=0,E=0,C=0,R=0,L=0;h.sort(n0);for(let S=0,x=h.length;S<x;S++){const D=h[S],H=D.color,k=D.intensity,q=D.distance,K=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)l+=H.r*k,u+=H.g*k,p+=H.b*k;else if(D.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(D.sh.coefficients[U],k);L++}else if(D.isDirectionalLight){const U=t.get(D);if(U.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const G=D.shadow,z=e.get(D);z.shadowIntensity=G.intensity,z.shadowBias=G.bias,z.shadowNormalBias=G.normalBias,z.shadowRadius=G.radius,z.shadowMapSize=G.mapSize,n.directionalShadow[d]=z,n.directionalShadowMap[d]=K,n.directionalShadowMatrix[d]=D.shadow.matrix,A++}n.directional[d]=U,d++}else if(D.isSpotLight){const U=t.get(D);U.position.setFromMatrixPosition(D.matrixWorld),U.color.copy(H).multiplyScalar(k),U.distance=q,U.coneCos=Math.cos(D.angle),U.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),U.decay=D.decay,n.spot[_]=U;const G=D.shadow;if(D.map&&(n.spotLightMap[C]=D.map,C++,G.updateMatrices(D),D.castShadow&&R++),n.spotLightMatrix[_]=G.matrix,D.castShadow){const z=e.get(D);z.shadowIntensity=G.intensity,z.shadowBias=G.bias,z.shadowNormalBias=G.normalBias,z.shadowRadius=G.radius,z.shadowMapSize=G.mapSize,n.spotShadow[_]=z,n.spotShadowMap[_]=K,E++}_++}else if(D.isRectAreaLight){const U=t.get(D);U.color.copy(H).multiplyScalar(k),U.halfWidth.set(D.width*.5,0,0),U.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=U,m++}else if(D.isPointLight){const U=t.get(D);if(U.color.copy(D.color).multiplyScalar(D.intensity),U.distance=D.distance,U.decay=D.decay,D.castShadow){const G=D.shadow,z=e.get(D);z.shadowIntensity=G.intensity,z.shadowBias=G.bias,z.shadowNormalBias=G.normalBias,z.shadowRadius=G.radius,z.shadowMapSize=G.mapSize,z.shadowCameraNear=G.camera.near,z.shadowCameraFar=G.camera.far,n.pointShadow[g]=z,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=D.shadow.matrix,T++}n.point[g]=U,g++}else if(D.isHemisphereLight){const U=t.get(D);U.skyColor.copy(D.color).multiplyScalar(k),U.groundColor.copy(D.groundColor).multiplyScalar(k),n.hemi[f]=U,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=u,n.ambient[2]=p;const I=n.hash;(I.directionalLength!==d||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==f||I.numDirectionalShadows!==A||I.numPointShadows!==T||I.numSpotShadows!==E||I.numSpotMaps!==C||I.numLightProbes!==L)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=E+C-R,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=L,I.directionalLength=d,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=f,I.numDirectionalShadows=A,I.numPointShadows=T,I.numSpotShadows=E,I.numSpotMaps=C,I.numLightProbes=L,n.version=e0++)}function c(h,l){let u=0,p=0,d=0,g=0,_=0;const m=l.matrixWorldInverse;for(let f=0,A=h.length;f<A;f++){const T=h[f];if(T.isDirectionalLight){const E=n.directional[u];E.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),u++}else if(T.isSpotLight){const E=n.spot[d];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),d++}else if(T.isRectAreaLight){const E=n.rectArea[g];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(m),a.identity(),r.copy(T.matrixWorld),r.premultiply(m),a.extractRotation(r),E.halfWidth.set(T.width*.5,0,0),E.halfHeight.set(0,T.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),g++}else if(T.isPointLight){const E=n.point[p];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(m),p++}else if(T.isHemisphereLight){const E=n.hemi[_];E.direction.setFromMatrixPosition(T.matrixWorld),E.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function Qc(i){const t=new i0(i),e=[],n=[];function s(l){h.camera=l,e.length=0,n.length=0}function r(l){e.push(l)}function a(l){n.push(l)}function o(){t.setup(e)}function c(l){t.setupView(e,l)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function s0(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Qc(i),t.set(s,[o])):r>=a.length?(o=new Qc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const r0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,a0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function o0(i,t,e){let n=new To;const s=new ft,r=new ft,a=new ue,o=new Pd({depthPacking:du}),c=new Dd,h={},l=e.maxTextureSize,u={[Un]:Pe,[Pe]:Un,[an]:an},p=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:r0,fragmentShader:a0}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const g=new ve;g.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ce(g,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hl;let f=this.type;this.render=function(R,L,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const S=i.getRenderTarget(),x=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),H=i.state;H.setBlending(Pn),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const k=f!==_n&&this.type===_n,q=f===_n&&this.type!==_n;for(let K=0,U=R.length;K<U;K++){const G=R[K],z=G.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const nt=z.getFrameExtents();if(s.multiply(nt),r.copy(z.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/nt.x),s.x=r.x*nt.x,z.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/nt.y),s.y=r.y*nt.y,z.mapSize.y=r.y)),z.map===null||k===!0||q===!0){const Mt=this.type!==_n?{minFilter:Qe,magFilter:Qe}:{};z.map!==null&&z.map.dispose(),z.map=new ti(s.x,s.y,Mt),z.map.texture.name=G.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const st=z.getViewportCount();for(let Mt=0;Mt<st;Mt++){const Pt=z.getViewport(Mt);a.set(r.x*Pt.x,r.y*Pt.y,r.x*Pt.z,r.y*Pt.w),H.viewport(a),z.updateMatrices(G,Mt),n=z.getFrustum(),E(L,I,z.camera,G,this.type)}z.isPointLightShadow!==!0&&this.type===_n&&A(z,I),z.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,x,D)};function A(R,L){const I=t.update(_);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,d.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new ti(s.x,s.y)),p.uniforms.shadow_pass.value=R.map.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(L,null,I,p,_,null),d.uniforms.shadow_pass.value=R.mapPass.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(L,null,I,d,_,null)}function T(R,L,I,S){let x=null;const D=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(D!==void 0)x=D;else if(x=I.isPointLight===!0?c:o,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0){const H=x.uuid,k=L.uuid;let q=h[H];q===void 0&&(q={},h[H]=q);let K=q[k];K===void 0&&(K=x.clone(),q[k]=K,L.addEventListener("dispose",C)),x=K}if(x.visible=L.visible,x.wireframe=L.wireframe,S===_n?x.side=L.shadowSide!==null?L.shadowSide:L.side:x.side=L.shadowSide!==null?L.shadowSide:u[L.side],x.alphaMap=L.alphaMap,x.alphaTest=L.alphaTest,x.map=L.map,x.clipShadows=L.clipShadows,x.clippingPlanes=L.clippingPlanes,x.clipIntersection=L.clipIntersection,x.displacementMap=L.displacementMap,x.displacementScale=L.displacementScale,x.displacementBias=L.displacementBias,x.wireframeLinewidth=L.wireframeLinewidth,x.linewidth=L.linewidth,I.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const H=i.properties.get(x);H.light=I}return x}function E(R,L,I,S,x){if(R.visible===!1)return;if(R.layers.test(L.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&x===_n)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);const k=t.update(R),q=R.material;if(Array.isArray(q)){const K=k.groups;for(let U=0,G=K.length;U<G;U++){const z=K[U],nt=q[z.materialIndex];if(nt&&nt.visible){const st=T(R,nt,S,x);R.onBeforeShadow(i,R,L,I,k,st,z),i.renderBufferDirect(I,null,k,st,R,z),R.onAfterShadow(i,R,L,I,k,st,z)}}}else if(q.visible){const K=T(R,q,S,x);R.onBeforeShadow(i,R,L,I,k,K,null),i.renderBufferDirect(I,null,k,K,R,null),R.onAfterShadow(i,R,L,I,k,K,null)}}const H=R.children;for(let k=0,q=H.length;k<q;k++)E(H[k],L,I,S,x)}function C(R){R.target.removeEventListener("dispose",C);for(const I in h){const S=h[I],x=R.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}const c0={[Ea]:ba,[Ta]:Ra,[Aa]:Ca,[Ui]:wa,[ba]:Ea,[Ra]:Ta,[Ca]:Aa,[wa]:Ui};function l0(i,t){function e(){let F=!1;const ct=new ue;let Y=null;const J=new ue(0,0,0,0);return{setMask:function(dt){Y!==dt&&!F&&(i.colorMask(dt,dt,dt,dt),Y=dt)},setLocked:function(dt){F=dt},setClear:function(dt,ut,Ot,le,Me){Me===!0&&(dt*=le,ut*=le,Ot*=le),ct.set(dt,ut,Ot,le),J.equals(ct)===!1&&(i.clearColor(dt,ut,Ot,le),J.copy(ct))},reset:function(){F=!1,Y=null,J.set(-1,0,0,0)}}}function n(){let F=!1,ct=!1,Y=null,J=null,dt=null;return{setReversed:function(ut){if(ct!==ut){const Ot=t.get("EXT_clip_control");ct?Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.ZERO_TO_ONE_EXT):Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.NEGATIVE_ONE_TO_ONE_EXT);const le=dt;dt=null,this.setClear(le)}ct=ut},getReversed:function(){return ct},setTest:function(ut){ut?rt(i.DEPTH_TEST):St(i.DEPTH_TEST)},setMask:function(ut){Y!==ut&&!F&&(i.depthMask(ut),Y=ut)},setFunc:function(ut){if(ct&&(ut=c0[ut]),J!==ut){switch(ut){case Ea:i.depthFunc(i.NEVER);break;case ba:i.depthFunc(i.ALWAYS);break;case Ta:i.depthFunc(i.LESS);break;case Ui:i.depthFunc(i.LEQUAL);break;case Aa:i.depthFunc(i.EQUAL);break;case wa:i.depthFunc(i.GEQUAL);break;case Ra:i.depthFunc(i.GREATER);break;case Ca:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}J=ut}},setLocked:function(ut){F=ut},setClear:function(ut){dt!==ut&&(ct&&(ut=1-ut),i.clearDepth(ut),dt=ut)},reset:function(){F=!1,Y=null,J=null,dt=null,ct=!1}}}function s(){let F=!1,ct=null,Y=null,J=null,dt=null,ut=null,Ot=null,le=null,Me=null;return{setTest:function(Qt){F||(Qt?rt(i.STENCIL_TEST):St(i.STENCIL_TEST))},setMask:function(Qt){ct!==Qt&&!F&&(i.stencilMask(Qt),ct=Qt)},setFunc:function(Qt,Ge,hn){(Y!==Qt||J!==Ge||dt!==hn)&&(i.stencilFunc(Qt,Ge,hn),Y=Qt,J=Ge,dt=hn)},setOp:function(Qt,Ge,hn){(ut!==Qt||Ot!==Ge||le!==hn)&&(i.stencilOp(Qt,Ge,hn),ut=Qt,Ot=Ge,le=hn)},setLocked:function(Qt){F=Qt},setClear:function(Qt){Me!==Qt&&(i.clearStencil(Qt),Me=Qt)},reset:function(){F=!1,ct=null,Y=null,J=null,dt=null,ut=null,Ot=null,le=null,Me=null}}}const r=new e,a=new n,o=new s,c=new WeakMap,h=new WeakMap;let l={},u={},p=new WeakMap,d=[],g=null,_=!1,m=null,f=null,A=null,T=null,E=null,C=null,R=null,L=new Ut(0,0,0),I=0,S=!1,x=null,D=null,H=null,k=null,q=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,G=0;const z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(z)[1]),U=G>=1):z.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),U=G>=2);let nt=null,st={};const Mt=i.getParameter(i.SCISSOR_BOX),Pt=i.getParameter(i.VIEWPORT),Xt=new ue().fromArray(Mt),$=new ue().fromArray(Pt);function tt(F,ct,Y,J){const dt=new Uint8Array(4),ut=i.createTexture();i.bindTexture(F,ut),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ot=0;Ot<Y;Ot++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,J,0,i.RGBA,i.UNSIGNED_BYTE,dt):i.texImage2D(ct+Ot,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,dt);return ut}const pt={};pt[i.TEXTURE_2D]=tt(i.TEXTURE_2D,i.TEXTURE_2D,1),pt[i.TEXTURE_CUBE_MAP]=tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[i.TEXTURE_2D_ARRAY]=tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),pt[i.TEXTURE_3D]=tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),rt(i.DEPTH_TEST),a.setFunc(Ui),Wt(!1),Gt(Yo),rt(i.CULL_FACE),N(Pn);function rt(F){l[F]!==!0&&(i.enable(F),l[F]=!0)}function St(F){l[F]!==!1&&(i.disable(F),l[F]=!1)}function Et(F,ct){return u[F]!==ct?(i.bindFramebuffer(F,ct),u[F]=ct,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ct),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function mt(F,ct){let Y=d,J=!1;if(F){Y=p.get(ct),Y===void 0&&(Y=[],p.set(ct,Y));const dt=F.textures;if(Y.length!==dt.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let ut=0,Ot=dt.length;ut<Ot;ut++)Y[ut]=i.COLOR_ATTACHMENT0+ut;Y.length=dt.length,J=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,J=!0);J&&i.drawBuffers(Y)}function Lt(F){return g!==F?(i.useProgram(F),g=F,!0):!1}const Ft={[$n]:i.FUNC_ADD,[Bh]:i.FUNC_SUBTRACT,[zh]:i.FUNC_REVERSE_SUBTRACT};Ft[Hh]=i.MIN,Ft[kh]=i.MAX;const ne={[Vh]:i.ZERO,[Gh]:i.ONE,[Wh]:i.SRC_COLOR,[ya]:i.SRC_ALPHA,[Zh]:i.SRC_ALPHA_SATURATE,[$h]:i.DST_COLOR,[qh]:i.DST_ALPHA,[Xh]:i.ONE_MINUS_SRC_COLOR,[Sa]:i.ONE_MINUS_SRC_ALPHA,[Kh]:i.ONE_MINUS_DST_COLOR,[Yh]:i.ONE_MINUS_DST_ALPHA,[jh]:i.CONSTANT_COLOR,[Jh]:i.ONE_MINUS_CONSTANT_COLOR,[Qh]:i.CONSTANT_ALPHA,[tu]:i.ONE_MINUS_CONSTANT_ALPHA};function N(F,ct,Y,J,dt,ut,Ot,le,Me,Qt){if(F===Pn){_===!0&&(St(i.BLEND),_=!1);return}if(_===!1&&(rt(i.BLEND),_=!0),F!==Oh){if(F!==m||Qt!==S){if((f!==$n||E!==$n)&&(i.blendEquation(i.FUNC_ADD),f=$n,E=$n),Qt)switch(F){case Ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $o:i.blendFunc(i.ONE,i.ONE);break;case Ko:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $o:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ko:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}A=null,T=null,C=null,R=null,L.set(0,0,0),I=0,m=F,S=Qt}return}dt=dt||ct,ut=ut||Y,Ot=Ot||J,(ct!==f||dt!==E)&&(i.blendEquationSeparate(Ft[ct],Ft[dt]),f=ct,E=dt),(Y!==A||J!==T||ut!==C||Ot!==R)&&(i.blendFuncSeparate(ne[Y],ne[J],ne[ut],ne[Ot]),A=Y,T=J,C=ut,R=Ot),(le.equals(L)===!1||Me!==I)&&(i.blendColor(le.r,le.g,le.b,Me),L.copy(le),I=Me),m=F,S=!1}function Re(F,ct){F.side===an?St(i.CULL_FACE):rt(i.CULL_FACE);let Y=F.side===Pe;ct&&(Y=!Y),Wt(Y),F.blending===Ci&&F.transparent===!1?N(Pn):N(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const J=F.stencilWrite;o.setTest(J),J&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),se(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):St(i.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(F){x!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),x=F)}function Gt(F){F!==Ih?(rt(i.CULL_FACE),F!==D&&(F===Yo?i.cullFace(i.BACK):F===Uh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):St(i.CULL_FACE),D=F}function Tt(F){F!==H&&(U&&i.lineWidth(F),H=F)}function se(F,ct,Y){F?(rt(i.POLYGON_OFFSET_FILL),(k!==ct||q!==Y)&&(i.polygonOffset(ct,Y),k=ct,q=Y)):St(i.POLYGON_OFFSET_FILL)}function At(F){F?rt(i.SCISSOR_TEST):St(i.SCISSOR_TEST)}function w(F){F===void 0&&(F=i.TEXTURE0+K-1),nt!==F&&(i.activeTexture(F),nt=F)}function v(F,ct,Y){Y===void 0&&(nt===null?Y=i.TEXTURE0+K-1:Y=nt);let J=st[Y];J===void 0&&(J={type:void 0,texture:void 0},st[Y]=J),(J.type!==F||J.texture!==ct)&&(nt!==Y&&(i.activeTexture(Y),nt=Y),i.bindTexture(F,ct||pt[F]),J.type=F,J.texture=ct)}function V(){const F=st[nt];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function j(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function bt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Yt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function it(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function vt(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ct(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Dt(F){Xt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),Xt.copy(F))}function xt(F){$.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),$.copy(F))}function qt(F,ct){let Y=h.get(ct);Y===void 0&&(Y=new WeakMap,h.set(ct,Y));let J=Y.get(F);J===void 0&&(J=i.getUniformBlockIndex(ct,F.name),Y.set(F,J))}function Ht(F,ct){const J=h.get(ct).get(F);c.get(ct)!==J&&(i.uniformBlockBinding(ct,J,F.__bindingPointIndex),c.set(ct,J))}function ie(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},nt=null,st={},u={},p=new WeakMap,d=[],g=null,_=!1,m=null,f=null,A=null,T=null,E=null,C=null,R=null,L=new Ut(0,0,0),I=0,S=!1,x=null,D=null,H=null,k=null,q=null,Xt.set(0,0,i.canvas.width,i.canvas.height),$.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:rt,disable:St,bindFramebuffer:Et,drawBuffers:mt,useProgram:Lt,setBlending:N,setMaterial:Re,setFlipSided:Wt,setCullFace:Gt,setLineWidth:Tt,setPolygonOffset:se,setScissorTest:At,activeTexture:w,bindTexture:v,unbindTexture:V,compressedTexImage2D:j,compressedTexImage3D:Q,texImage2D:vt,texImage3D:Ct,updateUBOMapping:qt,uniformBlockBinding:Ht,texStorage2D:Yt,texStorage3D:it,texSubImage2D:Z,texSubImage3D:bt,compressedTexSubImage2D:ht,compressedTexSubImage3D:_t,scissor:Dt,viewport:xt,reset:ie}}function h0(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ft,l=new WeakMap;let u;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,v){return d?new OffscreenCanvas(w,v):vr("canvas")}function _(w,v,V){let j=1;const Q=At(w);if((Q.width>V||Q.height>V)&&(j=V/Math.max(Q.width,Q.height)),j<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Z=Math.floor(j*Q.width),bt=Math.floor(j*Q.height);u===void 0&&(u=g(Z,bt));const ht=v?g(Z,bt):u;return ht.width=Z,ht.height=bt,ht.getContext("2d").drawImage(w,0,0,Z,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Z+"x"+bt+")."),ht}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){i.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(w,v,V,j,Q=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z=v;if(v===i.RED&&(V===i.FLOAT&&(Z=i.R32F),V===i.HALF_FLOAT&&(Z=i.R16F),V===i.UNSIGNED_BYTE&&(Z=i.R8)),v===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.R8UI),V===i.UNSIGNED_SHORT&&(Z=i.R16UI),V===i.UNSIGNED_INT&&(Z=i.R32UI),V===i.BYTE&&(Z=i.R8I),V===i.SHORT&&(Z=i.R16I),V===i.INT&&(Z=i.R32I)),v===i.RG&&(V===i.FLOAT&&(Z=i.RG32F),V===i.HALF_FLOAT&&(Z=i.RG16F),V===i.UNSIGNED_BYTE&&(Z=i.RG8)),v===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RG8UI),V===i.UNSIGNED_SHORT&&(Z=i.RG16UI),V===i.UNSIGNED_INT&&(Z=i.RG32UI),V===i.BYTE&&(Z=i.RG8I),V===i.SHORT&&(Z=i.RG16I),V===i.INT&&(Z=i.RG32I)),v===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),V===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),V===i.UNSIGNED_INT&&(Z=i.RGB32UI),V===i.BYTE&&(Z=i.RGB8I),V===i.SHORT&&(Z=i.RGB16I),V===i.INT&&(Z=i.RGB32I)),v===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),V===i.UNSIGNED_INT&&(Z=i.RGBA32UI),V===i.BYTE&&(Z=i.RGBA8I),V===i.SHORT&&(Z=i.RGBA16I),V===i.INT&&(Z=i.RGBA32I)),v===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),v===i.RGBA){const bt=Q?gr:Zt.getTransfer(j);V===i.FLOAT&&(Z=i.RGBA32F),V===i.HALF_FLOAT&&(Z=i.RGBA16F),V===i.UNSIGNED_BYTE&&(Z=bt===ee?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function E(w,v){let V;return w?v===null||v===Qn||v===Bi?V=i.DEPTH24_STENCIL8:v===vn?V=i.DEPTH32F_STENCIL8:v===ms&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Qn||v===Bi?V=i.DEPTH_COMPONENT24:v===vn?V=i.DEPTH_COMPONENT32F:v===ms&&(V=i.DEPTH_COMPONENT16),V}function C(w,v){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Qe&&w.minFilter!==on?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function R(w){const v=w.target;v.removeEventListener("dispose",R),I(v),v.isVideoTexture&&l.delete(v)}function L(w){const v=w.target;v.removeEventListener("dispose",L),x(v)}function I(w){const v=n.get(w);if(v.__webglInit===void 0)return;const V=w.source,j=p.get(V);if(j){const Q=j[v.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(w),Object.keys(j).length===0&&p.delete(V)}n.remove(w)}function S(w){const v=n.get(w);i.deleteTexture(v.__webglTexture);const V=w.source,j=p.get(V);delete j[v.__cacheKey],a.memory.textures--}function x(w){const v=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(v.__webglFramebuffer[j]))for(let Q=0;Q<v.__webglFramebuffer[j].length;Q++)i.deleteFramebuffer(v.__webglFramebuffer[j][Q]);else i.deleteFramebuffer(v.__webglFramebuffer[j]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[j])}else{if(Array.isArray(v.__webglFramebuffer))for(let j=0;j<v.__webglFramebuffer.length;j++)i.deleteFramebuffer(v.__webglFramebuffer[j]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let j=0;j<v.__webglColorRenderbuffer.length;j++)v.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[j]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const V=w.textures;for(let j=0,Q=V.length;j<Q;j++){const Z=n.get(V[j]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(V[j])}n.remove(w)}let D=0;function H(){D=0}function k(){const w=D;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),D+=1,w}function q(w){const v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function K(w,v){const V=n.get(w);if(w.isVideoTexture&&Tt(w),w.isRenderTargetTexture===!1&&w.version>0&&V.__version!==w.version){const j=w.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(V,w,v);return}}e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+v)}function U(w,v){const V=n.get(w);if(w.version>0&&V.__version!==w.version){$(V,w,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+v)}function G(w,v){const V=n.get(w);if(w.version>0&&V.__version!==w.version){$(V,w,v);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+v)}function z(w,v){const V=n.get(w);if(w.version>0&&V.__version!==w.version){tt(V,w,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+v)}const nt={[Da]:i.REPEAT,[Zn]:i.CLAMP_TO_EDGE,[Na]:i.MIRRORED_REPEAT},st={[Qe]:i.NEAREST,[hu]:i.NEAREST_MIPMAP_NEAREST,[Rs]:i.NEAREST_MIPMAP_LINEAR,[on]:i.LINEAR,[Dr]:i.LINEAR_MIPMAP_NEAREST,[jn]:i.LINEAR_MIPMAP_LINEAR},Mt={[pu]:i.NEVER,[Mu]:i.ALWAYS,[mu]:i.LESS,[bl]:i.LEQUAL,[gu]:i.EQUAL,[xu]:i.GEQUAL,[_u]:i.GREATER,[vu]:i.NOTEQUAL};function Pt(w,v){if(v.type===vn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===on||v.magFilter===Dr||v.magFilter===Rs||v.magFilter===jn||v.minFilter===on||v.minFilter===Dr||v.minFilter===Rs||v.minFilter===jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,nt[v.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,nt[v.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,nt[v.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,st[v.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,st[v.minFilter]),v.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,Mt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Qe||v.minFilter!==Rs&&v.minFilter!==jn||v.type===vn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Xt(w,v){let V=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",R));const j=v.source;let Q=p.get(j);Q===void 0&&(Q={},p.set(j,Q));const Z=q(v);if(Z!==w.__cacheKey){Q[Z]===void 0&&(Q[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),Q[Z].usedTimes++;const bt=Q[w.__cacheKey];bt!==void 0&&(Q[w.__cacheKey].usedTimes--,bt.usedTimes===0&&S(v)),w.__cacheKey=Z,w.__webglTexture=Q[Z].texture}return V}function $(w,v,V){let j=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(j=i.TEXTURE_3D);const Q=Xt(w,v),Z=v.source;e.bindTexture(j,w.__webglTexture,i.TEXTURE0+V);const bt=n.get(Z);if(Z.version!==bt.__version||Q===!0){e.activeTexture(i.TEXTURE0+V);const ht=Zt.getPrimaries(Zt.workingColorSpace),_t=v.colorSpace===Cn?null:Zt.getPrimaries(v.colorSpace),Yt=v.colorSpace===Cn||ht===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Yt);let it=_(v.image,!1,s.maxTextureSize);it=se(v,it);const vt=r.convert(v.format,v.colorSpace),Ct=r.convert(v.type);let Dt=T(v.internalFormat,vt,Ct,v.colorSpace,v.isVideoTexture);Pt(j,v);let xt;const qt=v.mipmaps,Ht=v.isVideoTexture!==!0,ie=bt.__version===void 0||Q===!0,F=Z.dataReady,ct=C(v,it);if(v.isDepthTexture)Dt=E(v.format===zi,v.type),ie&&(Ht?e.texStorage2D(i.TEXTURE_2D,1,Dt,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Dt,it.width,it.height,0,vt,Ct,null));else if(v.isDataTexture)if(qt.length>0){Ht&&ie&&e.texStorage2D(i.TEXTURE_2D,ct,Dt,qt[0].width,qt[0].height);for(let Y=0,J=qt.length;Y<J;Y++)xt=qt[Y],Ht?F&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,xt.width,xt.height,vt,Ct,xt.data):e.texImage2D(i.TEXTURE_2D,Y,Dt,xt.width,xt.height,0,vt,Ct,xt.data);v.generateMipmaps=!1}else Ht?(ie&&e.texStorage2D(i.TEXTURE_2D,ct,Dt,it.width,it.height),F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,it.width,it.height,vt,Ct,it.data)):e.texImage2D(i.TEXTURE_2D,0,Dt,it.width,it.height,0,vt,Ct,it.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ht&&ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,Dt,qt[0].width,qt[0].height,it.depth);for(let Y=0,J=qt.length;Y<J;Y++)if(xt=qt[Y],v.format!==Ze)if(vt!==null)if(Ht){if(F)if(v.layerUpdates.size>0){const dt=Cc(xt.width,xt.height,v.format,v.type);for(const ut of v.layerUpdates){const Ot=xt.data.subarray(ut*dt/xt.data.BYTES_PER_ELEMENT,(ut+1)*dt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,ut,xt.width,xt.height,1,vt,Ot)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,xt.width,xt.height,it.depth,vt,xt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Dt,xt.width,xt.height,it.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?F&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,xt.width,xt.height,it.depth,vt,Ct,xt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Dt,xt.width,xt.height,it.depth,0,vt,Ct,xt.data)}else{Ht&&ie&&e.texStorage2D(i.TEXTURE_2D,ct,Dt,qt[0].width,qt[0].height);for(let Y=0,J=qt.length;Y<J;Y++)xt=qt[Y],v.format!==Ze?vt!==null?Ht?F&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,xt.width,xt.height,vt,xt.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Dt,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?F&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,xt.width,xt.height,vt,Ct,xt.data):e.texImage2D(i.TEXTURE_2D,Y,Dt,xt.width,xt.height,0,vt,Ct,xt.data)}else if(v.isDataArrayTexture)if(Ht){if(ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,Dt,it.width,it.height,it.depth),F)if(v.layerUpdates.size>0){const Y=Cc(it.width,it.height,v.format,v.type);for(const J of v.layerUpdates){const dt=it.data.subarray(J*Y/it.data.BYTES_PER_ELEMENT,(J+1)*Y/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,it.width,it.height,1,vt,Ct,dt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,vt,Ct,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Dt,it.width,it.height,it.depth,0,vt,Ct,it.data);else if(v.isData3DTexture)Ht?(ie&&e.texStorage3D(i.TEXTURE_3D,ct,Dt,it.width,it.height,it.depth),F&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,vt,Ct,it.data)):e.texImage3D(i.TEXTURE_3D,0,Dt,it.width,it.height,it.depth,0,vt,Ct,it.data);else if(v.isFramebufferTexture){if(ie)if(Ht)e.texStorage2D(i.TEXTURE_2D,ct,Dt,it.width,it.height);else{let Y=it.width,J=it.height;for(let dt=0;dt<ct;dt++)e.texImage2D(i.TEXTURE_2D,dt,Dt,Y,J,0,vt,Ct,null),Y>>=1,J>>=1}}else if(qt.length>0){if(Ht&&ie){const Y=At(qt[0]);e.texStorage2D(i.TEXTURE_2D,ct,Dt,Y.width,Y.height)}for(let Y=0,J=qt.length;Y<J;Y++)xt=qt[Y],Ht?F&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,vt,Ct,xt):e.texImage2D(i.TEXTURE_2D,Y,Dt,vt,Ct,xt);v.generateMipmaps=!1}else if(Ht){if(ie){const Y=At(it);e.texStorage2D(i.TEXTURE_2D,ct,Dt,Y.width,Y.height)}F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Ct,it)}else e.texImage2D(i.TEXTURE_2D,0,Dt,vt,Ct,it);m(v)&&f(j),bt.__version=Z.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function tt(w,v,V){if(v.image.length!==6)return;const j=Xt(w,v),Q=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+V);const Z=n.get(Q);if(Q.version!==Z.__version||j===!0){e.activeTexture(i.TEXTURE0+V);const bt=Zt.getPrimaries(Zt.workingColorSpace),ht=v.colorSpace===Cn?null:Zt.getPrimaries(v.colorSpace),_t=v.colorSpace===Cn||bt===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Yt=v.isCompressedTexture||v.image[0].isCompressedTexture,it=v.image[0]&&v.image[0].isDataTexture,vt=[];for(let J=0;J<6;J++)!Yt&&!it?vt[J]=_(v.image[J],!0,s.maxCubemapSize):vt[J]=it?v.image[J].image:v.image[J],vt[J]=se(v,vt[J]);const Ct=vt[0],Dt=r.convert(v.format,v.colorSpace),xt=r.convert(v.type),qt=T(v.internalFormat,Dt,xt,v.colorSpace),Ht=v.isVideoTexture!==!0,ie=Z.__version===void 0||j===!0,F=Q.dataReady;let ct=C(v,Ct);Pt(i.TEXTURE_CUBE_MAP,v);let Y;if(Yt){Ht&&ie&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,qt,Ct.width,Ct.height);for(let J=0;J<6;J++){Y=vt[J].mipmaps;for(let dt=0;dt<Y.length;dt++){const ut=Y[dt];v.format!==Ze?Dt!==null?Ht?F&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt,0,0,ut.width,ut.height,Dt,ut.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt,qt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt,0,0,ut.width,ut.height,Dt,xt,ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt,qt,ut.width,ut.height,0,Dt,xt,ut.data)}}}else{if(Y=v.mipmaps,Ht&&ie){Y.length>0&&ct++;const J=At(vt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,qt,J.width,J.height)}for(let J=0;J<6;J++)if(it){Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,vt[J].width,vt[J].height,Dt,xt,vt[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,qt,vt[J].width,vt[J].height,0,Dt,xt,vt[J].data);for(let dt=0;dt<Y.length;dt++){const Ot=Y[dt].image[J].image;Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt+1,0,0,Ot.width,Ot.height,Dt,xt,Ot.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt+1,qt,Ot.width,Ot.height,0,Dt,xt,Ot.data)}}else{Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Dt,xt,vt[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,qt,Dt,xt,vt[J]);for(let dt=0;dt<Y.length;dt++){const ut=Y[dt];Ht?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt+1,0,0,Dt,xt,ut.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,dt+1,qt,Dt,xt,ut.image[J])}}}m(v)&&f(i.TEXTURE_CUBE_MAP),Z.__version=Q.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function pt(w,v,V,j,Q,Z){const bt=r.convert(V.format,V.colorSpace),ht=r.convert(V.type),_t=T(V.internalFormat,bt,ht,V.colorSpace),Yt=n.get(v),it=n.get(V);if(it.__renderTarget=v,!Yt.__hasExternalTextures){const vt=Math.max(1,v.width>>Z),Ct=Math.max(1,v.height>>Z);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,Z,_t,vt,Ct,v.depth,0,bt,ht,null):e.texImage2D(Q,Z,_t,vt,Ct,0,bt,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Gt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,Q,it.__webglTexture,0,Wt(v)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,Q,it.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function rt(w,v,V){if(i.bindRenderbuffer(i.RENDERBUFFER,w),v.depthBuffer){const j=v.depthTexture,Q=j&&j.isDepthTexture?j.type:null,Z=E(v.stencilBuffer,Q),bt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=Wt(v);Gt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,Z,v.width,v.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,Z,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Z,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,bt,i.RENDERBUFFER,w)}else{const j=v.textures;for(let Q=0;Q<j.length;Q++){const Z=j[Q],bt=r.convert(Z.format,Z.colorSpace),ht=r.convert(Z.type),_t=T(Z.internalFormat,bt,ht,Z.colorSpace),Yt=Wt(v);V&&Gt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,_t,v.width,v.height):Gt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Yt,_t,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,_t,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(w,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(v.depthTexture);j.__renderTarget=v,(!j.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),K(v.depthTexture,0);const Q=j.__webglTexture,Z=Wt(v);if(v.depthTexture.format===Li)Gt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(v.depthTexture.format===zi)Gt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Et(w){const v=n.get(w),V=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){const j=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),j){const Q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,j.removeEventListener("dispose",Q)};j.addEventListener("dispose",Q),v.__depthDisposeCallback=Q}v.__boundDepthTexture=j}if(w.depthTexture&&!v.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");St(v.__webglFramebuffer,w)}else if(V){v.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[j]),v.__webglDepthbuffer[j]===void 0)v.__webglDepthbuffer[j]=i.createRenderbuffer(),rt(v.__webglDepthbuffer[j],w,!1);else{const Q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),rt(v.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,Q)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function mt(w,v,V){const j=n.get(w);v!==void 0&&pt(j.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Et(w)}function Lt(w){const v=w.texture,V=n.get(w),j=n.get(v);w.addEventListener("dispose",L);const Q=w.textures,Z=w.isWebGLCubeRenderTarget===!0,bt=Q.length>1;if(bt||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=v.version,a.memory.textures++),Z){V.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(v.mipmaps&&v.mipmaps.length>0){V.__webglFramebuffer[ht]=[];for(let _t=0;_t<v.mipmaps.length;_t++)V.__webglFramebuffer[ht][_t]=i.createFramebuffer()}else V.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){V.__webglFramebuffer=[];for(let ht=0;ht<v.mipmaps.length;ht++)V.__webglFramebuffer[ht]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(bt)for(let ht=0,_t=Q.length;ht<_t;ht++){const Yt=n.get(Q[ht]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&Gt(w)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ht=0;ht<Q.length;ht++){const _t=Q[ht];V.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ht]);const Yt=r.convert(_t.format,_t.colorSpace),it=r.convert(_t.type),vt=T(_t.internalFormat,Yt,it,_t.colorSpace,w.isXRRenderTarget===!0),Ct=Wt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,vt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,V.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),rt(V.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Pt(i.TEXTURE_CUBE_MAP,v);for(let ht=0;ht<6;ht++)if(v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)pt(V.__webglFramebuffer[ht][_t],w,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,_t);else pt(V.__webglFramebuffer[ht],w,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(v)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let ht=0,_t=Q.length;ht<_t;ht++){const Yt=Q[ht],it=n.get(Yt);e.bindTexture(i.TEXTURE_2D,it.__webglTexture),Pt(i.TEXTURE_2D,Yt),pt(V.__webglFramebuffer,w,Yt,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),m(Yt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ht=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,j.__webglTexture),Pt(ht,v),v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)pt(V.__webglFramebuffer[_t],w,v,i.COLOR_ATTACHMENT0,ht,_t);else pt(V.__webglFramebuffer,w,v,i.COLOR_ATTACHMENT0,ht,0);m(v)&&f(ht),e.unbindTexture()}w.depthBuffer&&Et(w)}function Ft(w){const v=w.textures;for(let V=0,j=v.length;V<j;V++){const Q=v[V];if(m(Q)){const Z=A(w),bt=n.get(Q).__webglTexture;e.bindTexture(Z,bt),f(Z),e.unbindTexture()}}}const ne=[],N=[];function Re(w){if(w.samples>0){if(Gt(w)===!1){const v=w.textures,V=w.width,j=w.height;let Q=i.COLOR_BUFFER_BIT;const Z=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=n.get(w),ht=v.length>1;if(ht)for(let _t=0;_t<v.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let _t=0;_t<v.length;_t++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,bt.__webglColorRenderbuffer[_t]);const Yt=n.get(v[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Yt,0)}i.blitFramebuffer(0,0,V,j,0,0,V,j,Q,i.NEAREST),c===!0&&(ne.length=0,N.length=0,ne.push(i.COLOR_ATTACHMENT0+_t),w.depthBuffer&&w.resolveDepthBuffer===!1&&(ne.push(Z),N.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,N)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ne))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let _t=0;_t<v.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,bt.__webglColorRenderbuffer[_t]);const Yt=n.get(v[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,Yt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const v=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function Wt(w){return Math.min(s.maxSamples,w.samples)}function Gt(w){const v=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Tt(w){const v=a.render.frame;l.get(w)!==v&&(l.set(w,v),w.update())}function se(w,v){const V=w.colorSpace,j=w.format,Q=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||V!==Hi&&V!==Cn&&(Zt.getTransfer(V)===ee?(j!==Ze||Q!==Sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),v}function At(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(h.width=w.naturalWidth||w.width,h.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(h.width=w.displayWidth,h.height=w.displayHeight):(h.width=w.width,h.height=w.height),h}this.allocateTextureUnit=k,this.resetTextureUnits=H,this.setTexture2D=K,this.setTexture2DArray=U,this.setTexture3D=G,this.setTextureCube=z,this.rebindTextures=mt,this.setupRenderTarget=Lt,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Gt}function u0(i,t){function e(n,s=Cn){let r;const a=Zt.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===xo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Mo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ml)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fl)return i.BYTE;if(n===pl)return i.SHORT;if(n===ms)return i.UNSIGNED_SHORT;if(n===vo)return i.INT;if(n===Qn)return i.UNSIGNED_INT;if(n===vn)return i.FLOAT;if(n===vs)return i.HALF_FLOAT;if(n===gl)return i.ALPHA;if(n===_l)return i.RGB;if(n===Ze)return i.RGBA;if(n===vl)return i.LUMINANCE;if(n===xl)return i.LUMINANCE_ALPHA;if(n===Li)return i.DEPTH_COMPONENT;if(n===zi)return i.DEPTH_STENCIL;if(n===Ml)return i.RED;if(n===yo)return i.RED_INTEGER;if(n===yl)return i.RG;if(n===So)return i.RG_INTEGER;if(n===Eo)return i.RGBA_INTEGER;if(n===sr||n===rr||n===ar||n===or)if(a===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===sr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===sr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===rr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===or)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ia||n===Ua||n===Fa||n===Oa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ia)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ua)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ba||n===za||n===Ha)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ba||n===za)return a===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ha)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ka||n===Va||n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===$a||n===Ka||n===Za||n===ja||n===Ja||n===Qa||n===to)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ka)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Va)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ga)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$a)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ja)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ja)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===to)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cr||n===eo||n===no)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===cr)return a===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===eo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===no)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Sl||n===io||n===so||n===ro)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===cr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===io)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===so)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ro)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const d0={type:"move"};class fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ve,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ve,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ve,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(h,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],p=l.position.distanceTo(u.position),d=.02,g=.005;h.inputState.pinching&&p>d+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&p<=d-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(d0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ve;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const f0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,p0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class m0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new we,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Fn({vertexShader:f0,fragmentShader:p0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ce(new Vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class g0 extends Gi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,p=null,d=null,g=null;const _=new m0,m=e.getContextAttributes();let f=null,A=null;const T=[],E=[],C=new ft;let R=null;const L=new Ue;L.viewport=new ue;const I=new Ue;I.viewport=new ue;const S=[L,I],x=new Ud;let D=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let tt=T[$];return tt===void 0&&(tt=new fa,T[$]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function($){let tt=T[$];return tt===void 0&&(tt=new fa,T[$]=tt),tt.getGripSpace()},this.getHand=function($){let tt=T[$];return tt===void 0&&(tt=new fa,T[$]=tt),tt.getHandSpace()};function k($){const tt=E.indexOf($.inputSource);if(tt===-1)return;const pt=T[tt];pt!==void 0&&(pt.update($.inputSource,$.frame,h||a),pt.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",K);for(let $=0;$<T.length;$++){const tt=E[$];tt!==null&&(E[$]=null,T[$].disconnect(tt))}D=null,H=null,_.reset(),t.setRenderTarget(f),d=null,p=null,u=null,s=null,A=null,Xt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",q),s.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(C),s.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),A=new ti(d.framebufferWidth,d.framebufferHeight,{format:Ze,type:Sn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,pt=null,rt=null;m.depth&&(rt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?zi:Li,pt=m.stencil?Bi:Qn);const St={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:r};u=new XRWebGLBinding(s,e),p=u.createProjectionLayer(St),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),A=new ti(p.textureWidth,p.textureHeight,{format:Ze,type:Sn,depthTexture:new zl(p.textureWidth,p.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),Xt.setContext(s),Xt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K($){for(let tt=0;tt<$.removed.length;tt++){const pt=$.removed[tt],rt=E.indexOf(pt);rt>=0&&(E[rt]=null,T[rt].disconnect(pt))}for(let tt=0;tt<$.added.length;tt++){const pt=$.added[tt];let rt=E.indexOf(pt);if(rt===-1){for(let Et=0;Et<T.length;Et++)if(Et>=E.length){E.push(pt),rt=Et;break}else if(E[Et]===null){E[Et]=pt,rt=Et;break}if(rt===-1)break}const St=T[rt];St&&St.connect(pt)}}const U=new P,G=new P;function z($,tt,pt){U.setFromMatrixPosition(tt.matrixWorld),G.setFromMatrixPosition(pt.matrixWorld);const rt=U.distanceTo(G),St=tt.projectionMatrix.elements,Et=pt.projectionMatrix.elements,mt=St[14]/(St[10]-1),Lt=St[14]/(St[10]+1),Ft=(St[9]+1)/St[5],ne=(St[9]-1)/St[5],N=(St[8]-1)/St[0],Re=(Et[8]+1)/Et[0],Wt=mt*N,Gt=mt*Re,Tt=rt/(-N+Re),se=Tt*-N;if(tt.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(se),$.translateZ(Tt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),St[10]===-1)$.projectionMatrix.copy(tt.projectionMatrix),$.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const At=mt+Tt,w=Lt+Tt,v=Wt-se,V=Gt+(rt-se),j=Ft*Lt/w*At,Q=ne*Lt/w*At;$.projectionMatrix.makePerspective(v,V,j,Q,At,w),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function nt($,tt){tt===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(tt.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let tt=$.near,pt=$.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),x.near=I.near=L.near=tt,x.far=I.far=L.far=pt,(D!==x.near||H!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),D=x.near,H=x.far),L.layers.mask=$.layers.mask|2,I.layers.mask=$.layers.mask|4,x.layers.mask=L.layers.mask|I.layers.mask;const rt=$.parent,St=x.cameras;nt(x,rt);for(let Et=0;Et<St.length;Et++)nt(St[Et],rt);St.length===2?z(x,L,I):x.projectionMatrix.copy(L.projectionMatrix),st($,x,rt)};function st($,tt,pt){pt===null?$.matrix.copy(tt.matrixWorld):($.matrix.copy(pt.matrixWorld),$.matrix.invert(),$.matrix.multiply(tt.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(tt.projectionMatrix),$.projectionMatrixInverse.copy(tt.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=gs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(p===null&&d===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let Mt=null;function Pt($,tt){if(l=tt.getViewerPose(h||a),g=tt,l!==null){const pt=l.views;d!==null&&(t.setRenderTargetFramebuffer(A,d.framebuffer),t.setRenderTarget(A));let rt=!1;pt.length!==x.cameras.length&&(x.cameras.length=0,rt=!0);for(let Et=0;Et<pt.length;Et++){const mt=pt[Et];let Lt=null;if(d!==null)Lt=d.getViewport(mt);else{const ne=u.getViewSubImage(p,mt);Lt=ne.viewport,Et===0&&(t.setRenderTargetTextures(A,ne.colorTexture,p.ignoreDepthValues?void 0:ne.depthStencilTexture),t.setRenderTarget(A))}let Ft=S[Et];Ft===void 0&&(Ft=new Ue,Ft.layers.enable(Et),Ft.viewport=new ue,S[Et]=Ft),Ft.matrix.fromArray(mt.transform.matrix),Ft.matrix.decompose(Ft.position,Ft.quaternion,Ft.scale),Ft.projectionMatrix.fromArray(mt.projectionMatrix),Ft.projectionMatrixInverse.copy(Ft.projectionMatrix).invert(),Ft.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),Et===0&&(x.matrix.copy(Ft.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),rt===!0&&x.cameras.push(Ft)}const St=s.enabledFeatures;if(St&&St.includes("depth-sensing")){const Et=u.getDepthInformation(pt[0]);Et&&Et.isValid&&Et.texture&&_.init(t,Et,s.renderState)}}for(let pt=0;pt<T.length;pt++){const rt=E[pt],St=T[pt];rt!==null&&St!==void 0&&St.update(rt,tt,h||a)}Mt&&Mt($,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),g=null}const Xt=new Yl;Xt.setAnimationLoop(Pt),this.setAnimationLoop=function($){Mt=$},this.dispose=function(){}}}const Xn=new cn,_0=new re;function v0(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Nl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,A,T,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),l(m,f)):f.isMeshStandardMaterial?(r(m,f),p(m,f),f.isMeshPhysicalMaterial&&d(m,f,E)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,A,T):f.isSpriteMaterial?h(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Pe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Pe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const A=t.get(f),T=A.envMap,E=A.envMapRotation;T&&(m.envMap.value=T,Xn.copy(E),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),m.envMapRotation.value.setFromMatrix4(_0.makeRotationFromEuler(Xn)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,A,T){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*A,m.scale.value=T*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function p(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function d(m,f,A){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Pe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const A=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function x0(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,T){const E=T.program;n.uniformBlockBinding(A,E)}function h(A,T){let E=s[A.id];E===void 0&&(g(A),E=l(A),s[A.id]=E,A.addEventListener("dispose",m));const C=T.program;n.updateUBOMapping(A,C);const R=t.render.frame;r[A.id]!==R&&(p(A),r[A.id]=R)}function l(A){const T=u();A.__bindingPointIndex=T;const E=i.createBuffer(),C=A.__size,R=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,C,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,E),E}function u(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(A){const T=s[A.id],E=A.uniforms,C=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let R=0,L=E.length;R<L;R++){const I=Array.isArray(E[R])?E[R]:[E[R]];for(let S=0,x=I.length;S<x;S++){const D=I[S];if(d(D,R,S,C)===!0){const H=D.__offset,k=Array.isArray(D.value)?D.value:[D.value];let q=0;for(let K=0;K<k.length;K++){const U=k[K],G=_(U);typeof U=="number"||typeof U=="boolean"?(D.__data[0]=U,i.bufferSubData(i.UNIFORM_BUFFER,H+q,D.__data)):U.isMatrix3?(D.__data[0]=U.elements[0],D.__data[1]=U.elements[1],D.__data[2]=U.elements[2],D.__data[3]=0,D.__data[4]=U.elements[3],D.__data[5]=U.elements[4],D.__data[6]=U.elements[5],D.__data[7]=0,D.__data[8]=U.elements[6],D.__data[9]=U.elements[7],D.__data[10]=U.elements[8],D.__data[11]=0):(U.toArray(D.__data,q),q+=G.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,H,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(A,T,E,C){const R=A.value,L=T+"_"+E;if(C[L]===void 0)return typeof R=="number"||typeof R=="boolean"?C[L]=R:C[L]=R.clone(),!0;{const I=C[L];if(typeof R=="number"||typeof R=="boolean"){if(I!==R)return C[L]=R,!0}else if(I.equals(R)===!1)return I.copy(R),!0}return!1}function g(A){const T=A.uniforms;let E=0;const C=16;for(let L=0,I=T.length;L<I;L++){const S=Array.isArray(T[L])?T[L]:[T[L]];for(let x=0,D=S.length;x<D;x++){const H=S[x],k=Array.isArray(H.value)?H.value:[H.value];for(let q=0,K=k.length;q<K;q++){const U=k[q],G=_(U),z=E%C,nt=z%G.boundary,st=z+nt;E+=nt,st!==0&&C-st<G.storage&&(E+=C-st),H.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=E,E+=G.storage}}}const R=E%C;return R>0&&(E+=C-R),A.__size=E,A.__cache={},this}function _(A){const T={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(T.boundary=4,T.storage=4):A.isVector2?(T.boundary=8,T.storage=8):A.isVector3||A.isColor?(T.boundary=16,T.storage=12):A.isVector4?(T.boundary=16,T.storage=16):A.isMatrix3?(T.boundary=48,T.storage=48):A.isMatrix4?(T.boundary=64,T.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),T}function m(A){const T=A.target;T.removeEventListener("dispose",m);const E=a.indexOf(T.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function f(){for(const A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:c,update:h,dispose:f}}class Jl{constructor(t={}){const{canvas:e=Ou(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const A=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ze,this.toneMapping=Dn,this.toneMappingExposure=1;const E=this;let C=!1,R=0,L=0,I=null,S=-1,x=null;const D=new ue,H=new ue;let k=null;const q=new Ut(0);let K=0,U=e.width,G=e.height,z=1,nt=null,st=null;const Mt=new ue(0,0,U,G),Pt=new ue(0,0,U,G);let Xt=!1;const $=new To;let tt=!1,pt=!1;const rt=new re,St=new re,Et=new P,mt=new ue,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ft=!1;function ne(){return I===null?z:1}let N=n;function Re(M,O){return e.getContext(M,O)}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${_o}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",dt,!1),e.addEventListener("webglcontextcreationerror",ut,!1),N===null){const O="webgl2";if(N=Re(O,M),N===null)throw Re(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Wt,Gt,Tt,se,At,w,v,V,j,Q,Z,bt,ht,_t,Yt,it,vt,Ct,Dt,xt,qt,Ht,ie,F;function ct(){Wt=new Cm(N),Wt.init(),Ht=new u0(N,Wt),Gt=new Em(N,Wt,t,Ht),Tt=new l0(N,Wt),Gt.reverseDepthBuffer&&p&&Tt.buffers.depth.setReversed(!0),se=new Dm(N),At=new Zg,w=new h0(N,Wt,Tt,At,Gt,Ht,se),v=new Tm(E),V=new Rm(E),j=new Bd(N),ie=new ym(N,j),Q=new Lm(N,j,se,ie),Z=new Im(N,Q,j,se),Dt=new Nm(N,Gt,w),it=new bm(At),bt=new Kg(E,v,V,Wt,Gt,ie,it),ht=new v0(E,At),_t=new Jg,Yt=new s0(Wt),Ct=new Mm(E,v,V,Tt,Z,d,c),vt=new o0(E,Z,Gt),F=new x0(N,se,Gt,Tt),xt=new Sm(N,Wt,se),qt=new Pm(N,Wt,se),se.programs=bt.programs,E.capabilities=Gt,E.extensions=Wt,E.properties=At,E.renderLists=_t,E.shadowMap=vt,E.state=Tt,E.info=se}ct();const Y=new g0(E,N);this.xr=Y,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const M=Wt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Wt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(M){M!==void 0&&(z=M,this.setSize(U,G,!1))},this.getSize=function(M){return M.set(U,G)},this.setSize=function(M,O,W=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=M,G=O,e.width=Math.floor(M*z),e.height=Math.floor(O*z),W===!0&&(e.style.width=M+"px",e.style.height=O+"px"),this.setViewport(0,0,M,O)},this.getDrawingBufferSize=function(M){return M.set(U*z,G*z).floor()},this.setDrawingBufferSize=function(M,O,W){U=M,G=O,z=W,e.width=Math.floor(M*W),e.height=Math.floor(O*W),this.setViewport(0,0,M,O)},this.getCurrentViewport=function(M){return M.copy(D)},this.getViewport=function(M){return M.copy(Mt)},this.setViewport=function(M,O,W,X){M.isVector4?Mt.set(M.x,M.y,M.z,M.w):Mt.set(M,O,W,X),Tt.viewport(D.copy(Mt).multiplyScalar(z).round())},this.getScissor=function(M){return M.copy(Pt)},this.setScissor=function(M,O,W,X){M.isVector4?Pt.set(M.x,M.y,M.z,M.w):Pt.set(M,O,W,X),Tt.scissor(H.copy(Pt).multiplyScalar(z).round())},this.getScissorTest=function(){return Xt},this.setScissorTest=function(M){Tt.setScissorTest(Xt=M)},this.setOpaqueSort=function(M){nt=M},this.setTransparentSort=function(M){st=M},this.getClearColor=function(M){return M.copy(Ct.getClearColor())},this.setClearColor=function(){Ct.setClearColor.apply(Ct,arguments)},this.getClearAlpha=function(){return Ct.getClearAlpha()},this.setClearAlpha=function(){Ct.setClearAlpha.apply(Ct,arguments)},this.clear=function(M=!0,O=!0,W=!0){let X=0;if(M){let B=!1;if(I!==null){const et=I.texture.format;B=et===Eo||et===So||et===yo}if(B){const et=I.texture.type,lt=et===Sn||et===Qn||et===ms||et===Bi||et===xo||et===Mo,gt=Ct.getClearColor(),yt=Ct.getClearAlpha(),Nt=gt.r,It=gt.g,wt=gt.b;lt?(g[0]=Nt,g[1]=It,g[2]=wt,g[3]=yt,N.clearBufferuiv(N.COLOR,0,g)):(_[0]=Nt,_[1]=It,_[2]=wt,_[3]=yt,N.clearBufferiv(N.COLOR,0,_))}else X|=N.COLOR_BUFFER_BIT}O&&(X|=N.DEPTH_BUFFER_BIT),W&&(X|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",dt,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),Ct.dispose(),_t.dispose(),Yt.dispose(),At.dispose(),v.dispose(),V.dispose(),Z.dispose(),ie.dispose(),F.dispose(),bt.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Do),Y.removeEventListener("sessionend",No),On.stop()};function J(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function dt(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const M=se.autoReset,O=vt.enabled,W=vt.autoUpdate,X=vt.needsUpdate,B=vt.type;ct(),se.autoReset=M,vt.enabled=O,vt.autoUpdate=W,vt.needsUpdate=X,vt.type=B}function ut(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ot(M){const O=M.target;O.removeEventListener("dispose",Ot),le(O)}function le(M){Me(M),At.remove(M)}function Me(M){const O=At.get(M).programs;O!==void 0&&(O.forEach(function(W){bt.releaseProgram(W)}),M.isShaderMaterial&&bt.releaseShaderCache(M))}this.renderBufferDirect=function(M,O,W,X,B,et){O===null&&(O=Lt);const lt=B.isMesh&&B.matrixWorld.determinant()<0,gt=nh(M,O,W,X,B);Tt.setMaterial(X,lt);let yt=W.index,Nt=1;if(X.wireframe===!0){if(yt=Q.getWireframeAttribute(W),yt===void 0)return;Nt=2}const It=W.drawRange,wt=W.attributes.position;let $t=It.start*Nt,jt=(It.start+It.count)*Nt;et!==null&&($t=Math.max($t,et.start*Nt),jt=Math.min(jt,(et.start+et.count)*Nt)),yt!==null?($t=Math.max($t,0),jt=Math.min(jt,yt.count)):wt!=null&&($t=Math.max($t,0),jt=Math.min(jt,wt.count));const de=jt-$t;if(de<0||de===1/0)return;ie.setup(B,X,gt,W,yt);let he,Kt=xt;if(yt!==null&&(he=j.get(yt),Kt=qt,Kt.setIndex(he)),B.isMesh)X.wireframe===!0?(Tt.setLineWidth(X.wireframeLinewidth*ne()),Kt.setMode(N.LINES)):Kt.setMode(N.TRIANGLES);else if(B.isLine){let Rt=X.linewidth;Rt===void 0&&(Rt=1),Tt.setLineWidth(Rt*ne()),B.isLineSegments?Kt.setMode(N.LINES):B.isLineLoop?Kt.setMode(N.LINE_LOOP):Kt.setMode(N.LINE_STRIP)}else B.isPoints?Kt.setMode(N.POINTS):B.isSprite&&Kt.setMode(N.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Kt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Wt.get("WEBGL_multi_draw"))Kt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Rt=B._multiDrawStarts,xe=B._multiDrawCounts,Jt=B._multiDrawCount,We=yt?j.get(yt).bytesPerElement:1,ii=At.get(X).currentProgram.getUniforms();for(let De=0;De<Jt;De++)ii.setValue(N,"_gl_DrawID",De),Kt.render(Rt[De]/We,xe[De])}else if(B.isInstancedMesh)Kt.renderInstances($t,de,B.count);else if(W.isInstancedBufferGeometry){const Rt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,xe=Math.min(W.instanceCount,Rt);Kt.renderInstances($t,de,xe)}else Kt.render($t,de)};function Qt(M,O,W){M.transparent===!0&&M.side===an&&M.forceSinglePass===!1?(M.side=Pe,M.needsUpdate=!0,Ss(M,O,W),M.side=Un,M.needsUpdate=!0,Ss(M,O,W),M.side=an):Ss(M,O,W)}this.compile=function(M,O,W=null){W===null&&(W=M),f=Yt.get(W),f.init(O),T.push(f),W.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),M!==W&&M.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),f.setupLights();const X=new Set;return M.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const et=B.material;if(et)if(Array.isArray(et))for(let lt=0;lt<et.length;lt++){const gt=et[lt];Qt(gt,W,B),X.add(gt)}else Qt(et,W,B),X.add(et)}),T.pop(),f=null,X},this.compileAsync=function(M,O,W=null){const X=this.compile(M,O,W);return new Promise(B=>{function et(){if(X.forEach(function(lt){At.get(lt).currentProgram.isReady()&&X.delete(lt)}),X.size===0){B(M);return}setTimeout(et,10)}Wt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Ge=null;function hn(M){Ge&&Ge(M)}function Do(){On.stop()}function No(){On.start()}const On=new Yl;On.setAnimationLoop(hn),typeof self<"u"&&On.setContext(self),this.setAnimationLoop=function(M){Ge=M,Y.setAnimationLoop(M),M===null?On.stop():On.start()},Y.addEventListener("sessionstart",Do),Y.addEventListener("sessionend",No),this.render=function(M,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(O),O=Y.getCamera()),M.isScene===!0&&M.onBeforeRender(E,M,O,I),f=Yt.get(M,T.length),f.init(O),T.push(f),St.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),$.setFromProjectionMatrix(St),pt=this.localClippingEnabled,tt=it.init(this.clippingPlanes,pt),m=_t.get(M,A.length),m.init(),A.push(m),Y.enabled===!0&&Y.isPresenting===!0){const et=E.xr.getDepthSensingMesh();et!==null&&Cr(et,O,-1/0,E.sortObjects)}Cr(M,O,0,E.sortObjects),m.finish(),E.sortObjects===!0&&m.sort(nt,st),Ft=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Ft&&Ct.addToRenderList(m,M),this.info.render.frame++,tt===!0&&it.beginShadows();const W=f.state.shadowsArray;vt.render(W,M,O),tt===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=m.opaque,B=m.transmissive;if(f.setupLights(),O.isArrayCamera){const et=O.cameras;if(B.length>0)for(let lt=0,gt=et.length;lt<gt;lt++){const yt=et[lt];Uo(X,B,M,yt)}Ft&&Ct.render(M);for(let lt=0,gt=et.length;lt<gt;lt++){const yt=et[lt];Io(m,M,yt,yt.viewport)}}else B.length>0&&Uo(X,B,M,O),Ft&&Ct.render(M),Io(m,M,O);I!==null&&(w.updateMultisampleRenderTarget(I),w.updateRenderTargetMipmap(I)),M.isScene===!0&&M.onAfterRender(E,M,O),ie.resetDefaultState(),S=-1,x=null,T.pop(),T.length>0?(f=T[T.length-1],tt===!0&&it.setGlobalState(E.clippingPlanes,f.state.camera)):f=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function Cr(M,O,W,X){if(M.visible===!1)return;if(M.layers.test(O.layers)){if(M.isGroup)W=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(O);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||$.intersectsSprite(M)){X&&mt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(St);const lt=Z.update(M),gt=M.material;gt.visible&&m.push(M,lt,gt,W,mt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||$.intersectsObject(M))){const lt=Z.update(M),gt=M.material;if(X&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),mt.copy(M.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),mt.copy(lt.boundingSphere.center)),mt.applyMatrix4(M.matrixWorld).applyMatrix4(St)),Array.isArray(gt)){const yt=lt.groups;for(let Nt=0,It=yt.length;Nt<It;Nt++){const wt=yt[Nt],$t=gt[wt.materialIndex];$t&&$t.visible&&m.push(M,lt,$t,W,mt.z,wt)}}else gt.visible&&m.push(M,lt,gt,W,mt.z,null)}}const et=M.children;for(let lt=0,gt=et.length;lt<gt;lt++)Cr(et[lt],O,W,X)}function Io(M,O,W,X){const B=M.opaque,et=M.transmissive,lt=M.transparent;f.setupLightsView(W),tt===!0&&it.setGlobalState(E.clippingPlanes,W),X&&Tt.viewport(D.copy(X)),B.length>0&&ys(B,O,W),et.length>0&&ys(et,O,W),lt.length>0&&ys(lt,O,W),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function Uo(M,O,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new ti(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")||Wt.has("EXT_color_buffer_float")?vs:Sn,minFilter:jn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));const et=f.state.transmissionRenderTarget[X.id],lt=X.viewport||D;et.setSize(lt.z,lt.w);const gt=E.getRenderTarget();E.setRenderTarget(et),E.getClearColor(q),K=E.getClearAlpha(),K<1&&E.setClearColor(16777215,.5),E.clear(),Ft&&Ct.render(W);const yt=E.toneMapping;E.toneMapping=Dn;const Nt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),tt===!0&&it.setGlobalState(E.clippingPlanes,X),ys(M,W,X),w.updateMultisampleRenderTarget(et),w.updateRenderTargetMipmap(et),Wt.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let wt=0,$t=O.length;wt<$t;wt++){const jt=O[wt],de=jt.object,he=jt.geometry,Kt=jt.material,Rt=jt.group;if(Kt.side===an&&de.layers.test(X.layers)){const xe=Kt.side;Kt.side=Pe,Kt.needsUpdate=!0,Fo(de,W,X,he,Kt,Rt),Kt.side=xe,Kt.needsUpdate=!0,It=!0}}It===!0&&(w.updateMultisampleRenderTarget(et),w.updateRenderTargetMipmap(et))}E.setRenderTarget(gt),E.setClearColor(q,K),Nt!==void 0&&(X.viewport=Nt),E.toneMapping=yt}function ys(M,O,W){const X=O.isScene===!0?O.overrideMaterial:null;for(let B=0,et=M.length;B<et;B++){const lt=M[B],gt=lt.object,yt=lt.geometry,Nt=X===null?lt.material:X,It=lt.group;gt.layers.test(W.layers)&&Fo(gt,O,W,yt,Nt,It)}}function Fo(M,O,W,X,B,et){M.onBeforeRender(E,O,W,X,B,et),M.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),B.onBeforeRender(E,O,W,X,M,et),B.transparent===!0&&B.side===an&&B.forceSinglePass===!1?(B.side=Pe,B.needsUpdate=!0,E.renderBufferDirect(W,O,X,B,M,et),B.side=Un,B.needsUpdate=!0,E.renderBufferDirect(W,O,X,B,M,et),B.side=an):E.renderBufferDirect(W,O,X,B,M,et),M.onAfterRender(E,O,W,X,B,et)}function Ss(M,O,W){O.isScene!==!0&&(O=Lt);const X=At.get(M),B=f.state.lights,et=f.state.shadowsArray,lt=B.state.version,gt=bt.getParameters(M,B.state,et,O,W),yt=bt.getProgramCacheKey(gt);let Nt=X.programs;X.environment=M.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(M.isMeshStandardMaterial?V:v).get(M.envMap||X.environment),X.envMapRotation=X.environment!==null&&M.envMap===null?O.environmentRotation:M.envMapRotation,Nt===void 0&&(M.addEventListener("dispose",Ot),Nt=new Map,X.programs=Nt);let It=Nt.get(yt);if(It!==void 0){if(X.currentProgram===It&&X.lightsStateVersion===lt)return Bo(M,gt),It}else gt.uniforms=bt.getUniforms(M),M.onBeforeCompile(gt,E),It=bt.acquireProgram(gt,yt),Nt.set(yt,It),X.uniforms=gt.uniforms;const wt=X.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(wt.clippingPlanes=it.uniform),Bo(M,gt),X.needsLights=sh(M),X.lightsStateVersion=lt,X.needsLights&&(wt.ambientLightColor.value=B.state.ambient,wt.lightProbe.value=B.state.probe,wt.directionalLights.value=B.state.directional,wt.directionalLightShadows.value=B.state.directionalShadow,wt.spotLights.value=B.state.spot,wt.spotLightShadows.value=B.state.spotShadow,wt.rectAreaLights.value=B.state.rectArea,wt.ltc_1.value=B.state.rectAreaLTC1,wt.ltc_2.value=B.state.rectAreaLTC2,wt.pointLights.value=B.state.point,wt.pointLightShadows.value=B.state.pointShadow,wt.hemisphereLights.value=B.state.hemi,wt.directionalShadowMap.value=B.state.directionalShadowMap,wt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,wt.spotShadowMap.value=B.state.spotShadowMap,wt.spotLightMatrix.value=B.state.spotLightMatrix,wt.spotLightMap.value=B.state.spotLightMap,wt.pointShadowMap.value=B.state.pointShadowMap,wt.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=It,X.uniformsList=null,It}function Oo(M){if(M.uniformsList===null){const O=M.currentProgram.getUniforms();M.uniformsList=lr.seqWithValue(O.seq,M.uniforms)}return M.uniformsList}function Bo(M,O){const W=At.get(M);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function nh(M,O,W,X,B){O.isScene!==!0&&(O=Lt),w.resetTextureUnits();const et=O.fog,lt=X.isMeshStandardMaterial?O.environment:null,gt=I===null?E.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Hi,yt=(X.isMeshStandardMaterial?V:v).get(X.envMap||lt),Nt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,It=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),wt=!!W.morphAttributes.position,$t=!!W.morphAttributes.normal,jt=!!W.morphAttributes.color;let de=Dn;X.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(de=E.toneMapping);const he=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Kt=he!==void 0?he.length:0,Rt=At.get(X),xe=f.state.lights;if(tt===!0&&(pt===!0||M!==x)){const be=M===x&&X.id===S;it.setState(X,M,be)}let Jt=!1;X.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==xe.state.version||Rt.outputColorSpace!==gt||B.isBatchedMesh&&Rt.batching===!1||!B.isBatchedMesh&&Rt.batching===!0||B.isBatchedMesh&&Rt.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Rt.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Rt.instancing===!1||!B.isInstancedMesh&&Rt.instancing===!0||B.isSkinnedMesh&&Rt.skinning===!1||!B.isSkinnedMesh&&Rt.skinning===!0||B.isInstancedMesh&&Rt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Rt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Rt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Rt.instancingMorph===!1&&B.morphTexture!==null||Rt.envMap!==yt||X.fog===!0&&Rt.fog!==et||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==it.numPlanes||Rt.numIntersection!==it.numIntersection)||Rt.vertexAlphas!==Nt||Rt.vertexTangents!==It||Rt.morphTargets!==wt||Rt.morphNormals!==$t||Rt.morphColors!==jt||Rt.toneMapping!==de||Rt.morphTargetsCount!==Kt)&&(Jt=!0):(Jt=!0,Rt.__version=X.version);let We=Rt.currentProgram;Jt===!0&&(We=Ss(X,O,B));let ii=!1,De=!1,qi=!1;const ae=We.getUniforms(),Fe=Rt.uniforms;if(Tt.useProgram(We.program)&&(ii=!0,De=!0,qi=!0),X.id!==S&&(S=X.id,De=!0),ii||x!==M){Tt.buffers.depth.getReversed()?(rt.copy(M.projectionMatrix),zu(rt),Hu(rt),ae.setValue(N,"projectionMatrix",rt)):ae.setValue(N,"projectionMatrix",M.projectionMatrix),ae.setValue(N,"viewMatrix",M.matrixWorldInverse);const Ce=ae.map.cameraPosition;Ce!==void 0&&Ce.setValue(N,Et.setFromMatrixPosition(M.matrixWorld)),Gt.logarithmicDepthBuffer&&ae.setValue(N,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ae.setValue(N,"isOrthographic",M.isOrthographicCamera===!0),x!==M&&(x=M,De=!0,qi=!0)}if(B.isSkinnedMesh){ae.setOptional(N,B,"bindMatrix"),ae.setOptional(N,B,"bindMatrixInverse");const be=B.skeleton;be&&(be.boneTexture===null&&be.computeBoneTexture(),ae.setValue(N,"boneTexture",be.boneTexture,w))}B.isBatchedMesh&&(ae.setOptional(N,B,"batchingTexture"),ae.setValue(N,"batchingTexture",B._matricesTexture,w),ae.setOptional(N,B,"batchingIdTexture"),ae.setValue(N,"batchingIdTexture",B._indirectTexture,w),ae.setOptional(N,B,"batchingColorTexture"),B._colorsTexture!==null&&ae.setValue(N,"batchingColorTexture",B._colorsTexture,w));const Oe=W.morphAttributes;if((Oe.position!==void 0||Oe.normal!==void 0||Oe.color!==void 0)&&Dt.update(B,W,We),(De||Rt.receiveShadow!==B.receiveShadow)&&(Rt.receiveShadow=B.receiveShadow,ae.setValue(N,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Fe.envMap.value=yt,Fe.flipEnvMap.value=yt.isCubeTexture&&yt.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&O.environment!==null&&(Fe.envMapIntensity.value=O.environmentIntensity),De&&(ae.setValue(N,"toneMappingExposure",E.toneMappingExposure),Rt.needsLights&&ih(Fe,qi),et&&X.fog===!0&&ht.refreshFogUniforms(Fe,et),ht.refreshMaterialUniforms(Fe,X,z,G,f.state.transmissionRenderTarget[M.id]),lr.upload(N,Oo(Rt),Fe,w)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(lr.upload(N,Oo(Rt),Fe,w),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ae.setValue(N,"center",B.center),ae.setValue(N,"modelViewMatrix",B.modelViewMatrix),ae.setValue(N,"normalMatrix",B.normalMatrix),ae.setValue(N,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const be=X.uniformsGroups;for(let Ce=0,Lr=be.length;Ce<Lr;Ce++){const Bn=be[Ce];F.update(Bn,We),F.bind(Bn,We)}}return We}function ih(M,O){M.ambientLightColor.needsUpdate=O,M.lightProbe.needsUpdate=O,M.directionalLights.needsUpdate=O,M.directionalLightShadows.needsUpdate=O,M.pointLights.needsUpdate=O,M.pointLightShadows.needsUpdate=O,M.spotLights.needsUpdate=O,M.spotLightShadows.needsUpdate=O,M.rectAreaLights.needsUpdate=O,M.hemisphereLights.needsUpdate=O}function sh(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(M,O,W){At.get(M.texture).__webglTexture=O,At.get(M.depthTexture).__webglTexture=W;const X=At.get(M);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,O){const W=At.get(M);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(M,O=0,W=0){I=M,R=O,L=W;let X=!0,B=null,et=!1,lt=!1;if(M){const yt=At.get(M);if(yt.__useDefaultFramebuffer!==void 0)Tt.bindFramebuffer(N.FRAMEBUFFER,null),X=!1;else if(yt.__webglFramebuffer===void 0)w.setupRenderTarget(M);else if(yt.__hasExternalTextures)w.rebindTextures(M,At.get(M.texture).__webglTexture,At.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const wt=M.depthTexture;if(yt.__boundDepthTexture!==wt){if(wt!==null&&At.has(wt)&&(M.width!==wt.image.width||M.height!==wt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(M)}}const Nt=M.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(lt=!0);const It=At.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(It[O])?B=It[O][W]:B=It[O],et=!0):M.samples>0&&w.useMultisampledRTT(M)===!1?B=At.get(M).__webglMultisampledFramebuffer:Array.isArray(It)?B=It[W]:B=It,D.copy(M.viewport),H.copy(M.scissor),k=M.scissorTest}else D.copy(Mt).multiplyScalar(z).floor(),H.copy(Pt).multiplyScalar(z).floor(),k=Xt;if(Tt.bindFramebuffer(N.FRAMEBUFFER,B)&&X&&Tt.drawBuffers(M,B),Tt.viewport(D),Tt.scissor(H),Tt.setScissorTest(k),et){const yt=At.get(M.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+O,yt.__webglTexture,W)}else if(lt){const yt=At.get(M.texture),Nt=O||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,yt.__webglTexture,W||0,Nt)}S=-1},this.readRenderTargetPixels=function(M,O,W,X,B,et,lt){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=At.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&lt!==void 0&&(gt=gt[lt]),gt){Tt.bindFramebuffer(N.FRAMEBUFFER,gt);try{const yt=M.texture,Nt=yt.format,It=yt.type;if(!Gt.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Gt.textureTypeReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=M.width-X&&W>=0&&W<=M.height-B&&N.readPixels(O,W,X,B,Ht.convert(Nt),Ht.convert(It),et)}finally{const yt=I!==null?At.get(I).__webglFramebuffer:null;Tt.bindFramebuffer(N.FRAMEBUFFER,yt)}}},this.readRenderTargetPixelsAsync=async function(M,O,W,X,B,et,lt){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=At.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&lt!==void 0&&(gt=gt[lt]),gt){const yt=M.texture,Nt=yt.format,It=yt.type;if(!Gt.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Gt.textureTypeReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=M.width-X&&W>=0&&W<=M.height-B){Tt.bindFramebuffer(N.FRAMEBUFFER,gt);const wt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,wt),N.bufferData(N.PIXEL_PACK_BUFFER,et.byteLength,N.STREAM_READ),N.readPixels(O,W,X,B,Ht.convert(Nt),Ht.convert(It),0);const $t=I!==null?At.get(I).__webglFramebuffer:null;Tt.bindFramebuffer(N.FRAMEBUFFER,$t);const jt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Bu(N,jt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,wt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,et),N.deleteBuffer(wt),N.deleteSync(jt),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,O=null,W=0){M.isTexture!==!0&&(bi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,M=arguments[1]);const X=Math.pow(2,-W),B=Math.floor(M.image.width*X),et=Math.floor(M.image.height*X),lt=O!==null?O.x:0,gt=O!==null?O.y:0;w.setTexture2D(M,0),N.copyTexSubImage2D(N.TEXTURE_2D,W,0,0,lt,gt,B,et),Tt.unbindTexture()};const rh=N.createFramebuffer(),ah=N.createFramebuffer();this.copyTextureToTexture=function(M,O,W=null,X=null,B=0,et=null){M.isTexture!==!0&&(bi("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,M=arguments[1],O=arguments[2],et=arguments[3]||0,W=null),et===null&&(B!==0?(bi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),et=B,B=0):et=0);let lt,gt,yt,Nt,It,wt,$t,jt,de;const he=M.isCompressedTexture?M.mipmaps[et]:M.image;if(W!==null)lt=W.max.x-W.min.x,gt=W.max.y-W.min.y,yt=W.isBox3?W.max.z-W.min.z:1,Nt=W.min.x,It=W.min.y,wt=W.isBox3?W.min.z:0;else{const Oe=Math.pow(2,-B);lt=Math.floor(he.width*Oe),gt=Math.floor(he.height*Oe),M.isDataArrayTexture?yt=he.depth:M.isData3DTexture?yt=Math.floor(he.depth*Oe):yt=1,Nt=0,It=0,wt=0}X!==null?($t=X.x,jt=X.y,de=X.z):($t=0,jt=0,de=0);const Kt=Ht.convert(O.format),Rt=Ht.convert(O.type);let xe;O.isData3DTexture?(w.setTexture3D(O,0),xe=N.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(w.setTexture2DArray(O,0),xe=N.TEXTURE_2D_ARRAY):(w.setTexture2D(O,0),xe=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,O.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,O.unpackAlignment);const Jt=N.getParameter(N.UNPACK_ROW_LENGTH),We=N.getParameter(N.UNPACK_IMAGE_HEIGHT),ii=N.getParameter(N.UNPACK_SKIP_PIXELS),De=N.getParameter(N.UNPACK_SKIP_ROWS),qi=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,he.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,he.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Nt),N.pixelStorei(N.UNPACK_SKIP_ROWS,It),N.pixelStorei(N.UNPACK_SKIP_IMAGES,wt);const ae=M.isDataArrayTexture||M.isData3DTexture,Fe=O.isDataArrayTexture||O.isData3DTexture;if(M.isDepthTexture){const Oe=At.get(M),be=At.get(O),Ce=At.get(Oe.__renderTarget),Lr=At.get(be.__renderTarget);Tt.bindFramebuffer(N.READ_FRAMEBUFFER,Ce.__webglFramebuffer),Tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,Lr.__webglFramebuffer);for(let Bn=0;Bn<yt;Bn++)ae&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,At.get(M).__webglTexture,B,wt+Bn),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,At.get(O).__webglTexture,et,de+Bn)),N.blitFramebuffer(Nt,It,lt,gt,$t,jt,lt,gt,N.DEPTH_BUFFER_BIT,N.NEAREST);Tt.bindFramebuffer(N.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(B!==0||M.isRenderTargetTexture||At.has(M)){const Oe=At.get(M),be=At.get(O);Tt.bindFramebuffer(N.READ_FRAMEBUFFER,rh),Tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,ah);for(let Ce=0;Ce<yt;Ce++)ae?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Oe.__webglTexture,B,wt+Ce):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Oe.__webglTexture,B),Fe?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,be.__webglTexture,et,de+Ce):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,be.__webglTexture,et),B!==0?N.blitFramebuffer(Nt,It,lt,gt,$t,jt,lt,gt,N.COLOR_BUFFER_BIT,N.NEAREST):Fe?N.copyTexSubImage3D(xe,et,$t,jt,de+Ce,Nt,It,lt,gt):N.copyTexSubImage2D(xe,et,$t,jt,Nt,It,lt,gt);Tt.bindFramebuffer(N.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Fe?M.isDataTexture||M.isData3DTexture?N.texSubImage3D(xe,et,$t,jt,de,lt,gt,yt,Kt,Rt,he.data):O.isCompressedArrayTexture?N.compressedTexSubImage3D(xe,et,$t,jt,de,lt,gt,yt,Kt,he.data):N.texSubImage3D(xe,et,$t,jt,de,lt,gt,yt,Kt,Rt,he):M.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,et,$t,jt,lt,gt,Kt,Rt,he.data):M.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,et,$t,jt,he.width,he.height,Kt,he.data):N.texSubImage2D(N.TEXTURE_2D,et,$t,jt,lt,gt,Kt,Rt,he);N.pixelStorei(N.UNPACK_ROW_LENGTH,Jt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,We),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ii),N.pixelStorei(N.UNPACK_SKIP_ROWS,De),N.pixelStorei(N.UNPACK_SKIP_IMAGES,qi),et===0&&O.generateMipmaps&&N.generateMipmap(xe),Tt.unbindTexture()},this.copyTextureToTexture3D=function(M,O,W=null,X=null,B=0){return M.isTexture!==!0&&(bi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,M=arguments[2],O=arguments[3],B=arguments[4]||0),bi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,O,W,X,B)},this.initRenderTarget=function(M){At.get(M).__webglFramebuffer===void 0&&w.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?w.setTextureCube(M,0):M.isData3DTexture?w.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?w.setTexture2DArray(M,0):w.setTexture2D(M,0),Tt.unbindTexture()},this.resetState=function(){R=0,L=0,I=null,Tt.reset(),ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}}const M0={[b.LeftForeArm]:He.degToRad(85),[b.RightForeArm]:He.degToRad(85),[b.LeftUpLeg]:He.degToRad(45),[b.RightUpLeg]:He.degToRad(45),[b.LeftArm]:He.degToRad(60),[b.RightArm]:He.degToRad(60)},y0={[b.LeftArm]:[1,0,0],[b.LeftForeArm]:[1,0,0],[b.LeftHand]:[1,0,0],[b.RightArm]:[-1,0,0],[b.RightForeArm]:[-1,0,0],[b.RightHand]:[-1,0,0],[b.LeftUpLeg]:[0,-1,0],[b.LeftLeg]:[0,-1,0],[b.LeftFoot]:[0,-1,0],[b.RightUpLeg]:[0,-1,0],[b.RightLeg]:[0,-1,0],[b.RightFoot]:[0,-1,0],[b.Spine]:[0,1,0],[b.Spine1]:[0,1,0],[b.Neck]:[0,1,0]},tl={[b.Hips]:.075,[b.Spine]:.07,[b.Spine1]:.085,[b.Neck]:.045,[b.Head]:.09,[b.LeftShoulder]:.05,[b.LeftArm]:.045,[b.LeftForeArm]:.038,[b.LeftHand]:.03,[b.RightShoulder]:.05,[b.RightArm]:.045,[b.RightForeArm]:.038,[b.RightHand]:.03,[b.LeftUpLeg]:.06,[b.LeftLeg]:.05,[b.LeftFoot]:.035,[b.RightUpLeg]:.06,[b.RightLeg]:.05,[b.RightFoot]:.035};function Er(i,t=3900150){const e=fo(i),n=gh(i),s=new Ve,r=[],a=[],o=new Ti({color:t,roughness:.55,metalness:.08,transparent:!0});for(let u=0;u<zt;u++){const p=new ud;p.name=In[u],p.position.fromArray(e[u]),r.push(p)}for(let u=0;u<zt;u++){const p=hr[u];p>=0&&r[p].add(r[u])}s.add(r[b.Hips]);const c=new _s(1,16,12);for(let u=0;u<zt;u++){const p=hr[u];if(p<0)continue;const d=new P(...e[p]),g=new P(...e[u]),_=d.distanceTo(g);if(_<1e-4)continue;const m=tl[u]??.04,f=new Sr(m,Math.max(.01,_-m*2),6,12),A=new ce(f,o);A.position.copy(d).add(g).multiplyScalar(.5);const T=g.clone().sub(d).normalize();A.quaternion.setFromUnitVectors(new P(0,1,0),T),r[p].add(A),A.position.copy(g.clone().sub(d).multiplyScalar(.5)),a.push(A)}for(let u=0;u<zt;u++){const p=tl[u]??.04,d=new ce(c,o);if(d.scale.setScalar(p*1.15),r[u].add(d),a.push(d),n[u]){const g=u===b.Head?[0,1,0]:u===b.LeftHand||u===b.RightHand?u===b.LeftHand?[1,0,0]:[-1,0,0]:[0,0,1],_=new Sr(p*.9,Math.max(.02,n[u]-p),6,12),m=new ce(_,o);m.position.set(g[0]*n[u]*.5,g[1]*n[u]*.5,g[2]*n[u]*.5),m.quaternion.setFromUnitVectors(new P(0,1,0),new P(...g).normalize()),r[u].add(m),a.push(m)}}const h=new Wi,l=(u,p)=>{const d=M0[u],g=y0[u];if(!d||!g)return p;const{twist:_,swing:m}=Mh(p,g),f=2*Math.atan2(Math.hypot(_[0],_[1],_[2]),_[3]);if(f<=d)return p;const A=f>0?d:-d,T=[g[0],g[1],g[2]],E=A/2,C=Math.sin(E),R=[T[0]*C,T[1]*C,T[2]*C,Math.cos(E)];return[m[3]*R[0]+m[0]*R[3]+m[1]*R[2]-m[2]*R[1],m[3]*R[1]-m[0]*R[2]+m[1]*R[3]+m[2]*R[0],m[3]*R[2]+m[0]*R[1]-m[1]*R[0]+m[2]*R[3],m[3]*R[3]-m[0]*R[0]-m[1]*R[1]-m[2]*R[2]]};return{root:s,bones:r,applyFrame(u,p){s.position.set(u[0],u[1],u[2]);for(let d=0;d<zt;d++){const g=l(d,p[d]);h.set(g[0],g[1],g[2],g[3]),r[d].quaternion.copy(h)}s.updateMatrixWorld(!0)},setOpacity(u){o.opacity=u,o.depthWrite=u>=.95},setColor(u){o.color.setHex(u)},dispose(){a.forEach(u=>{u.geometry.dispose()}),c.dispose(),o.dispose()}}}function S0(i,t,e=0){const n=new Ve,s=oh.spring,r=new Vi(sn.poolWidth,sn.poolLength,1,1),a=new Ld({color:1937366,transparent:!0,opacity:.55,roughness:.15,metalness:.1,side:an}),o=new ce(r,a);o.rotation.x=-Math.PI/2,o.position.set(0,e,2),n.add(o);const c=new ce(new Vi(sn.poolWidth,sn.poolLength),new Ti({color:932434,roughness:.9}));c.rotation.x=-Math.PI/2,c.position.set(0,e-sn.poolDepth,2),n.add(c);const h=new Ve,l=new Ti({color:14251782,roughness:.6}),u=new ce(new Nn(s.width,s.thickness,s.length),l);u.position.z=s.length/2,h.add(u);const p=new Ti({color:4937059,roughness:.7}),d=new ce(new Nn(s.width*1.4,i,s.width*1.4),p);d.position.set(0,-i/2-s.thickness/2,-.3),h.add(d);const g=i;h.position.set(0,g-s.thickness/2,0),n.add(h);const _=new Ve,m=new ce(new Nn(1.2,.9,.6),new Ti({color:1120295,roughness:.8}));m.position.y=.45,_.add(m),_.position.set(sn.judgeDistance,sn.judgeHeight,s.length+1.2),n.add(_);const f=new Fd(20,20,4674921,1976635);return f.position.y=e-sn.poolDepth+.02,n.add(f),{group:n,water:o,board:h,boardTopY:g,setBoardFlex(A){const T=Math.atan2(A,s.length);h.rotation.x=-T},dispose(){n.traverse(A=>{if(A instanceof ce){A.geometry.dispose();const T=A.material;Array.isArray(T)?T.forEach(E=>E.dispose()):T.dispose()}})}}}const nr={takeoff:2278750,apex:15381256,open:16347926,entry:15680580};class E0{renderer;scene=new Fl;camera;figure;venue;clip;analysis;settings;frame=0;playing=!1;speed=1;accumulator=0;lastTime=0;cameraMode="free";raf=0;disposed=!1;onFrame;trailLine;ghostGroup=new Ve;markerGroup=new Ve;annotationGroup=new Ve;comMarker;arrowHelpers=[];bodyHeight;bodyArmSpan;orbit={azim:.6,elev:.25,dist:5.5};dragging=!1;lastPointer={x:0,y:0};constructor(t){this.clip=t.clip,this.analysis=t.analysis,this.settings=t.settings,this.onFrame=t.onFrame,this.bodyHeight=t.athlete.heightCm/100,this.bodyArmSpan=t.athlete.armSpanCm/100,this.renderer=new Jl({canvas:t.canvas,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.scene.background=new Ut(725536),this.camera=new Ue(45,1,.05,100),this.scene.add(new ql(16777215,.55));const e=new oo(16777215,1.1);e.position.set(4,10,6),e.castShadow=!0,this.scene.add(e),this.scene.add(new oo(9684477,.35)),this.venue=S0(3,"spring",this.settings.waterLevelY),this.scene.add(this.venue.group),this.figure=Er({height:t.athlete.heightCm/100,armSpan:t.athlete.armSpanCm/100,weight:t.athlete.weightKg}),this.scene.add(this.figure.root),this.scene.add(this.ghostGroup),this.scene.add(this.markerGroup),this.scene.add(this.annotationGroup),this.comMarker=new ce(new _s(.045,12,8),new Di({color:16638023})),this.scene.add(this.comMarker),this.buildTrail(),this.buildGhosts(),this.buildKeyframeMarkers(),this.buildEntrySlice(),this.bindPointer(),this.resize(),this.seek(0),this.loop=this.loop.bind(this),this.raf=requestAnimationFrame(this.loop)}buildTrail(){const t=this.analysis.metrics.map(s=>new P(...s.com)),e=new ve().setFromPoints(t),n=new Tc({color:3718648,dashSize:.12,gapSize:.06,transparent:!0,opacity:.85});this.trailLine=new hs(e,n),this.trailLine.computeLineDistances(),this.scene.add(this.trailLine)}buildGhosts(){const t=this.settings.comTrailStep,e=this.analysis.maxAngularVelocity||1;for(let n=this.clip.takeoffFrame;n<this.clip.entryFrame;n+=t){const s=this.analysis.metrics[n],r=Er({height:this.bodyHeight,armSpan:this.bodyArmSpan},this.ghostColor(s.angularVelocity/e));r.setOpacity(this.settings.ghostAlpha),r.applyFrame(this.readRootPos(n),this.readLocalQuats(n)),this.ghostGroup.add(r.root)}}ghostColor(t){const e=new Ut(9684477),n=new Ut(12592851);return e.lerp(n,He.clamp(t,0,1)).getHex()}buildKeyframeMarkers(){const t=[[this.clip.takeoffFrame,"离板",nr.takeoff],[this.clip.apexFrame,"最高点",nr.apex],[this.clip.openFrame,"打开",nr.open],[this.clip.entryFrame,"入水",nr.entry]];for(const[e,n,s]of t){if(e<0)continue;const r=this.analysis.metrics[e]?.com;if(!r)continue;const a=new ce(new Lo(.16,.012,8,32),new Di({color:s}));a.rotation.x=Math.PI/2,a.position.set(r[0],r[1],r[2]),this.markerGroup.add(a);const o=this.makeTextSprite(n,s);o.position.set(r[0],r[1]+.28,r[2]),this.markerGroup.add(o)}}makeTextSprite(t,e){const n=document.createElement("canvas");n.width=128,n.height=48;const s=n.getContext("2d");s.fillStyle=`#${new Ut(e).getHexString()}`,s.font="bold 28px system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(t,64,24);const r=new md(n),a=new Ol({map:r,transparent:!0,depthTest:!1}),o=new hd(a);return o.scale.set(.55,.21,1),o}buildEntrySlice(){const t=this.clip.entryFrame;if(t<0)return;const e=os(this.clip,t,{height:this.bodyHeight,armSpan:this.bodyArmSpan}),n=this.settings.waterLevelY,s=new Ve,r=2,a=[new P(-r/2,n+.01,-r/2),new P(r/2,n+.01,-r/2),new P(r/2,n+.01,r/2),new P(-r/2,n+.01,r/2),new P(-r/2,n+.01,-r/2)];s.add(new hs(new ve().setFromPoints(a),new Ms({color:8246268,transparent:!0,opacity:.7})));const o=e.positions[b.Hips],c=new P(o[0],n+.02,o[2]),h=new aa(new P(0,-1,0),c,1.6,9741240,.14,.08);s.add(h);const l=new P(...this.analysis.metrics[t].pelvisUp),u=l.y>0?l.clone().negate():l.clone(),p=new aa(u.normalize(),c,1.6,15680580,.16,.09);s.add(p);const d=[e.positions[b.LeftHand],e.positions[b.RightHand]],g=d[0][1]<d[1][1]?d[0]:d[1],_=new ce(new _s(.07,16,12),new Di({color:16347926}));_.position.set(g[0],n+.03,g[2]),s.add(_);const m=new hs(new ve().setFromPoints([new P(o[0],n+.025,o[2]),new P(g[0],n+.025,g[2])]),new Tc({color:16347926,dashSize:.08,gapSize:.05}));m.computeLineDistances(),s.add(m);const f=this.makeTextSprite(`入水角 ${this.analysis.entryAngleDeg.toFixed(1)}°`,15680580);f.position.set(o[0],n+.35,o[2]),s.add(f),this.markerGroup.add(s)}setAnnotations(t){this.annotationGroup.clear(),this.arrowHelpers=[];const e={height:this.bodyHeight,armSpan:this.bodyArmSpan};for(const n of t){if(n.frame!==this.frame)continue;const s=os(this.clip,n.frame,e),r=new P(...s.positions[n.anchorJoint]);if(n.kind==="arrow"){const a=new P(...n.offset??[0,1,0]),o=a.length()||.5,c=new aa(a.clone().normalize(),r,o,n.color,.12,.07);this.annotationGroup.add(c),this.arrowHelpers.push(c)}else{const a=this.makeTextSprite(n.text??"",new Ut(n.color).getHex());a.position.copy(r).add(new P(0,.25,0)),this.annotationGroup.add(a)}}}readRootPos(t){const e=t*3;return[this.clip.rootPositions[e],this.clip.rootPositions[e+1],this.clip.rootPositions[e+2]]}readLocalQuats(t){const e=[];for(let n=0;n<zt;n++){const s=(t*zt+n)*4;e.push([this.clip.localRotations[s],this.clip.localRotations[s+1],this.clip.localRotations[s+2],this.clip.localRotations[s+3]])}return e}play(){this.playing=!0}pause(){this.playing=!1}togglePlay(){this.playing=!this.playing}isPlaying(){return this.playing}setSpeed(t){this.speed=t}getFrame(){return this.frame}seek(t){this.frame=He.clamp(Math.round(t),0,this.clip.frameCount-1);const e=this.frame;this.figure.applyFrame(this.readRootPos(e),this.readLocalQuats(e));const n=this.analysis.metrics[e]?.com;n&&this.comMarker.position.set(n[0],n[1],n[2]),this.updateBoardFlex(e),this.updateCamera(),this.renderer.render(this.scene,this.camera),this.onFrame?.(e)}updateBoardFlex(t){const e=this.clip.takeoffFrame;if(t>e||e<=0){this.venue.setBoardFlex(0);return}const n=t/e,s=.18*Math.sin(Math.PI*n);this.venue.setBoardFlex(s)}loop(t){if(this.disposed)return;this.raf=requestAnimationFrame(this.loop),this.lastTime||(this.lastTime=t);const e=Math.min(.05,(t-this.lastTime)/1e3);if(this.lastTime=t,this.playing){this.accumulator+=e*this.speed;const n=1/this.clip.sampleRate;let s=!1;for(;this.accumulator>=n;){if(this.accumulator-=n,this.frame>=this.clip.frameCount-1){this.playing=!1;break}this.frame++,s=!0}s&&this.seek(this.frame)}this.renderer.render(this.scene,this.camera)}setCameraMode(t){this.cameraMode=t,this.updateCamera()}getCameraMode(){return this.cameraMode}updateCamera(){const t=this.analysis.metrics[this.frame]?.com,e=t?new P(...t):new P;if(this.cameraMode==="follow"){const n=this.orbit.dist;this.camera.position.set(e.x+n*Math.cos(this.orbit.elev)*Math.sin(this.orbit.azim),e.y+n*Math.sin(this.orbit.elev),e.z+n*Math.cos(this.orbit.elev)*Math.cos(this.orbit.azim)),this.camera.lookAt(e)}else if(this.cameraMode==="judge")this.camera.position.set(sn.judgeDistance,sn.judgeHeight,(this.clip.takeoffFrame>=0?4.8:5)+1.2),this.camera.lookAt(e.x*.3,e.y,e.z*.5);else if(this.cameraMode==="underwater")this.camera.position.set(e.x,this.settings.waterLevelY-2.2,e.z+1.2),this.camera.lookAt(e);else{const n=this.orbit.dist;this.camera.position.set(n*Math.cos(this.orbit.elev)*Math.sin(this.orbit.azim),3+n*Math.sin(this.orbit.elev),n*Math.cos(this.orbit.elev)*Math.cos(this.orbit.azim)),this.camera.lookAt(0,3,1)}}bindPointer(){const t=this.renderer.domElement;t.addEventListener("pointerdown",e=>{this.dragging=!0,this.lastPointer={x:e.clientX,y:e.clientY}}),window.addEventListener("pointerup",()=>{this.dragging=!1}),window.addEventListener("pointermove",e=>{if(!this.dragging)return;const n=e.clientX-this.lastPointer.x,s=e.clientY-this.lastPointer.y;this.lastPointer={x:e.clientX,y:e.clientY},this.orbit.azim-=n*.006,this.orbit.elev=He.clamp(this.orbit.elev+s*.006,-1.2,1.2),this.updateCamera()}),t.addEventListener("wheel",e=>{e.preventDefault(),this.orbit.dist=He.clamp(this.orbit.dist+e.deltaY*.004,1.5,18),this.updateCamera()},{passive:!1})}resize(){const e=this.renderer.domElement.parentElement;if(!e)return;const n=e.clientWidth,s=e.clientHeight;this.renderer.setSize(n,s,!1),this.camera.aspect=n/Math.max(1,s),this.camera.updateProjectionMatrix()}screenshot(){return this.renderer.render(this.scene,this.camera),this.renderer.domElement.toDataURL("image/png")}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.figure.dispose(),this.venue.dispose(),this.ghostGroup.traverse(t=>{t instanceof ce&&t.geometry.dispose()}),this.renderer.dispose()}}const b0={takeoffFrame:{color:"#22c55e",label:"离板"},apexFrame:{color:"#eab308",label:"最高点"},openFrame:{color:"#f97316",label:"打开"},entryFrame:{color:"#ef4444",label:"入水"}};function el(i,t,e){const n=i.sampleRate,s=i.frameCount,r=go(i),a=y("div",{className:"timeline-track"});for(const u of r)a.appendChild(y("div",{className:"timeline-defect",title:u.label,style:`left:${u.start/s*100}%;width:${(u.end-u.start+1)/s*100}%`}));for(const[u,p]of Object.entries(b0)){const d=i[u];if(d<0)continue;const g=u==="takeoffFrame"||u==="entryFrame",_=y("div",{className:"timeline-event",style:`left:${d/s*100}%;background:${p.color};${g?"cursor:ew-resize":""}`,title:`${p.label} 第${d}帧 (${(d/n).toFixed(2)}s)${g?" 可拖动修正":""}`},[y("span",{className:"ev-label",style:`color:${p.color}`},p.label)]);g&&e.onMoveEvent&&_.addEventListener("pointerdown",m=>{m.stopPropagation();const f=T=>{const E=a.getBoundingClientRect(),C=Math.max(0,Math.min(1,(T.clientX-E.left)/E.width)),R=Math.round(C*(s-1));e.onMoveEvent?.(u,R)},A=()=>{window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",A)};window.addEventListener("pointermove",f),window.addEventListener("pointerup",A)}),a.appendChild(_)}const o=y("div",{className:"timeline-cursor",style:`left:${t/s*100}%`});a.appendChild(o),a.addEventListener("pointerdown",u=>{const p=a.getBoundingClientRect(),d=(u.clientX-p.left)/p.width;e.onSeek(Math.round(Math.max(0,Math.min(1,d))*(s-1)))});const c=y("div",{className:"tick-row"}),h=s/n,l=h>2?.5:.25;for(let u=0;u<=h;u+=l)c.appendChild(y("span",{className:"tick",style:`left:${u/h*100}%`},`${u.toFixed(2)}s`));return y("div",{className:"timeline"},[a,c])}function T0(i,t,e){const n=i.querySelector(".timeline-cursor");n&&(n.style.left=`${t/e*100}%`)}function A0(i){const t=ot.state.clips.filter(d=>d.diveCode===i).sort((d,g)=>d.createdAt-g.createdAt),e=y("div",{className:"card"},[y("h3",{},`${i} 历次入水角趋势`)]);if(t.length===0)return e.append(y("div",{className:"muted"},"暂无该动作的历史数据")),e;const n=560,s=220,r=42,a=t.map(d=>{const g=w0(d);return{clip:d,angle:g?.entryAngleDeg??0}}),o=Math.max(20,...a.map(d=>d.angle))*1.1,c=a.length>1?(n-r*2)/(a.length-1):0,h=d=>r+(a.length===1?(n-r*2)/2:d*c),l=d=>s-r-d/o*(s-r*2),u=nn("svg",{viewBox:`0 0 ${n} ${s}`,class:"scatter"});u.appendChild(nn("line",{x1:r,y1:s-r,x2:n-10,y2:s-r,stroke:"#475569"})),u.appendChild(nn("line",{x1:r,y1:10,x2:r,y2:s-r,stroke:"#475569"}));const p=ot.state.settings.thresholds.entryVerticalDeg;u.appendChild(nn("line",{x1:r,y1:l(p),x2:n-10,y2:l(p),stroke:"#ef4444","stroke-dasharray":"6 4"})),u.appendChild(nn("text",{x:n-12,y:l(p)-4,fill:"#ef4444","text-anchor":"end","font-size":11},`告警线 ${p}°`));for(let d=0;d<=o;d+=5)u.appendChild(nn("text",{x:r-6,y:l(d)+4,fill:"#93a4c0","text-anchor":"end","font-size":10},`${d}°`));return a.forEach((d,g)=>{const _=h(g),m=l(d.angle),f=nn("circle",{cx:_,cy:m,r:6,fill:d.angle<=p?"#22c55e":"#f97316",class:"dot-annot"});f.addEventListener("click",()=>ot.navigate("playback",d.clip.id)),u.appendChild(f),u.appendChild(nn("text",{x:_,y:m-10,fill:"#e6edf7","text-anchor":"middle","font-size":10},d.angle.toFixed(1))),g>0&&u.appendChild(nn("line",{x1:h(g-1),y1:l(a[g-1].angle),x2:_,y2:m,stroke:"#38bdf8","stroke-opacity":.5})),u.appendChild(nn("text",{x:_,y:s-r+16,fill:"#93a4c0","text-anchor":"middle","font-size":10},`#${g+1}`))}),e.append(u),e.append(y("p",{className:"muted",style:"font-size:12px"},"点圆点可跳转到该跳回放;橙色点超出垂直告警角")),e}function w0(i){try{return ot.analysis(i)}catch{return}}function nn(i,t,e){const n=document.createElementNS("http://www.w3.org/2000/svg",i);for(const[s,r]of Object.entries(t))n.setAttribute(s,String(r));return e&&(n.textContent=e),n}function R0(i){ei(i);const t=ot.state,e=ot.getClip(t.activeClipId);if(!e){i.append(y("div",{className:"empty"},"请先在「训练课」中选择一跳进行回放"));return}const n=ot.athleteOf(e);if(!n){i.append(y("div",{className:"empty"},"该片段缺少队员档案,请先在队员页补建"));return}const s=e,r=n,a=ot.analysis(s),o=y("div",{className:"toolbar"},[y("h2",{className:"page-title",style:"margin:0"},"三维回放分析"),y("select",{onchange:U=>ot.navigate("playback",U.target.value)},t.clips.map(U=>y("option",{value:U.id,selected:U.id===s.id},`${U.diveCode} · ${ot.athleteOf(U)?.name??""} · ${U.frameCount}帧`))),y("div",{className:"spacer"}),y("button",{onclick:()=>k(s)},"导出 BVH"),y("button",{onclick:()=>q(s)},"导出 CSV"),y("button",{className:"primary",onclick:()=>K(s)},"导出分析单")]);i.append(o);const c=y("div",{className:"playback-layout"});i.append(c);const h=y("div",{className:"viewport-wrap"},[y("canvas",{})]),l=y("div",{className:"side-panel"});c.append(h,l);const u=new E0({canvas:h.querySelector("canvas"),clip:s,athlete:r,analysis:a,settings:t.settings}),p=new ResizeObserver(()=>u.resize());p.observe(h),Ql(()=>{p.disconnect(),u.dispose()});const d=y("div",{className:"hud"},[y("span",{},["动作 ",y("b",{},s.diveCode)]),y("span",{},["翻腾 ",y("b",{id:"hud-som"},"0.00")]),y("span",{},["转体 ",y("b",{id:"hud-tw"},"0.00")]),y("span",{},["帧 ",y("b",{id:"hud-frame"},"0")]),y("span",{},["时间 ",y("b",{id:"hud-time"},"0.00s")])]);h.append(d);const g=y("div",{className:"card"},[y("div",{className:"row"},[y("button",{id:"btn-play",className:"primary",onclick:()=>{u.togglePlay(),_()}},"播放"),y("button",{onclick:()=>u.seek(u.getFrame()-1)},"上一帧"),y("button",{onclick:()=>u.seek(u.getFrame()+1)},"下一帧"),y("span",{className:"muted"},"速度"),y("div",{className:"pill-group"},["0.1","0.25","0.5","1"].map(U=>y("button",{className:Number(U)===1?"active":"",onclick:G=>{u.setSpeed(Number(U)),G.currentTarget.parentElement.querySelectorAll("button").forEach(z=>z.classList.remove("active")),G.currentTarget.classList.add("active")}},`${U}x`)))])]);function _(){const U=g.querySelector("#btn-play");U.textContent=u.isPlaying()?"暂停":"播放"}const m=y("div",{className:"card"},[y("h3",{},"相机视角"),y("div",{className:"pill-group"},[f("free","自由环绕"),f("follow","锁重心跟随"),f("judge","裁判席"),f("underwater","水下")])]);function f(U,G){return y("button",{className:U==="free"?"active":"",onclick:z=>{u.setCameraMode(U),m.querySelectorAll("button").forEach(nt=>nt.classList.remove("active")),z.currentTarget.classList.add("active")}},G)}const A=y("div",{className:"card"},[y("h3",{},"实时指标"),y("div",{className:"grid cols-2"},[T("累计翻腾","m-som","0.00 周"),T("累计转体","m-tw","0.00 周"),T("左/右膝角","m-knee","—"),T("左/右髋角","m-hip","—"),T("抱紧状态","m-tight","—"),T("角速度","m-omega","0 rad/s")])]);function T(U,G,z){return y("div",{className:"metric"},[y("div",{className:"k"},U),y("div",{className:"v",id:G,style:"font-size:17px"},z)])}const E=y("div",{className:"card"},[y("h3",{},"整跳分析"),y("div",{className:"kv"},[y("span",{className:"k"},"翻腾圈数"),y("b",{style:"color:var(--accent)"},`${Math.abs(a.somersaultTurns).toFixed(2)} 周`),y("span",{className:"k"},"转体圈数"),y("b",{},`${Math.abs(a.twistTurns).toFixed(2)} 周`),y("span",{className:"k"},"入水角"),y("span",{},`${a.entryAngleDeg.toFixed(1)}°(偏离铅垂)`),y("span",{className:"k"},"手掌入水偏移"),y("span",{},`水平 ${Math.hypot(a.handEntryOffset[0],a.handEntryOffset[2]).toFixed(2)} m`),y("span",{className:"k"},"打开时机"),y("span",{},`${a.apexToOpenMs>=0?"晚于":"早于"}最高点 ${Math.abs(a.apexToOpenMs).toFixed(0)} ms`),y("span",{className:"k"},"峰值角速度"),y("span",{},`${a.maxAngularVelocity.toFixed(1)} rad/s`)])]),C=y("div",{className:"card"},[y("h3",{},"帧标注")]);let R=-1;function L(U=!1){const G=u.getFrame();if(!U&&G===R)return;R=G;const z=ot.annotationsOf(s.id);C.replaceChildren(y("h3",{},"帧标注")),C.append(y("div",{className:"row"},[y("button",{onclick:()=>I("comment")},"+ 挂评语"),y("button",{onclick:()=>I("arrow")},"+ 画箭头")]));const nt=z.filter(st=>st.frame===u.getFrame());nt.length===0&&C.append(y("p",{className:"muted",style:"font-size:12px"},"当前帧暂无标注"));for(const st of nt)C.append(y("div",{className:"annotation-item",style:`border-left-color:${st.color}`},[y("div",{className:"row"},[y("b",{},st.kind==="comment"?"评语":"箭头"),y("span",{className:"muted"},`第${st.frame}帧 · ${In[st.anchorJoint]}`),y("div",{className:"spacer"}),y("button",{className:"danger",onclick:async()=>{await ot.deleteAnnotation(st.id),L(!0)}},"删")]),st.text?y("div",{style:"margin-top:4px"},st.text):null]));u.setAnnotations(z)}function I(U){const G=u.getFrame(),z=b.Hips,nt=U==="comment"?"#38bdf8":"#f97316";if(U==="comment"){const st=prompt("输入评语:");if(!st)return;ot.saveAnnotation({id:Ii("ann"),clipId:s.id,frame:G,kind:U,text:st,anchorJoint:z,color:nt,createdAt:Date.now()}).then(()=>{L(!0)})}else ot.saveAnnotation({id:Ii("ann"),clipId:s.id,frame:G,kind:U,anchorJoint:z,offset:[.4,.3,0],color:nt,createdAt:Date.now()}).then(()=>{L(!0)})}l.append(g,m,A,E,C),l.append(A0(s.diveCode)),L();const S=y("div",{className:"card",style:"margin-top:16px"},[y("div",{className:"row"},[y("b",{},"时间轴"),y("span",{className:"muted",style:"font-size:12px"},"黄段=丢帧/翻转已修复;绿色离板、红色入水标记可直接拖动修正")])]);let x=el(s,0,{onSeek:U=>{u.seek(U)},onMoveEvent:async(U,G)=>{s[U]=G,s.apexFrame=ps(s);const z=ot.analysis(s);s.openFrame=fs(s,z.metrics,ot.state.settings),await ot.saveClip(s),ot.invalidateAnalysis(s.id),S.replaceChildren(),x=D(),S.append(x),u.seek(u.getFrame())}});function D(){return el(s,u.getFrame(),{onSeek:U=>u.seek(U),onMoveEvent:async(U,G)=>{s[U]=G,s.apexFrame=ps(s);const z=ot.analysis(s);s.openFrame=fs(s,z.metrics,ot.state.settings),await ot.saveClip(s),ot.invalidateAnalysis(s.id)}})}S.append(x),c.append(S),h.style.gridRow="1 / 2",S.style.gridRow="2 / 3",S.style.gridColumn="1 / 2",l.style.gridRow="1 / 3",l.style.gridColumn="2 / 3",u.onFrame=U=>{T0(x,U,s.frameCount);const G=a.metrics[U];if(H("hud-frame",String(U)),H("hud-time",`${(U/s.sampleRate).toFixed(2)}s`),G){H("hud-som",(G.somersaultCumDeg/360).toFixed(2)),H("hud-tw",(G.twistCumDeg/360).toFixed(2)),H("m-som",`${(G.somersaultCumDeg/360).toFixed(2)} 周`),H("m-tw",`${(G.twistCumDeg/360).toFixed(2)} 周`),H("m-knee",`${G.kneeAngles[0].toFixed(0)}° / ${G.kneeAngles[1].toFixed(0)}°`),H("m-hip",`${G.hipAngles[0].toFixed(0)}° / ${G.hipAngles[1].toFixed(0)}°`);const z=document.getElementById("m-tight");z&&(z.textContent=G.isTight?"抱紧 ✓":"未抱紧",z.style.color=G.isTight?"var(--accent-2)":"var(--fg-dim)"),H("m-omega",`${G.angularVelocity.toFixed(1)} rad/s`)}L()},u.seek(0);function H(U,G){const z=document.getElementById(U);z&&(z.textContent=G)}function k(U){const G=Rh(U,{height:r.heightCm/100,armSpan:r.armSpanCm/100});Pr(`${U.diveCode}_${U.id}.bvh`,G)}function q(U){Pr(`${U.diveCode}_${U.id}.csv`,Ch(U),"text/csv")}function K(U){const G=[];for(const[Pt,Xt]of[[U.takeoffFrame,"离板"],[U.apexFrame,"最高点"],[U.openFrame,"打开"],[U.entryFrame,"入水"]])Pt<0||(u.seek(Pt),G.push([Xt,u.screenshot()]));u.seek(0);const z=ot.analysis(U),nt=go(U),st=ot.annotationsOf(U.id),Mt=C0(U,r.name,z,G,nt,st);Pr(`${U.diveCode}_分析单.html`,Mt,"text/html")}}function C0(i,t,e,n,s,r){const a=i,o=n.map(([l,u])=>`<figure><img src="${u}"/><figcaption>${l} 第${{离板:a.takeoffFrame,最高点:a.apexFrame,打开:a.openFrame,入水:a.entryFrame}[l]}帧</figcaption></figure>`).join(""),c=s.length?s.map(l=>`<li>${l.label}:第${l.start}-${l.end}帧</li>`).join(""):"<li>无数据缺陷</li>",h=r.length?r.map(l=>`<li>第${l.frame}帧 ${l.kind==="comment"?`评语:${l.text??""}`:"箭头标注"}</li>`).join(""):"<li>无</li>";return`<!doctype html><html lang="zh"><head><meta charset="utf-8">
<title>${a.diveCode} 动作分析单</title>
<style>
body{font-family:"Microsoft YaHei",sans-serif;max-width:900px;margin:24px auto;color:#1f2937}
h1{border-bottom:3px solid #0ea5e9;padding-bottom:8px}
table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #cbd5e1;padding:8px;text-align:left}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden}
figure img{width:100%;display:block}figcaption{padding:6px 10px;background:#f1f5f9;font-size:13px}
.tag{background:#fef3c7;padding:2px 8px;border-radius:6px}
</style></head><body>
<h1>${a.diveCode} 动作分析单</h1>
<table>
<tr><th>队员</th><td>${t}</td><th>采样率</th><td>${a.sampleRate} Hz / ${a.frameCount} 帧</td></tr>
<tr><th>翻腾圈数</th><td><b>${Math.abs(e.somersaultTurns).toFixed(2)}</b> 周</td><th>转体圈数</th><td><b>${Math.abs(e.twistTurns).toFixed(2)}</b> 周</td></tr>
<tr><th>入水角</th><td>${e.entryAngleDeg.toFixed(1)}°</td><th>打开时机</th><td>${e.apexToOpenMs>=0?"晚于":"早于"}最高点 ${Math.abs(e.apexToOpenMs).toFixed(0)} ms</td></tr>
<tr><th>手掌入水水平偏移</th><td>${Math.hypot(e.handEntryOffset[0],e.handEntryOffset[2]).toFixed(2)} m</td><th>峰值角速度</th><td>${e.maxAngularVelocity.toFixed(1)} rad/s</td></tr>
</table>
<h2>关键帧截图</h2><div class="grid">${o}</div>
<h2>数据质量</h2><ul>${c}</ul>
<h2>教练标注</h2><ul>${h}</ul>
<p class="tag">由跳水动作分析系统生成 · ${new Date().toLocaleString("zh-CN")}</p>
</body></html>`}class L0{renderer;scene=new Fl;camera=new Ue(45,1,.05,100);figA;figB;layout="overlay";raf=0;disposed=!1;frame=0;playing=!1;lastTime=0;accumulator=0;speed=1;onFrame;settings;a;b;diffRange=null;constructor(t,e,n,s,r){this.a=e,this.b=n,this.settings=s,this.onFrame=r,this.renderer=new Jl({canvas:t,antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.scene.background=new Ut(725536),this.scene.add(new ql(16777215,.7));const a=new oo(16777215,1);a.position.set(4,10,6),this.scene.add(a),this.figA=Er({height:e.athlete.heightCm/100,armSpan:e.athlete.armSpanCm/100},2278750),this.figB=Er({height:n.athlete.heightCm/100,armSpan:n.athlete.armSpanCm/100},16347926),this.figB.setOpacity(.4),this.scene.add(this.figA.root,this.figB.root),this.camera.position.set(3.5,4,6),this.camera.lookAt(0,3,1),this.computeDiffRange(),this.seek(0),this.loop=this.loop.bind(this),this.raf=requestAnimationFrame(this.loop)}setLayout(t){this.layout=t,t==="split"?(this.figA.root.position.x=-1.2,this.figB.root.position.x=1.2):(this.figA.root.position.x=0,this.figB.root.position.x=0)}alignedFlightFrames(){const t=this.a.clip.entryFrame-this.a.clip.takeoffFrame,e=this.b.clip.entryFrame-this.b.clip.takeoffFrame;return Math.min(t,e)}alignedFrame(t,e){return He.clamp(t.clip.takeoffFrame+e,0,t.clip.frameCount-1)}readFrame(t,e){const n=e*3,s=[t.clip.rootPositions[n],t.clip.rootPositions[n+1],t.clip.rootPositions[n+2]],r=[];for(let a=0;a<zt;a++){const o=(e*zt+a)*4;r.push([t.clip.localRotations[o],t.clip.localRotations[o+1],t.clip.localRotations[o+2],t.clip.localRotations[o+3]])}return{pos:s,quats:r}}seek(t){this.frame=He.clamp(t,0,this.alignedFlightFrames());const e=this.alignedFrame(this.a,this.frame),n=this.alignedFrame(this.b,this.frame),s=this.readFrame(this.a,e),r=this.readFrame(this.b,n);this.figA.applyFrame(s.pos,s.quats),this.figB.applyFrame(r.pos,r.quats),this.renderer.render(this.scene,this.camera),this.onFrame?.(this.frame)}computeDiffRange(){const t=this.alignedFlightFrames(),e=[];for(let r=0;r<t;r++){const a=this.a.analysis.metrics[this.alignedFrame(this.a,r)],o=this.b.analysis.metrics[this.alignedFrame(this.b,r)];if(!a||!o){e.push(0);continue}const c=Math.abs(a.kneeAngles[0]-o.kneeAngles[0])+Math.abs(a.kneeAngles[1]-o.kneeAngles[1])+Math.abs(a.hipAngles[0]-o.hipAngles[0])+Math.abs(a.hipAngles[1]-o.hipAngles[1]);e.push(c)}let n=0,s=-1;e.forEach((r,a)=>{r>s&&(s=r,n=a)}),this.diffRange={startFrame:Math.max(0,n-15),endFrame:Math.min(t-1,n+15),maxDiffDeg:s}}jumpToMaxDiff(){this.diffRange&&this.seek(this.diffRange.startFrame)}play(){this.playing=!0}pause(){this.playing=!1}togglePlay(){this.playing=!this.playing}setSpeed(t){this.speed=t}getFrame(){return this.frame}isPlaying(){return this.playing}loop(t){if(this.disposed)return;this.raf=requestAnimationFrame(this.loop),this.lastTime||(this.lastTime=t);const e=Math.min(.05,(t-this.lastTime)/1e3);if(this.lastTime=t,this.playing){this.accumulator+=e*this.speed;const n=this.a.clip.sampleRate;for(;this.accumulator>=1/n;){if(this.accumulator-=1/n,this.frame>=this.alignedFlightFrames()){this.playing=!1;break}this.frame++}this.seek(this.frame)}}resize(){const e=this.renderer.domElement.parentElement;e&&(this.renderer.setSize(e.clientWidth,e.clientHeight,!1),this.camera.aspect=e.clientWidth/Math.max(1,e.clientHeight),this.camera.updateProjectionMatrix())}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.figA.dispose(),this.figB.dispose(),this.renderer.dispose()}}function P0(i){ei(i);const t=ot.state;if(i.append(y("div",{className:"toolbar"},[y("h2",{className:"page-title",style:"margin:0"},"对比分析"),y("span",{className:"muted"},"按离板帧自动对齐,公共时间轴第 0 帧 = 两跳各自离板瞬间")])),t.clips.length<2){i.append(y("div",{className:"empty"},"至少需要两跳才能对比,请先在训练课中生成或导入"));return}const e=t.clips.map(d=>{const g=ot.athleteOf(d);return y("option",{value:d.id},`${d.diveCode} · ${g?.name??""} · ${d.id.slice(-6)}`)}),n=y("select",{},e.map(d=>d.cloneNode(!0))),s=y("select",{},e.map(d=>d.cloneNode(!0)));s.selectedIndex=Math.min(1,t.clips.length-1);const r=y("div",{className:"viewport-wrap",style:"min-height:560px"},[y("canvas",{})]);let a=null,o=null;const c=y("div",{className:"card"},[y("h3",{},"关节角度差"),y("div",{className:"muted"},"选择两跳后开始对比")]);function h(){const d=ot.getClip(n.value),g=ot.getClip(s.value);if(!d||!g||d.id===g.id){alert("请选择两跳不同的片段");return}const _=ot.athleteOf(d),m=ot.athleteOf(g);if(!_||!m){alert("队员档案缺失");return}a?.dispose(),a=new L0(r.querySelector("canvas"),{clip:d,athlete:_,analysis:ot.analysis(d)},{clip:g,athlete:m,analysis:ot.analysis(g)},t.settings,A=>{const T=document.getElementById("cmp-frame");T&&(T.textContent=`对齐帧 ${A} (${(A/d.sampleRate).toFixed(2)}s)`)}),o||(o=new ResizeObserver(()=>a?.resize()),o.observe(r)),a.resize(),Ql(()=>{o?.disconnect(),a?.dispose()});const f=a.diffRange;c.replaceChildren(y("h3",{},"关节角度差(膝/髋)"),y("div",{className:"kv"},[y("span",{className:"k"},"最大差异"),y("b",{style:"color:var(--orange)"},f?`${f.maxDiffDeg.toFixed(1)}°`:"—"),y("span",{className:"k"},"差异区间"),y("span",{},f?`对齐帧 ${f.startFrame} ~ ${f.endFrame}`:"—")]),y("button",{className:"primary",style:"margin-top:10px",onclick:()=>{a?.jumpToMaxDiff(),l()}},"自动跳到差异最大段"))}function l(){r.classList.remove("flash-row"),r.offsetWidth,r.classList.add("flash-row")}const u=y("div",{className:"card"},[y("div",{className:"row"},[y("div",{style:"flex:1;min-width:200px"},[y("label",{},"A 跳(实体/绿色)"),n]),y("div",{style:"flex:1;min-width:200px"},[y("label",{},"B 跳(半透明/橙色)"),s]),y("button",{className:"primary",style:"margin-top:18px",onclick:h},"开始对比")]),y("div",{className:"row",style:"margin-top:12px"},[y("button",{id:"cmp-play",onclick:()=>{a?.togglePlay()}},"播放/暂停"),y("button",{onclick:()=>a?.seek(Math.max(0,(a?.getFrame()??1)-1))},"上一帧"),y("button",{onclick:()=>a?.seek((a?.getFrame()??0)+1)},"下一帧"),y("div",{className:"pill-group"},[y("button",{className:"active",onclick:d=>{a?.setLayout("overlay"),p(d)}},"叠加(一实一虚)"),y("button",{onclick:d=>{a?.setLayout("split"),p(d)}},"左右分屏")]),y("div",{className:"spacer"}),y("span",{className:"tag",id:"cmp-frame"},"对齐帧 0")])]);function p(d){d.currentTarget.parentElement?.querySelectorAll("button").forEach(g=>g.classList.remove("active")),d.currentTarget.classList.add("active")}i.append(u,r,y("div",{style:"height:16px"}),c),setTimeout(h,0)}function lo(i){ei(i);const t=ot.state;i.append(y("h2",{className:"page-title"},"系统设置"));const e=t.settings.thresholds,n=y("div",{className:"card"},[y("h3",{},"关节角度阈值(度)"),y("div",{className:"form-grid"},[gn("抱膝膝角阈值(小于算抱紧)",e.tuckKneeDeg,l=>e.tuckKneeDeg=l),gn("抱膝髋角阈值",e.tuckHipDeg,l=>e.tuckHipDeg=l),gn("屈体髋角阈值",e.pikeHipDeg,l=>e.pikeHipDeg=l),gn("入水垂直告警角",e.entryVerticalDeg,l=>e.entryVerticalDeg=l),gn("跳板下压参考量(mm)",e.boardFlexMm,l=>e.boardFlexMm=l)]),y("p",{className:"muted",style:"font-size:12px;margin-top:8px"},"保存后所有片段的分析结果缓存将清空,下次打开回放时按新阈值重算")]),s=y("div",{className:"card"},[y("h3",{},"回放与生成"),y("div",{className:"form-grid"},[gn("动捕采样率(Hz)",t.settings.sampleRate,l=>t.settings.sampleRate=l),gn("水面高度(米)",t.settings.waterLevelY,l=>t.settings.waterLevelY=l),gn("残影间隔帧数 N",t.settings.comTrailStep,l=>t.settings.comTrailStep=l),gn("残影不透明度(0-1)",t.settings.ghostAlpha,l=>t.settings.ghostAlpha=l)])]);i.append(y("div",{className:"grid cols-2"},[n,s]));const r=y("div",{className:"card",style:"margin-top:16px"},[y("div",{className:"row"},[y("h3",{style:"margin:0"},"骨骼命名映射"),y("span",{className:"muted"},"不同厂商 BVH 骨骼名对不上时,手动对一次,以后自动套用")])]),a=y("select",{onchange:l=>{t.settings.activeBoneMap=l.target.value,ot.updateSettings(()=>{}),lo(i)}},[y("option",{value:"mixamo",selected:t.settings.activeBoneMap==="mixamo"},"Mixamo / 通用人形"),y("option",{value:"generic",selected:t.settings.activeBoneMap==="generic"},"带前缀厂商(mixamorig:)"),...Object.keys(t.settings.boneMaps).filter(l=>l!=="mixamo"&&l!=="generic").map(l=>y("option",{value:l,selected:t.settings.activeBoneMap===l},l))]),o=y("button",{onclick:()=>{const l=prompt("新厂商映射名称(如 xsens / optitrack):");l&&(t.settings.boneMaps[l]||(t.settings.boneMaps[l]={}),t.settings.activeBoneMap=l,ot.updateSettings(()=>{}),lo(i))}},"+ 新厂商映射");r.append(y("div",{className:"row",style:"margin:12px 0"},[y("div",{style:"min-width:240px"},[y("label",{},"当前厂商"),a]),o]));const c=t.settings.boneMaps[t.settings.activeBoneMap]??ga[t.settings.activeBoneMap]??{},h=y("div",{className:"scroll-x"},[y("table",{},[y("thead",{},y("tr",{},[y("th",{},"本系统关节"),y("th",{},"厂商骨骼名(可编辑)"),y("th",{},"状态")])),y("tbody",{},In.map((l,u)=>{const p=Object.entries(c).find(([,g])=>g===u)?.[0]??"",d=y("input",{value:p,placeholder:l,onchange:g=>{const _=g.target.value.trim();t.settings.boneMaps[t.settings.activeBoneMap]||(t.settings.boneMaps[t.settings.activeBoneMap]={...c});const m=t.settings.boneMaps[t.settings.activeBoneMap];for(const f of Object.keys(m))m[f]===u&&delete m[f];_&&(m[_]=u)}});return y("tr",{},[y("td",{},l),y("td",{},d),y("td",{},p?y("span",{className:"tag green"},"已映射"):y("span",{className:"tag orange"},"待映射"))])}))])]);r.append(h),r.append(y("div",{className:"row",style:"margin-top:12px"},[y("button",{className:"primary",onclick:()=>{ma(t.settings),ot.updateSettings(()=>{}),alert("映射已保存,后续导入该厂商 BVH 自动套用")}},"保存映射"),y("span",{className:"muted",style:"font-size:12px"},"内置两套映射作为起点,编辑后会另存为当前厂商的自定义表,不影响内置表")])),i.append(r),i.append(y("div",{className:"row",style:"margin-top:16px"},[y("button",{className:"primary",onclick:()=>{ma(t.settings),ot.updateSettings(()=>{}),alert("设置已保存并生效")}},"保存全部设置"),y("button",{onclick:()=>{confirm("恢复默认设置?自定义骨骼映射保留")&&(localStorage.removeItem("dive-analyzer-settings"),location.reload())}},"恢复默认")]))}function gn(i,t,e){return y("div",{},[y("label",{},i),y("input",{type:"number",value:String(t),oninput:n=>e(Number(n.target.value))})])}let ho=null;function Ql(i){ho=i}const D0=[["athletes","队员档案"],["dives","动作库"],["sessions","训练课"],["playback","三维回放"],["compare","对比分析"],["settings","设置"]],N0={athletes:xa,dives:ol,sessions:rs,playback:R0,compare:P0,settings:lo};function I0(i){const t=y("div",{className:"app-main"}),e=new Map,n=y("div",{className:"app-shell"},[y("header",{className:"app-header"},[y("h1",{},"🏊 跳水动作分析系统"),y("nav",{className:"nav"},D0.map(([r,a])=>{const o=y("button",{onclick:()=>ot.navigate(r)},a);return e.set(r,o),o}))]),t]);i.append(n);function s(){ho?.(),ho=null,ei(t);const{page:r}=ot.state;e.forEach((a,o)=>a.classList.toggle("active",o===r));try{N0[r](t)}catch(a){console.error(a),t.append(y("div",{className:"empty"},`页面渲染失败:${a instanceof Error?a.message:String(a)}`))}t.scrollTop=0}ot.subscribe(s),s()}function U0([i,t,e]){const n=Je([1,0,0],ir(i)),s=Je([0,1,0],ir(t)),r=Je([0,0,1],ir(e));return Ee(Ee(n,s),r)}const F0={[b.Spine]:[0,0,0],[b.Spine1]:[0,0,0],[b.Neck]:[0,0,0],[b.Head]:[0,0,0],[b.LeftShoulder]:[0,0,0],[b.LeftArm]:[0,0,96],[b.LeftForeArm]:[0,0,0],[b.LeftHand]:[0,0,0],[b.RightShoulder]:[0,0,0],[b.RightArm]:[0,0,-96],[b.RightForeArm]:[0,0,0],[b.RightHand]:[0,0,0],[b.LeftUpLeg]:[0,0,0],[b.LeftLeg]:[0,0,0],[b.LeftFoot]:[55,0,0],[b.RightUpLeg]:[0,0,0],[b.RightLeg]:[0,0,0],[b.RightFoot]:[55,0,0]},O0={[b.Spine]:[-22,0,0],[b.Spine1]:[-18,0,0],[b.Neck]:[10,0,0],[b.Head]:[8,0,0],[b.LeftArm]:[-125,0,92],[b.LeftForeArm]:[45,0,0],[b.LeftHand]:[0,0,0],[b.RightArm]:[-125,0,-92],[b.RightForeArm]:[45,0,0],[b.RightHand]:[0,0,0],[b.LeftUpLeg]:[-108,0,0],[b.LeftLeg]:[128,0,0],[b.LeftFoot]:[40,0,0],[b.RightUpLeg]:[-108,0,0],[b.RightLeg]:[128,0,0],[b.RightFoot]:[40,0,0]},B0={[b.Spine]:[-30,0,0],[b.Spine1]:[-28,0,0],[b.Neck]:[12,0,0],[b.Head]:[10,0,0],[b.LeftArm]:[-148,0,92],[b.LeftForeArm]:[0,0,0],[b.LeftHand]:[0,0,0],[b.RightArm]:[-148,0,-92],[b.RightForeArm]:[0,0,0],[b.RightHand]:[0,0,0],[b.LeftUpLeg]:[-96,0,0],[b.LeftLeg]:[0,0,0],[b.LeftFoot]:[60,0,0],[b.RightUpLeg]:[-96,0,0],[b.RightLeg]:[0,0,0],[b.RightFoot]:[60,0,0]},nl={[b.Spine]:[0,0,0],[b.Spine1]:[0,0,0],[b.Neck]:[0,0,0],[b.Head]:[0,0,0],[b.LeftArm]:[0,0,96],[b.LeftForeArm]:[0,0,0],[b.LeftHand]:[0,0,0],[b.RightArm]:[0,0,-96],[b.RightForeArm]:[0,0,0],[b.RightHand]:[0,0,0],[b.LeftUpLeg]:[0,0,0],[b.LeftLeg]:[0,0,0],[b.LeftFoot]:[72,0,0],[b.RightUpLeg]:[0,0,0],[b.RightLeg]:[0,0,0],[b.RightFoot]:[72,0,0]},z0={stand:F0,tuck:O0,pike:B0,entry:nl,layout:nl},il=new Map;function H0(i,t){const e=`${i}:${t}`;let n=il.get(e);if(!n){const s=z0[i][t];n=s?U0(s):wi(),il.set(e,n)}return n}function k0(i){let t=i>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const V0={A:"layout",B:"pike",C:"tuck",D:"tuck"};function G0(i,t){return(i===5?t??1:i)===4?1:-1}function W0(i){const t=i.sampleRate??240,e=k0(i.seed??Y0(i.dive.code+i.athlete.id)),n=Ni(i.dive.code),r=G0(n.group,n.direction)*i.dive.somersaults*2*Math.PI,a=(i.dive.twists||0)*2*Math.PI,o=i.athlete.heightCm/100,h=i.platformHeight+o*.521,l=.55,u=$0(1.18+e()*.16+(i.platformHeight>=10?.22:0)),p=.5,d=l,g=l+u,_=g+p,m=Math.round(_*t)+1,f=9.81,A=o*.9,T=(A-h+.5*f*u*u)/u,E=(n.group===5?n.direction:n.group)===1||n.group===5&&n.direction===1,C=n.group===4||n.group===5&&n.direction===4,R=E?.55+e()*.25:C?-.25-e()*.15:.12+e()*.18,L=(e()-.5)*.08,I=i.boardType==="spring"?.16+e()*.05:0,S=V0[i.dive.position],x=.12+e()*.05,D=i.dive.twists>0?.8+e()*.04:.78+e()*.05,H=.94,k=.14,q=.86,U=n.group===2||n.group===3||n.group===5&&(n.direction===2||n.direction===3)?Math.PI:0,G=new Float32Array(m*3),z=new Float32Array(m*zt*4),nt=[];for(let $=0;$<m;$++){const tt=$/t;let pt,rt,St="stand",Et=1;if(tt<d){const mt=tt/d,Lt=I*Math.sin(Math.PI*mt)*(1-Ki(.72,1,mt)*.4);pt=[0,h-Lt,0],rt=va(U),St="stand"}else if(tt<g){const mt=tt-d,Lt=Ri(mt/u,0,1);pt=[R*mt,h+T*mt-.5*f*mt*mt,L*mt];const Ft=r*Lt,ne=Je([1,0,0],Ft);let N=0;if(a!==0){const Gt=Ri((Lt-k)/(q-k),0,1);N=a*Gt}const Re=th(ne,[0,1,0]),Wt=Je(Re,N);if(rt=Ee(Ee(va(U),Wt),ne),Lt<x)Et=Ki(.02,x,Lt),St=S;else if(Lt<D)St=S,Et=1;else if(Lt<H){const Gt=Ki(D,H,Lt);rt=rt,St=S,Et=1-Gt}else St="entry",Et=Ki(H,1,Lt)}else{const mt=tt-g,Lt=Ri(mt/p,0,1);pt=[R*u+R*mt*(1-Lt*.6),A-2.2*Lt+.5*f*mt*mt*.12,L*u];const Ft=(e()-.5)*.21*Ki(0,.25,Lt);rt=Ee(Je([0,0,1],Ft),X0(r,a,U)),St="entry",Et=1}G[$*3]=pt[0],G[$*3+1]=pt[1],G[$*3+2]=pt[2];for(let mt=0;mt<zt;mt++){let Lt;if(mt===b.Hips||mt===b.Pelvis)Lt=mt===b.Hips?rt:wi();else if(mt===b.Chest)Lt=wi();else{const ne=H0(St,mt);Lt=Et>=.999?ne:mo(wi(),ne,Et)}const Ft=($*zt+mt)*4;z[Ft]=Lt[0],z[Ft+1]=Lt[1],z[Ft+2]=Lt[2],z[Ft+3]=Lt[3]}}const st=Math.round(d*t),Mt=Math.round(g*t),Pt=Math.round((d+T/f)*t),Xt={id:`dive_${i.dive.code}_${i.athlete.id.slice(0,4)}_${(i.seed??0).toString(36)}`,athleteId:i.athlete.id,diveCode:i.dive.code,sessionId:i.sessionId,sampleRate:t,frameCount:m,rootPositions:G,localRotations:z,takeoffFrame:st,entryFrame:Mt,apexFrame:Pt,openFrame:Math.round(d+D*u*t),defects:nt,repaired:[],createdAt:Date.now()};return i.injectDefects&&q0(Xt,e),Xt}function X0(i,t,e){const n=Je([1,0,0],i),s=th(n,[0,1,0]),r=Je(s,t);return Ee(Ee(va(e),r),n)}function th(i,t){const e=[t[0],t[1],t[2],0],n=[-i[0],-i[1],-i[2],i[3]],s=Ee(Ee(i,e),n);return[s[0],s[1],s[2]]}function q0(i,t){const e=i.takeoffFrame+Math.floor(i.frameCount*.35),n=8+Math.floor(t()*7);for(let o=e;o<Math.min(e+n,i.frameCount);o++){for(let c=0;c<3;c++)i.rootPositions[o*3+c]=NaN;for(let c=0;c<zt*4;c++)i.localRotations[o*zt*4+c]=NaN}i.defects.push({type:"drop",jointId:-1,startFrame:e,endFrame:e+n-1});const s=i.takeoffFrame+Math.floor(i.frameCount*.55),r=5+Math.floor(t()*5),a=b.LeftForeArm;for(let o=s;o<Math.min(s+r,i.frameCount);o++){const c=(o*zt+a)*4;i.localRotations[c]*=-1,i.localRotations[c+1]*=-1,i.localRotations[c+2]*=-1,i.localRotations[c+3]*=-1}i.defects.push({type:"flip",jointId:a,startFrame:s,endFrame:s+r-1})}function Y0(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function $0(i){return Math.round(i*1e3)/1e3}const br="dive-analyzer-seeded-v1";async function eh(i=!1){if(!i&&localStorage.getItem(br))return;const t=ot.state.settings,e=[{id:"ath_linhao",name:"林皓",gender:"male",birthYear:2004,heightCm:172,armSpanCm:178,weightKg:62,team:"省队跳水组",createdAt:Date.now()},{id:"ath_suqing",name:"苏晴",gender:"female",birthYear:2006,heightCm:161,armSpanCm:166,weightKg:51,team:"省队跳水组",createdAt:Date.now()}];for(const r of e)await ot.saveAthlete(r);const n=[{id:"sess_20261120",date:"2026-11-20",venue:"省跳水馆 3米板",platformHeight:3,boardType:"spring",note:"赛前成套动作训练",clipIds:[],createdAt:Date.now()},{id:"sess_20261121",date:"2026-11-21",venue:"省跳水馆 10米台",platformHeight:10,boardType:"platform",note:"台上翻腾节奏",clipIds:[],createdAt:Date.now()}];for(const r of n)await ot.saveSession(r);const s=[{code:"107B",athleteId:"ath_linhao",sessionId:"sess_20261120",height:3,board:"spring",seeds:[11,23],defectSeed:47},{code:"205C",athleteId:"ath_linhao",sessionId:"sess_20261120",height:3,board:"spring",seeds:[7,19]},{code:"205C",athleteId:"ath_suqing",sessionId:"sess_20261121",height:10,board:"platform",seeds:[31]},{code:"5253B",athleteId:"ath_suqing",sessionId:"sess_20261121",height:10,board:"platform",seeds:[13,29,41]}];for(const r of s){const a=uo.find(h=>h.code===r.code),o=e.find(h=>h.id===r.athleteId),c=r.defectSeed?[...r.seeds,r.defectSeed]:r.seeds;for(const h of c){const l=W0({athlete:o,dive:a,sessionId:r.sessionId,sampleRate:t.sampleRate,platformHeight:r.height,boardType:r.board,seed:h,injectDefects:h===r.defectSeed});l.id=Ii("clip"),l.defects.length>0&&ll(l);const u=o.heightCm/100*.521,p=al(l,t.waterLevelY,r.height,u,o.heightCm/100*.9);l.takeoffFrame=p.takeoffFrame,l.entryFrame=p.entryFrame,l.apexFrame=ps(l),l.openFrame=-1,await ot.saveClip(l),n.find(g=>g.id===r.sessionId).clipIds.push(l.id)}}for(const r of n)await ot.saveSession(r);for(const r of ot.state.clips)if(r.openFrame<0){const a=ot.analysis(r);ot.athleteOf(r),r.openFrame=fs(r,a.metrics,ot.state.settings),await ot.saveClip(r)}localStorage.setItem(br,"1")}async function K0(){localStorage.removeItem(br);const i=[...ot.state.clips];for(const n of i)await ot.deleteClip(n.id);const t=[...ot.state.sessions];for(const n of t)await ot.deleteSession(n.id);const e=[...ot.state.athletes];for(const n of e)await ot.deleteAthlete(n.id);await eh(!0)}function Z0(){return!!localStorage.getItem(br)}async function j0(){await ot.init(),await eh();const i=document.getElementById("app");I0(i),window.diveApp={resetDemoData:K0,isSeeded:Z0,store:ot},console.info("%c跳水动作分析系统已就绪","color:#38bdf8;font-size:14px"),console.info("如需重置演示数据,在控制台执行 diveApp.resetDemoData()")}j0().catch(i=>{console.error(i),document.getElementById("app").innerHTML=`<pre style="padding:24px;color:#fca5a5">启动失败:${i instanceof Error?i.stack:i}</pre>`});
