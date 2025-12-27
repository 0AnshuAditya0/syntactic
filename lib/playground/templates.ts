export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c' | 'go' | 'rust';

export const templates: Record<Language, string> = {
    javascript: `// follow me on github www.github.com/0AnshuAditya0
console.log("Hello, World!");
`,

    python: `# follow me on github www.github.com/0AnshuAditya0
print("Hello, World!")`,

    java: `// follow me on github www.github.com/0AnshuAditya0
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

    cpp: `#include <iostream>
using namespace std;
// follow me on github www.github.com/0AnshuAditya0
int main() {
    cout << "Hello, World!" << endl;
    
    return 0;
}`,

    c: `#include <stdio.h>
// follow me on github www.github.com/0AnshuAditya0
int main() {
    printf("Hello, World!\\n");
    
    return 0;
}`,

    typescript: `// follow me on github www.github.com/0AnshuAditya0
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
