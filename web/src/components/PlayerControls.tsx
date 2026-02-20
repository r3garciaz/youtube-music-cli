interface Props {
	isPlaying: boolean;
	isLoading: boolean;
	shuffle: boolean;
	repeat: 'off' | 'all' | 'one';
	onPlayPause: () => void;
	onNext: () => void;
	onPrevious: () => void;
	onToggleShuffle: () => void;
	onToggleRepeat: () => void;
}

export default function PlayerControls({
	isPlaying,
	isLoading,
	shuffle,
	repeat,
	onPlayPause,
	onNext,
	onPrevious,
	onToggleShuffle,
	onToggleRepeat,
}: Props) {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '1rem',
			}}
		>
			<button
				onClick={onToggleShuffle}
				style={{
					padding: '0.75rem',
					borderRadius: '50%',
					backgroundColor: shuffle ? 'var(--color-primary)' : 'transparent',
					color: shuffle ? 'white' : 'var(--color-text)',
					transition: 'all 0.2s',
				}}
				title="Shuffle"
			>
				🔀
			</button>

			<button
				onClick={onPrevious}
				style={{
					padding: '0.75rem',
					borderRadius: '50%',
					backgroundColor: 'var(--color-bg-secondary)',
					color: 'var(--color-text)',
					transition: 'all 0.2s',
				}}
				title="Previous"
			>
				⏮️
			</button>

			<button
				onClick={onPlayPause}
				disabled={isLoading}
				style={{
					width: '56px',
					height: '56px',
					borderRadius: '50%',
					backgroundColor: 'var(--color-primary)',
					color: 'white',
					fontSize: '1.5rem',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: isLoading ? 'not-allowed' : 'pointer',
					opacity: isLoading ? 0.6 : 1,
					transition: 'all 0.2s',
				}}
				title={isPlaying ? 'Pause' : 'Play'}
			>
				{isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
			</button>

			<button
				onClick={onNext}
				style={{
					padding: '0.75rem',
					borderRadius: '50%',
					backgroundColor: 'var(--color-bg-secondary)',
					color: 'var(--color-text)',
					transition: 'all 0.2s',
				}}
				title="Next"
			>
				⏭️
			</button>

			<button
				onClick={onToggleRepeat}
				style={{
					padding: '0.75rem',
					borderRadius: '50%',
					backgroundColor:
						repeat !== 'off' ? 'var(--color-primary)' : 'transparent',
					color: repeat !== 'off' ? 'white' : 'var(--color-text)',
					transition: 'all 0.2s',
					position: 'relative',
				}}
				title={`Repeat: ${repeat.toUpperCase()}`}
			>
				🔁
				{repeat === 'one' && (
					<span
						style={{
							position: 'absolute',
							bottom: '0',
							right: '0',
							fontSize: '0.625rem',
							fontWeight: 'bold',
						}}
					>
						1
					</span>
				)}
			</button>
		</div>
	);
}
