// Web server manager - manages the WebSocket server lifecycle
import type {WebServerConfig, WebServerOptions} from '../../types/web.types.ts';
import type {PlayerState} from '../../types/player.types.ts';
import {getWebSocketServer} from './websocket.server.ts';
import {getWebStreamingService} from './web-streaming.service.ts';
import {getConfigService} from '../config/config.service.ts';
import {getImportService} from '../import/import.service.ts';
import {logger} from '../logger/logger.service.ts';

class WebServerManager {
	private config: WebServerConfig;
	private isRunning = false;
	private cleanupHooks: Array<() => void> = [];

	constructor() {
		// Load config or use defaults
		const configService = getConfigService();
		const savedConfig = configService.get('webServer');

		this.config = savedConfig ?? {
			enabled: false,
			host: 'localhost',
			port: 8080,
			enableCors: true,
			allowedOrigins: ['*'],
			auth: {enabled: false},
		};

		// Save default config if not present
		if (!savedConfig) {
			configService.set('webServer', this.config);
		}
	}

	/**
	 * Start the web server
	 */
	async start(options?: WebServerOptions): Promise<void> {
		if (this.isRunning) {
			logger.warn('WebServerManager', 'Server already running');
			return;
		}

		// Apply CLI options
		const finalConfig = {...this.config};

		if (options) {
			if (options.host !== undefined) {
				finalConfig.host = options.host;
			}
			if (options.port !== undefined) {
				finalConfig.port = options.port;
			}
			if (options.auth !== undefined) {
				finalConfig.auth.enabled = true;
				finalConfig.auth.token = options.auth;
			}
		}

		logger.info('WebServerManager', 'Starting web server', finalConfig);

		try {
			const wsServer = getWebSocketServer();

			// Set up command handler
			const cleanupCommand = this.setupCommandHandler();
			this.cleanupHooks.push(cleanupCommand);

			// Set up import handler
			const cleanupImport = this.setupImportHandler();
			this.cleanupHooks.push(cleanupImport);

			// Start the server
			await wsServer.start({
				config: finalConfig,
				onCommand: this.handleCommand.bind(this),
				onImportRequest: this.handleImportRequest.bind(this),
			});

			this.isRunning = true;

			// Set up graceful shutdown
			this.setupShutdownHooks();
		} catch (error) {
			logger.error('WebServerManager', 'Failed to start server', {
				error: error instanceof Error ? error.message : String(error),
			});
			throw error;
		}
	}

	/**
	 * Stop the web server
	 */
	async stop(): Promise<void> {
		if (!this.isRunning) {
			return;
		}

		logger.info('WebServerManager', 'Stopping web server');

		// Clean up hooks
		for (const cleanup of this.cleanupHooks) {
			cleanup();
		}
		this.cleanupHooks = [];

		// Stop the WebSocket server
		const wsServer = getWebSocketServer();
		await wsServer.stop();

		this.isRunning = false;
	}

	/**
	 * Set up player command handler
	 */
	private setupCommandHandler(): () => void {
		const streamingService = getWebStreamingService();

		const unsubscribe = streamingService.onMessage(message => {
			if (message.type === 'command') {
				this.handleCommand(message.action);
			}
		});

		return unsubscribe;
	}

	/**
	 * Set up import progress handler
	 */
	private setupImportHandler(): () => void {
		const importService = getImportService();
		const streamingService = getWebStreamingService();

		const unsubscribe = importService.onProgress(progress => {
			streamingService.onImportProgress(progress);
		});

		return unsubscribe;
	}

	/**
	 * Handle command from web client
	 */
	private handleCommand(action: unknown): void {
		// This will be handled by the player store
		logger.debug('WebServerManager', 'Received command from client', {action});
	}

	/**
	 * Handle import request from web client
	 */
	private async handleImportRequest(
		source: 'spotify' | 'youtube',
		url: string,
		name?: string,
	): Promise<void> {
		logger.info('WebServerManager', 'Import request from client', {
			source,
			url,
			name,
		});

		try {
			const importService = getImportService();
			await importService.importPlaylist(source, url, name);
		} catch (error) {
			logger.error('WebServerManager', 'Import failed', {
				source,
				url,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	/**
	 * Update player state (call this when player state changes)
	 */
	updateState(state: PlayerState): void {
		if (!this.isRunning) return;

		const streamingService = getWebStreamingService();
		streamingService.onStateChange(state);
	}

	/**
	 * Set up graceful shutdown hooks
	 */
	private setupShutdownHooks(): void {
		const shutdown = async () => {
			await this.stop();
		};

		process.on('beforeExit', shutdown);
		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);

		this.cleanupHooks.push(() => {
			process.off('beforeExit', shutdown);
			process.off('SIGINT', shutdown);
			process.off('SIGTERM', shutdown);
		});
	}

	/**
	 * Check if server is running
	 */
	isServerRunning(): boolean {
		return this.isRunning;
	}

	/**
	 * Get server URL
	 */
	getServerUrl(): string {
		const wsServer = getWebSocketServer();
		return wsServer.getServerUrl();
	}

	/**
	 * Get server statistics
	 */
	getStats(): {
		running: boolean;
		url?: string;
		clients?: number;
	} {
		if (!this.isRunning) {
			return {running: false};
		}

		const streamingService = getWebStreamingService();
		const stats = streamingService.getStats();

		return {
			running: true,
			url: this.getServerUrl(),
			clients: stats.clients,
		};
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<WebServerConfig>): void {
		this.config = {...this.config, ...config};

		const configService = getConfigService();
		configService.set('webServer', this.config);
	}

	/**
	 * Get current configuration
	 */
	getConfig(): WebServerConfig {
		return {...this.config};
	}
}

// Singleton instance
let webServerManagerInstance: WebServerManager | null = null;

export function getWebServerManager(): WebServerManager {
	if (!webServerManagerInstance) {
		webServerManagerInstance = new WebServerManager();
	}
	return webServerManagerInstance;
}
