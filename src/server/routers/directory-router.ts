import fs from 'fs';
import path from 'path';
import { Request, Response, Router, NextFunction } from 'express';
import { RouterError } from '../router-errors';
import { ShowMdServer } from '../server';

export function setUpDirectoryRouter(server: ShowMdServer, dir: string): Router {

    const router: Router = Router();

    router.use((req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        if (filename.indexOf(dir) !== 0) {
            next(new RouterError(403, 'Forbidden!'));
            server.emit('warning', 'Recognized path traversal attack!');
        }
        next();
    });

    router.get(/.*\.md$/i, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        try {
            let data = fs.readFileSync(filename, "utf-8");
            server.getParser().setFilePath(filename);
            res.type('html').send(server.getParser().mdToHtml(data));
            server.emit('info', "RESPONSE: " + filename);
        } catch (err) {
            next();
        }
    });

    router.get(/.*\.(jpg|png|gif|ico|ttf|css|js)$/i, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        res.sendFile(filename, (err) => {
            next();
        });
        server.emit('info', "RESPONSE: " + filename);
    });

    router.get(/.*\..*/, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        try {
            var stat = fs.statSync(filename);
            if(stat.isFile()) {
                next(new RouterError(403, 'Forbidden'));
                server.emit('warning', 'Forbidden file extension in: ' + filename);
            }
        } catch (err) { 
            // File does not exist 
            next();
        }
    });

    router.get(/.*(?!\.).*/, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path, server.getConfig().getDefaultFile() || '');
        try {
            let data = fs.readFileSync(filename, "utf-8");
            server.getParser().setFilePath(filename);
            res.type('html').send(server.getParser().mdToHtml(data));
            server.emit('info', "RESPONSE: " + filename);
        } catch (err) {
            next();
        }
    });

    return router;
}