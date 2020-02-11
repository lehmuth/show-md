import path from 'path';
import url from 'url';
import fs from 'fs';
import { Request, Response, Router, NextFunction } from 'express';
import { RouterError } from '../router-errors';
import { ShowMdServer } from '../server';
import { Configuration } from 'src/config/config';

export function setUpDefaultRouter(server: ShowMdServer): Router {

    const router: Router = Router();
    
    router.use((req: Request, res: Response, next: Function) => {
        server.emit('info', 'REQUEST: ' + req.path);
        next();
    });

    // Add route for default favicon
    router.get("/favicon.ico", (req: Request, res: Response, next: NextFunction) => {
        let href = path.join(server.getConfig().getPath(Configuration.PATH_ASSETS), 'icons/favicon.ico');
        res.sendFile(href, (err) => {
            if (err) {
                next();
            } else {
                server.emit('info', 'RESPONSE: ' + href);
            }
        });
    });

    // Add route for stylesheets, defined in config.registeredStylesheets
    for(let style of server.getConfig().getRegisteredStylesheets()) {
        router.get("/ressources/style/" + style[0], (req: Request, res: Response, next: NextFunction) => {
            res.sendFile(style[1], (err) => {
                if (err) {
                    next();
                } else {
                    server.emit('info', 'RESPONSE: ' + style[0]);
                }
            });
        });
    }

    // Add route to assets directory
    router.get("/ressources/assets/", (req: Request, res: Response, next: NextFunction) => {
        let href = url.parse(req.url, true).path?.substr("/ressources/assets/".length) || '';
        res.sendFile(href, (err) => {
            if (err) {
                next();
            } else {
                server.emit('info', 'RESPONSE: ' + href);
            }
        });
    });

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