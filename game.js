"use strict";

const NUM_ROOMS = 10;
const NUM_HIDERS = 6;

/* ---------- Internationalization ---------- */

let currentLang = "en";

const STRINGS = {
  en: {
    docTitle: "The Sorcerer's Hunt",
    appTitle: "The Sorcerer's Hunt",
    appSubtitle: "You are the Sorcerer — hunt down all 6 naughty gnomes hiding across Cherry Valley before your HP runs out.",
    helpBtn: "How to Play",
    statHP: "Sorcerer HP",
    statFound: "Gnomes Found",
    statRound: "Round",
    statPhase: "Phase",
    statSelected: "Selected",
    eventLogHeading: "Event Log",
    revealBtnLabel: "Gaze Into the Crystal Ball →",
    fullRevealHeading: "Full Reveal",
    gameTimelineHeading: "Game Timeline",
    prevBtnLabel: "← Prev",
    nextBtnLabel: "Next →",
    newGameBtnLabel: "New Game",
    introTitle: "The Sorcerer's Hunt",
    introIntroText: "Six naughty gnomes have scattered across the 10 huts of Cherry Valley. You are the Sorcerer — the only one who can search these huts, but every wrong move costs you HP. Find all 6 gnomes before your HP reaches zero.",
    introPhasesHeading: "Each round, you get two phases",
    introDivineLi: "<strong>Divine</strong> — select a group of huts (up to that round's allowance) and gaze into your crystal ball to reveal one combined total: how many gnomes (plus the Trap, if present) are hiding somewhere in that group. You won't know which specific hut they're in.",
    introSearchLi: "<strong>Search</strong> — choose exactly one hut to physically search. Any gnomes there are caught immediately. If the hut turns out empty, you lose 1 HP.",
    introAllowanceHeading: "Divination allowance by round",
    introAllowanceLi: "Round 1: up to 3 huts &nbsp;•&nbsp; Round 2: up to 3 &nbsp;•&nbsp; Round 3: up to 2 &nbsp;•&nbsp; Round 4: up to 3 &nbsp;•&nbsp; Round 5: up to 2 &nbsp;•&nbsp; Round 6 onward: none — searching only.",
    introWatchHeading: "Watch out for",
    introCloakLi: "<strong>Invisible Cloak</strong> — one gnome can turn invisible once, removing themself from the crystal ball's reading for that one round only. Every round after, they're detectable by investigation again like anyone else. Search their hut directly, though, and they're always caught regardless.",
    introTransferLi: "<strong>Transfer Power</strong> — one gnome can relocate to any other hut once, even a hut you've already searched.",
    introTrapLi: "<strong>The Trap</strong> — planted by the gnomes (no one carries it), and they relocate it after every search to bait you into the wrong hut. Search its hut and you lose an extra 2 HP on top of the usual search cost.",
    introWinHeading: "Winning &amp; losing",
    introWinText: "Catch all 6 gnomes before your 6 HP runs out to win. If your HP hits 0 first, the gnomes win — and you'll get a full reveal of where everyone was hiding in Cherry Valley.",
    beginBtnLabel: "Begin the Hunt",

    hutLabel: roomId => `Hut ${roomId + 1}`,
    phaseInvestigate: "Divination",
    phaseSearching: "Searching",
    phaseGameOver: "Game Over",
    selectedFraction: (selected, allowed) => `${selected} / ${allowed}`,
    selectedFractionDash: allowed => `— / ${allowed}`,
    caughtFraction: caught => `${caught} / 6`,

    instructionsInvestigate: allowed => `Select up to ${allowed} hut${allowed === 1 ? "" : "s"} to investigate together, then peer into your crystal ball for their combined total.`,
    instructionsSearchNone: "No divinations remain this round — select a hut, then confirm to search it with your remaining HP.",
    instructionsSearch: "Select a hut to search, then confirm.",
    confirmSearchBtnLabel: "Confirm Search →",
    continueBtnLabel: "Continue",
    roundRecapHeading: round => `Round ${round} Recap`,
    viewFullLogBtnLabel: "📜 View Full Event Log",
    closeBtnLabel: "Close",

    resultWinTitle: "You Win!",
    resultWinText: hp => `You found all 6 Gnomes with ${hp} HP to spare.`,
    resultLoseTitle: "The Gnomes Win!",
    resultLoseText: caught => `Your HP ran out after finding only ${caught} of 6 Gnomes.`,

    logNewGame: () => "A new game begins. 6 naughty gnomes have scattered across the huts of Cherry Valley...",
    logRoundBegins: round => `— Round ${round} begins —`,
    logInvestigationMain: (round, roomIds, sum) => `Round ${round}: Peered into the crystal ball over ${roomIds.map(id => t("hutLabel", id)).join(", ")} — combined total: ${sum} magical presence${sum === 1 ? "" : "s"} detected.`,
    logInvestigationEmpty: roomIds => `${roomIds.map(id => t("hutLabel", id)).join(", ")}: confirmed completely empty.`,
    logSearchHidersTrap: (roomId, count) => `Searched ${t("hutLabel", roomId)} — caught ${count} Gnome${count === 1 ? "" : "s"}! But a Trap was also hidden there — -2 HP.`,
    logSearchHidersNoTrap: (roomId, count) => `Searched ${t("hutLabel", roomId)} — caught ${count} Gnome${count === 1 ? "" : "s"}! No HP lost.`,
    logSearchCloakCaught: () => "Among them was the Gnome who held the Invisible Cloak!",
    logSearchTransferCaught: () => "Among them was the Gnome who held the Transfer Power!",
    logSearchTrap: roomId => `Searched ${t("hutLabel", roomId)} — empty, but the Trap was hidden there! -1 HP (empty hut) and -2 HP (trap) = -3 HP total.`,
    logSearchEmpty: roomId => `Searched ${t("hutLabel", roomId)} — empty. -1 HP.`,

    revealInitialHeading: "Initial hiding arrangement",
    revealHutCount: (roomId, count) => `${t("hutLabel", roomId)}: ${count} Gnome${count === 1 ? "" : "s"}`,
    revealTrapStart: roomId => `Trap started in ${t("hutLabel", roomId)}.`,
    revealItemHeading: "Item holders",
    cloakActivatedStatus: round => `activated for Round ${round}'s divination only, detectable again afterward`,
    cloakNeverActivatedCaughtStatus: "never activated — caught before using it",
    cloakNeverActivatedStatus: "never activated",
    cloakLine: (letter, startRoom, status) => `Gnome ${letter} (started in ${t("hutLabel", startRoom)}) held the Invisible Cloak — ${status}.`,
    transferMovedStatus: (from, to, round) => `moved from ${t("hutLabel", from)} to ${t("hutLabel", to)} at the start of Round ${round}`,
    transferNeverUsedCaughtStatus: startRoom => `never used — caught in ${t("hutLabel", startRoom)} before moving`,
    transferNeverUsedStatus: startRoom => `never used — remained in ${t("hutLabel", startRoom)} the whole game`,
    transferLine: (letter, startRoom, status) => `Gnome ${letter} (started in ${t("hutLabel", startRoom)}) held the Transfer Power — ${status}.`,
    neverCaughtHeading: "Gnomes never caught",
    movedDesc: (startRoom, currentRoom, round) => `started in ${t("hutLabel", startRoom)}, moved to ${t("hutLabel", currentRoom)} at the start of Round ${round}`,
    stayedDesc: startRoom => `stayed in ${t("hutLabel", startRoom)} the whole game`,
    itemNoteCloakActivated: round => ` Held the Invisible Cloak, activated for Round ${round}'s divination only — detectable again every round after.`,
    itemNoteCloakNever: " Held the Invisible Cloak, never activated.",
    itemNoteTransferUsed: " Held the Transfer Power, used as described above.",
    itemNoteTransferNever: " Held the Transfer Power, never used.",
    neverCaughtLine: (letter, movement, currentRoom, itemNote) => `Gnome ${letter}: ${movement} — final location: ${t("hutLabel", currentRoom)}.${itemNote}`,

    trapMovedDetail: (from, to) => `Trap moved from ${t("hutLabel", from)} to ${t("hutLabel", to)}.`,
    transferUsedMoveDetail: (letter, from, to) => `Gnome ${letter} used the Transfer Power: ${t("hutLabel", from)} → ${t("hutLabel", to)}.`,
    cloakActivatedMoveDetail: letter => `Gnome ${letter} activated the Invisible Cloak.`,
    noRoundsPlayed: "No rounds were played",
    roundLabel: (round, total) => `Round ${round} / ${total}`,
    beforeRoundHeading: "Before this round",
    noMovements: "No movements.",
    divinationHeading: "Divination",
    divinationResultDetail: (roomIds, sum) => `Peered into the crystal ball over ${roomIds.map(id => t("hutLabel", id)).join(", ")} — combined total: ${sum} magical presence${sum === 1 ? "" : "s"} detected.`,
    noDivinationThisRound: "No divination this round — search only.",
    searchHeading: "Search",
    searchCaughtDetail: (roomId, labels, count) => `Searched ${t("hutLabel", roomId)} — caught Gnome${count === 1 ? "" : "s"} ${labels}!`,
    itemHolderCloak: "Invisible Cloak holder",
    itemHolderTransfer: "Transfer Power holder",
    trapAlsoHiddenSuffix: " A Trap was also hidden there — -2 HP.",
    noHpLostSuffix: " No HP lost.",
    searchTrapDetail: roomId => `Searched ${t("hutLabel", roomId)} — empty, but the Trap was hidden there! -1 HP (empty) and -2 HP (trap) = -3 HP total.`,
    searchEmptyDetail: roomId => `Searched ${t("hutLabel", roomId)} — empty. -1 HP.`,
    trapTooltip: "Trap",
    gnomeTooltip: letter => `Gnome ${letter}`,
  },
  zh: {
    docTitle: "巫師的狩獵",
    appTitle: "巫師的狩獵",
    appSubtitle: "你是巫師——必須在生命值耗盡之前，找出躲藏在櫻桃谷各處的全部6隻搗蛋地精。",
    helpBtn: "遊戲玩法",
    statHP: "巫師生命值",
    statFound: "已抓地精",
    statRound: "回合",
    statPhase: "階段",
    statSelected: "已選",
    eventLogHeading: "事件紀錄",
    revealBtnLabel: "凝視水晶球 →",
    fullRevealHeading: "完整真相",
    gameTimelineHeading: "遊戲時間軸",
    prevBtnLabel: "← 上一回合",
    nextBtnLabel: "下一回合 →",
    newGameBtnLabel: "開始新遊戲",
    introTitle: "巫師的狩獵",
    introIntroText: "六隻搗蛋地精已經躲進櫻桃谷的10間小屋中。你是唯一能夠搜查這些小屋的巫師，但每次行動錯誤都會耗損你的生命值。請在生命值歸零之前找出全部6隻地精。",
    introPhasesHeading: "每個回合都有兩個階段",
    introDivineLi: "<strong>占卜</strong> — 選擇一組小屋（數量不超過該回合的上限），凝視水晶球以得知這組小屋的合計結果：裡面共藏有多少隻地精（若有陷阱也會一併計入）。但你不會知道牠們確切藏在哪一間小屋。",
    introSearchLi: "<strong>搜查</strong> — 選擇剛好一間小屋親自搜查。裡面若有地精會立刻被抓住；若小屋是空的，你會損失1點生命值。",
    introAllowanceHeading: "各回合的占卜上限",
    introAllowanceLi: "第1回合：最多3間 &nbsp;•&nbsp; 第2回合：最多3間 &nbsp;•&nbsp; 第3回合：最多2間 &nbsp;•&nbsp; 第4回合：最多3間 &nbsp;•&nbsp; 第5回合：最多2間 &nbsp;•&nbsp; 第6回合起：沒有占卜機會，只能搜查。",
    introWatchHeading: "請特別留意",
    introCloakLi: "<strong>隱身斗篷</strong> — 其中一隻地精可以隱身一次，使自己在那一個回合的水晶球占卜結果中消失。之後的每個回合，牠都會和其他地精一樣能被占卜偵測到。不過只要直接搜查牠所在的小屋，無論如何都會被抓住。",
    introTransferLi: "<strong>傳送能力</strong> — 其中一隻地精可以使用一次能力，傳送到任何一間小屋，即使是你已經搜查過的小屋也可以。",
    introTrapLi: "<strong>陷阱</strong> — 由地精們共同設下（不屬於任何一隻地精），牠們會在每次搜查後重新移動陷阱，引誘你搜查錯誤的小屋。搜查到陷阱所在的小屋，除了一般搜查代價外，還會額外損失2點生命值。",
    introWinHeading: "獲勝與落敗",
    introWinText: "在6點生命值耗盡之前抓住全部6隻地精即可獲勝。若生命值先歸零，則地精獲勝——屆時你將看到櫻桃谷中所有地精藏身處的完整真相。",
    beginBtnLabel: "開始狩獵",

    hutLabel: roomId => `小屋 ${roomId + 1}`,
    phaseInvestigate: "占卜",
    phaseSearching: "搜查中",
    phaseGameOver: "遊戲結束",
    selectedFraction: (selected, allowed) => `${selected} / ${allowed}`,
    selectedFractionDash: allowed => `— / ${allowed}`,
    caughtFraction: caught => `${caught} / 6`,

    instructionsInvestigate: allowed => `選擇最多${allowed}間小屋一起占卜，接著凝視水晶球得知牠們的合計結果。`,
    instructionsSearchNone: "本回合沒有占卜機會了——請選擇一間小屋，然後確認以使用剩餘生命值進行搜查。",
    instructionsSearch: "請選擇一間小屋進行搜查，然後確認。",
    confirmSearchBtnLabel: "確認搜查 →",
    continueBtnLabel: "繼續",
    roundRecapHeading: round => `第${round}回合總結`,
    viewFullLogBtnLabel: "📜 查看完整紀錄",
    closeBtnLabel: "關閉",

    resultWinTitle: "你獲勝了！",
    resultWinText: hp => `你抓到了全部6隻地精，還剩下${hp}點生命值。`,
    resultLoseTitle: "地精獲勝！",
    resultLoseText: caught => `你的生命值耗盡了，只抓到了6隻地精中的${caught}隻。`,

    logNewGame: () => "新的遊戲開始了。6隻搗蛋地精已經散佈在櫻桃谷的各間小屋中……",
    logRoundBegins: round => `— 第${round}回合開始 —`,
    logInvestigationMain: (round, roomIds, sum) => `第${round}回合：凝視水晶球查看${roomIds.map(id => t("hutLabel", id)).join("、")}——合計偵測到${sum}股魔法氣息。`,
    logInvestigationEmpty: roomIds => `${roomIds.map(id => t("hutLabel", id)).join("、")}：確認完全空無一物。`,
    logSearchHidersTrap: (roomId, count) => `搜查了${t("hutLabel", roomId)}——抓到${count}隻地精！但該處還藏有陷阱——損失2點生命值。`,
    logSearchHidersNoTrap: (roomId, count) => `搜查了${t("hutLabel", roomId)}——抓到${count}隻地精！沒有損失生命值。`,
    logSearchCloakCaught: () => "其中包含持有隱身斗篷的地精！",
    logSearchTransferCaught: () => "其中包含持有傳送能力的地精！",
    logSearchTrap: roomId => `搜查了${t("hutLabel", roomId)}——空無一物，但陷阱就藏在那裡！損失1點生命值（空屋）加上2點生命值（陷阱）＝共損失3點生命值。`,
    logSearchEmpty: roomId => `搜查了${t("hutLabel", roomId)}——空無一物。損失1點生命值。`,

    revealInitialHeading: "初始藏身分佈",
    revealHutCount: (roomId, count) => `${t("hutLabel", roomId)}：${count}隻地精`,
    revealTrapStart: roomId => `陷阱一開始藏在${t("hutLabel", roomId)}。`,
    revealItemHeading: "能力持有者",
    cloakActivatedStatus: round => `僅在第${round}回合的占卜中啟動隱身，之後都能被偵測到`,
    cloakNeverActivatedCaughtStatus: "從未啟動——在使用之前就被抓住了",
    cloakNeverActivatedStatus: "從未啟動",
    cloakLine: (letter, startRoom, status) => `地精${letter}（一開始藏在${t("hutLabel", startRoom)}）持有隱身斗篷——${status}。`,
    transferMovedStatus: (from, to, round) => `在第${round}回合開始時，從${t("hutLabel", from)}傳送到了${t("hutLabel", to)}`,
    transferNeverUsedCaughtStatus: startRoom => `從未使用——在傳送之前就在${t("hutLabel", startRoom)}被抓住了`,
    transferNeverUsedStatus: startRoom => `從未使用——整場遊戲都留在${t("hutLabel", startRoom)}`,
    transferLine: (letter, startRoom, status) => `地精${letter}（一開始藏在${t("hutLabel", startRoom)}）持有傳送能力——${status}。`,
    neverCaughtHeading: "未被抓到的地精",
    movedDesc: (startRoom, currentRoom, round) => `一開始藏在${t("hutLabel", startRoom)}，在第${round}回合開始時傳送到了${t("hutLabel", currentRoom)}`,
    stayedDesc: startRoom => `整場遊戲都留在${t("hutLabel", startRoom)}`,
    itemNoteCloakActivated: round => `　持有隱身斗篷，僅在第${round}回合的占卜中啟動隱身——之後每回合都能被偵測到。`,
    itemNoteCloakNever: "　持有隱身斗篷，但從未啟動。",
    itemNoteTransferUsed: "　持有傳送能力，使用情形如上所述。",
    itemNoteTransferNever: "　持有傳送能力，但從未使用。",
    neverCaughtLine: (letter, movement, currentRoom, itemNote) => `地精${letter}：${movement}——最終位置：${t("hutLabel", currentRoom)}。${itemNote}`,

    trapMovedDetail: (from, to) => `陷阱從${t("hutLabel", from)}移動到了${t("hutLabel", to)}。`,
    transferUsedMoveDetail: (letter, from, to) => `地精${letter}使用了傳送能力：${t("hutLabel", from)} → ${t("hutLabel", to)}。`,
    cloakActivatedMoveDetail: letter => `地精${letter}啟動了隱身斗篷。`,
    noRoundsPlayed: "尚未進行任何回合",
    roundLabel: (round, total) => `第${round}回合 / 共${total}回合`,
    beforeRoundHeading: "本回合開始前",
    noMovements: "沒有任何變動。",
    divinationHeading: "占卜",
    divinationResultDetail: (roomIds, sum) => `凝視水晶球查看${roomIds.map(id => t("hutLabel", id)).join("、")}——合計偵測到${sum}股魔法氣息。`,
    noDivinationThisRound: "本回合沒有占卜——只能搜查。",
    searchHeading: "搜查",
    searchCaughtDetail: (roomId, labels, count) => `搜查了${t("hutLabel", roomId)}——抓到地精${labels}！`,
    itemHolderCloak: "隱身斗篷持有者",
    itemHolderTransfer: "傳送能力持有者",
    trapAlsoHiddenSuffix: "　該處還藏有陷阱——損失2點生命值。",
    noHpLostSuffix: "　沒有損失生命值。",
    searchTrapDetail: roomId => `搜查了${t("hutLabel", roomId)}——空無一物，但陷阱就藏在那裡！損失1點生命值（空屋）加上2點生命值（陷阱）＝共損失3點生命值。`,
    searchEmptyDetail: roomId => `搜查了${t("hutLabel", roomId)}——空無一物。損失1點生命值。`,
    trapTooltip: "陷阱",
    gnomeTooltip: letter => `地精${letter}`,
  },
};

function t(key, ...args) {
  const dict = STRINGS[currentLang] || STRINGS.en;
  const entry = dict[key] !== undefined ? dict[key] : STRINGS.en[key];
  return typeof entry === "function" ? entry(...args) : entry;
}

function applyStaticTranslations() {
  document.title = t("docTitle");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerHTML = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
  });
}

function setLang(lang) {
  if (lang !== "en" && lang !== "zh") return;
  currentLang = lang;
  try { localStorage.setItem("sorcerersHuntLang", lang); } catch (e) { /* ignore unavailable storage */ }
  applyStaticTranslations();
  if (gameState) render();
}

function investigationsAllowed(round) {
  if (round === 1 || round === 2 || round === 4) return 3;
  if (round === 3 || round === 5) return 2;
  return 0;
}

/* ---------- Pure engine (shared by real game + internal simulation) ---------- */

function createEngineState(setup) {
  const rooms = [];
  for (let i = 0; i < NUM_ROOMS; i++) {
    rooms.push({ id: i, searched: false, timesSearched: 0, searchOutcome: null });
  }
  const hiders = [];
  for (let i = 0; i < NUM_HIDERS; i++) {
    hiders.push({
      id: i,
      roomId: setup.hiderRooms[i],
      item: setup.items.invisible === i ? "invisible" : (setup.items.transfer === i ? "transfer" : null),
      itemUsed: false,
      invisibleActive: false,
      caught: false,
    });
  }
  return {
    round: 1,
    phase: investigationsAllowed(1) > 0 ? "investigate" : "catch",
    catcherHP: 6,
    hidersCaught: 0,
    rooms,
    hiders,
    trap: { roomId: setup.trapRoomId, active: true },
    selected: new Set(),
    batches: [],
    gameOver: false,
    result: null,
    setupReveal: {
      hiderInitialRooms: setup.hiderRooms.slice(),
      trapInitialRoomId: setup.trapRoomId,
    },
    invisibleActivationRound: null,
    transferMoveLog: null,
    trapMoveLog: [],
    searchLog: [],
  };
}

function liveHidersInRoom(state, roomId) {
  return state.hiders.filter(h => !h.caught && h.roomId === roomId);
}

function computeBatchSum(state, roomIds) {
  let sum = 0;
  for (const rid of roomIds) {
    sum += state.hiders.filter(h => !h.caught && h.roomId === rid && !h.invisibleActive).length;
    if (state.trap.active && state.trap.roomId === rid) sum += 1;
  }
  return sum;
}

function applyInvestigation(state, roomIds, logFn) {
  const sum = computeBatchSum(state, roomIds);
  state.batches.push({ round: state.round, roomIds: [...roomIds], sum });
  if (logFn) logFn(state, roomIds, sum);
  state.phase = "catch";
  state.selected = new Set();
  return sum;
}

function applySearch(state, roomId, logFn) {
  const room = state.rooms[roomId];
  const hidersHere = liveHidersInRoom(state, roomId);
  const trapHit = state.trap.active && state.trap.roomId === roomId;
  let outcome;
  if (hidersHere.length > 0) {
    hidersHere.forEach(h => { h.caught = true; });
    state.hidersCaught += hidersHere.length;
    const specialCaught = hidersHere.filter(h => h.item).map(h => h.item);
    let hpLoss = 0;
    if (trapHit) {
      hpLoss += 2;
      state.trap.active = false;
      state.catcherHP -= hpLoss;
    }
    outcome = { type: "hiders", count: hidersHere.length, specialCaught, trapHit, hpLoss };
  } else {
    let hpLoss = 1;
    if (trapHit) {
      hpLoss += 2;
      state.trap.active = false;
    }
    state.catcherHP -= hpLoss;
    outcome = trapHit ? { type: "trap", hpLoss } : { type: "empty", hpLoss };
  }
  room.searched = true;
  room.timesSearched += 1;
  room.searchOutcome = outcome;
  state.searchLog.push({ round: state.round, roomId, outcome });
  if (logFn) logFn(state, roomId, outcome);

  if (state.hidersCaught >= NUM_HIDERS) {
    state.gameOver = true;
    state.result = "win";
    state.phase = "gameover";
    return outcome;
  }
  if (state.catcherHP <= 0) {
    state.gameOver = true;
    state.result = "lose";
    state.phase = "gameover";
    return outcome;
  }
  state.round += 1;
  hiderAIReaction(state);
  state.phase = investigationsAllowed(state.round) > 0 ? "investigate" : "catch";
  return outcome;
}

function relocateTrapDoll(state, rng) {
  if (!state.trap.active) return;
  // The Trap can share a room with Hiders and gets to relocate after every
  // search, and the Hiders pick its next room with real thinking: the goal is
  // to mislead the Catcher's deduction during investigation (the trap's +1
  // makes an innocent room look like it holds a Hider) and to bait a search
  // that costs HP. That means the target room must be one a rational Catcher
  // is still actually likely to investigate or search again.
  const unsearched = state.rooms.filter(r => !r.searched).map(r => r.id);
  if (unsearched.length === 0) return;

  // Rooms where every batch that ever included them summed to 0 are "ruled
  // out" — a rational Catcher has already deduced they're empty and has no
  // reason to investigate or search them again, so planting the trap there
  // wastes it. Avoid those unless there's truly nowhere else left to go.
  const ruledOut = new Set();
  unsearched.forEach(id => {
    const batchesWithRoom = state.batches.filter(b => b.roomIds.includes(id));
    if (batchesWithRoom.length > 0 && batchesWithRoom.every(b => b.sum === 0)) {
      ruledOut.add(id);
    }
  });
  let candidates = unsearched.filter(id => !ruledOut.has(id));
  if (candidates.length === 0) candidates = unsearched.slice();

  // Heat estimates how strongly the investigation history points at each
  // room, weighting the most recent round's batches more heavily since
  // that's the freshest clue in the Catcher's mind and the one most likely
  // to drive their very next move.
  const latestRound = state.batches.length > 0 ? Math.max(...state.batches.map(b => b.round)) : 0;
  const heat = {};
  candidates.forEach(id => { heat[id] = 0; });
  state.batches.forEach(b => {
    const recencyWeight = b.round === latestRound ? 1.5 : 1;
    b.roomIds.forEach(id => {
      if (id in heat) heat[id] += (b.sum / b.roomIds.length) * recencyWeight;
    });
  });

  let best = [];
  let bestHeat = -Infinity;
  candidates.forEach(id => {
    if (heat[id] > bestHeat) { bestHeat = heat[id]; best = [id]; }
    else if (heat[id] === bestHeat) { best.push(id); }
  });

  // Among equally "hot" rooms, prefer one that has no Hiders in it right now:
  // baiting a search there is pure deception — a wasted, painful search that
  // catches nobody — rather than a room that would cost the Catcher nothing
  // extra to clear since the real Hiders would be caught there anyway.
  if (best.length > 1) {
    const hiderFree = best.filter(id => liveHidersInRoom(state, id).length === 0);
    if (hiderFree.length > 0) best = hiderFree;
  }

  const chosen = best[Math.floor(rng() * best.length)];
  if (chosen !== state.trap.roomId) {
    const from = state.trap.roomId;
    state.trap.roomId = chosen;
    state.trapMoveLog.push({ round: state.round, from, to: chosen });
  }
}

function hiderAIReaction(state, rng) {
  rng = rng || Math.random;

  // The Invisible Cloak is single-use and only shields its wearer from the
  // crystal ball during the one round it's activated in. Once that round
  // ends, the effect ends too — the power is spent, and the gnome is fully
  // detectable by investigation again in every later round.
  state.hiders.forEach(h => {
    if (h.item === "invisible" && h.invisibleActive && state.invisibleActivationRound !== state.round) {
      h.invisibleActive = false;
    }
  });

  const invis = state.hiders.find(h => h.item === "invisible" && !h.itemUsed && !h.caught);
  if (invis) {
    invis.itemUsed = true;
    invis.invisibleActive = true;
    state.invisibleActivationRound = state.round;
  }

  relocateTrapDoll(state, rng);

  const trans = state.hiders.find(h => h.item === "transfer" && !h.itemUsed && !h.caught);
  if (trans) {
    const everInvestigated = state.batches.some(b => b.roomIds.includes(trans.roomId));
    if (everInvestigated) {
      // Best strategy: hide in a room the Catcher has already searched/investigated
      // and has no reason to recheck. Already-searched rooms rank highest, then
      // rooms that were part of a zero-sum investigation batch, then any other
      // never-investigated room, then (fallback) the least-investigated room.
      const allOtherRooms = state.rooms.filter(r => r.id !== state.trap.roomId && r.id !== trans.roomId).map(r => r.id);

      const searchedRooms = state.rooms.filter(r => r.id !== state.trap.roomId && r.searched).map(r => r.id);

      const zeroSumRooms = new Set();
      state.batches.forEach(b => {
        if (b.sum === 0) b.roomIds.forEach(id => zeroSumRooms.add(id));
      });
      const confirmedEmptyRooms = allOtherRooms.filter(id => zeroSumRooms.has(id) && !state.rooms[id].searched);

      const investigatedSet = new Set();
      state.batches.forEach(b => b.roomIds.forEach(id => investigatedSet.add(id)));
      const pristineRooms = allOtherRooms.filter(id => !investigatedSet.has(id) && !state.rooms[id].searched);

      let candidates = searchedRooms.length > 0 ? searchedRooms
        : (confirmedEmptyRooms.length > 0 ? confirmedEmptyRooms
        : (pristineRooms.length > 0 ? pristineRooms : []));

      if (candidates.length === 0) {
        const countMap = {};
        allOtherRooms.forEach(id => { countMap[id] = 0; });
        state.batches.forEach(b => b.roomIds.forEach(id => { if (id in countMap) countMap[id] += 1; }));
        candidates = allOtherRooms.slice();
        candidates.sort((a, b) => countMap[a] - countMap[b]);
        candidates = candidates.slice(0, 1);
      }

      if (candidates.length > 0) {
        const oldRoomId = trans.roomId;
        trans.roomId = candidates[Math.floor(rng() * candidates.length)];
        trans.itemUsed = true;
        state.transferMoveLog = { round: state.round, from: oldRoomId, to: trans.roomId };
      }
    }
  }
}

function gnomeLabel(id) {
  return String.fromCharCode(65 + id);
}

function shuffle(arr, rng) {
  rng = rng || Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- Simulated catcher (used only to score candidate hiding plans) ---------- */

function simulatedCatcherStep(state, rng) {
  if (state.phase === "investigate") {
    const allowed = investigationsAllowed(state.round);
    const investigatedSet = new Set();
    state.batches.forEach(b => b.roomIds.forEach(id => investigatedSet.add(id)));
    const pool = state.rooms.map(r => r.id).filter(id => !state.rooms[id].searched);
    let fresh = shuffle(pool.filter(id => !investigatedSet.has(id)), rng);
    let chosen = fresh.slice(0, allowed);
    if (chosen.length < allowed) {
      const rest = shuffle(pool.filter(id => !chosen.includes(id)), rng);
      chosen = chosen.concat(rest.slice(0, allowed - chosen.length));
    }
    if (chosen.length === 0) {
      const anyPool = shuffle(state.rooms.map(r => r.id).filter(id => !state.rooms[id].searched), rng);
      chosen = anyPool.slice(0, Math.max(1, allowed));
    }
    applyInvestigation(state, chosen);
    if (state.phase === "gameover") return;
  }
  if (state.phase === "catch") {
    const unsearched = state.rooms.filter(r => !r.searched);
    // Re-sweep fallback: once every room has been searched at least once but
    // Hiders remain uncaught (e.g. the Transfer Power moved someone into an
    // already-cleared room), the Catcher must recheck rooms — prioritize the
    // least-recently/least-often rechecked ones first.
    const pool = unsearched.length > 0 ? unsearched : state.rooms;
    let best = null;
    let bestScore = -1;
    let bestTimesSearched = Infinity;
    for (const r of pool) {
      let score = 0;
      for (const b of state.batches) {
        if (b.roomIds.includes(r.id)) score += b.sum / b.roomIds.length;
      }
      if (unsearched.length === 0) {
        // In re-sweep mode, favor round-robin coverage over heat score.
        if (r.timesSearched < bestTimesSearched || (r.timesSearched === bestTimesSearched && score > bestScore)) {
          bestTimesSearched = r.timesSearched;
          bestScore = score;
          best = r.id;
        }
      } else if (score > bestScore) {
        bestScore = score;
        best = r.id;
      }
    }
    if (best === null) {
      const ids = shuffle(pool.map(r => r.id), rng);
      best = ids[0];
    }
    applySearch(state, best);
  }
}

function runSimulation(setup, rng) {
  const state = createEngineState(setup);
  let guard = 0;
  while (!state.gameOver && guard < 500) {
    simulatedCatcherStep(state, rng);
    guard++;
  }
  return { result: state.result, hpRemaining: Math.max(0, state.catcherHP) };
}

/* ---------- Candidate generation + scoring for initial Hider distribution ---------- */

function randomPartition(total, parts, rng) {
  const sizes = new Array(parts).fill(1);
  let remaining = total - parts;
  while (remaining > 0) {
    const idx = Math.floor(rng() * parts);
    sizes[idx] += 1;
    remaining -= 1;
  }
  return shuffle(sizes, rng);
}

function generateCandidate(rng) {
  const x = 2 + Math.floor(rng() * 4); // 2..5 distinct occupied rooms
  const sizes = randomPartition(NUM_HIDERS, x, rng);
  const allRooms = shuffle([...Array(NUM_ROOMS).keys()], rng);
  const occupiedRooms = allRooms.slice(0, x);
  const trapRoomId = allRooms[Math.floor(rng() * allRooms.length)];
  const hiderRooms = [];
  occupiedRooms.forEach((roomId, idx) => {
    for (let k = 0; k < sizes[idx]; k++) hiderRooms.push(roomId);
  });
  return { hiderRooms, trapRoomId };
}

function scoreCandidate(candidate, rng, numSims) {
  numSims = numSims || 40;
  let losses = 0;
  let totalHpRemaining = 0;
  for (let i = 0; i < numSims; i++) {
    const idx = shuffle([0, 1, 2, 3, 4, 5], rng);
    const items = { invisible: idx[0], transfer: idx[1] };
    const setup = { hiderRooms: candidate.hiderRooms, trapRoomId: candidate.trapRoomId, items };
    const { result, hpRemaining } = runSimulation(setup, rng);
    if (result === "lose") losses += 1;
    totalHpRemaining += hpRemaining;
  }
  const hiderWinRate = losses / numSims;
  const avgHp = totalHpRemaining / numSims;
  return hiderWinRate * 1000 - avgHp;
}

function optimizeDistribution(rng, numCandidates) {
  numCandidates = numCandidates || 15;
  let best = null;
  let bestScore = -Infinity;
  for (let i = 0; i < numCandidates; i++) {
    const candidate = generateCandidate(rng);
    const score = scoreCandidate(candidate, rng);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

/* ---------- Real game wiring ---------- */

let gameState = null;

function addLog(key, args, cls) {
  gameState.__log.push({ key, args: args || [], cls: cls || "", round: gameState.round });
}

function logInvestigation(state, roomIds, sum) {
  addLog("logInvestigationMain", [state.round, roomIds, sum], sum === 0 ? "result-empty" : "");
  if (sum === 0) {
    addLog("logInvestigationEmpty", [roomIds], "result-empty");
  }
}

function logSearch(state, roomId, outcome) {
  if (outcome.type === "hiders") {
    if (outcome.trapHit) {
      addLog("logSearchHidersTrap", [roomId, outcome.count], "result-trap");
    } else {
      addLog("logSearchHidersNoTrap", [roomId, outcome.count], "result-hiders");
    }
    if (outcome.specialCaught && outcome.specialCaught.includes("invisible")) {
      addLog("logSearchCloakCaught", [], "result-hiders");
    }
    if (outcome.specialCaught && outcome.specialCaught.includes("transfer")) {
      addLog("logSearchTransferCaught", [], "result-hiders");
    }
  } else if (outcome.type === "trap") {
    addLog("logSearchTrap", [roomId], "result-trap");
  } else {
    addLog("logSearchEmpty", [roomId], "result-empty");
  }
}

function newGame() {
  const rng = Math.random;
  const candidate = optimizeDistribution(rng);
  const idx = shuffle([0, 1, 2, 3, 4, 5], rng);
  const items = { invisible: idx[0], transfer: idx[1] };
  const setup = { hiderRooms: candidate.hiderRooms, trapRoomId: candidate.trapRoomId, items };
  gameState = createEngineState(setup);
  gameState.__log = [];
  revealRoundIndex = 0;
  addLog("logNewGame", [], "round-sep");
  render();
}

function toggleRoomClick(roomId) {
  if (!gameState || gameState.gameOver) return;
  if (gameState.phase === "investigate") {
    const allowed = investigationsAllowed(gameState.round);
    if (gameState.selected.has(roomId)) {
      gameState.selected.delete(roomId);
    } else {
      if (gameState.selected.size >= allowed) return;
      gameState.selected.add(roomId);
    }
    render();
  } else if (gameState.phase === "catch") {
    // Selecting a hut to search no longer searches immediately — the player
    // must press Confirm Search, so a stray tap can't cost HP by accident.
    if (gameState.selected.has(roomId)) {
      gameState.selected = new Set();
    } else {
      gameState.selected = new Set([roomId]);
    }
    render();
  }
}

function doReveal() {
  if (!gameState || gameState.phase !== "investigate" || gameState.selected.size === 0) return;
  const roomIds = [...gameState.selected];
  applyInvestigation(gameState, roomIds, logInvestigation);
  render();
}

function doConfirmSearch() {
  if (!gameState || gameState.phase !== "catch" || gameState.selected.size !== 1) return;
  const roomId = [...gameState.selected][0];
  gameState.selected = new Set();
  doSearch(roomId);
}

function doSearch(roomId) {
  const completedRound = gameState.round;
  applySearch(gameState, roomId, logSearch);
  if (!gameState.gameOver) {
    addLog("logRoundBegins", [gameState.round], "round-sep");
  }
  render();
  if (!gameState.gameOver && isMobileView()) {
    showRoundRecap(completedRound);
  }
}

/* ---------- End-of-game reveal ---------- */

function buildRevealSummary(state) {
  const entries = [];
  const heading = text => entries.push({ text, cls: "reveal-heading" });
  const line = (text, cls) => entries.push({ text, cls: cls || "" });
  const spacer = () => entries.push({ text: "", cls: "reveal-spacer" });

  heading(t("revealInitialHeading"));
  const roomCounts = {};
  state.setupReveal.hiderInitialRooms.forEach(r => { roomCounts[r] = (roomCounts[r] || 0) + 1; });
  Object.keys(roomCounts).map(Number).sort((a, b) => a - b).forEach(r => {
    line(t("revealHutCount", r, roomCounts[r]));
  });
  line(t("revealTrapStart", state.setupReveal.trapInitialRoomId), "reveal-trap");

  spacer();
  heading(t("revealItemHeading"));
  state.hiders.forEach(h => {
    const startRoom = state.setupReveal.hiderInitialRooms[h.id];
    if (h.item === "invisible") {
      let status;
      if (state.invisibleActivationRound) status = t("cloakActivatedStatus", state.invisibleActivationRound);
      else if (h.caught) status = t("cloakNeverActivatedCaughtStatus");
      else status = t("cloakNeverActivatedStatus");
      line(t("cloakLine", gnomeLabel(h.id), startRoom, status), "reveal-doll");
    }
    if (h.item === "transfer") {
      let status;
      if (state.transferMoveLog) status = t("transferMovedStatus", state.transferMoveLog.from, state.transferMoveLog.to, state.transferMoveLog.round);
      else if (h.caught) status = t("transferNeverUsedCaughtStatus", startRoom);
      else status = t("transferNeverUsedStatus", startRoom);
      line(t("transferLine", gnomeLabel(h.id), startRoom, status), "reveal-doll");
    }
  });

  if (state.result === "lose") {
    const uncaught = state.hiders.filter(h => !h.caught);
    spacer();
    heading(t("neverCaughtHeading"));
    uncaught.forEach(h => {
      const startRoom = state.setupReveal.hiderInitialRooms[h.id];
      const currentRoom = h.roomId;
      const moved = h.item === "transfer" && state.transferMoveLog;
      const movement = moved
        ? t("movedDesc", startRoom, currentRoom, state.transferMoveLog.round)
        : t("stayedDesc", startRoom);
      let itemNote = "";
      if (h.item === "invisible") {
        itemNote = state.invisibleActivationRound
          ? t("itemNoteCloakActivated", state.invisibleActivationRound)
          : t("itemNoteCloakNever");
      } else if (h.item === "transfer") {
        itemNote = moved ? t("itemNoteTransferUsed") : t("itemNoteTransferNever");
      }
      line(t("neverCaughtLine", gnomeLabel(h.id), movement, currentRoom, itemNote), h.item ? "reveal-doll" : "");
    });
  }

  return entries;
}

function buildRoundSnapshots(state) {
  // Replays the game round by round so the reveal can show, for each round,
  // exactly what was on the board (gnome positions, trap position, who'd
  // already been caught) at the moment that round's divination and search
  // happened — plus whatever moved immediately before the round began.
  const maxRound = state.searchLog.length > 0 ? state.searchLog[state.searchLog.length - 1].round : 0;
  const positions = {};
  const invisibleActive = {};
  const caught = {};
  state.hiders.forEach(h => {
    positions[h.id] = state.setupReveal.hiderInitialRooms[h.id];
    invisibleActive[h.id] = false;
    caught[h.id] = false;
  });
  let trapRoomId = state.setupReveal.trapInitialRoomId;
  let trapActive = true;

  const snapshots = [];

  for (let round = 1; round <= maxRound; round++) {
    const startMovements = [];

    state.trapMoveLog.filter(m => m.round === round).forEach(m => {
      trapRoomId = m.to;
      startMovements.push(t("trapMovedDetail", m.from, m.to));
    });

    if (state.transferMoveLog && state.transferMoveLog.round === round) {
      const m = state.transferMoveLog;
      const transHider = state.hiders.find(h => h.item === "transfer");
      positions[transHider.id] = m.to;
      startMovements.push(t("transferUsedMoveDetail", gnomeLabel(transHider.id), m.from, m.to));
    }

    // The cloak only shields its wearer during the single round it's
    // activated in, so recompute this fresh each round rather than letting
    // it stick from an earlier round.
    const invisHiderAll = state.hiders.find(h => h.item === "invisible");
    if (invisHiderAll) invisibleActive[invisHiderAll.id] = (state.invisibleActivationRound === round);

    if (state.invisibleActivationRound === round) {
      startMovements.push(t("cloakActivatedMoveDetail", gnomeLabel(invisHiderAll.id)));
    }

    const gnomes = state.hiders
      .filter(h => !caught[h.id])
      .map(h => ({ id: h.id, roomId: positions[h.id], item: h.item, invisibleActive: invisibleActive[h.id] }));

    const investigation = state.batches.find(b => b.round === round) || null;
    const search = state.searchLog.find(s => s.round === round) || null;
    const caughtHere = search ? gnomes.filter(g => g.roomId === search.roomId) : [];

    snapshots.push({
      round,
      gnomes,
      trapRoomId: trapActive ? trapRoomId : null,
      startMovements,
      investigation,
      search,
      caughtHere,
    });

    if (search) {
      caughtHere.forEach(g => { caught[g.id] = true; });
      if ((search.outcome.type === "hiders" && search.outcome.trapHit) || search.outcome.type === "trap") {
        trapActive = false;
      }
    }
  }

  return snapshots;
}

let revealRoundIndex = 0;

function renderRoundPage(snapshots, idx) {
  const tiles = document.getElementById("round-tiles");
  const details = document.getElementById("round-details");
  const label = document.getElementById("round-viewer-label");
  const prevBtn = document.getElementById("reveal-prev-btn");
  const nextBtn = document.getElementById("reveal-next-btn");
  if (!tiles || !details || !label) return;

  if (snapshots.length === 0) {
    tiles.innerHTML = "";
    details.innerHTML = "";
    label.textContent = t("noRoundsPlayed");
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const snap = snapshots[idx];
  label.textContent = t("roundLabel", snap.round, snapshots.length);
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === snapshots.length - 1;

  const investigatedSet = new Set(snap.investigation ? snap.investigation.roomIds : []);
  const searchedRoomId = snap.search ? snap.search.roomId : null;
  let searchedCls = "";
  if (snap.search) {
    if (snap.search.outcome.type === "hiders") searchedCls = "searched-hiders";
    else if (snap.search.outcome.type === "trap") searchedCls = "searched-trap";
    else searchedCls = "searched-empty";
  }

  tiles.innerHTML = "";
  for (let roomId = 0; roomId < NUM_ROOMS; roomId++) {
    const tile = document.createElement("div");
    tile.className = "round-tile";
    if (investigatedSet.has(roomId)) tile.classList.add("investigated");
    if (roomId === searchedRoomId) tile.classList.add(searchedCls);

    const tileLabel = document.createElement("div");
    tileLabel.className = "tile-label";
    tileLabel.textContent = t("hutLabel", roomId);
    tile.appendChild(tileLabel);

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "tile-dots";
    snap.gnomes.filter(g => g.roomId === roomId).forEach(g => {
      const dot = document.createElement("span");
      dot.className = "tile-dot";
      if (g.item === "invisible") dot.classList.add("dot-invisible");
      else if (g.item === "transfer") dot.classList.add("dot-transfer");
      else dot.classList.add("dot-normal");
      if (g.invisibleActive) dot.classList.add("ghosted");
      dot.title = t("gnomeTooltip", gnomeLabel(g.id));
      dotsWrap.appendChild(dot);
    });
    if (snap.trapRoomId === roomId) {
      const trapMark = document.createElement("span");
      trapMark.className = "tile-trap";
      trapMark.textContent = "🪤";
      trapMark.title = t("trapTooltip");
      dotsWrap.appendChild(trapMark);
    }
    tile.appendChild(dotsWrap);
    tiles.appendChild(tile);
  }

  details.innerHTML = "";
  const addDetail = (text, cls) => {
    const p = document.createElement("p");
    p.textContent = text;
    if (cls) p.className = cls;
    details.appendChild(p);
  };
  const addHeading = text => {
    const h = document.createElement("div");
    h.className = "round-details-heading";
    h.textContent = text;
    details.appendChild(h);
  };

  addHeading(t("beforeRoundHeading"));
  if (snap.startMovements.length === 0) {
    addDetail(t("noMovements"), "result-empty");
  } else {
    snap.startMovements.forEach(txt => addDetail(txt, "reveal-doll"));
  }

  addHeading(t("divinationHeading"));
  if (snap.investigation) {
    addDetail(t("divinationResultDetail", snap.investigation.roomIds, snap.investigation.sum), snap.investigation.sum === 0 ? "result-empty" : "chip-divine");
  } else {
    addDetail(t("noDivinationThisRound"), "result-empty");
  }

  addHeading(t("searchHeading"));
  if (snap.search) {
    const outcome = snap.search.outcome;
    if (outcome.type === "hiders") {
      const labels = snap.caughtHere.map(g => gnomeLabel(g.id)).join(", ");
      const itemNotes = snap.caughtHere.filter(g => g.item).map(g => g.item === "invisible" ? t("itemHolderCloak") : t("itemHolderTransfer"));
      let text = t("searchCaughtDetail", snap.search.roomId, labels, snap.caughtHere.length);
      if (itemNotes.length > 0) text += ` (${itemNotes.join(", ")})`;
      text += outcome.trapHit ? t("trapAlsoHiddenSuffix") : t("noHpLostSuffix");
      addDetail(text, outcome.trapHit ? "result-trap" : "result-hiders");
    } else if (outcome.type === "trap") {
      addDetail(t("searchTrapDetail", snap.search.roomId), "result-trap");
    } else {
      addDetail(t("searchEmptyDetail", snap.search.roomId), "result-empty");
    }
  }
}

/* ---------- Mobile round recap ---------- */

// Keep this breakpoint in sync with the "mobile" media query in style.css.
const MOBILE_BREAKPOINT_QUERY = "(max-width: 860px)";

function isMobileView() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
    : false;
}

function showRoundRecap(round) {
  const modal = document.getElementById("round-recap-modal");
  const heading = document.getElementById("round-recap-heading");
  const list = document.getElementById("round-recap-list");
  if (!modal || !heading || !list) return;

  heading.textContent = t("roundRecapHeading", round);
  list.innerHTML = "";
  gameState.__log
    .filter(entry => entry.round === round && entry.key !== "logRoundBegins" && entry.key !== "logNewGame")
    .forEach(entry => {
      const li = document.createElement("li");
      li.textContent = t(entry.key, ...entry.args);
      if (entry.cls) li.classList.add(entry.cls);
      list.appendChild(li);
    });
  modal.classList.remove("hidden");
}

/* ---------- Rendering ---------- */

function render() {
  const s = gameState;

  const hearts = document.getElementById("hp-hearts");
  hearts.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const span = document.createElement("span");
    span.textContent = "❤";
    if (i >= Math.max(0, s.catcherHP)) span.classList.add("lost");
    hearts.appendChild(span);
  }

  document.getElementById("caught-display").textContent = t("caughtFraction", s.hidersCaught);
  document.getElementById("round-display").textContent = s.round;

  const allowed = investigationsAllowed(s.round);
  const phaseLabel = s.phase === "gameover" ? t("phaseGameOver") : (s.phase === "investigate" ? t("phaseInvestigate") : t("phaseSearching"));
  document.getElementById("phase-display").textContent = phaseLabel;
  document.getElementById("selected-display").textContent = s.phase === "investigate" ? t("selectedFraction", s.selected.size, allowed) : t("selectedFractionDash", allowed);

  const instructions = document.getElementById("instructions");
  if (s.phase === "investigate") {
    instructions.textContent = t("instructionsInvestigate", allowed);
  } else if (s.phase === "catch") {
    instructions.textContent = allowed === 0
      ? t("instructionsSearchNone")
      : t("instructionsSearch");
  } else {
    instructions.textContent = "";
  }

  const grid = document.getElementById("rooms-grid");
  grid.innerHTML = "";
  s.rooms.forEach(room => {
    const el = document.createElement("div");
    el.className = "room";
    if ((s.phase === "investigate" || s.phase === "catch") && s.selected.has(room.id)) el.classList.add("selected");

    const name = document.createElement("div");
    name.className = "room-name";
    name.textContent = t("hutLabel", room.id);
    el.appendChild(name);

    const tag = document.createElement("div");
    tag.className = "room-tag";
    tag.textContent = "";
    el.appendChild(tag);

    el.addEventListener("click", () => toggleRoomClick(room.id));
    grid.appendChild(el);
  });

  const revealBtn = document.getElementById("reveal-btn");
  const searchConfirmBtn = document.getElementById("search-confirm-btn");
  if (s.phase === "investigate") {
    revealBtn.classList.remove("hidden");
    revealBtn.disabled = s.selected.size === 0;
    searchConfirmBtn.classList.add("hidden");
  } else if (s.phase === "catch") {
    revealBtn.classList.add("hidden");
    searchConfirmBtn.classList.remove("hidden");
    searchConfirmBtn.disabled = s.selected.size !== 1;
  } else {
    revealBtn.classList.add("hidden");
    searchConfirmBtn.classList.add("hidden");
  }

  // Newest events first, so the player always sees the latest result without scrolling.
  const logList = document.getElementById("log-list");
  logList.innerHTML = "";
  const reversedLog = s.__log.slice().reverse();
  reversedLog.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = t(entry.key, ...entry.args);
    if (entry.cls) li.classList.add(entry.cls);
    logList.appendChild(li);
  });
  logList.scrollTop = 0;

  // Mobile-only compact strip showing just the latest 3 entries.
  const mobileLogMini = document.getElementById("mobile-log-mini");
  if (mobileLogMini) {
    mobileLogMini.innerHTML = "";
    reversedLog.slice(0, 3).forEach(entry => {
      const li = document.createElement("li");
      li.textContent = t(entry.key, ...entry.args);
      if (entry.cls) li.classList.add(entry.cls);
      mobileLogMini.appendChild(li);
    });
  }

  // Mobile-only full log, opened on demand via the "View Full Event Log"
  // button so the player can still deduce from earlier rounds without the
  // full always-on log panel taking up space on a one-page mobile layout.
  const mobileLogFull = document.getElementById("mobile-log-full-list");
  if (mobileLogFull) {
    mobileLogFull.innerHTML = "";
    reversedLog.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = t(entry.key, ...entry.args);
      if (entry.cls) li.classList.add(entry.cls);
      mobileLogFull.appendChild(li);
    });
  }

  const banner = document.getElementById("banner");
  banner.classList.add("hidden");

  const modal = document.getElementById("game-over-modal");
  if (s.gameOver) {
    modal.classList.remove("hidden");
    const title = document.getElementById("result-title");
    const text = document.getElementById("result-text");
    if (s.result === "win") {
      title.textContent = t("resultWinTitle");
      text.textContent = t("resultWinText", Math.max(0, s.catcherHP));
    } else {
      title.textContent = t("resultLoseTitle");
      text.textContent = t("resultLoseText", s.hidersCaught);
    }
    const revealList = document.getElementById("reveal-summary");
    if (revealList) {
      revealList.innerHTML = "";
      buildRevealSummary(s).forEach(entry => {
        const li = document.createElement("li");
        li.textContent = entry.text;
        if (entry.cls) li.className = entry.cls;
        revealList.appendChild(li);
      });
    }
    gameState.__revealSnapshots = buildRoundSnapshots(s);
    if (revealRoundIndex >= gameState.__revealSnapshots.length) revealRoundIndex = Math.max(0, gameState.__revealSnapshots.length - 1);
    renderRoundPage(gameState.__revealSnapshots, revealRoundIndex);
  } else {
    modal.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let savedLang = null;
  try { savedLang = localStorage.getItem("sorcerersHuntLang"); } catch (e) { /* ignore unavailable storage */ }
  currentLang = savedLang === "zh" ? "zh" : "en";
  applyStaticTranslations();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });

  document.getElementById("reveal-btn").addEventListener("click", doReveal);
  document.getElementById("search-confirm-btn").addEventListener("click", doConfirmSearch);
  document.getElementById("round-recap-continue-btn").addEventListener("click", () => {
    document.getElementById("round-recap-modal").classList.add("hidden");
  });
  document.getElementById("view-full-log-btn").addEventListener("click", () => {
    document.getElementById("mobile-log-modal").classList.remove("hidden");
  });
  document.getElementById("mobile-log-close-btn").addEventListener("click", () => {
    document.getElementById("mobile-log-modal").classList.add("hidden");
  });
  document.getElementById("new-game-btn").addEventListener("click", newGame);
  document.getElementById("reveal-prev-btn").addEventListener("click", () => {
    if (revealRoundIndex > 0) {
      revealRoundIndex--;
      renderRoundPage(gameState.__revealSnapshots, revealRoundIndex);
    }
  });
  document.getElementById("reveal-next-btn").addEventListener("click", () => {
    if (gameState.__revealSnapshots && revealRoundIndex < gameState.__revealSnapshots.length - 1) {
      revealRoundIndex++;
      renderRoundPage(gameState.__revealSnapshots, revealRoundIndex);
    }
  });
  const introModal = document.getElementById("intro-modal");
  document.getElementById("help-btn").addEventListener("click", () => introModal.classList.remove("hidden"));
  document.getElementById("start-intro-btn").addEventListener("click", () => introModal.classList.add("hidden"));
  newGame();
  introModal.classList.remove("hidden");
});
