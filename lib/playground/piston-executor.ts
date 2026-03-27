export interface PistonExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTime?: number;
}

interface PistonV1Response {
    ran: boolean;
    language: string;
    version: string;
    output: string;
    stdout: string;
    stderr: string;
    message?: string; // Sometimes returned on error
}

const PISTON_API = 'https://emkc.org/api/v1/piston';

const languageVersions: Record<string, { language: string }> = {
    python: { language: 'python' },
    java: { language: 'java' },
    cpp: { language: 'cpp' },
    c: { language: 'c' },
    typescript: { language: 'typescript' },
    go: { language: 'go' },
    rust: { language: 'rust' },
};

export async function executePiston(
    code: string,
    language: 'python' | 'java' | 'cpp' | 'c' | 'typescript' | 'go' | 'rust'
): Promise<PistonExecutionResult> {
    const startTime = Date.now();

    try {
        const config = languageVersions[language];

        const response = await fetch(`${PISTON_API}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: config.language,
                source: code,
            }),
        });

        if (!response.ok) {
            throw new Error(`Piston API error: ${response.statusText}`);
        }

        const data: PistonV1Response = await response.json();
        const executionTime = Date.now() - startTime;
        
        // If the API rate limits or throws a message
        if (data.message) {
            throw new Error(data.message);
        }

        return {
            success: data.ran && !data.stderr,
            output: data.stdout || data.output || '',
            error: data.stderr || undefined,
            executionTime,
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to execute code';
        return {
            success: false,
            output: '',
            error: errorMessage,
            executionTime: Date.now() - startTime,
        };
    }
}
