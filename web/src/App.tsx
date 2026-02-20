import {useWebSocket} from './hooks/useWebSocket';
import {usePlayerStore, type PlayerStore} from './hooks/usePlayerState';
import NavigationBar from './components/NavigationBar';
import PlayerControls from './components/PlayerControls';
import ProgressBar from './components/ProgressBar';
import QueueList from './components/QueueList';
import type {ServerMessage, ClientMessage, Artist} from './types';

function App() {
	const setState = usePlayerStore((state: PlayerStore) => state.setState);
	const {send, isConnected} = useWebSocket(`ws://${window.location.host}/ws`, {
		onMessage: (message: ServerMessage) => {
			if (message.type === 'state-update' && message.state) {
				setState(message.state);
			}
		},
	});

	// Send command to server
	const sendCommand = (action: ClientMessage['action']) => {
		if (action) {
			send({type: 'command', action});
		}
	};

	const currentTrack = usePlayerStore(
		(state: PlayerStore) => state.currentTrack,
	);
	const isPlaying = usePlayerStore((state: PlayerStore) => state.isPlaying);
	const progress = usePlayerStore((state: PlayerStore) => state.progress);
	const duration = usePlayerStore((state: PlayerStore) => state.duration);
	const queue = usePlayerStore((state: PlayerStore) => state.queue);
	const queuePosition = usePlayerStore(
		(state: PlayerStore) => state.queuePosition,
	);
	const shuffle = usePlayerStore((state: PlayerStore) => state.shuffle);
	const repeat = usePlayerStore((state: PlayerStore) => state.repeat);
	const isLoading = usePlayerStore((state: PlayerStore) => state.isLoading);

	return (
		<div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
			<NavigationBar isConnected={isConnected} />

			<main
				style={{
					flex: 1,
					padding: '2rem',
					maxWidth: '1200px',
					margin: '0 auto',
					width: '100%',
				}}
			>
				{currentTrack ? (
					<div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
						<div>
							<h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>
								{currentTrack.title}
							</h2>
							<p style={{color: 'var(--color-text-dim)'}}>
								{currentTrack.artists.map((a: Artist) => a.name).join(', ')}
							</p>
						</div>

						<ProgressBar
							progress={progress}
							duration={duration}
							onSeek={position => sendCommand({category: 'SEEK', position})}
						/>

						<PlayerControls
							isPlaying={isPlaying}
							isLoading={isLoading}
							shuffle={shuffle}
							repeat={repeat}
							onPlayPause={() =>
								sendCommand({category: isPlaying ? 'PAUSE' : 'RESUME'})
							}
							onNext={() => sendCommand({category: 'NEXT'})}
							onPrevious={() => sendCommand({category: 'PREVIOUS'})}
							onToggleShuffle={() => sendCommand({category: 'TOGGLE_SHUFFLE'})}
							onToggleRepeat={() => sendCommand({category: 'TOGGLE_REPEAT'})}
						/>

						<QueueList
							queue={queue}
							queuePosition={queuePosition}
							onSelectTrack={index =>
								sendCommand({category: 'SET_QUEUE_POSITION', position: index})
							}
							onRemoveTrack={index =>
								sendCommand({category: 'REMOVE_FROM_QUEUE', index})
							}
						/>
					</div>
				) : (
					<div style={{textAlign: 'center', padding: '4rem 0'}}>
						<p style={{color: 'var(--color-text-dim)'}}>
							No track playing. Use the CLI to start playback.
						</p>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
