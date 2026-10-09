/* SUBAR 6 (v6). Blue and white brand system. Data, auth, scoring and the autopilot contract are unchanged; identity, views and interaction are new. */
"use strict";

/* ===================== clubs ===================== */
const CLUBS={ARS:"Arsenal",AVL:"Aston Villa",BOU:"Bournemouth",BRE:"Brentford",BRI:"Brighton",CFC:"Chelsea",COV:"Coventry City",CRY:"Crystal Palace",EVE:"Everton",FUL:"Fulham",
 HUL:"Hull City",IPS:"Ipswich Town",LEE:"Leeds United",LEI:"Leicester City",LFC:"Liverpool",MCI:"Manchester City",MUN:"Manchester United",NEW:"Newcastle United",NFO:"Nottingham Forest",
 SOU:"Southampton",SUN:"Sunderland",TOT:"Tottenham Hotspur",WHU:"West Ham United",WOL:"Wolves"};
const SHORT={MCI:"Man City",MUN:"Man United",NEW:"Newcastle",NFO:"Nott'm Forest",TOT:"Tottenham",LEE:"Leeds",IPS:"Ipswich",COV:"Coventry",HUL:"Hull",LEI:"Leicester",WHU:"West Ham"};
const KIT={ARS:"#EF0107",AVL:"#95BFE5",BOU:"#DA291C",BRE:"#E30613",BRI:"#0057B8",CFC:"#034694",COV:"#59CBE8",CRY:"#1B458F",EVE:"#274488",FUL:"#9AA0A6",
 HUL:"#F5A12D",IPS:"#3A64A3",LEE:"#E8B800",LEI:"#003090",LFC:"#C8102E",MCI:"#6CABDD",MUN:"#DA291C",NEW:"#5F6368",NFO:"#DD0000",SOU:"#D71920",SUN:"#EB172B",TOT:"#132257",WHU:"#7A263A",WOL:"#FDB913"};
const BUNDLED=new Set(Object.keys(CLUBS));

/* ===================== copy (English only) ===================== */
const T={
en:{dir:"ltr",lang:"en",other:"عربي",otherLabel:"العربية",
 brand:"SUBAR 6",club:"Town House 10",members:"Members only",
 nav:{home:"Matchday",round:"Results",table:"Table",player:"Member",admin:"Admin"},
 sample:"Sample",loading:"Loading the league",
 mw:"Matchweek",round:n=>`Round ${n}`,
 locksIn:"Locks in",lockedAt:(d,tm)=>`Locked ${d}, ${tm}`,locksAt:(d,tm)=>`${d}, ${tm} Kuwait time`,
 of6:n=>`${n} of 6`,gg:m=>m==null?"Golden Goal not set":`Golden Goal ${m}′`,
 save:{clean:"",pending:"Saving",saving:"Saving",saved:tm=>`Saved ${tm}`,failed:"Not saved. Tap to retry",half:"Add the other score"},
 st:{todo:"",half:"Add the other score",edited:"Saving",saving:"Saving",saved:"Saved",failed:"Not saved",locked:"Locked in",none:"No prediction"},
 final:"Full time",awaiting:"Awaiting result",voidF:"Postponed, not scored",
 goalsOf:c=>`${c} goals`,swipe:"Swipe a number, or tap it",
 ggH:"Golden Goal",ggP:"The minute of the first goal across all six. It settles ties.",ggSet:"Slide to the minute",ggWas:m=>`First goal: minute ${m}`,ggUnset:"Not set",
 roomH:"Who's in",roomOpen:"Scores stay hidden until kick-off.",roomLocked:"Everyone's picks are on Results.",notYet:"Not in yet",ggShort:"GG",
 lastH:"Last round",lastNone:"Results appear here once a round is complete.",yourPick:"You",winner:(n,who,p)=>`Round ${n} went to ${who} with ${p}`,
 tableH:"The table",fullTable:"Full table",noTable:"The table starts once the first round is complete.",
 after:n=>n===1?"After 1 round":`After ${n} rounds`,exactWon:(e,w)=>`${e} exact, ${w} ${w===1?"round":"rounds"} won`,
 behind:(p,n)=>p===0?`Level with ${n}`:`${p} behind ${n}`,leads:p=>p===0?"Level at the top":`Leads by ${p}`,you:"you",lastRd:p=>`${p} last round`,
 rulesH:"How it works",rules:["Six fixtures every round. Predict the full-time score of each.","An exact score is worth 5 points. The right result is worth 2.","The Golden Goal is the minute of the first goal across all six. It settles ties.","Picks lock at the first kick-off. Then everyone's picks are revealed."],
 joinH:"A private season.",joinM:"Six fixtures every round. Call the scores, pick the minute of the first goal, and climb the table.",
 nick:"Your name in the league",nickPh:"For example Bu Salem",nickErr:"Use at least two characters.",join:"Join the league",joined:"Welcome to SUBAR 6",
 signInT:"Sign in",joinT:"Join",email:"Email",password:"Password",pwHint:"At least 8 characters",code:"Invite code",codeHint:"From the member who invited you",
 signIn:"Sign in",signUp:"Create account and join",forgot:"Forgot password",resetSent:"Check your email for a reset link.",newPw:"New password",setPw:"Save new password",pwSaved:"Password saved",
 confirmEmail:"Check your email to confirm your account, then sign in.",signOut:"Sign out",authErr:"Email or password is not right.",
 badCode:"That invite code is not right.",weakPw:"Use at least 8 characters.",badEmail:"Enter a valid email.",locked:"Picks are locked for this round.",
 noRound:"No round is open",noRoundUser:"The next round opens on its own when the fixtures are published.",noRoundAdmin:"The autopilot opens rounds on its own. You can also open one from Admin.",
 resultsH:"Results",everyone:"Everyone's picks",hiddenH:"Hidden until kick-off",hiddenM:(a,b)=>`${a} of ${b} members have saved picks so far.`,nobody:"Nobody predicted this round.",
 member:"Member",total:"Pts",savedAt:"Saved",exact5:"Exact score, 5",right2:"Right result, 2",live:"Live",ft:"Full time",draw:"Draw",
 no:n=>`No. ${String(n).padStart(3,"0")}`,since:"Member since",position:"Position",points:"Points",avg:"Per round",exactN:"Exact scores",rightN:"Right results",wonN:"Rounds won",
 choose:"Member",h2h:"Head to head",vs:"Against",h2hNeed:"Head to head starts when another member joins.",h2hAfter:"Head to head starts after the first completed round.",wins:"wins",draws:"level",
 adminH:"Admin",adminOnly:"This page is for admins only.",adminSub:n=>`${n} ${n===1?"member":"members"} in the league.`,current:"Current round",
 autoH:"Autopilot",autoM:"Opens each round from the real Premier League fixtures, locks it at the first kick-off, and settles results and the Golden Goal.",autoOn:"On",autoOff:"Off",runNow:"Run now",lastRun:"Last action",callsToday:n=>`${n} of 80 data requests used today`,never:"Nothing yet",
 inviteH:"Invite code",inviteM:"Share it with friends so they can join. A new code stops the old one working.",newCode:"New code",copy:"Copy",copied:"Copied",
 resultsT:n=>`Round ${n} results`,fg:"Minute of the first goal (90 if goalless)",saveResults:"Save results",resultsSaved:"Results saved",lockNow:"Lock picks now",reopen:"Reopen picks",lockedMsg:"Picks locked",reopenedMsg:"Picks reopened",resNote:"A round counts toward the table once all six results are in.",
 newT:n=>`Open round ${n} by hand`,homeN:i=>`Home ${i}`,awayL:"Away",ko:"Kick-off (Kuwait time)",deadline:"Pick deadline (blank means the first kick-off)",openN:n=>`Open round ${n}`,opened:n=>`Round ${n} is open`,
 needSix:"Fill all six fixtures: two different teams and a kick-off for each.",dup:"A team appears in more than one fixture.",curChanged:"Current round updated",choosePh:"Choose",lockedS:"Locked",openS:"Open",
 err:{perm:"You don't have permission for that change.",gen:"Couldn't save. Check your connection and try again.",load:"Couldn't load the league. Check your connection."},retry:"Try again",
 private:"Private league. Invitation only.",
 allSaved:tm=>`All six saved${tm?`, ${tm}`:""}`,allSavedNoGG:"Six scores saved. Now the Golden Goal.",saveNow:"Save now",cheer:"All six saved. Good luck.",
 units:{d:"d",h:"h",m:"m",s:"s"},toDark:"Switch to dark mode",toLight:"Switch to light mode",yourName:"Your membership",langSwitch:"Switch to Arabic",
 hi:{m:"Good morning",a:"Good afternoon",e:"Good evening"},whoIn:"Who's in",yourSix:"Your six",matchday:"Matchday",viewAll:"View all",winnerSub:p=>`Round winner with ${p} points`,
 onb:[["Six matches. One perfect six.","Predict the full-time score of six Premier League fixtures every round."],["Name the minute.","Pick the minute of the first goal. The Golden Goal settles every tie."],["Climb the table.","Exact scores are worth five. Bragging rights last all week. Town House 10 only."]],
 skip:"Skip",next:"Next",getStarted:"Get started"}};
const LANG="en";
/* theme: follows the device until the member picks one in the header */
const DARKQ=matchMedia("(prefers-color-scheme: dark)");
const isDark=()=>{const v=document.documentElement.dataset.theme;return v?v==="dark":DARKQ.matches};
function applyTheme(v){const h=document.documentElement;if(v)h.dataset.theme=v;else delete h.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",isDark()?"#050E24":"#0B3D91")}
try{applyTheme(localStorage.getItem("ss-theme"))}catch(_){applyTheme(null)}
DARKQ.addEventListener?.("change",()=>{applyTheme(document.documentElement.dataset.theme);if(S.ready)shell()});
let t=T[LANG];
function applyLang(){t=T[LANG];const h=document.documentElement;h.lang=t.lang;h.dir=t.dir;document.title="SUBAR 6"}

/* ===================== icons: SUBAR 6 library, 24 grid, 2 stroke ===================== */
const sv=b=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${b}</g></svg>`;
const I={
 home:sv('<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.6 2.6-1.4 4.2H9.8L8.4 10.2z"/><path d="M12 3v4.6M15.6 10.2l4.6-1.4M14.2 14.4l2.8 3.8M9.8 14.4L7 18.2M8.4 10.2L3.8 8.8"/>'),
 round:sv('<rect x="3" y="5" width="18" height="12" rx="2.5"/><path d="M12 5v12M7.5 9v4M15 9h2.5v2h-2.5v2h2.5M8 21h8"/>'),
 table:sv('<path d="M4 20h16"/><rect x="5" y="11" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="15" y="14" width="4" height="6" rx="1"/>'),
 player:sv('<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/>'),
 admin:sv('<path d="M6 4v3m0 4v9M12 4v9m0 4v3M18 4v1m0 4v11"/><path d="M4 9h4M10 15h4M16 7h4"/>'),
 check:sv('<path d="M4.5 12.5l5 5L19.5 7"/>'),
 pennant:sv('<path d="M5 3v18"/><path d="M5 4.5l14 4.5-14 4.5z"/>'),
 gg:sv('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><path d="M12 3v2M21 12h-2"/>'),
 lock:sv('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2"/>'),
 live:sv('<circle cx="12" cy="12" r="2.2" fill="currentColor"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>'),
 globe:sv('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/><path d="M4.6 7.5h14.8M4.6 16.5h14.8"/>'),
 ticket:sv('<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v1.5A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5V16a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6.5A1.5 1.5 0 0 0 19.5 5h-15A1.5 1.5 0 0 0 3 6.5z"/><path d="M15 5v14" stroke-dasharray="2 2.4"/>'),
 clock:sv('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M18 6.5l1.5-1.5"/>'),
  theme:sv('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>'),
 err:sv('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.3"/>')};

/* ===================== state ===================== */
const S={uid:null,isAdmin:false,demo:false,ready:false,loadFailed:false,
 meta:null,rounds:{},players:{},picks:{},status:{},counts:{},got:{},
 page:"home",viewRound:null,viewPlayer:null,vsPlayer:null,authTab:"in",invite:null,
 draft:null,draftRound:null,draftSrc:null,dirty:false,saveState:"clean",ver:0,savedAt:null,kp:null};


/* ===================== helpers ===================== */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KW={timeZone:"Asia/Kuwait"};
const LOC=()=>"en-GB";
const fDay=iso=>new Date(iso).toLocaleDateString(LOC(),{...KW,weekday:"short",day:"numeric",month:"short"}).replace(",","");
const fLong=iso=>new Date(iso).toLocaleDateString(LOC(),{...KW,weekday:"long",day:"numeric",month:"long"}).replace(",","");
const fWd=iso=>new Date(iso).toLocaleDateString(LOC(),{...KW,weekday:"short"});
const fTime=iso=>new Date(iso).toLocaleTimeString("en-GB",{...KW,hour:"2-digit",minute:"2-digit"});
const pad=(n,l=2)=>String(n).padStart(l,"0");
const name=c=>CLUBS[c]||c;
const sname=c=>SHORT[c]||CLUBS[c]||c;
const sgn=(h,a)=>Math.sign(h-a);
const ptsFor=(p,r)=>!Array.isArray(p)||!Array.isArray(r)?0:(p[0]===r[0]&&p[1]===r[1]?5:(sgn(p[0],p[1])===sgn(r[0],r[1])?2:0));
const RM=matchMedia("(prefers-reduced-motion: reduce)");
let toastT;function toast(m,bad){const el=$("#toast");el.textContent=m;el.classList.toggle("bad",!!bad);el.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove("on"),2600)}
function crest(c,size){return BUNDLED.has(c)?`<img class="crest" src="crests/${c}.webp" alt="" width="${size||32}" height="${size||32}" loading="lazy">`:`<span class="crest-ph" aria-hidden="true">${esc(c)}</span>`}
function roundList(){return Object.entries(S.rounds).map(([id,r])=>({id,...r})).sort((a,b)=>a.n-b.n)}
function current(){const id=S.meta?.currentRound;return id&&S.rounds[id]?{id,...S.rounds[id]}:roundList().at(-1)||null}
const isLocked=r=>!!r&&(!!r.locked||Date.now()>=new Date(r.deadline).getTime());
const isSettled=r=>!!r&&r.fixtures?.length===6&&r.fixtures.every(f=>Array.isArray(f.res)||f.void);
const pickOf=(uid,rid)=>S.picks[uid]?.rounds?.[rid]||null;
const dname=uid=>S.players[uid]?.nick||t.member;
const initials=uid=>dname(uid).split(/\s+/).filter(Boolean).slice(0,2).map(w=>[...w][0]).join("").toUpperCase();
const bn=uid=>`<bdi>${esc(dname(uid))}</bdi>`;
const av=uid=>`<span class="avatar" aria-hidden="true">${esc(initials(uid))}</span>`;
const memberNo=uid=>Object.entries(S.players).sort((a,b)=>String(a[1].joinedAt||"").localeCompare(String(b[1].joinedAt||""))).findIndex(([u])=>u===uid)+1;
const fullPick=v=>Array.isArray(v)&&v[0]!=null&&v[1]!=null;


function roundScores(r){
  const fg=r.firstGoal??null;
  return Object.keys(S.players).map(uid=>{const p=pickOf(uid,r.id);let pts=0,ex=0,rs=0;
    (r.fixtures||[]).forEach(f=>{const v=ptsFor(p?.s?.[f.id],f.res);pts+=v;if(v===5)ex++;else if(v===2)rs++});
    return {uid,pts,ex,rs,gg:p?.gg??null,ggd:p&&p.gg!=null&&fg!=null?Math.abs(p.gg-fg):Infinity,played:!!p}})
   .sort((a,b)=>b.pts-a.pts||a.ggd-b.ggd);
}
function standings(upto){
  const T0={};Object.keys(S.players).forEach(u=>T0[u]={uid:u,pts:0,ex:0,rs:0,won:0,played:0,hist:[]});
  roundList().filter(isSettled).slice(0,upto??undefined).forEach(r=>{const sc=roundScores(r),top=sc[0];
    sc.forEach(x=>{const s=T0[x.uid];if(!s)return;s.pts+=x.pts;s.ex+=x.ex;s.rs+=x.rs;if(x.played)s.played++;
      if(top&&x.played&&top.pts>0&&x.pts===top.pts&&x.ggd===top.ggd)s.won++;s.hist.push({n:r.n,pts:x.pts})})});
  return Object.values(T0).sort((a,b)=>b.pts-a.pts||b.ex-a.ex||b.won-a.won);
}
function table(){const n=roundList().filter(isSettled).length;const now=standings();
  const prev=n>1?standings(n-1):null;const pr={};prev?.forEach((s,i)=>pr[s.uid]=i);
  return now.map((s,i)=>({...s,rank:i+1,last:s.hist.at(-1)?.pts??null,move:prev&&pr[s.uid]!=null?pr[s.uid]-i:null}))}


/* ===================== data (Supabase; RLS decides what comes back) ===================== */
let sb=null,reloadT=null;
const cfg=window.SUBAR||{};
const errMsg=e=>{const m=String(e?.message||e||"");return /row-level security|violates/i.test(m)?t.locked:/invite code/i.test(m)?t.badCode:/Invalid login/i.test(m)?t.authErr:m||t.err.gen};
async function q(p){try{const {data,error}=await p;if(error){toast(errMsg(error),true);return null}return data??true}catch(e){toast(t.err.gen,true);return null}}
async function loadAll(){
  const [lg,rd,pl,pk,st]=await Promise.all([sb.from("league").select("*").maybeSingle(),sb.from("rounds").select("*").order("n"),sb.from("players").select("*"),sb.from("picks").select("*"),sb.from("pick_status").select("*")]);
  if(lg.error||rd.error||pl.error||pk.error){S.loadFailed=true;S.ready=true;render();return}
  const L=lg.data;S.meta=L?{season:L.season,currentRound:L.current_round,auto:L.auto,status:L.status,statusAt:L.status_at,calls:L.calls_day===new Date().toISOString().slice(0,10)?L.calls_today:0}:null;
  S.rounds={};(rd.data||[]).forEach(r=>{(r.fixtures||[]).forEach(f=>{if(f.h&&!CLUBS[f.h])CLUBS[f.h]=f.hn||f.h;if(f.a&&!CLUBS[f.a])CLUBS[f.a]=f.an||f.a});
    S.rounds[r.id]={n:r.n,deadline:r.deadline,locked:r.locked,firstGoal:r.first_goal,fixtures:r.fixtures||[],settledAt:r.settled_at}});
  S.players={};(pl.data||[]).forEach(p=>S.players[p.id]={nick:p.nick,isAdmin:p.is_admin,joinedAt:p.joined_at});
  S.picks={};(pk.data||[]).forEach(p=>{(S.picks[p.user_id]??={rounds:{}}).rounds[p.round_id]={s:p.s||{},gg:p.gg,at:p.at}});
  S.status={};if(!st.error)(st.data||[]).forEach(x=>{(S.status[x.round_id]??={})[x.user_id]={filled:x.filled,gg:x.has_gg,at:x.last_at,saves:x.saves}});   /* tolerated if the update hasn't been run */
  S.isAdmin=!!S.players[S.uid]?.isAdmin;
  const cr=current();S.counts={};if(cr&&!isLocked(cr)&&S.players[S.uid]){const {data}=await sb.rpc("pick_count",{r:cr.id});S.counts[cr.id]=data??0}
  if(S.isAdmin&&S.page==="admin"&&S.invite==null){const {data}=await sb.rpc("invite_code");S.invite=data}
  S.loadFailed=false;S.ready=true;
  softRender()}
const reload=()=>{clearTimeout(reloadT);reloadT=setTimeout(loadAll,250)};
function live(){sb.channel("subar").on("postgres_changes",{event:"*",schema:"public"},reload).subscribe()}
async function write(path,data,merge){
  if(S.demo){await new Promise(r=>setTimeout(r,450));demoWrite(path,data,merge);return true}
  const [c,id]=path.split("/");let ok;
  if(c==="picks"){const r=data.rounds[S.draftRound];ok=await q(sb.from("picks").upsert({user_id:S.uid,round_id:S.draftRound,s:r.s,gg:r.gg}))}
  else if(c==="rounds"){const m={};for(const [k,v] of Object.entries(data))m[{firstGoal:"first_goal"}[k]||k]=v;
    if(m.fixtures&&m.fixtures.every(f=>Array.isArray(f.res)||f.void))m.settled_at=new Date().toISOString();
    ok=await q(merge?sb.from("rounds").update(m).eq("id",id):sb.from("rounds").insert({id,...m}))}
  else if(c==="meta"&&id==="league"){ok=await q(sb.from("league").update({current_round:data.currentRound}).eq("id",1))}
  if(ok)reload();return !!ok}
function demoWrite(path,data,merge){const [c,id]=path.split("/");const tgt={meta:null,rounds:S.rounds,players:S.players,picks:S.picks}[c];
  if(c==="meta"){S.meta={...(merge?S.meta:{}),...data};return}
  tgt[id]=merge?{...tgt[id],...data}:data;
  if(c==="picks"){const r=data.rounds[S.draftRound];(S.status[S.draftRound]??={})[S.uid]={filled:Object.keys(r.s).length,gg:r.gg!=null,at:new Date().toISOString()}}}

/* ===================== sample data (no backend configured) ===================== */
function loadSample(){
  S.demo=true;S.uid="s1";S.isAdmin=true;
  const mk=(rows,res)=>rows.map(([h,a,ko,r],i)=>({id:"f"+(i+1),h,a,ko,res:res?r:null}));
  const prev=mk([["MCI","SUN","2026-09-20T13:00:00Z",[5,3]],["EVE","IPS","2026-09-19T14:00:00Z",[1,0]],["NFO","COV","2026-09-19T16:30:00Z",[0,1]],["BRE","CFC","2026-09-18T19:00:00Z",[3,0]],["LFC","ARS","2026-09-13T15:30:00Z",[1,1]],["AVL","NEW","2026-09-13T14:00:00Z",[2,0]]],1);
  const past=mk([["TOT","AVL","2026-09-19T11:30:00Z",[2,3]],["BRI","ARS","2026-09-19T14:00:00Z",[3,0]],["NEW","HUL","2026-09-19T14:00:00Z",[2,1]],["BOU","LFC","2026-09-20T13:00:00Z",[0,1]],["LEE","CRY","2026-09-20T13:00:00Z",[0,0]],["FUL","MUN","2026-09-20T15:30:00Z",[1,1]]],1);
  const next=mk([["ARS","LEE","2026-10-10T11:30:00Z"],["SUN","BRI","2026-10-10T14:00:00Z"],["AVL","BRE","2026-10-10T14:00:00Z"],["CFC","BOU","2026-10-10T16:30:00Z"],["HUL","EVE","2026-10-11T13:00:00Z"],["LFC","MCI","2026-10-11T15:30:00Z"]],0);
  S.rounds={s1:{n:1,deadline:"2026-09-13T11:00:00Z",fixtures:prev,firstGoal:14},s2:{n:2,deadline:"2026-09-18T19:00:00Z",fixtures:past,firstGoal:9},s3:{n:3,deadline:"2026-10-10T11:30:00Z",fixtures:next,firstGoal:null}};
  S.meta={season:"2026/27",currentRound:"s3",auto:true,status:"Opened round 3 (Regular Season - 7)",statusAt:"2026-10-08T15:02:00Z",calls:4};
  const nm=["Bu Salem","Mishari","Nawaf","Yousef A.","Fahad"];
  const g1=[[[3,1],[1,0],[1,1],[2,0],[1,1],[1,0]],[[2,0],[2,1],[0,1],[1,1],[2,2],[2,1]],[[4,2],[1,1],[0,0],[3,1],[0,1],[2,0]],[[2,1],[0,0],[1,2],[2,0],[1,1],[1,1]],[[3,0],[1,0],[0,1],[1,0],[1,0],[2,0]]];
  const g2=[[[1,2],[1,1],[2,1],[0,2],[0,0],[1,1]],[[2,1],[0,1],[3,0],[1,1],[1,0],[2,1]],[[2,3],[2,0],[2,0],[0,1],[1,1],[0,2]],[[1,1],[1,2],[2,1],[1,3],[0,0],[1,0]],[[0,2],[3,0],[1,0],[0,1],[2,1],[1,1]]];
  const m=g=>Object.fromEntries(g.map((x,j)=>["f"+(j+1),x]));
  nm.forEach((n,i)=>{const u="s"+(i+1);S.players[u]={nick:n,joinedAt:`2026-09-0${i+1}T10:00:00Z`};
    S.picks[u]={rounds:{s1:{s:m(g1[i]),gg:[12,20,8,15,30][i]},s2:{s:m(g2[i]),gg:[6,12,4,30,9][i]}}}});
  S.picks.s1.rounds.s3={s:{f1:[2,0],f2:[1,1],f3:[0,0]},gg:null,at:"2026-10-08T15:40:00Z"};
  S.status={s3:{s1:{filled:3,gg:false,at:"2026-10-08T15:40:00Z"},s3:{filled:6,gg:true,at:"2026-10-08T16:12:00Z"},s4:{filled:6,gg:true,at:"2026-10-08T14:02:00Z"}}};
  S.ready=true;
}


/* ===================== the mark: the SUBAR 6 monogram ===================== */
const MARK6=(cls="",size)=>`<span class="mark6 ${cls}" ${size?`style="height:${size}px"`:""} aria-hidden="true"></span>`;
const WM=`<span class="wm" aria-hidden="true"></span>`;
/* six progress pips in a row: one per fixture */
const SIX=(n,cls="")=>`<span class="six ${cls}" aria-hidden="true">${Array.from({length:6},(_,i)=>`<i class="${i<n?"on":""}" style="--i:${i}"></i>`).join("")}</span>`;
const greet=()=>{const h=+new Date().toLocaleString("en-GB",{...KW,hour:"2-digit",hour12:false});return h<12?t.hi.m:h<17?t.hi.a:t.hi.e};

/* ===================== shell ===================== */
const PAGES=["home","round","table","player"];
function shell(){
  const inLeague=S.demo||!!(S.uid&&S.players[S.uid]);
  const cur=p=>S.page===p?'aria-current="page"':"";
  const pages=inLeague?[...PAGES,...(S.isAdmin?["admin"]:[])]:[];
  $("#mast").innerHTML=`<div class="wrap mast-in"><button class="brand" type="button" data-go="home" aria-label="${esc(t.brand)}, ${esc(t.nav.home)}">${WM}<small class="bw-club">${t.club}</small></button>
    <nav class="mnav" aria-label="Sections">${pages.map(p=>`<button type="button" data-go="${p}" ${cur(p)}>${t.nav[p]}</button>`).join("")}</nav>
    <div class="mast-r">${S.demo?`<span class="flag">${t.sample}</span>`:""}
      <button class="circ" type="button" data-act="theme" aria-label="${isDark()?t.toLight:t.toDark}">${I.theme}</button>
      ${inLeague&&S.isAdmin?`<button class="circ adm-ico" type="button" data-go="admin" aria-label="${t.nav.admin}" ${cur("admin")}>${I.admin}</button>`:""}
      ${inLeague?`<button class="me" type="button" data-go="player" data-self aria-label="${t.yourName}">${esc(initials(S.uid))}</button>`:""}</div></div>`;
  const tb=$("#tabbar");tb.hidden=!inLeague;
  tb.innerHTML=`<div class="dock">${PAGES.map(p=>`<button type="button" data-go="${p}" ${cur(p)} aria-label="${t.nav[p]}">${I[p]}<span>${t.nav[p]}</span></button>`).join("")}</div>`;
}
function render(){
  applyLang();shell();
  let html;
  if(!S.ready) html=`<div class="wrap loading" aria-busy="true">${MARK6("load-mark")}<p class="meta">${t.loading}</p></div>`;
  else if(S.recovery) html=recoveryView();
  else if(!S.uid) html=authView();
  else if(S.loadFailed) html=`<div class="wrap empty"><h1 class="h2">${t.err.load}</h1><div><button class="btn quiet" type="button" data-act="retryload">${t.retry}</button></div></div>`;
  else if(!S.players[S.uid]) html=joinView();
  else html=({home,round:roundView,table:tableView,player:playerView,admin:adminView}[S.page]||home)();
  document.body.dataset.page=!S.uid||!S.players[S.uid]&&S.ready&&!S.demo?"door":S.page;
  $("#main").innerHTML=`<div class="page page-${S.page}">${html}</div>`;
  tick();postRender();
}
function softRender(){if(S.page==="home"&&Date.now()-(S.touchAt||0)<2500){clearTimeout(S.softT);S.softT=setTimeout(softRender,1200);return}render()}
function go(pg,after){
  const from=[...PAGES,"admin"].indexOf(S.page),to=[...PAGES,"admin"].indexOf(pg);
  const swap=()=>{S.page=pg;after?.();try{history.replaceState(null,"","#"+pg)}catch(_){}render();scrollTo({top:0});$("#main").focus({preventScroll:true})};
  if(pg!=="home")flushSave();
  if(!document.startViewTransition||RM.matches||from===to){swap();return}
  document.documentElement.dataset.nav=(to>from)===(t.dir==="ltr")?"fwd":"back";
  document.startViewTransition(swap);
}
const empty=(h,m,extra="")=>`<div class="empty card"><h2 class="h2">${esc(h)}</h2><p class="sub">${esc(m)}</p>${extra}</div>`;

/* ===================== the door: onboarding and access ===================== */
/* the door: the primary logo over pitch markings */
const STADIUM=`<div class="stadium" aria-hidden="true"><svg class="pitch" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" stroke-width="1"><rect x="20" y="20" width="360" height="200"/><path d="M200 20v200"/><circle cx="200" cy="120" r="34"/><rect x="20" y="70" width="44" height="100"/><rect x="336" y="70" width="44" height="100"/><path d="M64 98a24 24 0 0 1 0 44M336 98a24 24 0 0 0 0 44"/></g></svg>
  <img class="door-logo" src="brand/logo-primary-royal.svg" alt="" width="2116" height="960"></div>`;
function onboardSlides(){return t.onb.map(([h,p],i)=>`<div class="slide" aria-hidden="${i!==(S.onb||0)}"><h1 class="door-title">${h}</h1><p class="sub">${p}</p></div>`).join("")}
function authView(){const up=S.authTab==="up";
  let done=S.onbDone;if(done==null){try{done=localStorage.getItem("ss-onb")==="1"}catch(_){done=false}S.onbDone=done}
  const f=(id,l,type,ac,hint="")=>`<div class="field"><label for="${id}">${l}</label><input class="inp" id="${id}" type="${type}" autocomplete="${ac}" dir="${type==="email"||type==="password"?"ltr":"auto"}" ${hint?`aria-describedby="${id}-h"`:""}>${hint?`<span class="meta" id="${id}-h">${hint}</span>`:""}</div>`;
  const panel=!done?`<div class="slides" style="--s:${S.onb||0}">${onboardSlides()}</div>
      <div class="door-foot"><button class="link quiet" type="button" data-act="skip">${t.skip}</button><span class="dots" aria-hidden="true">${t.onb.map((_,i)=>`<i class="${i===(S.onb||0)?"on":""}"></i>`).join("")}</span>
      <button class="btn glow" type="button" data-act="${(S.onb||0)<t.onb.length-1?"next":"start"}">${(S.onb||0)<t.onb.length-1?t.next:t.getStarted}</button></div>`
    :`<p class="door-club">${t.club}<span>${t.members}</span></p><h1 class="door-title sm">${up?t.joinT:t.signInT}</h1>
    <form onsubmit="return false" class="door-form">
      <div class="seg" role="group" aria-label="${t.signInT} / ${t.joinT}"><button type="button" data-tab="in" aria-pressed="${!up}">${t.signInT}</button><button type="button" data-tab="up" aria-pressed="${up}">${t.joinT}</button></div>
      ${up?f("code",t.code,"text","off",t.codeHint)+f("nick",t.nick,"text","nickname",t.nickPh):""}
      ${f("em",t.email,"email","email")}${f("pw",t.password,"password",up?"new-password":"current-password",up?t.pwHint:"")}
      <p class="err" id="autherr" role="alert"></p>
      <button class="btn glow" type="button" data-act="${up?"signup":"signin"}">${up?t.signUp:t.signIn}</button>${up?"":`<button class="link" type="button" data-act="forgot">${t.forgot}</button>`}
    </form>`;
  return `<div class="door${done?" form":""}">${STADIUM}<div class="wrap door-in"><section class="glass door-panel">${panel}</section><p class="meta door-note">${t.private}</p></div></div>`}
function recoveryView(){return `<div class="door form">${STADIUM}<div class="wrap door-in"><section class="glass door-panel"><h1 class="door-title sm">${t.newPw}</h1>
  <form onsubmit="return false" class="door-form"><div class="field"><label for="npw">${t.newPw}</label><input class="inp" id="npw" type="password" autocomplete="new-password" minlength="8"></div>
  <button class="btn glow" type="button" data-act="setpw">${t.setPw}</button></form></section></div></div>`}
function joinView(){
  return `<div class="door form">${STADIUM}<div class="wrap door-in"><section class="glass door-panel"><p class="door-club">${t.club}<span>${t.members}</span></p><h1 class="door-title sm">${t.join}</h1><p class="sub">${t.joinM}</p>
    <form onsubmit="return false" class="door-form"><div class="field"><label for="code">${t.code}</label><input class="inp" id="code" autocomplete="off" dir="ltr" aria-describedby="code-h"><span class="meta" id="code-h">${t.codeHint}</span></div>
      <div class="field"><label for="nick">${t.nick}</label><input class="inp" id="nick" maxlength="24" autocomplete="nickname"></div>
      <p class="err" id="autherr" role="alert"></p>
      <button class="btn glow" type="button" data-act="join">${t.join}</button><button class="link" type="button" data-act="signout">${t.signOut}</button></form></section></div></div>`}

/* ===================== matchday ===================== */
const DH=40,MW=14;
function home(){
  const r=current();
  const hello=`<header class="hello"><span class="avatar lg" aria-hidden="true">${esc(initials(S.uid))}</span><div><p class="hello-1">${greet()}</p><p class="hello-2">${bn(S.uid)}</p></div></header>`;
  if(!r)return `<div class="wrap">${hello}${empty(t.noRound,S.isAdmin?t.noRoundAdmin:t.noRoundUser)}${railTable()}</div>`;
  ensureDraft(r);const locked=isLocked(r),settled=isSettled(r);
  const n=r.fixtures.filter(f=>fullPick(S.draft.s[f.id])).length;
  const hero=`<section class="hero-card" aria-labelledby="mwh">
      <span class="notch">${locked?(settled?t.final:`<i class="dot"></i>${t.st.locked}`):`${t.round(r.n)}`}</span>
      <h1 class="sr" id="mwh">${t.mw} ${r.n}</h1>
      ${locked?`<p class="hc-big">${t.mw} <b class="num">${pad(r.n)}</b></p><p class="hc-sub">${esc(t.lockedAt(fDay(r.deadline),fTime(r.deadline)))}</p>`
        :`<p class="hc-lbl">${t.locksIn}</p><div class="clock" data-deadline="${esc(r.deadline)}" role="timer" aria-live="off"><span class="dur" data-dur dir="ltr"></span></div><p class="hc-sub">${esc(t.locksAt(fLong(r.deadline),fTime(r.deadline)))}</p>`}
      <div class="hc-foot" id="heroDie">${SIX(n,"hc-six")}<span class="hc-n"><b class="num" id="heroN">${n}</b>/6</span></div></section>`;
  const fx=`<div class="sec-head"><h2 class="h2">${t.yourSix}</h2><span class="status" id="status" aria-live="polite"></span></div>
    <ol class="slate" id="fixtures" aria-label="${esc(t.round(r.n))}">${r.fixtures.map(f=>fixture(f,locked)).join("")}</ol>${ggBlock(r,locked)}${locked?"":`<div class="savebar" id="savebar" aria-live="polite"></div>`}`;
  return `<div class="wrap md">${hello}${whoRow(r)}
    <div class="grid"><div class="col-main"><div class="sec-head"><h2 class="h2">${t.matchday}</h2><span class="meta">${esc(S.meta?.season||"2026/27")}</span></div>${hero}${fx}</div>
    <aside class="rail" aria-label="${esc(t.tableH)}">${winCard()}${lastRound()}${room(r)}${railTable()}${rules()}</aside></div></div>`;
}
function whoRow(r){const st=S.status?.[r.id]||{},ids=Object.keys(S.players);const n=ids.filter(u=>st[u]).length;
  return `<div class="chips" role="list" tabindex="0" aria-label="${t.roomH}"><span class="chip on" role="listitem"><span class="chip-ico">${I.player}</span>${t.whoIn} <b class="num">${n}/${ids.length}</b></span>
    ${ids.sort((a,b)=>(st[b]?.filled||0)-(st[a]?.filled||0)).map(u=>{const s=st[u];const p=s?Math.round(s.filled/6*100):0;return `<span class="ring${s&&s.filled===6&&s.gg?" full":""}" role="listitem" style="--p:${p}" title="${esc(dname(u))}"><span class="avatar">${esc(initials(u))}</span><span class="sr">${esc(dname(u))}: ${s?t.of6(s.filled):t.notYet}</span></span>`}).join("")}</div>`}
function ensureDraft(r){const p=pickOf(S.uid,r.id);const src=JSON.stringify(p?{s:p.s,gg:p.gg}:null);
  if(S.draftRound!==r.id||!S.draft||(!S.dirty&&S.saveState!=="saving"&&src!==S.draftSrc)){S.draftSrc=src;
    S.draft={s:Object.fromEntries(Object.entries(p?.s||{}).map(([k,v])=>[k,[v[0],v[1]]])),gg:p?.gg??null};S.draftRound=r.id;S.dirty=false;
    if(S.saveState!=="saved")S.saveState="clean";if(p?.at&&!S.savedAt)S.savedAt=p.at}}
function cardState(f){const v=S.draft.s[f.id];const saved=pickOf(S.uid,S.draftRound)?.s?.[f.id];
  const full=fullPick(v);
  if(Array.isArray(v)&&!full)return"half";if(!v&&!saved)return"todo";
  if(full&&Array.isArray(saved)&&saved[0]===v[0]&&saved[1]===v[1])return"saved";
  if(S.saveState==="saving")return"saving";if(S.saveState==="failed")return"failed";return"edited"}
function drum(f,i,val,locked,club){
  if(locked)return `<span class="sc${val==null?" blank":""}" aria-label="${esc(t.goalsOf(club))}: ${val??"-"}">${val??"–"}</span>`;
  const k=val==null?0:val+1;
  return `<div class="drum" role="spinbutton" tabindex="0" aria-label="${esc(t.goalsOf(club))}" aria-valuemin="0" aria-valuemax="20" ${val!=null?`aria-valuenow="${val}"`:""} aria-valuetext="${val??t.ggUnset}" data-drum="${f}" data-i="${i}" data-k="${k}">
    <div class="drum-in">${["–",...Array.from({length:21},(_,j)=>j)].map((v,j)=>`<span data-j="${j}"${j===k?' class="on"':""}>${v}</span>`).join("")}</div></div>`}
function fixture(f,locked){
  const v=S.draft.s[f.id];const st=locked?"locked":cardState(f);
  const side=c=>`<div class="tm">${crest(c,52)}<span class="tm-n">${esc(sname(c))}</span></div>`;
  const res=f.void?`<span class="pill">${t.voidF}</span>`:f.res?`<span class="pill">${t.final} <b class="num" dir="ltr">${f.res[0]}–${f.res[1]}</b></span><span class="pts p${ptsFor(v,f.res)}">+${ptsFor(v,f.res)}</span>`:locked?`<span class="pill">${t.awaiting}</span>`:"";
  return `<li class="fx card" data-card="${f.id}" data-state="${st}">
    <div class="fx-line">${side(f.h)}<div class="fx-mid"><p class="fx-when"><span>${esc(fDay(f.ko))}</span><b class="num">${fTime(f.ko)}</b></p><div class="score">${drum(f.id,0,v?.[0],locked,name(f.h))}<span class="colon" aria-hidden="true">:</span>${drum(f.id,1,v?.[1],locked,name(f.a))}</div></div>${side(f.a)}</div>
    <div class="fx-foot"><span class="fx-state">${footState(f,st,locked)}</span>${res}</div></li>`}
const footState=(f,st,locked)=>locked?(Array.isArray(S.draft.s[f.id])?t.st.locked:t.st.none):st==="saved"?`${I.check}${t.st.saved}`:st==="todo"?t.swipe:t.st[st];
function ggBlock(r,locked){const g=S.draft.gg;
  const out=`<output class="gg-val${g==null?" unset":""}" id="ggout" dir="ltr">${g==null?"–":`${g}<sup>′</sup>`}</output>`;
  if(locked)return `<section class="gg card" aria-labelledby="ggh"><div class="gg-head"><h2 class="h2" id="ggh">${t.ggH}</h2><p class="sub">${r.firstGoal!=null?t.ggWas(r.firstGoal):t.ggP}</p></div><div class="gg-dial">${out}</div></section>`;
  const ticks=Array.from({length:90},(_,i)=>{const m=i+1;return `<i class="${m%15===0||m===1?"maj":m%5===0?"mid":""}" data-m="${m}">${m%15===0||m===1?`<b>${m===45?"HT":m}</b>`:""}</i>`}).join("");
  return `<section class="gg card" aria-labelledby="ggh"><div class="gg-head"><h2 class="h2" id="ggh">${t.ggH}</h2><p class="sub">${t.ggP}</p></div>
    <div class="gg-dial">${out}<p class="gg-hint" id="gghint">${g==null?t.ggSet:""}</p></div>
    <div class="mrail-wrap"><div class="mrail${g==null?" unset":""}" id="mrail" role="slider" tabindex="0" aria-label="${t.ggH}" aria-valuemin="1" aria-valuemax="90" aria-valuenow="${g??45}" aria-valuetext="${g==null?t.ggUnset:g}" dir="ltr"><div class="mrail-in">${ticks}</div></div><span class="mrail-cur" aria-hidden="true"></span></div></section>`}

function syncHead(){const r=current();if(!r||!S.draft)return;const locked=isLocked(r);
  const n=r.fixtures.filter(f=>fullPick(S.draft.s[f.id])).length;
  const half=Object.values(S.draft.s).some(v=>(v[0]==null)!==(v[1]==null));
  const k=locked?"clean":half&&S.saveState!=="saving"?"half":S.saveState==="saving"?"saving":S.saveState==="failed"?"failed":S.dirty?"pending":S.saveState==="saved"||S.savedAt?"saved":"clean";
  const tm=S.savedAt?fTime(S.savedAt):"";
  const all=n===6&&k==="saved"&&S.draft.gg!=null;
  const die=$("#heroDie");if(die){die.querySelectorAll(".six i").forEach((p,i)=>p.classList.toggle("on",i<n));$("#heroN").textContent=n;die.classList.toggle("all",all)}
  const el=$("#status");if(el){el.dataset.s=all?"all":k;el.innerHTML=k==="saved"||all?`${I.check}${t.save.saved(tm)}`:k==="saving"||k==="pending"?t.save.saving:k==="failed"?t.st.failed:""}
  const sb2=$("#savebar");if(sb2){sb2.dataset.s=all?"all":n===6&&k==="saved"?"nogg":k;
    sb2.innerHTML=`${SIX(n,"sb-six")}<span class="sb-msg">${all?t.allSaved(tm):n===6&&k==="saved"?t.allSavedNoGG:k==="failed"?t.save.failed:k==="half"?t.save.half:k==="saving"||k==="pending"?t.save.saving:k==="saved"?t.save.saved(tm):t.of6(n)}</span>
      ${k==="failed"?`<button class="sb-btn bad" type="button" data-act="retrysave">${t.retry}</button>`:k==="pending"?`<button class="sb-btn" type="button" data-act="savenow">${t.saveNow}</button>`:all?`<span class="sb-ok">${I.check}</span>`:""}`;
    if(all&&S.cheered!==r.id&&S.justSaved){S.cheered=r.id;celebrate()}S.justSaved=false}}
function syncRow(fid){const r=current();const f=r?.fixtures.find(x=>x.id===fid);const el=document.querySelector(`[data-card="${fid}"]`);if(!f||!el)return;
  const prev=el.dataset.state,st=cardState(f);el.dataset.state=st;
  if(st==="saved"&&prev!=="saved"&&!RM.matches){el.classList.remove("just-saved");void el.offsetWidth;el.classList.add("just-saved")}
  const v=S.draft.s[fid];
  [0,1].forEach(k=>{const d=el.querySelector(`[data-drum="${fid}"][data-i="${k}"]`);if(!d)return;const val=v?.[k];
    if(val!=null)d.setAttribute("aria-valuenow",val);else d.removeAttribute("aria-valuenow");d.setAttribute("aria-valuetext",val??t.ggUnset);
    const want=val==null?0:val+1;if(+d.dataset.k!==want&&!d.dataset.user){d.dataset.k=want;d.scrollTop=want*DH;markDrum(d,want)}});
  el.querySelector(".fx-state").innerHTML=footState(f,st,false)}
const syncAll=()=>{const r=current();if(!r)return;r.fixtures.forEach(f=>syncRow(f.id));syncHead()};
function celebrate(){const d=$(".hero-card");if(!d||RM.matches)return;d.classList.remove("cheer");void d.offsetWidth;d.classList.add("cheer")}

/* ===================== the rail ===================== */
function winCard(){const r=roundList().filter(isSettled).at(-1);if(!r)return"";const top=roundScores(r).filter(x=>x.played)[0];if(!top||top.pts<=0)return"";
  return `<section class="win-card" aria-label="${esc(t.winner(r.n,dname(top.uid),top.pts))}"><span class="notch">${t.round(r.n)}</span><span class="crown" aria-hidden="true">${I.pennant}</span>
    <span class="avatar xl">${esc(initials(top.uid))}</span><p class="win-name">${bn(top.uid)}</p><p class="win-sub">${t.winnerSub(top.pts)}</p></section>`}
function room(r){const st=S.status?.[r.id]||{},ids=Object.keys(S.players),locked=isLocked(r);
  const rows=ids.map(u=>({u,s:st[u]})).sort((a,b)=>(b.s?1:0)-(a.s?1:0)||(b.s&&a.s?new Date(b.s.at)-new Date(a.s.at):dname(a.u).localeCompare(dname(b.u))));
  const n=rows.filter(x=>x.s).length;
  return `<section class="section card room-card" aria-labelledby="roomh"><div class="section-head"><h2 class="h2" id="roomh">${t.roomH}</h2><span class="meta num">${n}/${ids.length}</span></div>
    <ol class="room">${rows.map(({u,s})=>`<li><span class="avatar">${esc(initials(u))}</span><span class="room-who"><span class="nm">${bn(u)}${u===S.uid?`<em>${t.you}</em>`:""}</span><small>${s?`${t.of6(s.filled)}${s.gg?`, ${t.ggShort}`:""}`:t.notYet}</small></span>
      <span class="room-r">${SIX(s?s.filled:0,"mini-six")}<span class="when">${s?`${esc(fWd(s.at))} <span class="num">${fTime(s.at)}</span>`:""}</span></span></li>`).join("")}</ol>
    <p class="foot-note">${locked?t.roomLocked:t.roomOpen}</p></section>`}
function lastRound(){const r=roundList().filter(isSettled).at(-1);
  if(!r)return "";
  const mine=pickOf(S.uid,r.id);
  return `<section class="section card" aria-labelledby="lasth"><div class="section-head"><h2 class="h2" id="lasth">${t.lastH}</h2><button class="link" type="button" data-go="round" data-round="${r.id}">${t.viewAll}</button></div>
    <ol class="last">${r.fixtures.map(f=>{const v=mine?.s?.[f.id];const p=ptsFor(v,f.res);
      return `<li><span class="h">${crest(f.h,22)}${esc(sname(f.h))}</span><span class="sc2 num" dir="ltr">${f.void?"P":`${f.res[0]}–${f.res[1]}`}</span><span class="a">${esc(sname(f.a))}${crest(f.a,22)}</span><span class="pts ${v?"p"+p:""}">${v?"+"+p:"–"}</span></li>`}).join("")}</ol></section>`}
function railTable(){const tb=table();if(!roundList().some(isSettled))return `<section class="section card"><div class="section-head"><h2 class="h2">${t.tableH}</h2></div><p class="foot-note">${t.noTable}</p></section>`;
  const top=tb.slice(0,5),me=tb.find(x=>x.uid===S.uid);
  return `<section class="section card" aria-labelledby="mth"><div class="section-head"><h2 class="h2" id="mth">${t.tableH}</h2><button class="link" type="button" data-go="table">${t.viewAll}</button></div>
    <ol class="standings mini">${[...top,...(me&&me.rank>5?[me]:[])].map(s=>standRow(s,tb,true)).join("")}</ol></section>`}
const rules=()=>`<section class="section card"><div class="section-head"><h2 class="h2">${t.rulesH}</h2></div><ol class="rules">${t.rules.map((x,i)=>`<li><span class="num">${i+1}</span>${x}</li>`).join("")}</ol></section>`;

/* ===================== results ===================== */
function roundView(){
  const list=roundList();if(!list.length)return `<div class="wrap">${empty(t.noRound,t.noRoundUser)}</div>`;
  const r=list.find(x=>x.id===S.viewRound)||current()||list.at(-1);S.viewRound=r.id;
  const locked=isLocked(r),sc=roundScores(r).filter(x=>x.played),mine=pickOf(S.uid,r.id);
  const now=Date.now();
  const board=f=>{const v=mine?.s?.[f.id];const p=f.res?ptsFor(v,f.res):null;const ko=new Date(f.ko).getTime();const live=!f.res&&!f.void&&now>=ko&&now<ko+115*6e4;
    const picks=locked?Object.keys(S.players).map(u=>pickOf(u,r.id)?.s?.[f.id]).filter(Array.isArray):[];
    const H=picks.filter(x=>x[0]>x[1]).length,D=picks.filter(x=>x[0]===x[1]).length,A=picks.filter(x=>x[0]<x[1]).length,N=picks.length;
    const split=N?`<div class="odds" role="img" aria-label="${H} ${esc(name(f.h))}, ${D} ${t.draw}, ${A} ${esc(name(f.a))}"><span class="pill"><small>1</small><b class="num">${H}</b></span><span class="pill"><small>X</small><b class="num">${D}</b></span><span class="pill"><small>2</small><b class="num">${A}</b></span></div>`:"";
    return `<li class="mc card${live?" is-live":""}">${live?`<span class="notch live"><i class="dot"></i>${t.live}</span>`:""}<div class="mc-board"><div class="tm">${crest(f.h,56)}<span class="tm-n">${esc(sname(f.h))}</span></div>
      <div class="mc-score">${f.res?`<div class="big num" dir="ltr">${f.res[0]}<span class="c">:</span>${f.res[1]}</div><span class="mc-st">${t.ft}</span>`:f.void?`<span class="mc-st">${t.voidF}</span>`:`<span class="mc-st">${esc(fDay(f.ko))}</span><div class="big num ko" dir="ltr">${fTime(f.ko)}</div>`}</div>
      <div class="tm">${crest(f.a,56)}<span class="tm-n">${esc(sname(f.a))}</span></div></div>
      ${v?`<p class="mc-mine">${t.yourPick} <b class="num" dir="ltr">${v[0]}–${v[1]}</b>${p!=null?`<span class="pts p${p}">+${p}</span>`:""}</p>`:""}${split}</li>`};
  let body;
  if(!locked)body=empty(t.hiddenH,t.hiddenM(S.counts?.[r.id]??Object.keys(S.status?.[r.id]||{}).length,Object.keys(S.players).length));
  else if(!sc.length)body=empty(t.everyone,t.nobody);
  else body=`<div class="card pad"><div class="picks-wrap" tabindex="0" role="region" aria-label="${t.everyone}"><table class="picks"><thead><tr><th scope="col">${t.member}</th>${r.fixtures.map(f=>`<th scope="col">${esc(f.h)} ${esc(f.a)}<span class="num" dir="ltr">${f.res?f.res.join("–"):"–"}</span></th>`).join("")}<th scope="col">${t.ggShort}</th><th scope="col">${t.total}</th><th scope="col">${t.savedAt}</th></tr></thead><tbody>
    ${sc.map(x=>{const p=pickOf(x.uid,r.id);return `<tr><td><span class="who"><span class="avatar">${esc(initials(x.uid))}</span><span>${bn(x.uid)}${x.uid===S.uid?` <span class="meta">${t.you}</span>`:""}</span></span></td>
      ${r.fixtures.map(f=>{const v=p?.s?.[f.id];const pt=f.res&&v?ptsFor(v,f.res):null;return `<td><span class="pk ${pt==null?"":"p"+pt}" dir="ltr">${v?`${v[0]}–${v[1]}`:"–"}</span></td>`}).join("")}
      <td class="num">${x.gg??"–"}</td><td class="num tot">${x.pts}</td><td class="meta">${(()=>{const at=S.status?.[r.id]?.[x.uid]?.at||p?.at;return at?`${esc(fWd(at))} <span class="num">${fTime(at)}</span>`:"–"})()}</td></tr>`}).join("")}</tbody></table></div>
    <div class="legend"><span><span class="pk p5">2–1</span> ${t.exact5}</span><span><span class="pk p2">2–1</span> ${t.right2}</span>${r.firstGoal!=null?`<span>${t.ggWas(r.firstGoal)}</span>`:""}</div></div>`;
  return `<div class="wrap"><header class="page-head"><h1 class="title">${t.resultsH}</h1>
      <div class="tabs" role="group" aria-label="${t.mw}">${list.slice().reverse().map(x=>`<button type="button" data-round="${x.id}" aria-pressed="${x.id===r.id}">${t.round(x.n)}</button>`).join("")}</div></header>
    <div class="grid"><ol class="boards" aria-label="${esc(t.round(r.n))}">${r.fixtures.map(board).join("")}</ol>
      <section class="section" aria-labelledby="evh"><div class="sec-head"><h2 class="h2" id="evh">${t.everyone}</h2></div>${body}</section></div></div>`;
}

/* ===================== table ===================== */
function standRow(s,tb,mini){const above=tb[s.rank-2];const below=tb[s.rank];
  const mv=s.move==null||s.move===0?"":s.move>0?`<span class="mv up" aria-label="up ${s.move}">▲${s.move}</span>`:`<span class="mv down" aria-label="down ${-s.move}">▼${-s.move}</span>`;
  const rival=s.rank===1?(below?t.leads(s.pts-below.pts):""):t.behind(above.pts-s.pts,dname(above.uid));
  return `<li><button class="st ${s.rank===1?"lead":""} ${s.uid===S.uid?"mine":""}" type="button" data-player="${esc(s.uid)}" data-move="${s.move||0}">
    <span class="st-rank num">${s.rank}</span><span class="avatar">${esc(initials(s.uid))}</span>
    <span class="st-mid"><span class="st-name">${bn(s.uid)}${s.rank===1?`<span class="lead-ico" aria-hidden="true">${I.pennant}</span>`:""}${mv}</span>${mini?"":`<span class="st-sub">${esc(t.exactWon(s.ex,s.won))}</span>`}<span class="st-rival">${esc(rival)}</span></span>
    <span class="st-pts num">${s.pts}${s.last!=null&&!mini?`<small>${t.lastRd(s.last)}</small>`:""}</span></button></li>`}
function tableView(){const tb=table();const n=roundList().filter(isSettled).length;
  const head=`<header class="page-head"><h1 class="title">${t.tableH}</h1><p class="sub">${n?esc(t.after(n)):""}</p></header>`;
  if(!n)return `<div class="wrap">${head}${empty(t.tableH,t.noTable)}</div>`;
  const pod=tb.slice(0,3);
  const podium=`<div class="podium">${[pod[1],pod[0],pod[2]].filter(Boolean).map(s=>`<button class="pod pod-${s.rank}" type="button" data-player="${esc(s.uid)}"><span class="avatar xl">${esc(initials(s.uid))}</span><span class="pod-name">${bn(s.uid)}</span><span class="pod-pts num">${s.pts}</span><span class="pod-step num">${s.rank}</span></button>`).join("")}</div>`;
  return `<div class="wrap narrow">${head}${podium}<div class="card pad"><ol class="standings" id="standings">${tb.map(s=>standRow(s,tb,false)).join("")}</ol></div>
    <p class="foot-note">${t.rules[1]} ${t.rules[2]}</p></div>`}

/* ===================== member ===================== */
function playerView(){const ids=Object.keys(S.players);const uid=ids.includes(S.viewPlayer)?S.viewPlayer:S.uid;S.viewPlayer=uid;
  const others=ids.filter(x=>x!==uid),vs=others.includes(S.vsPlayer)?S.vsPlayer:others[0]||null;S.vsPlayer=vs;
  const tb=table(),me=tb.find(x=>x.uid===uid)||{pts:0,ex:0,rs:0,won:0,played:0,hist:[]};
  const set=roundList().filter(isSettled);const per=set.map(r=>{const sc=roundScores(r);return{n:r.n,a:sc.find(x=>x.uid===uid)?.pts||0,b:vs?sc.find(x=>x.uid===vs)?.pts||0:0}});
  const h=per.reduce((o,p)=>(p.a>p.b?o.a++:p.b>p.a?o.b++:o.d++,o),{a:0,b:0,d:0});
  const opts=(l,v)=>l.map(x=>`<option value="${esc(x)}" ${x===v?"selected":""}>${esc(dname(x))}</option>`).join("");
  const joined=S.players[uid]?.joinedAt;
  const pass=`<section class="pass" aria-label="${t.yourName}">
      <div class="pass-top">${MARK6("pass-mark")}<span class="pass-club">${t.club}</span><span class="num pass-no">${t.no(memberNo(uid)||1)}</span></div>
      <h1 class="pass-name">${bn(uid)}</h1>
      <div class="pass-row"><span>${t.since}<b>${joined?esc(new Date(joined).toLocaleDateString(LOC(),{...KW,month:"short",year:"numeric"})):"2026"}</b></span><span>${t.position}<b class="num">${me.rank||"–"}</b></span><span>${t.points}<b class="num">${me.pts}</b></span></div></section>`;
  const stats=`<dl class="stats">${[[t.avg,me.played?(Math.round(me.pts/me.played*10)/10):"–"],[t.wonN,me.won],[t.exactN,me.ex],[t.rightN,me.rs]].map(([k,v])=>`<div class="card stat"><dt>${k}</dt><dd class="num">${v}</dd></div>`).join("")}</dl>`;
  const h2h=`<section class="section card" aria-labelledby="h2hh"><div class="section-head"><h2 class="h2" id="h2hh">${t.h2h}</h2></div>
    ${!vs?`<p class="foot-note">${t.h2hNeed}</p>`:`<div class="field" style="margin-top:14px"><label for="selv">${t.vs}</label><select id="selv">${opts(others,vs)}</select></div>
    ${!per.length?`<p class="foot-note">${t.h2hAfter}</p>`:`<div class="odds vs"><span class="pill"><small>${bn(uid)}</small><b class="num">${h.a}</b></span><span class="pill"><small>${t.draws}</small><b class="num">${h.d}</b></span><span class="pill"><small>${bn(vs)}</small><b class="num">${h.b}</b></span></div>
      <div class="vs-strip" role="list">${per.map(p=>`<div role="listitem" class="${p.a>p.b?"w":p.b>p.a?"l":""}"><b class="num" dir="ltr">${p.a}–${p.b}</b><span>${t.round(p.n)}</span></div>`).join("")}</div>`}`}</section>`;
  return `<div class="wrap member"><div class="member-page"><div>${pass}
      <div class="card pad member-ctl"><div class="field"><label for="selp">${t.choose}</label><select id="selp">${opts(ids,uid)}</select></div>
      ${uid===S.uid&&!S.demo?`<button class="btn quiet" type="button" data-act="signout">${t.signOut}</button>`:""}</div></div>
    <div>${stats}${h2h}</div></div></div>`}

/* ===================== edits + autosave ===================== */
function setScore(fid,i,val){const r=current();if(!r||isLocked(r))return;const cur=S.draft.s[fid]?[...S.draft.s[fid]]:[null,null];
  cur[i]=val;if(cur[0]==null&&cur[1]==null)delete S.draft.s[fid];else S.draft.s[fid]=cur;S.dirty=true;S.ver++;if(S.saveState!=="saving")S.saveState="dirty";
  syncRow(fid);syncHead();queueSave()}
function setGG(v){S.draft.gg=Math.max(1,Math.min(90,v));S.dirty=true;S.ver++;if(S.saveState!=="saving")S.saveState="dirty";
  const o=$("#ggout");if(o){o.innerHTML=`${S.draft.gg}<sup>′</sup>`;o.classList.remove("unset")}$("#mrail")?.classList.remove("unset");const h=$("#gghint");if(h)h.textContent="";
  const mr=$("#mrail");if(mr){mr.setAttribute("aria-valuenow",S.draft.gg);mr.setAttribute("aria-valuetext",S.draft.gg)}syncHead();queueSave()}
let saveT=null,saving=false;
function queueSave(ms=900){clearTimeout(saveT);saveT=setTimeout(save,ms)}
function flushSave(){if(S.dirty){clearTimeout(saveT);save()}}
async function save(){const r=current();if(!r||!S.draft||!S.dirty)return;if(isLocked(r)){toast(t.locked,true);render();return}
  if(saving){queueSave(400);return}
  if(!S.demo&&!S.ready)return;
  const clean=Object.fromEntries(Object.entries(S.draft.s).filter(([,v])=>v[0]!=null&&v[1]!=null).map(([k,v])=>[k,[v[0],v[1]]]));
  const prev=pickOf(S.uid,r.id);
  if(prev&&JSON.stringify(prev.s)===JSON.stringify(clean)&&prev.gg===S.draft.gg){S.dirty=Object.values(S.draft.s).some(v=>(v[0]==null)!==(v[1]==null));S.saveState="saved";syncAll();return}
  if(!prev&&!Object.keys(clean).length&&S.draft.gg==null){syncAll();return}
  const v=S.ver;saving=true;S.saveState="saving";syncAll();
  const rounds={...(S.picks[S.uid]?.rounds||{}),[r.id]:{s:clean,gg:S.draft.gg,at:new Date().toISOString()}};
  const ok=await write("picks/"+S.uid,{rounds});saving=false;
  if(ok){S.picks[S.uid]={rounds};S.draftSrc=JSON.stringify({s:clean,gg:S.draft.gg});S.savedAt=new Date().toISOString();S.saveState="saved";S.justSaved=true;
    S.dirty=S.ver!==v||Object.values(S.draft.s).some(x=>(x[0]==null)!==(x[1]==null));if(S.ver!==v)queueSave(300)}
  else S.saveState="failed";
  syncAll()}


/* ===================== admin (unchanged behaviour) ===================== */
function adminView(){if(!S.isAdmin)return `<div class="wrap">${empty(t.adminH,t.adminOnly)}</div>`;
  const list=roundList(),r=current(),next=(list.at(-1)?.n??0)+1,M=S.meta||{};
  const clubOpts=Object.keys(CLUBS).sort((a,b)=>name(a).localeCompare(name(b))).map(k=>`<option value="${k}">${esc(name(k))}</option>`).join("");
  const auto=`<section class="panel"><div class="section-head" style="border:0;padding:0"><h2 class="h2">${t.autoH}</h2>
      <div class="seg2" role="group" aria-label="${t.autoH}"><button type="button" data-act="auto" data-v="1" aria-pressed="${!!M.auto}">${t.autoOn}</button><button type="button" data-act="auto" data-v="0" aria-pressed="${!M.auto}">${t.autoOff}</button></div></div>
    <p class="sub" style="font-size:14px">${t.autoM}</p><p style="margin-top:14px"><span class="meta">${t.lastRun}</span><br>${esc(M.status||t.never)}${M.statusAt?` <span class="meta">${esc(fDay(M.statusAt))} ${fTime(M.statusAt)}</span>`:""}</p>
    <p class="meta" style="margin-top:6px">${t.callsToday(M.calls||0)}</p><div style="margin-top:14px"><button class="btn quiet" type="button" data-act="runauto">${t.runNow}</button></div></section>`;
  const invite=`<section class="panel"><h2 class="h2">${t.inviteH}</h2><p class="sub" style="font-size:14px">${t.inviteM}</p>
    <div class="row" style="margin-top:14px;gap:16px"><span class="code">${esc(S.invite||"------")}</span><button class="btn quiet" type="button" data-act="copycode">${t.copy}</button><button class="link" type="button" data-act="newcode">${t.newCode}</button></div></section>`;
  const res=r?`<section class="panel"><div class="section-head" style="border:0;padding:0"><h2 class="h2">${t.resultsT(r.n)}</h2><span class="meta">${isLocked(r)?t.lockedS:t.openS}</span></div>
    <ol class="adm-res">${r.fixtures.map(f=>`<li><span>${esc(name(f.h))}</span><span class="in">${f.void?`<span class="meta">${t.voidF}</span>`:""}<input id="rh-${f.id}" inputmode="numeric" maxlength="2" aria-label="${esc(t.goalsOf(name(f.h)))}" value="${f.res?f.res[0]:""}"><span class="meta">:</span><input id="ra-${f.id}" inputmode="numeric" maxlength="2" aria-label="${esc(t.goalsOf(name(f.a)))}" value="${f.res?f.res[1]:""}"></span><span class="a">${esc(name(f.a))}</span></li>`).join("")}</ol>
    <div class="field" style="max-width:360px;margin-top:14px"><label for="fg">${t.fg}</label><input class="inp" id="fg" inputmode="numeric" maxlength="2" value="${r.firstGoal??""}"></div>
    <div class="row" style="margin-top:14px"><button class="btn" type="button" data-act="results" data-r="${esc(r.id)}">${t.saveResults}</button><button class="btn quiet" type="button" data-act="lock" data-r="${esc(r.id)}">${r.locked?t.reopen:t.lockNow}</button></div>
    <p class="meta" style="margin-top:10px">${t.resNote}</p></section>`:"";
  const nr=`<section class="panel"><h2 class="h2">${t.newT(next)}</h2>
    ${Array.from({length:6},(_,i)=>`<div class="form-grid" style="padding:12px 0;border-bottom:1px solid var(--rule)">
      <div class="field"><label for="nh${i}">${t.homeN(i+1)}</label><select id="nh${i}"><option value="">${t.choosePh}</option>${clubOpts}</select></div>
      <div class="field"><label for="na${i}">${t.awayL}</label><select id="na${i}"><option value="">${t.choosePh}</option>${clubOpts}</select></div>
      <div class="field full"><label for="nk${i}">${t.ko}</label><input class="inp" id="nk${i}" type="datetime-local"></div></div>`).join("")}
    <div class="field" style="margin-top:12px"><label for="ndl">${t.deadline}</label><input class="inp" id="ndl" type="datetime-local"></div>
    <div style="margin-top:14px"><button class="btn" type="button" data-act="newround" data-n="${next}">${t.openN(next)}</button></div></section>`;
  return `<div class="wrap"><header style="padding:24px 0 18px"><h1 class="title">${t.adminH}</h1><p class="sub">${t.adminSub(Object.keys(S.players).length)}</p>
    ${list.length?`<div class="field" style="max-width:280px;margin-top:16px"><label for="setcur">${t.current}</label><select id="setcur">${list.map(x=>`<option value="${esc(x.id)}" ${x.id===r?.id?"selected":""}>${t.round(x.n)}</option>`).join("")}</select></div>`:""}</header>
    <div class="grid adm"><div class="adm">${auto}${res}${invite}</div><div class="adm">${nr}</div></div></div>`}


/* ===================== countdown + post-render ===================== */
function tick(){const el=$("[data-deadline]");if(!el)return;const ms=new Date(el.dataset.deadline)-Date.now();
  if(ms<=0){sb?reload():render();return}
  const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3),u=t.units;
  el.classList.toggle("warn",ms<3*36e5);
  el.querySelector("[data-dur]").innerHTML=(d?`<b>${d}</b><i>${u.d}</i>`:"")+`<b>${pad(h)}</b><i>${u.h}</i><b>${pad(m)}</b><i>${u.m}</i><b class="s">${pad(s)}</b><i>${u.s}</i>`;
  el.setAttribute("aria-label",`${t.locksIn} ${d?d+u.d+" ":""}${h}${u.h} ${m}${u.m}`)}
setInterval(()=>{if($("[data-deadline]"))tick()},1000);
function postRender(){
  if(S.page==="home"&&S.draft){syncHead();
    $$(".drum").forEach(d=>{const k=+d.dataset.k;d.scrollTop=k*DH;markDrum(d,k)});
    const mr=$("#mrail");if(mr){const g=S.draft.gg??45;mr.scrollLeft=(g-1)*MW;markRail(mr,g)}}
  /* rank movement: rows that changed position slide from where they were, once per visit */
  if(S.page==="table"&&!RM.matches&&!S.movedShown){S.movedShown=true;$$("#standings .st").forEach(b=>{const mv=+b.dataset.move;if(mv){b.style.setProperty("--from",`${mv*100}%`);b.classList.add("moving")}})}
}
const kwIso=v=>v?new Date(v+":00+03:00").toISOString():null;

/* ===================== drums and the minute rail: native scroll physics, snapped ===================== */
function markDrum(d,k){d.querySelectorAll("span.on").forEach(x=>x.classList.remove("on"));d.querySelector(`[data-j="${k}"]`)?.classList.add("on")}
function markRail(mr,m){mr.querySelectorAll("i.on").forEach(x=>x.classList.remove("on"));mr.querySelector(`[data-m="${m}"]`)?.classList.add("on")}
const buzz=()=>{try{navigator.vibrate?.(3)}catch(_){}};
function commitDrum(d,k){const f=d.dataset.drum,i=+d.dataset.i;const val=k===0?null:k-1;d.dataset.k=k;
  if((S.draft.s[f]?.[i]??null)!==val)setScore(f,i,val)}
function commitRail(mr){const m=Math.max(1,Math.min(90,Math.round(mr.scrollLeft/MW)+1));if(S.draft.gg!==m)setGG(m)}
const userMark=e=>{const d=e.target.closest?.(".drum,#mrail");if(d){d.dataset.user="1";S.touchAt=Date.now()}};
["pointerdown","touchstart","wheel"].forEach(ev=>document.addEventListener(ev,userMark,{passive:true,capture:true}));
document.addEventListener("scroll",e=>{const el=e.target;if(!(el instanceof Element))return;
  if(el.classList.contains("drum")){const k=Math.max(0,Math.min(21,Math.round(el.scrollTop/DH)));if(el._k!==k){el._k=k;markDrum(el,k);if(el.dataset.user)buzz()}
    if(el.dataset.user){S.touchAt=Date.now();clearTimeout(el._t);el._t=setTimeout(()=>{commitDrum(el,k);delete el.dataset.user},130)}}
  else if(el.id==="mrail"){const m=Math.max(1,Math.min(90,Math.round(el.scrollLeft/MW)+1));if(el._m!==m){el._m=m;markRail(el,m);if(el.dataset.user){buzz();
      const o=$("#ggout");o.innerHTML=`${m}<sup>′</sup>`;o.classList.remove("unset");el.classList.remove("unset");$("#gghint").textContent=""}}
    if(el.dataset.user){S.touchAt=Date.now();clearTimeout(el._t);el._t=setTimeout(()=>{commitRail(el);delete el.dataset.user},160)}}},true);
function stepDrum(d,k){k=Math.max(0,Math.min(21,k));d.scrollTo({top:k*DH,behavior:RM.matches?"auto":"smooth"});markDrum(d,k);commitDrum(d,k)}
function stepRail(mr,m){m=Math.max(1,Math.min(90,m));mr.scrollTo({left:(m-1)*MW,behavior:RM.matches?"auto":"smooth"});markRail(mr,m);setGG(m)}

/* ===================== interactions ===================== */
document.addEventListener("click",async e=>{
  const g=e.target.closest("[data-go]");if(g){const pg=g.dataset.go;go(pg,()=>{if(g.hasAttribute("data-self"))S.viewPlayer=S.uid;if(g.dataset.round)S.viewRound=g.dataset.round});
    if(pg==="admin"&&sb&&S.isAdmin&&S.invite==null)sb.rpc("invite_code").then(({data})=>{S.invite=data;if(S.page==="admin")render()});return}
  const pl=e.target.closest("[data-player]");if(pl){go("player",()=>{S.viewPlayer=pl.dataset.player});return}
  const tb=e.target.closest("[data-tab]");if(tb){S.authTab=tb.dataset.tab;render();return}
  const rb=e.target.closest("[data-round]");if(rb){S.viewRound=rb.dataset.round;render();return}
  const ds=e.target.closest(".drum [data-j]");if(ds){const d=ds.closest(".drum");stepDrum(d,+ds.dataset.j);return}
  const tk=e.target.closest("#mrail [data-m]");if(tk){stepRail($("#mrail"),+tk.dataset.m);return}
  const act=e.target.closest("[data-act]");if(!act)return;const a=act.dataset.act;
  const authErr=m=>{const el=$("#autherr");if(el)el.textContent=m};
  if(a==="next"){S.onb=(S.onb||0)+1;const sl=$(".slides");if(sl&&!RM.matches){sl.style.setProperty("--s",S.onb);sl.querySelectorAll(".slide").forEach((x,i)=>x.setAttribute("aria-hidden",i!==S.onb));$$(".dots i").forEach((x,i)=>x.classList.toggle("on",i===S.onb));if(S.onb>=t.onb.length-1){act.dataset.act="start";act.textContent=t.getStarted}}else render();return}
  if(a==="start"||a==="skip"){S.onbDone=true;try{localStorage.setItem("ss-onb","1")}catch(_){}if(document.startViewTransition&&!RM.matches){document.documentElement.dataset.nav="fade";document.startViewTransition(render)}else render();return}
  if(a==="theme"){const v=isDark()?"light":"dark";try{localStorage.setItem("ss-theme",v)}catch(_){}
    const run=()=>{applyTheme(v);shell()};if(document.startViewTransition&&!RM.matches){document.documentElement.dataset.nav="fade";document.startViewTransition(run)}else run();return}
  if(a==="retrysave"){S.saveState="dirty";S.dirty=true;save();return}
  if(a==="savenow"){if(S.dirty)flushSave();else toast(t.save.saved(S.savedAt?fTime(S.savedAt):""));return}
  if(a==="join"||a==="signup"){const code=($("#code").value||"").trim(),nick=($("#nick").value||"").trim().slice(0,24);
    if(code.length<4)return authErr(t.badCode);if(nick.length<2)return authErr(t.nickErr);act.disabled=true;
    if(a==="signup"){const email=($("#em").value||"").trim(),pw=$("#pw").value||"";
      if(!/^\S+@\S+\.\S+$/.test(email)){act.disabled=false;return authErr(t.badEmail)}if(pw.length<8){act.disabled=false;return authErr(t.weakPw)}
      S.pendingJoin={code,nick};const {data,error}=await sb.auth.signUp({email,password:pw});
      if(error){act.disabled=false;return authErr(errMsg(error))}if(!data.session){act.disabled=false;return authErr(t.confirmEmail)}S.uid=data.session.user.id}
    const {error}=await sb.rpc("join_league",{code,nick});S.pendingJoin=null;
    if(error){act.disabled=false;return authErr(errMsg(error))}toast(t.joined);await loadAll();return}
  if(a==="signin"){const email=($("#em").value||"").trim(),pw=$("#pw").value||"";act.disabled=true;const {error}=await sb.auth.signInWithPassword({email,password:pw});if(error){act.disabled=false;authErr(errMsg(error))}return}
  if(a==="forgot"){const email=($("#em").value||"").trim();if(!/^\S+@\S+\.\S+$/.test(email))return authErr(t.badEmail);const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});authErr(error?errMsg(error):t.resetSent);return}
  if(a==="setpw"){const pw=$("#npw").value||"";if(pw.length<8)return toast(t.weakPw,true);if(await q(sb.auth.updateUser({password:pw}))){S.recovery=false;toast(t.pwSaved);loadAll()}return}
  if(a==="signout"){S.authTab="in";S.page="home";await sb.auth.signOut();return}
  if(a==="retryload"){S.ready=false;render();loadAll();return}
  if(a==="auto"){if(S.demo){S.meta.auto=act.dataset.v==="1";render();return}if(await q(sb.from("league").update({auto:act.dataset.v==="1"}).eq("id",1)))reload();return}
  if(a==="runauto"){if(S.demo)return toast(t.sample);act.disabled=true;const r=await q(sb.rpc("run_autopilot"));act.disabled=false;if(r)toast(String(r));reload();return}
  if(a==="newcode"){if(S.demo)return;const c=await q(sb.rpc("new_invite_code"));if(c){S.invite=c;render()}return}
  if(a==="copycode"){try{await navigator.clipboard.writeText(S.invite||"");toast(t.copied)}catch(_){}return}
  if(a==="lock"){const r=S.rounds[act.dataset.r];if(await write("rounds/"+act.dataset.r,{locked:!r.locked},true)){toast(r.locked?t.reopenedMsg:t.lockedMsg);render()}return}
  if(a==="results"){const id=act.dataset.r,r=S.rounds[id];const num=v=>{v=v.trim();return v!==""&&/^\d{1,2}$/.test(v)?+v:null};
    const fixtures=r.fixtures.map(f=>{const h=num($("#rh-"+f.id).value),aw=num($("#ra-"+f.id).value);return{...f,res:h!=null&&aw!=null?[h,aw]:null}});
    const fg=num($("#fg").value);if(await write("rounds/"+id,{fixtures,firstGoal:fg==null?null:Math.max(1,Math.min(90,fg))},true)){toast(t.resultsSaved);render()}return}
  if(a==="newround"){const n=+act.dataset.n,fixtures=[];
    for(let i=0;i<6;i++){const h=$("#nh"+i).value,aw=$("#na"+i).value,ko=kwIso($("#nk"+i).value);if(!h||!aw||!ko||h===aw){toast(t.needSix,true);return}fixtures.push({id:"f"+(i+1),h,a:aw,ko,res:null})}
    if(new Set(fixtures.flatMap(f=>[f.h,f.a])).size!==12){toast(t.dup,true);return}
    const deadline=kwIso($("#ndl").value)||fixtures.map(f=>f.ko).sort()[0],id="r"+n;act.disabled=true;
    if(await write("rounds/"+id,{n,deadline,fixtures,firstGoal:null,locked:false})&&await write("meta/league",{season:S.meta?.season||"2026/27",currentRound:id})){toast(t.opened(n));S.page="home";render()}else act.disabled=false;return}
});
/* keyboard: drums are spinbuttons, the rail is a slider */
document.addEventListener("keydown",e=>{
  const d=e.target.closest?.(".drum");
  if(d){const k=+d.dataset.k;
    if(e.key==="ArrowUp"||e.key==="ArrowRight"&&t.dir==="ltr"||e.key==="ArrowLeft"&&t.dir==="rtl"){e.preventDefault();stepDrum(d,k===0?1:k+1)}
    else if(e.key==="ArrowDown"||e.key==="ArrowLeft"&&t.dir==="ltr"||e.key==="ArrowRight"&&t.dir==="rtl"){e.preventDefault();stepDrum(d,Math.max(k===1?1:0,k-1))}
    else if(/^[0-9]$/.test(e.key)){e.preventDefault();stepDrum(d,+e.key+1)}
    else if(e.key==="Backspace"||e.key==="Delete"){e.preventDefault();stepDrum(d,0)}
    else if(e.key==="Enter"){e.preventDefault();const all=$$(".drum");all[all.indexOf(d)+1]?.focus()}
    return}
  const mr=e.target.closest?.("#mrail");
  if(mr){const g=S.draft.gg??45,step=e.shiftKey?5:1;
    if(e.key==="ArrowRight"||e.key==="ArrowUp"){e.preventDefault();stepRail(mr,g+step)}
    else if(e.key==="ArrowLeft"||e.key==="ArrowDown"){e.preventDefault();stepRail(mr,g-step)}
    else if(e.key==="Home"){e.preventDefault();stepRail(mr,1)}else if(e.key==="End"){e.preventDefault();stepRail(mr,90)}}});
document.addEventListener("change",async e=>{const el=e.target;
  if(el.id==="selp"){S.viewPlayer=el.value;render()}
  if(el.id==="selv"){S.vsPlayer=el.value;render()}
  if(el.id==="setcur"){if(await write("meta/league",{season:S.meta?.season||"2026/27",currentRound:el.value}))toast(t.curChanged)}});
addEventListener("beforeunload",e=>{if(S.dirty){flushSave();e.preventDefault()}});
addEventListener("visibilitychange",()=>{if(document.hidden)flushSave()});

/* ===================== boot ===================== */
(()=>{const h=location.hash.slice(1);if(h==="predict")S.page="home";else if([...PAGES,"admin"].includes(h))S.page=h})();
render();
(async()=>{
  if(!window.supabase||!cfg.url||/YOUR/.test(cfg.url)){loadSample();render();return}   /* no backend configured: sample data */
  sb=supabase.createClient(cfg.url,cfg.key);
  sb.auth.onAuthStateChange((ev,session)=>{
    if(ev==="PASSWORD_RECOVERY"){S.recovery=true;S.uid=session?.user?.id||null;S.ready=true;render();return}
    const uid=session?.user?.id||null;if(uid===S.uid&&ev!=="SIGNED_IN"&&S.ready)return;
    S.uid=uid;S.invite=null;S.draft=null;S.draftRound=null;S.dirty=false;S.savedAt=null;
    if(!uid){S.ready=true;S.players={};S.picks={};S.rounds={};S.meta=null;render();return}
    if(S.pendingJoin)return;
    setTimeout(loadAll,0)});
  live();
  addEventListener("focus",()=>{if(S.uid)reload()});
})();
