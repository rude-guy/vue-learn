import { inject } from 'vue';
import { storyKey } from './store';

export const useStore = () => {
  return inject(storyKey);
};
