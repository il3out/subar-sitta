/* Subar Sitta v2. Data, auth, scoring and the autopilot contract are unchanged from v1; the views are new. */
"use strict";

/* ===================== clubs ===================== */
const CLUBS={ARS:"Arsenal",AVL:"Aston Villa",BOU:"Bournemouth",BRE:"Brentford",BRI:"Brighton",CFC:"Chelsea",COV:"Coventry City",CRY:"Crystal Palace",EVE:"Everton",FUL:"Fulham",
 HUL:"Hull City",IPS:"Ipswich Town",LEE:"Leeds United",LEI:"Leicester City",LFC:"Liverpool",MCI:"Manchester City",MUN:"Manchester United",NEW:"Newcastle United",NFO:"Nottingham Forest",
 SOU:"Southampton",SUN:"Sunderland",TOT:"Tottenham Hotspur",WHU:"West Ham United",WOL:"Wolves"};
/* kit colours: only ever a 3px bar or a thin split segment */
const KIT={ARS:"#EF0107",AVL:"#95BFE5",BOU:"#DA291C",BRE:"#E30613",BRI:"#0057B8",CFC:"#034694",COV:"#59CBE8",CRY:"#1B458F",EVE:"#274488",FUL:"#E8E8E8",
 HUL:"#F5A12D",IPS:"#3A64A3",LEE:"#FFCD00",LEI:"#003090",LFC:"#C8102E",MCI:"#6CABDD",MUN:"#DA291C",NEW:"#D9D9D9",NFO:"#DD0000",SOU:"#D71920",SUN:"#EB172B",TOT:"#F2F2F2",WHU:"#7A263A",WOL:"#FDB913"};
const BUNDLED=new Set(Object.keys(CLUBS));

/* ===================== copy ===================== */
const t={
 nav:{home:"Matchday",round:"Results",table:"Table",player:"Member",admin:"Admin"},
 sample:"Sample data",loading:"Loading the league",
 mw:n=>`Matchweek`,round:n=>`Round ${n}`,
 locksIn:"Locks in",lockedAt:(d,tm)=>`Locked ${d}, ${tm}`,locksAt:(d,tm)=>`${d}, ${tm} Kuwait time`,
 inOf:n=>`${n} of 6 in`,gg:m=>m==null?"Golden Goal not set":`Golden Goal ${m}′`,
 save:{clean:"",pending:"⏳ Saving shortly",saving:"⏳ Saving",saved:tm=>`✅ Saved ${tm}`,failed:"⚠️ Not saved. Tap to retry",half:"✏️ Add the other score to save it"},
 st:{todo:"🤔 No prediction yet",half:"✏️ Add both scores",edited:"⏳ Not saved yet",saving:"⏳ Saving",saved:"✅ Saved",failed:"⚠️ Not saved",locked:"🔒 Locked in",none:"😶 No prediction"},
 final:"🏁 Full time",awaiting:"⏳ Awaiting result",voidF:"🚫 Postponed, not scored",
 goalsOf:c=>`${c} goals`,
 ggH:"⏱️ Golden Goal",ggP:"The minute of the first goal across all six. It settles ties on points.",ggSet:"Set the minute",ggWas:m=>`First goal came in minute ${m}.`,ggUnset:"Not set",
 kp:{for:"Goals for",clear:"Clear",done:"Done",less:"One fewer",more:"One more"},
 roomH:"👀 Who's in",roomOpen:"Scores stay hidden until kick-off.",roomLocked:"Everyone's picks are on the Results page.",notYet:"😴 Not in yet",ggShort:"GG",
 lastH:"🏁 Last round",lastNone:"Results appear here once a round is complete.",yourPick:"You",
 tableH:"🏆 The table",fullTable:"Full table",noTable:"The table starts once the first round is complete.",
 after:n=>n===1?"After 1 round":`After ${n} rounds`,exactWon:(e,w)=>`${e} exact, ${w} ${w===1?"round":"rounds"} won`,
 behind:(p,n)=>p===0?`🤝 Level with ${n}`:`🎯 ${p} behind ${n}`,leads:p=>p===0?"🤝 Level at the top":`📈 Leads by ${p}`,you:"you",lastRd:p=>`${p} last round`,
 rulesH:"📖 How it works",rules:["⚽ Six fixtures every round. Predict the full-time score of each.","🎯 An exact score is worth 5 points. The right result (win, draw or loss) is worth 2.","⏱️ The Golden Goal is the minute of the first goal across all six. It settles ties.","🔒 Picks lock at the first kick-off. Then everyone's picks are revealed."],
 joinH:["A private","season"],joinM:"Six fixtures every round. Call the scores, pick the minute of the first goal, and climb the table.",
 nick:"Your name in the league",nickPh:"For example Bu Salem",nickErr:"Use at least two characters.",join:"Join the league",joined:"🎉 Welcome to Subar Sitta",
 signInT:"Sign in",joinT:"Join",email:"Email",password:"Password",pwHint:"At least 8 characters",code:"Invite code",codeHint:"From the person who invited you",
 signIn:"Sign in",signUp:"Create account and join",forgot:"Forgot password",resetSent:"Check your email for a reset link.",newPw:"New password",setPw:"Save new password",pwSaved:"✅ Password saved",
 confirmEmail:"Check your email to confirm your account, then sign in.",signOut:"Sign out",authErr:"Email or password is not right.",
 badCode:"That invite code is not right.",weakPw:"Use at least 8 characters.",badEmail:"Enter a valid email.",locked:"🔒 Picks are locked for this round.",
 noRound:"😴 No round is open",noRoundUser:"The next round opens automatically when the fixtures are published.",noRoundAdmin:"The autopilot opens rounds automatically. You can also open one from Admin.",
 resultsH:"Results",everyone:"Everyone's picks",hiddenH:"🙈 Picks are hidden until kick-off",hiddenM:(a,b)=>`${a} of ${b} members have saved picks so far.`,nobody:"🦗 Nobody predicted this round.",
 member:"Member",total:"Pts",savedAt:"Saved",exact5:"Exact score, 5",right2:"Right result, 2",live:"In play",ft:"FT",draw:"Draw",splitOf:n=>`${n} ${n===1?"pick":"picks"}`,
 pass:"Member",no:n=>`No. ${String(n).padStart(3,"0")}`,since:"Member since",season:"Season",position:"Position",points:"Points",avg:"Per round",exactN:"Exact scores",rightN:"Right results",wonN:"Rounds won",
 choose:"Member",h2h:"⚔️ Head to head",vs:"Against",h2hNeed:"Head to head starts when another member joins.",h2hAfter:"Head to head starts after the first completed round.",wins:"wins",draws:"level",
 adminH:"Admin",adminOnly:"This page is for admins only.",adminSub:n=>`${n} ${n===1?"member":"members"} in the league.`,current:"Current round",
 autoH:"Autopilot",autoM:"Opens each round from the real Premier League fixtures, locks it at the first kick-off, and settles results and the Golden Goal.",autoOn:"On",autoOff:"Off",runNow:"Run now",lastRun:"Last action",callsToday:n=>`${n} of 80 data requests used today`,never:"Nothing yet",
 inviteH:"Invite code",inviteM:"Share it with friends so they can join. A new code stops the old one working.",newCode:"New code",copy:"Copy",copied:"📋 Copied",
 resultsT:n=>`Round ${n} results`,fg:"Minute of the first goal (90 if goalless)",saveResults:"Save results",resultsSaved:"✅ Results saved",lockNow:"Lock picks now",reopen:"Reopen picks",lockedMsg:"Picks locked",reopenedMsg:"Picks reopened",resNote:"A round counts toward the table once all six results are in.",
 newT:n=>`Open round ${n} by hand`,homeN:i=>`Home ${i}`,awayL:"Away",ko:"Kick-off (Kuwait time)",deadline:"Pick deadline (blank means the first kick-off)",openN:n=>`Open round ${n}`,opened:n=>`🟢 Round ${n} is open`,
 needSix:"Fill all six fixtures: two different teams and a kick-off for each.",dup:"A team appears in more than one fixture.",curChanged:"Current round updated",
 err:{perm:"You don't have permission for that change.",quota:"Storage is full.",gen:"Couldn't save. Check your connection and try again.",load:"Couldn't load the league. Check your connection."},retry:"Try again",
 private:"🔐 Private league. Invitation only.",
 allSaved:tm=>`✅ All 6 saved${tm?` at ${tm}`:""}`,allSavedNoGG:"✅ 6 scores saved. Set the Golden Goal ⏱️",saveNow:"💾 Save my picks",saveTodo:n=>`✏️ ${n} of 6 in`,cheer:"✅ All six saved. Good luck 🍀",
 banner:["🔥 Six matches. Six exact scores. One perfect six.","🎯 Exact score 5 points. Right result 2.","⏱️ Golden Goal settles every tie.","👑 Bragging rights last a whole week."]};

/* ===================== signets: one construction, 1.6 stroke, round caps ===================== */
const sv=b=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${b}</svg>`;
const I={
 home:sv('<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 4v16M19 4v16"/><path d="M9 6h2m2 0h2M9 12h2m2 0h2M9 18h2m2 0h2"/></g><circle cx="12" cy="12" r="1.8" fill="currentColor"/>'),
 round:sv('<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 16.5A10 10 0 0 1 20 8M7.5 19a10 10 0 0 0 13-8"/><path d="M6.5 8.7l1.1 1.2M10 5.6l.5 1.7M14 5.4l-.3 1.8M18 7.2l-1.1 1.3"/><path d="M12 12l5-3" stroke-width="2"/></g><circle cx="12" cy="12" r="1.3" fill="currentColor"/>'),
 table:sv('<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 6.5h15M4 12h12M4 17.5h9"/></g><g fill="currentColor"><circle cx="21" cy="6.5" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="15" cy="17.5" r="1"/></g>'),
 player:sv('<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 8a7 7 0 0 1 12 0M5.5 14a7 7 0 0 0 13 0"/><path d="M5.2 10.4v1.4M18.8 10.4v1.4M9 4.5l.6 1.4M14.4 4.5l-.6 1.4M8.8 19.2l.8-1.3M15.2 19.2l-.8-1.3"/><path d="M12 9v6"/></g><circle cx="12" cy="8" r="1.2" fill="currentColor"/>'),
 admin:sv('<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 4v3m0 4v9M12 4v9m0 4v3M18 4v1m0 4v11"/><path d="M4 9h4M10 15h4M16 7h4"/></g>')};

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
const fDay=iso=>new Date(iso).toLocaleDateString("en-GB",{...KW,weekday:"short",day:"numeric",month:"short"}).replace(",","");
const fLong=iso=>new Date(iso).toLocaleDateString("en-GB",{...KW,weekday:"long",day:"numeric",month:"long"}).replace(",","");
const fWd=iso=>new Date(iso).toLocaleDateString("en-GB",{...KW,weekday:"short"});
const fTime=iso=>new Date(iso).toLocaleTimeString("en-GB",{...KW,hour:"2-digit",minute:"2-digit"});
const pad=(n,l=2)=>String(n).padStart(l,"0");
const name=c=>CLUBS[c]||c;
const sgn=(h,a)=>Math.sign(h-a);
const ptsFor=(p,r)=>!Array.isArray(p)||!Array.isArray(r)?0:(p[0]===r[0]&&p[1]===r[1]?5:(sgn(p[0],p[1])===sgn(r[0],r[1])?2:0));
const RM=matchMedia("(prefers-reduced-motion: reduce)");
let toastT;function toast(m,bad){const el=$("#toast");el.textContent=m;el.classList.toggle("bad",!!bad);el.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove("on"),2600)}
function crest(c,size){return BUNDLED.has(c)?`<img class="crest" src="crests/${c}.webp" alt="" ${size?`style="width:${size}px;height:${size}px"`:""} loading="lazy">`:`<span class="crest-ph" aria-hidden="true">${esc(c)}</span>`}
const kit=c=>`<span class="kit" style="--club:${KIT[c]||"var(--seam)"}" aria-hidden="true"></span>`;
function roundList(){return Object.entries(S.rounds).map(([id,r])=>({id,...r})).sort((a,b)=>a.n-b.n)}
function current(){const id=S.meta?.currentRound;return id&&S.rounds[id]?{id,...S.rounds[id]}:roundList().at(-1)||null}
const isLocked=r=>!!r&&(!!r.locked||Date.now()>=new Date(r.deadline).getTime());
const isSettled=r=>!!r&&r.fixtures?.length===6&&r.fixtures.every(f=>Array.isArray(f.res)||f.void);
const pickOf=(uid,rid)=>S.picks[uid]?.rounds?.[rid]||null;
const dname=uid=>S.players[uid]?.nick||"Member";
const initials=uid=>dname(uid).split(/\s+/).filter(Boolean).slice(0,2).map(w=>[...w][0]).join("").toUpperCase();
const av=uid=>`<span class="avatar" aria-hidden="true">${esc(initials(uid))}</span>`;
const memberNo=uid=>Object.entries(S.players).sort((a,b)=>String(a[1].joinedAt||"").localeCompare(String(b[1].joinedAt||""))).findIndex(([u])=>u===uid)+1;

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
  if(S.kp&&S.page==="home")refreshQuiet();else render()}
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

/* ===================== shell ===================== */
const PAGES=["home","round","table","player"];
function shell(){
  const inLeague=S.demo||!!(S.uid&&S.players[S.uid]);
  const cur=p=>S.page===p?'aria-current="page"':"";
  const pages=inLeague?[...PAGES,...(S.isAdmin?["admin"]:[])]:[];
  $("#mast").innerHTML=`<div class="wrap"><button class="brand" type="button" data-go="home" aria-label="Subar Sitta, Matchday"><img src="six-mark.webp" alt="" width="34" height="34"><span>Subar Sitta</span></button>
    <nav class="mnav" aria-label="Sections">${pages.map(p=>`<button type="button" data-go="${p}" ${cur(p)}>${t.nav[p]}</button>`).join("")}</nav>
    <div class="mast-r">${S.demo?`<span class="flag">${t.sample}</span>`:""}
      ${inLeague&&S.isAdmin?`<button class="icon-btn adm-ico" type="button" data-go="admin" aria-label="${t.nav.admin}" ${cur("admin")}>${I.admin}</button>`:""}
      ${inLeague?`<button class="me" type="button" data-go="player" data-self aria-label="Your membership">${esc(initials(S.uid))}</button>`:""}</div></div>`;
  const tb=$("#tabbar");tb.hidden=!inLeague;
  tb.innerHTML=PAGES.map(p=>`<button type="button" data-go="${p}" ${cur(p)}>${I[p]}<span>${t.nav[p]}</span></button>`).join("");
  $$(".adm-ico").forEach(b=>b.style.display=innerWidth>=1024?"none":"");
}
function render(){
  shell();
  let html;
  if(!S.ready) html=`<div class="wrap" aria-busy="true" style="padding-top:28px"><div class="skel" style="width:30%"></div><div class="skel" style="width:70%;height:72px;margin-top:16px"></div><div class="skel" style="width:50%;margin-top:16px"></div><p class="meta" style="margin-top:16px">${t.loading}</p></div>`;
  else if(S.recovery) html=recoveryView();
  else if(!S.uid) html=authView();
  else if(S.loadFailed) html=`<div class="wrap empty"><h1 class="h2">${t.err.load}</h1><div><button class="btn quiet" type="button" data-act="retryload">${t.retry}</button></div></div>`;
  else if(!S.players[S.uid]) html=joinView();
  else html=({home,round:roundView,table:tableView,player:playerView,admin:adminView}[S.page]||home)();
  $("#main").innerHTML=`<div class="page">${html}</div>`;
  if(S.page!=="home")closeKp(true);
  tick();postRender();
}
/* refresh everything except an open keypad's row focus */
function refreshQuiet(){const kp=S.kp;render();if(kp&&S.page==="home"){S.kp=kp;openKp(kp.f,kp.i,true)}}
const empty=(h,m,extra="")=>`<div class="empty"><h2 class="h2">${esc(h)}</h2><p class="sub">${esc(m)}</p>${extra}</div>`;

/* ===================== auth ===================== */
function recoveryView(){return `<div class="wrap"><section class="auth"><img class="auth-six" src="six.webp" alt="" width="120" height="118"><h1 class="title" style="font-size:64px">${t.newPw}</h1>
  <form onsubmit="return false"><div class="field"><label for="npw">${t.newPw}</label><input class="inp" id="npw" type="password" autocomplete="new-password" minlength="8"></div>
  <div><button class="btn" type="button" data-act="setpw">${t.setPw}</button></div></form></section></div>`}
function authView(){const up=S.authTab==="up";
  const f=(id,l,type,ac,hint="")=>`<div class="field"><label for="${id}">${l}</label><input class="inp" id="${id}" type="${type}" autocomplete="${ac}" ${hint?`aria-describedby="${id}-h"`:""}>${hint?`<span class="meta" id="${id}-h">${hint}</span>`:""}</div>`;
  return `<div class="wrap"><section class="auth"><img class="auth-six" src="six.webp" alt="" width="120" height="118">
    <h1 class="title" style="font-size:clamp(56px,16vw,96px)">${t.joinH[0]}<br><span class="t2">${t.joinH[1]}</span></h1>
    <p class="sub">${t.joinM}</p>
    <form onsubmit="return false">
      <div class="toggle" role="group" aria-label="Sign in or join"><button type="button" data-tab="in" aria-pressed="${!up}">${t.signInT}</button><button type="button" data-tab="up" aria-pressed="${up}">${t.joinT}</button></div>
      ${up?f("code",t.code,"text","off",t.codeHint)+f("nick",t.nick,"text","nickname",t.nickPh):""}
      ${f("em",t.email,"email","email")}${f("pw",t.password,"password",up?"new-password":"current-password",up?t.pwHint:"")}
      <p class="err" id="autherr" role="alert"></p>
      <div class="row"><button class="btn" type="button" data-act="${up?"signup":"signin"}">${up?t.signUp:t.signIn}</button>${up?"":`<button class="link" type="button" data-act="forgot">${t.forgot}</button>`}</div>
    </form><p class="meta" style="margin-top:34px">${t.private}</p></section></div>`}
function joinView(){
  return `<div class="wrap"><section class="auth"><img class="auth-six" src="six.webp" alt="" width="120" height="118">
    <h1 class="title" style="font-size:clamp(56px,16vw,96px)">${t.joinH[0]}<br><span class="t2">${t.joinH[1]}</span></h1><p class="sub">${t.joinM}</p>
    <form onsubmit="return false"><div class="field"><label for="code">${t.code}</label><input class="inp" id="code" autocomplete="off" aria-describedby="code-h"><span class="meta" id="code-h">${t.codeHint}</span></div>
      <div class="field"><label for="nick">${t.nick}</label><input class="inp" id="nick" maxlength="24" autocomplete="nickname"></div>
      <p class="err" id="autherr" role="alert"></p>
      <div class="row"><button class="btn" type="button" data-act="join">${t.join}</button><button class="link" type="button" data-act="signout">${t.signOut}</button></div></form></section></div>`}

/* floating watch: original Subar Sitta chronograph clip art */
const WATCH=`<svg class="float-watch" viewBox="0 0 120 170" aria-hidden="true" focusable="false">
<defs><linearGradient id="wc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F7FA"/><stop offset=".5" stop-color="#AEB9C6"/><stop offset="1" stop-color="#E3E9EF"/></linearGradient>
<radialGradient id="wd" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#1B3462"/><stop offset="1" stop-color="#0A1830"/></radialGradient></defs>
<path d="M42 4h36l4 34H38z" fill="#13254A"/><path d="M38 132h44l-4 34H42z" fill="#13254A"/>
<path d="M45 8v26M75 8v26M45 136v26M75 136v26" stroke="#5C7BA8" stroke-width="1" stroke-dasharray="3 3"/>
<rect x="100" y="78" width="9" height="14" rx="3" fill="url(#wc)"/>
<circle cx="60" cy="85" r="48" fill="url(#wc)"/><circle cx="60" cy="85" r="40" fill="url(#wd)"/>
<g stroke="#DCE4EC" stroke-linecap="round">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,r1=37,r2=i%3?33:30;return `<line x1="${(60+Math.sin(a)*r1).toFixed(1)}" y1="${(85-Math.cos(a)*r1).toFixed(1)}" x2="${(60+Math.sin(a)*r2).toFixed(1)}" y2="${(85-Math.cos(a)*r2).toFixed(1)}" stroke-width="${i%3?1.2:2.2}"/>`}).join("")}</g>
<circle cx="45" cy="92" r="9" fill="#A9D9F2" opacity=".9"/><circle cx="75" cy="92" r="9" fill="#A9D9F2" opacity=".9"/>
<line x1="45" y1="92" x2="45" y2="85" stroke="#0A1830" stroke-width="1.4"/><line x1="75" y1="92" x2="80" y2="95" stroke="#0A1830" stroke-width="1.4"/>
<text x="60" y="72" text-anchor="middle" font-family="Sofia Sans Extra Condensed,sans-serif" font-weight="800" font-size="16" fill="#F8FAFD">6</text>
<line x1="60" y1="85" x2="60" y2="58" stroke="#F8FAFD" stroke-width="2.4" stroke-linecap="round"/><line x1="60" y1="85" x2="78" y2="77" stroke="#F8FAFD" stroke-width="2.4" stroke-linecap="round"/>
<line class="fw-sec" x1="60" y1="90" x2="60" y2="50" stroke="#9CDEC2" stroke-width="1"/><circle cx="60" cy="85" r="2.6" fill="#F8FAFD"/></svg>`;
/* ===================== matchday ===================== */
function home(){
  const r=current();
  if(!r)return `<div class="wrap">${empty(t.noRound,S.isAdmin?t.noRoundAdmin:t.noRoundUser)}${railTable()}</div>`;
  ensureDraft(r);const locked=isLocked(r),settled=isSettled(r);
  const head=`<div class="banner" role="note"><span id="bannerTxt">${t.banner[0]}</span></div><header class="md-head"><img class="md-six" src="six.webp" alt="" width="640" height="631">${WATCH}
      <p class="md-round"><span>${t.round(r.n)}</span><span>${esc(S.meta?.season||"2026/27")}</span></p>
      <h1 class="title md-title">${locked?(settled?"Full time":"Locked"):"Matchweek"} <span class="t2 num">${pad(r.n)}</span></h1>
      ${locked?`<p class="when">${esc(t.lockedAt(fDay(r.deadline),fTime(r.deadline)))}</p>`
        :`<div class="chrono" data-deadline="${esc(r.deadline)}" role="timer" aria-live="off"><span class="lbl">${t.locksIn}</span><span data-dur></span></div><p class="when">${esc(t.locksAt(fLong(r.deadline),fTime(r.deadline)))}</p>`}
      <div class="ribbon" id="ribbon" role="img"></div>
      <div class="status" id="status"></div>
    </header>`;
  const fx=`<section class="ledger" id="fixtures" aria-label="Your predictions">${r.fixtures.map(f=>fixture(f,locked)).join("")}</section>${ggBlock(r,locked)}${locked?"":`<div class="savebar" id="savebar" aria-live="polite"></div>`}`;
  return `<div class="md"><div class="wrap">${head}
    <div class="grid"><div>${fx}</div><aside class="rail" aria-label="League">${room(r)}${lastRound()}${railTable()}${rules()}</aside></div></div></div>`;
}
function ensureDraft(r){const p=pickOf(S.uid,r.id);const src=JSON.stringify(p?{s:p.s,gg:p.gg}:null);
  if(S.draftRound!==r.id||!S.draft||(!S.dirty&&S.saveState!=="saving"&&src!==S.draftSrc)){S.draftSrc=src;
    S.draft={s:Object.fromEntries(Object.entries(p?.s||{}).map(([k,v])=>[k,[v[0],v[1]]])),gg:p?.gg??null};S.draftRound=r.id;S.dirty=false;
    if(S.saveState!=="saved")S.saveState="clean";if(p?.at&&!S.savedAt)S.savedAt=p.at}}
/* EMPTY · HALF · EDITED(pending) · SAVING · SAVED · FAILED · LOCKED */
function cardState(f){const v=S.draft.s[f.id];const saved=pickOf(S.uid,S.draftRound)?.s?.[f.id];
  const full=Array.isArray(v)&&v[0]!=null&&v[1]!=null;
  if(Array.isArray(v)&&!full)return"half";if(!v&&!saved)return"todo";
  if(full&&Array.isArray(saved)&&saved[0]===v[0]&&saved[1]===v[1])return"saved";
  if(S.saveState==="saving")return"saving";if(S.saveState==="failed")return"failed";return"edited"}
function fixture(f,locked){
  const v=S.draft.s[f.id];const st=locked?"locked":cardState(f);
  const cell=k=>{const val=v?.[k];const c=name(k?f.a:f.h);
    return `<button class="cell ${val==null?"blank":""}" type="button" data-cell="${f.id}" data-i="${k}" ${locked?"disabled":""} aria-label="${esc(t.goalsOf(c))}: ${val??"not set"}"><span class="d">${val??"-"}</span></button>`};
  const side=(k)=>{const c=k?f.a:f.h;return `<div class="side">${kit(c)}${crest(c)}<span class="club">${esc(name(c))}</span>${cell(k)}</div>`};
  return `<article class="fx" data-card="${f.id}" data-state="${st}">
    <div class="fx-time">${fTime(f.ko)}<small>${esc(fWd(f.ko))}</small></div>
    <div class="fx-rows">${side(0)}${side(1)}</div>
    <div class="fx-foot"><span class="fx-state">${footState(f,st,locked)}</span>${f.void?`<span>${t.voidF}</span>`:f.res?`<span class="res"><span>${t.final}</span><span class="num">${f.res[0]}-${f.res[1]}</span><span class="pts p${ptsFor(v,f.res)}">+${ptsFor(v,f.res)}</span></span>`:locked?`<span>${t.awaiting}</span>`:""}</div></article>`}
const footState=(f,st,locked)=>locked?(Array.isArray(S.draft.s[f.id])?t.st.locked:t.st.none):t.st[st];
function ggBlock(r,locked){const g=S.draft.gg;
  const ticks=Array.from({length:19},(_,i)=>{const m=i*5;const x=(Math.max(1,m)-1)/89*100;return `<i class="${m%15===0?"maj":""}" style="left:${x}%"></i>`}).join("")+
    [[1,"1"],[15,"15"],[30,"30"],[45,"HT"],[60,"60"],[75,"75"],[90,"90"]].map(([m,l])=>`<span style="left:${(m-1)/89*100}%">${l}</span>`).join("");
  return `<section class="gg" aria-labelledby="ggh"><div class="gg-top"><output class="gg-min ${g==null?"unset":""}" id="ggout" aria-live="polite">${g==null?(locked?t.ggUnset:t.ggSet):`${g}<sup>′</sup>`}</output>
      <h2 id="ggh">${t.ggH}</h2><p>${locked&&r.firstGoal!=null?t.ggWas(r.firstGoal):t.ggP}</p></div>
    ${locked?"":`<div class="bezel ${g==null?"unset":""}" id="bezel"><div class="bezel-scale" aria-hidden="true">${ticks}</div>
      <input id="ggr" type="range" min="1" max="90" step="1" value="${g??45}" style="--p:${g==null?0:((g-1)/89*100).toFixed(1)}%" aria-label="${t.ggH} minute" aria-valuetext="${g==null?t.ggUnset:`minute ${g}`}"></div>
      <div class="gg-step"><button type="button" data-gg="-1" aria-label="One minute earlier">-1</button><button type="button" data-gg="1" aria-label="One minute later">+1</button></div>`}</section>`}
/* head: ribbon, counts, save status (updated in place, no re-render) */
function syncHead(){const r=current();if(!r||!S.draft)return;const locked=isLocked(r);
  const full=f=>{const v=S.draft.s[f.id];return Array.isArray(v)&&v[0]!=null&&v[1]!=null};
  const n=r.fixtures.filter(full).length;
  const rb=$("#ribbon");if(rb){rb.innerHTML=r.fixtures.map(f=>`<i class="${full(f)?"on":""}"></i>`).join("");rb.setAttribute("aria-label",`${n} of 6 predicted`)}
  const half=Object.values(S.draft.s).some(v=>(v[0]==null)!==(v[1]==null));
  const k=locked?"clean":half&&S.saveState!=="saving"?"half":S.saveState==="saving"?"saving":S.saveState==="failed"?"failed":S.dirty?"pending":S.saveState==="saved"||S.savedAt?"saved":"clean";
  const saveTxt=k==="saved"?(S.savedAt?t.save.saved(fTime(S.savedAt)):""):t.save[k];
  const sb2=$("#savebar");if(sb2){const all=n===6&&k==="saved";const tm=S.savedAt?fTime(S.savedAt):"";
    sb2.dataset.s=all?(S.draft.gg!=null?"all":"nogg"):k;
    sb2.innerHTML=all?`<span class="sb-msg">${S.draft.gg!=null?t.allSaved(tm):t.allSavedNoGG}</span>`
      :k==="failed"?`<button class="sb-btn bad" type="button" data-act="retrysave">${t.save.failed}</button>`
      :k==="saving"||k==="pending"?`<span class="sb-msg">${t.save.saving}</span>`
      :k==="half"?`<span class="sb-msg">${t.save.half}</span>`
      :k==="saved"?`<span class="sb-msg">${t.save.saved(tm)}. ${t.saveTodo(n)}</span>`
      :`<span class="sb-msg">${t.saveTodo(n)}</span><button class="sb-btn" type="button" data-act="savenow">${t.saveNow}</button>`;
    if(all&&S.draft.gg!=null&&S.cheered!==r.id&&S.saveState==="saved"&&S.justSaved){S.cheered=r.id;toast(t.cheer)}S.justSaved=false}
  const el=$("#status");if(el)el.innerHTML=`<span><b class="num">${n}</b> of 6 in</span><span>${esc(t.gg(S.draft.gg))}</span>${saveTxt?(k==="failed"?`<button class="save" type="button" data-s="failed" data-act="retrysave">${saveTxt}</button>`:`<span class="save" data-s="${k}" role="status">${saveTxt}</span>`):""}`}
function syncRow(fid,changedIdx){const r=current();const f=r?.fixtures.find(x=>x.id===fid);const el=document.querySelector(`[data-card="${fid}"]`);if(!f||!el)return;
  const prev=el.dataset.state,st=cardState(f);el.dataset.state=st;
  if(st==="saved"&&prev!=="saved"&&!RM.matches){el.classList.add("just-saved");el.style.setProperty("--x","0");requestAnimationFrame(()=>{})}
  const v=S.draft.s[fid];const saved=pickOf(S.uid,S.draftRound)?.s?.[fid];
  [0,1].forEach(k=>{const b=el.querySelector(`[data-cell="${fid}"][data-i="${k}"]`);const val=v?.[k];const d=b.querySelector(".d");
    const txt=val==null?"-":String(val);if(d.textContent!==txt){d.textContent=txt;if(k===changedIdx&&!RM.matches){d.classList.remove("in");void d.offsetWidth;d.classList.add("in")}}
    b.classList.toggle("blank",val==null);b.classList.toggle("dirty",val!=null&&(!saved||saved[k]!==val));
    b.setAttribute("aria-label",`${t.goalsOf(name(k?f.a:f.h))}: ${val??"not set"}`)});
  el.querySelector(".fx-state").textContent=footState(f,st,false)}
const syncAll=()=>{const r=current();if(!r)return;r.fixtures.forEach(f=>syncRow(f.id));syncHead()};

function room(r){const st=S.status?.[r.id]||{},ids=Object.keys(S.players),locked=isLocked(r);
  const rows=ids.map(u=>({u,s:st[u]})).sort((a,b)=>(b.s?1:0)-(a.s?1:0)||(b.s&&a.s?new Date(b.s.at)-new Date(a.s.at):dname(a.u).localeCompare(dname(b.u))));
  const n=rows.filter(x=>x.s).length;
  return `<section class="section" aria-labelledby="roomh"><div class="section-head"><h2 class="h2" id="roomh">${t.roomH}</h2><span class="meta"><span class="num" style="font-size:16px;color:var(--fg)">${n}</span> of ${ids.length}</span></div>
    <ol class="room">${rows.map(({u,s})=>`<li>${av(u)}<span><span class="nm">${esc(dname(u))}${u===S.uid?`<em>${t.you}</em>`:""}</span><small>${s?`${s.filled} of 6${s.gg?`, ${t.ggShort} set`:""}`:t.notYet}</small></span>
      <span class="row-r"><span class="tally" aria-hidden="true">${Array.from({length:6},(_,i)=>`<i class="${s&&i<s.filled?"on":""}"></i>`).join("")}</span><span class="when">${s?`${esc(fWd(s.at))} ${fTime(s.at)}`:""}</span></span></li>`).join("")}</ol>
    <p class="foot-note">${locked?t.roomLocked:t.roomOpen}</p></section>`}
function lastRound(){const r=roundList().filter(isSettled).at(-1);
  if(!r)return `<section class="section"><div class="section-head"><h2 class="h2">${t.lastH}</h2></div><p class="foot-note">${t.lastNone}</p></section>`;
  const mine=pickOf(S.uid,r.id);
  return `<section class="section" aria-labelledby="lasth"><div class="section-head"><h2 class="h2" id="lasth">${t.lastH}</h2><button class="link" type="button" data-go="round" data-round="${r.id}">${t.round(r.n)}</button></div>
    <ol class="last">${r.fixtures.map(f=>{const v=mine?.s?.[f.id];const p=ptsFor(v,f.res);
      return `<li><span>${esc(f.h)}</span><span class="sc">${f.void?"P":`${f.res[0]}-${f.res[1]}`}${v?`<span class="yp">${t.yourPick} ${v[0]}-${v[1]}</span>`:""}</span><span class="a">${esc(f.a)}</span><span class="pts ${v?"p"+p:""}">${v?"+"+p:"-"}</span></li>`}).join("")}</ol></section>`}
function railTable(){const tb=table();if(!roundList().some(isSettled))return `<section class="section"><div class="section-head"><h2 class="h2">${t.tableH}</h2></div><p class="foot-note">${t.noTable}</p></section>`;
  const top=tb.slice(0,5),me=tb.find(x=>x.uid===S.uid);
  return `<section class="section" aria-labelledby="mth"><div class="section-head"><h2 class="h2" id="mth">${t.tableH}</h2><button class="link" type="button" data-go="table">${t.fullTable}</button></div>
    <ol class="standings mini">${[...top,...(me&&me.rank>5?[me]:[])].map(s=>standRow(s,tb,true)).join("")}</ol></section>`}
const rules=()=>`<section class="section"><div class="section-head"><h2 class="h2">${t.rulesH}</h2></div><ol style="display:grid;gap:10px;padding-top:12px">${t.rules.map(x=>`<li class="sub" style="margin:0;font-size:14px">${x}</li>`).join("")}</ol></section>`;

/* ===================== keypad ===================== */
function openKp(f,i,quiet){const r=current();if(!r||isLocked(r))return;S.kp={f,i};
  const fx=r.fixtures.find(x=>x.id===f);const c=name(i?fx.a:fx.h);const val=S.draft.s[f]?.[i];
  const kp=$("#keypad");kp.hidden=false;
  kp.innerHTML=`<div class="kp-in" role="dialog" aria-label="${esc(t.goalsOf(c))}"><div class="kp-head"><span>${t.kp.for} <b>${esc(c)}</b></span><span class="meta">${esc(name(fx.h))} v ${esc(name(fx.a))}</span></div>
    <div class="kp-keys">${[1,2,3,4,5,6,7,8,9,0].map(n=>`<button type="button" data-key="${n}" aria-pressed="${val===n}">${n}</button>`).join("")}</div>
    <div class="kp-foot"><button type="button" data-key="clear">${t.kp.clear}</button><button type="button" data-key="more" aria-label="${t.kp.more}">10+</button><button type="button" class="done" data-key="done">${t.kp.done}</button></div></div>`;
  document.documentElement.style.setProperty("--kp-h",kp.offsetHeight+"px");
  $$(".cell.on").forEach(b=>b.classList.remove("on"));const cell=document.querySelector(`[data-cell="${f}"][data-i="${i}"]`);cell?.classList.add("on");
  if(!quiet&&cell){const row=cell.closest(".fx").getBoundingClientRect();const limit=innerHeight-kp.offsetHeight-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tab-h"))||0)-12;
    if(row.bottom>limit||row.top<70)scrollBy({top:row.top<70?row.top-90:row.bottom-limit,behavior:RM.matches?"auto":"smooth"})}}
function closeKp(silent){S.kp=null;const kp=$("#keypad");if(kp){kp.hidden=true;kp.innerHTML=""}document.documentElement.style.setProperty("--kp-h","0px");$$(".cell.on").forEach(b=>b.classList.remove("on"));if(!silent)flushSave()}
function nextCell(f,i){const r=current();if(i===0)return{f,i:1};const idx=r.fixtures.findIndex(x=>x.id===f);
  const nx=r.fixtures.slice(idx+1).find(x=>{const v=S.draft.s[x.id];return !v||v[0]==null||v[1]==null});return nx?{f:nx.id,i:S.draft.s[nx.id]?.[0]==null?0:1}:null}

/* ===================== edits + autosave ===================== */
function setScore(fid,i,val){const r=current();if(!r||isLocked(r))return;const cur=S.draft.s[fid]?[...S.draft.s[fid]]:[null,null];
  cur[i]=val;if(cur[0]==null&&cur[1]==null)delete S.draft.s[fid];else S.draft.s[fid]=cur;S.dirty=true;S.ver++;if(S.saveState!=="saving")S.saveState="dirty";
  syncRow(fid,i);syncHead();queueSave()}
function setGG(v){S.draft.gg=Math.max(1,Math.min(90,v));S.dirty=true;S.ver++;if(S.saveState!=="saving")S.saveState="dirty";
  const o=$("#ggout");o.innerHTML=`${S.draft.gg}<sup>′</sup>`;o.classList.remove("unset");$("#bezel")?.classList.remove("unset");
  const rg=$("#ggr");if(rg){rg.value=S.draft.gg;rg.setAttribute("aria-valuetext",`minute ${S.draft.gg}`);rg.style.setProperty("--p",((S.draft.gg-1)/89*100).toFixed(1)+"%")}syncHead();queueSave()}
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
  syncAll();$$(".fx.just-saved").forEach(e=>setTimeout(()=>e.classList.remove("just-saved"),400))}

/* ===================== results / match centre ===================== */
function roundView(){
  const list=roundList();if(!list.length)return `<div class="wrap">${empty(t.noRound,t.noRoundUser)}</div>`;
  const r=list.find(x=>x.id===S.viewRound)||current()||list.at(-1);S.viewRound=r.id;
  const locked=isLocked(r),sc=roundScores(r).filter(x=>x.played),mine=pickOf(S.uid,r.id);
  const now=Date.now();
  const board=f=>{const v=mine?.s?.[f.id];const p=f.res?ptsFor(v,f.res):null;const ko=new Date(f.ko).getTime();
    const status=f.void?`<span class="mc-st">${t.voidF}</span>`:f.res?`<span class="mc-st ft">${t.ft}</span>`:now>=ko&&now<ko+115*6e4?`<span class="mc-st live">${t.live}</span>`:`<span class="mc-st">${esc(fDay(f.ko))}</span>`;
    const picks=locked?Object.keys(S.players).map(u=>pickOf(u,r.id)?.s?.[f.id]).filter(Array.isArray):[];
    const H=picks.filter(x=>x[0]>x[1]).length,D=picks.filter(x=>x[0]===x[1]).length,A=picks.filter(x=>x[0]<x[1]).length,N=picks.length;
    const split=N?`<div class="split" aria-label="${H} picked ${esc(name(f.h))}, ${D} a draw, ${A} ${esc(name(f.a))}"><div class="split-bar">${H?`<i style="flex:${H};background:${KIT[f.h]||"var(--fg-2)"}"></i>`:""}${D?`<i style="flex:${D};background:var(--seam)"></i>`:""}${A?`<i style="flex:${A};background:${KIT[f.a]||"var(--fg-2)"}"></i>`:""}</div>
      <div class="split-lab"><span><b>${H}</b> ${esc(f.h)}</span><span><b>${D}</b> ${t.draw}</span><span><b>${A}</b> ${esc(f.a)}</span></div></div>`:"";
    return `<article class="mc"><div class="mc-board"><div class="mc-team">${crest(f.h,40)}<span>${esc(name(f.h))}</span></div>
      <div class="mc-score">${f.res?`<div class="num">${f.res[0]}<span class="c">:</span>${f.res[1]}</div>`:`<div class="num ko">${fTime(f.ko)}</div>`}${status}</div>
      <div class="mc-team a">${crest(f.a,40)}<span>${esc(name(f.a))}</span></div></div>
      ${v?`<p class="mc-mine">${t.yourPick} <span class="num" style="font-size:17px;color:var(--fg)">${v[0]}-${v[1]}</span>${p!=null?`<span class="pts p${p}">+${p}</span>`:""}</p>`:""}${split}</article>`};
  let body;
  if(!locked)body=empty(t.hiddenH,t.hiddenM(S.counts?.[r.id]??Object.keys(S.status?.[r.id]||{}).length,Object.keys(S.players).length));
  else if(!sc.length)body=empty(t.everyone,t.nobody);
  else body=`<div class="picks-wrap" tabindex="0" role="region" aria-label="Everyone's picks"><table class="picks"><thead><tr><th scope="col">${t.member}</th>${r.fixtures.map(f=>`<th scope="col">${esc(f.h)} ${esc(f.a)}<span class="num">${f.res?f.res.join("-"):"-"}</span></th>`).join("")}<th scope="col">${t.ggShort}</th><th scope="col">${t.total}</th><th scope="col">${t.savedAt}</th></tr></thead><tbody>
    ${sc.map(x=>{const p=pickOf(x.uid,r.id);const at=S.status?.[r.id]?.[x.uid]?.at||p?.at;return `<tr><td><span class="row" style="gap:10px;flex-wrap:nowrap">${av(x.uid)}<span>${esc(dname(x.uid))}${x.uid===S.uid?` <span class="meta">${t.you}</span>`:""}</span></span></td>
      ${r.fixtures.map(f=>{const v=p?.s?.[f.id];const pt=f.res&&v?ptsFor(v,f.res):null;return `<td><span class="pk ${pt==null?"":"p"+pt}">${v?`${v[0]}-${v[1]}`:"-"}</span></td>`}).join("")}
      <td class="num" style="font-size:16px">${x.gg??"-"}</td><td class="num" style="font-size:20px;font-weight:700;color:var(--fg-hi)">${x.pts}</td><td class="meta">${at?`${esc(fWd(at))} ${fTime(at)}`:"-"}</td></tr>`}).join("")}</tbody></table></div>
    <div class="legend"><span><span class="pk p5">2-1</span> ${t.exact5}</span><span><span class="pk p2">2-1</span> ${t.right2}</span>${r.firstGoal!=null?`<span>${t.ggWas(r.firstGoal)}</span>`:""}</div>`;
  return `<div class="wrap"><header style="padding-top:24px"><h1 class="title">${t.resultsH}</h1>
      <div class="rounds" role="group" aria-label="Round">${list.slice().reverse().map(x=>`<button type="button" data-round="${x.id}" aria-pressed="${x.id===r.id}">R${pad(x.n)}</button>`).join("")}</div></header>
    <div class="grid"><section aria-label="${esc(t.round(r.n))}">${r.fixtures.map(board).join("")}</section>
      <section class="section" aria-labelledby="evh" style="padding-top:18px"><div class="section-head"><h2 class="h2" id="evh">${t.everyone}</h2></div>${body}</section></div></div>`;
}

/* ===================== table ===================== */
function standRow(s,tb,mini){const above=tb[s.rank-2];const below=tb[s.rank];
  const mv=s.move==null||s.move===0?"":s.move>0?`<span class="mv up" aria-label="up ${s.move}">🔼${s.move}</span>`:`<span class="mv down" aria-label="down ${-s.move}">🔽${-s.move}</span>`;
  const rival=s.rank===1?(below?t.leads(s.pts-below.pts):""):t.behind(above.pts-s.pts,dname(above.uid));
  return `<li><button class="st ${s.rank===1?"lead":""} ${s.uid===S.uid?"mine":""}" type="button" data-player="${esc(s.uid)}" data-move="${s.move||0}">
    <span class="st-rank num">${pad(s.rank)}</span>
    <span><span class="st-name">${s.rank===1?"👑 ":""}${esc(dname(s.uid))}${mv}</span>${mini?"":`<span class="st-sub">${esc(t.exactWon(s.ex,s.won))}</span>`}<span class="st-rival">${esc(rival)}</span></span>
    <span class="st-pts">${s.pts}${s.last!=null&&!mini?`<small>${t.lastRd(s.last)}</small>`:""}</span></button></li>`}
function tableView(){const tb=table();const n=roundList().filter(isSettled).length;
  const head=`<header style="padding-top:24px"><h1 class="title">${t.tableH}</h1><p class="sub">${n?esc(t.after(n)):""}</p></header>`;
  if(!n)return `<div class="wrap">${head}${empty(t.tableH,t.noTable)}</div>`;
  return `<div class="wrap standings-page">${head}<ol class="standings" id="standings" style="margin-top:18px;border-top:1px solid var(--rule)">${tb.map(s=>standRow(s,tb,false)).join("")}</ol>
    <p class="foot-note" style="padding-bottom:30px">${t.rules[1]} ${t.rules[2]}</p></div>`}

/* ===================== member ===================== */
function playerView(){const ids=Object.keys(S.players);const uid=ids.includes(S.viewPlayer)?S.viewPlayer:S.uid;S.viewPlayer=uid;
  const others=ids.filter(x=>x!==uid),vs=others.includes(S.vsPlayer)?S.vsPlayer:others[0]||null;S.vsPlayer=vs;
  const tb=table(),me=tb.find(x=>x.uid===uid)||{pts:0,ex:0,rs:0,won:0,played:0,hist:[]};
  const set=roundList().filter(isSettled);const per=set.map(r=>{const sc=roundScores(r);return{n:r.n,a:sc.find(x=>x.uid===uid)?.pts||0,b:vs?sc.find(x=>x.uid===vs)?.pts||0:0}});
  const h=per.reduce((o,p)=>(p.a>p.b?o.a++:p.b>p.a?o.b++:o.d++,o),{a:0,b:0,d:0});
  const opts=(l,v)=>l.map(x=>`<option value="${esc(x)}" ${x===v?"selected":""}>${esc(dname(x))}</option>`).join("");
  const joined=S.players[uid]?.joinedAt;
  const pass=`<section class="pass" aria-label="Membership pass"><img class="pass-six" src="six.webp" alt="" width="190" height="187">
      <div class="pass-top"><span>Subar Sitta</span><span class="num" style="font-size:16px;color:var(--fg)">${t.no(memberNo(uid)||1)}</span></div>
      <h1 class="pass-name">${esc(dname(uid))}</h1>
      <div class="pass-row"><span>${t.since}<b>${joined?esc(new Date(joined).toLocaleDateString("en-GB",{...KW,month:"short",year:"numeric"})):"2026"}</b></span><span>${t.position}<b>${me.rank?pad(me.rank):"-"}</b></span><span>${t.points}<b>${me.pts}</b></span></div></section>`;
  const stats=`<div class="ledger2"><div><b>${me.played?(Math.round(me.pts/me.played*10)/10):"-"}</b><span>${t.avg}</span></div><div><b>${me.won}</b><span>${t.wonN}</span></div><div><b>${me.ex}</b><span>${t.exactN}</span></div><div><b>${me.rs}</b><span>${t.rightN}</span></div></div>`;
  const h2h=`<section class="section" aria-labelledby="h2hh"><div class="section-head"><h2 class="h2" id="h2hh">${t.h2h}</h2></div>
    ${!vs?`<p class="foot-note">${t.h2hNeed}</p>`:`<div class="field" style="margin-top:14px;max-width:320px"><label for="selv">${t.vs}</label><select id="selv">${opts(others,vs)}</select></div>
    ${!per.length?`<p class="foot-note">${t.h2hAfter}</p>`:`<div class="vs-sum"><span><b class="num">${h.a}</b>${esc(dname(uid))} ${t.wins}</span><span><b class="num">${h.d}</b>${t.draws}</span><span><b class="num">${h.b}</b>${esc(dname(vs))} ${t.wins}</span></div>
      <div class="vs-strip" role="list">${per.map(p=>`<div role="listitem" class="${p.a>p.b?"w":p.b>p.a?"l":""}"><b>${p.a}-${p.b}</b>R${pad(p.n)}</div>`).join("")}</div>`}`}</section>`;
  return `<div class="wrap" style="padding-bottom:30px"><div class="member-page"><div>${pass}
      <div class="row" style="margin-top:18px;justify-content:space-between"><div class="field" style="min-width:220px;flex:1;max-width:320px"><label for="selp">${t.choose}</label><select id="selp">${opts(ids,uid)}</select></div>
      ${uid===S.uid&&!S.demo?`<button class="btn quiet" type="button" data-act="signout">${t.signOut}</button>`:""}</div></div>
    <div>${stats}${h2h}</div></div></div>`}

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
  const res=r?`<section class="panel"><div class="section-head" style="border:0;padding:0"><h2 class="h2">${t.resultsT(r.n)}</h2><span class="meta">${isLocked(r)?"Locked":"Open"}</span></div>
    <ol class="adm-res">${r.fixtures.map(f=>`<li><span>${esc(name(f.h))}</span><span class="in">${f.void?`<span class="meta">${t.voidF}</span>`:""}<input id="rh-${f.id}" inputmode="numeric" maxlength="2" aria-label="${esc(t.goalsOf(name(f.h)))}" value="${f.res?f.res[0]:""}"><span class="meta">:</span><input id="ra-${f.id}" inputmode="numeric" maxlength="2" aria-label="${esc(t.goalsOf(name(f.a)))}" value="${f.res?f.res[1]:""}"></span><span class="a">${esc(name(f.a))}</span></li>`).join("")}</ol>
    <div class="field" style="max-width:360px;margin-top:14px"><label for="fg">${t.fg}</label><input class="inp" id="fg" inputmode="numeric" maxlength="2" value="${r.firstGoal??""}"></div>
    <div class="row" style="margin-top:14px"><button class="btn" type="button" data-act="results" data-r="${esc(r.id)}">${t.saveResults}</button><button class="btn quiet" type="button" data-act="lock" data-r="${esc(r.id)}">${r.locked?t.reopen:t.lockNow}</button></div>
    <p class="meta" style="margin-top:10px">${t.resNote}</p></section>`:"";
  const nr=`<section class="panel"><h2 class="h2">${t.newT(next)}</h2>
    ${Array.from({length:6},(_,i)=>`<div class="form-grid" style="padding:12px 0;border-bottom:1px solid var(--rule)">
      <div class="field"><label for="nh${i}">${t.homeN(i+1)}</label><select id="nh${i}"><option value="">Choose</option>${clubOpts}</select></div>
      <div class="field"><label for="na${i}">${t.awayL}</label><select id="na${i}"><option value="">Choose</option>${clubOpts}</select></div>
      <div class="field full"><label for="nk${i}">${t.ko}</label><input class="inp" id="nk${i}" type="datetime-local"></div></div>`).join("")}
    <div class="field" style="margin-top:12px"><label for="ndl">${t.deadline}</label><input class="inp" id="ndl" type="datetime-local"></div>
    <div style="margin-top:14px"><button class="btn" type="button" data-act="newround" data-n="${next}">${t.openN(next)}</button></div></section>`;
  return `<div class="wrap"><header style="padding:24px 0 18px"><h1 class="title">${t.adminH}</h1><p class="sub">${t.adminSub(Object.keys(S.players).length)}</p>
    ${list.length?`<div class="field" style="max-width:280px;margin-top:16px"><label for="setcur">${t.current}</label><select id="setcur">${list.map(x=>`<option value="${esc(x.id)}" ${x.id===r?.id?"selected":""}>${t.round(x.n)}</option>`).join("")}</select></div>`:""}</header>
    <div class="grid adm"><div class="adm">${auto}${res}${invite}</div><div class="adm">${nr}</div></div></div>`}

/* ===================== countdown + post-render ===================== */
function tick(){const el=$("[data-deadline]");if(!el)return;const ms=new Date(el.dataset.deadline)-Date.now();
  if(ms<=0){sb?reload():render();return}
  const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
  el.classList.toggle("warn",ms<3*36e5);
  el.querySelector("[data-dur]").innerHTML=(d?`<b>${pad(d)}</b><i>d</i>`:"")+`<b>${pad(h)}</b><i>h</i><b>${pad(m)}</b><i>m</i><b class="s">${pad(s)}</b><i>s</i>`;
  el.setAttribute("aria-label",`${t.locksIn} ${d?d+" days ":""}${h} hours ${m} minutes`)}
setInterval(()=>{if($("[data-deadline]"))tick()},1000);
let bannerI=0;setInterval(()=>{const b=$("#bannerTxt");if(!b||RM.matches)return;bannerI=(bannerI+1)%t.banner.length;b.classList.remove("in");void b.offsetWidth;b.textContent=t.banner[bannerI];b.classList.add("in")},4500);
function postRender(){
  if(S.page==="home"&&S.draft)syncHead();
  /* rank movement: rows that changed position slide in from where they were, once per visit */
  if(S.page==="table"&&!RM.matches&&!S.movedShown){S.movedShown=true;$$("#standings .st").forEach(b=>{const mv=+b.dataset.move;if(mv){b.style.setProperty("--from",`${mv*100}%`);b.classList.add("moving")}})}
}
const kwIso=v=>v?new Date(v+":00+03:00").toISOString():null;

/* ===================== interactions ===================== */
document.addEventListener("click",async e=>{
  const go=e.target.closest("[data-go]");if(go){const pg=go.dataset.go;if(pg!=="home")flushSave();S.page=pg;if(go.hasAttribute("data-self"))S.viewPlayer=S.uid;if(go.dataset.round)S.viewRound=go.dataset.round;
    if(pg==="admin"&&sb&&S.isAdmin&&S.invite==null)sb.rpc("invite_code").then(({data})=>{S.invite=data;if(S.page==="admin")render()});
    try{history.replaceState(null,"","#"+S.page)}catch(_){}render();scrollTo({top:0});$("#main").focus({preventScroll:true});return}
  const pl=e.target.closest("[data-player]");if(pl){S.viewPlayer=pl.dataset.player;S.page="player";render();scrollTo({top:0});return}
  const tb=e.target.closest("[data-tab]");if(tb){S.authTab=tb.dataset.tab;render();return}
  const rb=e.target.closest("[data-round]");if(rb){S.viewRound=rb.dataset.round;render();return}
  const cell=e.target.closest("[data-cell]");if(cell&&!cell.disabled){openKp(cell.dataset.cell,+cell.dataset.i);return}
  const key=e.target.closest("[data-key]");if(key&&S.kp){const {f,i}=S.kp,k=key.dataset.key,cur=S.draft.s[f]?.[i];
    if(k==="done"){closeKp();return}
    if(k==="clear"){setScore(f,i,null);openKp(f,i,true);return}
    if(k==="more"){setScore(f,i,Math.min(20,Math.max(10,(cur??9)+1)));openKp(f,i,true);return}
    setScore(f,i,+k);const nx=nextCell(f,i);if(nx)openKp(nx.f,nx.i);else closeKp();return}
  const gg=e.target.closest("[data-gg]");if(gg){setGG(S.draft.gg==null?45:S.draft.gg+ +gg.dataset.gg);return}
  if(S.kp&&!e.target.closest("#keypad")&&!e.target.closest("[data-cell]"))closeKp();
  const act=e.target.closest("[data-act]");if(!act)return;const a=act.dataset.act;
  const authErr=m=>{const el=$("#autherr");if(el)el.textContent=m};
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
  if(a==="runauto"){if(S.demo)return toast("Sample mode");act.disabled=true;const r=await q(sb.rpc("run_autopilot"));act.disabled=false;if(r)toast(String(r));reload();return}
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
/* keyboard: digits type straight into a focused score cell (two digits within 0.8s make 10 to 20) */
let lastKey={k:null,at:0};
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&S.kp){closeKp();return}
  const c=e.target.closest?.("[data-cell]");if(!c||c.disabled)return;const f=c.dataset.cell,i=+c.dataset.i,cur=S.draft.s[f]?.[i];
  if(/^[0-9]$/.test(e.key)){e.preventDefault();const now=Date.now();let v=+e.key;
    if(lastKey.k===f+i&&now-lastKey.at<800&&cur!=null&&cur<10&&cur*10+v<=20)v=cur*10+v;lastKey={k:f+i,at:now};setScore(f,i,v);if(S.kp)openKp(f,i,true)}
  else if(e.key==="ArrowUp"||e.key==="ArrowDown"){e.preventDefault();setScore(f,i,Math.max(0,Math.min(20,cur==null?0:cur+(e.key==="ArrowUp"?1:-1))))}
  else if(e.key==="Backspace"||e.key==="Delete"){e.preventDefault();setScore(f,i,null)}
  else if(e.key==="Enter"){e.preventDefault();const nx=nextCell(f,i);if(nx)document.querySelector(`[data-cell="${nx.f}"][data-i="${nx.i}"]`)?.focus()}});
document.addEventListener("input",e=>{if(e.target.id==="ggr")setGG(+e.target.value)});
document.addEventListener("change",async e=>{const el=e.target;
  if(el.id==="selp"){S.viewPlayer=el.value;render()}
  if(el.id==="selv"){S.vsPlayer=el.value;render()}
  if(el.id==="setcur"){if(await write("meta/league",{season:S.meta?.season||"2026/27",currentRound:el.value}))toast(t.curChanged)}});
addEventListener("beforeunload",e=>{if(S.dirty){flushSave();e.preventDefault()}});
addEventListener("visibilitychange",()=>{if(document.hidden)flushSave()});
addEventListener("resize",()=>$$(".adm-ico").forEach(b=>b.style.display=innerWidth>=1024?"none":""));

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
