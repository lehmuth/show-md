import fs from 'fs';
import path from 'path';
import { Express, Request, Response, NextFunction } from 'express';
import { RouterError } from '../router-errors';
import { ShowMdServer } from '../server';

export function setUpDirectoryRouter(server: ShowMdServer, dir: string, exp: Express): void {

    exp.use((req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        if (filename.indexOf(dir) !== 0) {
            next(new RouterError(403, 'Forbidden!'));
            server.emit('warning', 'Recognized path traversal attack!');
        }
        next();
    });

    exp.get(/.*\.md$/i, (req: Request, res: Response, next: NextFunction) => {
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

    exp.get(/.*\.(jpg|jpeg|png|svg|gif|ico|ttf|eot|woff|css|js)$/i, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        if(fs.existsSync(filename)) {
            res.sendFile(filename, (err) => {
                if(err) {
                    server.emit('error', "while sending a static file " + err);
                }
            });
            server.emit('info', "RESPONSE: " + filename);
        } else {
            next();
        }
    });

    exp.get(/.*\..*/, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path);
        try {
            var stat = fs.statSync(filename);
            if(stat.isFile()) {
                next(new RouterError(403, 'Forbidden file: ' + filename));
                server.emit('warning', 'Forbidden file extension in: ' + filename);
            }
        } catch (err) { 
            // File does not exist 
            next();
        }
    });

    exp.get(/.*(?!\.).*/, (req: Request, res: Response, next: NextFunction) => {
        let filename = path.join(dir, req.path, server.getConfig().getDefaultFile());
        try {
            let data = fs.readFileSync(filename, "utf-8");
            server.getParser().setFilePath(filename);
            res.type('html').send(server.getParser().mdToHtml(data));
            server.emit('info', "RESPONSE: " + filename);
        } catch (err) {
            next();
        }
    });
}