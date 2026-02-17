// Audio playback service using play-sound
import playSound from 'play-sound';

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
		this.stop();

		// Basic sanitization to prevent shell injection
		// In a production app, we'd use a more robust escaping library
		const sanitizedUrl = url.replace(/[^a-zA-Z0-9:/?&.=_#-]/g, '');

		return new Promise<void>((resolve, reject) => {
			// @ts-expect-error - play-sound types are not complete
			this.currentSound = playSound().play(sanitizedUrl, (err?: Error) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
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
