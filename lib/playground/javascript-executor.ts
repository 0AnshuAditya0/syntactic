export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTime?: number;
}

export async function executeJavaScript(code: string): Promise<ExecutionResult> {
    return new Promise((resolve) => {
        const startTime = performance.now();
        const worker = new Worker('/workers/javascript-worker.js');
        const id = Math.random().toString(36);

        const timeout = setTimeout(() => {
            worker.terminate();
            resolve({
                success: false,
                output: '',
                error: 'Execution timeout (5 seconds)',
                executionTime: 5000,
            });
        }, 5000);

        worker.onmessage = (e) => {
            clearTimeout(timeout);
            worker.terminate();

            const executionTime = performance.now() - startTime;
            resolve({
                ...e.data,
                executionTime: Math.round(executionTime),
            });
        };

        worker.onerror = (error) => {
            clearTimeout(timeout);
            worker.terminate();

            resolve({
                success: false,
                output: '',
                error: error.message || 'Worker error',
                executionTime: performance.now() - startTime,
            });
        };

        worker.postMessage({ code, id });
    });
}
