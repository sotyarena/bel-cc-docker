const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const teams = new Map();
let roundActive = false;
let buzzSequence = 0;
let buzzerResults = [];

app.use(express.static(path.join(__dirname, "public")));

function state() {
  return {
    teams: [...teams.values()].map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
      members: t.members
    })),
    roundActive,
    buzzerResults
  };
}

function broadcast() {
  io.emit("state", state());
}

io.on("connection", socket => {
  socket.emit("state", state());

  socket.on("createTeam", ({ name, color }) => {
    name = String(name || "").trim().slice(0, 30);
    if (!name) return socket.emit("errorMessage", "Nama tim wajib diisi.");
    if ([...teams.values()].some(t => t.name.toLowerCase() === name.toLowerCase())) {
      return socket.emit("errorMessage", "Nama tim sudah digunakan.");
    }

    const id = Math.random().toString(36).slice(2, 9);
    teams.set(id, {
      id,
      name,
      color: color || "#2563eb",
      members: [],
      owner: socket.id
    });
    socket.emit("teamCreated", { id });
    broadcast();
  });

  socket.on("joinTeam", ({ teamId, memberName }) => {
    const team = teams.get(teamId);
    memberName = String(memberName || "").trim().slice(0, 30);
    if (!team) return socket.emit("errorMessage", "Tim tidak ditemukan.");
    if (!memberName) return socket.emit("errorMessage", "Nama peserta wajib diisi.");

    const member = { id: socket.id, name: memberName };
    team.members.push(member);
    socket.join(`team:${teamId}`);
    socket.data.teamId = teamId;
    socket.data.memberName = memberName;
    socket.emit("joinedTeam", { teamId });
    broadcast();
  });

  socket.on("buzz", () => {
    if (!roundActive) return;
    const teamId = socket.data.teamId;
    const team = teams.get(teamId);
    if (!team) return;

    if (buzzerResults.some(r => r.teamId === teamId)) return;

    buzzSequence++;
    buzzerResults.push({
      position: buzzSequence,
      teamId,
      teamName: team.name,
      memberName: socket.data.memberName || "Peserta",
      timestamp: Date.now()
    });
    broadcast();
  });

  socket.on("startRound", () => {
    roundActive = true;
    buzzerResults = [];
    buzzSequence = 0;
    broadcast();
  });

  socket.on("resetRound", () => {
    roundActive = false;
    buzzerResults = [];
    buzzSequence = 0;
    broadcast();
  });

  socket.on("removeTeam", ({ teamId }) => {
    teams.delete(teamId);
    buzzerResults = buzzerResults.filter(r => r.teamId !== teamId);
    broadcast();
  });

  socket.on("disconnect", () => {
    // Peserta tetap terdaftar sebagai anggota tim agar tidak hilang saat koneksi singkat.
    broadcast();
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bel Cerdas Cermat berjalan di http://localhost:${PORT}`);
});