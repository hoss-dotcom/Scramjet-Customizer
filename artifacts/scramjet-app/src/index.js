import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { WebSocketServer } from "ws";

import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const publicPath = fileURLToPath(new URL("../public/", import.meta.url));

// Wisp Configuration: Refer to the documentation at https://www.npmjs.com/package/@mercuryworkshop/wisp-js

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
        allow_udp_streams: false,
        hostname_blacklist: [/example\.com/],
        dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const fastify = Fastify({
        serverFactory: (handler) => {
                return createServer()
                        .on("request", (req, res) => {
                                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                                handler(req, res);
                        })
                        .on("upgrade", (req, socket, head) => {
                                if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
                                else if (req.url === "/chat/") chatWss.handleUpgrade(req, socket, head, (ws) => chatWss.emit("connection", ws, req));
                                else socket.end();
                        });
        },
});

fastify.register(fastifyStatic, {
        root: publicPath,
        decorateReply: true,
});

fastify.register(fastifyStatic, {
        root: scramjetPath,
        prefix: "/scram/",
        decorateReply: false,
});

fastify.register(fastifyStatic, {
        root: libcurlPath,
        prefix: "/libcurl/",
        decorateReply: false,
});

fastify.register(fastifyStatic, {
        root: baremuxPath,
        prefix: "/baremux/",
        decorateReply: false,
});

fastify.setNotFoundHandler((res, reply) => {
        return reply.code(404).type("text/html").sendFile("404.html");
});

// ============================
// CHAT WEBSOCKET SERVER
// ============================

const chatWss = new WebSocketServer({ noServer: true });
const chatHistory = [];
const MAX_HISTORY = 50;
const chatClients = new Set();

function broadcastChat(data) {
        const msg = JSON.stringify(data);
        for (const client of chatClients) {
                if (client.readyState === 1) client.send(msg);
        }
}

function broadcastUserCount() {
        broadcastChat({ type: "users", count: chatClients.size });
}

chatWss.on("connection", (ws) => {
        chatClients.add(ws);
        broadcastUserCount();

        ws.on("message", (raw) => {
                let data;
                try { data = JSON.parse(raw.toString()); } catch { return; }

                if (data.type === "join") {
                        ws.username = String(data.username || "Anonymous").slice(0, 24);
                        ws.send(JSON.stringify({ type: "history", messages: chatHistory }));
                        broadcastChat({ type: "system", text: `${ws.username} joined the chat` });
                } else if (data.type === "message") {
                        if (!ws.username) return;
                        const text = String(data.text || "").trim().slice(0, 300);
                        if (!text) return;
                        const entry = {
                                type: "message",
                                username: ws.username,
                                text,
                                timestamp: Date.now(),
                        };
                        chatHistory.push(entry);
                        if (chatHistory.length > MAX_HISTORY) chatHistory.shift();
                        broadcastChat(entry);
                }
        });

        ws.on("close", () => {
                chatClients.delete(ws);
                if (ws.username) {
                        broadcastChat({ type: "system", text: `${ws.username} left the chat` });
                }
                broadcastUserCount();
        });

        ws.on("error", () => {
                chatClients.delete(ws);
                broadcastUserCount();
        });
});

fastify.server.on("listening", () => {
        const address = fastify.server.address();

        // by default we are listening on 0.0.0.0 (every interface)
        // we just need to list a few
        console.log("Listening on:");
        console.log(`\thttp://localhost:${address.port}`);
        console.log(`\thttp://${hostname()}:${address.port}`);
        console.log(
                `\thttp://${
                        address.family === "IPv6" ? `[${address.address}]` : address.address
                }:${address.port}`
        );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
        console.log("SIGTERM signal received: closing HTTP server");
        fastify.close();
        process.exit(0);
}

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

fastify.listen({
        port: port,
        host: "0.0.0.0",
});
