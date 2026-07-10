import { useState, useEffect, useRef, useCallback } from "react";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  night:      "#0D0F14",
  nightCard:  "#13161C",
  nightBorder:"#1E2128",
  terra:      "#A96E55",
  terraLight: "#C4865F",
  parchment:  "#C8BFA0",
  linen:      "#E8E4DC",
  stone:      "#8A8A7A",
  gold:       "#C8A96E",
  goldDim:    "#C8A96E33",
  green:      "#4CAF50",
  red:        "#F44336",
};

const AUDIO_URL  = "https://bible-comeback-plan.vercel.app/halfway-message.mp3";
const FORM_ID    = "xnjkerpn";

// ── Reading plan ──────────────────────────────────────────────────────────────
const READINGS = [
  { id:1,  ref:"Romans 8:1",           verse:"\"There is therefore now no condemnation for those who are in Christ Jesus.\"",                                                                                                    note:"Read it out loud. Then sit in silence for thirty seconds.",                                                     minMinutes:1,  phase:1 },
  { id:2,  ref:"Hebrews 4:16",         verse:"\"Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.\"",                                             note:"Read it twice. Let \"confidence\" land.",                                                                       minMinutes:1,  phase:1 },
  { id:3,  ref:"Psalm 34:18",          verse:"\"The Lord is near to the brokenhearted and saves the crushed in spirit.\"",                                                                                                      note:"Read it slowly. Notice what it says about where God is.",                                                       minMinutes:1,  phase:1 },
  { id:4,  ref:"Romans 5:6–8",         verse:"\"For while we were still weak, at the right time Christ died for the ungodly... God shows his love for us in that while we were still sinners, Christ died for us.\"",          note:"Three verses. Let \"while we were still sinners\" land.",                                                        minMinutes:2,  phase:2 },
  { id:5,  ref:"Lamentations 3:22–23", verse:"\"The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.\"",                                     note:"His mercies are new every morning — not every streak.",                                                          minMinutes:2,  phase:2 },
  { id:6,  ref:"Psalm 32:1–2",         verse:"\"Blessed is the one whose transgression is forgiven, whose sin is covered. Blessed is the man against whom the Lord counts no iniquity.\"",                                     note:"Notice the word \"blessed.\" Read both verses out loud.",                                                        minMinutes:2,  phase:2 },
  { id:7,  ref:"1 John 1:9",           verse:"\"If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.\"",                                                         note:"One verse. Read it, then sit in silence for thirty seconds.",                                                   minMinutes:2,  phase:2 },
  { id:8,  ref:"Luke 15:11–24",        verse:"Open your physical Bible to Luke 15:11–24.",                                                                                                                                     note:"The Prodigal Son's return. Read slowly. Notice when the father runs.",                                           minMinutes:5,  phase:3 },
  { id:9,  ref:"John 21:15–17",        verse:"Open your physical Bible to John 21:15–17.",                                                                                                                                     note:"Jesus restores Peter. Three questions — one for every denial. Then an assignment.",                              minMinutes:5,  phase:3 },
  { id:10, ref:"Psalm 51:1–12",        verse:"Open your physical Bible to Psalm 51:1–12.",                                                                                                                                     note:"David after Bathsheba. The most honest prayer of someone who knew they had failed.",                            minMinutes:5,  phase:3 },
  { id:11, ref:"Jonah 3:1–3",          verse:"Open your physical Bible to Jonah 3:1–3.",                                                                                                                                       note:"\"The word of the Lord came to Jonah a second time.\" The second time is the point.",                           minMinutes:5,  phase:3 },
  { id:12, ref:"1 Timothy 1:12–16",    verse:"Open your physical Bible to 1 Timothy 1:12–16.",                                                                                                                                 note:"Paul's testimony. Chief of sinners. Shown mercy. For exactly this reason.",                                     minMinutes:5,  phase:3 },
  { id:13, ref:"Hosea 2:14–15",        verse:"Open your physical Bible to Hosea 2:14–15.",                                                                                                                                     note:"God leads his people back through the wilderness and speaks tenderly to them there.",                            minMinutes:5,  phase:3 },
  { id:14, ref:"Psalm 103:8–14",       verse:"Open your physical Bible to Psalm 103:8–14.",                                                                                                                                    note:"He does not deal with us according to our sins. As far as east is from west.",                                  minMinutes:5,  phase:3 },
  { id:15, ref:"Luke 22:54–62",        verse:"Open your physical Bible to Luke 22:54–62.",                                                                                                                                     note:"Peter's denial. Read slowly. Notice the moment Jesus turns and looks at him.",                                  minMinutes:5,  phase:3 },
  { id:16, ref:"Isaiah 55:1–7",        verse:"Open your physical Bible to Isaiah 55:1–7.",                                                                                                                                     note:"Read this as an invitation written specifically for you.",                                                      minMinutes:8,  phase:4 },
  { id:17, ref:"Zephaniah 3:17",       verse:"Open your physical Bible to Zephaniah 3:17.",                                                                                                                                    note:"Read it three times. Let each phrase land before moving to the next.",                                          minMinutes:8,  phase:4 },
  { id:18, ref:"Joel 2:12–13",         verse:"Open your physical Bible to Joel 2:12–13.",                                                                                                                                      note:"Return to me with all your heart. Rend your hearts and not your garments.",                                     minMinutes:8,  phase:4 },
  { id:19, ref:"Revelation 2:1–5",     verse:"Open your physical Bible to Revelation 2:1–5.",                                                                                                                                  note:"The church that left their first love. Remember, repent, return.",                                              minMinutes:8,  phase:4 },
  { id:20, ref:"Isaiah 43:1–4",        verse:"Open your physical Bible to Isaiah 43:1–4.",                                                                                                                                     note:"Fear not. I have redeemed you. I have called you by name. You are mine.",                                       minMinutes:8,  phase:4 },
  { id:21, ref:"James 4:7–10",         verse:"Open your physical Bible to James 4:7–10.",                                                                                                                                      note:"Draw near to God and he will draw near to you. The promise is directional.",                                    minMinutes:8,  phase:4 },
  { id:22, ref:"Romans 8:26–39",       verse:"Open your physical Bible to Romans 8:26–39.",                                                                                                                                    note:"Nothing can separate us from the love of God. Read this as the closing argument.",                              minMinutes:10, phase:4 },
  { id:23, ref:"Ephesians 1",          verse:"Open your physical Bible to Ephesians 1.",                                                                                                                                       note:"Every spiritual blessing. Chosen. Adopted. Redeemed. Sealed.",                                                 minMinutes:12, phase:5 },
  { id:24, ref:"Romans 8",             verse:"Open your physical Bible to Romans 8.",                                                                                                                                          note:"You read verse 1 on Reading 1. Now read the whole chapter. It lands differently now.",                         minMinutes:12, phase:5 },
  { id:25, ref:"Colossians 3:1–17",    verse:"Open your physical Bible to Colossians 3:1–17.",                                                                                                                                 note:"Set your minds on things above. Put on the new self.",                                                         minMinutes:12, phase:5 },
  { id:26, ref:"Hebrews 12:1–3",       verse:"Open your physical Bible to Hebrews 12:1–3.",                                                                                                                                    note:"Since we are surrounded by so great a cloud of witnesses. Run with endurance.",                                 minMinutes:12, phase:5 },
  { id:27, ref:"Philippians 3:7–14",   verse:"Open your physical Bible to Philippians 3:7–14.",                                                                                                                                note:"Forgetting what lies behind. Straining forward. I press on.",                                                  minMinutes:15, phase:5 },
  { id:28, ref:"Psalm 27",             verse:"Open your physical Bible to Psalm 27.",                                                                                                                                          note:"The Lord is my light and my salvation. One thing I have asked.",                                               minMinutes:15, phase:5 },
  { id:29, ref:"John 15:1–11",         verse:"Open your physical Bible to John 15:1–11.",                                                                                                                                      note:"Abide in me. The word for what you've been building for 29 readings is abiding.",                              minMinutes:15, phase:5 },
  { id:30, ref:"Revelation 3:20",      verse:"\"Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in to him and eat with him, and he with me.\"",                               note:"Your last reading is an invitation. The full circle.",                                                          minMinutes:15, phase:5 },
];

const PHASE_WHY = {
  1: { title:"Why we start with one verse", body:"Every plan you've tried before started too high. Four chapters a day. Three chapters. Even one chapter felt like a mountain after years away. And when you missed a day, the debt piled up until quitting felt easier than catching up.\n\nSo this plan starts differently. One verse. That's it.\n\nNot because I think you're weak. Because I know what it's like to sit down after years away and have your mind wander before you've finished the first paragraph. Your brain isn't broken — it's just been away. And you don't rebuild by starting at the top. You rebuild by proving to yourself that showing up is possible.\n\nOne verse. Read it. Sit in it. That counts." },
  2: { title:"You showed up three times.", body:"That's not nothing — that's the hardest part.\n\nNow we go a little further. Two or three verses. Still short. Still easy. That's intentional.\n\nYour brain is building something right now — a connection between sitting down and opening your Bible. The more times you show up before it gets hard, the stronger that connection gets. So we keep the bar low a little longer. Trust the process." },
  3: { title:"Seven readings. Seven times you showed up.", body:"Something has shifted — even if you can't feel it yet. You've proven to yourself that showing up is possible. Now the plan goes deeper.\n\nThese next readings are the ones I wish someone had shown me when I was trying to come back. They're not random passages. Every single one is a story of someone who failed, drifted, or ran — and what God did next. Read them like evidence. Because that's exactly what they are." },
  4: { title:"You're past the halfway point.", body:"The passages from here shift focus. You've been reading about what God does with people who fail. Now you're going to read about who God says you are — not who shame says you are.\n\nThis is where the plan stops being about getting back to reading and starts being about who you become because you did." },
  5: { title:"You're almost there.", body:"These last readings are full chapters. Not because the bar had to go up — because you're ready. You've shown up enough times that this is who you are now.\n\nRead these slowly. You've earned the depth." },
};

const QUIZ = [
  { q:"What does the Return Reading Plan track instead of a streak?", options:["Chapters read","Days in a row","Returns","Minutes spent"], correct:2 },
  { q:"What is the only rule when you miss a reading?", options:["Start over from Reading 1","Never miss twice","Read double the next time","Skip it and move on"], correct:1 },
  { q:"Why does this plan start with just one verse?", options:["Because the Bible is hard to understand","To prove that showing up is possible before the bar rises","Because shorter is always better","To save time"], correct:1 },
];

const BADGES = [
  { id:"first_return",    label:"First Return",    emoji:"↩" },
  { id:"three_comebacks", label:"Three Comebacks", emoji:"🔥" },
  { id:"week_one",        label:"Week One",        emoji:"⭐" },
  { id:"halfway",         label:"Halfway Home",    emoji:"🏔" },
  { id:"the_return",      label:"The Return",      emoji:"✝" },
];

const STORAGE_KEY = "rrp_v3";
function loadState() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }
function freshState() {
  return {
    screen:"welcome", onboardingStep:0,
    firstName:"", email:"",
    anchor:"", location:"", pairing:"", day1Why:"",
    accountabilityName:"",
    midpointUnlocked:false,
    completionSubmitted:false,
    completedReadings:[], notes:{},
    returnCount:0, comebackCount:0, badges:[],
    lastCompletedId:null, missedBeforeLast:false,
  };
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.night};color:${C.parchment};font-family:'Montserrat',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;}
.wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:24px 16px 64px;background:${C.night};}
.card{width:100%;max-width:600px;background:${C.nightCard};border:1px solid ${C.nightBorder};border-radius:16px;padding:28px 24px;}
.stack{width:100%;max-width:600px;display:flex;flex-direction:column;gap:14px;}
@media(min-width:680px){.card{padding:36px 40px;}.wrap{padding:40px 32px 80px;}}
.eyebrow{font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:${C.terra};margin-bottom:10px;}
.h1{font-size:26px;font-weight:800;color:${C.linen};line-height:1.2;margin-bottom:14px;}
.h2{font-size:19px;font-weight:700;color:${C.linen};line-height:1.3;margin-bottom:10px;}
.h3{font-size:14px;font-weight:700;color:${C.linen};margin-bottom:6px;}
.body{font-size:13px;font-weight:400;color:${C.parchment};line-height:1.75;}
.muted{font-size:11px;color:${C.stone};line-height:1.6;}
.divider{border:none;border-top:1px solid ${C.nightBorder};margin:18px 0;}
.gold-line{height:1px;background:linear-gradient(90deg,transparent,${C.gold},transparent);margin:18px 0;}
.inp{width:100%;background:${C.night};border:1px solid ${C.nightBorder};border-radius:10px;color:${C.linen};font-family:'Montserrat',sans-serif;font-size:13px;padding:13px 15px;outline:none;transition:border-color .2s;resize:vertical;}
.inp:focus{border-color:${C.terra};}
.inp::placeholder{color:${C.stone};}
.btn{width:100%;background:${C.terra};color:${C.linen};border:none;border-radius:10px;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;padding:15px;cursor:pointer;transition:background .2s,transform .1s;}
.btn:hover{background:${C.terraLight};}
.btn:active{transform:scale(.98);}
.btn:disabled{opacity:.35;cursor:not-allowed;}
.btn-g{width:100%;background:transparent;color:${C.stone};border:1px solid ${C.nightBorder};border-radius:10px;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:500;padding:13px;cursor:pointer;transition:border-color .2s,color .2s;}
.btn-g:hover{border-color:${C.stone};color:${C.parchment};}
.path-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;}
.dot{aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;transition:background .3s;}
.dot.done{background:${C.terra};color:${C.linen};cursor:pointer;}
.dot.done:hover{background:${C.terraLight};}
.dot.cur{background:${C.goldDim};color:${C.gold};border:1px solid ${C.gold};cursor:pointer;}
.dot.fut{background:${C.nightBorder};color:${C.stone};}
.badge{display:inline-flex;align-items:center;gap:5px;background:${C.goldDim};border:1px solid ${C.gold};border-radius:20px;padding:4px 10px;font-size:10px;font-weight:600;color:${C.gold};}
.qopt{width:100%;background:${C.night};border:1px solid ${C.nightBorder};border-radius:10px;color:${C.parchment};font-family:'Montserrat',sans-serif;font-size:13px;font-weight:500;padding:13px 15px;cursor:pointer;text-align:left;transition:border-color .15s,background .15s;margin-bottom:8px;}
.qopt:hover{border-color:${C.terra};}
.qopt.ok{border-color:${C.green};background:${C.green}15;color:${C.green};}
.qopt.no{border-color:${C.red};background:${C.red}15;color:${C.red};}
.lock-wrap{position:relative;overflow:hidden;border:1px solid ${C.nightBorder};border-radius:16px;padding:28px 24px;background:${C.nightCard};}
.lock-ov{position:absolute;inset:0;background:${C.night}CC;backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border-radius:16px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.anim{animation:fadeIn .4s ease both;}
@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
.pop{animation:pop .5s ease;}
`;

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const cv = ref.current, ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const pts = Array.from({length:120},()=>({
      x:Math.random()*cv.width, y:Math.random()*-cv.height,
      r:Math.random()*6+3, d:Math.random()*2+1,
      col:[C.gold,C.terra,C.parchment,"#fff"][Math.floor(Math.random()*4)],
      ta:0, ts:Math.random()*.07+.05,
    }));
    let fr;
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p=>{ p.ta+=p.ts; p.y+=p.d+1; p.x+=Math.sin(p.ta)*2;
        ctx.beginPath(); ctx.fillStyle=p.col;
        ctx.ellipse(p.x,p.y,p.r,p.r/2,Math.sin(p.ta)*12,0,Math.PI*2); ctx.fill(); });
      fr=requestAnimationFrame(draw);
    };
    draw();
    const t=setTimeout(()=>cancelAnimationFrame(fr),3500);
    return()=>{cancelAnimationFrame(fr);clearTimeout(t);};
  },[active]);
  if(!active)return null;
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>;
}

// ── Hold Button ───────────────────────────────────────────────────────────────
function HoldBtn({ label, holdLabel, duration=3000, onComplete }) {
  const [prog,setProg]=useState(0),[holding,setHolding]=useState(false);
  const iRef=useRef(null),sRef=useRef(null);
  const start=useCallback(()=>{
    setHolding(true);sRef.current=Date.now();
    iRef.current=setInterval(()=>{
      const p=Math.min((Date.now()-sRef.current)/duration,1);
      setProg(p); if(p>=1){clearInterval(iRef.current);onComplete();}
    },16);
  },[duration,onComplete]);
  const stop=useCallback(()=>{setHolding(false);clearInterval(iRef.current);setProg(0);},[]);
  return(
    <div style={{position:"relative",width:"100%",height:64,borderRadius:10,overflow:"hidden",cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}}
      onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
      onTouchStart={e=>{e.preventDefault();start();}} onTouchEnd={stop}>
      <div style={{position:"absolute",inset:0,background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10}}/>
      <div style={{position:"absolute",inset:0,background:C.terra,transformOrigin:"left center",transform:`scaleX(${prog})`,borderRadius:10,opacity:prog>0?1:0}}/>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Montserrat,sans-serif",fontSize:14,fontWeight:700,color:C.linen,pointerEvents:"none"}}>
        {holding&&prog>0?(holdLabel||label):label}
      </div>
    </div>
  );
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function Timer({ minutes, onDone, onStart }) {
  const total=minutes*60;
  const [left,setLeft]=useState(total),[running,setRunning]=useState(false),[done,setDone]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(running&&left>0){
      ref.current=setInterval(()=>setLeft(l=>{
        if(l<=1){clearInterval(ref.current);setDone(true);setRunning(false);onDone();return 0;}
        return l-1;
      }),1000);
    }
    return()=>clearInterval(ref.current);
  },[running]);
  const pct=(total-left)/total, r=34, circ=2*Math.PI*r;
  const m=Math.floor(left/60),s=left%60;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
      <div style={{position:"relative",width:80,height:80}}>
        <svg style={{transform:"rotate(-90deg)"}} width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke={C.nightBorder} strokeWidth="4"/>
          <circle cx="40" cy="40" r={r} fill="none" stroke={done?C.green:C.terra} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
            style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Montserrat,sans-serif",fontSize:18,fontWeight:800,color:done?C.green:C.linen}}>
          {done?"✓":`${m}:${s.toString().padStart(2,"0")}`}
        </div>
      </div>
      {!done&&(
        <button onClick={()=>{if(!running)onStart();setRunning(r=>!r);}}
          style={{background:C.nightCard,border:`1px solid ${C.nightBorder}`,borderRadius:8,color:C.parchment,fontFamily:"Montserrat,sans-serif",fontSize:13,fontWeight:600,padding:"8px 20px",cursor:"pointer"}}>
          {running?"Pause":left===total?"Start Timer":"Resume"}
        </button>
      )}
      <p className="muted" style={{textAlign:"center"}}>
        {done?"Timer complete — write your reflection below.":`Minimum: ${minutes} min — read as long as you want.`}
      </p>
    </div>
  );
}

// ── Audio Player ──────────────────────────────────────────────────────────────
function AudioPlayer({ src }) {
  const [playing,setPlaying]=useState(false),[prog,setProg]=useState(0),[dur,setDur]=useState(0);
  const ref=useRef(null);
  const toggle=()=>{
    if(!ref.current)return;
    if(playing){ref.current.pause();setPlaying(false);}
    else{ref.current.play();setPlaying(true);}
  };
  const fmt=s=>`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;
  return(
    <div style={{background:C.night,border:`1px solid ${C.gold}`,borderRadius:12,padding:"18px 16px"}}>
      <audio ref={ref} src={src} crossOrigin="anonymous"
        onTimeUpdate={()=>setProg((ref.current.currentTime/ref.current.duration)||0)}
        onLoadedMetadata={()=>setDur(ref.current.duration||0)}
        onEnded={()=>setPlaying(false)}/>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <button onClick={toggle} style={{width:44,height:44,borderRadius:"50%",background:C.terra,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:C.linen,fontSize:16}}>{playing?"⏸":"▶"}</span>
        </button>
        <div style={{flex:1}}>
          <div style={{height:4,background:C.nightBorder,borderRadius:2,marginBottom:6}}>
            <div style={{height:4,background:C.gold,borderRadius:2,width:`${prog*100}%`,transition:"width .5s linear"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="muted">{fmt((prog*dur)||0)}</span>
            <span className="muted">{fmt(dur)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Formspree Midpoint Form ───────────────────────────────────────────────────
function MidpointForm({ savedName, savedEmail, onSuccess }) {
  const [name, setName] = useState(savedName || "");
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!name.trim() || !reflection.trim()) return;
    setSubmitting(true); setError(false);
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ "form-type": "Midpoint Reflection (Reading 15)", name, email: savedEmail, reflection }),
      });
      if (res.ok) { setDone(true); onSuccess(); }
      else setError(true);
    } catch { setError(true); }
    setSubmitting(false);
  };

  if (done) return (
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <p style={{fontSize:22,marginBottom:8}}>✓</p>
      <p className="body" style={{color:C.linen}}>Unlocking your message...</p>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <p className="h3">How has the first half of the plan been?</p>
      <p className="muted" style={{marginBottom:4}}>Be honest — what's worked, what's been hard. Your answer helps me make this better for the next person. It unlocks the audio message immediately.</p>
      <div>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>Your name</p>
        <input className="inp" placeholder="First name..." value={name} onChange={e=>setName(e.target.value)}/>
      </div>
      <div>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>Your experience so far</p>
        <textarea className="inp" rows={4} placeholder="What's working, what's been hard..." value={reflection} onChange={e=>setReflection(e.target.value)}/>
      </div>
      {error && <p style={{color:C.red,fontSize:11}}>Something went wrong. Please try again.</p>}
      <button className="btn" disabled={submitting||!name.trim()||!reflection.trim()} onClick={submit}>
        {submitting?"Sending...":"Submit & Unlock →"}
      </button>
    </div>
  );
}

// ── Formspree Completion Form ─────────────────────────────────────────────────
function CompletionForm({ savedName, savedEmail, day1Why, returnCount, badges, onSuccess }) {
  const [name, setName] = useState(savedName || "");
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!name.trim() || !reflection.trim()) return;
    setSubmitting(true); setError(false);
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ "form-type": "Day 30 Testimonial", name, email: savedEmail, "day1-why": day1Why, reflection, "return-count": returnCount, badges: badges.join(", ") }),
      });
      if (res.ok) { setDone(true); onSuccess(); }
      else setError(true);
    } catch { setError(true); }
    setSubmitting(false);
  };

  if (done) return (
    <div style={{textAlign:"center",padding:"16px 0"}}>
      <p style={{fontSize:22,marginBottom:8}}>✓</p>
      <p className="body" style={{color:C.linen}}>Thank you. Your story matters.</p>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <p className="h3">Would you share what happened?</p>
      <p className="body" style={{marginTop:4,marginBottom:4}}>How many days did you end up reading? Did this plan help? Would you recommend it? Your story helps the next person who needs to come back.</p>
      <div>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>Your name</p>
        <input className="inp" placeholder="First name..." value={name} onChange={e=>setName(e.target.value)}/>
      </div>
      <div>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>Your honest experience</p>
        <textarea className="inp" rows={4} placeholder="What changed..." value={reflection} onChange={e=>setReflection(e.target.value)}/>
      </div>
      {error && <p style={{color:C.red,fontSize:11}}>Something went wrong. Please try again.</p>}
      <button className="btn" disabled={submitting||!name.trim()||!reflection.trim()} onClick={submit}>
        {submitting?"Sending...":"Send my story →"}
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function ReturnReadingPlan() {
  const [s, setS] = useState(() => loadState() || freshState());
  const [quizQ,setQuizQ]=useState(0),[quizAns,setQuizAns]=useState(null),[quizWrong,setQuizWrong]=useState([]);
  const [countAnim,setCountAnim]=useState(false);
  const [noteVal,setNoteVal]=useState("");
  const [timerDone,setTimerDone]=useState(false),[timerStarted,setTimerStarted]=useState(false);
  const [confetti,setConfetti]=useState(false);
  const [celebration,setCelebration]=useState(null);
  const [viewingId,setViewingId]=useState(null);

  useEffect(()=>{saveState(s);},[s]);
  const upd=p=>setS(prev=>({...prev,...p}));
  const boom=()=>{setConfetti(true);setTimeout(()=>setConfetti(false),4000);};

  const nextUnread=READINGS.find(r=>!s.completedReadings.includes(r.id));
  const currentReading=viewingId?READINGS.find(r=>r.id===viewingId):nextUnread;

  const completeReading=(id,note)=>{
    const wasMissed=s.lastCompletedId!==null&&id!==(s.lastCompletedId+1)&&!s.completedReadings.includes(s.lastCompletedId+1);
    const newCompleted=[...s.completedReadings,id];
    const newReturn=s.returnCount+1;
    const newComeback=wasMissed?s.comebackCount+1:s.comebackCount;
    const newNotes={...s.notes,[id]:note};
    const earned=[...s.badges];
    const isMilestone=newCompleted.length===7||newCompleted.length===15||newCompleted.length===30;
    if(wasMissed&&!earned.includes("first_return"))earned.push("first_return");
    if(newComeback>=3&&!earned.includes("three_comebacks"))earned.push("three_comebacks");
    if(newCompleted.length>=7&&!earned.includes("week_one"))earned.push("week_one");
    if(newCompleted.length>=15&&!earned.includes("halfway"))earned.push("halfway");
    if(newCompleted.length>=30&&!earned.includes("the_return"))earned.push("the_return");
    // Fire confetti immediately for milestones
    if(isMilestone)boom();
    setCountAnim(true);setTimeout(()=>setCountAnim(false),600);
    const msg=wasMissed?"You missed a day. You came back. That's the whole plan."
      :newCompleted.length===7?"Seven readings. The habit is forming. Keep going."
      :newCompleted.length===15?"Halfway. Something has shifted — even if you can't feel it yet."
      :newCompleted.length===30?"Thirty readings. You returned. That's who you are now."
      :"You showed up. That number never goes backward.";
    setCelebration({msg,returnCount:newReturn,comeback:wasMissed});
    let next="celebration";
    if(id===7&&!s.accountabilityName)next="accountability";
    else if(id===15)next="midpoint";
    else if(id===30)next="complete";
    // Delay screen transition on milestones so confetti is visible first
    const delay=isMilestone?1200:0;
    setTimeout(()=>{
      upd({completedReadings:newCompleted,returnCount:newReturn,comebackCount:newComeback,notes:newNotes,badges:earned,lastCompletedId:id,missedBeforeLast:wasMissed,screen:next});
    },delay);
    setNoteVal("");setTimerDone(false);setTimerStarted(false);setViewingId(null);
  };

  // ── WELCOME ──
  if(s.screen==="welcome") return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim" style={{textAlign:"center",marginTop:24}}>
        <p className="eyebrow">Christian Layne</p>
        <h1 className="h1" style={{fontSize:30}}>The Return<br/>Reading Plan</h1>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:8}}>Most plans fail you because they weren't built for where you are.</p>
        <p className="body" style={{marginBottom:28,fontWeight:600,color:C.linen}}>This one was.</p>
        <button className="btn" onClick={()=>upd({screen:"onboarding",onboardingStep:0})}>Begin →</button>
        {s.completedReadings.length>0&&<button className="btn-g" style={{marginTop:10}} onClick={()=>upd({screen:"plan"})}>Continue where I left off</button>}
      </div>
    </div>
  );

  // ── ONBOARDING ──
  if(s.screen==="onboarding"){
    const step=s.onboardingStep;

    if(step===0) return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Step 1 of 6 — Identity</p>
          <h2 className="h2">Who you are right now</h2>
          <p className="body" style={{marginBottom:20}}>Before anything else — one declaration. Not how you feel. Not who you've been. Who you're choosing to be from this moment.</p>
          <div style={{background:C.night,border:`1px solid ${C.gold}`,borderRadius:12,padding:"22px 18px",textAlign:"center",marginBottom:24}}>
            <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>Say this out loud before continuing</p>
            <p style={{fontSize:19,fontWeight:800,color:C.linen,lineHeight:1.4}}>"I am someone who<br/>returns to God's Word."</p>
          </div>
          <HoldBtn label="Hold to confirm — I said it" holdLabel="Confirming..." duration={3000} onComplete={()=>upd({onboardingStep:1})}/>
          <p className="muted" style={{textAlign:"center",marginTop:10}}>Hold for 3 seconds to continue</p>
        </div>
      </div>
    );

    if(step===1) return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Step 2 of 6 — Anchor</p>
          <h2 className="h2">When will you read?</h2>
          <p className="body" style={{marginBottom:8}}>The most reliable way to build a habit is to attach it to something you already do every day without thinking. Don't pick a time. Pick a trigger.</p>
          <p className="body" style={{marginBottom:20}}>When your trigger happens, reading happens with it.</p>
          <p style={{fontSize:13,fontWeight:600,color:C.linen,marginBottom:10}}>"I will read immediately after..."</p>
          <textarea className="inp" rows={2} placeholder="e.g. my morning coffee, brushing my teeth, getting into bed..." value={s.anchor} onChange={e=>upd({anchor:e.target.value})}/>
          <div style={{marginTop:18}}><button className="btn" disabled={!s.anchor.trim()} onClick={()=>upd({onboardingStep:2})}>Continue</button></div>
        </div>
      </div>
    );

    if(step===2) return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Step 3 of 6 — Location</p>
          <h2 className="h2">Where will your Bible live?</h2>
          <p className="body" style={{marginBottom:8}}>Research shows the single biggest predictor of whether you read is whether your Bible is visible before your phone is.</p>
          <p className="body" style={{marginBottom:20}}>This decision gets made once — right now — so you never have to make it in a moment of low motivation.</p>
          <p style={{fontSize:13,fontWeight:600,color:C.linen,marginBottom:10}}>"My Bible will live at..."</p>
          <textarea className="inp" rows={2} placeholder="e.g. on top of my phone on my nightstand, on the kitchen counter..." value={s.location} onChange={e=>upd({location:e.target.value})}/>
          <div style={{marginTop:18}}><button className="btn" disabled={!s.location.trim()} onClick={()=>upd({onboardingStep:3})}>Continue</button></div>
        </div>
      </div>
    );

    if(step===3) return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Step 4 of 6 — Pairing</p>
          <h2 className="h2">What will you pair with reading?</h2>
          <p className="body" style={{marginBottom:8}}>Pairing a habit with something you already enjoy creates an immediate reward before the spiritual payoff arrives. Over time your brain starts associating that sensory experience with opening your Bible.</p>
          <p style={{fontSize:13,fontWeight:600,color:C.linen,marginBottom:10}}>"I will pair reading with..."</p>
          <textarea className="inp" rows={2} placeholder="e.g. my morning coffee, a candle, my specific chair..." value={s.pairing} onChange={e=>upd({pairing:e.target.value})}/>
          <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
            <button className="btn" onClick={()=>upd({onboardingStep:4})}>Continue</button>
            <button className="btn-g" onClick={()=>upd({onboardingStep:4})}>Skip</button>
          </div>
        </div>
      </div>
    );

    if(step===4) return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Step 5 of 6 — The Rule</p>
          <h2 className="h2">The only rule</h2>
          <p className="body" style={{marginBottom:8}}>This plan is built for missing days. Missing is expected — not a failure. The only failure is what comes after missing: letting one missed day become two.</p>
          <p className="body" style={{marginBottom:20}}>This plan doesn't track streaks. It tracks <strong style={{color:C.linen}}>returns</strong>. Every time you open your Bible — including after a missed day — that number goes up. It never resets. Never goes backward.</p>
          <div style={{background:C.night,border:`1px solid ${C.terra}`,borderRadius:12,padding:"22px 18px",textAlign:"center",marginBottom:24}}>
            <p style={{fontSize:22,fontWeight:800,color:C.linen}}>Never miss twice.</p>
            <p className="muted" style={{marginTop:8}}>Miss a day? Come back the next one. That's it.</p>
          </div>
          <HoldBtn label="Hold to confirm — I understand" holdLabel="Locking it in..." duration={3000} onComplete={()=>upd({onboardingStep:5})}/>
          <p className="muted" style={{textAlign:"center",marginTop:10}}>Hold for 3 seconds to continue</p>
        </div>
      </div>
    );

    if(step===5) return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Step 6 of 6 — Why One Verse</p>
          <h2 className="h2">{PHASE_WHY[1].title}</h2>
          {PHASE_WHY[1].body.split("\n\n").map((p,i)=><p key={i} className="body" style={{marginBottom:12}}>{p}</p>)}
          <div style={{marginTop:8}}><button className="btn" onClick={()=>upd({screen:"quiz"})}>I'm ready →</button></div>
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  if(s.screen==="quiz"){
    const q=QUIZ[quizQ];
    return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <p className="eyebrow">Quick Check — {quizQ+1} of {QUIZ.length}</p>
          <h2 className="h2" style={{marginBottom:20}}>{q.q}</h2>
          {q.options.map((opt,i)=>(
            <button key={i}
              className={`qopt${quizAns===i?(i===q.correct?" ok":" no"):""}${quizWrong.includes(i)?" no":""}`}
              onClick={()=>{
                if(quizAns!==null)return;
                setQuizAns(i);
                if(i===q.correct){
                  setTimeout(()=>{
                    if(quizQ<QUIZ.length-1){setQuizQ(quizQ+1);setQuizAns(null);setQuizWrong([]);}
                    else upd({screen:"day1prompt"});
                  },700);
                }else{setQuizWrong(p=>[...p,i]);setTimeout(()=>setQuizAns(null),600);}
              }}>{opt}</button>
          ))}
          {quizAns!==null&&quizAns===QUIZ[quizQ].correct&&<p style={{color:C.green,fontSize:12,fontWeight:600,marginTop:6,textAlign:"center"}}>Correct ✓</p>}
        </div>
      </div>
    );
  }

  // ── DAY 1 PROMPT ──
  if(s.screen==="day1prompt") return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim">
        <p className="eyebrow">Before Reading 1</p>
        <h2 className="h2">What makes today your day one?</h2>
        <p className="body" style={{marginBottom:20}}>I'll show this back to you on Reading 30. It doesn't have to be profound — just honest.</p>
        <textarea className="inp" rows={4} placeholder="Why today? What do you want to be different by Reading 30?" value={s.day1Why} onChange={e=>upd({day1Why:e.target.value})}/>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,margin:"16px 0 6px"}}>Your first name</p>
        <input className="inp" placeholder="First name..." value={s.firstName} onChange={e=>upd({firstName:e.target.value})}/>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,margin:"12px 0 6px"}}>Your email</p>
        <input className="inp" type="email" placeholder="email@example.com" value={s.email} onChange={e=>upd({email:e.target.value})}/>
        <p className="muted" style={{marginTop:6,marginBottom:18}}>Your progress saves on this device. Your email is only used if I need to reach you.</p>
        <button className="btn" disabled={!s.day1Why.trim()||!s.firstName.trim()} onClick={()=>{ fetch(`https://formspree.io/f/${FORM_ID}`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({"form-type":"Day 1 Start",name:s.firstName,email:s.email,"day1-why":s.day1Why})}).catch(()=>{}); upd({screen:"plan"}); }}>Your plan is ready →</button>
      </div>
    </div>
  );

  // ── CELEBRATION ──
  if(s.screen==="celebration"){
    const cel=celebration;
    return(
      <div className="wrap"><style>{css}</style>
        <Confetti active={confetti}/>
        <div className="card anim" style={{textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:14}}>{cel?.comeback?"↩":"✓"}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:18}}>
            <div className={countAnim?"pop":""} style={{fontSize:52,fontWeight:800,color:C.gold,lineHeight:1}}>{s.returnCount}</div>
            <div style={{textAlign:"left"}}>
              <p style={{fontWeight:700,color:C.linen,fontSize:13}}>Returns</p>
              <p className="muted">Never goes backward</p>
            </div>
          </div>
          <p className="body" style={{marginBottom:20,fontStyle:"italic",color:C.linen}}>"{cel?.msg}"</p>
          {s.badges.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:20}}>
              {s.badges.map(bid=>{const b=BADGES.find(x=>x.id===bid);return b?<span key={bid} className="badge">{b.emoji} {b.label}</span>:null;})}
            </div>
          )}
          <button className="btn" onClick={()=>{
            const nid=s.completedReadings.length>=30?null:Math.max(...s.completedReadings)+1;
            if(s.completedReadings.length>=30)upd({screen:"complete"});
            else if(nid===8&&!s.accountabilityName)upd({screen:"accountability"});
            else upd({screen:"plan"});
          }}>Continue →</button>
        </div>
      </div>
    );
  }

  // ── ACCOUNTABILITY ──
  if(s.screen==="accountability") return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim">
        <p className="eyebrow">Reading 7 Complete</p>
        <h2 className="h2">Seven times you showed up.</h2>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:8}}>Research shows that people who tell someone else about a commitment are significantly more likely to follow through than people who keep it to themselves.</p>
        <p className="body" style={{marginBottom:20}}>Just tell one person: <em style={{color:C.linen}}>"I've been reading my Bible consistently for the first time in a long time."</em></p>
        <p style={{fontSize:13,fontWeight:600,color:C.linen,marginBottom:10}}>Who will you tell?</p>
        <input className="inp" placeholder="Their name..." value={s.accountabilityName} onChange={e=>upd({accountabilityName:e.target.value})}/>
        <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
          <button className="btn" disabled={!s.accountabilityName.trim()} onClick={()=>upd({screen:"plan"})}>Continue to Reading 8</button>
          <button className="btn-g" onClick={()=>upd({screen:"plan"})}>Skip for now</button>
        </div>
      </div>
    </div>
  );

  // ── MIDPOINT ──
  if(s.screen==="midpoint") return(
    <div className="wrap"><style>{css}</style>
      <div className="stack">
        <Confetti active={confetti}/>
        <div className="card anim" style={{borderColor:C.gold}}>
          <p className="eyebrow">Reading 15 Complete</p>
          <h2 className="h2">You're past the halfway point.</h2>
          <div className="gold-line"/>
          {PHASE_WHY[4].body.split("\n\n").map((p,i)=><p key={i} className="body" style={{marginBottom:10}}>{p}</p>)}
        </div>

        <div className="lock-wrap">
          <p className="eyebrow" style={{marginBottom:8}}>From Christian — Halfway Message</p>
          <p className="h3">A personal audio message for everyone who makes it to Reading 15</p>
          <p className="body" style={{marginBottom:16,marginTop:6}}>Something I recorded specifically for this moment in the plan.</p>
          {s.midpointUnlocked
            ? <AudioPlayer src={AUDIO_URL}/>
            : <>
                <div style={{filter:"blur(6px)",pointerEvents:"none"}}>
                  <div style={{height:64,background:C.night,borderRadius:12,border:`1px solid ${C.gold}`}}/>
                </div>
                <div className="lock-ov">
                  <span style={{fontSize:28}}>🔒</span>
                  <p style={{fontSize:13,fontWeight:700,color:C.linen,textAlign:"center",maxWidth:240}}>Share your experience to unlock</p>
                </div>
              </>
          }
        </div>

        {!s.midpointUnlocked&&(
          <div className="card anim">
            <MidpointForm
              savedName={s.firstName}
              savedEmail={s.email}
              onSuccess={()=>upd({midpointUnlocked:true})}
            />
          </div>
        )}

        <button className="btn" onClick={()=>upd({screen:"plan"})}>Continue to Reading 16 →</button>
      </div>
    </div>
  );

  // ── READING ──
  if(s.screen==="reading"){
    const reading=currentReading;
    if(!reading){upd({screen:"plan"});return null;}
    const isReview=s.completedReadings.includes(reading.id);
    return(
      <div className="wrap"><style>{css}</style>
        <div className="stack">
          <div className="card anim">
            <p className="eyebrow">Reading {reading.id} of 30{isReview?" — Review":""}</p>
            <h2 className="h2">{reading.ref}</h2>
            <div className="gold-line"/>
            <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"16px 14px",marginBottom:16}}>
              <p className="body" style={{fontStyle:"italic",color:C.linen,lineHeight:1.8}}>{reading.verse}</p>
              {reading.phase>1&&(
                <p className="muted" style={{marginTop:10,borderTop:`1px solid ${C.nightBorder}`,paddingTop:8}}>
                  📖 Use a physical Bible if possible — it removes the phone from the equation entirely.
                </p>
              )}
            </div>
            <p className="body" style={{marginBottom:20,color:C.stone}}>{reading.note}</p>
            {!isReview&&<Timer minutes={reading.minMinutes} onDone={()=>setTimerDone(true)} onStart={()=>setTimerStarted(true)}/>}
          </div>

          {!isReview&&(
            <div className="card anim">
              <p className="eyebrow" style={{marginBottom:8}}>After Reading</p>
              <p className="h3">What's one thing you noticed?</p>
              <p className="muted" style={{marginBottom:14}}>A word, a phrase, a question — anything. One sentence is enough.</p>
              <textarea className="inp" rows={3} placeholder="Write anything that stood out..." value={noteVal} onChange={e=>setNoteVal(e.target.value)}/>
              <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:10}}>
                <button className="btn" disabled={!noteVal.trim()||(timerStarted&&!timerDone)} onClick={()=>completeReading(reading.id,noteVal)}>
                  {timerStarted&&!timerDone?"Finish the timer first":"Mark as complete ↑"}
                </button>
                <button className="btn-g" onClick={()=>{setViewingId(null);upd({screen:"plan"});}}>← Back to plan</button>
              </div>
            </div>
          )}

          {isReview&&(
            <div className="card anim">
              <p className="eyebrow" style={{marginBottom:8}}>Your Note</p>
              <p className="body" style={{fontStyle:"italic",color:C.linen}}>"{s.notes[reading.id]||"No note recorded."}"</p>
              <div style={{marginTop:16}}><button className="btn-g" onClick={()=>{setViewingId(null);upd({screen:"plan"});}}>← Back to plan</button></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PLAN DASHBOARD ──
  if(s.screen==="plan"){
    const next=READINGS.find(r=>!s.completedReadings.includes(r.id));
    const lastPhase=s.lastCompletedId?READINGS.find(r=>r.id===s.lastCompletedId)?.phase:null;
    const nextPhase=next?.phase;
    const phaseJump=lastPhase&&nextPhase&&lastPhase!==nextPhase;
    return(
      <div className="wrap"><style>{css}</style>
        <Confetti active={confetti}/>
        <div className="stack">
          <div className="card anim" style={{textAlign:"center",padding:"22px 20px"}}>
            <p className="eyebrow">The Return Reading Plan</p>
            <h1 className="h1" style={{fontSize:20,marginBottom:4}}>{next?`Reading ${next.id} of 30`:"Complete — keep going"}</h1>
            <p className="muted">{s.completedReadings.length} readings complete</p>
          </div>

          <div className="card anim">
            <p className="eyebrow" style={{marginBottom:10}}>Your Return Count</p>
            <div style={{display:"flex",alignItems:"center",gap:16,background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:12,padding:"14px 18px"}}>
              <div className={countAnim?"pop":""} style={{fontSize:44,fontWeight:800,color:C.gold,lineHeight:1,minWidth:52}}>{s.returnCount}</div>
              <div>
                <p style={{fontWeight:700,color:C.linen,fontSize:13,marginBottom:2}}>{s.returnCount===0?"Ready to begin":s.returnCount===1?"First return":"Returns to God's Word"}</p>
                <p className="muted">This number never goes backward</p>
              </div>
            </div>
            {s.missedBeforeLast&&(
              <div style={{marginTop:10,background:C.goldDim,border:`1px solid ${C.gold}`,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
                <span>↩</span><p style={{fontSize:11,fontWeight:600,color:C.gold}}>You came back. That's what matters.</p>
              </div>
            )}
          </div>

          {s.badges.length>0&&(
            <div className="card anim">
              <p className="eyebrow" style={{marginBottom:10}}>Badges Earned</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {s.badges.map(bid=>{const b=BADGES.find(x=>x.id===bid);return b?<span key={bid} className="badge">{b.emoji} {b.label}</span>:null;})}
              </div>
            </div>
          )}

          <div className="card anim">
            <p className="eyebrow" style={{marginBottom:10}}>Your Path</p>
            <div className="path-grid">
              {READINGS.map(r=>{
                const done=s.completedReadings.includes(r.id),isCur=next?.id===r.id;
                return(
                  <div key={r.id} className={`dot ${done?"done":isCur?"cur":"fut"}`}
                    onClick={()=>{if(done||isCur){setViewingId(r.id);setTimerDone(false);setTimerStarted(false);upd({screen:"reading"});}}}
                    title={done?`Reading ${r.id} — tap to review`:isCur?`Reading ${r.id} — tap to begin`:`Reading ${r.id}`}>
                    {r.id}
                  </div>
                );
              })}
            </div>
            <p className="muted" style={{marginTop:10,textAlign:"center"}}>Tap any completed reading to review your note.</p>
          </div>

          {next&&phaseJump&&PHASE_WHY[nextPhase]&&(
            <div className="card anim" style={{borderColor:C.terra}}>
              <p className="eyebrow" style={{marginBottom:8}}>From Christian</p>
              <p className="h3" style={{marginBottom:10}}>{PHASE_WHY[nextPhase].title}</p>
              {PHASE_WHY[nextPhase].body.split("\n\n").map((p,i)=><p key={i} className="body" style={{marginBottom:10}}>{p}</p>)}
            </div>
          )}

          {next&&(
            <div className="card anim" style={{borderColor:C.terra}}>
              <p className="eyebrow" style={{marginBottom:6}}>Up Next</p>
              <h2 className="h2" style={{marginBottom:4}}>{next.ref}</h2>
              <p className="body" style={{marginBottom:18,color:C.stone}}>{next.note}</p>
              <button className="btn" onClick={()=>{setViewingId(null);setTimerDone(false);setTimerStarted(false);upd({screen:"reading"});}}>
                Begin Reading {next.id} →
              </button>
            </div>
          )}

          <div className="card anim" style={{padding:"16px 20px"}}>
            <p style={{fontSize:10,fontWeight:600,color:C.stone,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Your Setup</p>
            <p className="body" style={{fontSize:12}}>📖 After: <span style={{color:C.linen}}>{s.anchor||"—"}</span></p>
            <p className="body" style={{fontSize:12,marginTop:4}}>📍 Location: <span style={{color:C.linen}}>{s.location||"—"}</span></p>
            {s.pairing&&<p className="body" style={{fontSize:12,marginTop:4}}>☕ Pairing: <span style={{color:C.linen}}>{s.pairing}</span></p>}
          </div>

          <div style={{textAlign:"center",padding:"10px 0",borderTop:`1px solid ${C.nightBorder}`}}>
            <p style={{fontSize:11,fontWeight:700,color:C.stone}}>The only rule: never miss twice.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──
  if(s.screen==="complete") return(
    <div className="wrap"><style>{css}</style>
      <Confetti active={confetti}/>
      <div className="stack">
        <div className="card anim" style={{textAlign:"center"}}>
          <p className="eyebrow">Reading 30 Complete</p>
          <h1 className="h1">You returned.</h1>
          <div className="gold-line"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:20}}>
            <div style={{fontSize:52,fontWeight:800,color:C.gold,lineHeight:1}}>{s.returnCount}</div>
            <div style={{textAlign:"left"}}>
              <p style={{fontWeight:700,color:C.linen,fontSize:13}}>Total Returns</p>
              <p className="muted">This number never goes backward</p>
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
            {s.badges.map(bid=>{const b=BADGES.find(x=>x.id===bid);return b?<span key={bid} className="badge">{b.emoji} {b.label}</span>:null;})}
          </div>
        </div>

        {s.day1Why&&(
          <div className="card anim" style={{borderColor:C.gold}}>
            <p className="eyebrow" style={{color:C.gold,marginBottom:8}}>On Reading 1, you said...</p>
            <p className="body" style={{fontStyle:"italic",color:C.linen,marginBottom:12}}>"{s.day1Why}"</p>
            <hr className="divider"/>
            <p className="body">How does that feel now?</p>
          </div>
        )}

        <div className="card anim">
          {s.completionSubmitted
            ? <div style={{textAlign:"center",padding:"16px 0"}}><p style={{fontSize:22,marginBottom:8}}>✓</p><p className="body" style={{color:C.linen}}>Thank you. Your story matters.</p></div>
            : <CompletionForm
                savedName={s.firstName}
                savedEmail={s.email}
                day1Why={s.day1Why}
                returnCount={s.returnCount}
                badges={s.badges}
                onSuccess={()=>upd({completionSubmitted:true})}
              />
          }
        </div>

        <button className="btn" onClick={()=>upd({screen:"plan"})}>Keep going →</button>
        <button className="btn-g" onClick={()=>{const f=freshState();saveState(f);setS(f);}}>Start a new journey</button>
      </div>
    </div>
  );

  return null;
}
