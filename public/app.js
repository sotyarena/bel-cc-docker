const socket = io();
let state = { teams: [], roundActive: false, buzzerResults: [] };
let myTeamId = localStorage.getItem("quizTeamId");

const $ = id => document.getElementById(id);

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

function createTeam() {
  socket.emit("createTeam", {
    name: $("teamName").value,
    color: $("teamColor").value
  });
}

function joinTeam() {
  const teamId = $("teamSelect").value;
  socket.emit("joinTeam", {
    teamId,
    memberName: $("memberName").value
  });
}

function buzz() {
  if (!state.roundActive) return toast("Ronde belum dimulai.");
  socket.emit("buzz");
}

socket.on("teamCreated", ({ id }) => {
  localStorage.setItem("quizTeamId", id);
  $("teamName").value = "";
  toast("Tim berhasil dibuat. Silakan gabung sebagai peserta.");
});

socket.on("joinedTeam", ({ teamId }) => {
  myTeamId = teamId;
  localStorage.setItem("quizTeamId", teamId);
  $("buzzerArea").classList.remove("hidden");
  toast("Berhasil bergabung ke tim!");
});

socket.on("errorMessage", toast);

socket.on("state", s => {
  state = s;
  render();
});

function render() {
  $("teamSelect").innerHTML = state.teams.length
    ? state.teams.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join("")
    : `<option value="">Belum ada tim</option>`;

  $("teams").innerHTML = state.teams.map(t => `
    <div class="team-card" style="--team:${t.color}">
      <div class="team-dot"></div>
      <div>
        <strong>${escapeHtml(t.name)}</strong>
        <small>${t.members.length} peserta</small>
      </div>
    </div>
  `).join("");

  const myTeam = state.teams.find(t => t.id === myTeamId);
  if (myTeam) {
    $("myTeam").classList.remove("hidden");
    $("myTeam").innerHTML = `Tim Anda: <strong>${escapeHtml(myTeam.name)}</strong> · ${myTeam.members.length} peserta`;
    $("buzzerArea").classList.remove("hidden");
  }

  $("roundStatus").textContent = state.roundActive
    ? "🟢 RONDE AKTIF — Tekan tombol saat ingin menjawab!"
    : "🟡 Menunggu juri memulai ronde...";

  $("buzzButton").disabled = !state.roundActive ||
    state.buzzerResults.some(r => r.teamId === myTeamId);

  if (state.buzzerResults.some(r => r.teamId === myTeamId)) {
    $("buzzButton").textContent = "SUDAH MENEKAN";
  } else {
    $("buzzButton").textContent = "BUZZ!";
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}