import { persisted } from 'svelte-local-storage-store';

export const darkMode = persisted('darkMode', false);
