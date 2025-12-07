export type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'c';

export const templates: Record<Language, string> = {
    javascript: `// JavaScript Example
console.log("Hello, World!");

// Try some code
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);`,

    python: `# Python Example
print("Hello, World!")

# Try some code
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum: {total}")`,

    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try some code
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Try some code
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = accumulate(numbers.begin(), numbers.end(), 0);
    cout << "Sum: " << sum << endl;
    
    return 0;
}`,

    c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Try some code
    int numbers[] = {1, 2, 3, 4, 5};
    int sum = 0;
    int length = sizeof(numbers) / sizeof(numbers[0]);
    
    for (int i = 0; i < length; i++) {
        sum += numbers[i];
    }
    
    printf("Sum: %d\\n", sum);
    
    return 0;
}`,
};

export const languageInfo: Record<Language, { name: string; extension: string; monacoLanguage: string }> = {
    javascript: { name: 'JavaScript', extension: 'js', monacoLanguage: 'javascript' },
    python: { name: 'Python', extension: 'py', monacoLanguage: 'python' },
    java: { name: 'Java', extension: 'java', monacoLanguage: 'java' },
    cpp: { name: 'C++', extension: 'cpp', monacoLanguage: 'cpp' },
    c: { name: 'C', extension: 'c', monacoLanguage: 'c' },
};
