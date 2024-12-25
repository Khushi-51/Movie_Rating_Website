const http = require("http");
const fs = require("fs");
const qs = require("querystring");

function readUsersFile() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
}

function writeUsersFile(users) {
    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing users file:', err);
    }
}

let users = readUsersFile();

const server = http.createServer((req, res) => {
    let { method } = req;

    if (method == "GET") {
        if (req.url === "/") {
            res.writeHead(302, { 'Location': '/allmovies' });
            res.end();
        } else if (req.url === "/movies") {
            fs.readFile("movies.json", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log(data);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (req.url == "/allmovies") {
            fs.readFile("allmovies.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending allmovies.html file");
                    res.end(data);
                }
            });
        } else if (req.url === "/ratemovie") {
            fs.readFile("ratemovie.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending ratemovie.html file");
                    res.end(data);
                }
            });
        } else if (req.url === "/login") {
            fs.readFile("login.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending login.html file");
                    res.end(data);
                }
            });
        } else if (req.url === "/register") {
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending register.html file");
                    res.end(data);
                }
            });
        } else if (req.url === "/navbar") {
            fs.readFile("navbar.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending navbar.html file");
                    res.end(data);
                }
            });
        } else if (req.url.startsWith("/placeholder.svg")) {
            const params = new URLSearchParams(req.url.split('?')[1]);
            const width = params.get('width') || '100';
            const height = params.get('height') || '100';
            const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#ddd"/>
                <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" dominant-baseline="middle" text-anchor="middle">
                    ${width}x${height}
                </text>
            </svg>`;
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(svg);
        } else {
            console.log(req.url);  
            res.writeHead(404);
            res.end("Not Found");
        }
    } else if (method === "POST") {
        if (req.url === "/ratemovie") {
            console.log("inside /ratemovie route and post request");
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                let readdata = fs.readFileSync("movies.json", "utf-8");
                console.log(readdata);

                if (!readdata) {
                    fs.writeFileSync("movies.json", JSON.stringify([]));
                } else {
                    let jsonData = JSON.parse(readdata);
                    let movies = [...jsonData];
                    console.log(movies);

                    let convertedBody = qs.decode(body);
                    movies.push(convertedBody);
                    console.log(convertedBody);
                    fs.writeFile("movies.json", JSON.stringify(movies), (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("movie rating inserted successfully");
                        }
                    });
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("Rating submitted successfully!");
            });
        } else if (req.url === "/register") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                let readdata = fs.readFileSync("users.json", "utf-8");
                console.log(readdata);

                if (!readdata) {
                    fs.writeFileSync("users.json", JSON.stringify([]));
                } else {
                    let jsonData = JSON.parse(readdata);
                    let users = [...jsonData];
                    console.log(users);

                    let convertedbody = qs.decode(body);
                    users.push(convertedbody);
                    console.log(convertedbody);
                    fs.writeFile("users.json", JSON.stringify(users), (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("userdata inserted successfully");
                        }
                    });
                }

                res.writeHead(302, { 'Location': '/login' });
                res.end();
            });
        } else if (req.url === "/login") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                const { username, password } = qs.decode(body);
                const users = readUsersFile();
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: "Invalid credentials" }));
                }
            });
        } else {
            res.writeHead(404);
            res.end("Not Found in post request");
        }
    }
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});

