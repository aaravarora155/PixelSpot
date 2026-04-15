import express from 'express';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
app.set('strict routing', false);

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
                // 1. Serve static files (CSS/JS) from the sub-folder
                app.use(project.path, express.static(projectDir));

                // 2. The Fix: Strip the prefix so the assignment thinks it's at '/'
                app.use(project.path, (req, res, next) => {
                    const oldUrl = req.url;
                    // If the URL is empty or just the path, set it to '/'
                    req.url = (req.url === '' || req.url === '/') ? '/' : req.url;
                    
                    // Pass the request to the assignment
                    router(req, res, next);
                });

                console.log(`✅ Loaded ${project.path}`);
            }
        } catch (e) {
            console.error(`❌ Failed ${project.path}:`, e.message);
        }
    }
}

await loadProjects();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => console.log(`🚀 Hub Online: http://localhost:${port}`));