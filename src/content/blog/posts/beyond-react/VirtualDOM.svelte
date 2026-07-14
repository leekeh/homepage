<script>
	let prevCount = 0;
	let newCount = 0;
	let realCount = 0;

	let running = false;
	let status = 'Click to simulate clicking a "+1" button inside Counter.';

	let pulseNew = false;
	let diffVisible = false;
	let patchVisible = false;
	let newHighlight = false;
	let realHighlight = false;

	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	async function run() {
		if (running) return;
		running = true;
		const nextCount = prevCount + 1;

		status = 'State changes inside Counter (setState / a hook fires)...';
		await wait(500);

		status = 'React re-renders the component: a brand new virtual tree is built in memory...';
		pulseNew = false;
		await wait(10); // force re-trigger of the pulse animation
		pulseNew = true;
		newCount = nextCount;
		await wait(600);

		status =
			'Diffing new tree against the previous snapshot: Header is identical and skipped, the count text changed...';
		diffVisible = true;
		newHighlight = true;
		await wait(700);

		status = 'Patch computed: "update text node" — Header is never touched at all.';
		patchVisible = true;
		await wait(500);

		status = 'Applying the minimal patch to the real DOM...';
		realHighlight = true;
		realCount = nextCount;
		await wait(700);

		status = 'Done. React only touched 1 of 3 nodes in the real DOM. Click again to repeat.';
		await wait(600);

		// reset for next cycle
		newHighlight = false;
		realHighlight = false;
		diffVisible = false;
		patchVisible = false;
		pulseNew = false;
		prevCount = nextCount;

		running = false;
	}
</script>

<div class="wrap">
	<h2 class="sr-only">
		Interactive diagram of React's virtual DOM rendering pipeline: a state change triggers a new
		virtual tree, which is diffed against the previous one, producing a minimal patch applied to the
		real DOM.
	</h2>

	<svg viewBox="0 0 680 260" role="img">
		<title>React virtual DOM diff and patch pipeline</title>
		<desc>
			Three trees: the previous virtual DOM snapshot, the newly rendered virtual DOM, and the real
			DOM. Clicking the button below simulates a state update.
		</desc>
		<defs>
			<marker
				id="arrow"
				viewBox="0 0 10 10"
				refX="8"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto-start-reverse"
			>
				<path
					d="M2 1L8 5L2 9"
					fill="none"
					stroke="#9c9a92"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</marker>
		</defs>

		<text class="th" x="130" y="30" text-anchor="middle">Previous virtual DOM</text>
		<text class="th" x="340" y="30" text-anchor="middle">New virtual DOM</text>
		<text class="th" x="550" y="30" text-anchor="middle">Real DOM</text>

		<!-- column 1: previous vdom -->
		<g>
			<line x1="130" y1="76" x2="75" y2="110" class="conn" />
			<line x1="130" y1="76" x2="185" y2="110" class="conn" />
			<line x1="185" y1="142" x2="130" y2="170" class="conn" />
			<rect class="box" x="60" y="40" width="140" height="36" rx="6" />
			<text class="t" x="130" y="58" text-anchor="middle" dominant-baseline="central">App</text>
			<rect class="box" x="40" y="110" width="70" height="32" rx="6" />
			<text class="t" x="75" y="126" text-anchor="middle" dominant-baseline="central">Header</text>
			<rect class="box" x="150" y="110" width="70" height="32" rx="6" />
			<text class="t" x="185" y="126" text-anchor="middle" dominant-baseline="central">Counter</text
			>
			<rect class="box" x="80" y="170" width="100" height="32" rx="6" />
			<text class="ts" x="130" y="186" text-anchor="middle" dominant-baseline="central"
				>Count: {prevCount}</text
			>
		</g>

		<text class="ts diff-label" class:visible={diffVisible} x="235" y="122" text-anchor="middle"
			>diff</text
		>
		<line x1="220" y1="126" x2="250" y2="126" class="conn" />

		<!-- column 2: new vdom -->
		<g class:pulse={pulseNew}>
			<line x1="340" y1="76" x2="285" y2="110" class="conn" />
			<line x1="340" y1="76" x2="395" y2="110" class="conn" />
			<line x1="395" y1="142" x2="340" y2="170" class="conn" />
			<rect class="box" x="270" y="40" width="140" height="36" rx="6" />
			<text class="t" x="340" y="58" text-anchor="middle" dominant-baseline="central">App</text>
			<rect class="box" x="250" y="110" width="70" height="32" rx="6" />
			<text class="t" x="285" y="126" text-anchor="middle" dominant-baseline="central">Header</text>
			<rect class="box" class:warn={newHighlight} x="360" y="110" width="70" height="32" rx="6" />
			<text class="t" x="395" y="126" text-anchor="middle" dominant-baseline="central">Counter</text
			>
			<rect class="box" class:warn={newHighlight} x="290" y="170" width="100" height="32" rx="6" />
			<text class="ts" x="340" y="186" text-anchor="middle" dominant-baseline="central"
				>Count: {newCount}</text
			>
		</g>

		<text class="ts patch-label" class:visible={patchVisible} x="445" y="122" text-anchor="middle"
			>patch</text
		>
		<line x1="430" y1="126" x2="460" y2="126" class="conn" />

		<!-- column 3: real dom -->
		<g>
			<line x1="550" y1="76" x2="495" y2="110" class="conn" />
			<line x1="550" y1="76" x2="605" y2="110" class="conn" />
			<line x1="605" y1="142" x2="550" y2="170" class="conn" />
			<rect class="box" x="480" y="40" width="140" height="36" rx="6" />
			<text class="t" x="550" y="58" text-anchor="middle" dominant-baseline="central">App</text>
			<rect class="box" x="460" y="110" width="70" height="32" rx="6" />
			<text class="t" x="495" y="126" text-anchor="middle" dominant-baseline="central">Header</text>
			<rect class="box" x="570" y="110" width="70" height="32" rx="6" />
			<text class="t" x="605" y="126" text-anchor="middle" dominant-baseline="central">Counter</text
			>
			<rect
				class="box"
				class:success={realHighlight}
				x="500"
				y="170"
				width="100"
				height="32"
				rx="6"
			/>
			<text class="ts" x="550" y="186" text-anchor="middle" dominant-baseline="central"
				>Count: {realCount}</text
			>
		</g>

		<text class="ts muted" x="130" y="222" text-anchor="middle">unchanged</text>
		<text class="ts muted" x="550" y="222" text-anchor="middle">only this node is touched</text>
	</svg>

	<div class="controls">
		<button on:click={run} disabled={running}>Trigger state update</button>
	</div>
	<div class="status">{status}</div>
</div>

<style>
	.wrap {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		max-width: 720px;
		margin: 0 auto;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.t {
		font-size: 14px;
		fill: #1a1a1a;
	}

	.th {
		font-size: 14px;
		font-weight: 600;
		fill: #444;
	}

	.ts {
		font-size: 12px;
		fill: #555;
	}

	.ts.muted {
		fill: #999;
	}

	.box {
		fill: #f6f5f1;
		stroke: #d8d6cc;
		stroke-width: 1;
		transition:
			fill 0.2s,
			stroke 0.2s;
	}

	.box.warn {
		fill: #fef3c7;
		stroke: #d97706;
	}

	.box.success {
		fill: #dcfce7;
		stroke: #16a34a;
	}

	.conn {
		stroke: #cfcdc3;
		stroke-width: 1;
		marker-end: url(#arrow);
	}

	.diff-label,
	.patch-label {
		opacity: 0;
		fill: #d97706;
		font-weight: 600;
		transition: opacity 0.2s;
	}

	.diff-label.visible,
	.patch-label.visible {
		opacity: 1;
	}

	@keyframes pulseIn {
		from {
			opacity: 0.25;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.pulse {
		animation: pulseIn 0.4s ease-out;
		transform-origin: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse {
			animation: none;
		}
	}

	.controls {
		margin-top: 12px;
	}

	button {
		background: #2563eb;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 8px 16px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.status {
		font-size: 13px;
		color: #666;
		margin-top: 10px;
		min-height: 18px;
	}
</style>
