// components/Cargas/CargaFormTabs/TabVeiculo.tsx

import { useState } from 'react';
import type { CargaFormData } from '../../../types';
import { SpinnerIcon, formatarPlaca } from './types';

interface DadosVeiculo {
  marca: string | null; modelo: string | null; importado: string | null;
  ano: string | null; anoModelo: string | null; cor: string | null;
  cilindrada: string | null; potencia: string | null; combustivel: string | null;
  chassi: string | null; motor: string | null; passageiros: string | null;
  uf: string | null; municipio: string | null;
}

interface TabVeiculoProps {
  formData: CargaFormData;
  handleChange: (field: keyof CargaFormData, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<CargaFormData>>;
}

export default function TabVeiculo({ formData, handleChange, setFormData }: TabVeiculoProps) {
  const [buscandoPlaca, setBuscandoPlaca] = useState(false);
  const [dadosVeiculo, setDadosVeiculo] = useState<DadosVeiculo | null>(null);

  function handlePlacaChange(valor: string) {
    const limpo = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 7);
    handleChange('placa_veiculo', limpo);
    if (limpo.length < 7) {
      setDadosVeiculo(null);
      setFormData(prev => ({ ...prev, veiculo_marca: '', veiculo_modelo: '', veiculo_cor: '', veiculo_ano: '', veiculo_ano_modelo: '', veiculo_importado: '', veiculo_cilindrada: '', veiculo_potencia: '', veiculo_combustivel: '', veiculo_chassi: '', veiculo_motor: '', veiculo_uf: '', veiculo_municipio: '' }));
    }
  }

  async function handlePlacaBlur() {
    const placa = formData.placa_veiculo?.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || '';
    if (placa.length !== 7) return;

    const RAILWAY_URL = 'https://placa-api-railway-production.up.railway.app';

    setBuscandoPlaca(true);
    try {
      console.log(`[PLACA] Consultando Railway: ${RAILWAY_URL}/${placa}`);
      const res = await fetch(`${RAILWAY_URL}/${placa}`, { signal: AbortSignal.timeout(60000) });
      const json = await res.json();
      console.log('[PLACA] Resposta:', json);

      if (json.data) {
        setDadosVeiculo(json.data);
        setFormData(prev => ({
          ...prev,
          veiculo_marca: json.data.marca || '',
          veiculo_modelo: json.data.modelo || '',
          veiculo_cor: json.data.cor || '',
          veiculo_ano: json.data.ano || '',
          veiculo_ano_modelo: json.data.anoModelo || '',
          veiculo_importado: json.data.importado || '',
          veiculo_cilindrada: json.data.cilindrada || '',
          veiculo_potencia: json.data.potencia || '',
          veiculo_combustivel: json.data.combustivel || '',
          veiculo_chassi: json.data.chassi || '',
          veiculo_motor: json.data.motor || '',
          veiculo_uf: json.data.uf || '',
          veiculo_municipio: json.data.municipio || ''
        }));
      } else {
        console.log('[PLACA] Nenhum dado retornado:', json.erros);
        setDadosVeiculo(null);
      }
    } catch (err) {
      console.error('[PLACA] Erro ao consultar:', err);
    } finally {
      setBuscandoPlaca(false);
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900">Veículo</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Placa do veículo</label>
        <div className="relative">
          <input
            type="text"
            value={formatarPlaca(formData.placa_veiculo || '')}
            onChange={(e) => handlePlacaChange(e.target.value)}
            onBlur={handlePlacaBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="XXX-XXXX"
            maxLength={8}
          />
          {buscandoPlaca && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <SpinnerIcon />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Digite a placa e clique fora do campo para buscar os dados do veículo</p>
      </div>

      {dadosVeiculo && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-2 flex items-center gap-2 text-sm text-green-800 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Dados do veículo preenchidos automaticamente
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <input type="text" value={formData.veiculo_marca || ''} onChange={(e) => handleChange('veiculo_marca', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: FIAT" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          <input type="text" value={formData.veiculo_modelo || ''} onChange={(e) => handleChange('veiculo_modelo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: UNO MILLE" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
          <input type="text" value={formData.veiculo_cor || ''} onChange={(e) => handleChange('veiculo_cor', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: Prata" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <input type="text" value={formData.veiculo_ano || ''} onChange={(e) => handleChange('veiculo_ano', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: 2020" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano Modelo</label>
          <input type="text" value={formData.veiculo_ano_modelo || ''} onChange={(e) => handleChange('veiculo_ano_modelo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: 2021" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Combustível</label>
          <input type="text" value={formData.veiculo_combustivel || ''} onChange={(e) => handleChange('veiculo_combustivel', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: Álcool / Gasolina" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Importado</label>
          <input type="text" value={formData.veiculo_importado || ''} onChange={(e) => handleChange('veiculo_importado', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: Não" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cilindrada</label>
          <input type="text" value={formData.veiculo_cilindrada || ''} onChange={(e) => handleChange('veiculo_cilindrada', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: 1598 cc" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Potência</label>
          <input type="text" value={formData.veiculo_potencia || ''} onChange={(e) => handleChange('veiculo_potencia', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: 115 cv" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chassi</label>
          <input type="text" value={formData.veiculo_chassi || ''} onChange={(e) => handleChange('veiculo_chassi', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Chassi" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motor</label>
          <input type="text" value={formData.veiculo_motor || ''} onChange={(e) => handleChange('veiculo_motor', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Motor" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UF / Município</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={formData.veiculo_uf || ''} onChange={(e) => handleChange('veiculo_uf', e.target.value.toUpperCase().slice(0, 2))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="UF" maxLength={2} />
            <input type="text" value={formData.veiculo_municipio || ''} onChange={(e) => handleChange('veiculo_municipio', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Município" />
          </div>
        </div>
      </div>
    </div>
  );
}
