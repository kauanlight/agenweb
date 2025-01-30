import os
from dotenv import load_dotenv
from openai import OpenAI

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar cliente OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def test_chat():
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "write a haiku about ai"}
            ]
        )
        
        print("Resposta da OpenAI:")
        print(completion.choices[0].message.content)
        
    except Exception as e:
        print(f"Erro ao chamar a API: {str(e)}")

if __name__ == "__main__":
    test_chat()
