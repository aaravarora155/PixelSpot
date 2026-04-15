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

async function loadProjects() {
    for (const project of projects) {
        try {
            const absolutePath = path.resolve(__dirname, project.folder);
            const projectDir = path.dirname(absolutePath);
            const fileUrl = pathToFileURL(absolutePath).href;
            
            const module = await import(fileUrl);
            const router = module.default;

            if (router) {
                // A. STATIC ASSETS: Serve them specifically for the project path
                app.use(project.path, express.static(projectDir, { index: false }));

                // B. THE SANDBOX: Intercepts requests to fix sub-project behavior
                app.use(project.path, (req, res, next) => {
                    // Fix Views: Override res.render so it looks in the sub-folder
                    const _render = res.render;
                    res.render = function(view, options, fn) {
                        const viewPath = path.join(projectDir, 'views', view.endsWith('.ejs') ? view : view + '.ejs');
                        return _render.call(this, viewPath, options, fn);
                    };

                    // Fix Routing: Strip prefix so '/24-Secrets-Project/submit' becomes '/submit'
                    const originalUrl = req.url;
                    req.url = (req.url === '' || req.url === '/') ? '/' : req.url;

                    router(req, res, (err) => {
                        req.url = originalUrl; // Reset for potential next middleware
                        next(err);
                    });
                });
                console.log(`✅ Fully Integrated: ${project.path}`);
            }
        } catch (e) {
            console.error(`❌ Failed ${project.path}:`, e.message);
        }
    }
}

await loadProjects();

// --- 2. THE STRAY REQUEST CATCHER (Fixes CSS & POST routes with leading slashes) ---
app.use((req, res, next) => {
    const referer = req.get('Referer');
    if (referer) {
        const matchingProject = projects.find(p => referer.includes(p.path));
        
        if (matchingProject) {
            const projectDir = path.dirname(path.resolve(__dirname, matchingProject.folder));
            
            // Fix CSS/JS: If the browser asks for "/css/style.css" instead of "/project/css/style.css"
            if (req.method === 'GET' && (req.url.includes('.') || req.url.includes('css'))) {
                return res.sendFile(path.join(projectDir, req.url), (err) => {
                    if (err) next(); // If file not found, continue to 404
                });
            }

            // Fix POST: If a form submits to "/submit" instead of "/project/submit"
            if (req.method === 'POST') {
                // 307 Temporary Redirect preserves the POST body data
                return res.redirect(307, matchingProject.path + req.url);
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