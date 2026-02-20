// components/Cargas/CargaFormTabs/TabRota.tsx

import { useState, useRef } from 'react';
import { buscarEnderecoPorCep, formatarCep } from '../../../services/viaCep';
import type { CargaFormData } from '../../../types';
import { SpinnerIcon } from './types';

interface TabRotaProps {
  formData: CargaFormData;
  handleChange: (field: keyof CargaFormData, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<CargaFormData>>;
}

export default function TabRota({ formData, handleChange, setFormData }: TabRotaProps) {
  const [buscandoCepOrigem, setBuscandoCepOrigem] = useState(false);
  const [buscandoCepDestino, setBuscandoCepDestino] = useState(false);
  const origemNumeroRef = useRef<HTMLInputElement>(null);
  const destinoNumeroRef = useRef<HTMLInputElement>(null);

  async function handleCepOrigemChange(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '').slice(0, 8);
    handleChange('origem_cep', cepLimpo);
    console.log('[CEP ORIGEM] valor:', valor, '-> limpo:', cepLimpo, 'len:', cepLimpo.length);

    if (cepLimpo.length === 8) {
      console.log('[CEP ORIGEM] Buscando CEP:', cepLimpo);
      setBuscandoCepOrigem(true);
      const endereco = await buscarEnderecoPorCep(cepLimpo);
      console.log('[CEP ORIGEM] Resultado:', endereco);
      setBuscandoCepOrigem(false);

      if (endereco) {
        setFormData(prev => ({
          ...prev,
          origem_cidade: endereco.cidade,
          origem_uf: endereco.uf,
          origem_bairro: endereco.bairro,
          origem_logradouro: endereco.logradouro
        }));
        setTimeout(() => origemNumeroRef.current?.focus(), 100);
      }
    }
  }

  async function handleCepDestinoChange(valor: string) {
    const cepLimpo = valor.replace(/\D/g, '').slice(0, 8);
    handleChange('destino_cep', cepLimpo);
    console.log('[CEP DESTINO] valor:', valor, '-> limpo:', cepLimpo, 'len:', cepLimpo.length);

    if (cepLimpo.length === 8) {
      console.log('[CEP DESTINO] Buscando CEP:', cepLimpo);
      setBuscandoCepDestino(true);
      const endereco = await buscarEnderecoPorCep(cepLimpo);
      setBuscandoCepDestino(false);

      if (endereco) {
        setFormData(prev => ({
          ...prev,
          destino_cidade: endereco.cidade,
          destino_uf: endereco.uf,
          destino_bairro: endereco.bairro,
          destino_logradouro: endereco.logradouro
        }));
        setTimeout(() => destinoNumeroRef.current?.focus(), 100);
      }
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900">Rota</h3>

      {/* Origem */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-2">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">Origem (Saída)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatarCep(formData.origem_cep || '')}
                onChange={(e) => handleCepOrigemChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="00000-000"
                maxLength={9}
              />
              {buscandoCepOrigem && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <SpinnerIcon />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
            <input
              ref={origemNumeroRef}
              type="text"
              value={formData.origem_numero || ''}
              onChange={(e) => handleChange('origem_numero', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Nº"
              disabled={formData.origem_sem_numero}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
              <input
                type="checkbox"
                checked={formData.origem_sem_numero || false}
                onChange={(e) => {
                  handleChange('origem_sem_numero', e.target.checked);
                  if (e.target.checked) handleChange('origem_numero', 'S/N');
                  else handleChange('origem_numero', '');
                }}
              />
              Sem número
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
            <input
              type="text"
              value={formData.origem_logradouro || ''}
              onChange={(e) => handleChange('origem_logradouro', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Preenchido automaticamente ou digite"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
            <input
              type="text"
              value={formData.origem_bairro || ''}
              onChange={(e) => handleChange('origem_bairro', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Preenchido automaticamente ou digite"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade/UF</label>
            <input
              type="text"
              value={formData.origem_cidade ? `${formData.origem_cidade}/${formData.origem_uf}` : ''}
              onChange={(e) => {
                const val = e.target.value;
                const parts = val.split('/');
                handleChange('origem_cidade', parts[0] || '');
                if (parts[1]) handleChange('origem_uf', parts[1].toUpperCase().slice(0, 2));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cidade/UF"
            />
          </div>
        </div>
      </div>

      {/* Destino */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-100">
        <h4 className="text-sm font-semibold text-green-800 mb-3">Destino (Chegada)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatarCep(formData.destino_cep || '')}
                onChange={(e) => handleCepDestinoChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="00000-000"
                maxLength={9}
              />
              {buscandoCepDestino && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <SpinnerIcon className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
            <input
              ref={destinoNumeroRef}
              type="text"
              value={formData.destino_numero || ''}
              onChange={(e) => handleChange('destino_numero', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Nº"
              disabled={formData.destino_sem_numero}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
              <input
                type="checkbox"
                checked={formData.destino_sem_numero || false}
                onChange={(e) => {
                  handleChange('destino_sem_numero', e.target.checked);
                  if (e.target.checked) handleChange('destino_numero', 'S/N');
                  else handleChange('destino_numero', '');
                }}
              />
              Sem número
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
            <input
              type="text"
              value={formData.destino_logradouro || ''}
              onChange={(e) => handleChange('destino_logradouro', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Preenchido automaticamente ou digite"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
            <input
              type="text"
              value={formData.destino_bairro || ''}
              onChange={(e) => handleChange('destino_bairro', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Preenchido automaticamente ou digite"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade/UF</label>
            <input
              type="text"
              value={formData.destino_cidade ? `${formData.destino_cidade}/${formData.destino_uf}` : ''}
              onChange={(e) => {
                const val = e.target.value;
                const parts = val.split('/');
                handleChange('destino_cidade', parts[0] || '');
                if (parts[1]) handleChange('destino_uf', parts[1].toUpperCase().slice(0, 2));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Cidade/UF"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
