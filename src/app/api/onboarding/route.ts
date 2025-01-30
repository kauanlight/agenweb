import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Configuração do transporte de email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Formatar o corpo do email
    const emailBody = `
      Novo Formulário de Onboarding Recebido:

      Tipo de Empresa: ${data.companyType}
      Tamanho da Empresa: ${data.companySize}
      Volume Mensal de Chamadas: ${data.monthlyCallVolume}
      Como nos conheceu: ${data.hearAboutUs}
      ${data.sourceDetails ? `Detalhes da Fonte: ${data.sourceDetails}` : ''}
      
      Caso de Uso:
      ${data.useCase}
    `

    // Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.recipientEmail,
      subject: 'Novo Formulário de Onboarding - AssistPro AI',
      text: emailBody
    })

    return NextResponse.json({ 
      message: 'Formulário enviado com sucesso!' 
    }, { status: 200 })

  } catch (error) {
    console.error('Erro no envio do email:', error)
    return NextResponse.json({ 
      message: 'Erro ao processar o formulário' 
    }, { status: 500 })
  }
}
