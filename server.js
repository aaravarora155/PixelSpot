import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
app.set('strict routing', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve root assets (master.css, index.js, etc.)

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

// --- 1. THE STRAY REQUEST FIXER ---
// This handles requests from sub-projects that accidentally hit the root.
// Example: <link href="/css/style.css"> in a project will hit /css/style.css
// Example: <form action="/check"> will hit /check
// This middleware uses the Referer header to route them back to the correct project.
app.use((req, res, next) => {
    const referer = req.get('Referer');
    if (referer) {
        try {
            const refUrl = new URL(referer, `http://${req.get('host')}`);
            const project = projects.find(p => refUrl.pathname.startsWith(p.path));
            
            if (project && !req.url.startsWith(project.path)) {
                // If the request doesn't have the project prefix, we try to route it to the project
                const newPath = path.posix.join(project.path, req.url);
                console.log(`🔀 Redirecting stray request: ${req.url} -> ${newPath} (based on Referer)`);
                req.url = newPath;
            }
        } catch (e) { /* ignore safe */ }
    }
    next();
});

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
                app.use(project.path, express.static(path.join(projectDir, 'public')));

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