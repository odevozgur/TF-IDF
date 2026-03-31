"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// NLP Bridge Helper
const analyzeSentiment = (text) => {
    return new Promise((resolve, reject) => {
        const pythonPath = path_1.default.join(__dirname, '../../nlp/venv/Scripts/python.exe');
        const scriptPath = path_1.default.join(__dirname, '../../nlp/predict.py');
        const pythonProcess = (0, child_process_1.spawn)(pythonPath, [scriptPath, '--text', text]);
        let result = '';
        let error = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${error}`));
                return;
            }
            try {
                const jsonResult = JSON.parse(result.trim());
                resolve(jsonResult);
            }
            catch (e) {
                reject(new Error(`Failed to parse Python output: ${result}`));
            }
        });
    });
};
// Endpoints
app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    try {
        const analysis = await analyzeSentiment(text);
        res.json({
            success: true,
            data: analysis
        });
    }
    catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map