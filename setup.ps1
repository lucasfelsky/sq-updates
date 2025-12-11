$folders = @(
    ".github/workflows",
    "src",
    "src/contexts",
    "src/components",
    "src/pages",
    "scripts"
)

$files = @(
    ".gitignore",
    "firebase.json",
    "firestore.rules",
    "package.json",
    "vite.config.js",
    "index.html",
    "src/main.jsx",
    "src/firebase.js",
    "src/App.jsx",
    "src/styles.css",
    "src/contexts/AuthContext.jsx",
    "src/components/ProtectedRoute.jsx",
    "src/components/BarStatusCard.jsx",
    "src/components/AuditLogger.js",
    "src/pages/Login.jsx",
    "src/pages/Register.jsx",
    "src/pages/VerifyEmail.jsx",
    "src/pages/Processes.jsx",
    "src/pages/ProcessDetail.jsx",
    "src/pages/AdminPanel.jsx",
    "scripts/processApprovedPendingUsers.js",
    ".github/workflows/deploy-hosting.yml"
)

# Criar pastas
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
}

# Criar arquivos
foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file
}
