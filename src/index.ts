import { ShowMdApp } from './show-md/app';

export * from './show-md/config';
export * from './show-md/md_parser';
export * from './show-md/server';
export * from './show-md/app';
export * from './show-md/cmd_parser';
export function getDefaultApp(){return new ShowMdApp();}
