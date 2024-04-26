import { persisted } from 'svelte-persisted-store';

export const darkMode = persisted('darkMode', false);
