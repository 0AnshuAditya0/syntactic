export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c' | 'go' | 'rust';

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

    typescript: `// TypeScript Example
const message: string = "Hello, World!";
console.log(message);

// Try some code
const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);`,

    go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // Try some code
    numbers := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    fmt.Println("Sum:", sum)
}`,

    rust: `fn main() {
    println!("Hello, World!");
    
    // Try some code
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}`,
};

export const languageInfo: Record<Language, { name: string; extension: string; monacoLanguage: string }> = {
    javascript: { name: 'JavaScript', extension: 'js', monacoLanguage: 'javascript' },
    typescript: { name: 'TypeScript', extension: 'ts', monacoLanguage: 'typescript' },
    python: { name: 'Python', extension: 'py', monacoLanguage: 'python' },
    java: { name: 'Java', extension: 'java', monacoLanguage: 'java' },
    cpp: { name: 'C++', extension: 'cpp', monacoLanguage: 'cpp' },
    c: { name: 'C', extension: 'c', monacoLanguage: 'c' },
    go: { name: 'Go', extension: 'go', monacoLanguage: 'go' },
    rust: { name: 'Rust', extension: 'rs', monacoLanguage: 'rust' },
};
