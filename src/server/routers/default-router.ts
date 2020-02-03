import path from 'path';
import url from 'url';
import fs from 'fs';
import { Request, Response, Router, NextFunction } from 'express';
import { RouterError } from '../router-errors';
import { ShowMdServer } from '../server';

export function setUpDefaultRouter(server: ShowMdServer): Router {

    const router: Router = Router();
    
    router.use((req: Request, res: Response, next: Function) => {
        let href = url.parse(req.url, true).path;
        server.emit('info', 'REQUEST: ' + href);
        next();
    });

    // Add route for default favicon
    router.get("/favicon.ico", (req: Request, res: Response, next: NextFunction) => {
        let href = path.join(__dirname, '../../../assets/icons/favicon.ico');
        res.sendFile(href, (err) => {
            if (err) {
                next();
            } else {
                server.emit('info', 'RESPONSE: ' + href);
            }
        });
    });

    // Add route for stylesheets, defined in config.stylesheets
    for(let style of server.getConfig().getDefinedStylesheets()) {
        router.get("/ressources/style/" + style, (req: Request, res: Response, next: NextFunction) => {
            let href: string = server.getConfig().getStylesheetPath(style);
            res.sendFile(href, (err) => {
                if (err) {
                    next();
                } else {
                    server.emit('info', 'RESPONSE: ' + href);
                }
            });
        });
    }

    router.all("/*", (req: Request, res: Response, next: NextFunction) => {
        next(new RouterError(404, 'File not found'));
    });

    router.use((err: RouterError, req: Request, res: Response, next: NextFunction) => {
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

    return router;
}