import { app, BrowserWindow } from "electron";
import path from "path";
import { ChildProcess, spawn } from "child_process";

let pythonProcess: ChildProcess;
const appPath = app.getAppPath();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile(path.join(appPath, "/dist/vite/index.html"));
}

function startPythonBackend() {
  const isWindows = process.platform === 'win32';
  const executableName = isWindows ? 'main.exe' : 'main';
  const pythonPath = path.join(appPath, "..", "backend", "dist", executableName);

  pythonProcess = spawn(pythonPath, {
    cwd: path.join(appPath, "..", "backend"),
    stdio: "inherit",
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python backend:", err);
  });
}

app.whenReady().then(() => {
  startPythonBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (pythonProcess) pythonProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (pythonProcess) pythonProcess.kill();
});
