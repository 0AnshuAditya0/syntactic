export interface PistonExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTime?: number;
}

interface PistonResponse {
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
}

const PISTON_API = 'https://emkc.org/api/v2/piston';

const languageVersions: Record<string, { language: string; version: string }> = {
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    cpp: { language: 'c++', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
};

export async function executePiston(
    code: string,
    language: 'python' | 'java' | 'cpp' | 'c'
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
                version: config.version,
                files: [
                    {
                        name: language === 'python' ? 'main.py' :
                            language === 'java' ? 'Main.java' :
                                language === 'cpp' ? 'main.cpp' : 'main.c',
                        content: code,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`Piston API error: ${response.statusText}`);
        }

        const data: PistonResponse = await response.json();
        const executionTime = Date.now() - startTime;

        return {
            success: data.run.code === 0,
            output: data.run.stdout || data.run.output,
            error: data.run.stderr || undefined,
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
