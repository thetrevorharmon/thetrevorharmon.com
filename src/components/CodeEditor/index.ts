import Lazy from '../Lazy';

export {WELCOME_TO_ZEPHYR} from './constants';

export const CodeEditor = Lazy(() => import('./CodeEditor'));
