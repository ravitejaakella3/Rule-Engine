# Rule Engine with Abstract Syntax Tree (AST)

## Project Overview
This rule engine uses an Abstract Syntax Tree (AST) to represent, create, combine, and evaluate complex rules based on user-defined conditions. It allows dynamic rule creation, logical combinations of rules (AND/OR), and rule evaluation to check if user data meets specific conditions.

## Features
- **Rule Creation**: Converts rule strings (e.g., `"age > 30 AND department = 'Sales'"`) into AST nodes for efficient evaluation.
- **Rule Combination**: Combines multiple rules to create complex, nested conditions.
- **Rule Evaluation**: Evaluates AST-based rules against user data, returning `true` or `false`.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd RuleEngine
   
2. **Install Dependencies**:
   npm init -y
   npm install mongoose body-parser

3. **Configure MongoBD**:
   Update the MongoDB connection URI in the ruleEgine.js file with your MongoDB url

4. **Run the server**:
   node ruleEngine.js