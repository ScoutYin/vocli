import type { CAC } from 'cac';

export type Cli = CAC;

export type CommandRegister = (cli: Cli) => void;
