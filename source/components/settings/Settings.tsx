// Settings component
import {useState, useCallback} from 'react';
import {Box, Text} from 'ink';
import {useTheme} from '../../hooks/useTheme.ts';
import {getConfigService} from '../../services/config/config.service.ts';
import {useKeyBinding} from '../../hooks/useKeyboard.ts';
import {KEYBINDINGS} from '../../utils/constants.ts';

const QUALITIES: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

export default function Settings() {
	const {theme} = useTheme();
	const config = getConfigService();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [quality, setQuality] = useState(config.get('streamQuality') || 'high');

	const navigateUp = useCallback(() => {
		setSelectedIndex(prev => Math.max(0, prev - 1));
	}, [setSelectedIndex]);

	const navigateDown = useCallback(() => {
		setSelectedIndex(prev => Math.min(1, prev + 1)); // Only 2 settings for now
	}, [setSelectedIndex]);

	const toggleQuality = useCallback(() => {
		const currentIndex = QUALITIES.indexOf(quality);
		const nextQuality = QUALITIES[(currentIndex + 1) % QUALITIES.length]!;
		setQuality(nextQuality);
		config.set('streamQuality', nextQuality);
	}, [quality, config]);

	useKeyBinding(KEYBINDINGS.UP, navigateUp);
	useKeyBinding(KEYBINDINGS.DOWN, navigateDown);
	useKeyBinding(KEYBINDINGS.SELECT, () => {
		if (selectedIndex === 0) {
			toggleQuality();
		}
	});

	return (
		<Box flexDirection="column" gap={1}>
			<Box
				borderStyle="double"
				borderColor={theme.colors.secondary}
				paddingX={1}
				marginBottom={1}
			>
				<Text bold color={theme.colors.primary}>
					Settings
				</Text>
			</Box>

			{/* Stream Quality */}
			<Box paddingX={1}>
				<Text
					backgroundColor={
						selectedIndex === 0 ? theme.colors.primary : undefined
					}
					color={
						selectedIndex === 0 ? theme.colors.background : theme.colors.text
					}
					bold={selectedIndex === 0}
				>
					Stream Quality: {quality.toUpperCase()}
				</Text>
			</Box>

			{/* Info */}
			<Box marginTop={1}>
				<Text color={theme.colors.dim}>
					Arrows to navigate, Enter to change, Esc to go back
				</Text>
			</Box>
		</Box>
	);
}
