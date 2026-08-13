import { registerAxeSweep } from './helpers';

// axe-core accessibility sweep in the mobile shell (viewport ≤ 768px).
// Covers every widget, treat and published blog route. Not run for no-JS —
// axe audits the enhanced, interactive DOM that real users get.
registerAxeSweep();
