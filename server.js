import express from 'express';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
app.set('strict routing', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

const projects = [
    { path: '/25.1-EJS/', folder: './Assignments/25.1 EJS Tags/index.js' },
    { path: '/28.1-JSON/', folder: './Assignments/28.1 JSON/index.js' },
    { path: '/28.2-Axios/', folder: './Assignments/28.2 Axios/index.js' },
    { path: '/28.3-API-Authentication/', folder: './Assignments/28.3 API Authentication/index.js' },
    { path: '/28.4-REST-APIs/', folder: './Assignments/28.4 REST APIs/index.js' },
    { path: '/30.1-DIY-API/', folder: './Assignments/30.1 DIY API/index.js' },
    { path: '/33.1-PostgreSQL/', folder: './Assignments/33.1 PostgreSQL/index.js' },
    { path: '/33.5-Family-Travel-Tracker/', folder: './Assignments/33.5 Family Travel Tracker/index.js' },

    { path: '/24-Secrets-Project/', folder: './Projects/Secrets Project/index.js' },
    { path: '/25-Band-Generator-Project/', folder: './Projects/Band Generator Project/index.js' },
    { path: '/26-Blog-Application/', folder: './Projects/Blog Website/index.js' },
    { path: '/28-Secrets-Project-2/', folder: './Projects/Secrets Project 2/index.js' },
    { path: '/29-API-Project/', folder: './Projects/Public API Project/index.js' },
    { path: '/30-Blog-API/', folder: './Projects/Blog API Project/index.js' },
    { path: '/31-Permalist-Project/', folder: './Projects/Permalist Project/index.js' },
    { path: '/32-Book-Notes-Project/', folder: './Projects/Book Notes Project/index.js' }
];

// 2. Load projects and sandbox them
async function loadProjects() {
    for (const project of projects) {
        try {
            const absolutePath = path.resolve(__dirname, project.folder);
            const projectDir = path.dirname(absolutePath);
            const fileUrl = pathToFileURL(absolutePath).href;
            const module = await import(fileUrl);
            const router = module.default;

            if (router) {
                // Serve assets for this project specifically
                app.use(project.path, express.static(projectDir));

                app.use(project.path, (req, res, next) => {
                    // SANDBOX EJS: Force the lookup to the sub-folder
                    const _render = res.render;
                    res.render = function(view, options, fn) {
                        const viewPath = path.join(projectDir, 'views', view.endsWith('.ejs') ? view : view + '.ejs');
                        return _render.call(this, viewPath, options, fn);
                    };
                    
                    // NORMALIZE PATH: Strip prefix for the sub-router
                    const originalUrl = req.url;
                    req.url = (req.url === '' || req.url === '/') ? '/' : req.url;
                    
                    router(req, res, (err) => {
                        req.url = originalUrl;
                        next(err);
                    });
                });
            }
        } catch (e) { console.error(e); }
    }
}

await loadProjects();

// --- 2. THE STRAY REQUEST CATCHER (Fixes CSS & POST routes with leading slashes) ---
// This is a "Global Search" for CSS/Assets that dropped their prefix
app.use((req, res, next) => {
    // Only intercept if the request looks like a file (has a dot)
    if (req.url.includes('.')) {
        for (const project of projects) {
            const projectDir = path.dirname(path.resolve(__dirname, project.folder));
            const potentialPath = path.join(projectDir, req.url);
            
            // Check if the file exists in this project's folder
            if (fs.existsSync(potentialPath)) {
                return res.sendFile(potentialPath);
            }
        }
    }
    next();
});

// --- 3. HUB HOME & ERROR HANDLING ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Global Error Handler to prevent 502 Bad Gateways
app.use((err, req, res, next) => {
    console.error("Critical Hub Error:", err.message);
    res.status(500).send("A project encountered an error. Check the server logs.");
});

app.listen(port, () => console.log(`🚀 Hub Online: http://localhost:${port}`));