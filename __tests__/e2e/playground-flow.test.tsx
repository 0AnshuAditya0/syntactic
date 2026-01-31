import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Playground from '@/components/playground/index';
import { executeJavaScript } from '@/lib/playground/javascript-executor';

// Mocks
jest.mock('@/components/playground/code-editor-wrapper', () => ({
  CodeEditorWrapper: ({ value, onChange, onRun }: any) => (
    <div data-testid="code-editor">
      <textarea 
        data-testid="mock-editor-textarea"
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      />
      <button data-testid="editor-run-shortcut" onClick={onRun}>Run Shortcut</button>
    </div>
  ),
}));

jest.mock('@/lib/playground/javascript-executor', () => ({
  executeJavaScript: jest.fn(),
}));

jest.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: () => false,
}));

// Mock ResizeObserver for react-resizable-panels
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

describe('Playground Flow E2E (Simulated)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (executeJavaScript as jest.Mock).mockResolvedValue({
      success: true,
      output: 'Hello Test Flow',
      executionTime: 50,
    });
  });

  it('should run code and display output when Run button is clicked', async () => {
    render(<Playground />);

    // Check if key elements are present
    expect(screen.getByText(/Run/i)).toBeInTheDocument();
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();

    // Find Run button (it might be in nav)
    // Assuming the button text is "Run" inside PlaygroundNav
    const runBtn = screen.getByRole('button', { name: /run/i });
    
    // Click Run
    fireEvent.click(runBtn);

    // Verify loading state (optional, might be too fast)
    
    // Verify execution was called
    await waitFor(() => {
      expect(executeJavaScript).toHaveBeenCalled();
    });

    // Verify output is displayed
    // The OutputPanel likely displays the text.
    await waitFor(() => {
      expect(screen.getByText('Hello Test Flow')).toBeInTheDocument();
    });
  });

  it('should handle runtime errors', async () => {
    (executeJavaScript as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Runtime Error: Boom',
      executionTime: 10,
    });

    render(<Playground />);
    
    const runBtn = screen.getByRole('button', { name: /run/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
        expect(screen.getByText('Runtime Error: Boom')).toBeInTheDocument();
    });
  });
});
