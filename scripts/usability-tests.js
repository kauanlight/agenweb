const { chromium } = require('playwright');
const { expect } = require('chai');

async function runVoiceAssistantUsabilityTests() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navegar para a página inicial
    await page.goto('http://localhost:3000');

    // Verificar componente de demonstração de voz
    const voiceDemo = await page.$('.voice-assistant-demo');
    expect(voiceDemo).to.not.be.null;

    // Testar botão de iniciar gravação
    const startRecordingButton = await page.$('button:has-text("Iniciar Gravação")');
    expect(startRecordingButton).to.not.be.null;

    // Testar botão de parar gravação
    const stopRecordingButton = await page.$('button:has-text("Parar Gravação")');
    expect(stopRecordingButton).to.not.be.null;

    // Testar campo de síntese de voz
    const synthesisInput = await page.$('input[placeholder="Digite texto para síntese de voz"]');
    expect(synthesisInput).to.not.be.null;

    // Testar botão de síntese
    const synthesizeButton = await page.$('button:has-text("Sintetizar Voz")');
    expect(synthesizeButton).to.not.be.null;

    // Simular interação com componente
    await synthesisInput.fill('Teste de usabilidade do assistente de voz');
    await synthesizeButton.click();

    // Verificar feedback visual
    const feedbackElement = await page.$('.voice-feedback');
    expect(feedbackElement).to.not.be.null;

    console.log('✅ Testes de usabilidade concluídos com sucesso');
  } catch (error) {
    console.error('❌ Falha nos testes de usabilidade:', error);
  } finally {
    await browser.close();
  }
}

runVoiceAssistantUsabilityTests();
