// Current User Profile State
let currentUser = {
  name: "Adarsh (Team Infinite Loop)",
  offers: [
    { name: "JavaScript", level: "Expert" },
    { name: "Python", level: "Intermediate" }
  ],
  wants: [
    { name: "UI Design", level: "Beginner" },
    { name: "Docker", level: "Beginner" }
  ],
  availability: "Weekdays 6 PM - 8 PM",
  hoursTaught: 16,
  hoursLearned: 12
};

// Rich Peer Student Network Database
let peers = [
  {
    id: 1,
    name: "Aman Sharma",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces",
    offers: [{ name: "UI Design", level: "Expert" }],
    wants: [{ name: "JavaScript", level: "Beginner" }],
    availability: "Mon, Wed, Fri (7 PM)",
    rating: 4.9,
    reviews: 18,
    bio: "Product designer eager to learn async JS & DOM logic for prototypes."
  },
  {
    id: 2,
    name: "Pooja Verma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces",
    offers: [{ name: "Docker", level: "Expert" }, { name: "Linux", level: "Intermediate" }],
    wants: [{ name: "Python", level: "Intermediate" }],
    availability: "Weekends 10 AM - 2 PM",
    rating: 5.0,
    reviews: 12,
    bio: "DevOps engineer building microservice pipelines, seeking Python scripts."
  },
  {
    id: 3,
    name: "Rohan Gupta",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=faces",
    offers: [{ name: "React", level: "Expert" }],
    wants: [{ name: "Python", level: "Beginner" }],
    availability: "Tue, Thu 5 PM",
    rating: 4.7,
    reviews: 21,
    bio: "Frontend dev preparing for full-stack API integration."
  },
  {
    id: 4,
    name: "Kavita Rao",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces",
    offers: [{ name: "Cybersecurity", level: "Expert" }],
    wants: [{ name: "React", level: "Beginner" }],
    availability: "Daily 8 PM - 9 PM",
    rating: 4.8,
    reviews: 9,
    bio: "InfoSec specialist securing web apps and tokens."
  },
  {
    id: 5,
    name: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
    offers: [{ name: "Machine Learning", level: "Intermediate" }],
    wants: [{ name: "Docker", level: "Beginner" }],
    availability: "Saturday Full Day",
    rating: 4.6,
    reviews: 5,
    bio: "Data science student aiming to containerize models."
  }
];

// Session Requests (Accept / Decline State)
let sessionRequests = [
  {
    id: 101,
    sender: "Rohan Gupta",
    skillOffer: "React Components",
    skillWanted: "Python Basics",
    proposedTime: "Tomorrow, 5:30 PM",
    status: "Pending"
  },
  {
    id: 102,
    sender: "Aman Sharma",
    skillOffer: "Figma Prototyping",
    skillWanted: "Vanilla JavaScript",
    proposedTime: "Friday, 7:00 PM",
    status: "Pending"
  }
];

// Session History Ledger
let sessionHistory = [
  { peer: "Pooja Verma", topic: "Docker Containers for Python", duration: "1.5 hrs", type: "Mutual", rating: 5.0, status: "Completed" },
  { peer: "Aman Sharma", topic: "JS DOM Manipulation & CSS Flexbox", duration: "2.0 hrs", type: "Mutual", rating: 4.9, status: "Completed" },
  { peer: "Kavita Rao", topic: "CORS & Auth Headers in Web Apps", duration: "1.0 hr", type: "One-Way", rating: 4.8, status: "Completed" }
];

// Campus Market Demand Statistics
const marketSkills = [
  { skill: "JavaScript", offered: 11, wanted: 25 },
  { skill: "UI Design", offered: 6, wanted: 20 },
  { skill: "Docker", offered: 4, wanted: 18 },
  { skill: "Python", offered: 16, wanted: 14 },
  { skill: "Cybersecurity", offered: 3, wanted: 15 }
];

// Navigation Switcher
function switchTab(tabKey) {
  const tabs = ['matches', 'threeway', 'requests', 'history', 'insights', 'profile'];
  tabs.forEach(t => {
    document.getElementById(`sec-${t}`).classList.add('hidden');
    document.getElementById(`tab-${t}`).classList.remove('active-tab');
  });

  document.getElementById(`sec-${tabKey}`).classList.remove('hidden');
  document.getElementById(`tab-${tabKey}`).classList.add('active-tab');

  if (tabKey === 'insights') renderMarketInsights();
  if (tabKey === 'requests') renderSessionRequests();
  if (tabKey === 'history') renderHistoryTable();
}

// Matching Algorithm
function evaluatePair(me, peer) {
  const myOffers = me.offers.map(s => s.name.toLowerCase());
  const myWants = me.wants.map(s => s.name.toLowerCase());

  const peerOffers = peer.offers.map(s => s.name.toLowerCase());
  const peerWants = peer.wants.map(s => s.name.toLowerCase());

  const peerCanTeachMe = peerOffers.filter(s => myWants.includes(s));
  const iCanTeachPeer = myOffers.filter(s => peerWants.includes(s));

  const isMutual = peerCanTeachMe.length > 0 && iCanTeachPeer.length > 0;
  let score = 0;
  let explanation = "";

  if (isMutual) {
    score = 96;
    explanation = `High mutual alignment: You teach them ${iCanTeachPeer.join(', ')} and they teach you ${peerCanTeachMe.join(', ')}.`;
  } else if (peerCanTeachMe.length > 0) {
    score = 65;
    explanation = `One-way fit: ${peer.name} can mentor you in ${peerCanTeachMe.join(', ')}.`;
  } else if (iCanTeachPeer.length > 0) {
    score = 45;
    explanation = `One-way fit: ${peer.name} is seeking your knowledge in ${iCanTeachPeer.join(', ')}.`;
  } else {
    score = 20;
    explanation = "No overlapping skill interest right now.";
  }

  return { score, isMutual, explanation, peerCanTeachMe, iCanTeachPeer };
}

// Peer Card Component
function createPeerCard(peer, matchResult) {
  const scoreBadge = matchResult.score > 80 
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  return `
    <div class="glass-card border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <img src="${peer.avatar}" class="w-12 h-12 rounded-xl object-cover border border-slate-700" alt="${peer.name}">
            <div>
              <h4 class="font-bold text-white text-sm">${peer.name}</h4>
              <div class="flex items-center gap-2 text-xs text-amber-400">
                <span>★ ${peer.rating}</span>
                <span class="text-slate-500 text-[10px]">(${peer.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <span class="skill-tag border ${scoreBadge} font-bold">${matchResult.score}% Match</span>
        </div>

        <p class="text-xs text-slate-400 mb-4 line-clamp-2">${peer.bio}</p>

        <!-- Offering -->
        <div class="mb-3">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teaches</div>
          <div class="flex flex-wrap gap-1">
            ${peer.offers.map(o => `
              <span class="skill-tag bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ${o.name} <span class="ml-1 opacity-75 font-normal">(${o.level})</span>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Wants -->
        <div class="mb-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wants to Learn</div>
          <div class="flex flex-wrap gap-1">
            ${peer.wants.map(w => `
              <span class="skill-tag bg-purple-500/10 text-purple-400 border border-purple-500/20">
                ${w.name} <span class="ml-1 opacity-75 font-normal">(${w.level})</span>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Explanation -->
        <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-4">
          <div class="text-[11px] font-semibold text-slate-300">Match Reason:</div>
          <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${matchResult.explanation}</p>
          <div class="text-[10px] text-slate-500 mt-2">🕒 Available: ${peer.availability}</div>
        </div>
      </div>

      <button onclick="openBooking('${peer.name}')" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-indigo-600/20">
        Request Skill Trade
      </button>
    </div>
  `;
}

// Master Render Loop
function renderAll() {
  const mutualGrid = document.getElementById('mutual-grid');
  const onewayGrid = document.getElementById('oneway-grid');
  mutualGrid.innerHTML = '';
  onewayGrid.innerHTML = '';

  let mutualCount = 0;
  let onewayCount = 0;

  peers.forEach(peer => {
    const match = evaluatePair(currentUser, peer);

    if (match.isMutual) {
      mutualCount++;
      mutualGrid.innerHTML += createPeerCard(peer, match);
    } else if (match.peerCanTeachMe.length > 0) {
      onewayCount++;
      onewayGrid.innerHTML += createPeerCard(peer, match);
    }
  });

  document.getElementById('mutual-count-tag').innerText = `${mutualCount} Perfect Swaps`;
  document.getElementById('match-summary-count').innerText = `${mutualCount} Mutual • ${onewayCount} One-Way Available`;
}

// Render Incoming Requests
function renderSessionRequests() {
  const container = document.getElementById('session-requests-container');
  if (sessionRequests.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 text-xs">No pending requests right now.</div>`;
    document.getElementById('requests-badge').classList.add('hidden');
    return;
  }

  container.innerHTML = sessionRequests.map(req => `
    <div class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-bold text-white text-sm">${req.sender}</h4>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending Proposal</span>
        </div>
        <p class="text-xs text-slate-400">Wants to trade: <strong class="text-emerald-400">${req.skillOffer}</strong> in exchange for your <strong class="text-indigo-400">${req.skillWanted}</strong>.</p>
        <div class="mt-3 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          🕒 Proposed Time: <span class="text-slate-200 font-semibold">${req.proposedTime}</span>
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick="respondRequest(${req.id}, 'Accepted')" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition">
          Accept Trade
        </button>
        <button onclick="respondRequest(${req.id}, 'Declined')" class="px-4 py-2 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 font-semibold rounded-xl text-xs transition">
          Decline
        </button>
      </div>
    </div>
  `).join('');
}

function respondRequest(id, status) {
  const req = sessionRequests.find(r => r.id === id);
  if (status === 'Accepted' && req) {
    sessionHistory.unshift({
      peer: req.sender,
      topic: `${req.skillOffer} ⇄ ${req.skillWanted}`,
      duration: "1.0 hr",
      type: "Mutual",
      rating: 5.0,
      status: "Confirmed"
    });
    currentUser.hoursTaught += 1;
    currentUser.hoursLearned += 1;
    document.getElementById('stat-taught-hrs').innerText = `${currentUser.hoursTaught} hrs`;
    document.getElementById('stat-learned-hrs').innerText = `${currentUser.hoursLearned} hrs`;
  }
  sessionRequests = sessionRequests.filter(r => r.id !== id);
  renderSessionRequests();
  showToast(`Trade Proposal ${status}! Calendar slot synced.`);
}

// Render Session History Table
function renderHistoryTable() {
  const body = document.getElementById('history-table-body');
  body.innerHTML = sessionHistory.map(row => `
    <tr class="hover:bg-slate-900/40 transition">
      <td class="p-4 font-semibold text-white">${row.peer}</td>
      <td class="p-4 text-slate-300">${row.topic}</td>
      <td class="p-4 font-mono text-emerald-400">${row.duration}</td>
      <td class="p-4"><span class="px-2 py-0.5 rounded text-[10px] ${row.type === 'Mutual' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'}">${row.type}</span></td>
      <td class="p-4 text-amber-400 font-bold">★ ${row.rating}</td>
      <td class="p-4"><span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${row.status}</span></td>
    </tr>
  `).join('');
}

// Demand Insights Dashboard
function renderMarketInsights() {
  const container = document.getElementById('insights-container');
  container.innerHTML = marketSkills.map(item => {
    const demandPercent = Math.min(100, Math.round((item.wanted / 25) * 100));
    const supplyPercent = Math.min(100, Math.round((item.offered / 25) * 100));
    const isDeficit = item.wanted > item.offered;

    return `
      <div class="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-bold text-white text-sm">${item.skill}</h4>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDeficit ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
            ${isDeficit ? '🔥 High Demand Deficit' : '⚖ Balanced Supply'}
          </span>
        </div>

        <div class="space-y-2 text-xs">
          <div>
            <div class="flex justify-between text-slate-400 mb-1">
              <span>Learners Demanding:</span>
              <strong class="text-rose-400">${item.wanted} students</strong>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-2">
              <div class="bg-rose-500 h-2 rounded-full" style="width: ${demandPercent}%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-slate-400 mb-1">
              <span>Peers Offering:</span>
              <strong class="text-emerald-400">${item.offered} students</strong>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-2">
              <div class="bg-emerald-400 h-2 rounded-full" style="width: ${supplyPercent}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Search and Filter Function
function filterPeers() {
  const query = document.getElementById('filter-input').value.toLowerCase().trim();
  const level = document.getElementById('level-filter').value;

  const mutualCards = document.getElementById('mutual-grid').children;
  const onewayCards = document.getElementById('oneway-grid').children;

  const filterCards = (cards) => {
    Array.from(cards).forEach(card => {
      const text = card.innerText.toLowerCase();
      const hasQuery = !query || text.includes(query);
      const hasLevel = level === 'all' || text.includes(`(${level.toLowerCase()})`);

      if (hasQuery && hasLevel) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  };

  filterCards(mutualCards);
  filterCards(onewayCards);
}

// Profile Update Handler
function handleProfileUpdate(e) {
  e.preventDefault();
  const name = document.getElementById('inp-name').value;
  const offersStr = document.getElementById('inp-offers').value;
  const wantsStr = document.getElementById('inp-wants').value;
  const avail = document.getElementById('inp-avail').value;

  currentUser.name = name;
  currentUser.availability = avail;

  currentUser.offers = offersStr.split(',').map(item => {
    const [n, l] = item.split(':');
    return { name: (n || '').trim(), level: (l || 'Intermediate').trim() };
  }).filter(s => s.name);

  currentUser.wants = wantsStr.split(',').map(item => {
    const [n, l] = item.split(':');
    return { name: (n || '').trim(), level: (l || 'Beginner').trim() };
  }).filter(s => s.name);

  // Update Header UI
  document.getElementById('user-display-name').innerText = currentUser.name;
  document.getElementById('user-display-avail').innerText = currentUser.availability;
  document.getElementById('user-display-offers').innerText = currentUser.offers.map(o => `${o.name} (${o.level})`).join(', ');
  document.getElementById('user-display-wants').innerText = currentUser.wants.map(w => `${w.name} (${w.level})`).join(', ');

  renderAll();
  showToast("Profile Updated & Compatibility Re-Indexed!");
  switchTab('matches');
}

// Modal Handlers
function openBooking(peerName) {
  document.getElementById('modal-title').innerText = `Trade with ${peerName}`;
  const modal = document.getElementById('booking-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function openReviewModal(peerName) {
  document.getElementById('review-target-name').innerText = `Peer: ${peerName}`;
  const modal = document.getElementById('review-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function confirmBooking() {
  closeModal('booking-modal');
  showToast("Trade Request Pushed! Peer notified.");
}

function submitReview() {
  closeModal('review-modal');
  showToast("Review & Star Rating recorded on blockchain ledger!");
}

function lockThreeWaySwap() {
  showToast("Three-Way Swap Group locked! Calendar slots pushed to all 3 students.");
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

// Initial Run
renderAll();