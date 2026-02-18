// Audio playback service using play-sound
import playSound from 'play-sound';
import {logger} from '../logger/logger.service.ts';

type PlaySoundResult = {kill: () => void};

export type PlayOptions = {
	volume?: number;
};

class PlayerService {
	private static instance: PlayerService;
	private currentSound: PlaySoundResult | null = null;

	private constructor() {}

	static getInstance(): PlayerService {
		if (!PlayerService.instance) {
			PlayerService.instance = new PlayerService();
		}
		return PlayerService.instance;
	}

	async play(url: string): Promise<void> {
		logger.info('PlayerService', 'play() called', {
			urlLength: url.length,
			urlPreview: url.substring(0, 100),
		});

		this.stop();

		// Basic sanitization to prevent shell injection
		// In a production app, we'd use a more robust escaping library
		const sanitizedUrl = url.replace(/[^a-zA-Z0-9:/?&.=_#-]/g, '');

		logger.debug('PlayerService', 'URL sanitized, invoking playSound', {
			originalLength: url.length,
			sanitizedLength: sanitizedUrl.length,
		});

		return new Promise<void>((resolve, reject) => {
			try {
				// @ts-expect-error - play-sound types are not complete
				this.currentSound = playSound().play(sanitizedUrl, (err?: Error) => {
					if (err) {
						logger.error('PlayerService', 'Playback error callback', {
							error: err.message,
							stack: err.stack,
						});
						reject(err);
					} else {
						logger.info('PlayerService', 'Playback completed successfully');
						resolve();
					}
				});
				logger.info('PlayerService', 'playSound().play() invoked, waiting...');
			} catch (error) {
				logger.error('PlayerService', 'Exception in play()', {
					error: error instanceof Error ? error.message : String(error),
					stack: error instanceof Error ? error.stack : undefined,
				});
				reject(error);
			}
		});
	}

	pause(): void {
		if (this.currentSound) {
			// play-sound doesn't support pause, so we stop
			this.stop();
		}
	}

	resume(url: string): void {
		if (!this.currentSound) {
			void this.play(url);
		}
	}

	stop(): void {
		if (this.currentSound) {
			this.currentSound.kill();
			this.currentSound = null;
		}
	}

	setVolume(): void {
		// play-sound doesn't support runtime volume adjustment
		// Volume would need to be handled at the system level
	}
}

export const getPlayerService = (): PlayerService =>
	PlayerService.getInstance();
