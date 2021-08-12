import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

// dealing with CORS - https://github.com/Rob--W/cors-anywhere/issues/301

express()
	// using .bodyPARSER to intercept data in the APPLICATION;
	// https://stackoverflow.com/questions/66659450/getting-body-parser-is-deprecated-warning-in-vs-code-and-not-able-to-get-body-tr
	.use(express.json({ limit: '50mb' }))
	.use(express.urlencoded())

    .use(
        compression({ threshold: 0 }),
        sirv("static", { dev }),
        sapper.middleware()
    )
    .listen(PORT, () => {});