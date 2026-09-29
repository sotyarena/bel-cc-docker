const socket = io();
let state = { teams: [], roundActive: false, buzzerResults: [] };

const $ = id => document.getElementById(id);

socket.on("state", s => {
  state = s;
  render();
});

function startRound() {
  socket.emit("startRound");
}

function resetRound() {
  socket.emit("resetRound");
}

function render() {
  $("status").textContent = state.roundActive ? "AKTIF" : "BERHENTI";
  $("status").className = state.roundActive ? "active" : "";

  const first = state.buzzerResults[0];
  $("winner").innerHTML = first
    ? `<span class="winner-position">#1</span>
       <strong>${escapeHtml(first.teamName)}</strong>
       <span>${escapeHtml(first.memberName)}</span>`
    : `<span class="muted">Belum ada yang menekan buzzer</span>`;

  $("results").innerHTML = state.buzzerResults.length
    ? state.buzzerResults.map(r => `
      <div class="result-row ${r.position === 1 ? "first" : ""}">
        <span class="position">#${r.position}</span>
        <span class="result-team">${escapeHtml(r.teamName)}</span>
        <span class="result-member">${escapeHtml(r.memberName)}</span>
      </div>
    `).join("")
    : `<div class="empty">Belum ada peserta yang menekan tombol.</div>`;

  $("teams").innerHTML = state.teams.map(t => `
    <div class="team-card" style="--team:${t.color}">
      <div class="team-dot"></div>
      <div><strong>${escapeHtml(t.name)}</strong><small>${t.members.length} peserta</small></div>
    </div>
  `).join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}