import {create} from 'zustand';
import type {PlayerState, PlayerAction} from '../types';

export interface PlayerStore extends PlayerState {
	setState: (update: Partial<PlayerState>) => void;
	dispatch: (action: PlayerAction) => void;
}

export const usePlayerStore = create<PlayerStore>(
	(
		set: (
			partial: Partial<PlayerStore> | ((state: PlayerStore) => PlayerStore),
		) => void,
	) => ({
		// Initial state
		currentTrack: null,
		isPlaying: false,
		volume: 70,
		speed: 1,
		progress: 0,
		duration: 0,
		queue: [],
		queuePosition: 0,
		repeat: 'off',
		shuffle: false,
		isLoading: false,
		error: null,

		// Set state from WebSocket updates
		setState: (update: Partial<PlayerState>) => {
			set((state: PlayerStore) => ({...state, ...update}));
		},

		// Dispatch actions to be sent to server
		dispatch: (action: PlayerAction) => {
			// This will be handled by the WebSocket connection
			// Store the action to be sent
			console.log('Dispatch action:', action);
		},
	}),
);
