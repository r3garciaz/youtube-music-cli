// Web UI and WebSocket type definitions

import type {PlayerAction, PlayerState} from './player.types.ts';
import type {ImportProgress, ImportResult} from './import.types.ts';

/** WebSocket server message types */
export type ServerMessage =
	| StateUpdateMessage
	| EventMessage
	| ErrorMessage
	| AuthMessage
	| ImportProgressMessage
	| ImportResultMessage;

/** Player state update message */
export interface StateUpdateMessage {
	type: 'state-update';
	state: Partial<PlayerState>;
}

/** Event message for one-time events */
export interface EventMessage {
	type: 'event';
	event:
		| 'connected'
		| 'disconnected'
		| 'client-connected'
		| 'client-disconnected';
	data?: unknown;
}

/** Error message from server */
export interface ErrorMessage {
	type: 'error';
	error: string;
	code?: string;
}

/** Authentication message */
export interface AuthMessage {
	type: 'auth';
	success: boolean;
	message?: string;
}

/** Import progress message */
export interface ImportProgressMessage {
	type: 'import-progress';
	data: ImportProgress;
}

/** Import result message */
export interface ImportResultMessage {
	type: 'import-result';
	data: ImportResult;
}

/** WebSocket client message types */
export type ClientMessage =
	| CommandMessage
	| AuthRequestMessage
	| ImportRequestMessage;

/** Command message from client */
export interface CommandMessage {
	type: 'command';
	action: PlayerAction;
}

/** Authentication request from client */
export interface AuthRequestMessage {
	type: 'auth-request';
	token: string;
}

/** Import request from client */
export interface ImportRequestMessage {
	type: 'import-request';
	source: 'spotify' | 'youtube';
	url: string;
	name?: string;
}

/** WebSocket client information */
export interface WebSocketClient {
	id: string;
	authenticated: boolean;
	connectedAt: number;
	lastHeartbeat: number;
}

/** Web server configuration */
export interface WebServerConfig {
	enabled: boolean;
	host: string;
	port: number;
	enableCors: boolean;
	allowedOrigins: string[];
	auth: {
		enabled: boolean;
		token?: string;
	};
}

/** Web server options for CLI flags */
export interface WebServerOptions {
	enabled: boolean;
	host?: string;
	port?: number;
	webOnly?: boolean;
	auth?: string;
}

/** Server statistics */
export interface ServerStats {
	uptime: number;
	clients: number;
	totalConnections: number;
}
