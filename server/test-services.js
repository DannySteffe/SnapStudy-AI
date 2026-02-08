import { parsePDF } from './services/fileParser.js';
import { generateModuleContent } from './services/ai.js';
import dotenv from 'dotenv';

dotenv.config();

// Test the services
async function testServices() {
    console.log('Testing AI service...');
    
    try {
        const testContent = "Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models that enable computers to improve their performance on a specific task through experience.";
        
        const aiResult = await generateModuleContent(testContent);
        console.log('✅ AI service working! Generated:', JSON.stringify(aiResult, null, 2));
    } catch (error) {
        console.error('❌ AI service error:', error.message);
    }

    console.log('\nTesting PDF parsing service...');
    
    try {
        // Test with a minimal buffer (this will fail but should not crash)
        const testBuffer = Buffer.from('test');
        await parsePDF(testBuffer);
    } catch (error) {
        if (error.message.includes('Failed to parse PDF')) {
            console.log('✅ PDF service working! (Expected error for invalid PDF)');
        } else {
            console.error('❌ PDF service error:', error.message);
        }
    }
}

testServices();
