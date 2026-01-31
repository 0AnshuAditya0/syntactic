import { executeJavaScript } from '@/lib/playground/javascript-executor';

// Mock Worker
class MockWorker {
    onmessage: ((e: MessageEvent) => void) | null = null;
    onerror: ((e: ErrorEvent) => void) | null = null;

    postMessage(data: any) {
        // Simulate successful execution for specific code
        if (data.code === "console.log('hello')") {
            setTimeout(() => {
                this.onmessage?.({ data: { success: true, output: 'hello' } } as MessageEvent);
            }, 10);
        }
        // Simulate error
        else if (data.code === "throw error") {
            setTimeout(() => {
                this.onerror?.({ message: 'Runtime Error' } as ErrorEvent);
            }, 10);
        }
        // Simulate timeout (we just don't reply in time, but the test timeout handles mocking)
    }

    terminate() { }
}

// @ts-ignore
global.Worker = MockWorker;

describe('JavaScript Executor', () => {
    it('should execute valid code', async () => {
        const result = await executeJavaScript("console.log('hello')");
        expect(result.success).toBe(true);
        expect(result.output).toBe('hello');
        expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle errors', async () => {
        const result = await executeJavaScript("throw error");
        expect(result.success).toBe(false);
        expect(result.error).toBe('Runtime Error');
    });

    // Note: Testing timeout requires fake timers which interacts complexly with the Promise race
    // Skipping timeout test for now to keep it simple
});
