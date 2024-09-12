// # Code Generator Page in React

import React, { useState } from 'react';

const CodeGenerator = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('JavaScript');

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const generateCode = () => {
        // Code generation logic can be implemented here
        alert(`Generated ${language} Code: ${code}`);
    };

    return (
        <div>
            <h1>Code Generator</h1>
            <textarea
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter your code here"
                rows="10"
                cols="50"
            />
            <br />
            <select value={language} onChange={handleLanguageChange}>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
            </select>
            <br />
            <button onClick={generateCode}>Generate Code</button>
        </div>
    );
};

export default CodeGenerator;
