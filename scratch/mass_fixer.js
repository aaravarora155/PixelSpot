import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Web Applications/Hosting';
const dirs = [
    path.join(rootDir, 'Assignments'),
    path.join(rootDir, 'Projects')
];

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const apiKeysToMove = {
    'openuv-4ms52rmk155s4o-io': 'OPENUV_API_KEY',
    '4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT': 'DIY_MASTER_KEY',
    '115e2a63-7d6f-46e5-a77b-df94da607436': 'SECRETS_BEARER_TOKEN',
    '2cc417f9-2f2b-41a7-a323-7a92236abd71': 'SECRETS_API_KEY',
    '': 'PG_CONNECTION_STRING'
};

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    walk(dir, (filePath) => {
        const ext = path.extname(filePath);
        if (ext === '.js' || ext === '.ejs' || ext === '.html') {
            let content = fs.readFileSync(filePath, 'utf8');
            let original = content;

            if (ext === '.js') {
                // Fix redirects
                content = content.replace(/res\.redirect\("\/"\)/g, 'res.redirect("./")');
                content = content.replace(/res\.redirect\('\/'\)/g, "res.redirect('./')");

                // Fix absolute redirects like res.redirect("/check") -> res.redirect("./check")
                content = content.replace(/res\.redirect\("(\/[a-zA-Z0-9_-]+)"\)/g, 'res.redirect(".$1")');
                content = content.replace(/res\.redirect\('(\/[a-zA-Z0-9_-]+)'\)/g, "res.redirect('.$1')");

                // Move API keys to process.env
                for (const [val, envVar] of Object.entries(apiKeysToMove)) {
                    const regex = new RegExp(`(['"])${val}(['"])`, 'g');
                    if (content.match(regex)) {
                        console.log(`🔑 Moving key to ${envVar} in ${filePath}`);
                        content = content.replace(regex, `process.env.${envVar} || $1${val}$2`);
                    }
                }
            }

            if (ext === '.ejs' || ext === '.html') {
                // Fix absolute paths in templates
                content = content.replace(/action=["']\/([a-zA-Z0-9_-]+)["']/g, (match, p1) => {
                    return match.replace('/' + p1, p1);
                });
                content = content.replace(/formaction=["']\/([a-zA-Z0-9_-]+)["']/g, (match, p1) => {
                    return match.replace('/' + p1, p1);
                });
                content = content.replace(/window\.location\.href=['"]\/([a-zA-Z0-9_-]+)['"]/g, (match, p1) => {
                    return match.replace('/' + p1, p1);
                });

                // Fix index.html / index.ejs root links
                content = content.replace(/action=["']\/["']/g, 'action="./"');
                content = content.replace(/formaction=["']\/["']/g, 'formaction="./"');
                content = content.replace(/window\.location\.href=['"]\/['"]/g, "window.location.href='./'");
            }

            if (content !== original) {
                console.log(`✅ Fixed: ${filePath}`);
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    });
});
