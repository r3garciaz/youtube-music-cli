import {useTheme} from '../hooks/useTheme';

interface Props {
	isConnected: boolean;
}

export default function NavigationBar({isConnected}: Props) {
	const {theme, toggleTheme} = useTheme();

	return (
		<header
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '1rem 2rem',
				borderBottom: '1px solid var(--color-border)',
				backgroundColor: 'var(--color-bg-secondary)',
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
				<div
					style={{
						width: '32px',
						height: '32px',
						background:
							'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
						borderRadius: '8px',
					}}
				/>
				<div>
					<h1 style={{fontSize: '1.125rem', fontWeight: 600}}>
						YouTube Music CLI
					</h1>
					<span
						style={{
							fontSize: '0.75rem',
							color: 'var(--color-text-dim)',
						}}
					>
						Web UI
					</span>
				</div>
			</div>

			<div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem',
						fontSize: '0.875rem',
					}}
				>
					<div
						style={{
							width: '8px',
							height: '8px',
							borderRadius: '50%',
							backgroundColor: isConnected
								? 'var(--color-success)'
								: 'var(--color-error)',
						}}
					/>
					<span style={{color: 'var(--color-text-dim)'}}>
						{isConnected ? 'Connected' : 'Connecting...'}
					</span>
				</div>

				<button
					onClick={toggleTheme}
					style={{
						padding: '0.5rem 1rem',
						borderRadius: '8px',
						backgroundColor: 'var(--color-bg)',
						border: '1px solid var(--color-border)',
						color: 'var(--color-text)',
						fontSize: '0.875rem',
					}}
				>
					{theme === 'dark' ? '☀️' : '🌙'}
				</button>
			</div>
		</header>
	);
}
