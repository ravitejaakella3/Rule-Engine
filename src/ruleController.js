
const Node = require('./models');

// Parse rule string to AST
function parseRuleString(ruleString) {
    // Tokenize the string by splitting spaces, retaining logical operators
    const tokens = ruleString.match(/[^ANDOR]+|AND|OR/g).map(token => token.trim());
    let index = 0;

    function parseExpression() {
        let left = parseTerm();

        // Handle AND/OR operators
        while (index < tokens.length && (tokens[index] === 'AND' || tokens[index] === 'OR')) {
            const operator = tokens[index++];
            const right = parseTerm();
            left = new Node({ type: "operator", value: operator, left, right });
        }
        return left;
    }

    function parseTerm() {
        // Ensure the token is a valid condition or throw an error
        if (index >= tokens.length) {
            throw new Error("Invalid expression format");
        }

        const token = tokens[index++];
        
        // Check if the token is a condition like "age > 30"
        if (token.match(/^[a-zA-Z_]+ [><=] .+$/)) {
            return new Node({ type: "operand", value: token });
        }

        throw new Error("Invalid term format: " + token);
    }

    const ast = parseExpression();
    
    if (index !== tokens.length) {
        throw new Error("Unexpected tokens at end of expression");
    }
    
    return ast;
}




// Create rule: Parses rule string and saves AST in MongoDB
exports.createRule = async (reqBody, res) => {
    const { ruleString } = JSON.parse(reqBody);

    try {
        const ast = parseRuleString(ruleString);
        const savedRule = await Node.create(ast);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Rule created", rule: savedRule }));
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
};

// Combine multiple rules into a single AST
exports.combineRules = async (reqBody, res) => {
    const { rules } = JSON.parse(reqBody);

    try {
        const combinedAst = new Node({ type: "operator", value: "AND" });
        combinedAst.left = parseRuleString(rules[0]);
        combinedAst.right = parseRuleString(rules[1]);

        const savedCombinedRule = await Node.create(combinedAst);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Rules combined", rule: savedCombinedRule }));
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
};

// Evaluate rule against user data
exports.evaluateRule = async (reqBody, res) => {
    const { ruleId, data } = JSON.parse(reqBody);

    try {
        const ast = await Node.findById(ruleId);
        if (!ast) throw new Error("Rule not found");

        const result = evaluate(ast, data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
};

// Evaluate AST
function evaluate(node, data) {
    if (node.type === "operand") {
        const [key, operator, value] = node.value.split(" ");
        const dataValue = data[key];
        switch (operator) {
            case '>': return dataValue > parseFloat(value);
            case '<': return dataValue < parseFloat(value);
            case '=': return dataValue === value.replace(/'/g, '');
            default: throw new Error("Unsupported operator: " + operator);
        }
    } else if (node.type === "operator") {
        const leftEval = evaluate(node.left, data);
        const rightEval = evaluate(node.right, data);
        return node.value === "AND" ? leftEval && rightEval : leftEval || rightEval;
    }
}
