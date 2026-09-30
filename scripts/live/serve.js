/**
 * Zero-dependency static server for the published site.
 * Usage: node serve.js [port]
 * Port defaults to 8080. A numeric argument wins over the PORT env var.
 * This file is CommonJS. scripts/live/package.json sets "type": "commonjs"
 * so it still runs inside this repository, whose root package is ESM.
 * The published live branch copies only this file; with no package.json
 * there, Node treats it as CommonJS as well.
 */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};

function parsePort() {
  const arg = process.argv[2];
  const raw = arg !== undefined && arg !== "" ? arg : process.env.PORT;
  if (raw === undefined || raw === "") return 8080;
  if (!/^\d+$/.test(String(raw))) {
    console.error("Port must be a whole number. Usage: node serve.js [port]");
    process.exit(1);
  }
  const port = Number(raw);
  if (port < 1 || port > 65535) {
    console.error("Port must be between 1 and 65535.");
    process.exit(1);
  }
  return port;
}

function isInsideRoot(candidate) {
  const relative = path.relative(ROOT, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function requestFile(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url || "/", "http://localhost").pathname);
  } catch {
    return null;
  }
  const candidate = path.resolve(ROOT, `.${pathname}`);
  if (!isInsideRoot(candidate)) return null;
  return { pathname, filePath: candidate };
}

function hasAssetExtension(pathname) {
  const ext = path.extname(pathname).toLowerCase();
  return ext !== "" && ext !== ".html";
}

function sendFile(res, filePath) {
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

function sendHead(res, filePath) {
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  res.end();
}

function sendText(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function serveIndex(req, res) {
  const indexPath = path.join(ROOT, "index.html");
  fs.stat(indexPath, (err, stat) => {
    if (err || !stat.isFile()) {
      sendText(res, 404, "Not found");
      return;
    }
    if (req.method === "HEAD") {
      sendHead(res, indexPath);
      return;
    }
    sendFile(res, indexPath);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  const target = requestFile(req.url);
  if (!target) {
    sendText(res, 400, "Bad request");
    return;
  }

  fs.stat(target.filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      if (req.method === "HEAD") {
        sendHead(res, target.filePath);
        return;
      }
      sendFile(res, target.filePath);
      return;
    }

    if (!err && stat.isDirectory()) {
      const indexPath = path.join(target.filePath, "index.html");
      fs.stat(indexPath, (indexErr, indexStat) => {
        if (!indexErr && indexStat.isFile()) {
          if (req.method === "HEAD") {
            sendHead(res, indexPath);
            return;
          }
          sendFile(res, indexPath);
          return;
        }
        if (hasAssetExtension(target.pathname)) {
          sendText(res, 404, "Not found");
          return;
        }
        serveIndex(req, res);
      });
      return;
    }

    if (hasAssetExtension(target.pathname)) {
      sendText(res, 404, "Not found");
      return;
    }
    serveIndex(req, res);
  });
});

const port = parsePort();
server.listen(port, () => {
  console.log(`Serving ${ROOT}`);
  console.log(`Open http://localhost:${port}`);
});
