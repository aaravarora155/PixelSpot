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
                // 1. STATIC SERVING (Handles relative paths: css/style.css)
                app.use(project.path, express.static(projectDir, { index: false }));

                // 2. THE SANDBOX & POST FIX
                app.use(project.path, (req, res, next) => {
                    // Fix Views
                    const _render = res.render;
                    res.render = function(view, options, fn) {
                        const viewPath = path.join(projectDir, 'views', view.endsWith('.ejs') ? view : view + '.ejs');
                        return _render.call(this, viewPath, options, fn);
                    };

                    // Fix POST: Force the baseUrl to include the project path
                    // This helps Express match the routes internally
                    const originalUrl = req.url;
                    req.url = req.url === '' ? '/' : req.url;

                    router(req, res, (err) => {
                        req.url = originalUrl;
                        next(err);
                    });
                });

                console.log(`✅ Fully Proxied ${project.path}`);
            }
        } catch (e) {
            console.error(`❌ Failed ${project.path}:`, e.message);
        }
    }
}

// 3. THE "STRAY REQUEST" CATCHER (Fixes CSS with leading slashes)
// Put this AFTER your loadProjects() call
app.use((req, res, next) => {
    const referer = req.get('Referer');
    if (referer) {
        // Find which project the user is currently viewing
        const matchingProject = projects.find(p => referer.includes(p.path));
        if (matchingProject) {
            const projectDir = path.dirname(path.resolve(__dirname, matchingProject.folder));
            // Try to serve the file from that project's directory
            return express.static(projectDir)(req, res, next);
        }
    }
    next();
});

await loadProjects();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => console.log(`🚀 Hub Online: http://localhost:${port}`));