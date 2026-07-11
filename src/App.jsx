import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  night:"#0D0F14", nightCard:"#13161C", nightBorder:"#1E2128",
  terra:"#A96E55", terraLight:"#C4865F",
  parchment:"#C8BFA0", linen:"#E8E4DC", stone:"#8A8A7A",
  gold:"#C8A96E", goldDim:"#C8A96E33",
  green:"#4CAF50", red:"#F44336",
  phase1:"#A96E55", phase2:"#8A7A55", phase3:"#557A6E", phase4:"#555A7A", phase5:"#7A5578",
};

const AUDIO_URL = "https://bible-comeback-plan.vercel.app/halfway-message.mp3";
const FORM_ID   = "xnjkerpn";

const READINGS = [
  {id:1,  ref:"Romans 8:1",           verse:'"There is therefore now no condemnation for those who are in Christ Jesus."',                                                                                                   note:"Read it out loud. Then sit in silence for thirty seconds.",                                              minMinutes:1,  phase:1},
  {id:2,  ref:"Hebrews 4:16",         verse:'"Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need."',                                          note:'Read it twice. Let "confidence" land.',                                                                  minMinutes:1,  phase:1},
  {id:3,  ref:"Psalm 34:18",          verse:'"The Lord is near to the brokenhearted and saves the crushed in spirit."',                                                                                                   note:"Read it slowly. Notice what it says about where God is.",                                                minMinutes:1,  phase:1},
  {id:4,  ref:"Romans 5:6–8",         verse:'"For while we were still weak, at the right time Christ died for the ungodly... God shows his love for us in that while we were still sinners, Christ died for us."',       note:'Three verses. Let "while we were still sinners" land.',                                                  minMinutes:2,  phase:2},
  {id:5,  ref:"Lamentations 3:22–23", verse:'"The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness."',                                  note:"His mercies are new every morning — not every streak.",                                                  minMinutes:2,  phase:2},
  {id:6,  ref:"Psalm 32:1–2",         verse:'"Blessed is the one whose transgression is forgiven, whose sin is covered. Blessed is the man against whom the Lord counts no iniquity."',                                  note:'Notice the word "blessed." Read both verses out loud.',                                                  minMinutes:2,  phase:2},
  {id:7,  ref:"1 John 1:9",           verse:'"If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness."',                                                      note:"One verse. Read it, then sit in silence for thirty seconds.",                                            minMinutes:2,  phase:2},
  {id:8,  ref:"Luke 15:11–24",        verse:"Open your physical Bible to Luke 15:11–24.",                                                                                                                                note:"The Prodigal Son's return. Read slowly. Notice when the father runs.",                                   minMinutes:5,  phase:3},
  {id:9,  ref:"John 21:15–17",        verse:"Open your physical Bible to John 21:15–17.",                                                                                                                                note:"Jesus restores Peter. Three questions — one for every denial. Then an assignment.",                      minMinutes:5,  phase:3},
  {id:10, ref:"Psalm 51:1–12",        verse:"Open your physical Bible to Psalm 51:1–12.",                                                                                                                                note:"David after Bathsheba. The most honest prayer of someone who knew they had failed.",                    minMinutes:5,  phase:3},
  {id:11, ref:"Jonah 3:1–3",          verse:"Open your physical Bible to Jonah 3:1–3.",                                                                                                                                  note:'"The word of the Lord came to Jonah a second time." The second time is the point.',                     minMinutes:5,  phase:3},
  {id:12, ref:"1 Timothy 1:12–16",    verse:"Open your physical Bible to 1 Timothy 1:12–16.",                                                                                                                            note:"Paul's testimony. Chief of sinners. Shown mercy. For exactly this reason.",                             minMinutes:5,  phase:3},
  {id:13, ref:"Hosea 2:14–15",        verse:"Open your physical Bible to Hosea 2:14–15.",                                                                                                                                note:"God leads his people back through the wilderness and speaks tenderly to them there.",                    minMinutes:5,  phase:3},
  {id:14, ref:"Psalm 103:8–14",       verse:"Open your physical Bible to Psalm 103:8–14.",                                                                                                                               note:"He does not deal with us according to our sins. As far as east is from west.",                          minMinutes:5,  phase:3},
  {id:15, ref:"Luke 22:54–62",        verse:"Open your physical Bible to Luke 22:54–62.",                                                                                                                                note:"Peter's denial. Read slowly. Notice the moment Jesus turns and looks at him.",                          minMinutes:5,  phase:3},
  {id:16, ref:"Isaiah 55:1–7",        verse:"Open your physical Bible to Isaiah 55:1–7.",                                                                                                                                note:"Read this as an invitation written specifically for you.",                                               minMinutes:8,  phase:4},
  {id:17, ref:"Zephaniah 3:17",       verse:"Open your physical Bible to Zephaniah 3:17.",                                                                                                                               note:"Read it three times. Let each phrase land before moving to the next.",                                   minMinutes:8,  phase:4},
  {id:18, ref:"Joel 2:12–13",         verse:"Open your physical Bible to Joel 2:12–13.",                                                                                                                                 note:"Return to me with all your heart. Rend your hearts and not your garments.",                             minMinutes:8,  phase:4},
  {id:19, ref:"Revelation 2:1–5",     verse:"Open your physical Bible to Revelation 2:1–5.",                                                                                                                             note:"The church that left their first love. Remember, repent, return.",                                       minMinutes:8,  phase:4},
  {id:20, ref:"Isaiah 43:1–4",        verse:"Open your physical Bible to Isaiah 43:1–4.",                                                                                                                                note:"Fear not. I have redeemed you. I have called you by name. You are mine.",                               minMinutes:8,  phase:4},
  {id:21, ref:"James 4:7–10",         verse:"Open your physical Bible to James 4:7–10.",                                                                                                                                 note:"Draw near to God and he will draw near to you. The promise is directional.",                            minMinutes:8,  phase:4},
  {id:22, ref:"Romans 8:26–39",       verse:"Open your physical Bible to Romans 8:26–39.",                                                                                                                               note:"Nothing can separate us from the love of God. Read this as the closing argument.",                      minMinutes:10, phase:4},
  {id:23, ref:"Ephesians 1",          verse:"Open your physical Bible to Ephesians 1.",                                                                                                                                  note:"Every spiritual blessing. Chosen. Adopted. Redeemed. Sealed.",                                          minMinutes:12, phase:5},
  {id:24, ref:"Romans 8",             verse:"Open your physical Bible to Romans 8.",                                                                                                                                     note:"You read verse 1 on Reading 1. Now read the whole chapter. It lands differently now.",                  minMinutes:12, phase:5},
  {id:25, ref:"Colossians 3:1–17",    verse:"Open your physical Bible to Colossians 3:1–17.",                                                                                                                            note:"Set your minds on things above. Put on the new self.",                                                  minMinutes:12, phase:5},
  {id:26, ref:"Hebrews 12:1–3",       verse:"Open your physical Bible to Hebrews 12:1–3.",                                                                                                                               note:"Since we are surrounded by so great a cloud of witnesses. Run with endurance.",                         minMinutes:12, phase:5},
  {id:27, ref:"Philippians 3:7–14",   verse:"Open your physical Bible to Philippians 3:7–14.",                                                                                                                           note:"Forgetting what lies behind. Straining forward. I press on.",                                           minMinutes:15, phase:5},
  {id:28, ref:"Psalm 27",             verse:"Open your physical Bible to Psalm 27.",                                                                                                                                     note:"The Lord is my light and my salvation. One thing I have asked.",                                        minMinutes:15, phase:5},
  {id:29, ref:"John 15:1–11",         verse:"Open your physical Bible to John 15:1–11.",                                                                                                                                 note:"Abide in me. The word for what you've been building for 29 readings is abiding.",                       minMinutes:15, phase:5},
  {id:30, ref:"Revelation 3:20",      verse:'"Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in to him and eat with him, and he with me."',                            note:"Your last reading is an invitation. The full circle.",                                                   minMinutes:15, phase:5},
];

const PHASE_LABELS = {1:"Phase 1 — One Verse",2:"Phase 2 — Two to Three Verses",3:"Phase 3 — Short Passages",4:"Phase 4 — Medium Passages",5:"Phase 5 — Full Chapters"};
const PHASE_COLORS = {1:C.phase1,2:C.phase2,3:C.phase3,4:C.phase4,5:C.phase5};
const PHASE_READING_RANGE = {1:[1,3],2:[4,7],3:[8,15],4:[16,22],5:[23,30]};

const PHASE_WHY = {
  1:{title:"Why we start with one verse",body:"Every plan you've tried before started too high. Four chapters a day. Three chapters. Even one chapter felt like a mountain after years away. And when you missed a day, the debt piled up until quitting felt easier than catching up.\n\nSo this plan starts differently. One verse. That's it.\n\nNot because I think you're weak. Because I know what it's like to sit down after years away and have your mind wander before you've finished the first paragraph. Your brain isn't broken — it's just been away. And you don't rebuild by starting at the top. You rebuild by proving to yourself that showing up is possible.\n\nOne verse. Read it. Sit in it. That counts."},
  2:{title:"You showed up three times.",body:"That's not nothing — that's the hardest part.\n\nNow we go a little further. Two or three verses. Still short. Still easy. That's intentional.\n\nYour brain is building something right now — a connection between sitting down and opening your Bible. The more times you show up before it gets hard, the stronger that connection gets. So we keep the bar low a little longer. Trust the process."},
  3:{title:"Seven readings. Seven times you showed up.",body:"Something has shifted — even if you can't feel it yet. You've proven to yourself that showing up is possible. Now the plan goes deeper.\n\nThese next readings are the ones I wish someone had shown me when I was trying to come back. They're not random passages. Every single one is a story of someone who failed, drifted, or ran — and what God did next. Read them like evidence. Because that's exactly what they are."},
  4:{title:"You've made it past the halfway point.",body:"I want to say something to you that I wish someone had said to me.\n\nYou might not feel any closer to God yet. The reading is happening, but the warmth, the sense of His presence, the closeness you remember — it might still feel far off. I want you to know that's completely normal. And it's not evidence that something is wrong.\n\nHere's what I've learned: feelings don't lead actions. Actions lead feelings. The closeness doesn't come first and then you start showing up. You show up first — even when it feels like nothing is happening — and eventually the feelings catch up.\n\nKeep returning to Scripture. Keep praying. Keep applying what you're reading. The feelings will follow. And one day soon you'll notice you've finally returned to the Lord."},
  5:{title:"You've earned this.",body:"These last readings are full chapters. Not because the bar had to go up — because you've earned the right to be here.\n\nYou've shown up consistently enough that sitting with a full chapter isn't overwhelming anymore. The habit is real now. And if you're honest, you probably want more than a few verses anyway.\n\nRead these slowly. Take your time. You've built the capacity for this. And the chapters ahead are worth it."},
};

const WHY_THIS_PASSAGE = {
  1:"Because the first thing your brain needs to hear after years away is not a command — it's a verdict. No condemnation. Now. As you are.",
  2:"Because shame tells you to stay away until you're ready. This verse says come with confidence. Those two things can't both be true. One of them is lying.",
  3:"Because your avatar is someone who is brokenhearted about the distance between where he is and where he wants to be with God. This is where God says he is near.",
  4:"Because the timing matters. Not after you cleaned yourself up. Not after you got consistent. While you were still a sinner. That's when God moved.",
  5:"Because the most dangerous lie in the drift is that God's patience has limits. This verse answers that lie with specific, concrete language. New every morning. Not every perfect week.",
  6:"Because guilt is supposed to lead somewhere — to the relief of forgiveness. This verse is what that relief actually feels like when it lands.",
  7:"Because confession is the action that breaks the silence between you and God. One verse. One action. That's all this reading asks.",
  8:"Because the father ran. Before the speech was finished. Before the son had proven anything. The father saw him from far off and ran. That's the posture of God toward you right now.",
  9:"Because Peter failed publicly, specifically, and repeatedly — and Jesus didn't bring it up to shame him. He asked a question. Then gave him an assignment. That's restoration.",
  10:"Because David wrote this after the worst thing he ever did. Not before he repented. In the middle of it. This is what honest prayer looks like from inside failure.",
  11:"Because the most important words in this passage are 'a second time.' God came back. That's exactly what you're doing right now.",
  12:"Because Paul called himself the chief of sinners — not as self-deprecation, but as proof. If mercy reached him, the argument for why it can't reach you collapses.",
  13:"Because God's response to his people's drift wasn't punishment first. It was wilderness — and in the wilderness he spoke tenderly. That's this moment in your life.",
  14:"Because you need to hear what God doesn't do. He doesn't deal with you according to your sins. He doesn't repay you according to your iniquities. As far as east is from west.",
  15:"Because Peter's story doesn't end at the denial. It ends at the shore. Jesus made breakfast. That's the God you're returning to.",
  16:"Because this is an invitation, not a command. Come. Everyone who thirsts. Come to the waters. The language is for someone who has been away and is being called back.",
  17:"Because this verse describes God's posture toward you in the present tense. He rejoices over you. He quiets you with his love. He exults over you with loud singing. Right now.",
  18:"Because repentance isn't a feeling — it's a direction. Rend your hearts, not your garments. God isn't looking for performance. He's looking for honesty.",
  19:"Because the church at Ephesus did everything right and still lost the one thing that mattered — their first love. The call back is the same call you're answering right now.",
  20:"Because God named you before you drifted. I have called you by name. You are mine. Past tense. That hasn't changed.",
  21:"Because the promise is directional. Draw near and he will draw near. The movement starts with you. But the response is guaranteed.",
  22:"Because after everything — after the drift, the shame, the failed attempts, the silence — nothing has separated you from the love of God. Paul makes the case completely. Read the whole thing.",
  23:"Because before you were backslidden you were chosen, adopted, redeemed, and sealed. The drift didn't change any of those. This chapter names everything you still are.",
  24:"Because you read verse 1 on Reading 1. No condemnation. Now you read the whole chapter. See what's between verse 1 and verse 39. That's the arc of the entire plan.",
  25:"Because you've been putting on the old self for years. This passage describes what putting on the new self actually looks like in practice. Specific. Actionable. Grace-based.",
  26:"Because you are surrounded by a cloud of witnesses — everyone who failed and came back and kept running. You are not the first. You are not alone. Run with endurance.",
  27:"Because Paul lost everything he built his identity around and called it garbage compared to knowing Christ. Forgetting what lies behind. Straining forward. This is the posture of return.",
  28:"Because one thing David asked — to dwell in the house of the Lord. Not to perform. Not to achieve. Just to be in God's presence. That's the desire underneath everything you've been building toward.",
  29:"Because abide is the word for what you've been building. Not perform. Not achieve. Not maintain a streak. Abide. Remain. Stay. That's it.",
  30:"Because the last reading is an invitation. He's been standing at the door the entire time. The whole plan has been walking you back to this moment.",
};

// Maintenance Mode — curated daily verses for post-plan consistency
const MAINTENANCE_VERSES = [
  {ref:"Psalm 1:2",    verse:"His delight is in the law of the Lord, and on his law he meditates day and night."},
  {ref:"Joshua 1:8",  verse:"This Book of the Law shall not depart from your mouth, but you shall meditate on it day and night."},
  {ref:"Romans 12:2", verse:"Do not be conformed to this world, but be transformed by the renewal of your mind."},
  {ref:"Colossians 3:16", verse:"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom."},
  {ref:"Psalm 119:11", verse:"I have stored up your word in my heart, that I might not sin against you."},
  {ref:"Isaiah 40:8",  verse:"The grass withers, the flower fades, but the word of our God will stand forever."},
  {ref:"2 Timothy 3:16", verse:"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness."},
  {ref:"Hebrews 4:12", verse:"For the word of God is living and active, sharper than any two-edged sword."},
  {ref:"Matthew 4:4",  verse:"Man shall not live by bread alone, but by every word that comes from the mouth of God."},
  {ref:"Psalm 119:105",verse:"Your word is a lamp to my feet and a light to my path."},
  {ref:"John 8:31–32", verse:"If you abide in my word, you are truly my disciples, and you will know the truth, and the truth will set you free."},
  {ref:"Romans 15:4",  verse:"For whatever was written in former days was written for our instruction, that through endurance and through the encouragement of the Scriptures we might have hope."},
  {ref:"Deuteronomy 6:6", verse:"These words that I command you today shall be on your heart."},
  {ref:"Psalm 19:7",   verse:"The law of the Lord is perfect, reviving the soul; the testimony of the Lord is sure, making wise the simple."},
  {ref:"James 1:22",   verse:"But be doers of the word, and not hearers only, deceiving yourselves."},
  {ref:"1 Peter 2:2",  verse:"Like newborn infants, long for the pure spiritual milk, that by it you may grow up into salvation."},
  {ref:"Psalm 119:18", verse:"Open my eyes, that I may behold wondrous things out of your law."},
  {ref:"Proverbs 30:5",verse:"Every word of God proves true; he is a shield to those who take refuge in him."},
  {ref:"Luke 11:28",   verse:"Blessed are those who hear the word of God and keep it."},
  {ref:"Acts 17:11",   verse:"They received the word with all eagerness, examining the Scriptures daily to see if these things were so."},
  {ref:"Psalm 119:97", verse:"Oh how I love your law! It is my meditation all the day."},
  {ref:"John 15:7",    verse:"If you abide in me, and my words abide in you, ask whatever you wish, and it will be done for you."},
  {ref:"Romans 10:17", verse:"Faith comes from hearing, and hearing through the word of Christ."},
  {ref:"Psalm 119:130",verse:"The unfolding of your words gives light; it imparts understanding to the simple."},
  {ref:"Isaiah 55:11", verse:"So shall my word be that goes out from my mouth; it shall not return to me empty."},
  {ref:"Matthew 24:35",verse:"Heaven and earth will pass away, but my words will not pass away."},
  {ref:"Psalm 33:4",   verse:"For the word of the Lord is upright, and all his work is done in faithfulness."},
  {ref:"Ephesians 6:17",verse:"Take the helmet of salvation, and the sword of the Spirit, which is the word of God."},
  {ref:"Psalm 119:162",verse:"I rejoice at your word like one who finds great spoil."},
  {ref:"John 17:17",   verse:"Sanctify them in the truth; your word is truth."},
];

// Expectation alignment — not graded, auto-advances after revealing answer
const EXPECTATIONS = [
  {
    q:"What does this plan track instead of streaks?",
    reveal:"Returns. Every time you open your Bible — including after missing days — your return count goes up. It never goes backward. A missed day doesn't erase anything.",
    emoji:"↩"
  },
  {
    q:"What's the only rule when you miss a reading?",
    reveal:"Never miss twice. Missing once is human. The plan is built for it. The only failure is letting one missed day become two — and even then, the plan still doesn't expire.",
    emoji:"📖"
  },
  {
    q:"What if you don't feel anything when you read?",
    reveal:"That's normal — especially early on. Feelings follow actions, not the other way around. The win isn't feeling something. The win is showing up. That's the whole metric.",
    emoji:"🤍"
  },
];

const BADGES = [
  {id:"first_return",    label:"First Return",    emoji:"↩"},
  {id:"three_comebacks", label:"Three Comebacks", emoji:"🔥"},
  {id:"week_one",        label:"Week One",        emoji:"⭐"},
  {id:"phase2_done",     label:"Phase 2 Done",    emoji:"📖"},
  {id:"phase3_done",     label:"Phase 3 Done",    emoji:"🔑"},
  {id:"halfway",         label:"Halfway Home",    emoji:"🏔"},
  {id:"phase4_done",     label:"Phase 4 Done",    emoji:"🛡"},
  {id:"the_return",      label:"The Return",      emoji:"✝"},
];

const STORAGE_KEY = "rrp_v7";
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):null;}catch{return null;}}
function saveState(s){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch{}}
function freshState(){
  return{
    screen:"welcome",onboardingStep:0,
    firstName:"",email:"",
    anchor:"",location:"",pairing:"",day1Why:"",
    accountabilityName:"",
    midpointUnlocked:false,dismissedPhaseMsg:null,
    completionSubmitted:false,confirmReset:false,
    editingSetup:false,
    completedReadings:[],notes:{},
    returnCount:0,comebackCount:0,currentRun:0,bestRun:0,totalMinutes:0,badges:[],
    lastCompletedId:null,missedBeforeLast:false,
    showJournal:false,showComeback:false,
    lastReadingTimestamp:null,longAbsenceShown:false,
    reading5CheckinDone:false,vision30:"",
    maintenanceDay:0,maintenanceMode:false,reading11Done:false,
  };
}

async function submitForm(data){
  try{
    const res=await fetch(`https://formspree.io/f/${FORM_ID}`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)});
    return res.ok;
  }catch{return false;}
}

// ── helpers ────────────────────────────────────────────────────────────────────
function calcRun(completedReadings){
  if(!completedReadings.length)return 0;
  const sorted=[...completedReadings].sort((a,b)=>a-b);
  let run=1,max=1;
  for(let i=1;i<sorted.length;i++){
    if(sorted[i]===sorted[i-1]+1)run++;else run=1;
    if(run>max)max=run;
  }
  // current run = how many consecutive from the end
  let cur=1;
  for(let i=sorted.length-1;i>0;i--){
    if(sorted[i]===sorted[i-1]+1)cur++;else break;
  }
  return{current:cur,best:max};
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const css=`
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
.body{font-size:13px;color:${C.parchment};line-height:1.75;}
.muted{font-size:11px;color:${C.stone};line-height:1.6;}
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
.btn-back{background:none;border:none;color:${C.stone};font-family:'Montserrat',sans-serif;font-size:12px;font-weight:600;cursor:pointer;padding:0;display:flex;align-items:center;gap:6px;margin-bottom:20px;}
.btn-back:hover{color:${C.parchment};}
.path-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;}
.dot{aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;cursor:default;transition:background .3s;min-width:32px;}
.dot.done{color:${C.linen};cursor:pointer;}
.dot.cur{background:${C.goldDim};color:${C.gold};border:1px solid ${C.gold};cursor:pointer;}
.dot.fut{background:${C.nightBorder};color:${C.stone};}
.badge{display:inline-flex;align-items:center;gap:5px;background:${C.goldDim};border:1px solid ${C.gold};border-radius:20px;padding:4px 10px;font-size:10px;font-weight:600;color:${C.gold};}
.qopt{width:100%;background:${C.night};border:1px solid ${C.nightBorder};border-radius:10px;color:${C.parchment};font-family:'Montserrat',sans-serif;font-size:13px;font-weight:500;padding:13px 15px;cursor:pointer;text-align:left;transition:border-color .15s,background .15s;margin-bottom:8px;}
.qopt:hover:not(:disabled){border-color:${C.terra};}
.qopt:disabled{cursor:not-allowed;opacity:.6;}
.qopt.ok{border-color:${C.green};background:${C.green}15;color:${C.green};}
.qopt.no{border-color:${C.red};background:${C.red}15;color:${C.red};}
.lock-wrap{position:relative;overflow:hidden;border:1px solid ${C.nightBorder};border-radius:16px;padding:28px 24px;background:${C.nightCard};}
.lock-ov{position:absolute;inset:0;background:${C.night}CC;backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border-radius:16px;}
.footer-note{text-align:center;padding:20px 0 0;border-top:1px solid ${C.nightBorder};}
.journal-entry{border-bottom:1px solid ${C.nightBorder};padding:14px 0;}
.journal-entry:last-child{border-bottom:none;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.anim{animation:fadeIn .4s ease both;}
@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
.pop{animation:pop .5s ease;}
@keyframes comebackPulse{0%{opacity:0;transform:scale(.8);}60%{transform:scale(1.05);}100%{opacity:1;transform:scale(1);}}
.comeback-anim{animation:comebackPulse .6s ease both;}
`;

// ── Confetti ───────────────────────────────────────────────────────────────────
function Confetti({active}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active||!ref.current)return;
    const cv=ref.current,ctx=cv.getContext("2d");
    cv.width=window.innerWidth;cv.height=window.innerHeight;
    const pts=Array.from({length:140},()=>({x:Math.random()*cv.width,y:Math.random()*-cv.height,r:Math.random()*6+3,d:Math.random()*2+1,col:[C.gold,C.terra,C.parchment,"#fff"][Math.floor(Math.random()*4)],ta:0,ts:Math.random()*.07+.05}));
    let fr;
    const draw=()=>{ctx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{p.ta+=p.ts;p.y+=p.d+1;p.x+=Math.sin(p.ta)*2;ctx.beginPath();ctx.fillStyle=p.col;ctx.ellipse(p.x,p.y,p.r,p.r/2,Math.sin(p.ta)*12,0,Math.PI*2);ctx.fill();});fr=requestAnimationFrame(draw);};
    draw();const t=setTimeout(()=>cancelAnimationFrame(fr),3500);
    return()=>{cancelAnimationFrame(fr);clearTimeout(t);};
  },[active]);
  if(!active)return null;
  return<canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>;
}

// ── HoldBtn ────────────────────────────────────────────────────────────────────
function HoldBtn({label,holdLabel,duration=3000,onComplete}){
  const [prog,setProg]=useState(0),[holding,setHolding]=useState(false);
  const iRef=useRef(null),sRef=useRef(null);
  const start=useCallback(()=>{setHolding(true);sRef.current=Date.now();iRef.current=setInterval(()=>{const p=Math.min((Date.now()-sRef.current)/duration,1);setProg(p);if(p>=1){clearInterval(iRef.current);onComplete();}},16);},[duration,onComplete]);
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

// ── Timer ──────────────────────────────────────────────────────────────────────
function Timer({minutes,onDone,onStart}){
  const total=minutes*60;
  const [left,setLeft]=useState(total),[running,setRunning]=useState(false),[done,setDone]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(running&&left>0){ref.current=setInterval(()=>setLeft(l=>{if(l<=1){clearInterval(ref.current);setDone(true);setRunning(false);onDone();return 0;}return l-1;}),1000);}
    return()=>clearInterval(ref.current);
  },[running]);
  const pct=(total-left)/total,r=34,circ=2*Math.PI*r,m=Math.floor(left/60),s2=left%60;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
      <div style={{position:"relative",width:80,height:80}}>
        <svg style={{transform:"rotate(-90deg)"}} width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke={C.nightBorder} strokeWidth="4"/>
          <circle cx="40" cy="40" r={r} fill="none" stroke={done?C.green:C.terra} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Montserrat,sans-serif",fontSize:18,fontWeight:800,color:done?C.green:C.linen}}>
          {done?"✓":`${m}:${s2.toString().padStart(2,"0")}`}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        {!done&&<button onClick={()=>{if(!running)onStart();setRunning(r=>!r);}} style={{background:C.nightCard,border:`1px solid ${C.nightBorder}`,borderRadius:8,color:C.parchment,fontFamily:"Montserrat,sans-serif",fontSize:12,fontWeight:600,padding:"8px 16px",cursor:"pointer"}}>{running?"Pause":left===total?"Start Timer":"Resume"}</button>}
        {running&&<button onClick={()=>{clearInterval(ref.current);setRunning(false);setDone(true);onDone();}} style={{background:"transparent",border:`1px solid ${C.nightBorder}`,borderRadius:8,color:C.stone,fontFamily:"Montserrat,sans-serif",fontSize:12,fontWeight:600,padding:"8px 16px",cursor:"pointer"}}>Skip</button>}
      </div>
      <p className="muted" style={{textAlign:"center"}}>{done?"Timer complete — write your reflection below.":`Minimum: ${minutes} min — read as long as you want.`}</p>
    </div>
  );
}

// ── Audio Player ───────────────────────────────────────────────────────────────
function AudioPlayer({src}){
  const [playing,setPlaying]=useState(false),[prog,setProg]=useState(0),[dur,setDur]=useState(0);
  const ref=useRef(null);
  const toggle=()=>{if(!ref.current)return;if(playing){ref.current.pause();setPlaying(false);}else{ref.current.play();setPlaying(true);}};
  const fmt=s=>`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;
  return(
    <div style={{background:C.night,border:`1px solid ${C.gold}`,borderRadius:12,padding:"18px 16px"}}>
      <audio ref={ref} src={src} crossOrigin="anonymous" onTimeUpdate={()=>setProg((ref.current.currentTime/ref.current.duration)||0)} onLoadedMetadata={()=>setDur(ref.current.duration||0)} onEnded={()=>setPlaying(false)}/>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <button onClick={toggle} style={{width:44,height:44,borderRadius:"50%",background:C.terra,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:C.linen,fontSize:16}}>{playing?"⏸":"▶"}</span>
        </button>
        <div style={{flex:1}}>
          <div style={{height:4,background:C.nightBorder,borderRadius:2,marginBottom:6}}><div style={{height:4,background:C.gold,borderRadius:2,width:`${prog*100}%`,transition:"width .5s linear"}}/></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span className="muted">{fmt((prog*dur)||0)}</span><span className="muted">{fmt(dur)}</span></div>
        </div>
      </div>
    </div>
  );
}

// ── Simple Form ────────────────────────────────────────────────────────────────
function SimpleForm({title,description,textLabel,textPlaceholder,submitLabel,formType,extraData,savedName,onSuccess}){
  const [name,setName]=useState(savedName||""),[text,setText]=useState("");
  const [submitting,setSubmitting]=useState(false),[error,setError]=useState(false),[done,setDone]=useState(false);
  const submit=async()=>{
    if(!name.trim()||!text.trim())return;
    setSubmitting(true);setError(false);
    const ok=await submitForm({"form-type":formType,name,text,...(extraData||{})});
    if(ok){setDone(true);setTimeout(()=>onSuccess(name,text),1500);}else setError(true);
    setSubmitting(false);
  };
  if(done)return(<div style={{textAlign:"center",padding:"20px 0"}}><p style={{fontSize:28,marginBottom:10}}>✓</p><p className="body" style={{color:C.linen,fontWeight:600}}>Received. Thank you.</p></div>);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {title&&<p className="h3">{title}</p>}
      {description&&<p className="body" style={{marginBottom:4}}>{description}</p>}
      <div><p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>Your name</p><input className="inp" placeholder="First name..." value={name} onChange={e=>setName(e.target.value)}/></div>
      <div><p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>{textLabel}</p><textarea className="inp" rows={4} placeholder={textPlaceholder} value={text} onChange={e=>setText(e.target.value)}/></div>
      {error&&<p style={{color:C.red,fontSize:11}}>Something went wrong. Please try again.</p>}
      <button className="btn" disabled={submitting||!name.trim()||!text.trim()} onClick={submit}>{submitting?"Sending...":submitLabel}</button>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer(){
  return(<div className="footer-note"><p className="muted">Questions? Email <a href="mailto:christian@christianlayne.co" style={{color:C.terra}}>christian@christianlayne.co</a></p></div>);
}

// ── Comeback Screen ────────────────────────────────────────────────────────────
function ComebackScreen({comebackCount,returnCount,onContinue}){
  return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim" style={{textAlign:"center",borderColor:C.gold}}>
        <div className="comeback-anim" style={{fontSize:64,marginBottom:16}}>↩</div>
        <h1 className="h1" style={{fontSize:28}}>You came back.</h1>
        <p className="body" style={{marginBottom:8,color:C.linen,fontWeight:600}}>That's harder than starting.</p>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:20}}>Most people who miss a day don't come back. You did. That's not a small thing — that's exactly what this plan was built around.</p>
        <div style={{display:"flex",gap:20,justifyContent:"center",marginBottom:28}}>
          <div>
            <div style={{fontSize:36,fontWeight:800,color:C.gold}}>{returnCount}</div>
            <p className="muted">Total Returns</p>
          </div>
          <div style={{width:1,background:C.nightBorder}}/>
          <div>
            <div style={{fontSize:36,fontWeight:800,color:C.terra}}>{comebackCount}</div>
            <p className="muted">Comebacks</p>
          </div>
        </div>
        <button className="btn" onClick={onContinue}>Keep going →</button>
        <Footer/>
      </div>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({current,total}){
  return(
    <div style={{width:"100%",height:3,background:C.nightBorder,borderRadius:2,marginBottom:28,overflow:"hidden"}}>
      <div style={{height:"100%",background:`linear-gradient(90deg,${C.terra},${C.gold})`,borderRadius:2,width:`${(current/total)*100}%`,transition:"width .5s ease"}}/>
    </div>
  );
}

// ── Choice Tile ────────────────────────────────────────────────────────────────
function ChoiceTile({label,emoji,selected,onClick}){
  return(
    <button onClick={onClick} style={{
      background:selected?`${C.terra}22`:C.night,
      border:`1px solid ${selected?C.terra:C.nightBorder}`,
      borderRadius:12,padding:"14px 12px",cursor:"pointer",textAlign:"center",
      transition:"all .15s",display:"flex",flexDirection:"column",alignItems:"center",gap:6,
      fontFamily:"Montserrat,sans-serif",
    }}>
      <span style={{fontSize:22}}>{emoji}</span>
      <span style={{fontSize:11,fontWeight:600,color:selected?C.terra:C.stone,lineHeight:1.3}}>{label}</span>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ReturnReadingPlan(){
  const [s,setS]=useState(()=>loadState()||freshState());
  const [quizQ,setQuizQ]=useState(0),[quizAns,setQuizAns]=useState(null),[quizWrong,setQuizWrong]=useState([]),[quizCooldown,setQuizCooldown]=useState(false);
  const [countAnim,setCountAnim]=useState(false);
  const [noteVal,setNoteVal]=useState("");
  const [timerDone,setTimerDone]=useState(false),[timerStarted,setTimerStarted]=useState(false);
  const [confetti,setConfetti]=useState(false);
  const [celebration,setCelebration]=useState(null);
  const [viewingId,setViewingId]=useState(null);
  const [showComeback,setShowComeback]=useState(false);
  const [pendingComebackData,setPendingComebackData]=useState(null);
  const [showReading5Checkin,setShowReading5Checkin]=useState(false);
  const [showReading11,setShowReading11]=useState(false);
  const [expRevealed,setExpRevealed]=useState(false);
  const [longAbsenceDetected,setLongAbsenceDetected]=useState(false);
  // Onboarding animation hooks — must be at top level
  const [wordIndex,setWordIndex]=useState(0);
  const [wordRevealed,setWordRevealed]=useState(false);
  const [rulePhase,setRulePhase]=useState(0);

  useEffect(()=>{saveState(s);},[s]);

  // Long absence detection
  useEffect(()=>{
    if(s.screen!=="plan"&&s.screen!=="reading")return;
    if(!s.lastReadingTimestamp||s.longAbsenceShown)return;
    const daysSince=(Date.now()-s.lastReadingTimestamp)/(1000*60*60*24);
    if(daysSince>=7){setLongAbsenceDetected(true);upd({longAbsenceShown:true});}
  },[s.screen]);

  // Onboarding animation effects
  useEffect(()=>{
    if(s.screen!=="onboarding"||s.onboardingStep!==0)return;
    const t=setTimeout(()=>setWordRevealed(true),400);
    return()=>clearTimeout(t);
  },[s.screen,s.onboardingStep]);

  useEffect(()=>{
    if(s.screen!=="onboarding"||s.onboardingStep!==0||!wordRevealed)return;
    const words=["I","am","someone","who","returns","to","God's","Word."];
    if(wordIndex<words.length){
      const t=setTimeout(()=>setWordIndex(i=>i+1),180);
      return()=>clearTimeout(t);
    }
  },[s.screen,s.onboardingStep,wordRevealed,wordIndex]);

  useEffect(()=>{
    if(s.screen!=="onboarding"||s.onboardingStep!==4){setRulePhase(0);return;}
    const t1=setTimeout(()=>setRulePhase(1),600);
    const t2=setTimeout(()=>setRulePhase(2),1800);
    const t3=setTimeout(()=>setRulePhase(3),3200);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[s.screen,s.onboardingStep]);
  const upd=p=>setS(prev=>({...prev,...p}));
  const boom=()=>{setConfetti(true);setTimeout(()=>setConfetti(false),4000);};

  const nextUnread=READINGS.find(r=>!s.completedReadings.includes(r.id));
  const currentReading=viewingId?READINGS.find(r=>r.id===viewingId):nextUnread;
  const lastPhase=s.lastCompletedId?READINGS.find(r=>r.id===s.lastCompletedId)?.phase:null;
  const nextPhase=nextUnread?.phase;
  const showPhaseMsg=nextUnread&&lastPhase&&nextPhase&&lastPhase!==nextPhase&&s.dismissedPhaseMsg!==nextPhase;
  const runData=calcRun(s.completedReadings);
  const totalMins=s.completedReadings.reduce((acc,id)=>{const r=READINGS.find(x=>x.id===id);return acc+(r?r.minMinutes:0);},0);

  const completeReading=(id,note)=>{
    const wasMissed=s.lastCompletedId!==null&&id!==(s.lastCompletedId+1)&&!s.completedReadings.includes(s.lastCompletedId+1);
    const newCompleted=[...s.completedReadings,id];
    const newReturn=s.returnCount+1;
    const newComeback=wasMissed?s.comebackCount+1:s.comebackCount;
    const newNotes={...s.notes,[id]:note};
    const earned=[...s.badges];
    const newRuns=calcRun(newCompleted);
    const isMilestone=newCompleted.length===7||newCompleted.length===15||newCompleted.length===30;

    if(wasMissed&&!earned.includes("first_return"))earned.push("first_return");
    if(newComeback>=3&&!earned.includes("three_comebacks"))earned.push("three_comebacks");
    if(newCompleted.length>=7&&!earned.includes("week_one"))earned.push("week_one");
    // Phase completion badges
    const completedPhase=READINGS.find(r=>r.id===id)?.phase;
    const phaseRange=PHASE_READING_RANGE[completedPhase];
    const phaseComplete=phaseRange&&Array.from({length:phaseRange[1]-phaseRange[0]+1},(_,i)=>i+phaseRange[0]).every(rid=>newCompleted.includes(rid));
    if(phaseComplete&&completedPhase===2&&!earned.includes("phase2_done"))earned.push("phase2_done");
    if(phaseComplete&&completedPhase===3&&!earned.includes("phase3_done"))earned.push("phase3_done");
    if(newCompleted.length>=15&&!earned.includes("halfway"))earned.push("halfway");
    if(phaseComplete&&completedPhase===4&&!earned.includes("phase4_done"))earned.push("phase4_done");
    if(newCompleted.length>=30&&!earned.includes("the_return"))earned.push("the_return");

    setCountAnim(true);setTimeout(()=>setCountAnim(false),600);
    const msg=wasMissed?"You came back. That's the whole plan."
      :newCompleted.length===7?"Seven readings. The habit is forming. Keep going."
      :newCompleted.length===15?"Halfway. Something has shifted — even if you can't feel it yet."
      :newCompleted.length===30?"Thirty readings. You returned. That's who you are now."
      :"You showed up. That number never goes backward.";
    setCelebration({msg,returnCount:newReturn,comeback:wasMissed});

    let next="celebration";
    if(wasMissed){next="comeback";}
    else if(id===22&&!s.accountabilityName)next="accountability";
    else if(id===15)next="midpoint";
    else if(id===30)next="complete";

    if(wasMissed){
      setPendingComebackData({completedReadings:newCompleted,returnCount:newReturn,comebackCount:newComeback,notes:newNotes,badges:earned,lastCompletedId:id,missedBeforeLast:true,currentRun:newRuns.current,bestRun:Math.max(s.bestRun||0,newRuns.best),lastReadingTimestamp:Date.now()});
    } else {
      upd({completedReadings:newCompleted,returnCount:newReturn,comebackCount:newComeback,notes:newNotes,badges:earned,lastCompletedId:id,missedBeforeLast:false,currentRun:newRuns.current,bestRun:Math.max(s.bestRun||0,newRuns.best),lastReadingTimestamp:Date.now(),screen:next});
      if(isMilestone)setTimeout(()=>boom(),100);
    }
    setNoteVal("");setTimerDone(false);setTimerStarted(false);setViewingId(null);
    // Reading 5 check-in
    if(id===5){setTimeout(()=>setShowReading5Checkin(true),100);}
    // Reading 11 micro-encouragement
    if(id===11&&!s.reading11Done){upd({reading11Done:true});setTimeout(()=>setShowReading11(true),100);}
  };

  // ── READING 11 MICRO-ENCOURAGEMENT ──────────────────────────────────────────
  if(showReading11)return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim" style={{textAlign:"center",borderColor:C.terra}}>
        <div style={{fontSize:48,marginBottom:16}}>📖</div>
        <p className="eyebrow" style={{marginBottom:8}}>Reading 11</p>
        <h2 className="h2">You're in the middle.</h2>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:8}}>The novelty has worn off. The finish line isn't close enough to feel yet. This is the exact moment most people quietly stop.</p>
        <p className="body" style={{marginBottom:8}}>You haven't stopped.</p>
        <p className="body" style={{marginBottom:24,fontWeight:600,color:C.linen}}>The middle is where the habit actually forms. What you're doing right now — showing up when it doesn't feel exciting — is the most important part of the entire plan.</p>
        <button className="btn" onClick={()=>setShowReading11(false)}>Keep going →</button>
        <Footer/>
      </div>
    </div>
  );

  // ── READING 5 CHECK-IN ───────────────────────────────────────────────────────
  if(showReading5Checkin&&!s.reading5CheckinDone)return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim">
        <p className="eyebrow">Reading 5 Complete</p>
        <h2 className="h2">Quick check-in</h2>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:20}}>You've completed five readings. I genuinely want to know — how is it going so far? Be as honest as you want. I read these personally.</p>
        <SimpleForm
          textLabel="How are you feeling about the plan so far?"
          textPlaceholder="Be honest — what's working, what's hard, how you're feeling..."
          submitLabel="Send →"
          formType="Reading 5 Check-In"
          extraData={{email:s.email,completedReadings:5}}
          savedName={s.firstName}
          onSuccess={()=>{upd({reading5CheckinDone:true});setShowReading5Checkin(false);}}
        />
        <button className="btn-g" style={{marginTop:10}} onClick={()=>{upd({reading5CheckinDone:true});setShowReading5Checkin(false);}}>Skip</button>
        <Footer/>
      </div>
    </div>
  );

  // ── COMEBACK SCREEN ──────────────────────────────────────────────────────────
  if(s.screen==="comeback"||pendingComebackData){
    if(!pendingComebackData)return null;
    return(
      <ComebackScreen
        comebackCount={pendingComebackData.comebackCount}
        returnCount={pendingComebackData.returnCount}
        onContinue={()=>{
          // Now determine next screen after comeback
          const id=pendingComebackData.lastCompletedId;
          let next="plan";
          if(id===22&&!s.accountabilityName)next="accountability";
          else if(id===15)next="midpoint";
          else if(id===30)next="complete";
          upd({...pendingComebackData,screen:next});
          setPendingComebackData(null);
          setTimeout(()=>boom(),100);
        }}
      />
    );
  }

  // ── LONG ABSENCE ─────────────────────────────────────────────────────────────
  if(longAbsenceDetected)return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim" style={{textAlign:"center",borderColor:C.terra}}>
        <div style={{fontSize:52,marginBottom:16}}>📖</div>
        <h2 className="h2">You've been away for a while.</h2>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:8}}>That's okay. This plan doesn't expire. It's been here the whole time, exactly where you left it.</p>
        <p className="body" style={{marginBottom:8}}>You don't have to explain where you've been. You don't have to catch up. You don't have to feel ready.</p>
        <p className="body" style={{marginBottom:24,fontWeight:600,color:C.linen}}>Just open it. That's the whole move.</p>
        <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:12,padding:"16px",marginBottom:24}}>
          <p style={{fontSize:11,fontWeight:600,color:C.stone,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Your comeback protocol</p>
          <p className="body" style={{textAlign:"left",marginBottom:6}}>1. Open your Bible to today's reading.</p>
          <p className="body" style={{textAlign:"left",marginBottom:6}}>2. Don't think about the days you missed.</p>
          <p className="body" style={{textAlign:"left",marginBottom:6}}>3. Don't try to catch up.</p>
          <p className="body" style={{textAlign:"left"}}>4. Read today's passage and write one thing you noticed.</p>
        </div>
        <button className="btn" onClick={()=>setLongAbsenceDetected(false)}>I'm back. Let's go →</button>
        <Footer/>
      </div>
    </div>
  );

  // ── WELCOME ──────────────────────────────────────────────────────────────────
  if(s.screen==="welcome")return(
    <div className="wrap"><style>{css}</style>
      <div className="card anim" style={{textAlign:"center",marginTop:24}}>
        <p className="eyebrow">Christian Layne</p>
        <h1 className="h1" style={{fontSize:30}}>The Return<br/>Reading Plan</h1>
        <div className="gold-line"/>
        <p className="body" style={{marginBottom:8}}>A 30-reading Bible plan built specifically for Christians who've drifted and want to come back to God's Word consistently.</p>
        <p className="body" style={{marginBottom:6}}>Most plans fail you because they weren't built for where you are.</p>
        <p className="body" style={{marginBottom:28,fontWeight:600,color:C.linen}}>This one was.</p>
        <button className="btn" onClick={()=>upd({screen:"onboarding",onboardingStep:0})}>Begin →</button>
        <p className="muted" style={{marginTop:10,marginBottom:s.completedReadings.length>0?12:0}}>Takes about 5 minutes to set up</p>
        {s.completedReadings.length>0&&<button className="btn-g" onClick={()=>upd({screen:"plan"})}>Continue where I left off</button>}
        <Footer/>
      </div>
    </div>
  );

  // ── ONBOARDING ───────────────────────────────────────────────────────────────
  if(s.screen==="onboarding"){
    const step=s.onboardingStep;
    const TOTAL_STEPS=6;
    const words=["I","am","someone","who","returns","to","God's","Word."];

    // Progress bar component
    // ── STEP 0 — Identity (dramatic full-screen) ──────────────────────────────
    if(step===0){
      return(
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.night,padding:"24px 24px 48px"}}>
          <style>{css}</style>
          <div style={{width:"100%",maxWidth:600}}>
            <ProgressBar current={1} total={TOTAL_STEPS}/>
            <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:C.terra,textAlign:"center",marginBottom:40}}>Declaration</p>
            <p style={{fontSize:13,color:C.stone,textAlign:"center",marginBottom:32,lineHeight:1.7}}>Before anything else — one declaration.<br/>Not how you feel. Not who you've been.<br/>Who you're choosing to be right now.</p>
            <div style={{textAlign:"center",marginBottom:48,minHeight:80,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"0 8px",alignItems:"center"}}>
              {words.map((word,i)=>(
                <span key={i} style={{
                  fontSize:i===0?28:i<5?32:28,
                  fontWeight:800,
                  color:i>=5?C.gold:C.linen,
                  fontFamily:"Montserrat,sans-serif",
                  opacity:i<wordIndex?1:0,
                  transform:i<wordIndex?"translateY(0)":"translateY(8px)",
                  transition:"opacity .3s ease, transform .3s ease",
                  display:"inline-block",
                }}>{word}</span>
              ))}
            </div>
            {wordIndex>=words.length&&(
              <div>
                <p style={{fontSize:11,color:C.stone,textAlign:"center",marginBottom:16}}>Say it out loud. Then hold to confirm.</p>
                <HoldBtn label="Hold to confirm — I said it" holdLabel="Confirming..." duration={3000} onComplete={()=>{setWordIndex(0);setWordRevealed(false);upd({onboardingStep:1});}}/>
                <p className="muted" style={{textAlign:"center",marginTop:10}}>Hold for 3 seconds to continue</p>
              </div>
            )}
            <div style={{marginTop:32}}><Footer/></div>
          </div>
        </div>
      );
    }

    // ── STEP 1 — Build Your Ritual (anchor + location + pairing combined) ─────
    if(step===1){
      const ANCHORS=[
        {label:"Morning coffee",emoji:"☕"},{label:"Brushing teeth",emoji:"🪥"},
        {label:"Getting into bed",emoji:"🛌"},{label:"After lunch",emoji:"🍽"},
        {label:"After work",emoji:"💼"},{label:"Something else",emoji:"✏️"},
      ];
      const LOCATIONS=[
        {label:"On my nightstand",emoji:"🌙"},{label:"Kitchen counter",emoji:"🍳"},
        {label:"My desk",emoji:"🖥"},{label:"Living room couch",emoji:"🛋"},
        {label:"Bathroom counter",emoji:"🚿"},{label:"Somewhere else",emoji:"✏️"},
      ];
      const PAIRINGS=[
        {label:"Coffee",emoji:"☕"},{label:"Tea",emoji:"🫖"},
        {label:"A candle",emoji:"🕯"},{label:"My specific chair",emoji:"🪑"},
        {label:"Silence",emoji:"🤫"},{label:"Something else",emoji:"✏️"},
      ];
      const canContinue=s.anchor.trim()&&s.location.trim();
      return(
        <div className="wrap"><style>{css}</style>
          <div className="card anim">
            <ProgressBar current={2} total={4}/>
            <button className="btn-back" onClick={()=>{setWordIndex(0);setWordRevealed(false);upd({onboardingStep:0});}}>← Back</button>
            <p className="eyebrow">Step 2 of 4 — Your Ritual</p>
            <h2 className="h2">Build your reading ritual</h2>
            <p className="body" style={{marginBottom:24,color:C.stone}}>Three quick decisions that make showing up automatic.</p>

            <p style={{fontSize:12,fontWeight:700,color:C.linen,marginBottom:10}}>After what? <span style={{color:C.stone,fontWeight:400}}>Pick a trigger</span></p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              {ANCHORS.map(a=>(
                <ChoiceTile key={a.label} label={a.label} emoji={a.emoji}
                  selected={s.anchor===a.label||(a.label==="Something else"&&customAnchor)}
                  onClick={()=>{if(a.label==="Something else")upd({anchor:""});else upd({anchor:a.label});}}/>
              ))}
            </div>
            {(!ANCHORS.slice(0,-1).some(a=>a.label===s.anchor))&&(
              <textarea className="inp" rows={1} placeholder="Describe your trigger..." value={s.anchor} onChange={e=>upd({anchor:e.target.value})} style={{marginBottom:4}}/>
            )}

            <div style={{height:1,background:C.nightBorder,margin:"18px 0"}}/>

            <p style={{fontSize:12,fontWeight:700,color:C.linen,marginBottom:10}}>Where will your Bible live?</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              {LOCATIONS.map(a=>(
                <ChoiceTile key={a.label} label={a.label} emoji={a.emoji}
                  selected={s.location===a.label||(a.label==="Somewhere else"&&customLoc)}
                  onClick={()=>{if(a.label==="Somewhere else")upd({location:""});else upd({location:a.label});}}/>
              ))}
            </div>
            {(!LOCATIONS.slice(0,-1).some(a=>a.label===s.location))&&(
              <textarea className="inp" rows={1} placeholder="Describe the location..." value={s.location} onChange={e=>upd({location:e.target.value})} style={{marginBottom:4}}/>
            )}

            <div style={{height:1,background:C.nightBorder,margin:"18px 0"}}/>

            <p style={{fontSize:12,fontWeight:700,color:C.linen,marginBottom:4}}>What will you pair it with? <span style={{color:C.stone,fontWeight:400}}>Optional</span></p>
            <p className="muted" style={{marginBottom:10}}>Pairing creates an immediate reward before the spiritual payoff arrives.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              {PAIRINGS.map(a=>(
                <ChoiceTile key={a.label} label={a.label} emoji={a.emoji}
                  selected={s.pairing===a.label||(a.label==="Something else"&&customPair)}
                  onClick={()=>{if(a.label==="Something else")upd({pairing:""});else upd({pairing:a.label});}}/>
              ))}
            </div>
            {(!PAIRINGS.slice(0,-1).some(a=>a.label===s.pairing))&&(
              <textarea className="inp" rows={1} placeholder="Describe your pairing..." value={s.pairing} onChange={e=>upd({pairing:e.target.value})} style={{marginBottom:4}}/>
            )}

            <div style={{marginTop:20}}><button className="btn" disabled={!canContinue} onClick={()=>upd({onboardingStep:2})}>Continue</button></div>
            <Footer/>
          </div>
        </div>
      );
    }

        // ── STEP 4 — The Rule (full-screen ceremony) ──────────────────────────────
    if(step===4){
      return(
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.night,padding:"24px 24px 48px"}}>
          <style>{css}</style>
          <div style={{width:"100%",maxWidth:600}}>
            <ProgressBar current={3} total={4}/>
            <button className="btn-back" onClick={()=>upd({onboardingStep:1})}>← Back</button>
            <div style={{textAlign:"center",marginBottom:48}}>
              <p style={{opacity:rulePhase>=1?1:0,transform:rulePhase>=1?"none":"translateY(10px)",transition:"all .6s ease",fontSize:10,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:C.terra,marginBottom:32}}>The Only Rule</p>
              <p style={{opacity:rulePhase>=2?1:0,transform:rulePhase>=2?"none":"translateY(10px)",transition:"all .7s ease .2s",fontSize:11,color:C.stone,marginBottom:24,lineHeight:1.7}}>This plan is built for missing days.<br/>Missing is expected. The only failure<br/>is letting one missed day become two.</p>
              <div style={{opacity:rulePhase>=3?1:0,transform:rulePhase>=3?"none":"scale(.95)",transition:"all .6s ease",background:`${C.terra}11`,border:`1px solid ${C.terra}`,borderRadius:16,padding:"32px 24px",marginBottom:32}}>
                <p style={{fontSize:36,fontWeight:800,color:C.linen,letterSpacing:"-0.02em",marginBottom:8}}>Never miss twice.</p>
                <p style={{fontSize:12,color:C.stone,fontFamily:"Montserrat,sans-serif"}}>Miss a day? Come back the next one. That's it.</p>
              </div>
            </div>
            {rulePhase>=3&&(
              <div>
                <HoldBtn label="Hold to confirm — I understand" holdLabel="Locking it in..." duration={3000} onComplete={()=>upd({onboardingStep:5})}/>
                <p className="muted" style={{textAlign:"center",marginTop:10}}>Hold for 3 seconds to continue</p>
              </div>
            )}
            <div style={{marginTop:32}}><Footer/></div>
          </div>
        </div>
      );
    }

    // ── STEP 5 — Why One Verse ────────────────────────────────────────────────
    if(step===5)return(
      <div className="wrap"><style>{css}</style>
        <div className="card anim">
          <ProgressBar current={4} total={4}/>
          <button className="btn-back" onClick={()=>{setRulePhase(0);upd({onboardingStep:2});}}>← Back</button>
          <p className="eyebrow">Step 4 of 4 — Why One Verse</p>
          <h2 className="h2">{PHASE_WHY[1].title}</h2>
          {PHASE_WHY[1].body.split("\n\n").map((p,i)=><p key={i} className="body" style={{marginBottom:12}}>{p}</p>)}
          <div style={{marginTop:8}}><button className="btn" onClick={()=>upd({screen:"quiz"})}>I'm ready →</button></div>
          <Footer/>
        </div>
      </div>
    );
  }

    // ── EXPECTATION ALIGNMENT ────────────────────────────────────────────────────
  if(s.screen==="quiz"){
    const exp=EXPECTATIONS[quizQ];
    return(
      <div className="wrap"><style>{css}</style><div className="card anim">
        <button className="btn-back" onClick={()=>{setExpRevealed(false);upd({screen:"onboarding",onboardingStep:3});}}>← Back</button>
        <p className="eyebrow">Before You Begin — {quizQ+1} of {EXPECTATIONS.length}</p>
        <div style={{fontSize:36,textAlign:"center",marginBottom:16}}>{exp.emoji}</div>
        <h2 className="h2" style={{textAlign:"center",marginBottom:24}}>{exp.q}</h2>
        {!expRevealed?(
          <button className="btn" onClick={()=>setExpRevealed(true)}>See the answer</button>
        ):(
          <>
            <div style={{background:C.goldDim,border:`1px solid ${C.gold}44`,borderRadius:12,padding:"16px 18px",marginBottom:20}}>
              <p className="body" style={{color:C.linen,lineHeight:1.8}}>{exp.reveal}</p>
            </div>
            <button className="btn" onClick={()=>{
              setExpRevealed(false);
              if(quizQ<EXPECTATIONS.length-1){setQuizQ(quizQ+1);}
              else upd({screen:"day1prompt"});
            }}>
              {quizQ<EXPECTATIONS.length-1?"Got it — next →":"Got it — let's begin →"}
            </button>
          </>
        )}
        <Footer/>
      </div></div>
    );
  }

  // ── DAY 1 PROMPT ─────────────────────────────────────────────────────────────
  if(s.screen==="day1prompt")return(
    <div className="wrap"><style>{css}</style><div className="card anim">
      <button className="btn-back" onClick={()=>upd({screen:"quiz"})}>← Back</button>
      <p className="eyebrow">Before Reading 1</p>
      <h2 className="h2">What makes today your day one?</h2>
      <p className="body" style={{marginBottom:20}}>I'll show this back to you on Reading 30. It doesn't have to be profound — just honest.</p>
      <textarea className="inp" rows={4} placeholder="Why today? What do you want to be different by Reading 30?" value={s.day1Why} onChange={e=>upd({day1Why:e.target.value})}/>
      <p style={{fontSize:12,fontWeight:600,color:C.linen,margin:"14px 0 6px"}}>What do you want your relationship with God to look like 30 days from now?</p>
      <textarea className="inp" rows={3} placeholder="Be specific — what would feel different? What would be true that isn't true today?" value={s.vision30||""} onChange={e=>upd({vision30:e.target.value})}/>
      <p style={{fontSize:12,fontWeight:600,color:C.linen,margin:"16px 0 6px"}}>Your first name</p>
      <input className="inp" placeholder="First name..." value={s.firstName} onChange={e=>upd({firstName:e.target.value})}/>
      <p style={{fontSize:12,fontWeight:600,color:C.linen,margin:"12px 0 6px"}}>Your email</p>
      <input className="inp" type="email" placeholder="email@example.com" value={s.email} onChange={e=>upd({email:e.target.value})}/>
      <p className="muted" style={{marginTop:6,marginBottom:18}}>Your progress saves on this device. Your email is only used if I need to reach you. Use a regular browser window — not incognito — so your progress stays saved.</p>
      <button className="btn" disabled={!s.day1Why.trim()||!s.firstName.trim()} onClick={()=>{
        submitForm({"form-type":"Day 1 Start",name:s.firstName,email:s.email,"day1-why":s.day1Why,anchor:s.anchor,location:s.location,pairing:s.pairing});
        upd({screen:"plan"});
      }}>Your plan is ready →</button>
      <Footer/>
    </div></div>
  );

  // ── CELEBRATION ──────────────────────────────────────────────────────────────
  if(s.screen==="celebration"){
    const cel=celebration;
    return(
      <div className="wrap"><style>{css}</style>
        <Confetti active={confetti}/>
        <div className="card anim" style={{textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:14}}>✓</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:18}}>
            <div className={countAnim?"pop":""} style={{fontSize:52,fontWeight:800,color:C.gold,lineHeight:1}}>{s.returnCount}</div>
            <div style={{textAlign:"left"}}><p style={{fontWeight:700,color:C.linen,fontSize:13}}>Returns</p><p className="muted">Never goes backward</p></div>
          </div>
          <p className="body" style={{marginBottom:20,fontStyle:"italic",color:C.linen}}>"{cel?.msg}"</p>
          {s.badges.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:20}}>{s.badges.map(bid=>{const b=BADGES.find(x=>x.id===bid);return b?<span key={bid} className="badge">{b.emoji} {b.label}</span>:null;})}</div>}
          <button className="btn" onClick={()=>upd({screen:"plan"})}>Continue →</button>
          <Footer/>
        </div>
      </div>
    );
  }

  // ── ACCOUNTABILITY ───────────────────────────────────────────────────────────
  if(s.screen==="accountability")return(
    <div className="wrap"><style>{css}</style>
      <Confetti active={confetti}/>
      <div className="card anim">
        <p className="eyebrow">Reading 22 Complete 🛡</p>
        <h2 className="h2">You've proven you can do this.</h2>
        <div className="gold-line"/>
        {s.vision30&&(
          <div style={{background:C.goldDim,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
            <p style={{fontSize:10,fontWeight:600,color:C.gold,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>On day one, you said you wanted...</p>
            <p className="body" style={{fontStyle:"italic",color:C.linen,fontSize:12}}>"{s.vision30}"</p>
            <p className="muted" style={{marginTop:6}}>Seven readings in. You're building toward that.</p>
          </div>
        )}
        <p className="body" style={{marginBottom:8}}>Research shows that people who tell someone else about a commitment are significantly more likely to follow through than people who keep it to themselves.</p>
        <p className="body" style={{marginBottom:8}}>I know this might feel uncomfortable. If you've been away from God's Word for a while, the last thing you want to do is tell someone about it. You don't have to explain why you're starting. Just tell them this:</p>
        <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"14px 16px",marginBottom:20}}>
          <p className="body" style={{fontStyle:"italic",color:C.linen}}>"I've been reading my Bible consistently for the first time in a long time."</p>
        </div>
        <p style={{fontSize:13,fontWeight:600,color:C.linen,marginBottom:10}}>Who will you tell?</p>
        <input className="inp" placeholder="Their name..." value={s.accountabilityName} onChange={e=>upd({accountabilityName:e.target.value})}/>
        <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
          <button className="btn" disabled={!s.accountabilityName.trim()} onClick={()=>upd({screen:"plan"})}>Continue to Reading 23</button>
          <button className="btn-g" onClick={()=>upd({screen:"plan"})}>Skip for now</button>
        </div>
        <Footer/>
      </div>
    </div>
  );

  // ── MIDPOINT ─────────────────────────────────────────────────────────────────
  if(s.screen==="midpoint")return(
    <div className="wrap"><style>{css}</style>
      <div className="stack">
        <Confetti active={confetti}/>
        <div className="card anim" style={{borderColor:C.gold}}>
          <p className="eyebrow">Reading 15 Complete 🏔</p>
          <h2 className="h2">You're past the halfway point.</h2>
          <div className="gold-line"/>
          {PHASE_WHY[4].body.split("\n\n").map((p,i)=><p key={i} className="body" style={{marginBottom:10}}>{p}</p>)}
        </div>
        <div className="lock-wrap">
          <p className="eyebrow" style={{marginBottom:8}}>From Christian — Halfway Message</p>
          <p className="h3">A personal audio message for everyone who makes it to Reading 15</p>
          <p className="body" style={{marginBottom:16,marginTop:6}}>Something I recorded specifically for this moment in the plan.</p>
          {s.midpointUnlocked?<AudioPlayer src={AUDIO_URL}/>:<><div style={{filter:"blur(6px)",pointerEvents:"none"}}><div style={{height:64,background:C.night,borderRadius:12,border:`1px solid ${C.gold}`}}/></div><div className="lock-ov"><span style={{fontSize:28}}>🔒</span><p style={{fontSize:13,fontWeight:700,color:C.linen,textAlign:"center",maxWidth:240}}>Share your experience to unlock</p></div></>}
        </div>
        {!s.midpointUnlocked&&(
          <div className="card anim">
            <SimpleForm title="Unlock the Message" description="Be honest — what's worked, what's been hard. Your answer helps me make this better for the next person. It unlocks the audio message immediately." textLabel="Your experience so far" textPlaceholder="What's working, what's been hard..." submitLabel="Submit & Unlock →" formType="Midpoint Reflection (Reading 15)" extraData={{email:s.email}} savedName={s.firstName} onSuccess={()=>upd({midpointUnlocked:true})}/>
          </div>
        )}
        <button className="btn" onClick={()=>upd({screen:"plan"})}>Continue to Reading 16 →</button>
        <Footer/>
      </div>
    </div>
  );

  // ── JOURNAL ──────────────────────────────────────────────────────────────────
  if(s.screen==="journal"){
    const journalEntries=s.completedReadings.map(id=>({reading:READINGS.find(r=>r.id===id),note:s.notes[id]})).filter(e=>e.reading&&e.note);
    return(
      <div className="wrap"><style>{css}</style>
        <div className="stack">
          <div className="card anim">
            <button className="btn-back" onClick={()=>upd({screen:"plan"})}>← Back to plan</button>
            <p className="eyebrow">Your Notes</p>
            <h2 className="h2">Reading Journal</h2>
            <p className="muted" style={{marginBottom:16}}>{journalEntries.length} note{journalEntries.length!==1?"s":""} written across {s.completedReadings.length} readings</p>
            {journalEntries.length===0?<p className="body" style={{color:C.stone}}>Your notes will appear here after each reading.</p>:journalEntries.map(({reading,note})=>(
              <div key={reading.id} className="journal-entry">
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:PHASE_COLORS[reading.phase],flexShrink:0}}/>
                  <p style={{fontSize:11,fontWeight:700,color:PHASE_COLORS[reading.phase],textTransform:"uppercase",letterSpacing:"0.08em"}}>Reading {reading.id} — {reading.ref}</p>
                </div>
                <p className="body" style={{fontStyle:"italic",color:C.linen}}>"{note}"</p>
              </div>
            ))}
          </div>
          <Footer/>
        </div>
      </div>
    );
  }

  // ── EDIT SETUP ───────────────────────────────────────────────────────────────
  if(s.screen==="editSetup"){
    return(
      <div className="wrap"><style>{css}</style><div className="card anim">
        <button className="btn-back" onClick={()=>upd({screen:"plan"})}>← Back to plan</button>
        <p className="eyebrow">Update Your Setup</p>
        <h2 className="h2">Your reading habits</h2>
        <p className="body" style={{marginBottom:20}}>Life changes. Your setup can too. Update any of these without affecting your progress.</p>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>I will read immediately after...</p>
        <textarea className="inp" rows={2} value={s.anchor} onChange={e=>upd({anchor:e.target.value})} style={{marginBottom:14}}/>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>My Bible will live at...</p>
        <textarea className="inp" rows={2} value={s.location} onChange={e=>upd({location:e.target.value})} style={{marginBottom:14}}/>
        <p style={{fontSize:12,fontWeight:600,color:C.linen,marginBottom:6}}>I will pair reading with...</p>
        <textarea className="inp" rows={2} value={s.pairing} onChange={e=>upd({pairing:e.target.value})} style={{marginBottom:18}}/>
        <button className="btn" onClick={()=>upd({screen:"plan"})}>Save changes</button>
        <Footer/>
      </div></div>
    );
  }

  // ── READING ──────────────────────────────────────────────────────────────────
  if(s.screen==="reading"){
    const reading=currentReading;
    if(!reading){upd({screen:"plan"});return null;}
    const isReview=s.completedReadings.includes(reading.id);
    const noteValid=noteVal.trim().length>=20;
    return(
      <div className="wrap"><style>{css}</style>
        <div className="stack">
          <div className="card anim">
            <button className="btn-back" onClick={()=>{setViewingId(null);upd({screen:"plan"});}}>← Back to plan</button>
            <p className="eyebrow" style={{color:PHASE_COLORS[reading.phase]}}>{PHASE_LABELS[reading.phase]} · Reading {reading.id} of 30{isReview?" — Review":""}</p>
            <h2 className="h2">{reading.ref}</h2>
            <div className="gold-line"/>
            {/* What this plan is not — Reading 1 only */}
            {reading.id===1&&!isReview&&(
              <div style={{background:C.night,border:`1px solid ${C.terra}`,borderRadius:10,padding:"14px",marginBottom:14}}>
                <p style={{fontSize:10,fontWeight:600,color:C.terra,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Before Reading 1 — a quick note</p>
                <p className="body" style={{fontSize:12,marginBottom:6}}>This plan is not going to make you feel close to God immediately. The feeling comes back slowly, after consistent showing up.</p>
                <p className="body" style={{fontSize:12}}>Don't measure success by how you feel after Reading 1. Measure it by whether you come back for Reading 2.</p>
              </div>
            )}
            {/* Why this passage */}
            {WHY_THIS_PASSAGE[reading.id]&&(
              <div style={{background:C.goldDim,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.gold,marginBottom:6}}>Why this reading</p>
                <p className="body" style={{fontSize:12,color:C.parchment}}>{WHY_THIS_PASSAGE[reading.id]}</p>
              </div>
            )}
            {/* Prayer prompt */}
            {!isReview&&(
              <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"14px",marginBottom:14}}>
                <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,marginBottom:6}}>Before you read</p>
                <p className="body" style={{fontSize:12}}>Take 30 seconds to say one honest sentence to God about where you are right now. Not a polished prayer. Just honest.</p>
              </div>
            )}
            <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"16px 14px",marginBottom:16}}>
              <p className="body" style={{fontStyle:"italic",color:C.linen,lineHeight:1.8}}>{reading.verse}</p>
              {reading.phase>1&&<p className="muted" style={{marginTop:10,borderTop:`1px solid ${C.nightBorder}`,paddingTop:8}}>📖 Use a physical Bible if possible — it removes the phone from the equation entirely.</p>}
            </div>
            <p className="body" style={{marginBottom:20,color:C.stone}}>{reading.note}</p>
            {!isReview&&<Timer minutes={reading.minMinutes} onDone={()=>setTimerDone(true)} onStart={()=>setTimerStarted(true)}/>}
          </div>
          {!isReview&&(
            <div className="card anim">
              <p className="eyebrow" style={{marginBottom:8}}>After Reading</p>
              <p className="h3">What's one thing you noticed?</p>
              <p className="muted" style={{marginBottom:14}}>A word, a phrase, a question — whatever landed. Write at least a sentence.</p>
              <textarea className="inp" rows={3} placeholder="A word, a phrase, a question — whatever landed..." value={noteVal} onChange={e=>setNoteVal(e.target.value)}/>
              {noteVal.length>0&&!noteValid&&<p className="muted" style={{marginTop:6}}>Keep going — just a little more.</p>}
              {/* What to do if you feel nothing — shown at readings 3, 8, 16 and randomly 30% other times */}
              {(reading.id===3||reading.id===8||reading.id===16||(reading.id%3===0&&reading.id>3))&&(
                <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"12px 14px",marginTop:12}}>
                  <p style={{fontSize:10,fontWeight:600,color:C.stone,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>If you felt nothing today</p>
                  <p className="body" style={{fontSize:12}}>That's okay. That's normal at this stage. The return isn't measured by what you felt. It's measured by the fact that you opened it. That's the whole win today.</p>
                </div>
              )}
              <div style={{marginTop:14}}>
                <button className="btn" disabled={!noteValid||(timerStarted&&!timerDone)} onClick={()=>completeReading(reading.id,noteVal)}>
                  {timerStarted&&!timerDone?"Finish the timer first":!noteValid?"Write a bit more first":"Mark as complete ↑"}
                </button>
              </div>
            </div>
          )}
          {isReview&&(
            <div className="card anim">
              <p className="eyebrow" style={{marginBottom:8}}>Your Note</p>
              <p className="body" style={{fontStyle:"italic",color:C.linen}}>"{s.notes[reading.id]||"No note recorded."}"</p>
            </div>
          )}
          <Footer/>
        </div>
      </div>
    );
  }

  // ── MAINTENANCE MODE ─────────────────────────────────────────────────────────
  if(s.screen==="maintenance"){
    const verse=MAINTENANCE_VERSES[s.maintenanceDay%MAINTENANCE_VERSES.length];
    return(
      <div className="wrap"><style>{css}</style>
        <div className="stack">
          <div className="card anim" style={{textAlign:"center"}}>
            <p className="eyebrow">Maintenance Mode — Day {s.maintenanceDay+1}</p>
            <h2 className="h2" style={{marginBottom:4}}>{verse.ref}</h2>
            <div className="gold-line"/>
            <div style={{background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"20px 18px",marginBottom:20}}>
              <p className="body" style={{fontStyle:"italic",color:C.linen,fontSize:15,lineHeight:1.9}}>"{verse.verse}"</p>
            </div>
            <p className="muted" style={{marginBottom:20}}>One verse a day. The anchor habit stays alive.</p>
            <button className="btn" onClick={()=>{upd({maintenanceDay:s.maintenanceDay+1,returnCount:s.returnCount+1});setCountAnim(true);setTimeout(()=>setCountAnim(false),600);}}>
              Mark as read ↑
            </button>
          </div>
          <div className="card anim" style={{padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div className={countAnim?"pop":""} style={{fontSize:36,fontWeight:800,color:C.gold}}>{s.returnCount}</div>
              <div><p style={{fontWeight:700,color:C.linen,fontSize:13}}>Total Returns</p><p className="muted">This number never goes backward</p></div>
            </div>
          </div>
          <button className="btn-g" onClick={()=>upd({screen:"plan"})}>← Back to plan</button>
          <Footer/>
        </div>
      </div>
    );
  }

  // ── PLAN DASHBOARD ───────────────────────────────────────────────────────────
  if(s.screen==="plan"){
    const next=READINGS.find(r=>!s.completedReadings.includes(r.id));
    const shareText=`I just completed Reading ${s.completedReadings.length} of 30 on The Return Reading Plan. My return count is ${s.returnCount}. If you've been away from your Bible, this plan was built for you: return-reading-plan.vercel.app`;
    const isComplete=s.completedReadings.length>=30;
    return(
      <div className="wrap"><style>{css}</style>
        <Confetti active={confetti}/>
        <div className="stack">

          {/* Header */}
          <div className="card anim" style={{textAlign:"center",padding:"22px 20px"}}>
            <p className="eyebrow">The Return Reading Plan</p>
            <h1 className="h1" style={{fontSize:20,marginBottom:4}}>{next?`Reading ${next.id} of 30`:"Plan Complete"}</h1>
            <p className="muted">{s.completedReadings.length} of 30 readings complete · ~{totalMins} minutes in God's Word</p>
          </div>

          {/* Return counter + run */}
          <div className="card anim">
            <p className="eyebrow" style={{marginBottom:10}}>Your Stats</p>
            <div style={{display:"flex",alignItems:"center",gap:16,background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:12,padding:"14px 18px",marginBottom:10}}>
              <div className={countAnim?"pop":""} style={{fontSize:44,fontWeight:800,color:C.gold,lineHeight:1,minWidth:52}}>{s.returnCount}</div>
              <div>
                <p style={{fontWeight:700,color:C.linen,fontSize:13,marginBottom:2}}>{s.returnCount===0?"Ready to begin":s.returnCount===1?"First return":"Returns to God's Word"}</p>
                <p className="muted">This number never goes backward</p>
              </div>
            </div>
            {/* Current run — clearly secondary, framed as bonus not primary */}
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
                <p style={{fontSize:22,fontWeight:800,color:C.terra}}>{runData.current}</p>
                <p className="muted" style={{fontSize:10}}>Current Run</p>
                <p className="muted" style={{fontSize:9,marginTop:2}}>Fun bonus — not what counts</p>
              </div>
              <div style={{flex:1,background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
                <p style={{fontSize:22,fontWeight:800,color:C.stone}}>{s.bestRun||runData.best}</p>
                <p className="muted" style={{fontSize:10}}>Personal Best Run</p>
                <p className="muted" style={{fontSize:9,marginTop:2}}>Beat it next time</p>
              </div>
              <div style={{flex:1,background:C.night,border:`1px solid ${C.nightBorder}`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
                <p style={{fontSize:22,fontWeight:800,color:C.stone}}>{s.comebackCount}</p>
                <p className="muted" style={{fontSize:10}}>Comebacks</p>
                <p className="muted" style={{fontSize:9,marginTop:2}}>Times you came back</p>
              </div>
            </div>
            {s.missedBeforeLast&&<div style={{marginTop:10,background:C.goldDim,border:`1px solid ${C.gold}`,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}><span>↩</span><p style={{fontSize:11,fontWeight:600,color:C.gold}}>You came back. That's what matters.</p></div>}
          </div>

          {/* Badges */}
          {s.badges.length>0&&(
            <div className="card anim">
              <p className="eyebrow" style={{marginBottom:10}}>Badges Earned</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{s.badges.map(bid=>{const b=BADGES.find(x=>x.id===bid);return b?<span key={bid} className="badge">{b.emoji} {b.label}</span>:null;})}</div>
            </div>
          )}

          {/* Progress path */}
          <div className="card anim">
            <p className="eyebrow" style={{marginBottom:4}}>Your Path</p>
            <p className="muted" style={{marginBottom:12}}>Tap any completed reading to review your note.</p>
            <div className="path-grid">
              {READINGS.map(r=>{
                const done=s.completedReadings.includes(r.id),isCur=next?.id===r.id;
                return(
                  <div key={r.id} className={`dot ${done?"done":isCur?"cur":"fut"}`}
                    style={done?{background:PHASE_COLORS[r.phase]}:{}}
                    onClick={()=>{if(done||isCur){setViewingId(r.id);setTimerDone(false);setTimerStarted(false);upd({screen:"reading"});}}}
                    title={`Reading ${r.id} — ${PHASE_LABELS[r.phase]}`}>
                    {done?"✓":r.id}
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
              {[1,2,3,4,5].map(ph=>(
                <div key={ph} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:PHASE_COLORS[ph]}}/>
                  <span className="muted" style={{fontSize:10}}>Phase {ph}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reading 7 soft acknowledgment */}
          {s.completedReadings.includes(7)&&!s.completedReadings.includes(8)&&(
            <div className="card anim" style={{borderColor:C.terra,padding:"16px 20px"}}>
              <p style={{fontSize:10,fontWeight:600,color:C.terra,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Seven readings</p>
              <p className="body" style={{fontSize:12}}>You've shown up seven times. That's not nothing — that's the hardest part of any return. Keep going. The plan gets deeper from here.</p>
            </div>
          )}

          {/* Phase message */}
          {showPhaseMsg&&PHASE_WHY[nextPhase]&&(
            <div className="card anim" style={{borderColor:C.terra}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <p className="eyebrow" style={{marginBottom:0}}>From Christian</p>
                <button onClick={()=>upd({dismissedPhaseMsg:nextPhase})} style={{background:"none",border:"none",color:C.stone,cursor:"pointer",fontSize:16,lineHeight:1,padding:0}}>×</button>
              </div>
              <p className="h3" style={{marginBottom:10}}>{PHASE_WHY[nextPhase].title}</p>
              {PHASE_WHY[nextPhase].body.split("\n\n").map((p,i)=><p key={i} className="body" style={{marginBottom:10}}>{p}</p>)}
            </div>
          )}

          {/* Next reading */}
          {next&&(
            <div className="card anim" style={{borderColor:PHASE_COLORS[next.phase]}}>
              <p className="eyebrow" style={{marginBottom:6,color:PHASE_COLORS[next.phase]}}>{PHASE_LABELS[next.phase]}</p>
              <h2 className="h2" style={{marginBottom:4}}>{next.ref}</h2>
              <p className="body" style={{marginBottom:18,color:C.stone}}>{next.note}</p>
              <button className="btn" onClick={()=>{setViewingId(null);setTimerDone(false);setTimerStarted(false);upd({screen:"reading"});}}>Begin Reading {next.id} →</button>
            </div>
          )}

          {/* Completed — restart option */}
          {isComplete&&(
            <div className="card anim" style={{textAlign:"center"}}>
              <p className="eyebrow" style={{marginBottom:8}}>Plan Complete ✝</p>
              <p className="body" style={{marginBottom:16}}>You've completed all 30 readings. You can keep reviewing your notes or start a new journey.</p>
              {!s.confirmReset
                ?<button className="btn-g" onClick={()=>upd({confirmReset:true})}>Start a new journey</button>
                :<div style={{borderColor:C.red,border:`1px solid ${C.red}`,borderRadius:12,padding:"16px"}}>
                  <p className="h3" style={{color:C.red,marginBottom:8}}>Are you sure?</p>
                  <p className="body" style={{marginBottom:14}}>This will reset all your progress, return count, and badges. This cannot be undone.</p>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn-g" style={{flex:1}} onClick={()=>upd({confirmReset:false})}>Cancel</button>
                    <button className="btn" style={{flex:1,background:C.red}} onClick={()=>{const f=freshState();saveState(f);setS(f);}}>Yes, reset</button>
                  </div>
                </div>
              }
            </div>
          )}

          {/* Journal + share + maintenance */}
          <div className="card anim" style={{padding:"16px 20px"}}>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <button className="btn-g" style={{flex:1}} onClick={()=>upd({screen:"journal"})}>📖 Journal ({Object.keys(s.notes).length})</button>
              <button className="btn-g" style={{flex:1}} onClick={()=>navigator.clipboard?.writeText(shareText).then(()=>alert("Copied!"))}>Share</button>
            </div>
            {isComplete&&(
              <button className="btn-g" onClick={()=>upd({screen:"maintenance"})}>Enter Maintenance Mode →</button>
            )}
          </div>

          {/* Setup reminder + edit */}
          <div className="card anim" style={{padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{fontSize:10,fontWeight:600,color:C.stone,textTransform:"uppercase",letterSpacing:"0.1em"}}>Your Setup</p>
              <button onClick={()=>upd({screen:"editSetup"})} style={{background:"none",border:"none",color:C.terra,fontFamily:"Montserrat,sans-serif",fontSize:11,fontWeight:600,cursor:"pointer",padding:0}}>Edit</button>
            </div>
            <p className="body" style={{fontSize:12}}>📖 After: <span style={{color:C.linen}}>{s.anchor||"—"}</span></p>
            <p className="body" style={{fontSize:12,marginTop:4}}>📍 Location: <span style={{color:C.linen}}>{s.location||"—"}</span></p>
            {s.pairing&&<p className="body" style={{fontSize:12,marginTop:4}}>☕ Pairing: <span style={{color:C.linen}}>{s.pairing}</span></p>}
          </div>

          <div style={{textAlign:"center",padding:"10px 0",borderTop:`1px solid ${C.nightBorder}`}}>
            <p style={{fontSize:11,fontWeight:700,color:C.stone,marginBottom:4}}>The only rule: never miss twice.</p>
            <p style={{fontSize:10,color:C.nightBorder.replace("28","45"),color:C.stone,opacity:.6}}>The goal isn't the number. The goal is the relationship.</p>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }

  // ── COMPLETE ─────────────────────────────────────────────────────────────────
  if(s.screen==="complete")return(
    <div className="wrap"><style>{css}</style>
      <Confetti active={confetti}/>
      <div className="stack">
        <div className="card anim" style={{textAlign:"center"}}>
          <p className="eyebrow">Reading 30 Complete ✝</p>
          <h1 className="h1">You returned.</h1>
          <div className="gold-line"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:20}}>
            <div style={{fontSize:52,fontWeight:800,color:C.gold,lineHeight:1}}>{s.returnCount}</div>
            <div style={{textAlign:"left"}}><p style={{fontWeight:700,color:C.linen,fontSize:13}}>Total Returns</p><p className="muted">This number never goes backward</p></div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>{s.badges.map(bid=>{const b=BADGES.find(x=>x.id===bid);return b?<span key={bid} className="badge">{b.emoji} {b.label}</span>:null;})}</div>
        </div>

        {s.day1Why&&(
          <div className="card anim" style={{borderColor:C.gold}}>
            <p className="eyebrow" style={{color:C.gold,marginBottom:8}}>On Reading 1, you said your day one was...</p>
            <p className="body" style={{fontStyle:"italic",color:C.linen,marginBottom:12}}>"{s.day1Why}"</p>
            {s.vision30&&(
              <>
                <hr style={{border:"none",borderTop:`1px solid ${C.nightBorder}`,margin:"12px 0"}}/>
                <p className="eyebrow" style={{color:C.gold,marginBottom:6}}>And you wanted your relationship with God to look like...</p>
                <p className="body" style={{fontStyle:"italic",color:C.linen,marginBottom:12}}>"{s.vision30}"</p>
              </>
            )}
            <hr style={{border:"none",borderTop:`1px solid ${C.nightBorder}`,margin:"12px 0"}}/>
            <p className="body">How does that feel now?</p>
          </div>
        )}

        <div className="card anim">
          {s.completionSubmitted
            ?<div style={{textAlign:"center",padding:"16px 0"}}><p style={{fontSize:22,marginBottom:8}}>✓</p><p className="body" style={{color:C.linen}}>Thank you. Your story matters.</p></div>
            :<SimpleForm title="Would you share what happened?" description="How many days did you end up reading? Did this plan help? Would you recommend it? Your story helps the next person who needs to come back." textLabel="Your honest experience" textPlaceholder="What changed..." submitLabel="Send my story →" formType="Day 30 Testimonial" extraData={{email:s.email,"day1-why":s.day1Why,"return-count":s.returnCount,badges:s.badges.join(", ")}} savedName={s.firstName} onSuccess={()=>upd({completionSubmitted:true})}/>
          }
        </div>

        <div className="card anim" style={{padding:"16px 20px"}}>
          <p style={{fontSize:10,fontWeight:600,color:C.stone,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Share Your Return</p>
          <button className="btn-g" onClick={()=>navigator.clipboard?.writeText(`I just completed The Return Reading Plan — 30 readings back in God's Word. My return count was ${s.returnCount}. If you've been away from your Bible, this plan was built for you: return-reading-plan.vercel.app`).then(()=>alert("Copied!"))}>Copy to share</button>
        </div>

        {/* What next hand-off */}
        <div className="card anim">
          <p className="eyebrow" style={{marginBottom:8}}>What happens next?</p>
          <p className="h3" style={{marginBottom:16}}>Choose your next step</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button className="btn" onClick={()=>upd({screen:"maintenance",maintenanceMode:true})}>
              Maintenance Mode — one verse a day to keep the habit alive
            </button>
            <button className="btn-g" onClick={()=>{const f=freshState();saveState(f);setS(f);}}>
              Start the Return Reading Plan again
            </button>
            <button className="btn-g" onClick={()=>upd({screen:"plan"})}>
              Stay on the plan and review your readings
            </button>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );

  return null;
}
