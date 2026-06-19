const PAINT_DB_NAME = 'paint-storage';
const PAINT_DB_VERSION = 1;
const PAINT_STORE = 'canvas';
const PAINT_IMAGE_KEY = 'current';
const PAINT_METADATA_KEY = 'paint-canvas-meta';

type PaintMetadata = {
	version: 1;
	width: number;
	height: number;
	updatedAt: number;
	imageType: 'image/png';
};

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
	});
}

async function openPaintDatabase(): Promise<IDBDatabase | null> {
	if (typeof indexedDB === 'undefined') return null;
	try {
		const request = indexedDB.open(PAINT_DB_NAME, PAINT_DB_VERSION);
		request.onupgradeneeded = () => {
			const database = request.result;
			if (!database.objectStoreNames.contains(PAINT_STORE)) {
				database.createObjectStore(PAINT_STORE);
			}
		};
		return await requestToPromise(request);
	} catch {
		return null;
	}
}

async function writeCanvasBlob(blob: Blob): Promise<boolean> {
	const database = await openPaintDatabase();
	if (!database) return false;
	try {
		const transaction = database.transaction(PAINT_STORE, 'readwrite');
		const store = transaction.objectStore(PAINT_STORE);
		await requestToPromise(store.put(blob, PAINT_IMAGE_KEY));
		await new Promise<void>((resolve, reject) => {
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error ?? new Error('Transaction failed'));
			transaction.onabort = () => reject(transaction.error ?? new Error('Transaction aborted'));
		});
		return true;
	} catch {
		return false;
	} finally {
		database.close();
	}
}

async function readCanvasBlob(): Promise<Blob | null> {
	const database = await openPaintDatabase();
	if (!database) return null;
	try {
		const transaction = database.transaction(PAINT_STORE, 'readonly');
		const store = transaction.objectStore(PAINT_STORE);
		const result = await requestToPromise(store.get(PAINT_IMAGE_KEY));
		return result instanceof Blob ? result : null;
	} catch {
		return null;
	} finally {
		database.close();
	}
}

/**
 * Decode a blob into an ImageBitmap with colour-space conversion disabled so
 * the browser does not silently shift pixel values through a colour profile.
 * Falls back to the HTMLImageElement path on very old browsers.
 */
async function blobToImageBitmap(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
	try {
		return await createImageBitmap(blob, { colorSpaceConversion: 'none' });
	} catch {
		// Fallback for browsers that don't support createImageBitmap options.
		return new Promise((resolve, reject) => {
			const image = new Image();
			const objectUrl = URL.createObjectURL(blob);
			image.onload = () => {
				URL.revokeObjectURL(objectUrl);
				resolve(image);
			};
			image.onerror = () => {
				URL.revokeObjectURL(objectUrl);
				reject(new Error('Could not decode image blob'));
			};
			image.src = objectUrl;
		});
	}
}

export async function persistCanvas(canvas: HTMLCanvasElement): Promise<void> {
	const metadata: PaintMetadata = {
		version: 1,
		width: canvas.width,
		height: canvas.height,
		updatedAt: Date.now(),
		imageType: 'image/png'
	};
	localStorage.setItem(PAINT_METADATA_KEY, JSON.stringify(metadata));

	const blob = await new Promise<Blob | null>((resolve) => {
		canvas.toBlob((result) => resolve(result), 'image/png');
	});
	if (blob) await writeCanvasBlob(blob);
}

export async function restoreCanvas(
	ctx: CanvasRenderingContext2D,
	defaultDrawing?: ImageData
): Promise<void> {
	const { width, height } = ctx.canvas;
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, width, height);

	if (defaultDrawing) {
		ctx.putImageData(defaultDrawing, 0, 0);
		await persistCanvas(ctx.canvas);
		return;
	}

	const savedMetadata = localStorage.getItem(PAINT_METADATA_KEY);
	if (!savedMetadata) return;

	try {
		JSON.parse(savedMetadata) as PaintMetadata;
		const savedBlob = await readCanvasBlob();
		if (!savedBlob) return;
		const source = await blobToImageBitmap(savedBlob);
		const prevSmoothing = ctx.imageSmoothingEnabled;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(source, 0, 0, width, height);
		ctx.imageSmoothingEnabled = prevSmoothing;
		if (source instanceof ImageBitmap) source.close();
	} catch {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);
	}
}

export function saveImage(canvas: HTMLCanvasElement, canvasWrap: HTMLDivElement): void {
	const visibleWidth = canvasWrap.clientWidth;
	const visibleHeight = canvasWrap.clientHeight;
	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = visibleWidth;
	tempCanvas.height = visibleHeight;
	const tempCtx = tempCanvas.getContext('2d')!;
	tempCtx.drawImage(canvas, 0, 0, visibleWidth, visibleHeight, 0, 0, visibleWidth, visibleHeight);
	const link = document.createElement('a');
	link.download = 'painting.png';
	link.href = tempCanvas.toDataURL('image/png');
	link.click();
}
