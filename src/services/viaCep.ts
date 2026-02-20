// services/viaCep.ts - Serviço para busca de endereço por CEP
// Usando cep-promise: consulta múltiplas APIs simultaneamente (ViaCEP, Correios, WideNet, etc.)

import cep from 'cep-promise';

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// Cache para evitar requisições repetidas
const cache: Record<string, EnderecoViaCep | null> = {};

export async function buscarEnderecoPorCep(cepInput: string): Promise<EnderecoViaCep | null> {
  // Remove caracteres não numéricos
  const cepLimpo = cepInput.replace(/\D/g, '');

  // Valida se tem 8 dígitos
  if (cepLimpo.length !== 8) {
    return null;
  }

  // Verifica cache
  if (cache[cepLimpo] !== undefined) {
    return cache[cepLimpo];
  }

  try {
    console.log('[CEP-PROMISE] Buscando:', cepLimpo);

    const data = await cep(cepLimpo);
    console.log('[CEP-PROMISE] Dados encontrados:', data);

    const endereco: EnderecoViaCep = {
      cep: data.cep,
      logradouro: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      uf: data.state
    };

    cache[cepLimpo] = endereco;
    return endereco;
  } catch (error: any) {
    console.error('[CEP-PROMISE] Erro:', error.message || error);
    cache[cepLimpo] = null;
    return null;
  }
}

export function formatarCep(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
