import path from 'path';
import url from 'url';
import fs from 'fs';
import express, { Express, Request, Response, Router, NextFunction } from 'express';
import { RouterError } from '../router-errors';
import { ShowMdServer } from '../server';

export function setUpDefaultRouter(server: ShowMdServer, exp: Express): void {
    
    exp.use((req: Request, res: Response, next: Function) => {
        let href = url.parse(req.url, true).path;
        server.emit('info', 'REQUEST: ' + href);
        next();
    });

    //redirect favicon
    exp.get("/favicon.ico", (req: Request, res: Response, next: Function) => {
        req.url = req.baseUrl + '/resources/favicon.ico';
        console.log('redirected request to', req.url);
    });

    // Add route for public fallback files
    exp.use("/resources", express.static(__dirname + '/../../public'));

    exp.all("/*", (req: Request, res: Response, next: NextFunction) => {
        next(new RouterError(404, 'File not found'));
    });

    exp.use((err: RouterError, req: Request, res: Response, next: NextFunction) => {
        if (err) {
            let errorcode =  err.code ?? 500;
            let errorpath = server.getConfig().getErrorFile(errorcode);
            let data = fs.readFileSync(errorpath, 'utf-8')
            res.status(errorcode).send(server.getParser().mdToHtml(data));
            server.emit("error", "ERROR " + errorcode + ": " + url.parse(req.url, true).path);
        } else {
            next(err);
        }
    });
}