const {
    app,
    protocol,
    BrowserWindow,
    shell,
    nativeTheme,
} = require("electron");
const path = require("path");
const fs = require("fs");

const isDev = process.env.IS_DEV === "true" || !app.isPackaged;

protocol.registerSchemesAsPrivileged([
    {
        scheme: "app",
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            stream: true,
        },
    },
]);

function registerAppProtocol(distDir) {
    protocol.handle("app", async (request) => {
        try {
            const url = new URL(request.url);
            let p = url.pathname;
            if (process.platform === "win32" && p.startsWith("/"))
                p = p.slice(1);

            let filePath = path.join(distDir, p || "index.html");
            if (
                fs.existsSync(filePath) &&
                fs.statSync(filePath).isDirectory()
            ) {
                filePath = path.join(filePath, "index.html");
            }
            if (!fs.existsSync(filePath)) {
                filePath = path.join(distDir, "index.html");
            }

            const data = fs.readFileSync(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const mime =
                ext === ".html"
                    ? "text/html; charset=utf-8"
                    : ext === ".js"
                    ? "text/javascript; charset=utf-8"
                    : ext === ".mjs"
                    ? "text/javascript; charset=utf-8"
                    : ext === ".css"
                    ? "text/css; charset=utf-8"
                    : ext === ".svg"
                    ? "image/svg+xml"
                    : ext === ".png"
                    ? "image/png"
                    : ext === ".jpg" || ext === ".jpeg"
                    ? "image/jpeg"
                    : ext === ".woff"
                    ? "font/woff"
                    : ext === ".woff2"
                    ? "font/woff2"
                    : "application/octet-stream";

            return new Response(data, { headers: { "Content-Type": mime } });
        } catch (e) {
            console.error("protocol.handle error", e);
            return new Response("Not found", { status: 404 });
        }
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 650,
        minWidth: 900,
        minHeight: 560,
        backgroundColor: "#18181b",
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.cjs"),
            sandbox: true,
        },
    });

    win.webContents.setVisualZoomLevelLimits(1, 1);
    win.webContents.setZoomFactor(1);
    win.setMenu(null);

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });
    win.webContents.on("will-navigate", (e, url) => {
        if (isDev && url.startsWith("http://localhost:5173")) return;
        e.preventDefault();
    });
    win.once("ready-to-show", () => win.show());

    if (isDev) {
        const devUrl =
            process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
        win.loadURL(devUrl);
    } else {
        registerAppProtocol(path.join(__dirname, "../dist"));
        win.loadURL("app://index.html");
    }

    return win;
}

app.disableHardwareAcceleration();

app.whenReady().then(() => {
    nativeTheme.themeSource = "dark";
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
